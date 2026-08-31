import { prisma, walletRepository } from '@ap/db';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { benutzerMitSitzung } from './helpers/session';

/**
 * Der Verkaufsassistent ueber die echte Schnittstelle.
 *
 * Die wichtigste Zusage: Aus der VIN wird nichts abgeleitet, was nicht darin
 * steht. Die Antwort auf eine VIN enthaelt Hersteller, Herkunft und einen
 * Modelljahrhinweis -- kein Modell, keine Generation, keinen Motor.
 */

const BASE_URL = process.env.SMOKE_BASE_URL ?? 'http://127.0.0.1:3000';

const reachable = await fetch(`${BASE_URL}/api/health`, { signal: AbortSignal.timeout(2000) })
  .then((r) => r.ok)
  .catch(() => false);

const suite = reachable ? describe : describe.skip;

const marker = `vkf${Date.now().toString(36)}`;
const TEST_VIN = 'WBA3A5C50F5A12345';

let cookie = '';
let fremdCookie = '';
const katalog: Record<string, string> = {};
let userId = '';
let draftId = '';

async function api(
  pfad: string,
  optionen: { method?: string; body?: unknown; cookie?: string } = {},
) {
  const antwort = await fetch(`${BASE_URL}${pfad}`, {
    method: optionen.method ?? 'GET',
    headers: {
      'content-type': 'application/json',
      ...(optionen.cookie === undefined ? { cookie } : optionen.cookie ? { cookie: optionen.cookie } : {}),
    },
    ...(optionen.body !== undefined ? { body: JSON.stringify(optionen.body) } : {}),
  });
  const text = await antwort.text();
  return { status: antwort.status, body: text ? JSON.parse(text) : {} };
}

