import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { usesNonce } from '../src/lib/csp';

/**
 * Gleicht die CSP-Zuordnung gegen das tatsaechliche Build-Ergebnis ab.
 *
 * Der Fehler, den dieser Test verhindert: Eine statisch vorgerenderte Seite
 * bekommt eine Nonce-Richtlinie. Der Browser blockiert dann jedes Skript --
 * die Seite sieht richtig aus, tut aber nichts. Beim Aufbau ist genau das
 * passiert, zweimal, und beide Male war es von aussen unsichtbar.
 *
 * Statt einer gepflegten Liste liest der Test die Wahrheit aus dem Build:
 * `prerender-manifest.json` nennt die statisch erzeugten Routen.
 *
 * Ohne vorherigen Build wird uebersprungen -- in `npm run verify` laeuft der
 * Build davor, dort greift der Test.
 */

const manifestPath = resolve(__dirname, '../.next/prerender-manifest.json');
const routesPath = resolve(__dirname, '../.next/app-path-routes-manifest.json');
const built = existsSync(manifestPath) && existsSync(routesPath);
const suite = built ? describe : describe.skip;

suite('CSP gegen das Build-Manifest', () => {
  const prerendered = built
    ? Object.keys(
        (JSON.parse(readFileSync(manifestPath, 'utf8')) as { routes: Record<string, unknown> })
          .routes,
      )
    : [];

  const allRoutes = built
    ? Object.values(JSON.parse(readFileSync(routesPath, 'utf8')) as Record<string, string>)
    : [];

  it('gibt keiner statisch erzeugten Seite eine Nonce-Richtlinie', () => {
    const kaputt = prerendered.filter((route) => usesNonce(route));
    expect(
      kaputt,
      `Diese Seiten wuerden ihr JavaScript verlieren: ${kaputt.join(', ')}`,
    ).toEqual([]);
  });

  it('erzeugt keine Seite eines geschuetzten Bereichs statisch', () => {
    /*
     * Die Gegenrichtung zum Test darueber. Eine Seite unter /konto, /admin
     * oder /haendler muss dynamisch gerendert werden, sonst kann sie den
     * Nonce nicht tragen -- und waere ohne JavaScript.
     *
     * Bewusst NICHT geprueft wird die Umkehrung "jede dynamische Seite
     * braucht einen Nonce": Oeffentliche Seiten duerfen dynamisch sein und
     * trotzdem mit der lockeren Richtlinie laufen.
     */
    const geschuetztUndStatisch = prerendered.filter((route) => usesNonce(route));
    expect(
      geschuetztUndStatisch,
      `Diese geschuetzten Seiten werden statisch erzeugt: ${geschuetztUndStatisch.join(', ')}`,
    ).toEqual([]);
  });

  it('findet ueberhaupt Routen im Manifest', () => {
    // Schutz davor, dass der Test still gruen wird, weil er nichts liest.
    expect(prerendered.length).toBeGreaterThan(0);
    expect(allRoutes.length).toBeGreaterThan(0);
  });
});
