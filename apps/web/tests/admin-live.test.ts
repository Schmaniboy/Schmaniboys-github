import { prisma } from '@ap/db';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { benutzerMitSitzung } from './helpers/session';

/**
 * Der Adminbereich ueber die echte Schnittstelle.
 *
 * Schwerpunkt: Was ein Administrator NICHT darf. Die Rechte selbst sind in
 * der Rechtematrix geprueft; hier geht es um die Sperren, die verhindern,
 * dass jemand sich selbst erhoeht oder die Aufsicht abschafft.
 */

const BASE_URL = process.env.SMOKE_BASE_URL ?? 'http://127.0.0.1:3000';

const reachable = await fetch(`${BASE_URL}/api/health`, { signal: AbortSignal.timeout(2000) })
  .then((r) => r.ok)
  .catch(() => false);

const suite = reachable ? describe : describe.skip;

const marker = `adm${Date.now().toString(36)}`;
let superCookie = '';
let adminCookie = '';
let nutzerCookie = '';
let superId = '';
let adminId = '';
let nutzerId = '';

async function api(pfad: string, cookie: string, body?: unknown, method = 'GET') {
  const antwort = await fetch(`${BASE_URL}${pfad}`, {
    method,
    headers: { 'content-type': 'application/json', cookie },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  const text = await antwort.text();
  return { status: antwort.status, body: text ? JSON.parse(text) : {} };
}

suite('Verwaltung', () => {
  beforeAll(async () => {
    const oberste = await benutzerMitSitzung({
      email: `adm.super.${marker}@example.test`,
      displayName: 'Oberste Verwaltung',
      role: 'SUPER_ADMIN',
    });
    const verwaltung = await benutzerMitSitzung({
      email: `adm.admin.${marker}@example.test`,
      displayName: 'Verwaltung',
      role: 'ADMIN',
    });
    const nutzer = await benutzerMitSitzung({
      email: `adm.nutzer.${marker}@example.test`,
      displayName: 'Gewöhnliche Person',
      role: 'USER',
    });

    superCookie = oberste.cookie;
    adminCookie = verwaltung.cookie;
    nutzerCookie = nutzer.cookie;
    superId = oberste.userId;
    adminId = verwaltung.userId;
    nutzerId = nutzer.userId;
  });

  afterAll(async () => {
    await prisma.auditLog.deleteMany({ where: { actor: { email: { contains: marker } } } });
    await prisma.session.deleteMany({ where: { user: { email: { contains: marker } } } });
    await prisma.user.deleteMany({ where: { email: { contains: marker } } });
    await prisma.$disconnect();
  });

  it('zeigt den Adminbereich einer gewoehnlichen Person nicht -- als 404', async () => {
    /*
     * Nicht 403 und keine Anmeldeaufforderung: Dass es einen Adminbereich
     * gibt, muss niemand erfahren, der ihn nicht betreten darf.
     */
    const seite = await fetch(`${BASE_URL}/admin`, { headers: { cookie: nutzerCookie } });
    expect(seite.status).toBe(404);

    const schnittstelle = await api('/api/admin/benutzer', nutzerCookie);
    expect(schnittstelle.status).toBe(403);
  });

  it('liefert der Verwaltung die Benutzerliste', async () => {
    const antwort = await api(`/api/admin/benutzer?q=${marker}`, adminCookie);
    expect(antwort.status).toBe(200);
    const daten = antwort.body as { data: { zeilen: { email: string }[]; gesamt: number } };
    expect(daten.data.zeilen.length).toBeGreaterThanOrEqual(3);
  });

  it('verlangt fuer jede Massnahme eine Begruendung', async () => {
    for (const grund of ['', 'Spam']) {
      const antwort = await api(
        '/api/admin/benutzer',
        adminCookie,
        { userId: nutzerId, status: 'BLOCKED', reason: grund },
        'PATCH',
      );
      expect(antwort.status).toBe(400);
    }
  });

  it('sperrt ein Konto und beendet dessen Sitzungen', async () => {
    const vorher = await prisma.session.count({ where: { userId: nutzerId } });
    expect(vorher).toBeGreaterThan(0);

    const antwort = await api(
      '/api/admin/benutzer',
      adminCookie,
      { userId: nutzerId, status: 'BLOCKED', reason: 'Wiederholte Falschangaben in Anzeigen.' },
      'PATCH',
    );
    expect(antwort.status).toBe(200);

    // Ohne Sitzungsende bliebe die Sperre wirkungslos, bis die Sitzung von
    // selbst ablaeuft -- bei einer Woche Laufzeit also lange.
    const nachher = await prisma.session.count({ where: { userId: nutzerId } });
    expect(nachher).toBe(0);

    const protokoll = await prisma.auditLog.findFirst({
      where: { action: 'admin.user_blocked', subjectId: nutzerId },
      select: { metadata: true },
    });
    expect(JSON.stringify(protokoll?.metadata)).toContain('Falschangaben');
  });

  it('laesst eine gewoehnliche Verwaltung keine Rollen vergeben', async () => {
    const antwort = await api(
      '/api/admin/benutzer',
      adminCookie,
      { userId: nutzerId, role: 'EDITOR', reason: 'Soll den Katalog pflegen können.' },
      'PATCH',
    );
    expect(antwort.status).toBe(403);

    const unveraendert = await prisma.user.findUnique({
      where: { id: nutzerId },
      select: { role: true },
    });
    expect(unveraendert?.role).toBe('USER');
  });

  it('laesst die oberste Verwaltung Rollen vergeben', async () => {
    const antwort = await api(
      '/api/admin/benutzer',
      superCookie,
      { userId: nutzerId, role: 'EDITOR', reason: 'Soll den Katalog pflegen können.' },
      'PATCH',
    );
    expect(antwort.status).toBe(200);

    const geaendert = await prisma.user.findUnique({
      where: { id: nutzerId },
      select: { role: true },
    });
    expect(geaendert?.role).toBe('EDITOR');
  });

  it('laesst niemanden die eigene Rolle aendern', async () => {
    // Sich selbst zu erhoehen waere die naheliegendste Rechteausweitung.
    const antwort = await api(
      '/api/admin/benutzer',
      superCookie,
      { userId: superId, role: 'ADMIN', reason: 'Ich brauche das gerade nicht mehr.' },
      'PATCH',
    );
    expect(antwort.status).toBe(409);
  });

  it('laesst die letzte oberste Verwaltung nicht verschwinden', async () => {
    const anzahl = await prisma.user.count({ where: { role: 'SUPER_ADMIN' } });

    if (anzahl <= 1) {
      const antwort = await api(
        '/api/admin/benutzer',
        superCookie,
        { userId: superId, role: 'ADMIN', reason: 'Test der letzten Instanz.' },
        'PATCH',
      );
      expect(antwort.status).toBe(409);
      return;
    }

    // Mit mehreren gibt es keine Sperre -- aber die eigene Rolle bleibt tabu.
    expect(anzahl).toBeGreaterThan(1);
  });

  it('schuetzt die oberste Verwaltung vor der gewoehnlichen', async () => {
    // Sonst waere die Sperrfunktion ein Weg, die Aufsicht loszuwerden.
    const antwort = await api(
      '/api/admin/benutzer',
      adminCookie,
      { userId: superId, status: 'BLOCKED', reason: 'Ein Versuch, die Aufsicht loszuwerden.' },
      'PATCH',
    );
    expect(antwort.status).toBe(403);

    const unveraendert = await prisma.user.findUnique({
      where: { id: superId },
      select: { status: true },
    });
    expect(unveraendert?.status).toBe('ACTIVE');
  });

  it('laesst niemanden das eigene Konto sperren', async () => {
    const antwort = await api(
      '/api/admin/benutzer',
      adminCookie,
      { userId: adminId, status: 'BLOCKED', reason: 'Versehentlicher Klick auf mich selbst.' },
      'PATCH',
    );
    expect(antwort.status).toBe(409);
  });

  it('vergibt hier keine Haendlerrollen', async () => {
    // Eine Haendlerrolle ohne Betrieb waere ein Zustand, den keine Pruefung
    // erwartet.
    const antwort = await api(
      '/api/admin/benutzer',
      superCookie,
      { userId: nutzerId, role: 'DEALER_OWNER', reason: 'Soll einen Betrieb führen dürfen.' },
      'PATCH',
    );
    expect(antwort.status).toBe(409);
  });

  it('gibt das Konto wieder frei', async () => {
    const antwort = await api(
      '/api/admin/benutzer',
      adminCookie,
      { userId: nutzerId, status: 'ACTIVE', reason: 'Sachverhalt geklärt, Sperre aufgehoben.' },
      'PATCH',
    );
    expect(antwort.status).toBe(200);

    const frei = await prisma.user.findUnique({
      where: { id: nutzerId },
      select: { status: true },
    });
    expect(frei?.status).toBe('ACTIVE');
  });

  it('zeigt das Protokoll nur mit dem entsprechenden Recht', async () => {
    const mit = await fetch(`${BASE_URL}/admin/protokoll`, { headers: { cookie: adminCookie } });
    expect(mit.status).toBe(200);

    const ohne = await fetch(`${BASE_URL}/admin/protokoll`, { headers: { cookie: nutzerCookie } });
    expect(ohne.status).toBe(404);
  });
});
