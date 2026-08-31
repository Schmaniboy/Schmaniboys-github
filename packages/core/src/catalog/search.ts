import { z } from 'zod';

import { EARLIEST_YEAR, latestYear } from './schemas';

/**
 * Baujahr aus der Adresszeile.
 *
 * Bewusst NICHT `buildYear` aus schemas.ts: Das erwartet eine Zahl, wie sie
 * in einem JSON-Body steht. Aus der Adresszeile kommt jedoch immer eine
 * Zeichenkette. Ohne Umwandlung scheitert die Pruefung stillschweigend, die
 * Suche faellt auf "ungefiltert" zurueck -- und zeigt Treffer, die niemand
 * gesucht hat. Genau das ist einmal passiert und war an der Trefferliste
 * nicht zu erkennen.
 */
const suchJahr = z.coerce
  .number()
  .int()
  .min(EARLIEST_YEAR, `Vor ${EARLIEST_YEAR} gab es keine Automobile.`)
  .max(latestYear(), 'Das Jahr liegt zu weit in der Zukunft.');

/**
 * Suchanfrage des Fahrzeugkatalogs.
 *
 * ENTSCHEIDUNG ZUR KOERNUNG: Gesucht wird auf Ebene der Antriebskombination,
 * nicht der Generation. Ein Treffer ist also "Muster 300 (MB2) 2.0 Diesel,
 * Automatik, Heck" und nicht "Muster 300".
 *
 * Grund: Die geforderten Filter -- Motor, Leistung, Kraftstoff, Getriebe,
 * Antrieb -- unterscheiden genau auf dieser Ebene. Auf Generationsebene
 * waere "Diesel mit mehr als 140 kW" nicht beantwortbar, weil eine Generation
 * beides enthaelt: den passenden und den unpassenden Motor. Nebenbei wird
 * dadurch das Sortieren nach Leistung oder Verbrauch zu einer gewoehnlichen
 * Spaltensortierung -- eine Sortierung ueber verknuepfte Aggregate waere
 * weder in der Datenbank sauber noch seitenweise korrekt.
 *
 * NICHT ENTHALTEN sind Preis, Kilometerstand und Standort. Diese Angaben
 * gehoeren zu einer Anzeige, nicht zu einem Katalogeintrag -- es gibt sie
 * erst mit dem Marktplatz in Phase 9. Sie hier aufzunehmen wuerde eine
 * Filterung vortaeuschen, die nichts filtern kann.
 */

export const SORT_OPTIONS = {
  RELEVANCE: 'relevanz',
  POWER_DESC: 'leistung-ab',
  POWER_ASC: 'leistung-auf',
  YEAR_DESC: 'baujahr-ab',
  YEAR_ASC: 'baujahr-auf',
  CONSUMPTION_ASC: 'verbrauch-auf',
  ACCELERATION_ASC: 'beschleunigung-auf',
} as const;

export type SortOption = (typeof SORT_OPTIONS)[keyof typeof SORT_OPTIONS];

export const SORT_LABELS: Record<SortOption, string> = {
  relevanz: 'Passend',
  'leistung-ab': 'Leistung, stärkste zuerst',
  'leistung-auf': 'Leistung, schwächste zuerst',
  'baujahr-ab': 'Baujahr, neueste zuerst',
  'baujahr-auf': 'Baujahr, älteste zuerst',
  'verbrauch-auf': 'Verbrauch, sparsamste zuerst',
  'beschleunigung-auf': 'Beschleunigung, schnellste zuerst',
};

/**
 * Ein Filter, der ein- oder mehrfach in der Adresszeile stehen kann.
 * `?kraftstoff=DIESEL` und `?kraftstoff=DIESEL&kraftstoff=PETROL` fuehren
 * beide zu einer Liste. Der Rueckgabetyp bleibt dabei die Aufzaehlung und
 * wird nicht zu `string[]` verwaessert -- sonst faellt die Typsicherheit
 * genau dort weg, wo die Werte in eine Datenbankabfrage gehen.
 */
const mehrfachauswahl = <T extends readonly [string, ...string[]]>(werte: T) =>
  z
    .preprocess(
      (roh) => {
        /*
         * Drei Schreibweisen kommen an: ein Wert, mehrere gleichnamige
         * Parameter, oder eine kommagetrennte Liste. Die dritte entsteht,
         * weil ein Link -- anders als ein Formular -- nur einen Wert je
         * Parameter setzen kann, die Filterleiste aber ohne JavaScript
         * auskommen soll.
         */
        if (typeof roh === 'string' && roh.includes(',')) {
          return roh.split(',').filter(Boolean);
        }
        return roh;
      },
      z.union([z.enum(werte), z.array(z.enum(werte))]).optional(),
    )
    .transform((wert): T[number][] => {
      if (wert === undefined) return [];
      return Array.isArray(wert) ? wert : [wert];
    });

