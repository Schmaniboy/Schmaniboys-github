import { prisma } from '@ap/db';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { benutzerMitSitzung } from './helpers/session';

/**
 * Fahrzeugsuche an der laufenden Anwendung.
 *
 * Die wichtigste Zusage: Ein Entwurf taucht in keiner Trefferliste auf --
 * auch dann nicht, wenn er selbst veroeffentlicht waere, aber ein Eintrag
 * darueber noch nicht.
 */

const BASE_URL = process.env.SMOKE_BASE_URL ?? 'http://127.0.0.1:3000';

const reachable = await fetch(`${BASE_URL}/api/health`, { signal: AbortSignal.timeout(2000) })
  .then((r) => r.ok)
  .catch(() => false);

const suite = reachable ? describe : describe.skip;

const marker = `suq${Date.now().toString(36)}`;

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

async function veroeffentliche(subject: string, id: string) {
  await api(`/api/katalog/eintraege/${subject}/${id}/quellen`, {
    title: `Beleg ${marker}`,
    kind: 'MANUFACTURER_DOCUMENT',
  });
  await api(`/api/katalog/eintraege/${subject}/${id}/status`, { status: 'IN_REVIEW' }, 'PATCH');
  const ergebnis = await api(
    `/api/katalog/eintraege/${subject}/${id}/status`,
    { status: 'PUBLISHED' },
    'PATCH',
  );
  expect(ergebnis.status).toBe(200);
}

async function seiteLaden(query: string): Promise<string> {
  const antwort = await fetch(`${BASE_URL}/suche${query}`);
  expect(antwort.status).toBe(200);
  return antwort.text();
}

