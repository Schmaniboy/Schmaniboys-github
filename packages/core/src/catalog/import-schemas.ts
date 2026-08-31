import { z } from 'zod';

import { DATA_QUALITY_VALUES } from './data-quality';
import { AVAILABILITY_KIND_VALUES } from './availability';
import {
  IMAGE_BACKGROUND_VALUES,
  IMAGE_KIND_VALUES,
  IMAGE_LICENCE_STATUS_VALUES,
  IMAGE_ORIGIN_VALUES,
  IMAGE_SOURCE_TYPE_VALUES,
} from './images';

/**
 * Format der Importdateien.
 *
 * Der Zweck dieses Formats ist, dass Fahrzeugdaten spaeter als Redaktions-
 * arbeit in die Datenbank kommen und nicht als Ratespiel. Zwei Entscheidungen
 * tragen das:
 *
 * 1. QUELLENPFLICHT. Jede Datei nennt ihre Quelle, und jeder Datensatz darf
 *    eine eigene nennen. Ohne Quelle kein Import -- nicht als Warnung,
 *    sondern als Abbruch. Eine Datenbank, in die unbelegte Daten hineinkommen,
 *    ist eine Datenbank, aus der niemand mehr weiss, was belegt ist.
 *
 * 2. VERWEISE UEBER SPRECHENDE SCHLUESSEL. Die Datei kennt keine internen
 *    Kennungen, sondern nennt Hersteller, Modell und Generation beim Namen
 *    bzw. Kuerzel. Sie bleibt damit von Hand lesbar und pruefbar -- und ein
 *    falscher Verweis faellt beim Lesen auf, nicht erst in der Datenbank.
 */

export const IMPORT_FORMAT_VERSION = 1;

const jahr = z.number().int().min(1886).max(2100);

/** Eine Quellenangabe. Ohne Titel keine Quelle. */
export const importQuelle = z.object({
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
  title: z.string().trim().min(3).max(300),
  url: z.string().trim().url().max(2000).optional(),
  publishedOn: z.string().trim().optional(),
  checkedAt: z.string().trim().optional(),
  note: z.string().trim().max(1000).optional(),
  /** Welche Felder diese Quelle deckt. Leer heisst: den ganzen Datensatz. */
  coversFields: z.array(z.string().trim().min(1).max(60)).max(50).default([]),
});

export type ImportQuelle = z.infer<typeof importQuelle>;

/** Gemeinsame Felder jedes Datensatzes. */
const basis = {
  /**
   * Quellen dieses Datensatzes. Ueberschreibt die Dateiquelle nicht, sondern
   * ergaenzt sie -- ein Datenblatt kann die Leistung decken und eine zweite
   * Unterlage die Anhaengelast.
   */
  quellen: z.array(importQuelle).max(10).default([]),
  dataQuality: z.enum(DATA_QUALITY_VALUES).default('UNVERIFIED'),
  lastVerifiedAt: z.string().trim().optional(),
};

export const importHersteller = z.object({
  slug: z.string().trim().min(1).max(80),
  name: z.string().trim().min(1).max(120),
  country: z.string().trim().max(80).optional(),
  wmiCodes: z.array(z.string().trim().length(3)).max(60).default([]),
  ...basis,
});

export const importMotorfamilie = z.object({
  herstellerSlug: z.string().trim().min(1),
  slug: z.string().trim().min(1).max(80),
  name: z.string().trim().min(1).max(120),
  generationLabel: z.string().trim().max(120).optional(),
  description: z.string().trim().max(2000).optional(),
  yearFrom: jahr.optional(),
  yearTo: jahr.optional(),
  ...basis,
});

export const importMotor = z.object({
  herstellerSlug: z.string().trim().min(1),
  /** Motorcode. Der Schluessel, ueber den andere Datensaetze verweisen. */
  code: z.string().trim().min(1).max(30),
  name: z.string().trim().min(1).max(120),
  motorfamilieSlug: z.string().trim().min(1).optional(),
  powerStage: z.string().trim().max(60).optional(),
  displacementCcm: z.number().int().min(0).max(20000).optional(),
  cylinders: z.number().int().min(0).max(20).optional(),
  cylinderLayout: z.string().trim().max(20).optional(),
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
  chargingDetail: z.string().trim().max(200).optional(),
  injectionSystem: z.string().trim().max(200).optional(),
  valvetrain: z.string().trim().max(200).optional(),
  emissionStandard: z.string().trim().max(40).optional(),
  powerKw: z.number().int().min(0).max(2000).optional(),
  torqueNm: z.number().int().min(0).max(3000).optional(),
  yearFrom: jahr.optional(),
  yearTo: jahr.optional(),
  ...basis,
});

export const importModell = z.object({
  herstellerSlug: z.string().trim().min(1),
  slug: z.string().trim().min(1).max(80),
  name: z.string().trim().min(1).max(120),
  ...basis,
});

