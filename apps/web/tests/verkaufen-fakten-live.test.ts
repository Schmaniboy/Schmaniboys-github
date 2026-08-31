import { prisma } from '@ap/db';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { benutzerMitSitzung } from './helpers/session';

/**
 * Technische Daten und Ausstattung im Verkaufsentwurf.
 *
 * Der Punkt dieses Tests: Diese beiden Bloecke kommen aus dem bestaetigten
 * Katalogeintrag, NICHT aus der Texterzeugung. Der Test laeuft deshalb ohne
 * jeden KI-Zugang und legt sich seinen Katalog selbst an -- kein
 * "wenn zufaellig Daten da sind"-Zweig, der gruen ist, ohne etwas zu pruefen.
 */

const BASE_URL = process.env.SMOKE_BASE_URL ?? 'http://127.0.0.1:3000';

const reachable = await fetch(`${BASE_URL}/api/health`, { signal: AbortSignal.timeout(2000) })
  .then((r) => r.ok)
  .catch(() => false);

const suite = reachable ? describe : describe.skip;

const marker = `fak${Date.now().toString(36)}`;
const MOTORNAME = `Pruefmotor ${marker}`;

const ids: Record<string, string> = {};
let redaktionCookie = '';
let verkaufCookie = '';
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

/** Einreichen, belegen, veroeffentlichen -- der Ablauf aus Phase 2. */
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
  expect(antwort.status, `${subject} ${eintragId} veroeffentlichen`).toBe(200);
}

