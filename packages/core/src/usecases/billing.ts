import { requirePrincipal, type Principal } from '../auth/access';
import { errors } from '../errors';
import type { AuditLogger } from '../ports/audit';
import type { Clock } from '../ports/clock';
import type { PaymentProvider } from '../ports/payment-provider';

import { findPackage, type TokenPackage } from '../billing/pricing';

/**
 * Guthaben kaufen.
 *
 * Der Ablauf hat drei getrennte Schritte, und die Trennung ist der Punkt:
 *
 *  1. **Vorgang anlegen** -- mit eigener Kennung, bevor irgendjemand
 *     irgendwohin geschickt wird. Ohne sie liesse sich eine Rueckmeldung des
 *     Anbieters keinem Kauf zuordnen.
 *  2. **Zum Anbieter schicken.**
 *  3. **Gutschreiben** -- erst, wenn der Anbieter die Zahlung bestaetigt hat,
 *     und zwar auf Nachfrage bei ihm. Der Rueckleitung im Browser wird
 *     ausdruecklich nicht geglaubt: Sie kommt vom Geraet der zahlenden
 *     Person und laesst sich dort veraendern.
 *
 * Ohne eingerichteten Anbieter (offener Punkt B5) endet der Ablauf bei
 * Schritt 0 mit einer Meldung, die den Grund nennt.
 */

export interface PurchaseDeps {
  payments: PaymentProvider;
  clock: Clock;
  audit: AuditLogger;
  /** Legt den Vorgang an und gibt die eigene Kennung zurueck. */
  createIntent(input: {
    userId: string;
    reference: string;
    providerLabel: string;
    tokens: number;
    amountGrossCents: number;
  }): Promise<{ id: string; reference: string }>;
  /** Steuersatz in Basispunkten. */
  taxRateBasisPoints: number;
  appUrl: string;
}

export interface PurchaseResult {
  reference: string;
  redirectUrl: string;
  paket: TokenPackage;
  amountGrossCents: number;
}

function bruttoAusNetto(netCents: number, rateBasisPoints: number): number {
  const steuer = Math.round((netCents * rateBasisPoints) / 10_000);
  return netCents + steuer;
}

export async function startTokenPurchase(
  deps: PurchaseDeps,
  principal: Principal | null,
  paketId: string,
): Promise<PurchaseResult> {
  const kaeufer = requirePrincipal(principal);

  const paket = findPackage(paketId);
  if (!paket) {
    throw errors.validation({ paket: ['Dieses Paket gibt es nicht.'] });
  }

  /*
   * Verfuegbarkeit VOR dem Anlegen des Vorgangs -- wie beim
   * Verkaufsassistenten und bei der Bewertung. Ein Vorgang, der nie zu einer
   * Zahlung fuehren kann, gehoert nicht in die Datenbank.
   */
  if (!deps.payments.isAvailable()) {
    throw errors.notImplemented(
      'Es ist kein Zahlungsweg eingerichtet. Guthaben lässt sich derzeit nicht kaufen; ' +
        'bereits vorhandenes Guthaben funktioniert unverändert.',
    );
  }

  const brutto = bruttoAusNetto(paket.netCents, deps.taxRateBasisPoints);
  const jetzt = deps.clock.now();
  const reference = `tokens:${kaeufer.userId}:${paket.id}:${jetzt.getTime()}`;

  const vorgang = await deps.createIntent({
    userId: kaeufer.userId,
    reference,
    providerLabel: deps.payments.label,
    tokens: paket.tokens,
    amountGrossCents: brutto,
  });

  const sitzung = await deps.payments.createCheckout({
    userId: kaeufer.userId,
    tokens: paket.tokens,
    amountGrossCents: brutto,
    currency: 'EUR',
    reference: vorgang.reference,
    returnUrl: `${deps.appUrl}/konto/guthaben?vorgang=${encodeURIComponent(vorgang.reference)}`,
  });

  await deps.audit.record({
    action: 'payment.started',
    actorId: kaeufer.userId,
    subjectType: 'PaymentIntent',
    subjectId: vorgang.id,
    metadata: { tokens: paket.tokens, amountGrossCents: brutto },
  });

  return {
    reference: vorgang.reference,
    redirectUrl: sitzung.redirectUrl,
    paket,
    amountGrossCents: brutto,
  };
}

/* ------------------------------------------------------------------------- */

export interface ConfirmDeps {
  payments: PaymentProvider;
  clock: Clock;
  audit: AuditLogger;
  /** Liest den Vorgang. */
  findIntent(reference: string): Promise<{
    id: string;
    userId: string;
    reference: string;
    /**
     * Kennung beim Anbieter.
     *
     * Wird zum Nachfragen gebraucht: Unsere Vorgangskennung kennt der
     * Anbieter nicht -- sie steht bei ihm hoechstens in den Metadaten. Vorher
     * wurde hier unsere eigene Kennung durchgereicht; mit der Ersatzvariante
     * fiel das nicht auf, weil sie ohnehin nie antwortete.
     */
    providerReference: string | null;
    state: string;
    tokens: number;
    amountGrossCents: number;
  } | null>;
  /** Setzt auf bezahlt. Gibt false zurueck, wenn das schon geschehen war. */
  markPaid(input: {
    reference: string;
    paidAmountCents: number;
    paidAt: Date;
    providerReference: string | null;
  }): Promise<boolean>;
  /** Schreibt Guthaben gut. */
  credit(input: {
    userId: string;
    amountTokens: number;
    reference: string;
  }): Promise<void>;
  /** Erstellt die Rechnung. Gibt die Rechnungsnummer zurueck. */
  issueInvoice(input: {
    userId: string;
    tokens: number;
    reference: string;
    issuedAt: Date;
  }): Promise<string>;
}

