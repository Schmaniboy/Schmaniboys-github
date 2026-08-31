import sharp from 'sharp';

import { prisma, walletRepository } from '@ap/db';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { benutzerMitSitzung } from './helpers/session';

/**
 * Ende-zu-Ende: der ganze Weg, nicht die einzelnen Stationen.
 *
 * Die Fachtests der Phasen pruefen jeder ihren Ausschnitt. Dieser Test geht
 * einmal quer durch: Redaktion legt einen Katalog an, eine verkaufende Person
 * macht daraus eine Anzeige mit Bild, eine kaufende Person findet sie, merkt
 * sie sich und schreibt an, die Verwaltung moderiert, und am Ende stimmen die
 * Zahlen. Was hier bricht, bricht zwischen zwei Phasen -- und genau das
 * findet kein Fachtest.
 */

const BASE_URL = process.env.SMOKE_BASE_URL ?? 'http://127.0.0.1:3000';

const reachable = await fetch(`${BASE_URL}/api/health`, { signal: AbortSignal.timeout(2000) })
  .then((r) => r.ok)
  .catch(() => false);

const suite = reachable ? describe : describe.skip;

const marker = `sys${Date.now().toString(36)}`;
const ids: Record<string, string> = {};
const cookies: Record<string, string> = {};
const kennungen: Record<string, string> = {};
let entwurfId = '';
let anzeigeId = '';
let anzeigeSlug = '';
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

async function seite(pfad: string, cookie = '') {
  const antwort = await fetch(`${BASE_URL}${pfad}`, {
    headers: cookie ? { cookie } : {},
    redirect: 'manual',
  });
  return { status: antwort.status, html: antwort.ok ? await antwort.text() : '' };
}

