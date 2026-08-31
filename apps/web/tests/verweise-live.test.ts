import { beforeAll, describe, expect, it } from 'vitest';

import { benutzerMitSitzung } from './helpers/session';

/**
 * Kein Verweis darf ins Leere fuehren.
 *
 * Anlass: Die Kontonavigation verlinkte auf "/konto/anzeigen" und
 * "/konto/nachrichten" -- beides Bereiche spaeterer Phasen. Next.js laedt
 * verlinkte Routen im Hintergrund vor, dadurch schlugen die Anfragen schon
 * beim Betreten der Kontoseite fehl, ohne dass jemand geklickt hatte.
 *
 * Geplante Bereiche gehoeren nicht als Link in die Navigation, sondern als
 * ausgegrauter Punkt (siehe DashboardNavItem.upcoming).
 */

const BASE_URL = process.env.SMOKE_BASE_URL ?? 'http://127.0.0.1:3000';

const reachable = await fetch(`${BASE_URL}/api/health`, { signal: AbortSignal.timeout(2000) })
  .then((r) => r.ok)
  .catch(() => false);

const suite = reachable ? describe : describe.skip;

const marker = `vw${Date.now().toString(36)}`;

const OEFFENTLICH = ['/', '/katalog', '/katalog/glossar', '/suche', '/marktplatz', '/bewertung', '/anmelden', '/registrieren', '/haendler'];
const ANGEMELDET = ['/konto', '/konto/guthaben', '/verkaufen'];

/** Alle seiteneigenen Verweise aus dem gelieferten HTML. */
function verweise(html: string): string[] {
  const treffer = html.matchAll(/href="(\/[^"#?]*)"/g);
  return [...new Set([...treffer].map((m) => m[1] as string))];
}

async function hole(pfad: string, cookie: string) {
  const antwort = await fetch(`${BASE_URL}${pfad}`, { headers: cookie ? { cookie } : {}, redirect: 'manual' });
  return { status: antwort.status, html: antwort.ok ? await antwort.text() : '' };
}

suite('Verweise', () => {
  let cookie = '';

  beforeAll(async () => {
    cookie = (
      await benutzerMitSitzung({
        email: `verweise.${marker}@example.test`,
        displayName: 'Verweisleser',
        role: 'USER',
      })
    ).cookie;
    expect(cookie).not.toBe('');
  });

  it('fuehrt von keiner Seite in eine 404', async () => {
    const gepruefte = new Map<string, number>();
    const kaputt: string[] = [];

    for (const seite of [...OEFFENTLICH, ...ANGEMELDET]) {
      const istAngemeldet = ANGEMELDET.includes(seite);
      const { status, html } = await hole(seite, istAngemeldet ? cookie : '');
      expect(status, `Seite ${seite}`).toBeLessThan(400);

      for (const ziel of verweise(html)) {
        // Dynamische Detailseiten haengen von Katalogdaten ab; die pruefen
        // die jeweiligen Fachtests. Hier geht es um feste Verweise.
        if (ziel.startsWith('/api/') || ziel.startsWith('/_next')) continue;
        if (gepruefte.has(ziel)) continue;
        const antwort = await hole(ziel, cookie);
        gepruefte.set(ziel, antwort.status);
        if (antwort.status === 404) kaputt.push(`${seite} -> ${ziel}`);
      }
    }

    expect(gepruefte.size).toBeGreaterThan(10);
    expect(kaputt).toEqual([]);
  }, 60_000);
});
