import { hashPassword } from '@ap/core';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { prisma } from '../client';

import { createUser } from './users';
import { walletRepository } from './wallet';

/**
 * Guthabenbuchungen gegen eine echte Datenbank.
 *
 * Diese Tests sind die wichtigsten im Projekt: Ein Fehler hier kostet Geld
 * oder verschenkt Leistung. Zwei Dinge lassen sich nur hier pruefen und nicht
 * mit Attrappen -- die Gleichzeitigkeit und die Pruefbedingungen der
 * Datenbank.
 */

const hasDatabase = Boolean(process.env.DATABASE_URL);
const suite = hasDatabase ? describe : describe.skip;

const marker = `wal${Date.now().toString(36)}`;
let userId = '';

suite('Token-Guthaben', () => {
  beforeAll(async () => {
    const user = await createUser({
      email: `guthaben.${marker}@example.test`,
      passwordHash: await hashPassword('ein-ausreichend-langes-passwort'),
      displayName: 'Guthabentest',
    });
    userId = user.id;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: { contains: marker } } });
    await prisma.$disconnect();
  });

  async function stand() {
    const konto = await walletRepository.findWallet(userId);
    return {
      guthaben: konto?.balanceTokens ?? 0,
      reserviert: konto?.reservedTokens ?? 0,
      verfuegbar: konto?.availableTokens ?? 0,
    };
  }

  it('legt ein Konto bei Bedarf an und beginnt bei null', async () => {
    const konto = await walletRepository.ensureWallet(userId);
    expect(konto.balanceTokens).toBe(0);
    expect(konto.availableTokens).toBe(0);

    // Zweimal aufrufen darf kein zweites Konto erzeugen.
    const nochmal = await walletRepository.ensureWallet(userId);
    expect(nochmal.id).toBe(konto.id);
  });

  it('schreibt Guthaben gut und schreibt die Buchung mit', async () => {
    const buchung = await walletRepository.credit({
      userId,
      amountTokens: 100,
      type: 'PURCHASE',
      purpose: 'Testaufladung',
      reference: `${marker}-kauf-1`,
      actorId: null,
    });

    expect(buchung.amountTokens).toBe(100);
    expect(buchung.balanceAfter).toBe(100);
    expect((await stand()).guthaben).toBe(100);
  });

  it('bucht denselben Vorgang nicht zweimal', async () => {
    /*
     * Ein wiederholter Webhook oder ein Doppelklick darf nicht zweimal
     * gutschreiben. Die zweite Buchung gibt die erste zurueck.
     */
    const nochmal = await walletRepository.credit({
      userId,
      amountTokens: 100,
      type: 'PURCHASE',
      purpose: 'Testaufladung',
      reference: `${marker}-kauf-1`,
      actorId: null,
    });

    expect(nochmal.balanceAfter).toBe(100);
    expect((await stand()).guthaben).toBe(100);
  });

  it('reserviert, ohne das Guthaben zu verringern', async () => {
    const hold = await walletRepository.reserve({
      userId,
      amountTokens: 30,
      purpose: 'Test',
      reference: `${marker}-res-1`,
      expiresAt: new Date(Date.now() + 60_000),
    });

    expect(hold).not.toBeNull();
    const jetzt = await stand();
    expect(jetzt.guthaben).toBe(100);
    expect(jetzt.reserviert).toBe(30);
    expect(jetzt.verfuegbar).toBe(70);
  });

  it('gibt eine Reservierung wieder frei', async () => {
    await walletRepository.release(`${marker}-res-1`);
    const jetzt = await stand();
    expect(jetzt.reserviert).toBe(0);
    expect(jetzt.verfuegbar).toBe(100);

    // Mehrfaches Freigeben darf nicht doppelt zurueckbuchen.
    await walletRepository.release(`${marker}-res-1`);
    expect((await stand()).reserviert).toBe(0);
  });

  it('bucht eine Reservierung ab und schreibt den Verbrauch negativ', async () => {
    await walletRepository.reserve({
      userId,
      amountTokens: 25,
      purpose: 'Verbrauchstest',
      reference: `${marker}-res-2`,
      expiresAt: new Date(Date.now() + 60_000),
    });

    const buchung = await walletRepository.capture(`${marker}-res-2`, userId);
    expect(buchung.amountTokens).toBe(-25);
    expect(buchung.balanceAfter).toBe(75);

    const jetzt = await stand();
    expect(jetzt.guthaben).toBe(75);
    expect(jetzt.reserviert).toBe(0);
  });

  it('bucht eine bereits gebuchte Reservierung nicht erneut ab', async () => {
    const nochmal = await walletRepository.capture(`${marker}-res-2`, userId);
    expect(nochmal.balanceAfter).toBe(75);
    expect((await stand()).guthaben).toBe(75);
  });

  it('verweigert eine Reservierung ueber das verfuegbare Guthaben hinaus', async () => {
    const hold = await walletRepository.reserve({
      userId,
      amountTokens: 1000,
      purpose: 'Zu viel',
      reference: `${marker}-res-zuviel`,
      expiresAt: new Date(Date.now() + 60_000),
    });
    expect(hold).toBeNull();
    expect((await stand()).reserviert).toBe(0);
  });

  it('laesst bei gleichzeitigen Reservierungen nur so viele zu, wie gedeckt sind', async () => {
    /*
     * Der eigentliche Grund fuer das bedingte UPDATE. Guthaben 75, sieben
     * gleichzeitige Anfragen ueber je 20 -- hoechstens drei duerfen gelingen.
     * Mit einem Lesen-Pruefen-Schreiben in der Anwendung wuerden hier alle
     * sieben durchgehen.
     */
    const versuche = Array.from({ length: 7 }, (_, index) =>
      walletRepository.reserve({
        userId,
        amountTokens: 20,
        purpose: 'Wettlauf',
        reference: `${marker}-parallel-${index}`,
        expiresAt: new Date(Date.now() + 60_000),
      }),
    );

    const ergebnisse = await Promise.all(versuche);
    const erfolgreich = ergebnisse.filter((hold) => hold !== null);

    expect(erfolgreich.length).toBe(3);

    const jetzt = await stand();
    expect(jetzt.reserviert).toBe(60);
    expect(jetzt.verfuegbar).toBe(15);
    // Nie mehr reserviert als vorhanden.
    expect(jetzt.reserviert).toBeLessThanOrEqual(jetzt.guthaben);

    for (const hold of erfolgreich) {
      await walletRepository.release(hold?.reference ?? '');
    }
  });

  it('reserviert denselben Vorgang nicht zweimal', async () => {
    const erste = await walletRepository.reserve({
      userId,
      amountTokens: 10,
      purpose: 'Doppelklick',
      reference: `${marker}-doppelt`,
      expiresAt: new Date(Date.now() + 60_000),
    });
    const zweite = await walletRepository.reserve({
      userId,
      amountTokens: 10,
      purpose: 'Doppelklick',
      reference: `${marker}-doppelt`,
      expiresAt: new Date(Date.now() + 60_000),
    });

    expect(erste).not.toBeNull();
    expect(zweite).toBeNull();
    expect((await stand()).reserviert).toBe(10);

    await walletRepository.release(`${marker}-doppelt`);
  });

  it('beachtet beim Abbuchen das reservierte Guthaben', async () => {
    await walletRepository.reserve({
      userId,
      amountTokens: 70,
      purpose: 'Blockiert',
      reference: `${marker}-block`,
      expiresAt: new Date(Date.now() + 60_000),
    });

    // Guthaben 75, davon 70 reserviert -- eine Abbuchung ueber 10 muss
    // scheitern, obwohl das reine Guthaben reichen wuerde.
    const zuviel = await walletRepository.debit({
      userId,
      amountTokens: 10,
      type: 'ADMIN_DEBIT',
      purpose: 'Test',
      reference: `${marker}-debit-zuviel`,
      actorId: null,
    });
    expect(zuviel).toBeNull();

    const passend = await walletRepository.debit({
      userId,
      amountTokens: 5,
      type: 'ADMIN_DEBIT',
      purpose: 'Test',
      reference: `${marker}-debit-ok`,
      actorId: null,
    });
    expect(passend?.balanceAfter).toBe(70);

    await walletRepository.release(`${marker}-block`);
  });

  it('gibt abgelaufene Reservierungen frei', async () => {
    await walletRepository.reserve({
      userId,
      amountTokens: 20,
      purpose: 'Haengengeblieben',
      reference: `${marker}-abgelaufen`,
      expiresAt: new Date(Date.now() - 1000),
    });
    expect((await stand()).reserviert).toBe(20);

    const freigegeben = await walletRepository.releaseExpiredHolds(new Date());
    expect(freigegeben).toBeGreaterThanOrEqual(1);

    const jetzt = await stand();
    expect(jetzt.reserviert).toBe(0);
    const hold = await walletRepository.findHold(`${marker}-abgelaufen`);
    expect(hold?.status).toBe('EXPIRED');
  });

  it('laesst die Datenbank kein negatives Guthaben zu', async () => {
    /*
     * Letzte Verteidigungslinie. Selbst wenn ein Fehler in der Anwendung
     * eine falsche Buchung erzeugen wuerde, weist die Datenbank sie ab.
     */
    await expect(
      prisma.$executeRaw`UPDATE "Wallet" SET "balanceTokens" = -1 WHERE "userId" = ${userId}`,
    ).rejects.toThrow();

    expect((await stand()).guthaben).toBeGreaterThanOrEqual(0);
  });

  it('laesst nicht mehr reservieren als vorhanden', async () => {
    await expect(
      prisma.$executeRaw`UPDATE "Wallet" SET "reservedTokens" = "balanceTokens" + 1 WHERE "userId" = ${userId}`,
    ).rejects.toThrow();
  });

  it('listet die Historie neueste zuerst', async () => {
    const { items, total } = await walletRepository.listTransactions(userId, {
      limit: 10,
      offset: 0,
    });
    expect(total).toBeGreaterThan(0);
    expect(items.length).toBeGreaterThan(0);
    for (let index = 1; index < items.length; index += 1) {
      expect(items[index - 1]!.createdAt.getTime()).toBeGreaterThanOrEqual(
        items[index]!.createdAt.getTime(),
      );
    }
  });
});
