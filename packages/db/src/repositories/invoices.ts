import {
  baueRechnungsnummer,
  berechneRechnung,
  errors,
  type InvoiceLine,
  type TaxTreatment,
} from '@ap/core';

import { type Prisma, prisma } from '../client';

/**
 * Rechnungen.
 *
 * Die heikle Stelle ist die Nummernvergabe. Sie muss eindeutig und
 * fortlaufend sein, und beides bricht unter Last, wenn man liest, rechnet
 * und dann schreibt. Deshalb: ein bedingtes UPDATE mit Rueckgabe, in
 * derselben Transaktion wie die Rechnung.
 */

const RECHNUNG_FELDER = {
  number: true,
  year: true,
  serial: true,
  userId: true,
  paymentIntentId: true,
  status: true,
  billingName: true,
  billingEmail: true,
  billingStreet: true,
  billingPostalCode: true,
  billingCity: true,
  billingVatId: true,
  netCents: true,
  taxCents: true,
  grossCents: true,
  taxRateBasisPoints: true,
  taxNote: true,
  paymentState: true,
  paymentReference: true,
  issuedAt: true,
  paidAt: true,
  cancelledAt: true,
  cancellationReason: true,
  items: {
    orderBy: { position: 'asc' },
    select: {
      position: true,
      description: true,
      quantity: true,
      unitNetCents: true,
      lineNetCents: true,
    },
  },
} satisfies Prisma.InvoiceSelect;

export type InvoiceRecord = Prisma.InvoiceGetPayload<{ select: typeof RECHNUNG_FELDER }>;

/**
 * Naechste laufende Nummer eines Jahres.
 *
 * Muss innerhalb einer Transaktion laufen. Das `upsert` legt die Jahreszeile
 * beim ersten Mal an; das `increment` ist atomar und gibt den neuen Stand
 * zurueck -- damit kann keine Nummer zweimal vergeben werden.
 */
async function naechsteNummer(
  tx: Prisma.TransactionClient,
  jahr: number,
): Promise<number> {
  const zeile = await tx.invoiceSequence.upsert({
    where: { year: jahr },
    create: { year: jahr, lastSerial: 1 },
    update: { lastSerial: { increment: 1 } },
    select: { lastSerial: true },
  });
  return zeile.lastSerial;
}

export interface BillingAddress {
  name: string;
  email: string;
  street?: string | null;
  postalCode?: string | null;
  city?: string | null;
  vatId?: string | null;
}

export async function createInvoice(input: {
  userId: string;
  lines: InvoiceLine[];
  tax: TaxTreatment;
  address: BillingAddress;
  paymentIntentId?: string | null;
  paymentReference?: string | null;
  issuedAt: Date;
}): Promise<InvoiceRecord> {
  // Fachliche Berechnung in der Domaenenschicht, nicht hier.
  const berechnet = berechneRechnung(input.lines, input.tax);
  const jahr = input.issuedAt.getFullYear();

  return prisma.$transaction(async (tx) => {
    const laufend = await naechsteNummer(tx, jahr);
    const nummer = baueRechnungsnummer(jahr, laufend);

    return tx.invoice.create({
      data: {
        number: nummer,
        year: jahr,
        serial: laufend,
        userId: input.userId,
        paymentIntentId: input.paymentIntentId ?? null,
        status: 'OPEN',
        // Kopiert, nicht verwiesen: Eine spaeter geaenderte Anschrift darf
        // eine ausgestellte Rechnung nicht veraendern.
        billingName: input.address.name,
        billingEmail: input.address.email,
        billingStreet: input.address.street ?? null,
        billingPostalCode: input.address.postalCode ?? null,
        billingCity: input.address.city ?? null,
        billingVatId: input.address.vatId ?? null,
        netCents: berechnet.totals.netCents,
        taxCents: berechnet.totals.taxCents,
        grossCents: berechnet.totals.grossCents,
        taxRateBasisPoints: berechnet.totals.rateBasisPoints,
        taxNote: berechnet.taxNote,
        paymentReference: input.paymentReference ?? null,
        issuedAt: input.issuedAt,
        items: {
          create: berechnet.lines.map((line, index) => ({
            position: index + 1,
            description: line.description,
            quantity: line.quantity,
            unitNetCents: line.unitNetCents,
            lineNetCents: line.lineNetCents,
          })),
        },
      },
      select: RECHNUNG_FELDER,
    });
  });
}

