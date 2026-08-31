import { beforeEach, describe, expect, it } from 'vitest';

import { Role } from '../auth/roles';
import { AppError, ErrorCode } from '../errors';
import { fixedClock } from '../ports/clock';
import type {
  CheckoutSession,
  PaymentProvider,
  PaymentStatus,
  WebhookResult,
} from '../ports/payment-provider';
import { UnavailablePaymentProvider } from '../ports/payment-provider';

import { RecordingAuditLogger } from './fakes';
import {
  confirmTokenPurchase,
  startTokenPurchase,
  type ConfirmDeps,
  type PurchaseDeps,
} from './billing';

const JETZT = new Date('2026-08-22T12:00:00.000Z');
const kaeufer = { userId: 'u1', role: Role.USER, dealerId: null };

/** Ein Anbieter, der sich steuern laesst. */
class FakeProvider implements PaymentProvider {
  readonly label = 'Testanbieter';
  verfuegbar = true;
  status: PaymentStatus = {
    state: 'PAID',
    paidAmountCents: 1071,
    paidAt: JETZT,
    providerLabel: 'Testanbieter',
  };
  checkouts = 0;

  isAvailable(): boolean {
    return this.verfuegbar;
  }
  async createCheckout(): Promise<CheckoutSession> {
    this.checkouts += 1;
    return { providerReference: 'anbieter-1', redirectUrl: 'https://anbieter.test/zahlen' };
  }
  async verifyPayment(): Promise<PaymentStatus> {
    return this.status;
  }
  async handleWebhook(): Promise<WebhookResult> {
    return { reference: 'x', status: this.status };
  }
  async refundPayment(): Promise<PaymentStatus> {
    return this.status;
  }
  async getPaymentStatus(): Promise<PaymentStatus> {
    return this.status;
  }
}

let provider: FakeProvider;
let audit: RecordingAuditLogger;
let angelegte: { userId: string; reference: string; tokens: number; amountGrossCents: number }[];
let gutschriften: { userId: string; amountTokens: number; reference: string }[];
let rechnungen: string[];
let bezahlt: Set<string>;

function kaufDeps(): PurchaseDeps {
  return {
    payments: provider,
    clock: fixedClock(JETZT),
    audit,
    taxRateBasisPoints: 1900,
    appUrl: 'https://beispiel.test',
    createIntent: async (input) => {
      angelegte.push(input);
      return { id: `intent-${angelegte.length}`, reference: input.reference };
    },
  };
}

function bestaetigungsDeps(vorgang: {
  state: string;
  tokens: number;
  amountGrossCents: number;
  /** Ohne sie gibt es beim Anbieter nichts nachzufragen. */
  providerReference?: string | null;
}): ConfirmDeps {
  return {
    payments: provider,
    clock: fixedClock(JETZT),
    audit,
    findIntent: async (reference) => ({
      id: 'intent-1',
      userId: 'u1',
      reference,
      providerReference:
        vorgang.providerReference === undefined ? 'tr_test' : vorgang.providerReference,
      state: vorgang.state,
      tokens: vorgang.tokens,
      amountGrossCents: vorgang.amountGrossCents,
    }),
    markPaid: async ({ reference }) => {
      if (bezahlt.has(reference)) return false;
      bezahlt.add(reference);
      return true;
    },
    credit: async (input) => {
      gutschriften.push(input);
    },
    issueInvoice: async () => {
      const nummer = `AP-2026-${String(rechnungen.length + 1).padStart(5, '0')}`;
      rechnungen.push(nummer);
      return nummer;
    },
  };
}

async function codeOf(aktion: () => Promise<unknown>): Promise<string> {
  try {
    await aktion();
    return 'kein Fehler';
  } catch (error) {
    return error instanceof AppError ? error.code : 'falscher Fehlertyp';
  }
}

beforeEach(() => {
  provider = new FakeProvider();
  audit = new RecordingAuditLogger();
  angelegte = [];
  gutschriften = [];
  rechnungen = [];
  bezahlt = new Set();
});

describe('Guthaben kaufen', () => {
  it('legt einen Vorgang an und schickt zum Anbieter', async () => {
    const ergebnis = await startTokenPurchase(kaufDeps(), kaeufer, 'klein');

    expect(ergebnis.paket.tokens).toBe(50);
    // 900 netto + 19 % = 1071 brutto.
    expect(ergebnis.amountGrossCents).toBe(1071);
    expect(ergebnis.redirectUrl).toContain('https://');
    expect(angelegte).toHaveLength(1);
    expect(audit.actions()).toContain('payment.started');
  });

  it('legt ohne eingerichteten Anbieter gar keinen Vorgang an', async () => {
    /*
     * Der wichtigste Test hier. Ein Vorgang, der nie zu einer Zahlung fuehren
     * kann, gehoert nicht in die Datenbank -- und der Nutzer bekommt einen
     * Grund statt einer leeren Seite.
     */
    const deps = { ...kaufDeps(), payments: new UnavailablePaymentProvider() };
    expect(await codeOf(() => startTokenPurchase(deps, kaeufer, 'klein'))).toBe(
      ErrorCode.NOT_IMPLEMENTED,
    );
    expect(angelegte).toHaveLength(0);
    expect(provider.checkouts).toBe(0);
  });

  it('verlangt eine Anmeldung', async () => {
    expect(await codeOf(() => startTokenPurchase(kaufDeps(), null, 'klein'))).toBe(
      ErrorCode.UNAUTHENTICATED,
    );
  });

  it('lehnt ein Paket ab, das es nicht gibt', async () => {
    expect(await codeOf(() => startTokenPurchase(kaufDeps(), kaeufer, 'phantasie'))).toBe(
      ErrorCode.VALIDATION_FAILED,
    );
  });
});

