import { Role } from '../auth/roles';
import type { AuditEvent, AuditLogger } from '../ports/audit';
import type {
  SessionRepository,
  StoredSession,
  StoredUser,
  UserRepository,
} from '../ports/user-repository';
import { errors } from '../errors';
import type { EditorialStatus } from '../catalog/publishing';
import type {
  CatalogRepository,
  CatalogSubject,
  SourceRecord,
  StoredEvidence,
} from '../ports/catalog-repository';
import type {
  HoldRecord,
  TokenTransactionRecord,
  TokenTransactionType,
  WalletRepository,
  WalletSnapshot,
} from '../ports/wallet-repository';

/**
 * Speicher-Attrappen der Persistenz-Ports.
 *
 * Sie liegen bewusst im Quellcode und nicht in einer Testdatei: sie sind auch
 * fuer manuelle Erprobung ohne Datenbank nuetzlich. Sie sind nicht fuer den
 * Produktivbetrieb gedacht und speichern nichts dauerhaft.
 */

export class FakeUserRepository implements UserRepository {
  readonly rows = new Map<string, StoredUser>();
  #sequence = 0;

  async findByEmail(email: string): Promise<StoredUser | null> {
    const wanted = email.toLowerCase();
    for (const user of this.rows.values()) {
      if (user.email === wanted) return { ...user };
    }
    return null;
  }

  async findById(id: string): Promise<StoredUser | null> {
    const user = this.rows.get(id);
    return user ? { ...user } : null;
  }

  async create(input: {
    email: string;
    passwordHash: string;
    displayName: string;
    role?: Role;
  }): Promise<StoredUser> {
    if (await this.findByEmail(input.email)) {
      throw errors.conflict('Diese E-Mail-Adresse ist bereits registriert.');
    }
    this.#sequence += 1;
    const user: StoredUser = {
      id: `user_${this.#sequence}`,
      email: input.email.toLowerCase(),
      passwordHash: input.passwordHash,
      displayName: input.displayName,
      role: input.role ?? Role.USER,
      status: 'ACTIVE',
      failedLoginCount: 0,
      lockedUntil: null,
      dealerId: null,
      emailVerifiedAt: null,
      createdAt: new Date(),
    };
    this.rows.set(user.id, user);
    return { ...user };
  }

  async updatePasswordHash(userId: string, passwordHash: string): Promise<void> {
    const user = this.rows.get(userId);
    if (user) user.passwordHash = passwordHash;
  }

  async registerFailedLogin(userId: string, lockedUntil: Date | null): Promise<void> {
    const user = this.rows.get(userId);
    if (!user) return;
    user.failedLoginCount += 1;
    if (lockedUntil) user.lockedUntil = lockedUntil;
  }

  async clearFailedLogins(userId: string): Promise<void> {
    const user = this.rows.get(userId);
    if (!user) return;
    user.failedLoginCount = 0;
    user.lockedUntil = null;
  }
}

export class FakeSessionRepository implements SessionRepository {
  readonly rows = new Map<string, StoredSession & { tokenHash: string }>();
  #sequence = 0;
  #users: FakeUserRepository;

  constructor(users: FakeUserRepository) {
    this.#users = users;
  }