export const importGeneration = z.object({
  herstellerSlug: z.string().trim().min(1),
  modellSlug: z.string().trim().min(1),
  slug: z.string().trim().min(1).max(80),
  name: z.string().trim().min(1).max(120),
  /** Baureihenkuerzel, etwa "G20". */
  code: z.string().trim().max(30).optional(),
  bodyType: z.string().trim().max(80).optional(),
  yearFrom: jahr,
  yearTo: jahr.optional(),
  ...basis,
});

export const importFacelift = z.object({
  herstellerSlug: z.string().trim().min(1),
  modellSlug: z.string().trim().min(1),
  generationSlug: z.string().trim().min(1),
  slug: z.string().trim().min(1).max(80),
  name: z.string().trim().min(1).max(120),
  yearFrom: jahr,
  yearTo: jahr.optional(),
  distinguishingFeatures: z.string().trim().max(2000).optional(),
  ...basis,
});

export const importAntrieb = z.object({
  herstellerSlug: z.string().trim().min(1),
  modellSlug: z.string().trim().min(1),
  generationSlug: z.string().trim().min(1),
  /** Motorcode -- verweist auf einen Motor derselben Datei oder der Datenbank. */
  motorCode: z.string().trim().min(1),
  faceliftSlug: z.string().trim().min(1).optional(),
  getriebe: z.object({
    name: z.string().trim().min(1).max(120),
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
  }),
  driveType: z.enum(['FRONT', 'REAR', 'ALL']),
  yearFrom: jahr.optional(),
  yearTo: jahr.optional(),
  modelYearFrom: jahr.optional(),
  modelYearTo: jahr.optional(),
  marketRegion: z.string().trim().max(80).optional(),
  powerKw: z.number().int().min(0).max(2000).optional(),
  torqueNm: z.number().int().min(0).max(3000).optional(),
  acceleration0to100: z.number().min(0).max(60).optional(),
  topSpeedKmh: z.number().int().min(0).max(500).optional(),
  consumptionCombined: z.number().min(0).max(100).optional(),
  consumptionUnit: z.string().trim().max(20).optional(),
  co2CombinedGramPerKm: z.number().int().min(0).max(1000).optional(),
  measurementStandard: z.enum(['NEDC', 'WLTP', 'EPA', 'MANUFACTURER', 'UNKNOWN']).default('UNKNOWN'),
  kerbWeightKg: z.number().int().min(0).max(6000).optional(),
  batteryCapacityKwh: z.number().min(0).max(400).optional(),
  electricRangeKm: z.number().int().min(0).max(2000).optional(),
  fuelTankLitres: z.number().int().min(0).max(300).optional(),
  emissionStandard: z.string().trim().max(40).optional(),
  seats: z.number().int().min(1).max(9).optional(),
  doors: z.number().int().min(1).max(6).optional(),
  payloadKg: z.number().int().min(0).max(3000).optional(),
  towingCapacityBrakedKg: z.number().int().min(0).max(5000).optional(),
  towingCapacityUnbrakedKg: z.number().int().min(0).max(3000).optional(),
  ...basis,
});

export const importAusstattung = z.object({
  herstellerSlug: z.string().trim().min(1),
  slug: z.string().trim().min(1).max(80),
  name: z.string().trim().min(1).max(160),
  optionCode: z.string().trim().max(30).optional(),
  category: z.string().trim().max(80).optional(),
  area: z
    .enum([
      'EXTERIOR',
      'INTERIOR',
      'INFOTAINMENT',
      'SOUND',
      'ASSISTANCE',
      'DRIVETRAIN',
      'SAFETY',
      'OTHER',
    ])
    .optional(),
  description: z.string().trim().max(3000).optional(),
  howToIdentify: z.string().trim().max(2000).optional(),
  rarity: z.enum(['COMMON', 'UNCOMMON', 'RARE', 'VERY_RARE']).optional(),
  purchaseRelevance: z.enum(['HIGH', 'MEDIUM', 'LOW']).optional(),
  resaleRelevance: z.enum(['HIGH', 'MEDIUM', 'LOW']).optional(),
  relevanceEvidenceType: z.enum(['SPECIFICATION', 'ASSESSMENT', 'MARKET_SIGNAL']).optional(),
  relevanceReasoning: z.string().trim().max(2000).optional(),
  relevanceDataBasis: z.string().trim().max(2000).optional(),
  ...basis,
});

export const importVerfuegbarkeit = z.object({
  herstellerSlug: z.string().trim().min(1),
  ausstattungSlug: z.string().trim().min(1),
  modellSlug: z.string().trim().min(1),
  generationSlug: z.string().trim().min(1),
  faceliftSlug: z.string().trim().min(1).optional(),
  linieSlug: z.string().trim().min(1).optional(),
  paketSlug: z.string().trim().min(1).optional(),
  sondermodellSlug: z.string().trim().min(1).optional(),
  kind: z.enum(AVAILABILITY_KIND_VALUES).default('OPTIONAL'),
  yearFrom: jahr.optional(),
  yearTo: jahr.optional(),
  modelYearFrom: jahr.optional(),
  modelYearTo: jahr.optional(),
  marketRegion: z.string().trim().max(80).optional(),
  surchargeCents: z.number().int().min(0).max(100_000_000).optional(),
  surchargeCurrency: z.string().trim().length(3).optional(),
  note: z.string().trim().max(1000).optional(),
  ...basis,
});

