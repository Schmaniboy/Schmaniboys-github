import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { AppError } from '../errors';

import { email, paginationInput, parseOrThrow, password, toSlug } from './common';

describe('Eingabevalidierung', () => {
  it('normalisiert E-Mail-Adressen', () => {
    const result = email.safeParse('  Max.Mustermann@Example.COM ');
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe('max.mustermann@example.com');
  });

  it('lehnt offensichtlich ungueltige Adressen ab', () => {
    for (const candidate of ['kein-at', 'a@b', '@example.com', '']) {
      expect(email.safeParse(candidate).success).toBe(false);
    }
  });

  it('verlangt Laenge statt Zeichenklassen beim Passwort', () => {
    expect(password.safeParse('kurz').success).toBe(false);
    expect(password.safeParse('zwoelf-zeich').success).toBe(true);
    expect(password.safeParse('a'.repeat(257)).success).toBe(false);
  });

  it('begrenzt die Seitengroesse nach oben', () => {
    expect(paginationInput.parse({})).toEqual({ page: 1, pageSize: 24 });
    expect(paginationInput.safeParse({ pageSize: 1000 }).success).toBe(false);
    expect(paginationInput.parse({ page: '3', pageSize: '50' })).toEqual({
      page: 3,
      pageSize: 50,
    });
  });

  it('schreibt Umlaute im Slug aus, statt sie zu verschlucken', () => {
    expect(toSlug('BMW 3er Coupé')).toBe('bmw-3er-coupe');
    expect(toSlug('Größe')).toBe('groesse');
    expect(toSlug('Öl & Wasser')).toBe('oel-wasser');
    expect(toSlug('  --Mehrfach   Trenner-- ')).toBe('mehrfach-trenner');
  });

  it('wirft bei Validierungsfehlern einen AppError mit Feldangaben', () => {
    const schema = z.object({ name: z.string().min(3) });
    try {
      parseOrThrow(schema, { name: 'ab' });
      throw new Error('haette werfen muessen');
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      const appError = error as AppError;
      expect(appError.status).toBe(400);
      expect(appError.issues?.name).toBeDefined();
    }
  });
});
