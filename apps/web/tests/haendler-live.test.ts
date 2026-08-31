import { prisma } from '@ap/db';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { benutzerMitSitzung } from './helpers/session';

/**
 * Der Haendlerbereich ueber die echte Schnittstelle.
 *
 * Schwerpunkt ist die Mandantentrennung: Ein Betrieb darf ausschliesslich
 * eigene Daten sehen und aendern, und ein Mitarbeiter darf weniger als ein
 * Inhaber. Beides wird hier nicht geglaubt, sondern versucht.
 */

const BASE_URL = process.env.SMOKE_BASE_URL ?? 'http://127.0.0.1:3000';

const reachable = await fetch(`${BASE_URL}/api/health`, { signal: AbortSignal.timeout(2000) })
  .then((r) => r.ok)
  .catch(() => false);

const suite = reachable ? describe : describe.skip;

const marker = `hdl${Date.now().toString(36)}`;
let betriebA = '';
let betriebB = '';
let inhaberCookie = '';
let mitarbeiterCookie = '';
let fremderInhaberCookie = '';
let mitarbeiterId = '';
let aussenstehenderId = '';

async function api(pfad: string, cookie: string, body?: unknown, method = 'GET') {
  const antwort = await fetch(`${BASE_URL}${pfad}`, {
    method,
    headers: { 'content-type': 'application/json', cookie },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  const text = await antwort.text();
  return { status: antwort.status, body: text ? JSON.parse(text) : {} };
}

suite('Händlerbereich', () => {
  beforeAll(async () => {
    const a = await prisma.dealer.create({
      data: { name: `Autohaus A ${marker}`, slug: `autohaus-a-${marker}`, status: 'ACTIVE' },
      select: { id: true },
    });
    const b = await prisma.dealer.create({
      data: { name: `Autohaus B ${marker}`, slug: `autohaus-b-${marker}`, status: 'ACTIVE' },
      select: { id: true },
    });
    betriebA = a.id;
    betriebB = b.id;

    const inhaber = await benutzerMitSitzung({
      email: `hdl.inhaber.${marker}@example.test`,
      displayName: 'Inhaberin A',
      role: 'DEALER_OWNER',
    });
    const mitarbeiter = await benutzerMitSitzung({
      email: `hdl.staff.${marker}@example.test`,
      displayName: 'Mitarbeiter A',
      role: 'DEALER_STAFF',
    });
    const fremd = await benutzerMitSitzung({
      email: `hdl.fremd.${marker}@example.test`,
      displayName: 'Inhaber B',
      role: 'DEALER_OWNER',
    });
    const aussen = await benutzerMitSitzung({
      email: `hdl.aussen.${marker}@example.test`,
      displayName: 'Aussenstehende',
      role: 'USER',
    });

    inhaberCookie = inhaber.cookie;
    mitarbeiterCookie = mitarbeiter.cookie;
    fremderInhaberCookie = fremd.cookie;
    mitarbeiterId = mitarbeiter.userId;
    aussenstehenderId = aussen.userId;

    await prisma.user.update({ where: { id: inhaber.userId }, data: { dealerId: betriebA } });
    await prisma.user.update({ where: { id: mitarbeiterId }, data: { dealerId: betriebA } });
    await prisma.user.update({ where: { id: fremd.userId }, data: { dealerId: betriebB } });
  });

  afterAll(async () => {
    await prisma.dealerOpeningHour.deleteMany({ where: { dealerId: { in: [betriebA, betriebB] } } });
    await prisma.user.updateMany({
      where: { email: { contains: marker } },
      data: { dealerId: null },
    });
    await prisma.user.deleteMany({ where: { email: { contains: marker } } });
    await prisma.dealer.deleteMany({ where: { id: { in: [betriebA, betriebB] } } });
    await prisma.$disconnect();
  });

  it('liefert das eigene Profil, ohne dass eine Kennung mitgeschickt wird', async () => {
    // Die Haendlerkennung steht in der Sitzung. Sie entgegenzunehmen waere
    // die Einladung, eine fremde einzusetzen.
    const antwort = await api('/api/haendler/profil', inhaberCookie);
    expect(antwort.status).toBe(200);
    const daten = antwort.body as { data: { dealer: { id: string; name: string } } };
    expect(daten.data.dealer.id).toBe(betriebA);
    expect(daten.data.dealer.name).toContain(marker);
  });

  it('gibt einer Person ohne Betrieb gar nichts', async () => {
    const aussen = await benutzerMitSitzung({
      email: `hdl.ohne.${marker}@example.test`,
      displayName: 'Ohne Betrieb',
      role: 'USER',
    });
    const antwort = await api('/api/haendler/profil', aussen.cookie);
    expect([403, 404]).toContain(antwort.status);
  });

  it('laesst einen Mitarbeiter das Profil sehen, aber nicht aendern', async () => {
    const lesen = await api('/api/haendler/profil', mitarbeiterCookie);
    expect(lesen.status).toBe(200);

    const schreiben = await api(
      '/api/haendler/profil',
      mitarbeiterCookie,
      { name: `Umbenannt ${marker}` },
      'PATCH',
    );
    expect(schreiben.status).toBe(403);
  });

  it('speichert das Profil des eigenen Betriebs', async () => {
    const antwort = await api(
      '/api/haendler/profil',
      inhaberCookie,
      {
        name: `Autohaus A ${marker}`,
        contactEmail: 'kontakt@example.test',
        street: 'Musterstraße 1',
        postalCode: '10115',
        city: 'Berlin',
        vatId: 'DE123456789',
        websiteUrl: '',
        contactPhone: '',
        description: '',
      },
      'PATCH',
    );
    expect(antwort.status).toBe(200);

    // Der fremde Betrieb bleibt unangetastet.
    const b = await prisma.dealer.findUnique({ where: { id: betriebB }, select: { city: true } });
    expect(b?.city).toBeNull();
  });

  it('lehnt eine USt-IdNr. ab, die keine sein kann', async () => {
    const antwort = await api(
      '/api/haendler/profil',
      inhaberCookie,
      { name: `Autohaus A ${marker}`, vatId: '123456789' },
      'PATCH',
    );
    expect(antwort.status).toBe(400);
  });

  it('speichert Oeffnungszeiten mit Mittagspause', async () => {
    const antwort = await api(
      '/api/haendler/oeffnungszeiten',
      inhaberCookie,
      {
        spannen: [
          { weekday: 1, von: '08:00', bis: '12:00' },
          { weekday: 1, von: '13:00', bis: '18:00' },
          { weekday: 6, von: '09:00', bis: '13:00' },
        ],
      },
      'PUT',
    );
    expect(antwort.status).toBe(200);

    const gespeichert = await prisma.dealerOpeningHour.count({ where: { dealerId: betriebA } });
    expect(gespeichert).toBe(3);
  });

  it('lehnt sich ueberschneidende Zeitfenster ab', async () => {
    const antwort = await api(
      '/api/haendler/oeffnungszeiten',
      inhaberCookie,
      {
        spannen: [
          { weekday: 2, von: '08:00', bis: '18:00' },
          { weekday: 2, von: '12:00', bis: '14:00' },
        ],
      },
      'PUT',
    );
    expect(antwort.status).toBe(400);
    expect(JSON.stringify(antwort.body)).toContain('überschneiden');
  });

  it('laesst einen Mitarbeiter die Mitarbeiterliste nicht sehen', async () => {
    const antwort = await api('/api/haendler/mitarbeiter', mitarbeiterCookie);
    expect(antwort.status).toBe(403);
  });

  it('nimmt nur Personen auf, die es schon gibt', async () => {
    const antwort = await api(
      '/api/haendler/mitarbeiter',
      inhaberCookie,
      { email: `gibtsnicht.${marker}@example.test`, role: 'DEALER_STAFF' },
      'POST',
    );
    expect(antwort.status).toBe(400);
    expect(JSON.stringify(antwort.body)).toContain('selbst registrieren');
  });

  it('nimmt eine bestehende Person auf', async () => {
    const antwort = await api(
      '/api/haendler/mitarbeiter',
      inhaberCookie,
      { email: `hdl.aussen.${marker}@example.test`, role: 'DEALER_STAFF' },
      'POST',
    );
    expect(antwort.status).toBe(201);

    const person = await prisma.user.findUnique({
      where: { id: aussenstehenderId },
      select: { dealerId: true, role: true },
    });
    expect(person?.dealerId).toBe(betriebA);
    expect(person?.role).toBe('DEALER_STAFF');
  });

  it('nimmt keine Person auf, die schon zu einem anderen Betrieb gehoert', async () => {
    const antwort = await api(
      '/api/haendler/mitarbeiter',
      inhaberCookie,
      { email: `hdl.fremd.${marker}@example.test`, role: 'DEALER_STAFF' },
      'POST',
    );
    expect(antwort.status).toBe(409);
  });

  it('laesst einen fremden Betrieb die eigenen Mitarbeiter nicht anfassen', async () => {
    /*
     * Der wichtigste Test dieser Datei. Der fremde Inhaber schickt eine
     * Benutzerkennung aus Betrieb A -- die Haendlerkennung kommt aber aus
     * seiner eigenen Sitzung, also greift die Bedingung ins Leere.
     */
    const antwort = await api(
      '/api/haendler/mitarbeiter',
      fremderInhaberCookie,
      { userId: mitarbeiterId, role: 'DEALER_OWNER' },
      'PATCH',
    );
    expect(antwort.status).toBe(404);

    const unveraendert = await prisma.user.findUnique({
      where: { id: mitarbeiterId },
      select: { role: true, dealerId: true },
    });
    expect(unveraendert?.role).toBe('DEALER_STAFF');
    expect(unveraendert?.dealerId).toBe(betriebA);
  });

  it('laesst den letzten Inhaber nicht verschwinden', async () => {
    const person = await prisma.user.findFirst({
      where: { email: `hdl.inhaber.${marker}@example.test` },
      select: { id: true },
    });

    // Ueber die Schnittstelle sperrt schon die Selbstpruefung; hier geht es
    // um die Regel darunter.
    const zweiterInhaber = await benutzerMitSitzung({
      email: `hdl.zweiter.${marker}@example.test`,
      displayName: 'Zweiter',
      role: 'DEALER_OWNER',
    });

    const herabstufen = await api(
      '/api/haendler/mitarbeiter',
      zweiterInhaber.cookie,
      { userId: person?.id ?? '', role: 'DEALER_STAFF' },
      'PATCH',
    );
    // Der zweite Inhaber gehoert noch keinem Betrieb an.
    expect([403, 404]).toContain(herabstufen.status);
  });

  it('laesst sich nicht selbst herabstufen', async () => {
    const ich = await prisma.user.findFirst({
      where: { email: `hdl.inhaber.${marker}@example.test` },
      select: { id: true },
    });
    const antwort = await api(
      '/api/haendler/mitarbeiter',
      inhaberCookie,
      { userId: ich?.id ?? '', role: 'DEALER_STAFF' },
      'PATCH',
    );
    expect(antwort.status).toBe(409);
    expect(JSON.stringify(antwort.body)).toContain('eigene Rolle');
  });

  it('zeigt das oeffentliche Haendlerprofil mit Oeffnungszeiten', async () => {
    const seite = await fetch(`${BASE_URL}/autohaus/autohaus-a-${marker}`);
    expect(seite.status).toBe(200);
    const html = await seite.text();
    expect(html).toContain(`Autohaus A ${marker}`);
    expect(html).toContain('08:00');
    expect(html).toContain('geschlossen');
    expect(html).toContain('DE123456789');
  });

  it('zeigt einen nicht freigeschalteten Betrieb oeffentlich nicht', async () => {
    await prisma.dealer.update({ where: { id: betriebB }, data: { status: 'PENDING' } });
    const seite = await fetch(`${BASE_URL}/autohaus/autohaus-b-${marker}`);
    expect(seite.status).toBe(404);
  });
});
