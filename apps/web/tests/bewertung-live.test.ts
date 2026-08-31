import { prisma, walletRepository } from '@ap/db';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { benutzerMitSitzung } from './helpers/session';

/**
 * Die Fahrzeugbewertung ueber die echte Schnittstelle.
 *
 * Die wichtigste Zusage: Ohne Marktdatenquelle kommt KEIN Eurobetrag zurueck
 * und es wird KEIN Guthaben abgebucht -- aber die Faktorenanalyse kommt
 * trotzdem. Genau so ist die Anwendung derzeit eingerichtet (Blocker B4),
 * dieser Test haelt den Zustand fest.
 */

const BASE_URL = process.env.SMOKE_BASE_URL ?? 'http://127.0.0.1:3000';

const reachable = await fetch(`${BASE_URL}/api/health`, { signal: AbortSignal.timeout(2000) })
  .then((r) => r.ok)
  .catch(() => false);

const suite = reachable ? describe : describe.skip;

const marker = `bew${Date.now().toString(36)}`;
const ids: Record<string, string> = {};
let redaktionCookie = '';
let verkaufCookie = '';
let userId = '';
let entwurfId = '';

async function api(pfad: string, cookie: string, body?: unknown, method = 'POST') {
  const antwort = await fetch(`${BASE_URL}${pfad}`, {
    method,
    headers: { 'content-type': 'application/json', cookie },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  const text = await antwort.text();
  return { status: antwort.status, body: text ? JSON.parse(text) : {} };
}

function nimmId(antwort: { body: Record<string, unknown> }, schluessel: string): string {
  const daten = antwort.body.data as Record<string, { id: string }> | undefined;
  return daten?.[schluessel]?.id ?? '';
}

async function veroeffentlichen(subject: string, eintragId: string) {
  await api(`/api/katalog/eintraege/${subject}/${eintragId}/quellen`, redaktionCookie, {
    title: `Beleg ${marker}`,
    kind: 'MANUFACTURER_DOCUMENT',
  });
  await api(
    `/api/katalog/eintraege/${subject}/${eintragId}/status`,
    redaktionCookie,
    { status: 'IN_REVIEW' },
    'PATCH',
  );
  const antwort = await api(
    `/api/katalog/eintraege/${subject}/${eintragId}/status`,
    redaktionCookie,
    { status: 'PUBLISHED' },
    'PATCH',
  );
  expect(antwort.status, `${subject} veroeffentlichen`).toBe(200);
}

interface BewertungsAntwort {
  data?: {
    charged: number;
    valuation: {
      basis: string;
      marketValueCents: number | null;
      suggestedListingCents: number | null;
      realisticRange: unknown;
      factors: { id: string; label: string; reasoning: string; adjustment: number }[];
      valueReducers: { id: string }[];
      missingFields: string[];
      reasoning: string[];
      disclaimer: string;
      assumptionNotes: string[];
    };
  };
  error?: { code?: string; message?: string };
}

suite('Fahrzeugbewertung', () => {
  beforeAll(async () => {
    redaktionCookie = (
      await benutzerMitSitzung({
        email: `bewertung.redaktion.${marker}@example.test`,
        displayName: 'Redaktion',
        role: 'EDITOR',
      })
    ).cookie;
    const person = await benutzerMitSitzung({
      email: `bewertung.verkauf.${marker}@example.test`,
      displayName: 'Verkauf',
      role: 'USER',
    });
    verkaufCookie = person.cookie;
    userId = person.userId;

    ids.marke = nimmId(
      await api('/api/katalog/hersteller', redaktionCookie, { name: `Bewertungsmarke ${marker}` }),
      'manufacturer',
    );
    ids.modell = nimmId(
      await api('/api/katalog/modelle', redaktionCookie, {
        manufacturerId: ids.marke,
        name: `Bewertungsmodell ${marker}`,
      }),
      'model',
    );
    ids.generation = nimmId(
      await api('/api/katalog/generationen', redaktionCookie, {
        modelId: ids.modell,
        name: 'Bewertungsgeneration',
        yearFrom: 2014,
        yearTo: 2020,
      }),
      'generation',
    );
    await veroeffentlichen('manufacturer', ids.marke);
    await veroeffentlichen('model', ids.modell);
    await veroeffentlichen('generation', ids.generation);

    await walletRepository.credit({
      userId,
      amountTokens: 100,
      type: 'ADMIN_CREDIT',
      purpose: 'Testguthaben',
      reference: `${marker}-guthaben`,
      actorId: null,
    });

    entwurfId = nimmId(
      await api('/api/verkaufen/entwuerfe', verkaufCookie, { vin: 'WBA3A5C55DF123456' }),
      'draft',
    );
    expect(entwurfId).not.toBe('');
  });

  afterAll(async () => {
    await prisma.tokenHold.deleteMany({ where: { wallet: { userId } } });
    await prisma.tokenTransaction.deleteMany({ where: { wallet: { userId } } });
    await prisma.wallet.deleteMany({ where: { userId } });
    await prisma.listingDraft.deleteMany({ where: { owner: { email: { contains: marker } } } });
    await prisma.generation.deleteMany({ where: { id: ids.generation } });
    await prisma.model.deleteMany({ where: { id: ids.modell } });
    await prisma.manufacturer.deleteMany({ where: { id: ids.marke } });
    await prisma.source.deleteMany({ where: { title: { contains: marker } } });
    await prisma.user.deleteMany({ where: { email: { contains: marker } } });
    await prisma.$disconnect();
  });

  it('bewertet nichts ohne bestaetigtes Fahrzeug', async () => {
    const antwort = await api(`/api/verkaufen/entwuerfe/${entwurfId}/bewertung`, verkaufCookie);
    expect(antwort.status).toBe(409);
    expect(JSON.stringify(antwort.body)).toContain('bestätigen');
  });

  it('zeigt einen fremden Entwurf nicht', async () => {
    const fremd = (
      await benutzerMitSitzung({
        email: `bewertung.fremd.${marker}@example.test`,
        displayName: 'Fremde Person',
        role: 'USER',
      })
    ).cookie;
    const antwort = await api(`/api/verkaufen/entwuerfe/${entwurfId}/bewertung`, fremd);
    // Nicht 403: Ein Verbot bestaetigte, dass es diese Kennung gibt.
    expect(antwort.status).toBe(404);
  });

  it('nennt ohne Marktdatenquelle keinen Eurobetrag und bucht nichts ab', async () => {
    const bestaetigt = await api(
      `/api/verkaufen/entwuerfe/${entwurfId}/fahrzeug`,
      verkaufCookie,
      { manufacturerId: ids.marke, modelId: ids.modell, generationId: ids.generation },
      'PATCH',
    );
    expect(bestaetigt.status).toBe(200);

    await api(
      `/api/verkaufen/entwuerfe/${entwurfId}/angaben`,
      verkaufCookie,
      {
        mileageKm: 90_000,
        firstRegistration: '2016-05-01',
        previousOwners: 1,
        condition: 'GOOD',
        serviceHistory: 'FULL_MANUFACTURER',
      },
      'PATCH',
    );

    const vorher = await walletRepository.ensureWallet(userId);
    const antwort = await api(`/api/verkaufen/entwuerfe/${entwurfId}/bewertung`, verkaufCookie);
    expect(antwort.status).toBe(200);

    const inhalt = antwort.body as BewertungsAntwort;
    const bewertung = inhalt.data?.valuation;
    expect(inhalt.data?.charged).toBe(0);
    expect(bewertung?.basis).toBe('NONE');
    expect(bewertung?.marketValueCents).toBeNull();
    expect(bewertung?.suggestedListingCents).toBeNull();
    expect(bewertung?.realisticRange).toBeNull();

    // Aber die Faktorenanalyse kommt.
    expect((bewertung?.factors.length ?? 0)).toBeGreaterThan(0);
    for (const faktor of bewertung?.factors ?? []) {
      expect(faktor.reasoning.length).toBeGreaterThan(10);
    }
    expect(bewertung?.reasoning.join(' ')).toContain('kein Guthaben verbraucht');
    expect(bewertung?.disclaimer).toContain('Schätzung');
    expect(bewertung?.assumptionNotes.join(' ')).toContain('keine gemessenen Marktwerte');

    const nachher = await walletRepository.ensureWallet(userId);
    expect(nachher.balanceTokens).toBe(vorher.balanceTokens);
    expect(nachher.reservedTokens).toBe(0);
  });

  it('nennt fehlende Angaben, statt sie zu schaetzen', async () => {
    const antwort = await api(`/api/verkaufen/entwuerfe/${entwurfId}/bewertung`, verkaufCookie);
    const bewertung = (antwort.body as BewertungsAntwort).data?.valuation;
    // HU und Unfallangabe wurden nicht gesetzt.
    expect(bewertung?.missingFields).toContain('HU gültig bis');
    expect(bewertung?.missingFields).toContain('Angabe zum Unfallschaden');
    // Eine fehlende Unfallangabe ist kein "unfallfrei" und kein Abschlag.
    expect(bewertung?.valueReducers.some((f) => f.id === 'accident')).toBe(false);
  });
});
