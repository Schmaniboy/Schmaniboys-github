import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';

/**
 * Sitzungs- und Einmal-Token.
 *
 * Der Klartext-Token verlaesst den Server genau einmal (Cookie oder E-Mail).
 * Gespeichert wird ausschliesslich der SHA-256-Hash. Ein Datenbankleck gibt
 * damit keine gueltigen Sitzungen preis.
 *
 * SHA-256 ohne Iterationen genuegt hier -- anders als bei Passwoertern ist der
 * Token 256 Bit Zufall und nicht erratbar.
 */

const TOKEN_BYTES = 32;

export function generateToken(): string {
  return randomBytes(TOKEN_BYTES).toString('base64url');
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token, 'utf8').digest('base64url');
}

/** Vergleich in konstanter Zeit, gegen Timing-Angriffe auf Token-Lookups. */
export function tokenMatches(token: string, storedHash: string): boolean {
  const candidate = Buffer.from(hashToken(token));
  const expected = Buffer.from(storedHash);
  if (candidate.length !== expected.length) return false;
  return timingSafeEqual(candidate, expected);
}
