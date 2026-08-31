/**
 * Nachvollziehbarkeit. Der MASTERPLAN verlangt vollstaendige Audit-Logs fuer
 * Guthaben, Rollen und administrative Eingriffe.
 *
 * Grundsatz: Ein Audit-Eintrag beschreibt, WER WAS an WELCHEM Objekt getan
 * hat -- niemals Passwoerter, Tokens, vollstaendige VIN oder Zahlungsdaten.
 */

export type AuditAction =
  | 'auth.login'
  | 'auth.login_failed'
  | 'auth.logout'
  | 'auth.register'
  | 'auth.password_changed'
  | 'auth.password_reset_requested'
  | 'auth.password_reset_mail_failed'
  | 'auth.verification_mail_failed'
  | 'auth.email_verified'
  | 'role.assigned'
  | 'catalog.created'
  | 'catalog.updated'
  | 'catalog.published'
  | 'listing.created'
  | 'listing.updated'
  | 'listing.status_changed'
  | 'listing.moderated'
  | 'message.moderated'
  | 'wallet.credited'
  | 'wallet.debited'
  | 'wallet.adjusted'
  | 'payment.started'
  | 'payment.confirmed'
  | 'payment.failed'
  /*
   * Die Benachrichtigung des Zahlungsanbieters.
   *
   * Vier Ausgaenge, weil sie sich in der Bedeutung stark unterscheiden:
   * `rejected` heisst, die Benachrichtigung war unbrauchbar (moeglicherweise
   * ein Angriffsversuch), `unknown` heisst, der Vorgang gehoert nicht zu uns,
   * `credited` heisst, es wurde gutgeschrieben, `noop` heisst, es war schon
   * gutgeschrieben. Alle vier in einen Eintrag zu werfen machte das
   * Protokoll unbrauchbar -- gerade fuer die Frage, ob jemand den Endpunkt
   * abklopft.
   */
  | 'payment.webhook.rejected'
  | 'payment.webhook.unknown'
  | 'payment.webhook.credited'
  | 'payment.webhook.noop'
  | 'payment.webhook.failed'
  | 'invoice.issued'
  | 'invoice.cancelled'
  | 'dealer.profile_updated'
  | 'dealer.member_changed'
  | 'ai.invoked'
  | 'admin.user_blocked';

export interface AuditEvent {
  action: AuditAction;
  actorId: string | null;
  subjectType: string;
  subjectId: string | null;
  /** Nur unbedenkliche Zusatzinformationen. Keine Geheimnisse. */
  metadata?: Record<string, string | number | boolean | null>;
  ipHash?: string | null;
}

export interface AuditLogger {
  record(event: AuditEvent): Promise<void>;
}

/** Fuer Tests und fuer Kontexte ohne Datenbank. */
export class NoopAuditLogger implements AuditLogger {
  async record(): Promise<void> {
    /* absichtlich leer */
  }
}
