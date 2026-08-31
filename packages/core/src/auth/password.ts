import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

/**
 * Passwort-Hashing mit scrypt aus der Node-Standardbibliothek.
 *
 * Warum scrypt und keine externe Bibliothek: scrypt ist speicherhart, in Node
 * enthalten und braucht kein natives Modul. Damit gibt es an der
 * sicherheitskritischsten Stelle keine Lieferketten-Abhaengigkeit.
 *
 * Format: scrypt$N$r$p$<salt-b64>$<hash-b64>
 * Die Parameter stehen im Hash, damit sie spaeter erhoeht werden koennen,
 * ohne bestehende Passwoerter ungueltig zu machen.
 */

const scrypt = promisify(scryptCallback) as (
  password: string | Buffer,
  salt: string | Buffer,
  keylen: number,
  options: { N: number; r: number; p: number; maxmem: number },
) => Promise<Buffer>;

const CURRENT = { N: 32768, r: 8, p: 1 } as const;
const KEY_LENGTH = 64;
const SALT_LENGTH = 16;

/** scrypt braucht rund 128 * N * r Byte; grosszuegig gerundet. */
function maxmemFor(N: number, r: number): number {
  return 256 * N * r;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_LENGTH);
  const derived = await scrypt(password.normalize('NFKC'), salt, KEY_LENGTH, {
    ...CURRENT,
    maxmem: maxmemFor(CURRENT.N, CURRENT.r),
  });
  return [
    'scrypt',
    CURRENT.N,
    CURRENT.r,
    CURRENT.p,
    salt.toString('base64'),
    derived.toString('base64'),
  ].join('$');
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false;

  const N = Number(parts[1]);
  const r = Number(parts[2]);
  const p = Number(parts[3]);
  const salt = Buffer.from(parts[4] ?? '', 'base64');
  const expected = Buffer.from(parts[5] ?? '', 'base64');

  if (!Number.isInteger(N) || !Number.isInteger(r) || !Number.isInteger(p)) return false;
  if (N < 1024 || r < 1 || p < 1 || N > 1 << 20) return false;
  if (salt.length === 0 || expected.length === 0) return false;

  const derived = await scrypt(password.normalize('NFKC'), salt, expected.length, {
    N,
    r,
    p,
    maxmem: maxmemFor(N, r),
  });
  return derived.length === expected.length && timingSafeEqual(derived, expected);
}

/**
 * Meldet, ob ein gespeicherter Hash mit veralteten Parametern erzeugt wurde.
 * Aufrufstelle: nach erfolgreichem Login neu hashen und ersetzen.
 */
export function needsRehash(stored: string): boolean {
  const parts = stored.split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt') return true;
  return (
    Number(parts[1]) < CURRENT.N || Number(parts[2]) < CURRENT.r || Number(parts[3]) < CURRENT.p
  );
}
