import { describe, expect, it } from 'vitest';

/**
 * Indexierung: robots.txt und die Meta-Angabe muessen dasselbe sagen.
 *
 * Vorher taten sie das nicht. robots.txt gab in Produktion frei, das
 * Wurzel-Layout setzte fest `index: false`. Wer robots.txt geprueft und die
 * Seite veroeffentlicht haette, waere mit einer Seite online gegangen, die
 * jede Unterseite per Meta-Angabe wieder aussperrt -- ohne dass irgendwo ein
 * Fehler erschienen waere.
 *
 * Beide lesen jetzt SUCHMASCHINEN_INDEXIEREN. Dieser Test prueft, dass sie
 * uebereinstimmen, unabhaengig davon, wie der Schalter gerade steht.
 */

const BASE_URL = process.env.SMOKE_BASE_URL ?? 'http://127.0.0.1:3000';

const reachable = await fetch(`${BASE_URL}/api/health`, { signal: AbortSignal.timeout(2000) })
  .then((r) => r.ok)
  .catch(() => false);

const suite = reachable ? describe : describe.skip;

suite('Indexierung', () => {
  it('robots.txt und Meta-Angabe sagen dasselbe', async () => {
    const robots = await fetch(`${BASE_URL}/robots.txt`).then((r) => r.text());
    const startseite = await fetch(`${BASE_URL}/`).then((r) => r.text());

    // "Disallow: /" ohne jedes Allow bedeutet: komplett gesperrt.
    const gesperrtLautRobots = /Disallow:\s*\/\s*$/m.test(robots) && !/^Allow:/m.test(robots);
    const gesperrtLautMeta = /<meta name="robots" content="[^"]*noindex/.test(startseite);

    expect(gesperrtLautMeta, `robots.txt:\n${robots}`).toBe(gesperrtLautRobots);
  });

  it('nennt die Sitemap, sobald freigegeben ist', async () => {
    const robots = await fetch(`${BASE_URL}/robots.txt`).then((r) => r.text());
    if (/Disallow:\s*\/\s*$/m.test(robots) && !/^Allow:/m.test(robots)) {
      // Gesperrt: dann gehoert auch keine Sitemap hinein.
      expect(robots).not.toContain('Sitemap:');
      return;
    }
    expect(robots).toContain('Sitemap:');
  });

  it('haelt angemeldete Bereiche und Schnittstellen aus dem Index', async () => {
    const robots = await fetch(`${BASE_URL}/robots.txt`).then((r) => r.text());
    if (!/^Allow:/m.test(robots)) return; // komplett gesperrt, nichts zu pruefen

    for (const pfad of ['/api/', '/konto/', '/haendler/', '/admin/']) {
      expect(robots, pfad).toContain(`Disallow: ${pfad}`);
    }
  });
});
