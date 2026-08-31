import { describe, expect, it } from 'vitest';

import { hashPassword, needsRehash, verifyPassword } from './password';

describe('Passwort-Hashing', () => {
  it('erzeugt fuer dasselbe Passwort unterschiedliche Hashes', async () => {
    const first = await hashPassword('ein-sehr-langes-passwort');
    const second = await hashPassword('ein-sehr-langes-passwort');
    expect(first).not.toEqual(second);
  });

  it('bestaetigt das richtige Passwort', async () => {
    const stored = await hashPassword('ein-sehr-langes-passwort');
    await expect(verifyPassword('ein-sehr-langes-passwort', stored)).resolves.toBe(true);
  });

  it('lehnt ein falsches Passwort ab', async () => {
    const stored = await hashPassword('ein-sehr-langes-passwort');
    await expect(verifyPassword('ein-sehr-langes-passwor', stored)).resolves.toBe(false);
  });

  it('behandelt unicode-gleiche Eingaben als identisch', async () => {
    // Dieselbe Zeichenfolge, einmal vorkomponiert (U+00FC), einmal aus u und
    // U+0308 zusammengesetzt. Ohne Normalisierung waeren das zwei Passwoerter.
    const composed = 'Passwort-über-alles';
    const decomposed = 'Passwort-über-alles';
    const stored = await hashPassword(composed);
    await expect(verifyPassword(decomposed, stored)).resolves.toBe(true);
  });

  it('lehnt beschaedigte oder fremde Hashformate ab, statt zu werfen', async () => {
    for (const broken of ['', 'kein-hash', 'scrypt$1$2$3', '$2b$10$abcdefg']) {
      await expect(verifyPassword('irgendwas', broken)).resolves.toBe(false);
    }
  });

  it('erkennt zu schwache Parameter als erneuerungsbeduerftig', async () => {
    const current = await hashPassword('ein-sehr-langes-passwort');
    expect(needsRehash(current)).toBe(false);
    expect(needsRehash('scrypt$1024$8$1$c2FsdA==$aGFzaA==')).toBe(true);
    expect(needsRehash('kein-hash')).toBe(true);
  });
});
