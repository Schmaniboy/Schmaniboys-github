import { z } from 'zod';

/**
 * Eingaben des Haendlerbereichs.
 *
 * Anders als bei privaten Anzeigen wird hier die vollstaendige Anschrift
 * erhoben: Ein gewerblicher Anbieter ist zur Anbieterkennzeichnung
 * verpflichtet, und ein Autohaus ohne Adresse waere fuer Kaufinteressenten
 * wertlos.
 */

const optionalerText = (max: number) =>
  z.preprocess(
    (wert) => (typeof wert === 'string' && wert.trim() === '' ? null : wert),
    z.string().trim().max(max).nullable().optional(),
  );

export const dealerProfileInput = z.object({
  name: z.string().trim().min(2, 'Der Name des Betriebs fehlt.').max(200),
  description: optionalerText(4000),
  contactEmail: z.preprocess(
    (wert) => (typeof wert === 'string' && wert.trim() === '' ? null : wert),
    z.string().trim().email('Das ist keine gültige E-Mail-Adresse.').max(320).nullable().optional(),
  ),
  contactPhone: optionalerText(60),
  websiteUrl: z.preprocess(
    (wert) => (typeof wert === 'string' && wert.trim() === '' ? null : wert),
    z
      .string()
      .trim()
      .url('Bitte eine vollständige Adresse angeben, mit https:// davor.')
      .max(500)
      .nullable()
      .optional(),
  ),
  street: optionalerText(200),
  postalCode: z.preprocess(
    (wert) => (typeof wert === 'string' && wert.trim() === '' ? null : wert),
    z
      .string()
      .trim()
      .regex(/^\d{5}$/, 'Bitte eine fünfstellige Postleitzahl angeben.')
      .nullable()
      .optional(),
  ),
  city: optionalerText(120),
  /**
   * Umsatzsteuer-Identifikationsnummer.
   *
   * Geprueft wird nur die Form, nicht die Gueltigkeit: Dafuer braeuchte es
   * eine Abfrage beim Bundeszentralamt fuer Steuern. Eine selbst gebaute
   * Pruefung waere geraten und gaebe eine Sicherheit vor, die es nicht gibt.
   */
  vatId: z.preprocess(
    (wert) => (typeof wert === 'string' && wert.trim() === '' ? null : wert),
    z
      .string()
      .trim()
      .regex(
        /^[A-Z]{2}[0-9A-Z]{2,13}$/,
        'Eine USt-IdNr. beginnt mit zwei Buchstaben für das Land, etwa DE123456789.',
      )
      .nullable()
      .optional(),
  ),
});

const uhrzeit = z
  .string()
  .trim()
  .regex(/^\d{1,2}:\d{2}$/, 'Bitte eine Uhrzeit im Format 08:30 angeben.');

export const openingHoursInput = z.object({
  spannen: z
    .array(
      z.object({
        weekday: z.number().int().min(1).max(7),
        von: uhrzeit,
        bis: uhrzeit,
      }),
    )
    .max(21, 'Mehr als drei Zeitfenster je Tag sind nicht vorgesehen.'),
});

/** Rolle eines Mitarbeiters im Betrieb. */
export const dealerMemberRoleInput = z.object({
  userId: z.string().min(1),
  role: z.enum(['DEALER_STAFF', 'DEALER_OWNER']),
});

export const dealerMemberInviteInput = z.object({
  email: z.string().trim().email().max(320),
  role: z.enum(['DEALER_STAFF', 'DEALER_OWNER']).default('DEALER_STAFF'),
});

export type DealerProfileInput = z.infer<typeof dealerProfileInput>;
export type OpeningHoursInput = z.infer<typeof openingHoursInput>;
