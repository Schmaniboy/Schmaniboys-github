import { z } from 'zod';

import { displayName, slug, toSlug } from '../validation/common';

import { AVAILABILITY_KIND_VALUES, pruefeVerfuegbarkeitStimmig } from './availability';
import { DATA_QUALITY_VALUES } from './data-quality';

/**
 * Eingabeschemata des Katalogs.
 *
 * Zwei Dinge sind hier bewusst gesetzt:
 *
 * 1. Fast alles ist optional. Ein unvollstaendig erfasstes Fahrzeug muss
 *    erfassbar bleiben, sonst entsteht der Druck, Luecken zu fuellen --
 *    genau das verbietet Vorgabe C3.
 * 2. Zahlen haben Ober- und Untergrenzen. Nicht aus Bevormundung, sondern
 *    weil ein Tippfehler ("3000 PS") sonst als Tatsache im Katalog steht.
 */

/** Das erste Automobil mit Verbrennungsmotor wurde 1886 patentiert. */
export const EARLIEST_YEAR = 1886;

/** Modelljahre laufen der Kalenderzeit voraus; zwei Jahre Vorlauf genuegen. */
export function latestYear(now: Date = new Date()): number {
  return now.getUTCFullYear() + 2;
}

export const buildYear = z
  .number()
  .int()
  .min(EARLIEST_YEAR, `Vor ${EARLIEST_YEAR} gab es keine Automobile.`)
  .max(latestYear(), 'Das Jahr liegt zu weit in der Zukunft.');

/**
 * Bauzeitraum. `yearTo: null` heisst ausdruecklich "laeuft noch",
 * ein fehlendes Feld heisst "nicht erfasst". Der Unterschied ist fachlich
 * bedeutsam und wird deshalb nicht eingeebnet.
 */
export const buildPeriod = z
  .object({
    yearFrom: buildYear,
    yearTo: buildYear.nullish(),
  })
  .refine(
    (value) => value.yearTo === null || value.yearTo === undefined || value.yearTo >= value.yearFrom,
    { message: 'Das Ende des Bauzeitraums liegt vor seinem Beginn.', path: ['yearTo'] },
  );

export const sourceInput = z.object({
  kind: z
    .enum([
      'MANUFACTURER_DOCUMENT',
      'TYPE_APPROVAL',
      'PRESS_RELEASE',
      'TECHNICAL_LITERATURE',
      'MEASUREMENT',
      'OTHER',
    ])
    .default('OTHER'),
  title: z.string().trim().min(3, 'Die Quelle braucht eine Bezeichnung.').max(300),
  // Buecher und Werkstattunterlagen haben keine Adresse -- deshalb optional.
  url: z.string().url('Bitte eine vollstaendige Adresse angeben.').max(2000).optional(),
  publishedOn: z.coerce.date().optional(),
  note: z.string().trim().max(1000).optional(),
  /**
   * Welche Werte diese Quelle deckt. Leer heisst: den ganzen Eintrag.
   *
   * Belegpflicht je Wert statt je Eintrag -- ein Datenblatt belegt die
   * Leistung, sagt aber nichts ueber die Anhaengelast.
   */
  coversFields: z.array(z.string().trim().min(2).max(60)).max(40).default([]),
});

export const manufacturerInput = z.object({
  name: displayName,
  slug: slug.optional(),
  country: z.string().trim().min(2).max(80).optional(),
  /**
   * Weltweite Herstellerkennung: drei Zeichen, ohne I, O und Q -- die kommen
   * in einer VIN nicht vor.
   */
  wmiCodes: z
    .array(
      z
        .string()
        .trim()
        .toUpperCase()
        .length(3)
        .regex(/^[A-HJ-NPR-Z0-9]{3}$/, 'Eine WMI besteht aus drei VIN-Zeichen.'),
    )
    .max(50)
    .default([]),
});

export const modelInput = z.object({
  manufacturerId: z.string().min(1),
  name: displayName,
  slug: slug.optional(),
});

export const generationInput = z
  .object({
    modelId: z.string().min(1),
    name: displayName,
    code: z.string().trim().min(1).max(40).optional(),
    slug: slug.optional(),
    bodyTypeId: z.string().min(1).optional(),
  })
  .and(buildPeriod);

export const faceliftInput = z
  .object({
    generationId: z.string().min(1),
    name: displayName,
    slug: slug.optional(),
    distinguishingFeatures: z.string().trim().max(4000).optional(),
  })
  .and(buildPeriod);

export const engineInput = z.object({
  manufacturerId: z.string().min(1),
  name: displayName,
  code: z.string().trim().min(1).max(40).optional(),
  // Groesster bekannter Serien-Pkw-Hubraum liegt deutlich unter 15 Litern.
  displacementCcm: z.number().int().min(50).max(15_000).optional(),
  cylinders: z.number().int().min(1).max(16).optional(),
  fuelType: z.enum([
    'PETROL',
    'DIESEL',
    'HYBRID_PETROL',
    'HYBRID_DIESEL',
    'PLUGIN_HYBRID',
    'ELECTRIC',
    'LPG',
    'CNG',
    'HYDROGEN',
    'OTHER',
  ]),
  aspiration: z
    .enum([
      'NATURALLY_ASPIRATED',
      'TURBOCHARGED',
      'SUPERCHARGED',
      'TWINCHARGED',
      'ELECTRIC_DRIVE',
      'OTHER',
    ])
    .default('OTHER'),
  powerKw: z.number().int().min(1).max(1500).optional(),
  torqueNm: z.number().int().min(1).max(2500).optional(),
});