  async create(input: {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<StoredSession> {
    this.#sequence += 1;
    const now = new Date();
    const session = {
      id: `session_${this.#sequence}`,
      userId: input.userId,
      tokenHash: input.tokenHash,
      expiresAt: input.expiresAt,
      createdAt: now,
      lastSeenAt: now,
    };
    this.rows.set(session.id, session);
    return { ...session };
  }

  async findByTokenHash(
    tokenHash: string,
  ): Promise<{ session: StoredSession; user: StoredUser } | null> {
    for (const session of this.rows.values()) {
      if (session.tokenHash !== tokenHash) continue;
      const user = await this.#users.findById(session.userId);
      if (!user) return null;
      return { session: { ...session }, user };
    }
    return null;
  }

  async touch(sessionId: string, expiresAt: Date | null): Promise<void> {
    const session = this.rows.get(sessionId);
    if (!session) return;
    session.lastSeenAt = new Date();
    if (expiresAt) session.expiresAt = expiresAt;
  }

  async delete(sessionId: string): Promise<void> {
    this.rows.delete(sessionId);
  }

  async deleteAllOfUser(userId: string): Promise<number> {
    let removed = 0;
    for (const [id, session] of this.rows) {
      if (session.userId === userId) {
        this.rows.delete(id);
        removed += 1;
      }
    }
    return removed;
  }
}

export class RecordingAuditLogger implements AuditLogger {
  readonly events: AuditEvent[] = [];

  async record(event: AuditEvent): Promise<void> {
    this.events.push(event);
  }

  actions(): string[] {
    return this.events.map((event) => event.action);
  }
}

/** Speicher-Attrappe des Katalogzugriffs. */
export class FakeCatalogRepository implements CatalogRepository {
  readonly stati = new Map<string, EditorialStatus>();
  readonly quellen = new Map<string, SourceRecord[]>();
  #sequence = 0;

  #key(subject: CatalogSubject, id: string): string {
    return `${subject}:${id}`;
  }

  /** Legt einen Eintrag fuer den Test an. */
  seed(subject: CatalogSubject, id: string, status: EditorialStatus, quellen = 0): void {
    this.stati.set(this.#key(subject, id), status);
    const liste: SourceRecord[] = [];
    for (let index = 0; index < quellen; index += 1) {
      this.#sequence += 1;
      liste.push({
        id: `src_${this.#sequence}`,
        kind: 'OTHER',
        title: `Quelle ${index + 1}`,
        url: null,
        publishedOn: null,
        checkedAt: new Date(),
        note: null,
        coversFields: [],
      });
    }
    this.quellen.set(this.#key(subject, id), liste);
  }

  async findStatus(subject: CatalogSubject, id: string): Promise<EditorialStatus | null> {
    return this.stati.get(this.#key(subject, id)) ?? null;
  }

  async setStatus(
    subject: CatalogSubject,
    id: string,
    status: EditorialStatus,
  ): Promise<void> {
    this.stati.set(this.#key(subject, id), status);
  }

  async countSources(subject: CatalogSubject, id: string): Promise<number> {
    return (this.quellen.get(this.#key(subject, id)) ?? []).length;
  }

  async listSources(subject: CatalogSubject, id: string): Promise<SourceRecord[]> {
    return [...(this.quellen.get(this.#key(subject, id)) ?? [])];
  }

  async addSource(
    subject: CatalogSubject,
    id: string,
    source: {
      kind: string;
      title: string;
      url?: string | undefined;
      publishedOn?: Date | undefined;
      note?: string | undefined;
      checkedAt: Date;
      coversFields?: string[];
    },
  ): Promise<SourceRecord> {
    this.#sequence += 1;
    const eintrag: SourceRecord = {
      id: `src_${this.#sequence}`,
      kind: source.kind,
      title: source.title,
      url: source.url ?? null,
      publishedOn: source.publishedOn ?? null,
      checkedAt: source.checkedAt,
      note: source.note ?? null,
      coversFields: source.coversFields ?? [],
    };
    const key = this.#key(subject, id);
    this.quellen.set(key, [...(this.quellen.get(key) ?? []), eintrag]);
    return eintrag;
  }

  async removeSource(sourceId: string): Promise<void> {
    for (const [key, liste] of this.quellen) {
      this.quellen.set(
        key,
        liste.filter((eintrag) => eintrag.id !== sourceId),
      );
    }
  }

  readonly belege = new Map<string, StoredEvidence>();

  /** Hinterlegt das Belegmodell einer Wissensaussage fuer den Test. */
  seedEvidence(subject: CatalogSubject, id: string, evidence: StoredEvidence): void {
    this.belege.set(this.#key(subject, id), evidence);
  }

  async findEvidence(subject: CatalogSubject, id: string): Promise<StoredEvidence | null> {
    return this.belege.get(this.#key(subject, id)) ?? null;
  }
}

/**
 * Speicher-Attrappe des Guthabens.
 *
 * Bildet die Regeln nach, nicht die Gleichzeitigkeit: Wettlaeufe lassen sich
 * nur gegen eine echte Datenbank pruefen, und genau das tut
 * `wallet.integration.test.ts`. Hier geht es um den Ablauf reservieren,
 * ausfuehren, buchen.
 */
export class FakeWalletRepository implements WalletRepository {
  readonly konten = new Map<string, { id: string; balance: number; reserved: number }>();
  readonly buchungen: TokenTransactionRecord[] = [];
  readonly reservierungen = new Map<string, HoldRecord & { walletUserId: string }>();
  #sequence = 0;

  #konto(userId: string) {
    let konto = this.konten.get(userId);
    if (!konto) {
      this.#sequence += 1;
      konto = { id: `wallet_${this.#sequence}`, balance: 0, reserved: 0 };
      this.konten.set(userId, konto);
    }
    return konto;
  }

  #snapshot(userId: string): WalletSnapshot {
    const konto = this.#konto(userId);
    return {
      id: konto.id,
      userId,
      balanceTokens: konto.balance,
      reservedTokens: konto.reserved,
      availableTokens: konto.balance - konto.reserved,
    };
  }

  /** Setzt einen Startstand fuer den Test. */
  seedBalance(userId: string, tokens: number): void {
    this.#konto(userId).balance = tokens;
  }

  async ensureWallet(userId: string): Promise<WalletSnapshot> {
    return this.#snapshot(userId);
  }

  async findWallet(userId: string): Promise<WalletSnapshot | null> {
    return this.konten.has(userId) ? this.#snapshot(userId) : null;
  }

  async reserve(input: {
    userId: string;
    amountTokens: number;
    purpose: string;
    reference: string;
    expiresAt: Date;
  }): Promise<HoldRecord | null> {
    if (this.reservierungen.has(input.reference)) return null;

    const konto = this.#konto(input.userId);
    if (konto.balance - konto.reserved < input.amountTokens) return null;

    konto.reserved += input.amountTokens;
    this.#sequence += 1;
    const hold = {
      id: `hold_${this.#sequence}`,
      amountTokens: input.amountTokens,
      status: 'OPEN' as const,
      purpose: input.purpose,
      reference: input.reference,
      expiresAt: input.expiresAt,
      walletUserId: input.userId,
    };
    this.reservierungen.set(input.reference, hold);
    return hold;
  }

  async capture(reference: string): Promise<TokenTransactionRecord> {
    const hold = this.reservierungen.get(reference);
    if (!hold) throw new Error(`Reservierung ${reference} existiert nicht.`);

    if (hold.status === 'CAPTURED') {
      const vorhanden = this.buchungen.find((buchung) => buchung.reference === reference);
      if (vorhanden) return vorhanden;
    }

    const konto = this.#konto(hold.walletUserId);
    konto.balance -= hold.amountTokens;
    konto.reserved -= hold.amountTokens;
    hold.status = 'CAPTURED';

    this.#sequence += 1;
    const buchung: TokenTransactionRecord = {
      id: `tx_${this.#sequence}`,
      type: 'USAGE',
      amountTokens: -hold.amountTokens,
      balanceAfter: konto.balance,
      purpose: hold.purpose,
      reference,
      createdAt: new Date(),
    };
    this.buchungen.push(buchung);
    return buchung;
  }

  async release(reference: string): Promise<void> {
    const hold = this.reservierungen.get(reference);
    if (!hold || hold.status !== 'OPEN') return;
    this.#konto(hold.walletUserId).reserved -= hold.amountTokens;
    hold.status = 'RELEASED';
  }

  async credit(input: {
    userId: string;
    amountTokens: number;
    type: TokenTransactionType;
    purpose: string;
    reference: string;
  }): Promise<TokenTransactionRecord> {
    const vorhanden = this.buchungen.find((buchung) => buchung.reference === input.reference);
    if (vorhanden) return vorhanden;

    const konto = this.#konto(input.userId);
    konto.balance += input.amountTokens;
    this.#sequence += 1;
    const buchung: TokenTransactionRecord = {
      id: `tx_${this.#sequence}`,
      type: input.type,
      amountTokens: input.amountTokens,
      balanceAfter: konto.balance,
      purpose: input.purpose,
      reference: input.reference,
      createdAt: new Date(),
    };
    this.buchungen.push(buchung);
    return buchung;
  }

  async debit(input: {
    userId: string;
    amountTokens: number;
    type: TokenTransactionType;
    purpose: string;
    reference: string;
  }): Promise<TokenTransactionRecord | null> {
    const konto = this.#konto(input.userId);
    if (konto.balance - konto.reserved < input.amountTokens) return null;

    konto.balance -= input.amountTokens;
    this.#sequence += 1;
    const buchung: TokenTransactionRecord = {
      id: `tx_${this.#sequence}`,
      type: input.type,
      amountTokens: -input.amountTokens,
      balanceAfter: konto.balance,
      purpose: input.purpose,
      reference: input.reference,
      createdAt: new Date(),
    };
    this.buchungen.push(buchung);
    return buchung;
  }

  async listTransactions(
    _userId: string,
    options: { limit: number; offset: number },
  ): Promise<{ items: TokenTransactionRecord[]; total: number }> {
    const alle = [...this.buchungen].reverse();
    return {
      items: alle.slice(options.offset, options.offset + options.limit),
      total: alle.length,
    };
  }

  async findHold(reference: string): Promise<HoldRecord | null> {
    return this.reservierungen.get(reference) ?? null;
  }

  async releaseExpiredHolds(now: Date): Promise<number> {
    let freigegeben = 0;
    for (const hold of this.reservierungen.values()) {
      if (hold.status !== 'OPEN' || hold.expiresAt.getTime() > now.getTime()) continue;
      this.#konto(hold.walletUserId).reserved -= hold.amountTokens;
      hold.status = 'EXPIRED';
      freigegeben += 1;
    }
    return freigegeben;
  }
}