suite('Verkaufsassistent', () => {
  beforeAll(async () => {
    const person = await benutzerMitSitzung({
      email: `verkauf.${marker}@example.test`,
      displayName: 'Verkaufende Person',
      role: 'USER',
    });
    userId = person.userId;
    cookie = person.cookie;

    fremdCookie = (
      await benutzerMitSitzung({
        email: `fremd.${marker}@example.test`,
        displayName: 'Fremde Person',
        role: 'USER',
      })
    ).cookie;
    expect(cookie).not.toBe('');

    /*
     * Eigener veroeffentlichter Katalog statt "wenn zufaellig Daten da sind".
     * Zwei Testfaelle haben sich frueher stillschweigend uebersprungen, wenn
     * keine veroeffentlichten Daten vorlagen -- und meldeten sich dabei als
     * bestanden.
     */
    const redaktion = await benutzerMitSitzung({
      email: `verkauf.redaktion.${marker}@example.test`,
      displayName: 'Redaktion',
      role: 'EDITOR',
    });

    async function redaktionsAufruf(pfad: string, body: unknown, method = 'POST') {
      const antwort = await fetch(`${BASE_URL}${pfad}`, {
        method,
        headers: { 'content-type': 'application/json', cookie: redaktion.cookie },
        body: JSON.stringify(body),
      });
      const text = await antwort.text();
      return (text ? JSON.parse(text) : {}) as { data?: Record<string, { id: string }> };
    }

    katalog.marke =
      (await redaktionsAufruf('/api/katalog/hersteller', { name: `Verkaufsmarke ${marker}` }))
        .data?.manufacturer?.id ?? '';
    katalog.modell =
      (await redaktionsAufruf('/api/katalog/modelle', {
        manufacturerId: katalog.marke,
        name: `Verkaufsmodell ${marker}`,
      })).data?.model?.id ?? '';
    katalog.generation =
      (await redaktionsAufruf('/api/katalog/generationen', {
        modelId: katalog.modell,
        name: 'Verkaufsgeneration',
        yearFrom: 2015,
        yearTo: 2021,
      })).data?.generation?.id ?? '';

    for (const [subject, id] of [
      ['manufacturer', katalog.marke],
      ['model', katalog.modell],
      ['generation', katalog.generation],
    ] as const) {
      await redaktionsAufruf(`/api/katalog/eintraege/${subject}/${id}/quellen`, {
        title: `Beleg ${marker}`,
        kind: 'MANUFACTURER_DOCUMENT',
      });
      await redaktionsAufruf(
        `/api/katalog/eintraege/${subject}/${id}/status`,
        { status: 'IN_REVIEW' },
        'PATCH',
      );
      await redaktionsAufruf(
        `/api/katalog/eintraege/${subject}/${id}/status`,
        { status: 'PUBLISHED' },
        'PATCH',
      );
    }
    expect(katalog.generation).not.toBe('');
  });

  afterAll(async () => {
    await prisma.listingDraft.deleteMany({ where: { owner: { email: { contains: marker } } } });
    if (katalog.generation) await prisma.generation.deleteMany({ where: { id: katalog.generation } });
    if (katalog.modell) await prisma.model.deleteMany({ where: { id: katalog.modell } });
    if (katalog.marke) await prisma.manufacturer.deleteMany({ where: { id: katalog.marke } });
    await prisma.source.deleteMany({ where: { title: { contains: marker } } });
    await prisma.user.deleteMany({ where: { email: { contains: marker } } });
    await prisma.$disconnect();
  });

  it('verlangt eine Anmeldung', async () => {
    const antwort = await api('/api/verkaufen/entwuerfe', {
      method: 'POST',
      cookie: '',
      body: { vin: TEST_VIN },
    });
    expect(antwort.status).toBe(401);
  });

  it('lehnt eine ungueltige VIN ab', async () => {
    for (const ungueltig of ['zu-kurz', 'WBA3A5C50F5A1234I', 'WBA3A5C50F5A123456']) {
      const antwort = await api('/api/verkaufen/entwuerfe', {
        method: 'POST',
        body: { vin: ungueltig },
      });
      expect(antwort.status, ungueltig).toBe(400);
    }
  });

  it('legt einen Entwurf an und leitet aus der VIN nur Belegbares ab', async () => {
    const antwort = await api('/api/verkaufen/entwuerfe', {
      method: 'POST',
      body: { vin: TEST_VIN.toLowerCase() },
    });
    expect(antwort.status).toBe(201);

    const daten = antwort.body.data as {
      draft: { id: string; status: string };
      decoding: Record<string, unknown>;
      notice: string;
    };
    draftId = daten.draft.id;

    expect(daten.draft.status).toBe('VIN_ENTERED');
    expect(daten.decoding.wmi).toBe('WBA');
    expect(daten.decoding.region).toBe('Europa');

    /*
     * Der Kern von Blocker B7: Diese Felder darf es in der Antwort nicht
     * geben. Wer sie ergaenzt, muss erklaeren, woher die Angabe kommt.
     *
     * Geprueft werden die Schluessel, nicht der blosse Text -- der Schluessel
     * "modelYearCandidates" ist zulaessig und enthaelt nun einmal "model".
     */
    const schluessel = Object.keys(daten.decoding);
    expect(schluessel).not.toContain('model');
    expect(schluessel).not.toContain('engine');
    expect(schluessel).not.toContain('generation');
    expect(schluessel).not.toContain('trimLine');
    // Was erlaubt ist, steht ausdruecklich dabei.
    expect(schluessel).toEqual(
      expect.arrayContaining(['wmi', 'region', 'checkDigit', 'modelYearCandidates']),
    );

    // Und die Einschraenkung steht ausdruecklich in der Antwort.
    expect(daten.notice).toContain('nur Hersteller');
    expect(daten.notice).toContain('bestätigt');
  });

  it('gibt beim Modelljahr Kandidaten aus, keinen einzelnen Wert', async () => {
    const antwort = await api(`/api/verkaufen/entwuerfe/${draftId}`);
    expect(antwort.status).toBe(200);

    const nochmal = await api('/api/verkaufen/entwuerfe', {
      method: 'POST',
      body: { vin: TEST_VIN },
    });
    const decoding = (nochmal.body.data as { decoding: { modelYearCandidates: number[] } })
      .decoding;
    expect(Array.isArray(decoding.modelYearCandidates)).toBe(true);
    expect(decoding.modelYearCandidates.length).toBeGreaterThan(1);
  });

  it('zeigt einen fremden Entwurf nicht', async () => {
    const antwort = await api(`/api/verkaufen/entwuerfe/${draftId}`, { cookie: fremdCookie });
    expect(antwort.status).toBe(404);
  });

  it('speichert Angaben zum Fahrzeug', async () => {
    const antwort = await api(`/api/verkaufen/entwuerfe/${draftId}/angaben`, {
      method: 'PATCH',
      body: {
        mileageKm: 128500,
        previousOwners: 2,
        condition: 'GOOD',
        serviceHistory: 'FULL_MANUFACTURER',
        hadAccident: false,
      },
    });
    expect(antwort.status).toBe(200);

    const geladen = await api(`/api/verkaufen/entwuerfe/${draftId}`);
    const entwurf = (geladen.body.data as { draft: { mileageKm: number; status: string } }).draft;
    expect(entwurf.mileageKm).toBe(128500);
    expect(entwurf.status).toBe('DETAILS_PROVIDED');
  });

  it('lehnt den Widerspruch "unfallfrei mit Unfallbeschreibung" ab', async () => {
    const antwort = await api(`/api/verkaufen/entwuerfe/${draftId}/angaben`, {
      method: 'PATCH',
      body: { hadAccident: false, accidentDetails: 'Heckschaden 2019' },
    });
    expect(antwort.status).toBe(400);
  });

  it('lehnt eine Erstzulassung in der Zukunft ab', async () => {
    const antwort = await api(`/api/verkaufen/entwuerfe/${draftId}/angaben`, {
      method: 'PATCH',
      body: { firstRegistration: '2099-01-01' },
    });
    expect(antwort.status).toBe(400);
  });

  it('erzeugt keine Texte ohne bestaetigtes Fahrzeug', async () => {
    // Ohne Bestaetigung schriebe die KI ueber ein geratenes Auto.
    const antwort = await api(`/api/verkaufen/entwuerfe/${draftId}/texte`, { method: 'POST' });
    expect(antwort.status).toBe(409);
    expect(JSON.stringify(antwort.body)).toContain('bestätigen');
  });

  it('lehnt eine Fahrzeugzuordnung ab, die es so nicht gibt', async () => {
    const antwort = await api(`/api/verkaufen/entwuerfe/${draftId}/fahrzeug`, {
      method: 'PATCH',
      body: {
        manufacturerId: katalog.marke,
        modelId: 'gibtsnicht',
        generationId: 'gibtsnicht',
      },
    });
    expect(antwort.status).toBe(400);
  });

  it('verbraucht kein Guthaben, wenn die Texterzeugung nicht eingerichtet ist', async () => {
    /*
     * Ohne Zugang meldet die Anwendung das ehrlich -- und zwar BEVOR Guthaben
     * reserviert wird. Niemand soll fuer eine Funktion zahlen, die gar nicht
     * laufen kann.
     */
    const bestaetigt = await api(`/api/verkaufen/entwuerfe/${draftId}/fahrzeug`, {
      method: 'PATCH',
      body: {
        manufacturerId: katalog.marke,
        modelId: katalog.modell,
        generationId: katalog.generation,
      },
    });
    expect(bestaetigt.status).toBe(200);

    await walletRepository.credit({
      userId,
      amountTokens: 100,
      type: 'ADMIN_CREDIT',
      purpose: 'Testguthaben',
      reference: `${marker}-guthaben`,
      actorId: null,
    });

    const vorher = await walletRepository.findWallet(userId);
    const antwort = await api(`/api/verkaufen/entwuerfe/${draftId}/texte`, { method: 'POST' });

    // 501, solange kein Zugang eingerichtet ist -- 200, sobald einer besteht.
    expect([200, 501]).toContain(antwort.status);

    if (antwort.status === 501) {
      const nachher = await walletRepository.findWallet(userId);
      expect(nachher?.balanceTokens).toBe(vorher?.balanceTokens);
      expect(nachher?.reservedTokens).toBe(0);
      expect(JSON.stringify(antwort.body)).toContain('gespeichert');
    }
  });
});
