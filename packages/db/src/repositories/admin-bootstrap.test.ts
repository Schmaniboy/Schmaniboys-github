import { describe, expect, it } from 'vitest';

import { PASSWORD_MIN_LENGTH, password } from '@ap/core';

/**
 * Die Regeln, nach denen der erste SUPER_ADMIN entsteht
 * (`scripts/ersten-admin.ts`).
 *
 * Das Skript selbst spricht mit der Datenbank und der Konsole; geprueft wird
 * hier, was daran Entscheidung ist und nicht Verdrahtung.
 */

/** Dieselbe Erzeugung wie im Skript. */
function erzeugePasswort(): string {
  return Buffer.from(crypto.getRandomValues(new Uint8Array(24))).toString('base64url');
}

describe('Erster SUPER_ADMIN', () => {
  it('erzeugt ein Passwort, das die eigene Regel besteht', () => {
    /*
     * Ein erzeugtes Passwort, das die Anmeldung spaeter ablehnt, waere
     * besonders aergerlich: Das Konto existiert, der Zugang nicht.
     */
    for (let i = 0; i < 50; i += 1) {
      const erzeugt = erzeugePasswort();
      expect(password.safeParse(erzeugt).success, erzeugt).toBe(true);
      expect(erzeugt.length).toBeGreaterThanOrEqual(PASSWORD_MIN_LENGTH);
    }
  });

  it('erzeugt keine Zeichen, die beim Kopieren verlorengehen', () => {
    // base64url: nur A-Z a-z 0-9 - _ — kein Leerzeichen, kein Plus, kein
    // Schraegstrich, nichts, was eine Shell oder ein Zeilenumbruch frisst.
    for (let i = 0; i < 50; i += 1) {
      expect(erzeugePasswort()).toMatch(/^[A-Za-z0-9_-]+$/);
    }
  });

  it('erzeugt nicht zweimal dasselbe', () => {
    const gesehen = new Set<string>();
    for (let i = 0; i < 200; i += 1) gesehen.add(erzeugePasswort());
    expect(gesehen.size).toBe(200);
  });
});
