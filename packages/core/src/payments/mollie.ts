import createMollieClient, {
  type MollieClient,
  PaymentStatus as MollieStatus,
} from '@mollie/api-client';

import type {
  CheckoutRequest,
  CheckoutSession,
  PaymentProvider,
  PaymentState,
  PaymentStatus,
  WebhookResult,
} from '../ports/payment-provider';

/**
 * Mollie als Zahlungsanbieter.
 *
 * Gebaut gegen den offiziellen Client (`@mollie/api-client`) und nicht gegen
 * eine aus dem Gedaechtnis nachgebaute Schnittstelle. Der Unterschied ist
 * nicht Bequemlichkeit: Eine erfundene Schnittstelle laesst sich schreiben,
 * uebersetzen und testen -- und faellt erst im Betrieb auf, wenn Geld im
 * Spiel ist.
 *
 * Drei Dinge sind hier wichtiger als der Rest:
 *
 * 1. **Der Webhook wird nicht geglaubt.** Mollie schickt eine Benachrichtigung
 *    ohne Signatur -- nur die Zahlungskennung im Formularkoerper. Wer daraus
 *    einen Zahlungseingang ableitet, hat einen Endpunkt gebaut, an dem sich
 *    jeder Guthaben schenken kann. Der Adapter fragt deshalb IMMER beim
 *    Anbieter nach, was zu dieser Kennung gilt.
 *
 * 2. **Der Betrag kommt vom Anbieter, nicht von uns.** Was gutgeschrieben
 *    wird, richtet sich nach dem, was Mollie als gezahlt meldet.
 *
 * 3. **Kein Schluessel im Quelltext.** Der Schluessel kommt aus der Umgebung.
 *    Fehlt er, meldet sich der Adapter als nicht verfuegbar -- genau wie die
 *    Ersatzvariante, und mit demselben Ergebnis: Es wird nichts abgebucht
 *    fuer eine Funktion, die nicht laufen kann.
 */

/** Betrag in Cent zum Mollie-Format: "10.00" als Zeichenkette. */
export function centsAlsBetrag(cents: number): string {
  if (!Number.isInteger(cents) || cents < 0) {
    throw new Error(`Ungueltiger Betrag: ${cents}`);
  }
  return (cents / 100).toFixed(2);
}

/** Und zurueck. Mollie liefert Betraege immer als Zeichenkette mit Punkt. */
export function betragAlsCents(wert: string): number {
  const zahl = Number.parseFloat(wert);
  if (!Number.isFinite(zahl)) throw new Error(`Unlesbarer Betrag vom Anbieter: ${wert}`);
  // Ueber die Zeichenkette gerundet, damit 0.1 + 0.2 nicht zuschlaegt.
  return Math.round(zahl * 100);
}

/**
 * Mollies Zustaende auf unsere abbilden.
 *
 * `expired` faellt bewusst auf CANCELLED und nicht auf FAILED: Eine
 * abgelaufene Zahlung ist keine gescheiterte, sondern eine nicht begonnene.
 * Der Unterschied zaehlt, weil FAILED in der Oberflaeche einen Hinweis
 * ausloest, den eine unbenutzte Zahlung nicht verdient.
 */
export function uebersetzeZustand(status: MollieStatus): PaymentState {
  switch (status) {
    case MollieStatus.paid:
      return 'PAID';
    case MollieStatus.authorized:
      return 'AUTHORIZED';
    case MollieStatus.failed:
      return 'FAILED';
    case MollieStatus.canceled:
    case MollieStatus.expired:
      return 'CANCELLED';
    case MollieStatus.open:
    case MollieStatus.pending:
      return 'PENDING';
    default: {
      /*
       * Ein unbekannter Zustand ist NICHT "bezahlt". Sollte Mollie einen
       * neuen einfuehren, bleibt der Vorgang offen, statt Guthaben
       * freizugeben.
       */
      return 'PENDING';
    }
  }
}

export interface MollieConfig {
  /** Schluessel aus der Umgebung. `test_...` oder `live_...`. */
  apiKey: string | undefined;
  /** Wohin Mollie die Benachrichtigung schickt. Muss oeffentlich erreichbar sein. */
  webhookUrl: string;
  /** Beschreibung, die auf dem Kontoauszug der zahlenden Person erscheint. */
  descriptionPrefix?: string;
}

export class MolliePaymentProvider implements PaymentProvider {
  readonly label = 'Mollie';

  readonly #config: MollieConfig;
  #client: MollieClient | null = null;

  constructor(config: MollieConfig) {
    this.#config = config;
  }

  isAvailable(): boolean {
    const schluessel = this.#config.apiKey?.trim();
    if (!schluessel) return false;
    /*
     * Mollie-Schluessel beginnen mit test_ oder live_. Die Pruefung faengt
     * den haeufigsten Konfigurationsfehler: eine leere oder mit einem
     * Platzhalter belegte Umgebungsvariable.
     */
    return schluessel.startsWith('test_') || schluessel.startsWith('live_');
  }

  /** Laeuft dieser Zugang gegen echtes Geld? */
  get istEchtbetrieb(): boolean {
    return this.#config.apiKey?.trim().startsWith('live_') ?? false;
  }

