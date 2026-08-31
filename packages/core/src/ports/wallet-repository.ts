/**
 * Guthabenzugriff als Schnittstelle.
 *
 * Die Fachregeln stehen in `usecases/wallet.ts`, die Buchungen in
 * `packages/db`. Diese Trennung ist hier besonders wichtig: Die Buchung
 * selbst muss atomar in der Datenbank geschehen, die Entscheidung darueber
 * gehoert in die Domaene.
 */

export type TokenTransactionType =
  | 'PURCHASE'
  | 'USAGE'
  | 'REFUND'
  | 'ADMIN_CREDIT'
  | 'ADMIN_DEBIT'
  | 'ADJUSTMENT';

export type TokenHoldStatus = 'OPEN' | 'CAPTURED' | 'RELEASED' | 'EXPIRED';

export interface WalletSnapshot {
  id: string;
  userId: string;
  balanceTokens: number;
  reservedTokens: number;
  /** Was tatsaechlich ausgegeben werden kann. */
  availableTokens: number;
}

export interface TokenTransactionRecord {
  id: string;
  type: TokenTransactionType;
  amountTokens: number;
  balanceAfter: number;
  purpose: string;
  reference: string;
  createdAt: Date;
}

export interface HoldRecord {
  id: string;
  amountTokens: number;
  status: TokenHoldStatus;
  purpose: string;
  reference: string;
  expiresAt: Date;
}

export interface WalletRepository {
  /** Legt bei Bedarf ein Guthabenkonto an. */
  ensureWallet(userId: string): Promise<WalletSnapshot>;

  findWallet(userId: string): Promise<WalletSnapshot | null>;

  /**
   * Reserviert einen Betrag, wenn genug verfuegbar ist.
   *
   * Muss atomar sein: Zwei gleichzeitige Anfragen duerfen nicht beide
   * gelingen, wenn das Guthaben nur fuer eine reicht. Gibt null zurueck,
   * wenn nicht genug verfuegbar ist.
   */
  reserve(input: {
    userId: string;
    amountTokens: number;
    purpose: string;
    reference: string;
    expiresAt: Date;
  }): Promise<HoldRecord | null>;

  /** Bucht eine offene Reservierung endgueltig ab. */
  capture(reference: string, actorId: string | null): Promise<TokenTransactionRecord>;

  /** Gibt eine offene Reservierung wieder frei. */
  release(reference: string): Promise<void>;

  /** Schreibt Guthaben gut. */
  credit(input: {
    userId: string;
    amountTokens: number;
    type: TokenTransactionType;
    purpose: string;
    reference: string;
    actorId: string | null;
  }): Promise<TokenTransactionRecord>;

  /** Bucht ohne vorherige Reservierung ab -- nur fuer die Administration. */
  debit(input: {
    userId: string;
    amountTokens: number;
    type: TokenTransactionType;
    purpose: string;
    reference: string;
    actorId: string | null;
  }): Promise<TokenTransactionRecord | null>;

  listTransactions(
    userId: string,
    options: { limit: number; offset: number },
  ): Promise<{ items: TokenTransactionRecord[]; total: number }>;

  findHold(reference: string): Promise<HoldRecord | null>;

  /** Gibt abgelaufene Reservierungen frei. Aufgabe des Worker-Prozesses. */
  releaseExpiredHolds(now: Date): Promise<number>;
}