export const importBild = z.object({
  kind: z.enum(IMAGE_KIND_VALUES),
  origin: z.enum(IMAGE_ORIGIN_VALUES),
  /** Original, lizenziert oder erzeugt. Muss zur Herkunft passen. */
  sourceType: z.enum(IMAGE_SOURCE_TYPE_VALUES),
  /**
   * Rechtsstand. Voreinstellung ist ungeklaert -- wer nichts angibt, hat
   * nichts geprueft, und dann erscheint das Bild nicht.
   */
  licenceStatus: z.enum(IMAGE_LICENCE_STATUS_VALUES).default('UNCLEAR'),
  background: z.enum(IMAGE_BACKGROUND_VALUES).default('UNKNOWN'),
  herstellerSlug: z.string().trim().min(1),
  modellSlug: z.string().trim().min(1).optional(),
  generationSlug: z.string().trim().min(1).optional(),
  faceliftSlug: z.string().trim().min(1).optional(),
  ausstattungSlug: z.string().trim().min(1).optional(),
  lackfarbeSlug: z.string().trim().min(1).optional(),
  radSlug: z.string().trim().min(1).optional(),
  yearFrom: jahr.optional(),
  yearTo: jahr.optional(),
  sourceUrl: z.string().trim().url().max(2000).optional(),
  sourceTitle: z.string().trim().max(300).optional(),
  author: z.string().trim().max(200).optional(),
  licence: z.string().trim().min(2).max(200),
  licenceUrl: z.string().trim().url().max(2000).optional(),
  generatedByModel: z.string().trim().max(120).optional(),
  generatedPrompt: z.string().trim().max(4000).optional(),
  description: z.string().trim().min(5).max(1000),
  storageKey: z.string().trim().max(300).optional(),
  ...basis,
});

export const importHsnTsn = z.object({
  hsn: z.string().trim().regex(/^\d{4}$/, 'HSN besteht aus genau vier Ziffern.'),
  tsn: z.string().trim().regex(/^[A-Z0-9]{3}$/, 'TSN besteht aus genau drei Zeichen.'),
  manufacturerName: z.string().trim().min(1).max(120),
  typeName: z.string().trim().min(1).max(160),
  herstellerSlug: z.string().trim().min(1).optional(),
  modellSlug: z.string().trim().min(1).optional(),
  generationSlug: z.string().trim().min(1).optional(),
  motorCode: z.string().trim().min(1).optional(),
  yearFrom: jahr.optional(),
  yearTo: jahr.optional(),
  note: z.string().trim().max(1000).optional(),
  ...basis,
});

/**
 * Eine vollstaendige Importdatei.
 *
 * Die Dateiquelle ist Pflicht. Das ist die eine Stelle, an der das Format
 * unnachgiebig ist -- alles andere darf fehlen, die Herkunft nicht.
 */
export const importDatei = z
  .object({
    formatVersion: z.literal(IMPORT_FORMAT_VERSION),
    /** Woher die Daten dieser Datei stammen. */
    quelle: importQuelle,
    /** Frei fuer den Menschen, etwa "BMW 3er G20, Preisliste 03/2019". */
    beschreibung: z.string().trim().max(500).optional(),

    hersteller: z.array(importHersteller).max(500).default([]),
    motorfamilien: z.array(importMotorfamilie).max(2000).default([]),
    motoren: z.array(importMotor).max(20000).default([]),
    modelle: z.array(importModell).max(5000).default([]),
    generationen: z.array(importGeneration).max(20000).default([]),
    faceliftphasen: z.array(importFacelift).max(20000).default([]),
    antriebe: z.array(importAntrieb).max(50000).default([]),
    ausstattungen: z.array(importAusstattung).max(50000).default([]),
    verfuegbarkeiten: z.array(importVerfuegbarkeit).max(100000).default([]),
    bilder: z.array(importBild).max(50000).default([]),
    hsnTsn: z.array(importHsnTsn).max(100000).default([]),
  })
  .refine(
    (datei) =>
      datei.hersteller.length +
        datei.motorfamilien.length +
        datei.motoren.length +
        datei.modelle.length +
        datei.generationen.length +
        datei.faceliftphasen.length +
        datei.antriebe.length +
        datei.ausstattungen.length +
        datei.verfuegbarkeiten.length +
        datei.bilder.length +
        datei.hsnTsn.length >
      0,
    { message: 'Die Datei enthält keinen einzigen Datensatz.' },
  );

export type ImportDatei = z.infer<typeof importDatei>;
export type ImportMotor = z.infer<typeof importMotor>;
export type ImportAntrieb = z.infer<typeof importAntrieb>;
export type ImportBild = z.infer<typeof importBild>;
