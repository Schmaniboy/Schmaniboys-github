import { describe, expect, it } from 'vitest';

/**
 * Prueft an der laufenden Anwendung, dass die Content-Security-Policy die
 * Seite nicht selbst lahmlegt.
 *
 * Hintergrund: Eine Nonce-Richtlinie auf einer statisch vorgerenderten Seite
 * blockiert saemtliche Skripte -- die Seite wird ausgeliefert, fuehrt aber
 * kein JavaScript aus. Das faellt beim blossen Betrachten nicht auf und ist
 * genau einmal passiert. Dieser Test schliesst die Luecke:
 *
 *   Enthaelt die Richtlinie einen Nonce, muss JEDES Skript-Tag im
 *   ausgelieferten HTML genau diesen Nonce tragen.
 *
 * Ohne laufenden Server wird uebersprungen -- der Test soll die Suite nicht
 * blockieren, sondern vor einer Freigabe laufen (npm run verify:live).
 */

const BASE_URL = process.env.SMOKE_BASE_URL ?? 'http://127.0.0.1:3000';

const reachable = await fetch(`${BASE_URL}/api/health`, {
  signal: AbortSignal.timeout(2000),
})
  .then((response) => response.ok)
  .catch(() => false);

const suite = reachable ? describe : describe.skip;

const ROUTEN = ['/', '/anmelden', '/registrieren'];

suite('Content-Security-Policy an der laufenden Anwendung', () => {
  for (const route of ROUTEN) {
    it(`laesst die Skripte auf ${route} zu`, async () => {
      const response = await fetch(`${BASE_URL}${route}`);
      expect(response.status).toBeLessThan(400);

      const policy = response.headers.get('content-security-policy');
      expect(policy, 'Es muss eine Richtlinie gesetzt sein').toBeTruthy();

      const html = await response.text();
      const scriptTags = html.match(/<script\b[^>]*>/gi) ?? [];
      const nonceInPolicy = policy?.match(/'nonce-([^']+)'/)?.[1] ?? null;

      if (nonceInPolicy) {
        expect(scriptTags.length, 'Seite ohne Skripte waere verdaechtig').toBeGreaterThan(0);
        const ohneNonce = scriptTags.filter((tag) => !tag.includes(`nonce="${nonceInPolicy}"`));
        expect(
          ohneNonce.length,
          `${ohneNonce.length} von ${scriptTags.length} Skripten wuerden blockiert`,
        ).toBe(0);
      } else {
        // Ohne Nonce muessen eingebettete Skripte ausdruecklich erlaubt sein.
        expect(policy).toContain("'unsafe-inline'");
      }
    });
  }

  it('setzt die uebrigen Sicherheitskopfzeilen', async () => {
    const response = await fetch(`${BASE_URL}/`);
    expect(response.headers.get('x-content-type-options')).toBe('nosniff');
    expect(response.headers.get('x-frame-options')).toBe('DENY');
    expect(response.headers.get('referrer-policy')).toBe('strict-origin-when-cross-origin');
    expect(response.headers.get('strict-transport-security')).toContain('max-age=');
    // Next.js verraet sonst seine Anwesenheit.
    expect(response.headers.get('x-powered-by')).toBeNull();
  });

  it('gibt geschuetzte Endpunkte ohne Sitzung nicht preis', async () => {
    const response = await fetch(`${BASE_URL}/api/guthaben`);
    expect(response.status).toBe(401);
    const body = (await response.json()) as { error?: { code?: string } };
    expect(body.error?.code).toBe('UNAUTHENTICATED');
  });

  it('beantwortet die Sitzungsauskunft auch ohne Sitzung', async () => {
    // Die Kopfzeile fragt das auf jeder Seite. Ein 401 waere hier kein Schutz,
    // sondern nur ein Fehler in der Browserkonsole auf jeder oeffentlichen
    // Seite -- und wuerde echte Fehler darin untergehen lassen.
    const response = await fetch(`${BASE_URL}/api/auth/me`);
    expect(response.status).toBe(200);
    const body = (await response.json()) as { data?: { user?: unknown } };
    expect(body.data?.user).toBeNull();
  });
});
