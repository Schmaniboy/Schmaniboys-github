import { z } from 'zod';

import { vin } from '../validation/vin';

/**
 * Eingaben des Verkaufsassistenten.
 *
 * Die Angaben zum Fahrzeug sind fast alle optional -- aus demselben Grund wie
 * im Katalog: Wer eine Angabe nicht sicher weiss, soll sie weglassen koennen,
 * statt etwas hinzuschreiben. Der Feld-Guard gibt Weggelassenes gar nicht
 * erst an die KI weiter, und die Anzeige weist es als fehlend aus.
 */

export const vinInput = z.object({ vin });

export const vehicleConfirmationInput = z.object({
  manufacturerId: z.string().min(1),
  modelId: z.string().min(1),
  generationId: z.string().min(1),
  powertrainId: z.string().min(1).nullish(),
  trimLineId: z.string().min(1).nullish(),
});

/** Ein Auto mit mehr als zwei Millionen Kilometern ist ein Tippfehler. */
const kilometerstand = z.number().int().min(0).max(2_000_000);

export const draftDetailsInput = z
  .object({
    mileageKm: kilometerstand.optional(),
    firstRegistration: z.coerce.date().optional(),
    /** Zahl der Vorbesitzer. 0 heisst: Erstbesitz. */
    previousOwners: z.number().int().min(0).max(50).optional(),
    /** Hauptuntersuchung gueltig bis. null heisst ausdruecklich: abgelaufen. */
    huValidUntil: z.coerce.date().nullish(),
    serviceHistory: z
      .enum(['FULL_MANUFACTURER', 'FULL_INDEPENDENT', 'PARTIAL', 'NONE', 'UNKNOWN'])
      .optional(),
    condition: z.enum(['EXCELLENT', 'GOOD', 'FAIR', 'POOR']).optional(),
    tyreCondition: z.string().trim().max(500).optional(),
    damages: z.string().trim().max(2000).optional(),
    hadAccident: z.boolean().optional(),
    accidentDetails: z.string().trim().max(2000).optional(),
    additionalNotes: z.string().trim().max(2000).optional(),
  })
  .refine(
    (wert) =>
      wert.hadAccident !== false ||
      wert.accidentDetails === undefined ||
      wert.accidentDetails.length === 0,
    {
      /*
       * "Unfallfrei" und zugleich eine Unfallbeschreibung ist ein
       * Widerspruch -- und die Angabe "unfallfrei" ist beim Autoverkauf
       * rechtlich erheblich. Der Widerspruch wird nicht stillschweigend
       * aufgeloest, sondern zurueckgewiesen.
       */
      message:
        'Das Fahrzeug ist als unfallfrei angegeben, enthält aber eine Unfallbeschreibung.',
      path: ['hadAccident'],
    },
  )
  .refine(
    (wert) =>
      wert.firstRegistration === undefined ||
      wert.firstRegistration.getTime() <= Date.now(),
    { message: 'Die Erstzulassung liegt in der Zukunft.', path: ['firstRegistration'] },
  );

export type DraftDetailsInput = z.infer<typeof draftDetailsInput>;

export const CONDITION_OPTIONS = [
  { value: 'EXCELLENT', label: 'Sehr gut' },
  { value: 'GOOD', label: 'Gut' },
  { value: 'FAIR', label: 'Gebrauchsspurig' },
  { value: 'POOR', label: 'Reparaturbedürftig' },
] as const;

export const SERVICE_HISTORY_OPTIONS = [
  { value: 'FULL_MANUFACTURER', label: 'Scheckheft lückenlos beim Hersteller' },
  { value: 'FULL_INDEPENDENT', label: 'Scheckheft lückenlos in freier Werkstatt' },
  { value: 'PARTIAL', label: 'Scheckheft teilweise geführt' },
  { value: 'NONE', label: 'Kein Scheckheft vorhanden' },
  { value: 'UNKNOWN', label: 'Nicht bekannt' },
] as const;