export async function markInvoicePaid(
  nummer: string,
  paidAt: Date,
  paymentReference: string | null,
): Promise<void> {
  const geaendert = await prisma.invoice.updateMany({
    where: { number: nummer, status: 'OPEN' },
    data: { status: 'PAID', paymentState: 'PAID', paidAt, paymentReference },
  });
  if (geaendert.count === 0) {
    throw errors.conflict('Diese Rechnung ist nicht mehr offen.');
  }
}

/**
 * Storniert eine Rechnung.
 *
 * Geloescht wird nie: Die Nummernfolge bekaeme sonst Luecken, und eine
 * Rechnung, die es nicht mehr gibt, laesst sich nicht mehr erklaeren. Der
 * Grund ist Pflicht.
 */
export async function cancelInvoice(
  nummer: string,
  grund: string,
  cancelledAt: Date,
): Promise<void> {
  if (grund.trim().length < 5) {
    throw errors.validation({
      cancellationReason: ['Bitte einen Grund angeben. Er bleibt bei der Rechnung stehen.'],
    });
  }

  const geaendert = await prisma.invoice.updateMany({
    where: { number: nummer, status: { not: 'CANCELLED' } },
    data: { status: 'CANCELLED', cancelledAt, cancellationReason: grund.trim() },
  });
  if (geaendert.count === 0) throw errors.notFound();
}

export async function findOwnInvoice(
  nummer: string,
  userId: string,
): Promise<InvoiceRecord | null> {
  return prisma.invoice.findFirst({
    where: { number: nummer, userId },
    select: RECHNUNG_FELDER,
  });
}

export async function listOwnInvoices(userId: string): Promise<InvoiceRecord[]> {
  return prisma.invoice.findMany({
    where: { userId },
    orderBy: { issuedAt: 'desc' },
    take: 200,
    select: RECHNUNG_FELDER,
  });
}

/* --- Zahlungsvorgaenge --------------------------------------------------- */

export async function createPaymentIntent(input: {
  userId: string;
  reference: string;
  providerLabel: string;
  tokens: number;
  amountGrossCents: number;
}) {
  return prisma.paymentIntent.create({
    data: {
      userId: input.userId,
      reference: input.reference,
      providerLabel: input.providerLabel,
      tokens: input.tokens,
      amountGrossCents: input.amountGrossCents,
    },
    select: {
      id: true,
      reference: true,
      state: true,
      tokens: true,
      amountGrossCents: true,
    },
  });
}

export async function findPaymentIntent(reference: string) {
  return prisma.paymentIntent.findUnique({
    where: { reference },
    select: {
      id: true,
      userId: true,
      reference: true,
      // Ohne die Anbieterkennung laesst sich beim Anbieter nichts nachfragen.
      providerReference: true,
      state: true,
      tokens: true,
      amountGrossCents: true,
      paidAt: true,
      providerLabel: true,
    },
  });
}

/**
 * Setzt einen Zahlungsvorgang auf bezahlt -- genau einmal.
 *
 * Die Bedingung `state: 'PENDING'` ist die Absicherung gegen doppelte
 * Rueckmeldungen des Anbieters: Die zweite aendert nichts und meldet das
 * auch. Ohne sie bekaeme jemand sein Guthaben zweimal gutgeschrieben.
 */
export async function markPaymentPaid(input: {
  reference: string;
  paidAmountCents: number;
  paidAt: Date;
  providerReference: string | null;
}): Promise<boolean> {
  const geaendert = await prisma.paymentIntent.updateMany({
    where: { reference: input.reference, state: { in: ['PENDING', 'AUTHORIZED'] } },
    data: {
      state: 'PAID',
      paidAmountCents: input.paidAmountCents,
      paidAt: input.paidAt,
      providerReference: input.providerReference,
    },
  });
  return geaendert.count === 1;
}

export async function setPaymentState(
  reference: string,
  state: 'FAILED' | 'CANCELLED' | 'REFUNDED' | 'AUTHORIZED',
): Promise<void> {
  await prisma.paymentIntent.updateMany({ where: { reference }, data: { state } });
}