suite('Fahrzeugsuche', () => {
  beforeAll(async () => {
    cookie = (
      await benutzerMitSitzung({
        email: `suche.${marker}@example.test`,
        displayName: 'Redaktion',
        role: 'EDITOR',
      })
    ).cookie;

    ids.marke = nimmId(
      await api('/api/katalog/hersteller', { name: `Suchmarke ${marker}` }),
      'manufacturer',
    );
    await veroeffentliche('manufacturer', ids.marke);

    ids.modell = nimmId(
      await api('/api/katalog/modelle', {
        manufacturerId: ids.marke,
        name: `Suchmodell ${marker}`,
      }),
      'model',
    );
    await veroeffentliche('model', ids.modell);

    ids.generation = nimmId(
      await api('/api/katalog/generationen', {
        modelId: ids.modell,
        name: 'Suchgeneration',
        yearFrom: 2016,
        yearTo: 2022,
      }),
      'generation',
    );
    await veroeffentliche('generation', ids.generation);

    ids.diesel = nimmId(
      await api('/api/katalog/motoren', {
        manufacturerId: ids.marke,
        name: `Suchdiesel ${marker}`,
        code: `SD-${marker}`,
        fuelType: 'DIESEL',
        powerKw: 110,
      }),
      'engine',
    );
    await veroeffentliche('engine', ids.diesel);

    ids.benziner = nimmId(
      await api('/api/katalog/motoren', {
        manufacturerId: ids.marke,
        name: `Suchbenziner ${marker}`,
        code: `SB-${marker}`,
        fuelType: 'PETROL',
        powerKw: 220,
      }),
      'engine',
    );
    await veroeffentliche('engine', ids.benziner);

    ids.getriebe = nimmId(
      await api('/api/katalog/getriebe', {
        name: `Suchgetriebe ${marker}`,
        type: 'MANUAL',
        gears: 6,
      }),
      'transmission',
    );

    ids.antriebDiesel = nimmId(
      await api('/api/katalog/antriebe', {
        generationId: ids.generation,
        engineId: ids.diesel,
        transmissionId: ids.getriebe,
        driveType: 'FRONT',
        powerKw: 110,
      }),
      'powertrain',
    );
    await veroeffentliche('powertrain', ids.antriebDiesel);

    ids.antriebBenzin = nimmId(
      await api('/api/katalog/antriebe', {
        generationId: ids.generation,
        engineId: ids.benziner,
        transmissionId: ids.getriebe,
        driveType: 'ALL',
        powerKw: 220,
      }),
      'powertrain',
    );
    await veroeffentliche('powertrain', ids.antriebBenzin);

    // Bewusst NICHT veroeffentlicht -- darf in keiner Trefferliste auftauchen.
    ids.entwurf = nimmId(
      await api('/api/katalog/antriebe', {
        generationId: ids.generation,
        engineId: ids.diesel,
        transmissionId: ids.getriebe,
        driveType: 'REAR',
        powerKw: 999,
      }),
      'powertrain',
    );
    expect(ids.entwurf).not.toBe('');
  });

  afterAll(async () => {
    await prisma.powertrainCombination.deleteMany({ where: { generationId: ids.generation } });
    await prisma.generation.deleteMany({ where: { id: ids.generation } });
    await prisma.model.deleteMany({ where: { id: ids.modell } });
    await prisma.engine.deleteMany({ where: { manufacturerId: ids.marke } });
    await prisma.manufacturer.deleteMany({ where: { id: ids.marke } });
    await prisma.transmission.deleteMany({ where: { id: ids.getriebe } });
    await prisma.source.deleteMany({ where: { title: { contains: marker } } });
    await prisma.user.deleteMany({ where: { email: { contains: marker } } });
    await prisma.$disconnect();
  });

  it('findet die veroeffentlichten Varianten ueber den Freitext', async () => {
    const html = await seiteLaden(`?q=Suchmodell%20${marker}`);
    expect(html).toContain(`Suchdiesel ${marker}`);
    expect(html).toContain(`Suchbenziner ${marker}`);
  });

  it('zeigt den Entwurf nicht an', async () => {
    // Der Entwurf traegt 999 kW -- er waere unter jeder Sortierung sichtbar.
    const html = await seiteLaden(`?q=Suchmodell%20${marker}&sortierung=leistung-ab`);
    expect(html).not.toContain('999 kW');
  });

  it('filtert nach Kraftstoff', async () => {
    const html = await seiteLaden(`?q=Suchmodell%20${marker}&kraftstoff=DIESEL`);
    expect(html).toContain(`Suchdiesel ${marker}`);
    expect(html).not.toContain(`Suchbenziner ${marker}`);
  });

  it('filtert nach Antriebsart', async () => {
    const html = await seiteLaden(`?q=Suchmodell%20${marker}&antrieb=ALL`);
    expect(html).toContain(`Suchbenziner ${marker}`);
    expect(html).not.toContain(`Suchdiesel ${marker}`);
  });

  it('filtert nach Leistungsspanne', async () => {
    const schwach = await seiteLaden(`?q=Suchmodell%20${marker}&leistungBisKw=150`);
    expect(schwach).toContain(`Suchdiesel ${marker}`);
    expect(schwach).not.toContain(`Suchbenziner ${marker}`);

    const stark = await seiteLaden(`?q=Suchmodell%20${marker}&leistungVonKw=200`);
    expect(stark).toContain(`Suchbenziner ${marker}`);
    expect(stark).not.toContain(`Suchdiesel ${marker}`);
  });

  it('sortiert nach Leistung in beide Richtungen', async () => {
    const absteigend = await seiteLaden(`?q=Suchmodell%20${marker}&sortierung=leistung-ab`);
    expect(absteigend.indexOf(`Suchbenziner ${marker}`)).toBeLessThan(
      absteigend.indexOf(`Suchdiesel ${marker}`),
    );

    const aufsteigend = await seiteLaden(`?q=Suchmodell%20${marker}&sortierung=leistung-auf`);
    expect(aufsteigend.indexOf(`Suchdiesel ${marker}`)).toBeLessThan(
      aufsteigend.indexOf(`Suchbenziner ${marker}`),
    );
  });

  it('findet ueber den Motorcode', async () => {
    const html = await seiteLaden(`?q=SD-${marker}`);
    expect(html).toContain(`Suchdiesel ${marker}`);
  });

  it('beruecksichtigt den Bauzeitraum als Ueberschneidung', async () => {
    // Baureihe 2016-2022: eine Suche nach 2020-2021 muss sie finden.
    const treffer = await seiteLaden(`?q=Suchmodell%20${marker}&baujahrVon=2020&baujahrBis=2021`);
    expect(treffer).toContain(`Suchdiesel ${marker}`);

    const daneben = await seiteLaden(`?q=Suchmodell%20${marker}&baujahrVon=2024`);
    expect(daneben).not.toContain(`Suchdiesel ${marker}`);
  });

  it('antwortet auf unsinnige Filter mit einem Hinweis statt einem Fehler', async () => {
    const html = await seiteLaden('?baujahrVon=2030&baujahrBis=2010');
    expect(html).toContain('nicht lesbar');
  });

  it('nimmt eine kommagetrennte Mehrfachauswahl an', async () => {
    const html = await seiteLaden(`?q=Suchmodell%20${marker}&kraftstoff=DIESEL,PETROL`);
    expect(html).toContain(`Suchdiesel ${marker}`);
    expect(html).toContain(`Suchbenziner ${marker}`);
  });
});
