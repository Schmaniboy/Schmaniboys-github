import { prisma } from '@ap/db';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { benutzerMitSitzung } from './helpers/session';

/**
 * Die Belegpflicht der Wissensdatenbank, ueber die echte Schnittstelle.
 *
 * Kernaussage dieser Tests: Es gibt keinen Weg, eine unbelegte Behauptung
 * zu veroeffentlichen -- weder als Einschaetzung ohne Begruendung, noch als
 * belegte Angabe ohne belastbare Quelle, noch als Marktbeobachtung ohne
 * Stichtag.
 */

const BASE_URL = process.env.SMOKE_BASE_URL ?? 'http://127.0.0.1:3000';

const reachable = await fetch(`${BASE_URL}/api/health`, { signal: AbortSignal.timeout(2000) })
  .then((r) => r.ok)
  .catch(() => false);

const suite = reachable ? describe : describe.skip;

const marker = `wis${Date.now().toString(36)}`;

let cookie = '';
let generationId = '';
let manufacturerId = '';
let modelId = '';

async function api(
  pfad: string,
  optionen: { method?: string; body?: unknown; mitCookie?: boolean } = {},
) {
  const antwort = await fetch(`${BASE_URL}${pfad}`, {
    method: optionen.method ?? 'GET',
    headers: {
      'content-type': 'application/json',
      ...(optionen.mitCookie === false ? {} : { cookie }),
    },
    ...(optionen.body !== undefined ? { body: JSON.stringify(optionen.body) } : {}),
  });
  const text = await antwort.text();
  return { status: antwort.status, body: text ? JSON.parse(text) : {} };
}

function id(antwort: { body: Record<string, unknown> }, schluessel: string): string {
  const daten = antwort.body.data as Record<string, { id: string }>;
  return daten[schluessel]?.id ?? '';
}

