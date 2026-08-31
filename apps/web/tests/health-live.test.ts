import { describe, expect, it } from 'vitest';

/**
 * Betriebsbereitschaft.
 *
 * Die eine Regel: Der Statuscode muss dasselbe sagen wie der Rumpf. Wer
 * eine Anwendung ueberwacht, liest den Code -- 200 mit
 * "database: unavailable" im Rumpf heisst fuer jeden Lastverteiler: alles
 * in Ordnung, weiter Anfragen schicken.
 */

const BASE_URL = process.env.SMOKE_BASE_URL ?? 'http://127.0.0.1:3000';

const erreichbar = await fetch(`${BASE_URL}/api/health`, { signal: AbortSignal.timeout(5000) })
  .then(() => true)
  .catch(() => false);

const suite = erreichbar ? describe : describe.skip;

suite('Betriebsbereitschaft', () => {
  it('Statuscode und Rumpf sagen dasselbe', async () => {
    const antwort = await fetch(`${BASE_URL}/api/health`);
    const inhalt = (await antwort.json()) as {
      data?: { status?: string; database?: string };
    };

    if (inhalt.data?.database === 'ok') {
      expect(antwort.status).toBe(200);
      expect(inhalt.data.status).toBe('ok');
    } else {
      expect(antwort.status).toBe(503);
      expect(inhalt.data?.status).toBe('degraded');
    }
  });

  it('nennt keine Versionen und keine Fehlerdetails', async () => {
    // Eine offene Statusseite soll keine Angriffsflaeche beschreiben.
    const roh = await fetch(`${BASE_URL}/api/health`).then((r) => r.text());
    for (const verraeterisch of ['prisma', 'postgres', '5432', 'node', 'next']) {
      expect(roh.toLowerCase(), verraeterisch).not.toContain(verraeterisch);
    }
  });
});
