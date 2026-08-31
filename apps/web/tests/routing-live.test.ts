import { describe, expect, it } from 'vitest';

/**
 * Kein 404 auf einer Seite, die es geben muss.
 *
 * Der Anlass: Auf der Startseite wurde ein 404 gemeldet. Sie liefert
 * nachweislich 200 mit echtem Inhalt -- aber ein "Statuscode ist 200"
 * reicht als Beweis nicht: Ein Server, der auf ALLES mit 200 antwortet,
 * bestuende diesen Test ebenfalls.
 *
 * Deshalb wird beides geprueft: Jede vorhandene Seite muss 200 UND ihren
 * eigenen Inhalt liefern, und eine erfundene Adresse muss 404 liefern.
 * Ohne die zweite Haelfte waere der Test wertlos.
 */

const BASE_URL = process.env.SMOKE_BASE_URL ?? 'http://127.0.0.1:3000';

const erreichbar = await fetch(`${BASE_URL}/api/health`, { signal: AbortSignal.timeout(5000) })
  .then((r) => r.ok)
  .catch(() => false);

const suite = erreichbar ? describe : describe.skip;

/** Oeffentliche Seiten mit einem Textstueck, das nur dort steht. */
const SEITEN: Array<[string, string]> = [
  ['/', 'Autokauf und Autoverkauf'],
  ['/katalog', 'Fahrzeugwissen'],
  ['/suche', 'Suche'],
  ['/marktplatz', 'Marktplatz'],
  ['/bewertung', 'Bewertung'],
  ['/anmelden', 'Anmelden'],
  ['/registrieren', 'Konto'],
  ['/passwort-vergessen', 'Passwort'],
  ['/katalog/datenbestand', 'Datenbestand'],
];

suite('Routing', () => {
  it.each(SEITEN)('%s liefert 200 und eigenen Inhalt', async (pfad, kennzeichen) => {
    const antwort = await fetch(`${BASE_URL}${pfad}`);
    expect(antwort.status, pfad).toBe(200);

    const html = await antwort.text();
    expect(html, `${pfad} enthaelt „${kennzeichen}" nicht`).toContain(kennzeichen);

    /*
     * Nicht auf den Text der 404-Seite pruefen: Der steckt in der
     * React-Nutzlast JEDER Seite, weil die not-found-Komponente Teil des
     * Layoutbaums ist -- vorhanden, aber nicht dargestellt. Ein Test
     * darauf schlaegt ueberall fehl und beweist nichts.
     *
     * Ob wirklich die richtige Seite ERSCHEINT, prueft der Browserrundgang
     * (npm run pruefe:formulare, npm run rundgang). Hier reicht das
     * seiteneigene Kennzeichen oben: Die 404-Seite enthaelt es nicht.
     */
  });

  it('liefert fuer eine erfundene Adresse 404', async () => {
    // Ohne diese Probe koennte der Test oben auch ein Server bestehen, der
    // auf jede Anfrage dieselbe Seite ausgibt.
    for (const pfad of ['/gibtesnicht', '/katalog/gibtesnicht', '/admin/gibtesnicht']) {
      const antwort = await fetch(`${BASE_URL}${pfad}`);
      expect(antwort.status, pfad).toBe(404);
    }
  });

  it('liefert die Startseite ohne Weiterleitung', async () => {
    // Eine Weiterleitung auf /katalog waere fuer Suchmaschinen und fuer
    // Lesezeichen ein Unterschied, den man merkt.
    const antwort = await fetch(`${BASE_URL}/`, { redirect: 'manual' });
    expect(antwort.status).toBe(200);
  });
});
