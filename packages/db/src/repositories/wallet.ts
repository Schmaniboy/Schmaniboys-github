import type {
  HoldRecord,
  TokenTransactionRecord,
  TokenTransactionType,
  WalletRepository,
  WalletSnapshot,
} from '@ap/core';

import { Prisma, prisma } from '../client';

/**
 * Guthabenbuchungen.
 *
 * Der heikle Teil ist nicht die Fachlogik, sondern die Gleichzeitigkeit.
 * Zwei Anfragen duerfen nicht beide Guthaben reservieren, wenn es nur fuer
 * eine reicht. Ein Lesen-Pruefen-Schreiben in der Anwendung genuegt dafuer
 * nicht: Zwischen Lesen und Schreiben passt eine zweite Anfrage.
 *
 * Deshalb sind die kritischen Schritte bedingte UPDATEs, die die Pruefung
 * selbst enthalten. Die Datenbank entscheidet, nicht die Anwendung -- und
 * `rowCount` sagt, ob es geklappt hat.
 *
 * Prisma kann in `where` keine Spalte mit einer anderen Spalte vergleichen
 * ("verfuegbar = Guthaben minus reserviert"). Genau diese Stellen laufen
 * deshalb als SQL. Das ist kein Notbehelf, sondern der Punkt: die Bedingung
 * gehoert in dieselbe Anweisung wie die Aenderung.
 */

function toSnapshot(row: {
  id: string;
  userId: string;
  balanceTokens: number;
  reservedTokens: number;
}): WalletSnapshot {
  return {
    id: row.id,
    userId: row.userId,
    balanceTokens: row.balanceTokens,
    reservedTokens: row.reservedTokens,
    availableTokens: row.balanceTokens - row.reservedTokens,
  };
}

function toTransaction(row: {
  id: string;
  type: string;
  amountTokens: number;
  balanceAfter: number;
  purpose: string;
  reference: string;
  createdAt: Date;
}): TokenTransactionRecord {
  return {
    id: row.id,
    type: row.type as TokenTransactionType,
    amountTokens: row.amountTokens,
    balanceAfter: row.balanceAfter,
    purpose: row.purpose,
    reference: row.reference,
    createdAt: row.createdAt,
  };
}

function toHold(row: {
  id: string;
  amountTokens: number;
  status: string;
  purpose: string;
  reference: string;
  expiresAt: Date;
}): HoldRecord {
  return {
    id: row.id,
    amountTokens: row.amountTokens,
    status: row.status as HoldRecord['status'],
    purpose: row.purpose,
    reference: row.reference,
    expiresAt: row.expiresAt,
  };
}