export const vehicleSearchInput = z
  .object({
    /** Freitext ueber Marke, Modell, Generation und Motor. */
    q: z.string().trim().max(120).optional(),

    hersteller: z.string().trim().max(120).optional(),
    modell: z.string().trim().max(120).optional(),
    karosserie: z.string().trim().max(120).optional(),
    /**
     * Baureihenkuerzel, etwa "G20" oder "B9".
     *
     * Eigenes Feld und nicht Teil des Freitexts: Wer eine Baureihe filtert,
     * will genau sie -- nicht alles, in dessen Namen die Zeichenfolge
     * vorkommt.
     */
    baureihe: z.string().trim().max(40).optional(),
    /**
     * Abgasnorm, etwa "Euro 6d". Als Praefix gesucht, weil die Bezeichnungen
     * zahlreich sind ("Euro 6b", "Euro 6d-TEMP") und niemand sie vollstaendig
     * eintippt.
     */
    abgasnorm: z.string().trim().max(40).optional(),

    /** Baujahr: Treffer, deren Bauzeitraum sich mit der Spanne ueberschneidet. */
    baujahrVon: suchJahr.optional(),
    baujahrBis: suchJahr.optional(),

    kraftstoff: mehrfachauswahl([
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
    ] as const),
    getriebe: mehrfachauswahl([
      'MANUAL',
      'AUTOMATIC_TORQUE_CONVERTER',
      'AUTOMATED_MANUAL',
      'DUAL_CLUTCH',
      'CVT',
      'REDUCTION_GEAR',
      'OTHER',
    ] as const),
    antrieb: mehrfachauswahl(['FRONT', 'REAR', 'ALL'] as const),

    /** Leistung in Kilowatt -- die gespeicherte Einheit. */
    leistungVonKw: z.coerce.number().int().min(1).max(1500).optional(),
    leistungBisKw: z.coerce.number().int().min(1).max(1500).optional(),

    sortierung: z
      .enum([
        'relevanz',
        'leistung-ab',
        'leistung-auf',
        'baujahr-ab',
        'baujahr-auf',
        'verbrauch-auf',
        'beschleunigung-auf',
      ])
      .default('relevanz'),

    seite: z.coerce.number().int().min(1).max(500).default(1),
  })
  .refine(
    (wert) =>
      wert.baujahrVon === undefined ||
      wert.baujahrBis === undefined ||
      wert.baujahrBis >= wert.baujahrVon,
    { message: 'Das Bis-Jahr liegt vor dem Von-Jahr.', path: ['baujahrBis'] },
  )
  .refine(
    (wert) =>
      wert.leistungVonKw === undefined ||
      wert.leistungBisKw === undefined ||
      wert.leistungBisKw >= wert.leistungVonKw,
    { message: 'Die obere Leistungsgrenze liegt unter der unteren.', path: ['leistungBisKw'] },
  );

export type VehicleSearchInput = z.infer<typeof vehicleSearchInput>;

/** Feste Seitengroesse. Groessere Seiten kosten Antwortzeit ohne Nutzen. */
export const SEARCH_PAGE_SIZE = 24;

/** Wie viele Seiten es zu einer Trefferzahl gibt. */
export function pageCount(total: number, pageSize = SEARCH_PAGE_SIZE): number {
  return Math.max(1, Math.ceil(total / pageSize));
}

/**
 * Ist ueberhaupt ein Filter gesetzt?
 *
 * Ohne Filter zeigt die Suche eine Auswahl statt einer leeren Seite -- eine
 * leere Trefferliste beim ersten Aufruf sieht aus wie ein Fehler.
 */
export function hasActiveFilters(input: VehicleSearchInput): boolean {
  return Boolean(
    input.q ||
      input.hersteller ||
      input.modell ||
      input.karosserie ||
      input.baureihe ||
      input.abgasnorm ||
      input.baujahrVon !== undefined ||
      input.baujahrBis !== undefined ||
      input.leistungVonKw !== undefined ||
      input.leistungBisKw !== undefined ||
      input.kraftstoff.length > 0 ||
      input.getriebe.length > 0 ||
      input.antrieb.length > 0,
  );
}

/**
 * Baut die Adresse einer Suchseite -- mit geaenderten Werten, aber unter
 * Beibehaltung aller uebrigen Filter. Ohne das wuerde jede Sortierung oder
 * jeder Seitenwechsel die gesetzten Filter verwerfen.
 */
export function buildSearchQuery(
  input: VehicleSearchInput,
  aenderungen: Partial<Record<string, string | number | undefined>> = {},
): string {
  const params = new URLSearchParams();

  const setze = (schluessel: string, wert: string | number | undefined | null): void => {
    if (wert === undefined || wert === null || wert === '') return;
    params.set(schluessel, String(wert));
  };

  setze('q', input.q);
  setze('hersteller', input.hersteller);
  setze('modell', input.modell);
  setze('karosserie', input.karosserie);
  setze('baureihe', input.baureihe);
  setze('abgasnorm', input.abgasnorm);
  setze('baujahrVon', input.baujahrVon);
  setze('baujahrBis', input.baujahrBis);
  setze('leistungVonKw', input.leistungVonKw);
  setze('leistungBisKw', input.leistungBisKw);
  for (const wert of input.kraftstoff) params.append('kraftstoff', wert);
  for (const wert of input.getriebe) params.append('getriebe', wert);
  for (const wert of input.antrieb) params.append('antrieb', wert);
  if (input.sortierung !== 'relevanz') setze('sortierung', input.sortierung);
  if (input.seite > 1) setze('seite', input.seite);

  for (const [schluessel, wert] of Object.entries(aenderungen)) {
    if (wert === undefined) params.delete(schluessel);
    else params.set(schluessel, String(wert));
  }

  // Ein Filterwechsel fuehrt immer auf die erste Seite zurueck -- sonst
  // landet man auf Seite 7 einer Trefferliste mit drei Seiten.
  if (Object.keys(aenderungen).some((schluessel) => schluessel !== 'seite')) {
    params.delete('seite');
  }

  const text = params.toString();
  return text ? `?${text}` : '';
}