export const transmissionInput = z.object({
  name: displayName,
  type: z.enum([
    'MANUAL',
    'AUTOMATIC_TORQUE_CONVERTER',
    'AUTOMATED_MANUAL',
    'DUAL_CLUTCH',
    'CVT',
    'REDUCTION_GEAR',
    'OTHER',
  ]),
  gears: z.number().int().min(1).max(12).optional(),
});

export const powertrainInput = z.object({
  generationId: z.string().min(1),
  engineId: z.string().min(1),
  transmissionId: z.string().min(1),
  driveType: z.enum(['FRONT', 'REAR', 'ALL']),
  yearFrom: buildYear.optional(),
  yearTo: buildYear.nullish(),
  powerKw: z.number().int().min(1).max(1500).optional(),
  torqueNm: z.number().int().min(1).max(2500).optional(),
  acceleration0to100: z.number().min(1).max(60).optional(),
  topSpeedKmh: z.number().int().min(20).max(500).optional(),
  consumptionCombined: z.number().min(0).max(100).optional(),
  consumptionUnit: z.string().trim().max(20).optional(),
  co2CombinedGramPerKm: z.number().int().min(0).max(1000).optional(),
  /**
   * Ohne Messzyklus ist ein Verbrauchswert nicht vergleichbar. Der Standardwert
   * ist deshalb UNKNOWN und nicht etwa WLTP -- geraten wird nichts.
   */
  measurementStandard: z
    .enum(['NEDC', 'WLTP', 'EPA', 'MANUFACTURER', 'UNKNOWN'])
    .default('UNKNOWN'),
  kerbWeightKg: z.number().int().min(200).max(5000).optional(),
  batteryCapacityKwh: z.number().min(0.5).max(400).optional(),
  fuelTankLitres: z.number().int().min(1).max(200).optional(),
  electricRangeKm: z.number().int().min(1).max(2000).optional(),
  /*
   * Abgasnorm als freier Text: Die Bezeichnungen sind zahlreich, uneinheitlich
   * und aendern sich. Eine Aufzaehlung waere binnen zwei Jahren unvollstaendig
   * und muesste bei jeder neuen Stufe migriert werden.
   */
  emissionStandard: z.string().trim().min(2).max(40).optional(),
  seats: z.number().int().min(1).max(9).optional(),
  doors: z.number().int().min(1).max(6).optional(),
  payloadKg: z.number().int().min(1).max(3000).optional(),
  towingCapacityBrakedKg: z.number().int().min(0).max(5000).optional(),
  towingCapacityUnbrakedKg: z.number().int().min(0).max(2000).optional(),
}).refine(
  (wert) =>
    wert.towingCapacityBrakedKg === undefined ||
    wert.towingCapacityUnbrakedKg === undefined ||
    wert.towingCapacityBrakedKg >= wert.towingCapacityUnbrakedKg,
  {
    // Die gebremste Anhaengelast ist nie kleiner als die ungebremste.
    // Ist sie es doch, wurden die Felder vertauscht -- und das ist im Betrieb
    // gefaehrlich, nicht nur unschoen.
    message: 'Die gebremste Anhaengelast liegt unter der ungebremsten. Sind die Werte vertauscht?',
    path: ['towingCapacityBrakedKg'],
  },
);

export const trimLineInput = z.object({
  generationId: z.string().min(1),
  name: displayName,
  slug: slug.optional(),
  description: z.string().trim().max(4000).optional(),
  yearFrom: buildYear.optional(),
  yearTo: buildYear.nullish(),
});

