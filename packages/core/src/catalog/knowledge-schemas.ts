import { z } from 'zod';

import { buildYear } from './schemas';

/**
 * Eingaben der Wissensdatenbank.
 *
 * Jede Aussage nennt ihr Belegmodell. Die inhaltliche Pruefung -- ob die
 * Belege ausreichen -- steht in `evidence.ts` und greift beim Veroeffentlichen.
 * Hier wird nur die Form geprueft.
 */

export const evidenceFields = z.object({
  evidenceType: z.enum(['SPECIFICATION', 'ASSESSMENT', 'MARKET_SIGNAL']),
  confidence: z.enum(['HIGH', 'MEDIUM', 'LOW']).default('MEDIUM'),
  /** Begruendung -- bei Einschaetzungen zum Veroeffentlichen erforderlich. */
  reasoning: z.string().trim().max(4000).optional(),
  /** Datengrundlage -- bei Marktbeobachtungen erforderlich. */
  dataBasis: z.string().trim().max(2000).optional(),
  observedAt: z.coerce.date().optional(),
  sampleSize: z.number().int().min(1).max(1_000_000).optional(),
});

/** Alle Wissensaussagen haengen an einer Generation, wahlweise enger. */
const subject = z.object({
  generationId: z.string().min(1),
  /** Wenn gesetzt, gilt die Aussage nur fuer diese Antriebskombination. */
  powertrainId: z.string().min(1).nullish(),
});

export const knownIssueInput = subject
  .extend({
    title: z.string().trim().min(5, 'Bitte die Schwachstelle benennen.').max(200),
    component: z.string().trim().min(2).max(120).optional(),
    severity: z.enum(['CRITICAL', 'SIGNIFICANT', 'MINOR']),
    symptoms: z.string().trim().max(4000).optional(),
    remedy: z.string().trim().max(4000).optional(),
    /*
     * Laufleistung als Spanne, nicht als Punkt: "ab etwa 120.000 km" ist
     * ehrlich, "bei 137.500 km" waere erfunden.
     */
    typicalMileageFromKm: z.number().int().min(0).max(2_000_000).optional(),
    typicalMileageToKm: z.number().int().min(0).max(2_000_000).optional(),
    yearFrom: buildYear.optional(),
    yearTo: buildYear.nullish(),
  })
  .merge(evidenceFields)
  .refine(
    (value) =>
      value.typicalMileageFromKm === undefined ||
      value.typicalMileageToKm === undefined ||
      value.typicalMileageToKm >= value.typicalMileageFromKm,
    { message: 'Die obere Laufleistung liegt unter der unteren.', path: ['typicalMileageToKm'] },
  );

export const maintenanceItemInput = subject
  .extend({
    task: z.string().trim().min(5, 'Bitte die Wartungsarbeit benennen.').max(200),
    intervalKm: z.number().int().min(100).max(500_000).optional(),
    intervalMonths: z.number().int().min(1).max(360).optional(),
    note: z.string().trim().max(4000).optional(),
  })
  .merge(evidenceFields)
  .refine((value) => value.intervalKm !== undefined || value.intervalMonths !== undefined, {
    message: 'Bitte mindestens ein Intervall angeben -- in Kilometern oder Monaten.',
    path: ['intervalKm'],
  });

export const costEstimateInput = subject
  .extend({
    category: z.enum([
      'INSURANCE',
      'VEHICLE_TAX',
      'SERVICE',
      'TYPICAL_REPAIR',
      'FUEL',
      'DEPRECIATION',
      'OTHER',
    ]),
    label: z.string().trim().min(3).max(200),
    /** Betraege in Cent. Fliesskommazahlen haben bei Geld nichts zu suchen. */
    amountFromCents: z.number().int().min(0).max(100_000_000).optional(),
    amountToCents: z.number().int().min(0).max(100_000_000).optional(),
    currency: z.string().trim().length(3).default('EUR'),
    per: z.string().trim().max(40).optional(),
    /** Steuer und Versicherung sind ohne Land bedeutungslos. */
    region: z.string().trim().max(80).optional(),
  })
  .merge(evidenceFields)
  .refine(
    (value) =>
      value.amountFromCents === undefined ||
      value.amountToCents === undefined ||
      value.amountToCents >= value.amountFromCents,
    { message: 'Der obere Betrag liegt unter dem unteren.', path: ['amountToCents'] },
  )
  .refine((value) => value.amountFromCents !== undefined || value.amountToCents !== undefined, {
    message: 'Bitte mindestens einen Betrag angeben.',
    path: ['amountFromCents'],
  });

export const knowledgeNoteInput = subject
  .extend({
    topic: z.enum([
      'RELIABILITY',
      'EVERYDAY_USE',
      'LONG_DISTANCE',
      'CITY_USE',
      'TOWING',
      'TUNING_POTENTIAL',
      'RESALE_VALUE',
      'DEMAND',
      'ADVANTAGE',
      'DISADVANTAGE',
      'BUYING_ADVICE',
    ]),
    heading: z.string().trim().min(5).max(200),
    body: z.string().trim().min(20, 'Ein Satz genuegt nicht.').max(8000),
  })
  .merge(evidenceFields);

/** Themenbezeichnungen fuer die Oberflaeche. */
export const TOPIC_LABELS: Record<string, string> = {
  RELIABILITY: 'Zuverlässigkeit',
  EVERYDAY_USE: 'Alltag',
  LONG_DISTANCE: 'Langstrecke',
  CITY_USE: 'Stadtverkehr',
  TOWING: 'Anhängerbetrieb',
  TUNING_POTENTIAL: 'Tuningpotential',
  RESALE_VALUE: 'Wiederverkaufswert',
  DEMAND: 'Nachfrage',
  ADVANTAGE: 'Vorteil',
  DISADVANTAGE: 'Nachteil',
  BUYING_ADVICE: 'Beim Kauf beachten',
};

export const SEVERITY_LABELS: Record<string, string> = {
  CRITICAL: 'kritisch',
  SIGNIFICANT: 'erheblich',
  MINOR: 'gering',
};

export const COST_CATEGORY_LABELS: Record<string, string> = {
  INSURANCE: 'Versicherung',
  VEHICLE_TAX: 'Kfz-Steuer',
  SERVICE: 'Wartung',
  TYPICAL_REPAIR: 'Typische Reparatur',
  FUEL: 'Kraftstoff',
  DEPRECIATION: 'Wertverlust',
  OTHER: 'Sonstiges',
};
