import { z } from 'zod';

import { errors, type FieldIssues } from '../errors';

/**
 * Gemeinsame Bausteine der Eingabevalidierung.
 *
 * Regel: Jede Eingabe von aussen -- Body, Query, Route-Parameter, Cookie --
 * geht durch ein Zod-Schema, bevor sie die Domaenenschicht erreicht.
 */

export const cuidLike = z
  .string()
  .min(8)
  .max(64)
  .regex(/^[A-Za-z0-9_-]+$/, 'Ungueltige Kennung.');

export const email = z
  .string()
  .trim()
  .toLowerCase()
  .min(5)
  .max(254)
  .email('Bitte eine gueltige E-Mail-Adresse angeben.');

/**
 * Passwortregeln nach aktueller Empfehlung: Laenge statt Zeichenklassen.
 * Erzwungene Sonderzeichen erzeugen erratbarere Passwoerter, nicht sicherere.
 */
export const PASSWORD_MIN_LENGTH = 12;
export const PASSWORD_MAX_LENGTH = 256;

export const password = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `Mindestens ${PASSWORD_MIN_LENGTH} Zeichen.`)
  .max(PASSWORD_MAX_LENGTH, `Hoechstens ${PASSWORD_MAX_LENGTH} Zeichen.`);

export const displayName = z.string().trim().min(2).max(80);

export const slug = z
  .string()
  .trim()
  .toLowerCase()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Nur Kleinbuchstaben, Ziffern und Bindestriche.');

export const paginationInput = z.object({
  page: z.coerce.number().int().min(1).max(10_000).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(24),
});

export type PaginationInput = z.infer<typeof paginationInput>;

/**
 * Erzeugt aus einer Zeichenkette einen URL-Slug.
 *
 * Umlaute werden ausgeschrieben statt entfernt: "Groesser" und "Grosser"
 * sollen unterscheidbar bleiben, sonst kollidieren Modellnamen.
 */
const UMLAUTS: Record<string, string> = {
  '\u00e4': 'ae',
  '\u00f6': 'oe',
  '\u00fc': 'ue',
  '\u00df': 'ss',
};

export function toSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[\u00e4\u00f6\u00fc\u00df]/g, (match) => UMLAUTS[match] ?? match)
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120)
    .replace(/-+$/g, '');
}

/** Zod-Fehler in die Feldstruktur der API uebersetzen. */
export function toFieldIssues(error: z.ZodError): FieldIssues {
  const issues: FieldIssues = {};
  for (const issue of error.issues) {
    const key = issue.path.length > 0 ? issue.path.join('.') : '_';
    (issues[key] ??= []).push(issue.message);
  }
  return issues;
}

/** Validiert und wirft bei Fehlern einen AppError statt eines ZodError. */
export function parseOrThrow<T extends z.ZodTypeAny>(schema: T, input: unknown): z.infer<T> {
  const result = schema.safeParse(input);
  if (!result.success) throw errors.validation(toFieldIssues(result.error));
  return result.data;
}