export class PrismaWalletRepository implements WalletRepository {
  async ensureWallet(userId: string): Promise<WalletSnapshot> {
    const row = await prisma.wallet.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });
    return toSnapshot(row);
  }

  async findWallet(userId: string): Promise<WalletSnapshot | null> {
    const row = await prisma.wallet.findUnique({ where: { userId } });
    return row ? toSnapshot(row) : null;
  }

  async reserve(input: {
    userId: string;
    amountTokens: number;
    purpose: string;
    reference: string;
    expiresAt: Date;
  }): Promise<HoldRecord | null> {
    await this.ensureWallet(input.userId);

    try {
      return await prisma.$transaction(async (tx) => {
        /*
         * Bedingtes UPDATE: Es aendert nur dann etwas, wenn genug verfuegbar
         * ist. Zwei gleichzeitige Anfragen koennen so nicht beide gewinnen --
         * die zweite sieht den bereits erhoehten Reservierungsstand.
         */
        const geaendert = await tx.$executeRaw`
          UPDATE "Wallet"
          SET "reservedTokens" = "reservedTokens" + ${input.amountTokens},
              "updatedAt" = NOW()
          WHERE "userId" = ${input.userId}
            AND "balanceTokens" - "reservedTokens" >= ${input.amountTokens}
        `;

        if (geaendert !== 1) return null;

        const hold = await tx.tokenHold.create({
          data: {
            wallet: { connect: { userId: input.userId } },
            amountTokens: input.amountTokens,
            purpose: input.purpose,
            reference: input.reference,
            expiresAt: input.expiresAt,
          },
        });

        return toHold(hold);
      });
    } catch (error) {
      // Dieselbe Kennung ist bereits reserviert -- ein doppelter Aufruf.
      // Die Transaktion wurde zurueckgerollt, das Guthaben ist unberuehrt.
      if (istEindeutigkeitsfehler(error)) return null;
      throw error;
    }
  }

  async capture(reference: string, actorId: string | null): Promise<TokenTransactionRecord> {
    return prisma.$transaction(async (tx) => {
      const hold = await tx.tokenHold.findUnique({ where: { reference } });
      if (!hold) throw new Error(`Reservierung ${reference} existiert nicht.`);

      if (hold.status === 'CAPTURED') {
        /*
         * Bereits gebucht. Statt ein zweites Mal abzubuchen, wird die
         * vorhandene Buchung zurueckgegeben -- derselbe Aufruf, dasselbe
         * Ergebnis.
         */
        const vorhanden = await tx.tokenTransaction.findUnique({ where: { reference } });
        if (vorhanden) return toTransaction(vorhanden);
        throw new Error(`Reservierung ${reference} ist gebucht, aber ohne Buchungssatz.`);
      }

      if (hold.status !== 'OPEN') {
        throw new Error(`Reservierung ${reference} ist nicht mehr offen (${hold.status}).`);
      }

      const konto = await tx.wallet.update({
        where: { id: hold.walletId },
        data: {
          balanceTokens: { decrement: hold.amountTokens },
          reservedTokens: { decrement: hold.amountTokens },
        },
      });

      const buchung = await tx.tokenTransaction.create({
        data: {
          walletId: hold.walletId,
          type: 'USAGE',
          // Negativ, weil Verbrauch. Das Vorzeichen macht die Historie ohne
          // Zusatzspalte lesbar.
          amountTokens: -hold.amountTokens,
          balanceAfter: konto.balanceTokens,
          purpose: hold.purpose,
          reference,
          actorId,
        },
      });

      await tx.tokenHold.update({
        where: { id: hold.id },
        data: { status: 'CAPTURED', settledAt: new Date() },
      });

      return toTransaction(buchung);
    });
  }

  async release(reference: string): Promise<void> {
    await prisma.$transaction(async (tx) => {
      const hold = await tx.tokenHold.findUnique({ where: { reference } });
      // Nicht vorhanden oder nicht mehr offen: nichts zu tun. Freigeben muss
      // mehrfach aufrufbar sein, ohne Schaden anzurichten.
      if (!hold || hold.status !== 'OPEN') return;

      await tx.wallet.update({
        where: { id: hold.walletId },
        data: { reservedTokens: { decrement: hold.amountTokens } },
      });
      await tx.tokenHold.update({
        where: { id: hold.id },
        data: { status: 'RELEASED', settledAt: new Date() },
      });
    });
  }

  async credit(input: {
    userId: string;
    amountTokens: number;
    type: TokenTransactionType;
    purpose: string;
    reference: string;
    actorId: string | null;
  }): Promise<TokenTransactionRecord> {
    await this.ensureWallet(input.userId);

    try {
      return await prisma.$transaction(async (tx) => {
        const konto = await tx.wallet.update({
          where: { userId: input.userId },
          data: { balanceTokens: { increment: input.amountTokens } },
        });

        const buchung = await tx.tokenTransaction.create({
          data: {
            walletId: konto.id,
            type: input.type,
            amountTokens: input.amountTokens,
            balanceAfter: konto.balanceTokens,
            purpose: input.purpose,
            reference: input.reference,
            actorId: input.actorId,
          },
        });

        return toTransaction(buchung);
      });
    } catch (error) {
      if (istEindeutigkeitsfehler(error)) {
        /*
         * Derselbe Vorgang wurde schon einmal gebucht -- etwa durch einen
         * wiederholten Webhook. Die vorhandene Buchung ist die richtige
         * Antwort; ein zweites Mal gutzuschreiben waere ein Fehler.
         */
        const vorhanden = await prisma.tokenTransaction.findUnique({
          where: { reference: input.reference },
        });
        if (vorhanden) return toTransaction(vorhanden);
      }
      throw error;
    }
  }

  async debit(input: {
    userId: string;
    amountTokens: number;
    type: TokenTransactionType;
    purpose: string;
    reference: string;
    actorId: string | null;
  }): Promise<TokenTransactionRecord | null> {
    await this.ensureWallet(input.userId);

    try {
      return await prisma.$transaction(async (tx) => {
        const geaendert = await tx.$executeRaw`
          UPDATE "Wallet"
          SET "balanceTokens" = "balanceTokens" - ${input.amountTokens},
              "updatedAt" = NOW()
          WHERE "userId" = ${input.userId}
            AND "balanceTokens" - "reservedTokens" >= ${input.amountTokens}
        `;

        if (geaendert !== 1) return null;

        const konto = await tx.wallet.findUniqueOrThrow({ where: { userId: input.userId } });

        const buchung = await tx.tokenTransaction.create({
          data: {
            walletId: konto.id,
            type: input.type,
            amountTokens: -input.amountTokens,
            balanceAfter: konto.balanceTokens,
            purpose: input.purpose,
            reference: input.reference,
            actorId: input.actorId,
          },
        });

        return toTransaction(buchung);
      });
    } catch (error) {
      if (istEindeutigkeitsfehler(error)) {
        const vorhanden = await prisma.tokenTransaction.findUnique({
          where: { reference: input.reference },
        });
        if (vorhanden) return toTransaction(vorhanden);
      }
      throw error;
    }
  }

  async listTransactions(
    userId: string,
    options: { limit: number; offset: number },
  ): Promise<{ items: TokenTransactionRecord[]; total: number }> {
    const konto = await prisma.wallet.findUnique({ where: { userId }, select: { id: true } });
    if (!konto) return { items: [], total: 0 };

    const [rows, total] = await Promise.all([
      prisma.tokenTransaction.findMany({
        where: { walletId: konto.id },
        orderBy: { createdAt: 'desc' },
        skip: options.offset,
        take: options.limit,
      }),
      prisma.tokenTransaction.count({ where: { walletId: konto.id } }),
    ]);

    return { items: rows.map(toTransaction), total };
  }

  async findHold(reference: string): Promise<HoldRecord | null> {
    const row = await prisma.tokenHold.findUnique({ where: { reference } });
    return row ? toHold(row) : null;
  }

  /**
   * Gibt abgelaufene Reservierungen frei.
   *
   * Ohne diesen Lauf blockiert ein haengengebliebener Vorgang das Guthaben
   * dauerhaft. Er laeuft im Worker-Prozess.
   */
  async releaseExpiredHolds(now: Date): Promise<number> {
    const abgelaufen = await prisma.tokenHold.findMany({
      where: { status: 'OPEN', expiresAt: { lte: now } },
      select: { id: true, walletId: true, amountTokens: true },
      take: 200,
    });

    let freigegeben = 0;
    for (const hold of abgelaufen) {
      await prisma.$transaction(async (tx) => {
        // Erneut pruefen: zwischen Lesen und Buchen kann der Vorgang doch
        // noch erfolgreich abgeschlossen worden sein.
        const aktuell = await tx.tokenHold.findUnique({ where: { id: hold.id } });
        if (!aktuell || aktuell.status !== 'OPEN') return;

        await tx.wallet.update({
          where: { id: hold.walletId },
          data: { reservedTokens: { decrement: hold.amountTokens } },
        });
        await tx.tokenHold.update({
          where: { id: hold.id },
          data: { status: 'EXPIRED', settledAt: new Date() },
        });
        freigegeben += 1;
      });
    }

    return freigegeben;
  }
}

function istEindeutigkeitsfehler(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'
  );
}

export const walletRepository = new PrismaWalletRepository();
