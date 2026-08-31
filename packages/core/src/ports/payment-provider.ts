/**
 * Zahlungsanbieter.
 *
 * Vorgabe C1 des MASTERPLAN: **kein Stripe**, und die Zahlungslogik ist
 * providerunabhaengig aufzubauen. Diese Schnittstelle ist genau das -- und
 * ausdruecklich nicht die Nachbildung eines bestimmten Anbieters. Die fuenf
 * Methoden stehen so im Plan; alles Weitere waere geraten.
 *
 * Es gibt hier keinen Adapter fuer einen echten Anbieter. Einen zu bauen,
 * ohne dass ein Anbieter feststeht, hiesse dessen Schnittstelle zu erfinden.
 */

export interface CheckoutRequest {
  /** Wer zahlt. */
  userId: string;
  /** Wie viele Tokens gekauft werden. */
  tokens: number;
  /** Bruttobetrag in Cent. */
  amountGrossCents: number;
  currency: 'EUR';
  /** Eindeutige Vorgangskennung auf unserer Seite. Verhindert Doppelbuchungen. */
  reference: string;
  /** Wohin der Anbieter nach Abschluss zurueckleitet. */
  returnUrl: string;
}

export interface CheckoutSession {
  /** Kennung des Vorgangs beim Anbieter. */
  providerReference: string;
  /** Adresse, an die die zahlende Person geschickt wird. */
  redirectUrl: string;
}

export type PaymentState =
  | 'PENDING'
  | 'AUTHORIZED'
  | 'PAID'
  | 'FAILED'
  | 'CANCELLED'
  | 'REFUNDED';

export interface PaymentStatus {
  state: PaymentState;
  /** Tatsaechlich gezahlter Betrag in Cent. Erst ab PAID gesetzt. */
  paidAmountCents: number | null;
  /** Zeitpunkt der Zahlung, sofern bekannt. */
  paidAt: Date | null;
  /** Bezeichnung des Anbieters, fuer Anzeige und Protokoll. */
  providerLabel: string;
}

export interface WebhookResult {
  reference: string;
  status: PaymentStatus;
}

export interface PaymentProvider {
  /** Ob ein Zahlungsweg eingerichtet ist. Wird vor jedem Kauf geprueft. */
  isAvailable(): boolean;
  /** Bezeichnung fuer Anzeige und Protokoll. */
  readonly label: string;

  createCheckout(request: CheckoutRequest): Promise<CheckoutSession>;
  /** Prueft eine Rueckkehr vom Anbieter. Niemals der Rueckleitung glauben. */
  verifyPayment(reference: string): Promise<PaymentStatus>;
  /**
   * Verarbeitet eine Benachrichtigung des Anbieters.
   *
   * Bekommt den Rohkoerper und die Kopfzeilen, weil eine Signatur ueber den
   * unveraenderten Koerper gebildet wird -- geparstes JSON und wieder
   * serialisiertes JSON sind nicht dieselben Bytes.
   */
  handleWebhook(rawBody: string, headers: Record<string, string>): Promise<WebhookResult>;
  refundPayment(reference: string, amountCents: number): Promise<PaymentStatus>;
  getPaymentStatus(reference: string): Promise<PaymentStatus>;
}

/**
 * Ersatz, solange kein Anbieter feststeht (offener Punkt B5).
 *
 * Er meldet sich als nicht verfuegbar und wirft mit einer Meldung, die den
 * Grund nennt. Die Alternative -- einen Anbieter nachzubauen und die
 * Zahlungen im Leeren laufen zu lassen -- waere die schlechteste Loesung:
 * Sie saehe funktionierend aus.
 */
export class UnavailablePaymentProvider implements PaymentProvider {
  readonly label = 'Kein Zahlungsanbieter eingerichtet';

  readonly #grund =
    'Es ist kein Zahlungsweg eingerichtet. Guthaben lässt sich derzeit nicht kaufen; ' +
    'bereits vorhandenes Guthaben funktioniert unverändert.';

  isAvailable(): boolean {
    return false;
  }

  get reason(): string {
    return this.#grund;
  }

  async createCheckout(): Promise<CheckoutSession> {
    throw new Error(this.#grund);
  }
  async verifyPayment(): Promise<PaymentStatus> {
    throw new Error(this.#grund);
  }
  async handleWebhook(): Promise<WebhookResult> {
    throw new Error(this.#grund);
  }
  async refundPayment(): Promise<PaymentStatus> {
    throw new Error(this.#grund);
  }
  async getPaymentStatus(): Promise<PaymentStatus> {
    throw new Error(this.#grund);
  }
}
