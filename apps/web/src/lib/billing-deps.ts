import {
  DEFAULT_TAX_RATE_BASIS_POINTS,
  MolliePaymentProvider,
  UnavailablePaymentProvider,
  findPackage,
  systemClock,
  type ConfirmDeps,
  type PurchaseDeps,
} from '@ap/core';
import {
  auditLogger,
  createInvoice,
  createPaymentIntent,
  findPaymentIntent,
  markPaymentPaid,
  prisma,
  walletRepository,
} from '@ap/db';

import { env } from './env';

/**
 * Verdrahtung von Kauf und Rechnung.
 *
 * Der Anbieter ist Mollie (ADR-012, Vorgabe C1 "kein Stripe"). Er wird nur
 * genommen, wenn ein Schluessel in der Umgebung steht -- ohne ihn tritt die
 * Ersatzvariante an seine Stelle und meldet sich ehrlich als nicht
 * eingerichtet.
 *
 * Diese Entscheidung faellt beim Start und nicht bei jedem Kauf: Ein
 * Zahlungsweg, der je nach Anfrage einmal da ist und einmal nicht, waere
 * schwerer zu erklaeren als einer, der durchgehend fehlt.
 */
const mollie = new MolliePaymentProvider({
  apiKey: env.MOLLIE_API_KEY,
  webhookUrl: env.MOLLIE_WEBHOOK_URL ?? `${env.APP_URL}/api/zahlungen/mollie`,
  descriptionPrefix: 'CARONEX Guthaben',
});

const zahlungsanbieter = mollie.isAvailable() ? mollie : new UnavailablePaymentProvider();

export const paymentProvider = zahlungsanbieter;

/** Fuer die Oberflaeche: Laeuft der Zahlungsweg gegen echtes Geld? */
export const zahlungImEchtbetrieb = zahlungsanbieter === mollie && mollie.istEchtbetrieb;

export const purchaseDeps: PurchaseDeps = {
  payments: zahlungsanbieter,
  clock: systemClock,
  audit: auditLogger,
  taxRateBasisPoints: env.TAX_RATE_BASIS_POINTS,
  appUrl: env.APP_URL,
  createIntent: async (input) => createPaymentIntent(input),
};

export const confirmDeps: ConfirmDeps = {
  payments: zahlungsanbieter,
  clock: systemClock,
  audit: auditLogger,
  findIntent: async (reference) => findPaymentIntent(reference),
  markPaid: markPaymentPaid,
  credit: async ({ userId, amountTokens, reference }) => {
    await walletRepository.credit({
      userId,
      amountTokens,
      type: 'PURCHASE',
      purpose: 'Guthaben gekauft',
      reference,
      actorId: null,
    });
  },
  issueInvoice: async ({ userId, tokens, reference, issuedAt }) => {
    const person = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        displayName: true,
        dealer: {
          select: { name: true, street: true, postalCode: true, city: true, vatId: true },
        },
      },
    });
    if (!person) throw new Error(`Unbekannte Person beim Rechnungsstellen: ${userId}`);

    const paket = leseTokenPaket(reference, tokens);

    /*
     * Rechnungsanschrift: Gehoert die Person zu einem Betrieb, wird dessen
     * Anschrift genommen -- ein gewerblicher Kauf gehoert auf den Betrieb.
     * Sonst reichen Name und E-Mail; eine Privatanschrift erheben wir nicht,
     * und eine zu erfinden waere absurd.
     */
    const rechnung = await createInvoice({
      userId,
      lines: [
        {
          description: paket ? `${paket.label} (${tokens} Tokens)` : `${tokens} Tokens`,
          quantity: 1,
          unitNetCents: paket?.netCents ?? 0,
        },
      ],
      tax: { rateBasisPoints: env.TAX_RATE_BASIS_POINTS, note: null },
      address: {
        name: person.dealer?.name ?? person.displayName,
        email: person.email,
        street: person.dealer?.street ?? null,
        postalCode: person.dealer?.postalCode ?? null,
        city: person.dealer?.city ?? null,
        vatId: person.dealer?.vatId ?? null,
      },
      paymentReference: reference,
      issuedAt,
    });

    await auditLogger.record({
      action: 'invoice.issued',
      actorId: null,
      subjectType: 'Invoice',
      subjectId: rechnung.number,
      metadata: { grossCents: rechnung.grossCents },
    });

    return rechnung.number;
  },
};

/** Holt das Paket aus der Vorgangskennung `tokens:<user>:<paket>:<zeit>`. */
function leseTokenPaket(reference: string, tokens: number) {
  const teile = reference.split(':');
  const paket = teile.length >= 3 ? findPackage(teile[2] ?? '') : null;
  // Nur nehmen, wenn die Tokenzahl auch passt -- sonst stimmt der Preis nicht.
  return paket && paket.tokens === tokens ? paket : null;
}

export const TAX_RATE_BASIS_POINTS = env.TAX_RATE_BASIS_POINTS;
export const DEFAULT_TAX_RATE = DEFAULT_TAX_RATE_BASIS_POINTS;