suite('Verkaufsentwurf: technische Daten aus dem Katalog', () => {
  beforeAll(async () => {
    redaktionCookie = (
      await benutzerMitSitzung({
        email: `fakten.redaktion.${marker}@example.test`,
        displayName: 'Redaktion',
        role: 'EDITOR',
      })
    ).cookie;
    verkaufCookie = (
      await benutzerMitSitzung({
        email: `fakten.verkauf.${marker}@example.test`,
        displayName: 'Verkauf',
        role: 'USER',
      })
    ).cookie;

    ids.marke = nimmId(
      await api('/api/katalog/hersteller', redaktionCookie, { name: `Faktenmarke ${marker}` }),
      'manufacturer',
    );
    ids.modell = nimmId(
      await api('/api/katalog/modelle', redaktionCookie, {
        manufacturerId: ids.marke,
        name: `Faktenmodell ${marker}`,
      }),
      'model',
    );
    ids.generation = nimmId(
      await api('/api/katalog/generationen', redaktionCookie, {
        modelId: ids.modell,
        name: 'Faktengeneration',
        yearFrom: 2016,
        yearTo: 2021,
      }),
      'generation',
    );
    ids.motor = nimmId(
      await api('/api/katalog/motoren', redaktionCookie, {
        manufacturerId: ids.marke,
        name: MOTORNAME,
        code: `PM${marker.slice(-4).toUpperCase()}`,
        fuelType: 'PETROL',
        displacementCcm: 1998,
        powerKw: 135,
      }),
      'engine',
    );
    expect(ids.motor).not.toBe('');

    // Reihenfolge zaehlt: Ein Modell laesst sich nicht vor seinem Hersteller
    // veroeffentlichen.
    await veroeffentlichen('manufacturer', ids.marke);
    await veroeffentlichen('model', ids.modell);
    await veroeffentlichen('generation', ids.generation);
  });

  afterAll(async () => {
    await prisma.listingDraft.deleteMany({ where: { generationId: ids.generation } });
    await prisma.powertrainCombination.deleteMany({ where: { generationId: ids.generation } });
    await prisma.engine.deleteMany({ where: { id: ids.motor } });
    if (ids.getriebe) await prisma.transmission.deleteMany({ where: { id: ids.getriebe } });
    await prisma.generation.deleteMany({ where: { id: ids.generation } });
    await prisma.model.deleteMany({ where: { id: ids.modell } });
    await prisma.manufacturer.deleteMany({ where: { id: ids.marke } });
    await prisma.source.deleteMany({ where: { title: { contains: marker } } });
    await prisma.user.deleteMany({ where: { email: { contains: marker } } });
    await prisma.$disconnect();
  });

  it('zeigt vor der Bestaetigung keine technischen Daten', async () => {
    const angelegt = await api('/api/verkaufen/entwuerfe', verkaufCookie, {
      vin: 'WBA3A5C55DF123456',
    });
    expect(angelegt.status).toBe(201);
    entwurfId = nimmId(angelegt, 'draft');
    expect(entwurfId).not.toBe('');

    const seite = await fetch(`${BASE_URL}/verkaufen/entwurf/${entwurfId}`, {
      headers: { cookie: verkaufCookie },
    });
    const html = await seite.text();
    expect(seite.status).toBe(200);
    // Ohne bestaetigte Zuordnung gibt es nichts zu zeigen -- eine
    // unvollstaendige Zuordnung saehe aus wie eine Tatsache.
    expect(html).not.toContain('Technische Daten');
  });

  it('zeigt nach der Bestaetigung die Katalogangaben', async () => {
    const bestaetigt = await api(
      `/api/verkaufen/entwuerfe/${entwurfId}/fahrzeug`,
      verkaufCookie,
      { manufacturerId: ids.marke, modelId: ids.modell, generationId: ids.generation },
      'PATCH',
    );
    expect(bestaetigt.status).toBe(200);

    const seite = await fetch(`${BASE_URL}/verkaufen/entwurf/${entwurfId}`, {
      headers: { cookie: verkaufCookie },
    });
    const html = await seite.text();

    expect(html).toContain('Technische Daten');
    expect(html).toContain('Aus dem Katalog');
    expect(html).toContain(`Faktenmarke ${marker}`);
    expect(html).toContain('2016');
    // Ohne gewaehlte Ausstattungslinie wird die Serienausstattung nicht
    // geraten, sondern die Luecke benannt.
    expect(html).toContain('Ausstattung');
    expect(html).toContain('lässt sich die Serienausstattung nicht');
  });

  it('nennt bei gewaehlter Motorvariante Leistung in kW und PS', async () => {
    const getriebeId = nimmId(
      await api('/api/katalog/getriebe', redaktionCookie, {
        name: `Sechsgang ${marker}`,
        type: 'MANUAL',
        gears: 6,
      }),
      'transmission',
    );
    expect(getriebeId).not.toBe('');
    ids.getriebe = getriebeId;

    const antriebAntwort = await api('/api/katalog/antriebe', redaktionCookie, {
      generationId: ids.generation,
      engineId: ids.motor,
      transmissionId: getriebeId,
      driveType: 'FRONT',
    });
    const antriebId = nimmId(antriebAntwort, 'powertrain');
    if (!antriebId) {
      // Die Antriebskombination braucht ein Getriebe -- fehlt es, ist das ein
      // echter Fehler und kein Grund, den Test still durchzuwinken.
      throw new Error(`Antrieb nicht angelegt: ${JSON.stringify(antriebAntwort.body)}`);
    }
    await veroeffentlichen('powertrain', antriebId);

    const bestaetigt = await api(
      `/api/verkaufen/entwuerfe/${entwurfId}/fahrzeug`,
      verkaufCookie,
      {
        manufacturerId: ids.marke,
        modelId: ids.modell,
        generationId: ids.generation,
        powertrainId: antriebId,
      },
      'PATCH',
    );
    expect(bestaetigt.status).toBe(200);

    const seite = await fetch(`${BASE_URL}/verkaufen/entwurf/${entwurfId}`, {
      headers: { cookie: verkaufCookie },
    });
    const html = await seite.text();

    expect(html).toContain(MOTORNAME);
    // 135 kW sind 184 PS. Beide Einheiten, weil beide gelesen werden.
    expect(html).toContain('135');
    expect(html).toContain('184');
    expect(html).toContain('2,0'); // Hubraum in Litern
  });
});
