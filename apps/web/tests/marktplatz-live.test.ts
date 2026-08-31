import sharp from 'sharp';

import { prisma } from '@ap/db';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { benutzerMitSitzung } from './helpers/session';

/**
 * Der Marktplatz ueber die echte Schnittstelle.
 *
 * Schwerpunkt sind die drei Stellen, an denen ein Marktplatz gefaehrlich
 * wird: Sichtbarkeit (wer sieht was), Eigentum (wer darf was aendern) und
 * Bilduploads (was kommt da eigentlich herein).
 */

const BASE_URL = process.env.SMOKE_BASE_URL ?? 'http://127.0.0.1:3000';

const reachable = await fetch(`${BASE_URL}/api/health`, { signal: AbortSignal.timeout(2000) })
  .then((r) => r.ok)
  .catch(() => false);

const suite = reachable ? describe : describe.skip;

const marker = `mkt${Date.now().toString(36)}`;
const ids: Record<string, string> = {};
let redaktionCookie = '';
let verkaufCookie = '';
let fremdCookie = '';
let entwurfId = '';
let anzeigeId = '';
let anzeigeSlug = '';

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

/** Ein echtes Bild mit EXIF-Aufnahmeort -- genau der Fall, um den es geht. */
async function testBild(breite = 1200, hoehe = 900): Promise<Buffer> {
  return sharp({
    create: {
      width: breite,
      height: hoehe,
      channels: 3,
      background: { r: 30, g: 30, b: 34 },
    },
  })
    /*
     * Bewusst mit Aufnahmedaten. Bei echten Fahrzeugbildern steht hier
     * regelmaessig der Aufnahmeort -- und der ist oft die Wohnadresse der
     * verkaufenden Person.
     */
    .withExif({
      IFD0: { Copyright: `Testaufnahme ${marker}`, Artist: 'Verkaufende Person' },
    })
    .jpeg()
    .toBuffer();
}

async function bildHochladen(datei: Buffer, name = 'auto.jpg') {
  const formular = new FormData();
  formular.append('datei', new Blob([new Uint8Array(datei)], { type: 'image/jpeg' }), name);
  const antwort = await fetch(`${BASE_URL}/api/anzeigen/${anzeigeId}/bilder`, {
    method: 'POST',
    headers: { cookie: verkaufCookie },
    body: formular,
  });
  const text = await antwort.text();
  return { status: antwort.status, body: text ? JSON.parse(text) : {} };
}

