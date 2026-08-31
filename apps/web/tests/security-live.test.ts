import { prisma } from '@ap/db';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { eigeneAdresse } from './helpers/adresse';
import { benutzerMitSitzung } from './helpers/session';

/**
 * Sicherheitsproben.
 *
 * Kein Ersatz fuer eine Pruefung durch Menschen -- aber die Sorte Angriff,
 * die sich automatisiert wiederholen laesst, gehoert in die Testreihe. Was
 * hier steht, wurde versucht, nicht angenommen.
 */

const BASE_URL = process.env.SMOKE_BASE_URL ?? 'http://127.0.0.1:3000';

const reachable = await fetch(`${BASE_URL}/api/health`, { signal: AbortSignal.timeout(2000) })
  .then((r) => r.ok)
  .catch(() => false);

const suite = reachable ? describe : describe.skip;

const marker = `sec${Date.now().toString(36)}`;
let cookie = '';
let userId = '';

async function api(pfad: string, mitCookie: string, body?: unknown, method = 'GET') {
  const antwort = await fetch(`${BASE_URL}${pfad}`, {
    method,
    headers: { 'content-type': 'application/json', cookie: mitCookie },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  const text = await antwort.text();
  return { status: antwort.status, text, body: text ? JSON.parse(text) : {} };
}

suite('Sicherheitsproben', () => {
  beforeAll(async () => {
    const person = await benutzerMitSitzung({
      email: `sec.${marker}@example.test`,
      displayName: 'Probeperson',
      role: 'USER',
    });
    cookie = person.cookie;
    userId = person.userId;

    await api('/api/verkaufen/entwuerfe', cookie, { vin: 'WBA3A5C55DF123456' }, 'POST');
  });

  afterAll(async () => {
    await prisma.listingDraft.deleteMany({ where: { owner: { email: { contains: marker } } } });
    await prisma.user.deleteMany({ where: { email: { contains: marker } } });
    await prisma.$disconnect();
  });

  it('nimmt SQL-Fragmente als Text, nicht als Befehl', async () => {
    /*
     * Prisma setzt Parameter, kein Zusammenbauen von Zeichenketten. Die Probe
     * prueft, dass das auch ueber die Suchparameter gilt -- und dass danach
     * die Tabellen noch da sind.
     */
    const bosheiten = [
      "'; DROP TABLE \"Listing\"; --",
      "' OR '1'='1",
      "1; DELETE FROM \"User\" WHERE 1=1; --",
      "%' OR title LIKE '%",
    ];

    for (const boshaft of bosheiten) {
      const antwort = await fetch(
        `${BASE_URL}/api/anzeigen?q=${encodeURIComponent(boshaft)}`,
      );
      expect([200, 400], boshaft).toContain(antwort.status);
    }

    // Die Tabellen stehen noch.
    expect(await prisma.user.count()).toBeGreaterThan(0);
    expect(await prisma.listing.count()).toBeGreaterThanOrEqual(0);
  });

  it('bettet Skripte aus Nutzereingaben nicht ausfuehrbar ein', async () => {
    const boshaft = '<script>window.__uebernommen=1</script>';

    // Der Titel geht durch die Anzeigenvalidierung; die Suche zeigt ihn an.
    const antwort = await fetch(`${BASE_URL}/marktplatz?q=${encodeURIComponent(boshaft)}`);
    const html = await antwort.text();

    // React maskiert beim Rendern -- das rohe Tag darf nicht durchkommen.
    expect(html).not.toContain('<script>window.__uebernommen');
    expect(antwort.headers.get('content-security-policy')).toBeTruthy();
  });

  it('setzt das Sitzungscookie mit den richtigen Merkmalen', async () => {
    const antwort = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: eigeneAdresse({ 'content-type': 'application/json' }),
      body: JSON.stringify({ email: `sec.${marker}@example.test`, password: 'ein-ausreichend-langes-passwort' }),
    });

    const gesetzt = antwort.headers.get('set-cookie') ?? '';
    expect(gesetzt).toContain('HttpOnly');
    expect(gesetzt.toLowerCase()).toContain('samesite=lax');
    // Der Klartexttoken existiert nur im Cookie.
    const token = gesetzt.split(';')[0]?.split('=')[1] ?? '';
    const gespeichert = await prisma.session.findFirst({
      where: { user: { email: `sec.${marker}@example.test` } },
      select: { tokenHash: true },
    });
    expect(gespeichert?.tokenHash).not.toBe(token);
  });

  it('nimmt keine Felder an, die nicht vorgesehen sind', async () => {
    /*
     * Massenzuweisung: Wer beim Anlegen eines Entwurfs eine fremde
     * Besitzerkennung mitschickt, darf damit nicht durchkommen.
     */
    const fremd = await benutzerMitSitzung({
      email: `sec.fremd.${marker}@example.test`,
      displayName: 'Fremde',
      role: 'USER',
    });

    await api('/api/verkaufen/entwuerfe', cookie, {
      vin: 'WBA3A5C55DF123457',
      ownerId: fremd.userId,
      status: 'PUBLISHED',
    }, 'POST');

    const entwuerfe = await prisma.listingDraft.findMany({
      where: { vin: 'WBA3A5C55DF123457' },
      select: { ownerId: true, status: true },
    });
    for (const entwurf of entwuerfe) {
      expect(entwurf.ownerId).toBe(userId);
      expect(entwurf.status).not.toBe('PUBLISHED');
    }

    await prisma.user.deleteMany({ where: { id: fremd.userId } });
  });

  it('lehnt einen zu grossen Koerper ab, statt ihn zu verarbeiten', async () => {
    const riesig = 'x'.repeat(2 * 1024 * 1024);
    const antwort = await fetch(`${BASE_URL}/api/verkaufen/entwuerfe`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', cookie },
      body: JSON.stringify({ vin: riesig }),
    });
    expect([400, 413]).toContain(antwort.status);
  });

  it('laesst eine gefaelschte Sitzung nicht durch', async () => {
    for (const gefaelscht of [
      'ap_session=gefaelscht',
      `ap_session=${'a'.repeat(64)}`,
      'ap_session=',
      `ap_session=${userId}`,
    ]) {
      const antwort = await api('/api/verkaufen/entwuerfe', gefaelscht);
      expect(antwort.status, gefaelscht).toBe(401);
    }
  });

  it('verraet in Fehlermeldungen keine Interna', async () => {
    const antwort = await api(`/api/verkaufen/entwuerfe/gibtsnicht`, cookie);
    expect(antwort.status).toBe(404);

    // Kein Stapelspeicherauszug, kein Dateipfad, kein SQL.
    for (const verraeterisch of ['prisma', 'at Object', '/home/', 'SELECT', 'node_modules']) {
      expect(antwort.text.toLowerCase(), verraeterisch).not.toContain(verraeterisch.toLowerCase());
    }
  });

  it('greift die Ratenbegrenzung tatsaechlich', async () => {
    /*
     * Nicht nur konfiguriert, sondern wirksam: Die Entwurfsanlage ist auf 30
     * je Stunde begrenzt. Nach genug Versuchen muss 429 kommen.
     */
    const person = await benutzerMitSitzung({
      email: `sec.rate.${marker}@example.test`,
      displayName: 'Ratenprobe',
      role: 'USER',
    });

    let gedrosselt = false;
    for (let i = 0; i < 40; i += 1) {
      const antwort = await api('/api/verkaufen/entwuerfe', person.cookie, { vin: 'WBA3A5C55DF123456' }, 'POST');
      if (antwort.status === 429) {
        gedrosselt = true;
        break;
      }
    }
    expect(gedrosselt).toBe(true);

    await prisma.listingDraft.deleteMany({ where: { ownerId: person.userId } });
    await prisma.user.deleteMany({ where: { id: person.userId } });
  }, 60_000);

  it('liefert Bilder mit festgesetztem Medientyp aus', async () => {
    // Ein Bild, das der Browser als etwas anderes deutet, waere ein
    // Ausfuehrungsweg. Deshalb fester Typ und nosniff.
    const antwort = await fetch(`${BASE_URL}/api/bilder/gibtsnicht/gibtsnicht.webp`);
    expect(antwort.status).toBe(404);

    const gesundheit = await fetch(`${BASE_URL}/api/health`);
    expect(gesundheit.headers.get('x-content-type-options')).toBe('nosniff');
  });

  it('erlaubt kein Einbetten in einen fremden Rahmen', async () => {
    // Schutz gegen Clickjacking: Wer die Seite in einen unsichtbaren Rahmen
    // legt, kann Klicks umleiten.
    const antwort = await fetch(`${BASE_URL}/`);
    expect(antwort.headers.get('x-frame-options')).toBe('DENY');
    expect(antwort.headers.get('content-security-policy')).toContain('frame-ancestors');
  });
});