suite('Wissensdatenbank: Belegpflicht', () => {
  beforeAll(async () => {
    cookie = (
      await benutzerMitSitzung({
        email: `wissen.${marker}@example.test`,
        displayName: 'Redaktion',
        role: 'EDITOR',
      })
    ).cookie;

    const marke = await api('/api/katalog/hersteller', {
      method: 'POST',
      body: { name: `Wissensmarke ${marker}` },
    });
    manufacturerId = id(marke, 'manufacturer');

    const modell = await api('/api/katalog/modelle', {
      method: 'POST',
      body: { manufacturerId, name: `Wissensmodell ${marker}` },
    });
    modelId = id(modell, 'model');

    const generation = await api('/api/katalog/generationen', {
      method: 'POST',
      body: { modelId, name: 'Testgeneration', yearFrom: 2015, yearTo: 2020 },
    });
    generationId = id(generation, 'generation');
    expect(generationId).not.toBe('');
  });

  afterAll(async () => {
    await prisma.knownIssue.deleteMany({ where: { generationId } });
    await prisma.maintenanceItem.deleteMany({ where: { generationId } });
    await prisma.costEstimate.deleteMany({ where: { generationId } });
    await prisma.knowledgeNote.deleteMany({ where: { generationId } });
    await prisma.generation.deleteMany({ where: { id: generationId } });
    await prisma.model.deleteMany({ where: { id: modelId } });
    await prisma.manufacturer.deleteMany({ where: { id: manufacturerId } });
    await prisma.source.deleteMany({ where: { title: { contains: marker } } });
    await prisma.user.deleteMany({ where: { email: { contains: marker } } });
    await prisma.$disconnect();
  });

  async function einreichen(subject: string, eintragId: string) {
    return api(`/api/katalog/eintraege/${subject}/${eintragId}/status`, {
      method: 'PATCH',
      body: { status: 'IN_REVIEW' },
    });
  }

  async function veroeffentlichen(subject: string, eintragId: string) {
    return api(`/api/katalog/eintraege/${subject}/${eintragId}/status`, {
      method: 'PATCH',
      body: { status: 'PUBLISHED' },
    });
  }

  async function quelleAnlegen(subject: string, eintragId: string, kind: string) {
    return api(`/api/katalog/eintraege/${subject}/${eintragId}/quellen`, {
      method: 'POST',
      body: { title: `Beleg ${marker}`, kind },
    });
  }

  it('veroeffentlicht eine Einschaetzung ohne Begruendung nicht', async () => {
    const angelegt = await api('/api/katalog/wissen/schwachstellen', {
      method: 'POST',
      body: {
        generationId,
        title: 'Einschaetzung ohne Begruendung',
        severity: 'MINOR',
        evidenceType: 'ASSESSMENT',
      },
    });
    expect(angelegt.status).toBe(201);
    const eintragId = id(angelegt, 'issue');

    await quelleAnlegen('knownIssue', eintragId, 'OTHER');
    await einreichen('knownIssue', eintragId);

    const versuch = await veroeffentlichen('knownIssue', eintragId);
    expect(versuch.status).toBe(409);
    expect(JSON.stringify(versuch.body)).toContain('Begruendung');
  });

  it('veroeffentlicht eine Einschaetzung mit Begruendung', async () => {
    const angelegt = await api('/api/katalog/wissen/schwachstellen', {
      method: 'POST',
      body: {
        generationId,
        title: 'Einschaetzung mit Begruendung',
        severity: 'SIGNIFICANT',
        evidenceType: 'ASSESSMENT',
        reasoning:
          'Mehrere unabhaengige Werkstattberichte nennen dieselbe Baugruppe im selben Laufleistungsbereich.',
      },
    });
    const eintragId = id(angelegt, 'issue');

    await quelleAnlegen('knownIssue', eintragId, 'OTHER');
    await einreichen('knownIssue', eintragId);
    expect((await veroeffentlichen('knownIssue', eintragId)).status).toBe(200);
  });

  it('veroeffentlicht eine belegte Angabe nicht auf eine Pressemitteilung hin', async () => {
    const angelegt = await api('/api/katalog/wissen/wartung', {
      method: 'POST',
      body: {
        generationId,
        task: 'Zahnriemen pruefen lassen',
        intervalKm: 90000,
        evidenceType: 'SPECIFICATION',
      },
    });
    const eintragId = id(angelegt, 'item');

    await quelleAnlegen('maintenanceItem', eintragId, 'PRESS_RELEASE');
    await einreichen('maintenanceItem', eintragId);

    const versuch = await veroeffentlichen('maintenanceItem', eintragId);
    expect(versuch.status).toBe(409);
    expect(JSON.stringify(versuch.body)).toContain('Pressemitteilung');
  });

  it('veroeffentlicht eine belegte Angabe mit Herstellerunterlage', async () => {
    const angelegt = await api('/api/katalog/wissen/wartung', {
      method: 'POST',
      body: {
        generationId,
        task: 'Oelwechsel',
        intervalKm: 30000,
        intervalMonths: 24,
        evidenceType: 'SPECIFICATION',
      },
    });
    const eintragId = id(angelegt, 'item');

    await quelleAnlegen('maintenanceItem', eintragId, 'MANUFACTURER_DOCUMENT');
    await einreichen('maintenanceItem', eintragId);
    expect((await veroeffentlichen('maintenanceItem', eintragId)).status).toBe(200);
  });

  it('veroeffentlicht eine Marktbeobachtung ohne Stichtag nicht', async () => {
    const angelegt = await api('/api/katalog/wissen/kosten', {
      method: 'POST',
      body: {
        generationId,
        category: 'INSURANCE',
        label: 'Beobachtung ohne Stichtag',
        amountFromCents: 30000,
        amountToCents: 60000,
        evidenceType: 'MARKET_SIGNAL',
        dataBasis: 'Auswertung eigener Angebotsdaten aus dem Marktplatz',
      },
    });
    const eintragId = id(angelegt, 'estimate');

    await quelleAnlegen('costEstimate', eintragId, 'OTHER');
    await einreichen('costEstimate', eintragId);

    const versuch = await veroeffentlichen('costEstimate', eintragId);
    expect(versuch.status).toBe(409);
    expect(JSON.stringify(versuch.body)).toContain('Stichtag');
  });

  it('verlangt bei Kostenangaben mindestens einen Betrag', async () => {
    const antwort = await api('/api/katalog/wissen/kosten', {
      method: 'POST',
      body: {
        generationId,
        category: 'SERVICE',
        label: 'Ohne Betrag',
        evidenceType: 'ASSESSMENT',
      },
    });
    expect(antwort.status).toBe(400);
  });

  it('verlangt bei Wartung mindestens ein Intervall', async () => {
    const antwort = await api('/api/katalog/wissen/wartung', {
      method: 'POST',
      body: { generationId, task: 'Irgendetwas pruefen', evidenceType: 'SPECIFICATION' },
    });
    expect(antwort.status).toBe(400);
    expect(JSON.stringify(antwort.body)).toContain('Intervall');
  });

  it('lehnt eine rueckwaerts laufende Laufleistungsspanne ab', async () => {
    const antwort = await api('/api/katalog/wissen/schwachstellen', {
      method: 'POST',
      body: {
        generationId,
        title: 'Unmoegliche Spanne',
        severity: 'MINOR',
        evidenceType: 'ASSESSMENT',
        typicalMileageFromKm: 200000,
        typicalMileageToKm: 100000,
      },
    });
    expect(antwort.status).toBe(400);
  });

  it('laesst normale Benutzer keine Wissensaussagen anlegen', async () => {
    const antwort = await api('/api/katalog/wissen/notizen', {
      method: 'POST',
      mitCookie: false,
      body: {
        generationId,
        topic: 'RELIABILITY',
        heading: 'Ohne Anmeldung',
        body: 'Dieser Text sollte niemals angelegt werden koennen.',
        evidenceType: 'ASSESSMENT',
      },
    });
    expect(antwort.status).toBe(401);
  });
});
