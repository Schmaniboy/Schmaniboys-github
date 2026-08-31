import { describe, expect, it } from 'vitest';

import { generateToken, hashToken, tokenMatches } from './tokens';

describe('Sitzungstoken', () => {
  it('erzeugt jedes Mal einen neuen Token ausreichender Laenge', () => {
    const values = new Set(Array.from({ length: 100 }, () => generateToken()));
    expect(values.size).toBe(100);
    for (const value of values) expect(value.length).toBeGreaterThanOrEqual(43);
  });

  it('hasht deterministisch', () => {
    const token = generateToken();
    expect(hashToken(token)).toBe(hashToken(token));
  });

  it('erkennt den passenden Token', () => {
    const token = generateToken();
    expect(tokenMatches(token, hashToken(token))).toBe(true);
  });

  it('lehnt einen fremden Token ab', () => {
    expect(tokenMatches(generateToken(), hashToken(generateToken()))).toBe(false);
  });

  it('gibt den Klartext nicht im Hash preis', () => {
    const token = generateToken();
    expect(hashToken(token)).not.toContain(token);
  });
});
