import { describe, expect, it } from 'vitest';

import { buildPolicy, usesNonce } from '../src/lib/csp';

describe('CSP-Aufteilung', () => {
  it('vergibt fuer geschuetzte Bereiche einen Nonce', () => {
    for (const pfad of [
      '/anmelden',
      '/registrieren',
      '/konto',
      '/konto/guthaben',
      '/haendler/bestand',
      '/admin',
      '/api/auth/me',
    ]) {
      expect(usesNonce(pfad), pfad).toBe(true);
    }
  });

  it('vergibt fuer oeffentliche, statische Seiten keinen Nonce', () => {
    for (const pfad of ['/', '/katalog', '/katalog/bmw/3er', '/suche', '/marktplatz', '/verkaufen']) {
      expect(usesNonce(pfad), pfad).toBe(false);
    }
  });

  it('behandelt unbekannte Pfade wie oeffentliche Seiten', () => {
    // Die 404-Seite wird statisch ausgeliefert, der Pfad ist aber beliebig.
    // Mit einem Nonce waere jede Fehlerseite ohne JavaScript.
    expect(usesNonce('/gibt-es-nicht')).toBe(false);
    expect(usesNonce('/etwas/tief/verschachteltes')).toBe(false);
  });

  it('verwechselt aehnlich beginnende Pfade nicht', () => {
    // /administratives ist nicht /admin -- ein reiner startsWith-Vergleich
    // waere hier falsch.
    expect(usesNonce('/administratives')).toBe(false);
    expect(usesNonce('/kontoauszug')).toBe(false);
    expect(usesNonce('/apitheke')).toBe(false);
  });

  it('nimmt in die strenge Richtlinie Nonce und strict-dynamic auf', () => {
    const policy = buildPolicy({ nonce: 'ABC123', isDevelopment: false, ueberHttps: true });
    expect(policy).toContain("'nonce-ABC123'");
    expect(policy).toContain("'strict-dynamic'");
    expect(policy).not.toContain("script-src 'self' 'unsafe-inline'");
  });

  it('erlaubt in der lockeren Richtlinie eingebettete Skripte, aber kein eval', () => {
    const policy = buildPolicy({ nonce: null, isDevelopment: false, ueberHttps: true });
    expect(policy).toContain("script-src 'self' 'unsafe-inline'");
    expect(policy).not.toContain("'unsafe-eval'");
    expect(policy).not.toContain('nonce-');
  });

  it('haelt die schuetzenden Direktiven in beiden Richtlinien', () => {
    for (const nonce of ['ABC123', null]) {
      const policy = buildPolicy({ nonce, isDevelopment: false, ueberHttps: true });
      expect(policy).toContain("default-src 'self'");
      expect(policy).toContain("object-src 'none'");
      expect(policy).toContain("frame-ancestors 'none'");
      expect(policy).toContain("form-action 'self'");
      expect(policy).toContain("base-uri 'self'");
      expect(policy).toContain('upgrade-insecure-requests');
    }
  });

  it('erlaubt eval nur im Entwicklungsmodus', () => {
    expect(buildPolicy({ nonce: 'X', isDevelopment: true, ueberHttps: false })).toContain("'unsafe-eval'");
    expect(buildPolicy({ nonce: 'X', isDevelopment: false, ueberHttps: true })).not.toContain("'unsafe-eval'");
  });
});

describe('upgrade-insecure-requests', () => {
  /*
   * Die Richtlinie haengt daran, ob wirklich https gesprochen wird -- nicht
   * an NODE_ENV. Ein gebauter Stand im eigenen Netz laeuft ueber http; die
   * Hochstufung haette dort jede Unteranfrage ins Leere geschickt, und die
   * Seite waere auf dem Telefon ohne Stile angekommen.
   */
  it('steht nur, wenn die Anwendung ueber https laeuft', () => {
    expect(buildPolicy({ nonce: null, isDevelopment: false, ueberHttps: true })).toContain(
      'upgrade-insecure-requests',
    );
    expect(buildPolicy({ nonce: null, isDevelopment: false, ueberHttps: false })).not.toContain(
      'upgrade-insecure-requests',
    );
  });
});
