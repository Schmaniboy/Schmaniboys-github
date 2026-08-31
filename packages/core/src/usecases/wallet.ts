import { Permission } from '../auth/roles';
import { requirePermission, requirePrincipal, type Principal } from '../auth/access';
import { AppError, ErrorCode, errors } from '../errors';
import type { AuditLogger } from '../ports/audit';
import type { Clock } from '../ports/clock';
import type {
  TokenTransactionRecord,
  WalletRepository,
  WalletSnapshot,
} from '../ports/wallet-repository';
import { HOLD_LIFETIME_SECONDS, type TokenCost, COST_LABELS, priceOf } from '../wallet/policy';

/**
 * Guthabenvorgaenge.
 *
 * Das Verfahren heisst: reservieren, ausfuehren, buchen.
 *
 * Ein KI-Aufruf dauert Sekunden und kann scheitern. Wer erst danach bucht,
 * verschenkt Leistung an Abbrecher. Wer vorher bucht, nimmt Geld fuer einen
 * Aufruf, der nie ankam. Deshalb wird der Betrag zuerst reserviert, dann der
 * Aufruf ausgefuehrt und erst bei Erfolg gebucht.
 */

export interface WalletDeps {
  wallets: WalletRepository;
  clock: Clock;
  audit: AuditLogger;
}

export async function getOwnWallet(
  deps: WalletDeps,
  principal: Principal | null,
): Promise<WalletSnapshot> {
  const subject = requirePermission(principal, Permission.WALLET_READ_OWN);
  return deps.wallets.ensureWallet(subject.userId);
}

export async function listOwnTransactions(
  deps: WalletDeps,
  principal: Principal | null,
  options: { limit: number; offset: number },
): Promise<{ items: TokenTransactionRecord[]; total: number }> {
  const subject = requirePermission(principal, Permission.WALLET_READ_OWN);
  return deps.wallets.listTransactions(subject.userId, options);
}

/** Fehler, den eine kostenpflichtige Funktion bei zu wenig Guthaben wirft. */
export function insufficientFunds(benoetigt: number, verfuegbar: number): AppError {
  return new AppError(ErrorCode.INSUFFICIENT_FUNDS, {
    message:
      `Für diese Funktion werden ${benoetigt} Tokens benötigt, verfügbar sind ${verfuegbar}. ` +
      'Bitte Guthaben aufladen.',
  });
}

export interface SpendResult<T> {
  result: T;
  charged: number;
  transaction: TokenTransactionRecord;
}

/**
 * Fuehrt eine kostenpflichtige Handlung aus und bucht sie ab.
 *
 * `reference` macht den Vorgang wiederholbar ohne Doppelbuchung: Dieselbe
 * Kennung reserviert kein zweites Mal. Ohne sie wuerde ein Doppelklick oder
 * ein wiederholter Aufruf zweimal abbuchen.
 *
 * Scheitert die Handlung, wird die Reservierung freigegeben -- der Fehler
 * wird unveraendert weitergereicht, damit der Aufrufer die Ursache sieht.
 */