  #verbindung(): MollieClient {
    if (!this.isAvailable()) {
      throw new Error(
        'Der Zahlungsweg ist nicht eingerichtet: MOLLIE_API_KEY fehlt oder ist ungültig.',
      );
    }
    this.#client ??= createMollieClient({ apiKey: this.#config.apiKey as string });
    return this.#client;
  }

  async createCheckout(request: CheckoutRequest): Promise<CheckoutSession> {
    const beschreibung = `${this.#config.descriptionPrefix ?? 'Guthaben'} — ${request.tokens} Tokens`;

    const zahlung = await this.#verbindung().payments.create({
      amount: {
        currency: request.currency,
        value: centsAlsBetrag(request.amountGrossCents),
      },
      description: beschreibung,
      redirectUrl: request.returnUrl,
      webhookUrl: this.#config.webhookUrl,
      /*
       * Unsere Vorgangskennung wandert in die Metadaten. Der Webhook nennt
       * nur Mollies eigene Kennung -- ohne diesen Rueckweg muessten wir
       * jede Zahlung einzeln nachschlagen, um sie zuzuordnen.
       */
      metadata: { reference: request.reference, userId: request.userId },
    });

    const kasse = zahlung.getCheckoutUrl();
    if (!kasse) {
      throw new Error(
        'Der Anbieter hat keine Bezahlseite geliefert. Der Vorgang wurde nicht begonnen.',
      );
    }

    return { providerReference: zahlung.id, redirectUrl: kasse };
  }

  async getPaymentStatus(providerReference: string): Promise<PaymentStatus> {
    const zahlung = await this.#verbindung().payments.get(providerReference);
    return this.#alsStatus(zahlung);
  }

  /**
   * Eine Rueckkehr von der Bezahlseite pruefen.
   *
   * Ausdruecklich dasselbe wie getPaymentStatus: Die Rueckleitung ist eine
   * Adresse im Browser der zahlenden Person und damit frei waehlbar. Ihr zu
   * glauben hiesse, jedem eine Gutschrift zu geben, der die Rueckkehradresse
   * kennt.
   */
  async verifyPayment(providerReference: string): Promise<PaymentStatus> {
    return this.getPaymentStatus(providerReference);
  }

  /**
   * Die Benachrichtigung des Anbieters verarbeiten.
   *
   * Mollie schickt `id=tr_...` als Formularkoerper, ohne Signatur. Der
   * Koerper wird deshalb nur gelesen, um die Kennung zu erfahren -- alles
   * Weitere kommt aus der Nachfrage beim Anbieter.
   */
  async handleWebhook(
    rawBody: string,
    // Mollie signiert nicht; Kopfzeilen tragen hier nichts bei. Der Parameter
    // bleibt, weil die Schnittstelle ihn fuer signierende Anbieter braucht.
    _headers: Record<string, string> = {},
  ): Promise<WebhookResult> {
    const felder = new URLSearchParams(rawBody);
    const kennung = felder.get('id')?.trim();

    if (!kennung || !/^tr_[A-Za-z0-9]+$/.test(kennung)) {
      throw new Error('Die Benachrichtigung enthält keine gültige Zahlungskennung.');
    }

    const zahlung = await this.#verbindung().payments.get(kennung);
    const metadaten = zahlung.metadata as { reference?: unknown } | null;
    const vorgang = typeof metadaten?.reference === 'string' ? metadaten.reference : null;

    if (!vorgang) {
      throw new Error(
        `Zur Zahlung ${kennung} ist keine Vorgangskennung hinterlegt. Sie lässt sich keinem Kauf zuordnen.`,
      );
    }

    return { reference: vorgang, status: this.#alsStatus(zahlung) };
  }

  async refundPayment(providerReference: string, amountCents: number): Promise<PaymentStatus> {
    const client = this.#verbindung();
    const zahlung = await client.payments.get(providerReference);

    if (zahlung.status !== MollieStatus.paid) {
      throw new Error(
        `Diese Zahlung ist nicht im Zustand „bezahlt" (${zahlung.status}). Eine Erstattung ist nicht möglich.`,
      );
    }

    const gezahlt = betragAlsCents(zahlung.amount.value);
    const bereitsErstattet = zahlung.amountRefunded
      ? betragAlsCents(zahlung.amountRefunded.value)
      : 0;

    if (amountCents > gezahlt - bereitsErstattet) {
      throw new Error(
        'Der Erstattungsbetrag übersteigt den noch nicht erstatteten Teil der Zahlung.',
      );
    }

    await client.paymentRefunds.create({
      paymentId: providerReference,
      amount: { currency: zahlung.amount.currency, value: centsAlsBetrag(amountCents) },
    });

    // Nach der Erstattung den Zustand frisch holen, statt ihn abzuleiten.
    return this.getPaymentStatus(providerReference);
  }

  #alsStatus(zahlung: {
    status: MollieStatus;
    amount: { value: string };
    paidAt?: string | undefined;
  }): PaymentStatus {
    const zustand = uebersetzeZustand(zahlung.status);

    return {
      state: zustand,
      // Der Betrag gilt erst als gezahlt, wenn der Anbieter es sagt.
      paidAmountCents: zustand === 'PAID' ? betragAlsCents(zahlung.amount.value) : null,
      paidAt: zahlung.paidAt ? new Date(zahlung.paidAt) : null,
      providerLabel: this.label,
    };
  }
}