export const optionalEquipmentInput = z
  .object({
    manufacturerId: z.string().min(1),
    name: displayName,
    slug: slug.optional(),
    optionCode: z.string().trim().min(1).max(40).optional(),
    category: z.string().trim().min(2).max(80).optional(),
    description: z.string().trim().max(4000).optional(),
    howToIdentify: z.string().trim().max(4000).optional(),

    /*
     * Seltenheit, Kaufrelevanz und Wiederverkaufsrelevanz sind niemals
     * Spezifikationen: Bestellquoten und Wiederverkaufswirkung stehen in
     * keinem Datenblatt. Wer eine dieser Angaben macht, muss das Belegmodell
     * mitliefern -- sonst entstuende genau die Sorte Aussage, die wie eine
     * Tatsache aussieht und keine ist.
     */
    rarity: z.enum(['COMMON', 'UNCOMMON', 'RARE', 'VERY_RARE']).optional(),
    purchaseRelevance: z.enum(['HIGH', 'MEDIUM', 'LOW']).optional(),
    resaleRelevance: z.enum(['HIGH', 'MEDIUM', 'LOW']).optional(),
    relevanceEvidenceType: z.enum(['ASSESSMENT', 'MARKET_SIGNAL']).optional(),
    relevanceConfidence: z.enum(['HIGH', 'MEDIUM', 'LOW']).default('MEDIUM'),
    relevanceReasoning: z.string().trim().max(4000).optional(),
    relevanceDataBasis: z.string().trim().max(2000).optional(),
    relevanceObservedAt: z.coerce.date().optional(),
    relevanceSampleSize: z.number().int().min(1).max(1_000_000).optional(),
  })
  .refine(
    (wert) =>
      (wert.rarity === undefined &&
        wert.purchaseRelevance === undefined &&
        wert.resaleRelevance === undefined) ||
      wert.relevanceEvidenceType !== undefined,
    {
      message:
        'Seltenheit und Relevanz sind Einschaetzungen. Bitte das Belegmodell angeben: ASSESSMENT oder MARKET_SIGNAL.',
      path: ['relevanceEvidenceType'],
    },
  );

export const optionAvailabilityInput = z
  .object({
    optionId: z.string().min(1),
    generationId: z.string().min(1),
    /** Nur fuer diese Ausstattungslinie, wenn gesetzt. */
    trimLineId: z.string().min(1).nullish(),
    /** Nur fuer diese Antriebskombination, wenn gesetzt. */
    powertrainId: z.string().min(1).nullish(),
    /** Ueber dieses Paket zu bekommen, wenn gesetzt. */
    packageId: z.string().min(1).nullish(),
    /** An dieses Sondermodell gebunden, wenn gesetzt. */
    specialEditionId: z.string().min(1).nullish(),
    /** Erst bzw. nur ab dieser Facelift-Phase, wenn gesetzt. */
    faceliftPhaseId: z.string().min(1).nullish(),
    /**
     * In welcher Form es die Ausstattung gab.
     *
     * Loest den frueheren Wahrheitswert `standard` ab. Der kannte nur zwei
     * Zustaende und warf damit Aufpreisausstattung, reine Paketbestandteile,
     * Sondermodell-Ausstattung und marktabhaengige Ausstattung zusammen --
     * genau die Unterscheidung, auf die es beim Gebrauchtkauf ankommt.
     */
    kind: z.enum(AVAILABILITY_KIND_VALUES).default('OPTIONAL'),
    yearFrom: buildYear.optional(),
    yearTo: buildYear.nullish(),
    modelYearFrom: buildYear.optional(),
    modelYearTo: buildYear.nullish(),
    marketRegion: z.string().trim().max(80).optional(),
    surchargeCents: z.number().int().min(0).max(100_000_000).optional(),
    surchargeCurrency: z.string().trim().length(3).toUpperCase().optional(),
    dataQuality: z.enum(DATA_QUALITY_VALUES).default('UNVERIFIED'),
    note: z.string().trim().max(1000).optional(),
  })
  .superRefine((wert, ctx) => {
    /*
     * Die Widersprueche, die beim Abtippen einer Preisliste entstehen.
     * Die Pruefungen selbst stehen in availability.ts, damit sie auch fuer
     * den Import und die Qualitaetskontrolle gelten und nicht nur fuer
     * dieses eine Formular.
     */
    for (const [feld, meldungen] of Object.entries(
      pruefeVerfuegbarkeitStimmig({
        kind: wert.kind,
        packageId: wert.packageId ?? null,
        specialEditionId: wert.specialEditionId ?? null,
        marketRegion: wert.marketRegion ?? null,
        surchargeCents: wert.surchargeCents ?? null,
      }),
    )) {
      for (const meldung of meldungen) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: [feld], message: meldung });
      }
    }
  });

/** Lackarten, wie sie in Preislisten stehen. */
export const PAINT_KIND_LABELS: Record<string, string> = {
  UNI: 'Uni',
  METALLIC: 'Metallic',
  PEARL_EFFECT: 'Perleffekt',
  MATTE: 'Matt',
  SPECIAL_ORDER: 'Sonderlackierung ab Werk',
  OTHER: 'sonstige',
};

export const RARITY_LABELS: Record<string, string> = {
  COMMON: 'häufig',
  UNCOMMON: 'seltener',
  RARE: 'selten',
  VERY_RARE: 'sehr selten',
};

export const RELEVANCE_LABELS: Record<string, string> = {
  HIGH: 'hoch',
  MEDIUM: 'mittel',
  LOW: 'gering',
};

export const statusChangeInput = z.object({
  status: z.enum(['DRAFT', 'IN_REVIEW', 'PUBLISHED', 'ARCHIVED']),
});

/**
 * Erzeugt den Slug aus dem Namen, wenn keiner angegeben wurde.
 * Getrennte Funktion, damit die Regel an einer Stelle steht.
 */
export function resolveSlug(input: { name: string; slug?: string | undefined }): string {
  return input.slug ?? toSlug(input.name);
}
