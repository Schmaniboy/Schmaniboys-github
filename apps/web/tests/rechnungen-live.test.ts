import { berechneRechnung } from '@ap/core';
import { cancelInvoice, createInvoice, listOwnInvoices, markInvoicePaid, prisma } from '@ap/db';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { benutzerMitSitzung } from './helpers/session';

/**
 * Rechnungen und Kauf ueber die echte Schnittstelle.
 *
 * Zwei Punkte stehen im Mittelpunkt: Die Rechnungsnummer muss auch unter
 * gleichzeitigen Aufrufen eindeutig und fortlaufend bleiben, und ohne
 * eingerichteten Zahlungsweg darf gar kein Vorgang entstehen.
 */

const BASE_URL = process.env.SMOKE_BASE_URL ?? 'http://127.0.0.1:3000';

const reachable = await fetch(`${BASE_URL}/api/health`, { signal: AbortSignal.timeout(2000) })
  .then((r) => r.ok)
  .catch(() => false);

const suite = reachable ? describe : describe.skip;

const marker = `rch${Date.now().toString(36)}`;
let userId = '';
let cookie = '';
let fremdCookie = '';
const angelegteNummern: string[] = [];

async function api(pfad: string, mitCookie: string, body?: unknown, method = 'GET') {
  const antwort = await fetch(`${BASE_URL}${pfad}`, {
    method,
    headers: { 'content-type': 'application/json', cookie: mitCookie },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  const text = await antwort.text();
  return { status: antwort.status, body: text ? JSON.parse(text) : {} };
}

function rechnungsDaten(beschreibung: string, netCents: number) {
  return {
    userId,
    lines: [{ description: beschreibung, quantity: 1, unitNetCents: netCents }],
    tax: { rateBasisPoints: 1900, note: null },
    address: { name: 'Testperson', email: `rechnung.${marker}@example.test` },
    issuedAt: new Date(),
  };
}

suite('Rechnungen und Kauf', () => {
  beforeAll(async () => {
    const person = await benutzerMitSitzung({
      email: `rechnung.${marker}@example.test`,
      displayName: 'Testperson',
      role: 'USER',
    });
    userId = person.userId;
    cookie = person.cookie;

    fremdCookie = (
      await benutzerMitSitzung({
        email: `rechnung.fremd.${marker}@example.test`,
        displayName: 'Fremde Person',
        role: 'USER',
      })
    ).cookie;
  });

  afterAll(async () => {
    await prisma.invoiceItem.deleteMany({ where: { invoiceNumber: { in: angelegteNummern } } });
    await prisma.invoice.deleteMany({ where: { number: { in: angelegteNummern } } });
    await prisma.paymentIntent.deleteMany({ where: { user: { email: { contains: marker } } } });
    await prisma.user.deleteMany({ where: { email: { contains: marker } } });
    await prisma.$disconnect();
  });

  it('legt ohne Zahlungsweg gar keinen Vorgang an', async () => {
    /*
     * Der wichtigste Test hier. Es ist kein Anbieter eingerichtet (B5, C1
     * "kein Stripe"). Die Antwort nennt den Grund, und in der Datenbank
     * bleibt nichts zurueck.
     */
    const vorher = await prisma.paymentIntent.count({ where: { userId } });
    const antwort = await api('/api/guthaben/kaufen', cookie, { paket: 'klein' }, 'POST');

    expect(antwort.status).toBe(501);
    expect(JSON.stringify(antwort.body)).toContain('kein Zahlungsweg');
    expect(JSON.stringify(antwort.body)).toContain('unverändert');

    const nachher = await prisma.paymentIntent.count({ where: { userId } });
    expect(nachher).toBe(vorher);
  });

  it('lehnt ein Paket ab, das es nicht gibt', async () => {
    const antwort = await api('/api/guthaben/kaufen', cookie, { paket: 'phantasie' }, 'POST');
    expect(antwort.status).toBe(400);
  });

  it('vergibt fortlaufende, eindeutige Rechnungsnummern', async () => {
    const erste = await createInvoice(rechnungsDaten('100 Tokens', 1000));
    const zweite = await createInvoice(rechnungsDaten('100 Tokens', 1000));
    angelegteNummern.push(erste.number, zweite.number);

    expect(zweite.serial).toBe(erste.serial + 1);
    expect(erste.number).not.toBe(zweite.number);
    expect(erste.number).toMatch(/^AP-\d{4}-\d{5}$/);
  });

  it('vergibt auch bei gleichzeitigen Aufrufen keine Nummer zweimal', async () => {
    /*
     * Ein Lesen-Rechnen-Schreiben vergaebe hier dieselbe Nummer mehrfach.
     * Doppelte Rechnungsnummern sind kein Schoenheitsfehler.
     */
    const ergebnisse = await Promise.all(
      Array.from({ length: 8 }, () => createInvoice(rechnungsDaten('Gleichzeitig', 500))),
    );
    const nummern = ergebnisse.map((r) => r.number);
    angelegteNummern.push(...nummern);

    expect(new Set(nummern).size).toBe(8);

    const seriennummern = ergebnisse.map((r) => r.serial).sort((a, b) => a - b);
    // Lueckenlos aufsteigend.
    for (let i = 1; i < seriennummern.length; i += 1) {
      expect(seriennummern[i]).toBe((seriennummern[i - 1] ?? 0) + 1);
    }
  });

  it('rechnet Netto, Steuer und Brutto in ganzen Cent', () => {
    const berechnet = berechneRechnung(
      [{ description: 'Paket', quantity: 1, unitNetCents: 2400 }],
      { rateBasisPoints: 1900, note: null },
    );
    expect(berechnet.totals.taxCents).toBe(456);
    expect(berechnet.totals.grossCents).toBe(2856);
  });

  it('friert die Rechnungsanschrift ein', async () => {
    const rechnung = await createInvoice({
      ...rechnungsDaten('Eingefroren', 1000),
      address: {
        name: 'Alter Name',
        email: `rechnung.${marker}@example.test`,
        city: 'Berlin',
      },
    });
    angelegteNummern.push(rechnung.number);

    // Der Anzeigename der Person aendert sich -- die Rechnung nicht.
    await prisma.user.update({ where: { id: userId }, data: { displayName: 'Neuer Name' } });

    const gelesen = await prisma.invoice.findUnique({
      where: { number: rechnung.number },
      select: { billingName: true, billingCity: true },
    });
    expect(gelesen?.billingName).toBe('Alter Name');
    expect(gelesen?.billingCity).toBe('Berlin');
  });

  it('setzt eine Rechnung genau einmal auf bezahlt', async () => {
    const rechnung = await createInvoice(rechnungsDaten('Bezahlt', 1000));
    angelegteNummern.push(rechnung.number);

    await markInvoicePaid(rechnung.number, new Date(), 'ref-1');
    await expect(markInvoicePaid(rechnung.number, new Date(), 'ref-1')).rejects.toThrow();
  });

  it('storniert statt zu loeschen und verlangt einen Grund', async () => {
    const rechnung = await createInvoice(rechnungsDaten('Storniert', 1000));
    angelegteNummern.push(rechnung.number);

    await expect(cancelInvoice(rechnung.number, 'x', new Date())).rejects.toThrow();
    await cancelInvoice(rechnung.number, 'Versehentlich doppelt erstellt.', new Date());

    // Die Zeile bleibt -- sonst bekaeme die Nummernfolge Luecken.
    const gelesen = await prisma.invoice.findUnique({
      where: { number: rechnung.number },
      select: { status: true, cancellationReason: true },
    });
    expect(gelesen?.status).toBe('CANCELLED');
    expect(gelesen?.cancellationReason).toContain('Versehentlich');
  });

  it('zeigt nur die eigenen Rechnungen', async () => {
    const eigene = await api('/api/rechnungen', cookie);
    expect(eigene.status).toBe(200);
    const daten = eigene.body as { data: { invoices: { number: string }[] } };
    expect(daten.data.invoices.length).toBeGreaterThan(0);

    const fremde = await api('/api/rechnungen', fremdCookie);
    const fremdDaten = fremde.body as { data: { invoices: { number: string }[] } };
    expect(fremdDaten.data.invoices).toHaveLength(0);
  });

  it('zeigt eine fremde Rechnung als nicht gefunden, nicht als verboten', async () => {
    const meine = await listOwnInvoices(userId);
    const nummer = meine[0]?.number ?? '';
    expect(nummer).not.toBe('');

    // Bei fortlaufenden Nummern waere ein 403 besonders bequem zum Aufzaehlen.
    const seite = await fetch(`${BASE_URL}/konto/rechnungen/${encodeURIComponent(nummer)}`, {
      headers: { cookie: fremdCookie },
    });
    expect(seite.status).toBe(404);
  });

  it('zeigt die eigene Rechnung mit allen geforderten Angaben', async () => {
    const meine = await listOwnInvoices(userId);
    const nummer = meine[0]?.number ?? '';

    const seite = await fetch(`${BASE_URL}/konto/rechnungen/${encodeURIComponent(nummer)}`, {
      headers: { cookie },
    });
    expect(seite.status).toBe(200);
    const html = await seite.text();

    for (const pflicht of ['Rechnungsdatum', 'Positionen', 'Umsatzsteuer', 'Gesamtbetrag']) {
      expect(html).toContain(pflicht);
    }
    expect(html).toContain(nummer);
  });
});
