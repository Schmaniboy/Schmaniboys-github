import { prisma } from '@ap/db';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { benutzerMitSitzung } from './helpers/session';

/**
 * Der Redaktionsablauf des Katalogs, ueber die echte HTTP-Schnittstelle.
 *
 * Was hier geprueft wird, laesst sich mit Unit-Tests nicht zeigen: dass
 * Rechte, Validierung, Statusregeln und Datenbank im Zusammenspiel das
 * Richtige tun -- und vor allem, dass ohne Quelle nichts veroeffentlicht wird.
 *
 * Ohne laufenden Server wird uebersprungen.
 */

const BASE_URL = process.env.SMOKE_BASE_URL ?? 'http://127.0.0.1:3000';

const reachable = await fetch(`${BASE_URL}/api/health`, { signal: AbortSignal.timeout(2000) })
  .then((r) => r.ok)
  .catch(() => false);

const suite = reachable ? describe : describe.skip;

const marker = `kat${Date.now().toString(36)}`;

let redaktionsCookie = '';
let nutzerCookie = '';
const angelegt: { manufacturerId?: string; modelId?: string; generationId?: string } = {};

async function api(
  pfad: string,
  optionen: { method?: string; cookie?: string; body?: unknown } = {},
): Promise<{ status: number; body: Record<string, unknown> }> {
  const antwort = await fetch(`${BASE_URL}${pfad}`, {
    method: optionen.method ?? 'GET',
    headers: {
      'content-type': 'application/json',
      ...(optionen.cookie ? { cookie: optionen.cookie } : {}),
    },
    ...(optionen.body !== undefined ? { body: JSON.stringify(optionen.body) } : {}),
  });
  const text = await antwort.text();
  return {
    status: antwort.status,
    body: text ? (JSON.parse(text) as Record<string, unknown>) : {},
  };
}

function daten(antwort: { body: Record<string, unknown> }): Record<string, never> {
  return (antwort.body.data ?? {}) as Record<string, never>;
}