describe('Zahlung bestaetigen', () => {
  const vorgang = { state: 'PENDING', tokens: 50, amountGrossCents: 1071 };

  it('schreibt gut und stellt eine Rechnung aus', async () => {
    const ergebnis = await confirmTokenPurchase(bestaetigungsDeps(vorgang), 'ref-1');

    expect(ergebnis.credited).toBe(true);
    expect(gutschriften).toEqual([{ userId: 'u1', amountTokens: 50, reference: 'ref-1' }]);
    expect(ergebnis.invoiceNumber).toBe('AP-2026-00001');
    expect(audit.actions()).toContain('payment.confirmed');
  });

  it('schreibt bei einer zweiten Rueckmeldung nichts noch einmal gut', async () => {
    const deps = bestaetigungsDeps(vorgang);
    await confirmTokenPurchase(deps, 'ref-1');
    const zweite = await confirmTokenPurchase(deps, 'ref-1');

    expect(zweite.credited).toBe(false);
    expect(gutschriften).toHaveLength(1);
    expect(rechnungen).toHaveLength(1);
    expect(zweite.message).toContain('bereits verbucht');
  });

  it('glaubt der Rueckleitung nicht, sondern fragt beim Anbieter nach', async () => {
    // Der Anbieter sagt "noch nicht bezahlt" -- also wird nichts gutgeschrieben,
    // auch wenn jemand die Rueckleitung selbst aufruft.
    provider.status = { ...provider.status, state: 'PENDING', paidAmountCents: null };
    const ergebnis = await confirmTokenPurchase(bestaetigungsDeps(vorgang), 'ref-1');

    expect(ergebnis.credited).toBe(false);
    expect(gutschriften).toHaveLength(0);
    expect(ergebnis.message).toContain('noch nicht abgeschlossen');
  });

  it('schreibt bei zu geringem Betrag nichts gut', async () => {
    // Sonst liesse sich mit einem manipulierten Anbietervorgang billiger
    // einkaufen.
    provider.status = { ...provider.status, paidAmountCents: 100 };
    expect(await codeOf(() => confirmTokenPurchase(bestaetigungsDeps(vorgang), 'ref-1'))).toBe(
      ErrorCode.CONFLICT,
    );
    expect(gutschriften).toHaveLength(0);
    expect(audit.actions()).toContain('payment.failed');
  });

  it('meldet einen bereits bezahlten Vorgang, ohne erneut gutzuschreiben', async () => {
    const ergebnis = await confirmTokenPurchase(
      bestaetigungsDeps({ ...vorgang, state: 'PAID' }),
      'ref-1',
    );
    expect(ergebnis.credited).toBe(false);
    expect(gutschriften).toHaveLength(0);
  });

  it('meldet einen unbekannten Vorgang als nicht gefunden', async () => {
    const deps = { ...bestaetigungsDeps(vorgang), findIntent: async () => null };
    expect(await codeOf(() => confirmTokenPurchase(deps, 'gibtsnicht'))).toBe(
      ErrorCode.NOT_FOUND,
    );
  });

  it('meldet eine gescheiterte Zahlung ehrlich', async () => {
    provider.status = { ...provider.status, state: 'FAILED', paidAmountCents: null };
    const ergebnis = await confirmTokenPurchase(bestaetigungsDeps(vorgang), 'ref-1');
    expect(ergebnis.credited).toBe(false);
    expect(ergebnis.message).toContain('nichts abgebucht');
  });
});

describe('Vorgang ohne Anbieterkennung', () => {
  it('schreibt nichts gut und sagt, dass nichts abgebucht wurde', async () => {
    /*
     * Der Fall entsteht, wenn das Anlegen der Bezahlseite fehlschlug. Es gibt
     * beim Anbieter nichts nachzufragen -- und ohne Nachfrage darf nichts
     * gutgeschrieben werden.
     */
    const ergebnis = await confirmTokenPurchase(
      bestaetigungsDeps({
        state: 'PENDING',
        tokens: 100,
        amountGrossCents: 1000,
        providerReference: null,
      }),
      'ref-ohne-anbieter',
    );

    expect(ergebnis.credited).toBe(false);
    expect(ergebnis.message).toContain('nichts abgebucht');
  });
});