suite('Systemtest: der ganze Weg', () => {
  beforeAll(async () => {
    for (const [name, rolle] of [
      ['redaktion', 'EDITOR'],
      ['verkauf', 'USER'],
      ['kauf', 'USER'],
      ['haendler', 'DEALER_OWNER'],
      ['verwaltung', 'ADMIN'],
    ] as const) {
      const person = await benutzerMitSitzung({
        email: `sys.${name}.${marker}@example.test`,
        displayName: `${name} ${marker}`,
        role: rolle,
      });
      cookies[name] = person.cookie;
      kennungen[name] = person.userId;
    }

    const betrieb = await prisma.dealer.create({
      data: { name: `Systemautohaus ${marker}`, slug: `sys-${marker}`, status: 'ACTIVE' },
      select: { id: true },
    });
    ids.betrieb = betrieb.id;
    await prisma.user.update({
      where: { id: kennungen.haendler ?? '' },
      data: { dealerId: betrieb.id },
    });
  });

  afterAll(async () => {
    await prisma.notification.deleteMany({ where: { user: { email: { contains: marker } } } });
    await prisma.messageAttachment.deleteMany({
      where: { message: { sender: { email: { contains: marker } } } },
    });
    await prisma.message.deleteMany({ where: { sender: { email: { contains: marker } } } });
    await prisma.conversation.deleteMany({
      where: { OR: [{ initiator: { email: { contains: marker } } }, { recipient: { email: { contains: marker } } }] },
    });
    await prisma.listingFavorite.deleteMany({ where: { user: { email: { contains: marker } } } });
    await prisma.listingImage.deleteMany({
      where: { listing: { seller: { email: { contains: marker } } } },
    });
    await prisma.listing.deleteMany({ where: { seller: { email: { contains: marker } } } });
    await prisma.listingDraft.deleteMany({ where: { owner: { email: { contains: marker } } } });
    await prisma.tokenHold.deleteMany({ where: { wallet: { user: { email: { contains: marker } } } } });
    await prisma.tokenTransaction.deleteMany({
      where: { wallet: { user: { email: { contains: marker } } } },
    });
    await prisma.wallet.deleteMany({ where: { user: { email: { contains: marker } } } });
    await prisma.auditLog.deleteMany({ where: { actor: { email: { contains: marker } } } });
    if (ids.generation) await prisma.generation.deleteMany({ where: { id: ids.generation } });
    if (ids.modell) await prisma.model.deleteMany({ where: { id: ids.modell } });
    if (ids.marke) await prisma.manufacturer.deleteMany({ where: { id: ids.marke } });
    await prisma.source.deleteMany({ where: { title: { contains: marker } } });
    await prisma.user.updateMany({ where: { email: { contains: marker } }, data: { dealerId: null } });
    await prisma.user.deleteMany({ where: { email: { contains: marker } } });
    await prisma.dealer.deleteMany({ where: { id: ids.betrieb } });
    await prisma.$disconnect();
  });

  it('14.x Redaktion: legt einen Katalog an und veroeffentlicht ihn', async () => {
    const rc = cookies.redaktion ?? '';

    ids.marke = nimmId(
      await api('/api/katalog/hersteller', rc, { name: `Systemmarke ${marker}` }, 'POST'),
      'manufacturer',
    );
    ids.modell = nimmId(
      await api('/api/katalog/modelle', rc, { manufacturerId: ids.marke, name: `Systemmodell ${marker}` }, 'POST'),
      'model',
    );
    ids.generation = nimmId(
      await api('/api/katalog/generationen', rc, { modelId: ids.modell, name: 'Erste Generation', yearFrom: 2015, yearTo: 2021 }, 'POST'),
      'generation',
    );
    expect(ids.generation).not.toBe('');

    // Ohne Quelle wird nichts veroeffentlicht -- die Regel aus Phase 2.
    const ohneQuelle = await api(
      `/api/katalog/eintraege/manufacturer/${ids.marke}/status`,
      rc,
      { status: 'PUBLISHED' },
      'PATCH',
    );
    expect(ohneQuelle.status).not.toBe(200);

    for (const [subject, id] of [
      ['manufacturer', ids.marke],
      ['model', ids.modell],
      ['generation', ids.generation],
    ] as const) {
      await api(`/api/katalog/eintraege/${subject}/${id}/quellen`, rc, { title: `Beleg ${marker}`, kind: 'MANUFACTURER_DOCUMENT' }, 'POST');
      await api(`/api/katalog/eintraege/${subject}/${id}/status`, rc, { status: 'IN_REVIEW' }, 'PATCH');
      const ergebnis = await api(`/api/katalog/eintraege/${subject}/${id}/status`, rc, { status: 'PUBLISHED' }, 'PATCH');
      expect(ergebnis.status, subject).toBe(200);
    }
  });

  it('14.2 Verkäufer: VIN, Bestätigung, Angaben — und keine Erfindung dazwischen', async () => {
    const vc = cookies.verkauf ?? '';

    const angelegt = await api('/api/verkaufen/entwuerfe', vc, { vin: 'WBA3A5C55DF123456' }, 'POST');
    expect(angelegt.status).toBe(201);
    entwurfId = nimmId(angelegt, 'draft');

    // Aus der VIN kommt nichts, was nicht drinsteht.
    const inhalt = angelegt.body as { data: { decoding: Record<string, unknown> } };
    expect(inhalt.data.decoding).not.toHaveProperty('model');
    expect(inhalt.data.decoding).not.toHaveProperty('engine');
    expect(Array.isArray(inhalt.data.decoding.modelYearCandidates)).toBe(true);

    // Ohne bestaetigtes Fahrzeug keine Texte und keine Bewertung.
    expect((await api(`/api/verkaufen/entwuerfe/${entwurfId}/texte`, vc, undefined, 'POST')).status).toBe(409);
    expect((await api(`/api/verkaufen/entwuerfe/${entwurfId}/bewertung`, vc, undefined, 'POST')).status).toBe(409);

    const bestaetigt = await api(
      `/api/verkaufen/entwuerfe/${entwurfId}/fahrzeug`,
      vc,
      { manufacturerId: ids.marke, modelId: ids.modell, generationId: ids.generation },
      'PATCH',
    );
    expect(bestaetigt.status).toBe(200);

    // Widersprueche werden abgelehnt.
    const widerspruch = await api(
      `/api/verkaufen/entwuerfe/${entwurfId}/angaben`,
      vc,
      { hadAccident: false, accidentDetails: 'Frontschaden 2019' },
      'PATCH',
    );
    expect(widerspruch.status).toBe(400);

    const angaben = await api(
      `/api/verkaufen/entwuerfe/${entwurfId}/angaben`,
      vc,
      { mileageKm: 92_000, firstRegistration: '2017-06-01', previousOwners: 1, condition: 'GOOD', hadAccident: false },
      'PATCH',
    );
    expect(angaben.status).toBe(200);
  });

  it('14.4 Token: Bewertung ohne Marktdaten kostet nichts', async () => {
    const vc = cookies.verkauf ?? '';
    await walletRepository.credit({
      userId: kennungen.verkauf ?? '',
      amountTokens: 100,
      type: 'ADMIN_CREDIT',
      purpose: 'Systemtest',
      reference: `${marker}-guthaben`,
      actorId: null,
    });

    const vorher = await walletRepository.ensureWallet(kennungen.verkauf ?? '');
    const bewertung = await api(`/api/verkaufen/entwuerfe/${entwurfId}/bewertung`, vc, undefined, 'POST');
    expect(bewertung.status).toBe(200);

    const daten = bewertung.body as { data: { charged: number; valuation: { marketValueCents: null } } };
    expect(daten.data.charged).toBe(0);
    expect(daten.data.valuation.marketValueCents).toBeNull();

    const nachher = await walletRepository.ensureWallet(kennungen.verkauf ?? '');
    expect(nachher.balanceTokens).toBe(vorher.balanceTokens);
    expect(nachher.reservedTokens).toBe(0);

    // Und Guthaben kaufen geht ohne Zahlungsweg gar nicht erst los.
    const kauf = await api('/api/guthaben/kaufen', vc, { paket: 'klein' }, 'POST');
    expect(kauf.status).toBe(501);
  });

  it('14.2 Verkäufer: Anzeige mit Bild, veröffentlicht', async () => {
    const vc = cookies.verkauf ?? '';

    anzeigeId = nimmId(
      await api('/api/anzeigen', vc, {
        draftId: entwurfId,
        title: `Systemtestfahrzeug ${marker}`,
        description: 'Eine ausreichend lange Beschreibung, die das Fahrzeug in ganzen Sätzen darstellt.',
        priceCents: 1_290_000,
        postalCode: '10115',
        city: 'Berlin',
      }, 'POST'),
      'listing',
    );
    expect(anzeigeId).not.toBe('');

    const bild = await sharp({ create: { width: 1200, height: 900, channels: 3, background: { r: 20, g: 20, b: 24 } } })
      .withExif({ IFD0: { Copyright: `Systemtest ${marker}` } })
      .jpeg()
      .toBuffer();
    const formular = new FormData();
    formular.append('datei', new Blob([new Uint8Array(bild)], { type: 'image/jpeg' }), 'auto.jpg');
    const hochgeladen = await fetch(`${BASE_URL}/api/anzeigen/${anzeigeId}/bilder`, {
      method: 'POST',
      headers: { cookie: vc },
      body: formular,
    });
    expect(hochgeladen.status).toBe(201);

    const veroeffentlicht = await api(`/api/anzeigen/${anzeigeId}/status`, vc, { status: 'ACTIVE' }, 'PATCH');
    expect(veroeffentlicht.status).toBe(200);
    anzeigeSlug = (veroeffentlicht.body as { data: { listing: { slug: string } } }).data.listing.slug;
  });

  it('14.1 Käufer: findet, sieht, merkt sich und schreibt an', async () => {
    const kc = cookies.kauf ?? '';

    const treffer = await api(`/api/anzeigen?q=${encodeURIComponent(marker)}`, '');
    const gefunden = treffer.body as { data: { treffer: { id: string }[] } };
    expect(gefunden.data.treffer.some((a) => a.id === anzeigeId)).toBe(true);

    const anzeigenseite = await seite(`/marktplatz/${anzeigeSlug}`);
    expect(anzeigenseite.status).toBe(200);
    expect(anzeigenseite.html).toContain(`Systemtestfahrzeug ${marker}`);
    expect(anzeigenseite.html).toContain('Unfallfrei');

    expect((await api(`/api/anzeigen/${anzeigeId}/merken`, kc, undefined, 'PUT')).status).toBe(200);

    const gespraech = await api('/api/nachrichten', kc, { listingId: anzeigeId }, 'POST');
    expect(gespraech.status).toBe(201);
    gespraechId = nimmId(gespraech, 'conversation');

    const nachricht = await api(
      `/api/nachrichten/${gespraechId}`,
      kc,
      { body: 'Guten Tag, ist das Fahrzeug noch verfügbar?' },
      'POST',
    );
    expect(nachricht.status).toBe(201);

    // Der Verkaeufer bekommt eine Benachrichtigung -- ohne den Text darin.
    const benachrichtigungen = await api('/api/benachrichtigungen', cookies.verkauf ?? '');
    const bDaten = benachrichtigungen.body as { data: { unread: number; notifications: unknown[] } };
    expect(bDaten.data.unread).toBeGreaterThan(0);
    expect(JSON.stringify(bDaten.data.notifications)).not.toContain('noch verfügbar');
  });

  it('14.3 Händler: sieht nur den eigenen Betrieb', async () => {
    const hc = cookies.haendler ?? '';

    const profil = await api('/api/haendler/profil', hc);
    expect(profil.status).toBe(200);
    const pDaten = profil.body as { data: { dealer: { id: string } } };
    expect(pDaten.data.dealer.id).toBe(ids.betrieb);

    // Die fremde Anzeige gehoert keinem Betrieb -- sie taucht im Bestand nicht auf.
    const bestand = await seite('/haendler/bestand', hc);
    expect(bestand.status).toBe(200);
    expect(bestand.html).not.toContain(`Systemtestfahrzeug ${marker}`);
  });

  it('14.5 Verwaltung: moderiert die Anzeige und protokolliert es', async () => {
    const ac = cookies.verwaltung ?? '';

    const massnahme = await api('/api/admin/moderation', ac, {
      ziel: 'LISTING',
      id: anzeigeId,
      aktion: 'HIDE',
      reason: 'Systemtest: Prüfung der Moderationskette.',
    }, 'POST');
    expect(massnahme.status).toBe(200);

    // Danach ist sie oeffentlich weg.
    expect((await seite(`/marktplatz/${anzeigeSlug}`)).status).toBe(404);

    const protokoll = await prisma.auditLog.findFirst({
      where: { action: 'listing.moderated', subjectId: anzeigeId },
      select: { metadata: true },
    });
    expect(JSON.stringify(protokoll?.metadata)).toContain('Moderationskette');

    // Und wieder zurueck.
    const zurueck = await api('/api/admin/moderation', ac, {
      ziel: 'LISTING',
      id: anzeigeId,
      aktion: 'RESTORE',
      reason: 'Systemtest: Sachverhalt geklärt.',
    }, 'POST');
    expect(zurueck.status).toBe(200);
    expect((await seite(`/marktplatz/${anzeigeSlug}`)).status).toBe(200);
  });

  it('14.6 Security: quer durch alle Rollen greift niemand auf Fremdes zu', async () => {
    const kc = cookies.kauf ?? '';
    const vc = cookies.verkauf ?? '';

    /*
     * Die Sammelpruefung. Jede Zeile ist ein Zugriff auf etwas Fremdes, und
     * jede muss 403 oder 404 ergeben -- niemals 200.
     */
    const versuche: { was: string; antwort: { status: number } }[] = [
      { was: 'fremder Entwurf', antwort: await api(`/api/verkaufen/entwuerfe/${entwurfId}`, kc) },
      { was: 'fremde Anzeige ändern', antwort: await api(`/api/anzeigen/${anzeigeId}`, kc, { priceCents: 100 }, 'PATCH') },
      { was: 'fremdes Gespräch lesen', antwort: await api(`/api/nachrichten/${gespraechId}`, cookies.haendler ?? '') },
      { was: 'Händlerprofil ohne Betrieb', antwort: await api('/api/haendler/profil', kc) },
      { was: 'Benutzerliste ohne Recht', antwort: await api('/api/admin/benutzer', vc) },
      { was: 'Moderation ohne Recht', antwort: await api('/api/admin/moderation', vc, { ziel: 'LISTING', id: anzeigeId, aktion: 'HIDE', reason: 'Unbefugter Versuch.' }, 'POST') },
    ];

    for (const versuch of versuche) {
      expect([403, 404], versuch.was).toContain(versuch.antwort.status);
    }

    // Und die Seiten ebenso.
    for (const pfad of ['/admin', '/admin/benutzer', '/admin/protokoll']) {
      expect((await seite(pfad, vc)).status, pfad).toBe(404);
    }
  });

  it('14.6 Security: Sicherheitskopfzeilen stehen auf jeder Antwort', async () => {
    for (const pfad of ['/', '/marktplatz', `/marktplatz/${anzeigeSlug}`, '/api/health']) {
      const antwort = await fetch(`${BASE_URL}${pfad}`);
      expect(antwort.headers.get('x-content-type-options'), pfad).toBe('nosniff');
      expect(antwort.headers.get('x-frame-options'), pfad).toBe('DENY');
      expect(antwort.headers.get('content-security-policy'), pfad).toBeTruthy();
      expect(antwort.headers.get('x-powered-by'), pfad).toBeNull();
    }
  });

  it('14.7 Am Ende stimmen die Zahlen', async () => {
    const konto = await walletRepository.ensureWallet(kennungen.verkauf ?? '');
    // Nichts verbraucht: Es gibt weder KI-Zugang noch Marktdaten.
    expect(konto.balanceTokens).toBe(100);
    expect(konto.reservedTokens).toBe(0);

    const anzeige = await prisma.listing.findUnique({
      where: { id: anzeigeId },
      select: { status: true, _count: { select: { images: true } } },
    });
    expect(anzeige?.status).toBe('ACTIVE');
    expect(anzeige?._count.images).toBe(1);

    const nachrichten = await prisma.message.count({ where: { conversationId: gespraechId } });
    expect(nachrichten).toBe(1);

    const merkliste = await prisma.listingFavorite.count({ where: { listingId: anzeigeId } });
    expect(merkliste).toBe(1);
  });
});
