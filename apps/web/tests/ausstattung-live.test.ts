import { prisma } from '@ap/db';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { benutzerMitSitzung } from './helpers/session';

/**
 * Verfuegbarkeitsmatrix der Ausstattung ueber die echte Schnittstelle.
 *
 * Der heikle Punkt sind Duplikate: Die Eindeutigkeitsbedingung in PostgreSQL
 * greift nicht, wenn die unterscheidenden Spalten NULL sind -- NULL gilt dort
 * als von allem verschieden. Ohne zusaetzliche Pruefung liessen sich beliebig
 * viele gleiche Zeilen anlegen.
 */

const BASE_URL = process.env.SMOKE_BASE_URL ?? 'http://127.0.0.1:3000';

const reachable = await fetch(`${BASE_URL}/api/health`, { signal: AbortSignal.timeout(2000) })
  .then((r) => r.ok)
  .catch(() => false);

const suite = reachable ? describe : describe.skip;

const marker = `aus${Date.now().toString(36)}`;
const ids: Record<string, string> = {};
let cookie = '';

async function api(pfad: string, body?: unknown, method = 'POST') {
  const antwort = await fetch(`${BASE_URL}${pfad}`, {
    method,
    headers: { 'content-type': 'application/json', cookie },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  const text = await antwort.text();
  return { status: antwort.status, body: text ? JSON.parse(text) : {} };
}

function nimmId(antwort: { body: Record<string, unknown> }, schluessel: string): string {
  const daten = antwort.body.data as Record<string, { id: string }>;
  return daten[schluessel]?.id ?? '';
}

suite('Ausstattungsmatrix', () => {
  beforeAll(async () => {
    cookie = (
      await benutzerMitSitzung({
        email: `ausstattung.${marker}@example.test`,
        displayName: 'Redaktion',
        role: 'EDITOR',
      })
    ).cookie;

    ids.marke = nimmId(
      await api('/api/katalog/hersteller', { name: `Ausstattungsmarke ${marker}` }),
      'manufacturer',
    );
    ids.modell = nimmId(
      await api('/api/katalog/modelle', {
        manufacturerId: ids.marke,
        name: `Ausstattungsmodell ${marker}`,
      }),
      'model',
    );
    ids.generation = nimmId(
      await api('/api/katalog/generationen', {
        modelId: ids.modell,
        name: 'Ausstattungsgeneration',
        yearFrom: 2015,
        yearTo: 2020,
      }),
      'generation',
    );
    ids.linie = nimmId(
      await api('/api/katalog/ausstattungslinien', {
        generationId: ids.generation,
        name: `Sportlinie ${marker}`,
      }),
      'trimLine',
    );
    expect(ids.linie).not.toBe('');
  });

  afterAll(async () => {
    await prisma.optionAvailability.deleteMany({ where: { generationId: ids.generation } });
    await prisma.equipmentPackageItem.deleteMany({
      where: { package: { generationId: ids.generation } },
    });
    await prisma.equipmentPackage.deleteMany({ where: { generationId: ids.generation } });
    await prisma.trimLine.deleteMany({ where: { generationId: ids.generation } });
    await prisma.optionalEquipment.deleteMany({ where: { manufacturerId: ids.marke } });
    await prisma.generation.deleteMany({ where: { id: ids.generation } });
    await prisma.model.deleteMany({ where: { id: ids.modell } });
    await prisma.manufacturer.deleteMany({ where: { id: ids.marke } });
    await prisma.user.deleteMany({ where: { email: { contains: marker } } });
    await prisma.$disconnect();
  });

  it('legt eine Sonderausstattung mit Erkennungsmerkmal an', async () => {
    const antwort = await api('/api/katalog/sonderausstattung', {
      manufacturerId: ids.marke,
      name: `Matrixlicht ${marker}`,
      optionCode: 'S001A',
      category: 'Licht',
      howToIdentify: 'Waagerechte Leuchtleiste im Scheinwerfer.',
    });
    expect(antwort.status).toBe(201);
    ids.option = nimmId(antwort, 'option');
  });

  it('lehnt Seltenheit ohne Belegmodell ab', async () => {
    const antwort = await api('/api/katalog/sonderausstattung', {
      manufacturerId: ids.marke,
      name: `Ohne Beleg ${marker}`,
      rarity: 'VERY_RARE',
    });
    expect(antwort.status).toBe(400);
    expect(JSON.stringify(antwort.body)).toContain('relevanceEvidenceType');
  });

  it('nimmt Seltenheit mit Belegmodell an', async () => {
    const antwort = await api('/api/katalog/sonderausstattung', {
      manufacturerId: ids.marke,
      name: `Mit Beleg ${marker}`,
      rarity: 'VERY_RARE',
      relevanceEvidenceType: 'ASSESSMENT',
      relevanceReasoning:
        'Frei erfundene Begruendung, ausreichend lang fuer die Pruefung der Belegpflicht.',
    });
    expect(antwort.status).toBe(201);
  });

  it('erfasst dieselbe Ausstattung mit verschiedenen Bedingungen', async () => {
    const serie = await api('/api/katalog/sonderausstattung/verfuegbarkeit', {
      optionId: ids.option,
      generationId: ids.generation,
      trimLineId: ids.linie,
      kind: 'STANDARD',
      yearFrom: 2018,
    });
    expect(serie.status).toBe(201);

    const aufpreis = await api('/api/katalog/sonderausstattung/verfuegbarkeit', {
      optionId: ids.option,
      generationId: ids.generation,
      kind: 'OPTIONAL',
    });
    expect(aufpreis.status).toBe(201);
  });

  it('lehnt eine doppelte Verfuegbarkeit ab, auch wenn alle Zusatzfelder leer sind', async () => {
    /*
     * Genau hier greift die Datenbankbedingung nicht: trimLineId und
     * powertrainId sind NULL, und PostgreSQL haelt NULL-Werte fuer
     * voneinander verschieden. Ohne die Pruefung in der Anwendung entstuenden
     * beliebig viele gleiche Zeilen.
     */
    const antwort = await api('/api/katalog/sonderausstattung/verfuegbarkeit', {
      optionId: ids.option,
      generationId: ids.generation,
      kind: 'OPTIONAL',
    });
    expect(antwort.status).toBe(409);
  });

  it('lehnt serienmaessig und nur-im-Paket zugleich ab', async () => {
    const paket = await api('/api/katalog/pakete', {
      generationId: ids.generation,
      name: `Winterpaket ${marker}`,
    });
    expect(paket.status).toBe(201);
    ids.paket = nimmId(paket, 'package');

    const antwort = await api('/api/katalog/sonderausstattung/verfuegbarkeit', {
      optionId: ids.option,
      generationId: ids.generation,
      packageId: ids.paket,
      kind: 'STANDARD',
    });
    expect(antwort.status).toBe(400);
  });

  it('verlangt bei „nur im Paket" ein Paket', async () => {
    // Eine Zeile, die auf ein Paket verweist, ohne es zu nennen, ist keine
    // Auskunft -- und faellt spaeter niemandem mehr auf.
    const antwort = await api('/api/katalog/sonderausstattung/verfuegbarkeit', {
      optionId: ids.option,
      generationId: ids.generation,
      kind: 'PACKAGE_ONLY',
    });
    expect(antwort.status).toBe(400);
  });

  it('verlangt bei „marktabhaengig" einen Markt', async () => {
    const antwort = await api('/api/katalog/sonderausstattung/verfuegbarkeit', {
      optionId: ids.option,
      generationId: ids.generation,
      kind: 'MARKET_SPECIFIC',
    });
    expect(antwort.status).toBe(400);
  });

  it('nimmt eine Ausstattung in ein Paket auf', async () => {
    const antwort = await api('/api/katalog/pakete/positionen', {
      packageId: ids.paket,
      optionId: ids.option,
    });
    expect(antwort.status).toBe(201);

    const doppelt = await api('/api/katalog/pakete/positionen', {
      packageId: ids.paket,
      optionId: ids.option,
    });
    expect(doppelt.status).toBe(409);
  });

  it('laesst normale Benutzer keine Ausstattung anlegen', async () => {
    const antwort = await fetch(`${BASE_URL}/api/katalog/sonderausstattung`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ manufacturerId: ids.marke, name: 'Ohne Anmeldung' }),
    });
    expect(antwort.status).toBe(401);
  });
});