suite('Katalog: Redaktionsablauf ueber die API', () => {
  beforeAll(async () => {
    redaktionsCookie = (
      await benutzerMitSitzung({
        email: `redaktion.${marker}@example.test`,
        displayName: 'Redaktion',
        role: 'EDITOR',
      })
    ).cookie;
    nutzerCookie = (
      await benutzerMitSitzung({
        email: `nutzer.${marker}@example.test`,
        displayName: 'Normale Person',
        role: 'USER',
      })
    ).cookie;
    expect(redaktionsCookie).not.toBe('');
    expect(nutzerCookie).not.toBe('');
  });

  afterAll(async () => {
    // In Abhaengigkeitsreihenfolge aufraeumen.
    if (angelegt.generationId) {
      await prisma.powertrainCombination.deleteMany({
        where: { generationId: angelegt.generationId },
      });
      await prisma.generation.deleteMany({ where: { id: angelegt.generationId } });
    }
    if (angelegt.modelId) await prisma.model.deleteMany({ where: { id: angelegt.modelId } });
    if (angelegt.manufacturerId) {
      await prisma.engine.deleteMany({ where: { manufacturerId: angelegt.manufacturerId } });
      await prisma.manufacturer.deleteMany({ where: { id: angelegt.manufacturerId } });
    }
    await prisma.source.deleteMany({ where: { title: { contains: marker } } });
    await prisma.user.deleteMany({ where: { email: { contains: marker } } });
    await prisma.$disconnect();
  });

  it('weist das Anlegen ohne Anmeldung ab', async () => {
    const antwort = await api('/api/katalog/hersteller', {
      method: 'POST',
      body: { name: `Marke ${marker}` },
    });
    expect(antwort.status).toBe(401);
  });

  it('weist das Anlegen durch normale Benutzer ab', async () => {
    const antwort = await api('/api/katalog/hersteller', {
      method: 'POST',
      cookie: nutzerCookie,
      body: { name: `Marke ${marker}` },
    });
    expect(antwort.status).toBe(403);
  });

  it('legt einen Hersteller als Entwurf an', async () => {
    const antwort = await api('/api/katalog/hersteller', {
      method: 'POST',
      cookie: redaktionsCookie,
      body: { name: `Marke ${marker}`, country: 'Deutschland', wmiCodes: ['wba'] },
    });
    expect(antwort.status).toBe(201);

    const hersteller = daten(antwort).manufacturer as unknown as {
      id: string;
      status: string;
      slug: string;
      wmiCodes: string[];
    };
    angelegt.manufacturerId = hersteller.id;

    // Es gibt keinen Weg, direkt veroeffentlicht anzulegen.
    expect(hersteller.status).toBe('DRAFT');
    expect(hersteller.wmiCodes).toEqual(['WBA']);
    expect(hersteller.slug).toContain('marke');
  });

  it('zeigt den Entwurf nicht im oeffentlichen Katalog', async () => {
    const antwort = await api('/api/katalog/hersteller');
    expect(antwort.status).toBe(200);
    const liste = daten(antwort).manufacturers as unknown as { id: string }[];
    expect(liste.some((eintrag) => eintrag.id === angelegt.manufacturerId)).toBe(false);
  });

  it('lehnt einen zweiten Hersteller mit demselben Namen ab', async () => {
    const antwort = await api('/api/katalog/hersteller', {
      method: 'POST',
      cookie: redaktionsCookie,
      body: { name: `Marke ${marker}` },
    });
    expect(antwort.status).toBe(409);
  });

  it('veroeffentlicht nicht ohne Quelle', async () => {
    const eingereicht = await api(
      `/api/katalog/eintraege/manufacturer/${angelegt.manufacturerId}/status`,
      { method: 'PATCH', cookie: redaktionsCookie, body: { status: 'IN_REVIEW' } },
    );
    expect(eingereicht.status).toBe(200);

    const versuch = await api(
      `/api/katalog/eintraege/manufacturer/${angelegt.manufacturerId}/status`,
      { method: 'PATCH', cookie: redaktionsCookie, body: { status: 'PUBLISHED' } },
    );
    expect(versuch.status).toBe(409);
    expect(JSON.stringify(versuch.body)).toContain('Quellenangabe');
  });

  it('veroeffentlicht mit Quelle', async () => {
    const quelle = await api(
      `/api/katalog/eintraege/manufacturer/${angelegt.manufacturerId}/quellen`,
      {
        method: 'POST',
        cookie: redaktionsCookie,
        body: {
          title: `Herstellerangabe ${marker}`,
          kind: 'MANUFACTURER_DOCUMENT',
          url: 'https://example.test/datenblatt',
        },
      },
    );
    expect(quelle.status).toBe(201);

    const veroeffentlicht = await api(
      `/api/katalog/eintraege/manufacturer/${angelegt.manufacturerId}/status`,
      { method: 'PATCH', cookie: redaktionsCookie, body: { status: 'PUBLISHED' } },
    );
    expect(veroeffentlicht.status).toBe(200);

    const oeffentlich = await api('/api/katalog/hersteller');
    const liste = daten(oeffentlich).manufacturers as unknown as { id: string }[];
    expect(liste.some((eintrag) => eintrag.id === angelegt.manufacturerId)).toBe(true);
  });

  it('laesst normale Benutzer nichts veroeffentlichen', async () => {
    const antwort = await api(
      `/api/katalog/eintraege/manufacturer/${angelegt.manufacturerId}/status`,
      { method: 'PATCH', cookie: nutzerCookie, body: { status: 'ARCHIVED' } },
    );
    expect(antwort.status).toBe(403);
  });

  it('baut die Kette Modell, Generation, Motor, Getriebe, Antriebskombination', async () => {
    const modell = await api('/api/katalog/modelle', {
      method: 'POST',
      cookie: redaktionsCookie,
      body: { manufacturerId: angelegt.manufacturerId, name: `Reihe ${marker}` },
    });
    expect(modell.status).toBe(201);
    angelegt.modelId = (daten(modell).model as unknown as { id: string }).id;

    const generation = await api('/api/katalog/generationen', {
      method: 'POST',
      cookie: redaktionsCookie,
      body: {
        modelId: angelegt.modelId,
        name: 'Erste Generation',
        code: 'X01',
        yearFrom: 2012,
        yearTo: 2019,
      },
    });
    expect(generation.status).toBe(201);
    angelegt.generationId = (daten(generation).generation as unknown as { id: string }).id;

    const motor = await api('/api/katalog/motoren', {
      method: 'POST',
      cookie: redaktionsCookie,
      body: {
        manufacturerId: angelegt.manufacturerId,
        name: '2.0 Diesel',
        code: `MC-${marker}`,
        fuelType: 'DIESEL',
        aspiration: 'TURBOCHARGED',
        displacementCcm: 1995,
        cylinders: 4,
        powerKw: 140,
      },
    });
    expect(motor.status).toBe(201);
    const motorId = (daten(motor).engine as unknown as { id: string }).id;

    const getriebe = await api('/api/katalog/getriebe', {
      method: 'POST',
      cookie: redaktionsCookie,
      body: { name: `Automatik ${marker}`, type: 'AUTOMATIC_TORQUE_CONVERTER', gears: 8 },
    });
    expect(getriebe.status).toBe(201);
    const getriebeId = (daten(getriebe).transmission as unknown as { id: string }).id;

    const antrieb = await api('/api/katalog/antriebe', {
      method: 'POST',
      cookie: redaktionsCookie,
      body: {
        generationId: angelegt.generationId,
        engineId: motorId,
        transmissionId: getriebeId,
        driveType: 'REAR',
        powerKw: 140,
        acceleration0to100: 7.3,
        topSpeedKmh: 235,
        consumptionCombined: 4.8,
        consumptionUnit: 'l/100 km',
        measurementStandard: 'NEDC',
      },
    });
    expect(antrieb.status).toBe(201);

    // Dieselbe Kombination darf es nur einmal geben.
    const doppelt = await api('/api/katalog/antriebe', {
      method: 'POST',
      cookie: redaktionsCookie,
      body: {
        generationId: angelegt.generationId,
        engineId: motorId,
        transmissionId: getriebeId,
        driveType: 'REAR',
      },
    });
    expect(doppelt.status).toBe(409);
  });

  it('faengt unsinnige technische Werte ab', async () => {
    const antwort = await api('/api/katalog/motoren', {
      method: 'POST',
      cookie: redaktionsCookie,
      body: {
        manufacturerId: angelegt.manufacturerId,
        name: 'Tippfehler',
        fuelType: 'PETROL',
        powerKw: 30000,
      },
    });
    expect(antwort.status).toBe(400);
    expect(JSON.stringify(antwort.body)).toContain('powerKw');
  });

  it('lehnt einen rueckwaerts laufenden Bauzeitraum ab', async () => {
    const antwort = await api('/api/katalog/generationen', {
      method: 'POST',
      cookie: redaktionsCookie,
      body: {
        modelId: angelegt.modelId,
        name: 'Unmoegliche Generation',
        yearFrom: 2019,
        yearTo: 2012,
      },
    });
    expect(antwort.status).toBe(400);
  });

  it('meldet einen unbekannten Fremdschluessel als Eingabefehler, nicht als Serverfehler', async () => {
    const antwort = await api('/api/katalog/modelle', {
      method: 'POST',
      cookie: redaktionsCookie,
      body: { manufacturerId: 'gibtsnicht', name: 'Waise' },
    });
    expect(antwort.status).toBe(400);
  });
});