suite('Marktplatz', () => {
  beforeAll(async () => {
    redaktionCookie = (
      await benutzerMitSitzung({
        email: `markt.redaktion.${marker}@example.test`,
        displayName: 'Redaktion',
        role: 'EDITOR',
      })
    ).cookie;
    verkaufCookie = (
      await benutzerMitSitzung({
        email: `markt.verkauf.${marker}@example.test`,
        displayName: 'Verkauf',
        role: 'USER',
      })
    ).cookie;
    fremdCookie = (
      await benutzerMitSitzung({
        email: `markt.fremd.${marker}@example.test`,
        displayName: 'Fremde Person',
        role: 'USER',
      })
    ).cookie;

    ids.marke = nimmId(
      await api('/api/katalog/hersteller', redaktionCookie, { name: `Marktmarke ${marker}` }),
      'manufacturer',
    );
    ids.modell = nimmId(
      await api('/api/katalog/modelle', redaktionCookie, {
        manufacturerId: ids.marke,
        name: `Marktmodell ${marker}`,
      }),
      'model',
    );
    ids.generation = nimmId(
      await api('/api/katalog/generationen', redaktionCookie, {
        modelId: ids.modell,
        name: 'Marktgeneration',
        yearFrom: 2015,
        yearTo: 2021,
      }),
      'generation',
    );
    await veroeffentlichen('manufacturer', ids.marke);
    await veroeffentlichen('model', ids.modell);
    await veroeffentlichen('generation', ids.generation);

    entwurfId = nimmId(
      await api('/api/verkaufen/entwuerfe', verkaufCookie, { vin: 'WBA3A5C55DF123456' }),
      'draft',
    );
    await api(
      `/api/verkaufen/entwuerfe/${entwurfId}/fahrzeug`,
      verkaufCookie,
      { manufacturerId: ids.marke, modelId: ids.modell, generationId: ids.generation },
      'PATCH',
    );
    await api(
      `/api/verkaufen/entwuerfe/${entwurfId}/angaben`,
      verkaufCookie,
      { mileageKm: 88_000, firstRegistration: '2017-04-01', hadAccident: false },
      'PATCH',
    );
  });

  afterAll(async () => {
    await prisma.listingFavorite.deleteMany({
      where: { listing: { seller: { email: { contains: marker } } } },
    });
    await prisma.listingImage.deleteMany({
      where: { listing: { seller: { email: { contains: marker } } } },
    });
    await prisma.listing.deleteMany({ where: { seller: { email: { contains: marker } } } });
    await prisma.listingDraft.deleteMany({ where: { owner: { email: { contains: marker } } } });
    await prisma.generation.deleteMany({ where: { id: ids.generation } });
    await prisma.model.deleteMany({ where: { id: ids.modell } });
    await prisma.manufacturer.deleteMany({ where: { id: ids.marke } });
    await prisma.source.deleteMany({ where: { title: { contains: marker } } });
    await prisma.user.deleteMany({ where: { email: { contains: marker } } });
    await prisma.$disconnect();
  });

  it('legt eine Anzeige aus dem bestaetigten Entwurf an', async () => {
    const antwort = await api('/api/anzeigen', verkaufCookie, {
      draftId: entwurfId,
      title: `Sehr gepflegtes Fahrzeug ${marker}`,
      description:
        'Diese Beschreibung ist lang genug für die Prüfung und beschreibt das Fahrzeug ' +
        'in ganzen Sätzen, wie es eine ordentliche Anzeige tun sollte.',
      priceCents: 1_450_000,
      negotiable: true,
      postalCode: '10115',
      city: 'Berlin',
    });

    expect(antwort.status).toBe(201);
    const anzeige = (antwort.body as { data: { listing: { id: string; slug: string; status: string; vehicleLabel: string } } }).data.listing;
    anzeigeId = anzeige.id;
    anzeigeSlug = anzeige.slug;

    // Sie beginnt als Entwurf, nicht oeffentlich.
    expect(anzeige.status).toBe('DRAFT');
    expect(anzeige.vehicleLabel).toContain(`Marktmarke ${marker}`);
    expect(anzeige.slug).toMatch(/-[0-9a-f]{8}$/);
  });

  it('zeigt eine unveroeffentlichte Anzeige oeffentlich nicht', async () => {
    const seite = await fetch(`${BASE_URL}/marktplatz/${anzeigeSlug}`);
    expect(seite.status).toBe(404);
  });

  it('kopiert die Angaben, statt auf den Entwurf zu verweisen', async () => {
    // Der Entwurf wird geaendert -- die Anzeige darf sich nicht mitaendern.
    await api(
      `/api/verkaufen/entwuerfe/${entwurfId}/angaben`,
      verkaufCookie,
      { mileageKm: 250_000 },
      'PATCH',
    );

    const antwort = await api(`/api/anzeigen/${anzeigeId}`, verkaufCookie, undefined, 'GET');
    const anzeige = (antwort.body as { data: { listing: { mileageKm: number } } }).data.listing;
    expect(anzeige.mileageKm).toBe(88_000);
  });

  it('laesst eine fremde Anzeige nicht aendern und meldet sie als nicht gefunden', async () => {
    const antwort = await api(
      `/api/anzeigen/${anzeigeId}`,
      fremdCookie,
      { priceCents: 100 },
      'PATCH',
    );
    // Nicht 403: Ein Verbot bestaetigte, dass es diese Kennung gibt.
    expect(antwort.status).toBe(404);
  });

  it('lehnt einen unmoeglichen Statuswechsel mit Begruendung ab', async () => {
    const antwort = await api(
      `/api/anzeigen/${anzeigeId}/status`,
      verkaufCookie,
      { status: 'PAUSED' },
      'PATCH',
    );
    expect(antwort.status).toBe(409);
    expect(JSON.stringify(antwort.body)).toContain('Möglich wäre');
  });

  it('nimmt kein Skript als Bild an, auch nicht mit Bildendung', async () => {
    /*
     * Der wichtigste Bildtest. Die Datei heisst .jpg und wird als image/jpeg
     * gemeldet -- entscheidend ist aber der Dateianfang.
     */
    const formular = new FormData();
    formular.append(
      'datei',
      new Blob([new TextEncoder().encode('#!/bin/sh\necho pwned\n')], { type: 'image/jpeg' }),
      'harmlos.jpg',
    );
    const antwort = await fetch(`${BASE_URL}/api/anzeigen/${anzeigeId}/bilder`, {
      method: 'POST',
      headers: { cookie: verkaufCookie },
      body: formular,
    });
    expect(antwort.status).toBe(415);
  });

  it('nimmt ein Bild an und entfernt dabei die Aufnahmedaten', async () => {
    const antwort = await bildHochladen(await testBild());
    expect(antwort.status).toBe(201);

    const bild = (antwort.body as { data: { image: { id: string; storageKey: string; contentType: string } } })
      .data.image;
    expect(bild.contentType).toBe('image/webp');
    expect(bild.storageKey).toBe(`listings/${anzeigeId}/${bild.id}.webp`);

    // Und jetzt der Punkt: Die EXIF-Angaben sind weg.
    const geliefert = await fetch(`${BASE_URL}/api/bilder/${bild.storageKey}`);
    expect(geliefert.status).toBe(200);
    expect(geliefert.headers.get('content-type')).toBe('image/webp');
    expect(geliefert.headers.get('x-content-type-options')).toBe('nosniff');

    const bytes = Buffer.from(await geliefert.arrayBuffer());
    const beschreibung = await sharp(bytes).metadata();
    expect(beschreibung.exif).toBeUndefined();
    expect(bytes.toString('latin1')).not.toContain(`Testaufnahme ${marker}`);
  });

  it('lehnt ein zu kleines Bild ab', async () => {
    const antwort = await bildHochladen(await testBild(120, 90));
    expect(antwort.status).toBe(400);
    expect(JSON.stringify(antwort.body)).toContain('zu klein');
  });

  it('veroeffentlicht und macht die Anzeige oeffentlich sichtbar', async () => {
    const antwort = await api(
      `/api/anzeigen/${anzeigeId}/status`,
      verkaufCookie,
      { status: 'ACTIVE' },
      'PATCH',
    );
    expect(antwort.status).toBe(200);

    const anzeige = (antwort.body as { data: { listing: { publishedAt: string; expiresAt: string } } })
      .data.listing;
    expect(anzeige.publishedAt).not.toBeNull();
    expect(new Date(anzeige.expiresAt).getTime()).toBeGreaterThan(Date.now());

    const seite = await fetch(`${BASE_URL}/marktplatz/${anzeigeSlug}`);
    expect(seite.status).toBe(200);
    const html = await seite.text();
    expect(html).toContain(`Sehr gepflegtes Fahrzeug ${marker}`);
    expect(html).toContain('14.500');
    expect(html).toContain('Unfallfrei');
    // Strukturierte Daten fuer Suchmaschinen.
    expect(html).toContain('application/ld+json');
    expect(html).toContain('schema.org');
  });

  it('findet die Anzeige ueber die Suche und filtert nach Preis', async () => {
    const treffer = await api(
      `/api/anzeigen?q=${encodeURIComponent(marker)}`,
      '',
      undefined,
      'GET',
    );
    expect(treffer.status).toBe(200);
    const daten = treffer.body as { data: { gesamt: number; treffer: { id: string }[] } };
    expect(daten.data.treffer.some((a) => a.id === anzeigeId)).toBe(true);

    // Preisfilter aus Zeichenketten -- der Fall, der in der Fahrzeugsuche
    // schon einmal still danebenging.
    const zuTeuer = await api(
      `/api/anzeigen?q=${encodeURIComponent(marker)}&preisBis=1000`,
      '',
      undefined,
      'GET',
    );
    const gefiltert = zuTeuer.body as { data: { treffer: { id: string }[] } };
    expect(gefiltert.data.treffer.some((a) => a.id === anzeigeId)).toBe(false);
  });

  it('nimmt die Anzeige in die Merkliste auf, aber nur eine sichtbare', async () => {
    const gemerkt = await api(`/api/anzeigen/${anzeigeId}/merken`, fremdCookie, undefined, 'PUT');
    expect(gemerkt.status).toBe(200);

    // Zweimal merken ist ein Doppelklick, kein Fehler.
    const nochmal = await api(`/api/anzeigen/${anzeigeId}/merken`, fremdCookie, undefined, 'PUT');
    expect(nochmal.status).toBe(200);

    const entfernt = await api(
      `/api/anzeigen/${anzeigeId}/merken`,
      fremdCookie,
      undefined,
      'DELETE',
    );
    expect(entfernt.status).toBe(204);
  });

  it('nimmt die Anzeige nach dem Pausieren aus dem Marktplatz', async () => {
    const antwort = await api(
      `/api/anzeigen/${anzeigeId}/status`,
      verkaufCookie,
      { status: 'PAUSED' },
      'PATCH',
    );
    expect(antwort.status).toBe(200);

    const seite = await fetch(`${BASE_URL}/marktplatz/${anzeigeSlug}`);
    expect(seite.status).toBe(404);

    const treffer = await api(
      `/api/anzeigen?q=${encodeURIComponent(marker)}`,
      '',
      undefined,
      'GET',
    );
    const daten = treffer.body as { data: { treffer: { id: string }[] } };
    expect(daten.data.treffer.some((a) => a.id === anzeigeId)).toBe(false);
  });

  it('macht Verkauft zu einem Endzustand', async () => {
    const verkauft = await api(
      `/api/anzeigen/${anzeigeId}/status`,
      verkaufCookie,
      { status: 'SOLD' },
      'PATCH',
    );
    expect(verkauft.status).toBe(200);

    const zurueck = await api(
      `/api/anzeigen/${anzeigeId}/status`,
      verkaufCookie,
      { status: 'ACTIVE' },
      'PATCH',
    );
    expect(zurueck.status).toBe(409);

    // Und aendern laesst sie sich auch nicht mehr.
    const aendern = await api(
      `/api/anzeigen/${anzeigeId}`,
      verkaufCookie,
      { priceCents: 100_00 },
      'PATCH',
    );
    expect(aendern.status).toBe(404);
  });
});