export interface ConfirmResult {
  /** Ob durch diesen Aufruf gutgeschrieben wurde. */
  credited: boolean;
  tokens: number;
  invoiceNumber: string | null;
  message: string;
}

/**
 * Eine Zahlung bestaetigen und gutschreiben.
 *
 * Die drei Absicherungen, in dieser Reihenfolge:
 *
 *  1. **Beim Anbieter nachfragen.** Nicht der Rueckleitung glauben -- sie
 *     kommt vom Geraet der zahlenden Person und laesst sich dort veraendern.
 *  2. **Den Betrag pruefen.** Ein gezahlter Betrag unter dem erwarteten wird
 *     nicht gutgeschrieben. Sonst liesse sich mit einem manipulierten
 *     Anbietervorgang billiger einkaufen.
 *  3. **Genau einmal auf bezahlt setzen.** Das bedingte UPDATE gibt false
 *     zurueck, wenn der Vorgang schon bezahlt war. Erst danach wird
 *     gutgeschrieben -- eine doppelte Rueckmeldung aendert nichts.
 */
export async function confirmTokenPurchase(
  deps: ConfirmDeps,
  reference: string,
): Promise<ConfirmResult> {
  const vorgang = await deps.findIntent(reference);
  if (!vorgang) throw errors.notFound();

  if (vorgang.state === 'PAID') {
    return {
      credited: false,
      tokens: vorgang.tokens,
      invoiceNumber: null,
      message: 'Diese Zahlung wurde bereits verbucht. Es wurde nichts doppelt gutgeschrieben.',
    };
  }

  if (!vorgang.providerReference) {
    /*
     * Ein Vorgang ohne Anbieterkennung ist einer, bei dem das Anlegen der
     * Bezahlseite fehlschlug. Es gibt beim Anbieter nichts nachzufragen --
     * und ohne Nachfrage wird nichts gutgeschrieben.
     */
    return {
      credited: false,
      tokens: vorgang.tokens,
      invoiceNumber: null,
      message:
        'Zu diesem Kauf wurde beim Zahlungsanbieter kein Vorgang angelegt. Es wurde nichts ' +
        'abgebucht. Bitte beginnen Sie den Kauf neu.',
    };
  }

  const status = await deps.payments.getPaymentStatus(vorgang.providerReference);
  if (status.state !== 'PAID') {
    return {
      credited: false,
      tokens: vorgang.tokens,
      invoiceNumber: null,
      message:
        status.state === 'PENDING'
          ? 'Die Zahlung ist noch nicht abgeschlossen. Sobald sie eingeht, wird das Guthaben gutgeschrieben.'
          : 'Die Zahlung wurde nicht abgeschlossen. Es wurde nichts abgebucht und nichts gutgeschrieben.',
    };
  }

  const gezahlt = status.paidAmountCents ?? 0;
  if (gezahlt < vorgang.amountGrossCents) {
    await deps.audit.record({
      action: 'payment.failed',
      actorId: vorgang.userId,
      subjectType: 'PaymentIntent',
      subjectId: vorgang.id,
      metadata: { erwartet: vorgang.amountGrossCents, gezahlt },
    });
    throw errors.conflict(
      'Der gezahlte Betrag stimmt nicht mit dem Kauf überein. Es wurde kein Guthaben ' +
        'gutgeschrieben; bitte melden Sie sich bei uns.',
    );
  }

  const jetzt = deps.clock.now();
  const erstmalig = await deps.markPaid({
    reference,
    paidAmountCents: gezahlt,
    paidAt: status.paidAt ?? jetzt,
    providerReference: vorgang.providerReference,
  });

  if (!erstmalig) {
    // Zwei Rueckmeldungen gleichzeitig: Die zweite hat verloren und tut nichts.
    return {
      credited: false,
      tokens: vorgang.tokens,
      invoiceNumber: null,
      message: 'Diese Zahlung wurde bereits verbucht. Es wurde nichts doppelt gutgeschrieben.',
    };
  }

  await deps.credit({
    userId: vorgang.userId,
    amountTokens: vorgang.tokens,
    reference,
  });

  const rechnungsnummer = await deps.issueInvoice({
    userId: vorgang.userId,
    tokens: vorgang.tokens,
    reference,
    issuedAt: jetzt,
  });

  await deps.audit.record({
    action: 'payment.confirmed',
    actorId: vorgang.userId,
    subjectType: 'PaymentIntent',
    subjectId: vorgang.id,
    metadata: { tokens: vorgang.tokens, invoice: rechnungsnummer },
  });

  return {
    credited: true,
    tokens: vorgang.tokens,
    invoiceNumber: rechnungsnummer,
    message: `${vorgang.tokens} Tokens wurden gutgeschrieben. Die Rechnung finden Sie unter „Rechnungen".`,
  };
}
