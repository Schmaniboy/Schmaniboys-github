import { prisma } from '@ap/db';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { benutzerMitSitzung } from './helpers/session';

/**
 * Nachrichten ueber die echte Schnittstelle.
 *
 * Schwerpunkt ist der IDOR-Schutz: Wer nicht beteiligt ist, darf ein
 * Gespraech weder lesen noch darin schreiben -- und bekommt "nicht
 * gefunden", nicht "verboten".
 */

const BASE_URL = process.env.SMOKE_BASE_URL ?? 'http://127.0.0.1:3000';

const reachable = await fetch(`${BASE_URL}/api/health`, { signal: AbortSignal.timeout(2000) })
  .then((r) => r.ok)
  .catch(() => false);

const suite = reachable ? describe : describe.skip;

const marker = `msg${Date.now().toString(36)}`;
const ids: Record<string, string> = {};
let verkaeuferCookie = '';
let kaeuferCookie = '';
let fremdCookie = '';
let verkaeuferId = '';
let kaeuferId = '';
let anzeigeId = '';
let gespraechId = '';

async function api(pfad: string, cookie: string, body?: unknown, method = 'GET') {
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

suite('Nachrichten', () => {
  beforeAll(async () => {
    const redaktion = await benutzerMitSitzung({
      email: `msg.redaktion.${marker}@example.test`,
      displayName: 'Redaktion',
      role: 'EDITOR',
    });
    const verkaeufer = await benutzerMitSitzung({
      email: `msg.verkauf.${marker}@example.test`,
      displayName: 'Verkaufende Person',
      role: 'USER',
    });
    const kaeufer = await benutzerMitSitzung({
      email: `msg.kauf.${marker}@example.test`,
      displayName: 'Kaufende Person',
      role: 'USER',
    });
    const fremd = await benutzerMitSitzung({
      email: `msg.fremd.${marker}@example.test`,
      displayName: 'Unbeteiligte',
      role: 'USER',
    });

    verkaeuferCookie = verkaeufer.cookie;
    kaeuferCookie = kaeufer.cookie;
    fremdCookie = fremd.cookie;
    verkaeuferId = verkaeufer.userId;
    kaeuferId = kaeufer.userId;

    // Katalog und Anzeige aufbauen.
    const rc = redaktion.cookie;
    ids.marke = nimmId(
      await api('/api/katalog/hersteller', rc, { name: `Nachrichtenmarke ${marker}` }, 'POST'),
      'manufacturer',
    );
    ids.modell = nimmId(
      await api('/api/katalog/modelle', rc, { manufacturerId: ids.marke, name: `Modell ${marker}` }, 'POST'),
      'model',
    );
    ids.generation = nimmId(
      await api('/api/katalog/generationen', rc, { modelId: ids.modell, name: 'Generation', yearFrom: 2016, yearTo: 2022 }, 'POST'),
      'generation',
    );
    for (const [subject, id] of [
      ['manufacturer', ids.marke],
      ['model', ids.modell],
      ['generation', ids.generation],
    ] as const) {
      await api(`/api/katalog/eintraege/${subject}/${id}/quellen`, rc, { title: `Beleg ${marker}`, kind: 'MANUFACTURER_DOCUMENT' }, 'POST');
      await api(`/api/katalog/eintraege/${subject}/${id}/status`, rc, { status: 'IN_REVIEW' }, 'PATCH');
      await api(`/api/katalog/eintraege/${subject}/${id}/status`, rc, { status: 'PUBLISHED' }, 'PATCH');
    }

    const entwurfId = nimmId(
      await api('/api/verkaufen/entwuerfe', verkaeuferCookie, { vin: 'WBA3A5C55DF123456' }, 'POST'),
      'draft',
    );
    await api(`/api/verkaufen/entwuerfe/${entwurfId}/fahrzeug`, verkaeuferCookie, {
      manufacturerId: ids.marke, modelId: ids.modell, generationId: ids.generation,
    }, 'PATCH');

    anzeigeId = nimmId(
      await api('/api/anzeigen', verkaeuferCookie, {
        draftId: entwurfId,
        title: `Nachrichtentestfahrzeug ${marker}`,
        description: 'Eine ausreichend lange Beschreibung für die Prüfung dieses Testfalls.',
        priceCents: 990_000,
        postalCode: '10115',
        city: 'Berlin',
      }, 'POST'),
      'listing',
    );
    await api(`/api/anzeigen/${anzeigeId}/status`, verkaeuferCookie, { status: 'ACTIVE' }, 'PATCH');
  });

  afterAll(async () => {
    await prisma.notification.deleteMany({ where: { user: { email: { contains: marker } } } });
    await prisma.message.deleteMany({ where: { sender: { email: { contains: marker } } } });
    await prisma.conversation.deleteMany({
      where: { OR: [{ initiator: { email: { contains: marker } } }, { recipient: { email: { contains: marker } } }] },
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

  it('beginnt ein Gespraech zu einer Anzeige', async () => {
    const antwort = await api('/api/nachrichten', kaeuferCookie, { listingId: anzeigeId }, 'POST');
    expect(antwort.status).toBe(201);

    const gespraech = (antwort.body as { data: { conversation: { id: string; recipientId: string; listingLabel: string } } })
      .data.conversation;
    gespraechId = gespraech.id;
    expect(gespraech.recipientId).toBe(verkaeuferId);
    // Fahrzeugbezug kopiert, damit das Gespraech lesbar bleibt.
    expect(gespraech.listingLabel).toContain(`Nachrichtenmarke ${marker}`);
  });

  it('gibt bei erneutem Anschreiben dasselbe Gespraech zurueck', async () => {
    // Ohne diese Bedingung liesse sich derselbe Posteingang fluten.
    const antwort = await api('/api/nachrichten', kaeuferCookie, { listingId: anzeigeId }, 'POST');
    const zweites = (antwort.body as { data: { conversation: { id: string } } }).data.conversation;
    expect(zweites.id).toBe(gespraechId);

    const anzahl = await prisma.conversation.count({ where: { listingId: anzeigeId } });
    expect(anzahl).toBe(1);
  });

  it('laesst niemanden sich selbst anschreiben', async () => {
    const antwort = await api('/api/nachrichten', verkaeuferCookie, { listingId: anzeigeId }, 'POST');
    expect(antwort.status).toBe(409);
  });

  it('sendet eine Nachricht und legt eine Benachrichtigung an', async () => {
    const antwort = await api(
      `/api/nachrichten/${gespraechId}`,
      kaeuferCookie,
      { body: 'Ist das Fahrzeug noch verfügbar?' },
      'POST',
    );
    expect(antwort.status).toBe(201);

    const benachrichtigungen = await prisma.notification.findMany({
      where: { userId: verkaeuferId },
      select: { title: true, body: true, href: true },
    });
    expect(benachrichtigungen).toHaveLength(1);
    expect(benachrichtigungen[0]?.title).toContain('Kaufende Person');
    // Der Nachrichtentext steht ausdruecklich NICHT in der Benachrichtigung.
    expect(JSON.stringify(benachrichtigungen[0])).not.toContain('noch verfügbar');
  });

  it('laesst eine unbeteiligte Person das Gespraech nicht lesen', async () => {
    /*
     * Der wichtigste Test dieser Datei. 404 statt 403: Ein Verbot
     * bestaetigte, dass es dieses Gespraech gibt.
     */
    const lesen = await api(`/api/nachrichten/${gespraechId}`, fremdCookie);
    expect(lesen.status).toBe(404);

    const schreiben = await api(
      `/api/nachrichten/${gespraechId}`,
      fremdCookie,
      { body: 'Ich gehöre hier nicht dazu.' },
      'POST',
    );
    expect(schreiben.status).toBe(404);

    const anzahl = await prisma.message.count({ where: { conversationId: gespraechId } });
    expect(anzahl).toBe(1);
  });

  it('markiert beim Lesen nur die Nachrichten der Gegenseite', async () => {
    const lesen = await api(`/api/nachrichten/${gespraechId}`, verkaeuferCookie);
    expect(lesen.status).toBe(200);

    const nachrichten = await prisma.message.findMany({
      where: { conversationId: gespraechId },
      select: { senderId: true, readAt: true },
    });
    // Die Nachricht des Kaeufers ist gelesen ...
    expect(nachrichten.find((n) => n.senderId === kaeuferId)?.readAt).not.toBeNull();
  });

  it('liefert Warnhinweise mit, ohne die Nachricht zurueckzuhalten', async () => {
    await api(
      `/api/nachrichten/${gespraechId}`,
      verkaeuferCookie,
      { body: 'Zahlung per Vorkasse, meine Spedition holt es dringend ab.' },
      'POST',
    );

    const lesen = await api(`/api/nachrichten/${gespraechId}`, kaeuferCookie);
    const daten = lesen.body as {
      data: { messages: { body: string | null }[]; warnungen: { id: string }[] };
    };

    const zeichen = daten.data.warnungen.map((w) => w.id);
    expect(zeichen).toContain('zahlung-vorab');
    expect(zeichen).toContain('spedition');
    // Die Nachricht kommt trotzdem an -- ein Filter, der verschluckt, ist
    // schlimmer als ein Hinweis, den jemand ignoriert.
    expect(daten.data.messages.some((n) => n.body?.includes('Vorkasse'))).toBe(true);
  });

  it('lehnt eine leere Nachricht ab', async () => {
    const antwort = await api(`/api/nachrichten/${gespraechId}`, kaeuferCookie, { body: '   ' }, 'POST');
    expect(antwort.status).toBe(400);
  });

  it('schliesst ein Gespraech und verhindert weiteres Schreiben', async () => {
    const schliessen = await api(
      `/api/nachrichten/${gespraechId}`,
      verkaeuferCookie,
      { state: 'CLOSED' },
      'PATCH',
    );
    expect(schliessen.status).toBe(200);

    const versuch = await api(
      `/api/nachrichten/${gespraechId}`,
      kaeuferCookie,
      { body: 'Trotzdem noch etwas.' },
      'POST',
    );
    expect(versuch.status).toBe(409);

    // Lesen geht weiter.
    const lesen = await api(`/api/nachrichten/${gespraechId}`, kaeuferCookie);
    expect(lesen.status).toBe(200);
  });

  it('zeigt Benachrichtigungen nur der eigenen Person', async () => {
    const eigene = await api('/api/benachrichtigungen', verkaeuferCookie);
    const daten = eigene.body as { data: { notifications: unknown[]; unread: number } };
    expect(daten.data.notifications.length).toBeGreaterThan(0);

    const fremde = await api('/api/benachrichtigungen', fremdCookie);
    const fremdDaten = fremde.body as { data: { notifications: unknown[] } };
    expect(fremdDaten.data.notifications).toHaveLength(0);
  });

  it('antwortet ohne Anmeldung mit einer Null statt mit 401', async () => {
    // Die Kopfzeile fragt das auf jeder Seite ab.
    const antwort = await fetch(`${BASE_URL}/api/benachrichtigungen`);
    expect(antwort.status).toBe(200);
    const inhalt = (await antwort.json()) as { data: { unread: number } };
    expect(inhalt.data.unread).toBe(0);
  });

  it('hakt nur die eigenen Benachrichtigungen ab', async () => {
    const vorher = await prisma.notification.count({ where: { userId: verkaeuferId, readAt: null } });
    expect(vorher).toBeGreaterThan(0);

    // Der Fremde versucht es mit denselben Kennungen.
    const meine = await prisma.notification.findMany({
      where: { userId: verkaeuferId },
      select: { id: true },
    });
    await api('/api/benachrichtigungen', fremdCookie, { ids: meine.map((n) => n.id) }, 'PATCH');

    const nachher = await prisma.notification.count({ where: { userId: verkaeuferId, readAt: null } });
    expect(nachher).toBe(vorher);
  });
});