export async function spendTokens<T>(
  deps: WalletDeps,
  principal: Principal | null,
  input: { kind: TokenCost; reference: string },
  handlung: () => Promise<T>,
): Promise<SpendResult<T>> {
  const subject = requirePrincipal(principal);
  const betrag = priceOf(input.kind);
  const zweck = COST_LABELS[input.kind];

  const konto = await deps.wallets.ensureWallet(subject.userId);

  const reservierung = await deps.wallets.reserve({
    userId: subject.userId,
    amountTokens: betrag,
    purpose: zweck,
    reference: input.reference,
    expiresAt: new Date(deps.clock.now().getTime() + HOLD_LIFETIME_SECONDS * 1000),
  });

  if (!reservierung) {
    /*
     * Drei moegliche Gruende, und sie brauchen verschiedene Antworten:
     *
     *  - Der Vorgang laeuft gerade (Doppelklick).
     *  - Der Vorgang ist bereits abgerechnet.
     *  - Das Guthaben reicht nicht.
     *
     * Die ersten beiden als Guthabenmangel zu melden waere schlicht falsch --
     * und genau das ist beim Bauen einmal passiert: Ein zweiter Aufruf mit
     * derselben Kennung meldete "zu wenig Guthaben", obwohl reichlich
     * vorhanden war.
     */
    const vorhandeneReservierung = await deps.wallets.findHold(input.reference);

    if (vorhandeneReservierung?.status === 'OPEN') {
      throw errors.conflict('Dieser Vorgang läuft bereits.');
    }
    if (vorhandeneReservierung?.status === 'CAPTURED') {
      throw errors.conflict(
        'Dieser Vorgang wurde bereits ausgeführt und abgerechnet. ' +
          'Das vorhandene Ergebnis steht weiterhin zur Verfügung.',
      );
    }

    const aktuell = await deps.wallets.findWallet(subject.userId);
    throw insufficientFunds(betrag, aktuell?.availableTokens ?? konto.availableTokens);
  }

  let ergebnis: T;
  try {
    ergebnis = await handlung();
  } catch (fehler) {
    // Nicht ausgefuehrt heisst nicht bezahlt.
    await deps.wallets.release(input.reference);
    await deps.audit.record({
      action: 'ai.invoked',
      actorId: subject.userId,
      subjectType: 'wallet',
      subjectId: konto.id,
      metadata: { zweck, betrag, ergebnis: 'fehlgeschlagen' },
    });
    throw fehler;
  }

  const buchung = await deps.wallets.capture(input.reference, subject.userId);

  await deps.audit.record({
    action: 'wallet.debited',
    actorId: subject.userId,
    subjectType: 'wallet',
    subjectId: konto.id,
    metadata: { zweck, betrag, stand: buchung.balanceAfter },
  });

  return { result: ergebnis, charged: betrag, transaction: buchung };
}

/**
 * Gutschrift durch die Administration.
 *
 * Getrennt vom Kauf, weil sie ein anderes Recht braucht und im Audit-Log
 * anders auftauchen muss. Wer Guthaben von Hand vergibt, hinterlaesst eine
 * Spur.
 */
export async function adminCredit(
  deps: WalletDeps,
  principal: Principal | null,
  input: { userId: string; amountTokens: number; reason: string; reference: string },
): Promise<TokenTransactionRecord> {
  const subject = requirePermission(principal, Permission.WALLET_ADMIN_ADJUST);

  if (!Number.isInteger(input.amountTokens) || input.amountTokens <= 0) {
    throw errors.validation({ amountTokens: ['Bitte eine positive ganze Zahl angeben.'] });
  }

  const buchung = await deps.wallets.credit({
    userId: input.userId,
    amountTokens: input.amountTokens,
    type: 'ADMIN_CREDIT',
    purpose: input.reason,
    reference: input.reference,
    actorId: subject.userId,
  });

  await deps.audit.record({
    action: 'wallet.adjusted',
    actorId: subject.userId,
    subjectType: 'user',
    subjectId: input.userId,
    metadata: { betrag: input.amountTokens, grund: input.reason, richtung: 'gutschrift' },
  });

  return buchung;
}

export async function adminDebit(
  deps: WalletDeps,
  principal: Principal | null,
  input: { userId: string; amountTokens: number; reason: string; reference: string },
): Promise<TokenTransactionRecord> {
  const subject = requirePermission(principal, Permission.WALLET_ADMIN_ADJUST);

  if (!Number.isInteger(input.amountTokens) || input.amountTokens <= 0) {
    throw errors.validation({ amountTokens: ['Bitte eine positive ganze Zahl angeben.'] });
  }

  const buchung = await deps.wallets.debit({
    userId: input.userId,
    amountTokens: input.amountTokens,
    type: 'ADMIN_DEBIT',
    purpose: input.reason,
    reference: input.reference,
    actorId: subject.userId,
  });

  if (!buchung) {
    const konto = await deps.wallets.findWallet(input.userId);
    throw insufficientFunds(input.amountTokens, konto?.availableTokens ?? 0);
  }

  await deps.audit.record({
    action: 'wallet.adjusted',
    actorId: subject.userId,
    subjectType: 'user',
    subjectId: input.userId,
    metadata: { betrag: input.amountTokens, grund: input.reason, richtung: 'abbuchung' },
  });

  return buchung;
}
