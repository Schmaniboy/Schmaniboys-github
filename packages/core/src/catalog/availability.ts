import { errors } from '../errors';

/**
 * In welcher Form es eine Ausstattung gab.
 *
 * Das ist die wichtigste Unterscheidung im ganzen Katalog. Vorher stand dort
 * ein Wahrheitswert `standard`, und der kannte genau zwei Zustaende: Serie
 * und nicht Serie. Damit fielen vier verschiedene Sachverhalte zusammen --
 * Aufpreisausstattung, reine Paketbestandteile, Sondermodell-Ausstattung und
 * marktabhaengige Ausstattung.
 *
 * Beim Gebrauchtkauf ist genau das der Unterschied, auf den es ankommt:
 * "Xenon war Serie" fuehrt zu einem Fahrzeug, das der Kaeufer ungeprueft
 * kauft. "Xenon gab es nur im Paket Licht, ab Modelljahr 2012, nicht in
 * Nordamerika" fuehrt dazu, dass er nachsieht.
 */
export const AvailabilityKind = {
  STANDARD: 'STANDARD',
  OPTIONAL: 'OPTIONAL',
  PACKAGE_ONLY: 'PACKAGE_ONLY',
  SPECIAL_EDITION_ONLY: 'SPECIAL_EDITION_ONLY',
  MARKET_SPECIFIC: 'MARKET_SPECIFIC',
} as const;

export type AvailabilityKind = (typeof AvailabilityKind)[keyof typeof AvailabilityKind];

/** Als Tupel fuer zod. Muss dieselben Werte tragen wie die Aufzaehlung oben. */
export const AVAILABILITY_KIND_VALUES = [
  'STANDARD',
  'OPTIONAL',
  'PACKAGE_ONLY',
  'SPECIAL_EDITION_ONLY',
  'MARKET_SPECIFIC',
] as const;

export const AVAILABILITY_KINDS: AvailabilityKind[] = [
  'STANDARD',
  'OPTIONAL',
  'PACKAGE_ONLY',
  'SPECIAL_EDITION_ONLY',
  'MARKET_SPECIFIC',
];

/**
 * Kurzbezeichnung, Erklaerung und Farbzeichen je Art.
 *
 * Das Zeichen ist eine Farbe, kein Bild -- die Oberflaeche stellt es als
 * farbigen Punkt dar. Ein reines Farbsignal waere fuer farbfehlsichtige
 * Leser nutzlos, deshalb steht die Bezeichnung immer daneben und nie
 * stattdessen.
 */
export interface AvailabilityDescriptor {
  label: string;
  short: string;
  explanation: string;
  /** Farbrolle im Designsystem, nicht der Farbwert selbst. */
  tone: 'neutral' | 'accent' | 'positive' | 'caution' | 'critical';
}

export const AVAILABILITY_LABELS: Record<AvailabilityKind, AvailabilityDescriptor> = {
  STANDARD: {
    label: 'Serienmäßig',
    short: 'Serie',
    explanation:
      'Ohne Aufpreis enthalten. Jedes Fahrzeug dieser Auswahl hat es ab Werk.',
    tone: 'positive',
  },
  OPTIONAL: {
    label: 'Sonderausstattung',
    short: 'Aufpreis',
    explanation:
      'Einzeln bestellbar gegen Aufpreis. Ob ein bestimmtes Fahrzeug es hat, ist damit offen — das muss am Fahrzeug geprüft werden.',
    tone: 'neutral',
  },
  PACKAGE_ONLY: {
    label: 'Nur im Paket',
    short: 'Paket',
    explanation:
      'Einzeln nicht bestellbar. Nur wer das genannte Paket geordert hat, hat es — und dann meist noch weitere Ausstattung dazu.',
    tone: 'accent',
  },
  SPECIAL_EDITION_ONLY: {
    label: 'Nur im Sondermodell',
    short: 'Sondermodell',
    explanation:
      'An eine Sonderserie gebunden. Außerhalb dieser Serie war es ab Werk nicht zu bekommen.',
    tone: 'caution',
  },
  MARKET_SPECIFIC: {
    label: 'Marktabhängig',
    short: 'marktabhängig',
    explanation:
      'Je nach Auslieferungsland verschieden — in manchen Märkten Serie, in anderen gar nicht erhältlich. Bei Importfahrzeugen besonders zu beachten.',
    tone: 'critical',
  },
};

export const PriceSourceType = {
  PRICE_LIST: 'PRICE_LIST',
  CONFIGURATOR: 'CONFIGURATOR',
  DEALER_QUOTE: 'DEALER_QUOTE',
  PRESS: 'PRESS',
  COMMUNITY: 'COMMUNITY',
  OTHER: 'OTHER',
} as const;

export type PriceSourceType = (typeof PriceSourceType)[keyof typeof PriceSourceType];

export const PRICE_SOURCE_LABELS: Record<PriceSourceType, string> = {
  PRICE_LIST: 'Preisliste',
  CONFIGURATOR: 'Konfigurator',
  DEALER_QUOTE: 'Händler',
  PRESS: 'Fachpresse',
  COMMUNITY: 'Community',
  OTHER: 'Sonstiges',
};

/** Gilt diese Ausstattung hier als ohne Aufpreis enthalten? */
export function istSerie(kind: AvailabilityKind): boolean {
  return kind === AvailabilityKind.STANDARD;
}

/**
 * Muss das Fahrzeug einzeln geprueft werden, um die Frage zu beantworten?
 *
 * Alles ausser Serie. Diese Funktion steuert, ob die Oberflaeche einen
 * Pruefhinweis setzt -- sie ist der Grund, warum eine falsche Einordnung als
 * Serie folgenschwer ist: sie unterdrueckt den Hinweis.
 */
export function pruefungNoetig(kind: AvailabilityKind): boolean {
  return kind !== AvailabilityKind.STANDARD;
}

export interface AvailabilityForCheck {
  kind: AvailabilityKind;
  packageId?: string | null | undefined;
  specialEditionId?: string | null | undefined;
  marketRegion?: string | null | undefined;
  surchargeCents?: number | null | undefined;
}

/**
 * Widersprueche zwischen Art und Zusatzangaben abfangen.
 *
 * Diese Pruefungen greifen beim Erfassen, nicht beim Anzeigen. Eine Zeile,
 * die "nur im Paket" sagt und kein Paket nennt, ist keine Auskunft, sondern
 * eine offene Frage -- und sie faellt spaeter niemandem mehr auf.
 */
export function pruefeVerfuegbarkeitStimmig(
  wert: AvailabilityForCheck,
): Record<string, string[]> {
  const fehler: Record<string, string[]> = {};

  if (wert.kind === AvailabilityKind.PACKAGE_ONLY && !wert.packageId) {
    fehler.packageId = [
      'Bei „nur im Paket" muss das Paket genannt sein. Ohne Paketangabe ist die Auskunft wertlos.',
    ];
  }
  if (wert.kind === AvailabilityKind.SPECIAL_EDITION_ONLY && !wert.specialEditionId) {
    fehler.specialEditionId = [
      'Bei „nur im Sondermodell" muss das Sondermodell genannt sein.',
    ];
  }
  if (wert.kind === AvailabilityKind.MARKET_SPECIFIC && !wert.marketRegion?.trim()) {
    fehler.marketRegion = [
      'Bei „marktabhängig" muss stehen, für welchen Markt die Angabe gilt. Sonst ist der Hinweis nicht verwertbar.',
    ];
  }
  if (wert.kind === AvailabilityKind.STANDARD && wert.packageId) {
    fehler.kind = [
      'Serienmäßig und zugleich an ein Aufpreispaket gebunden schließen sich aus.',
    ];
  }
  if (wert.kind === AvailabilityKind.STANDARD && (wert.surchargeCents ?? 0) > 0) {
    fehler.surchargeCents = [
      'Serienmäßige Ausstattung hat keinen Aufpreis. Entweder war sie nicht Serie, oder der Aufpreis gehört zu einer anderen Zeile.',
    ];
  }

  return fehler;
}

/** Dieselbe Pruefung, aber mit Abbruch. Fuer Schreibwege. */
export function assertVerfuegbarkeitStimmig(wert: AvailabilityForCheck): void {
  const fehler = pruefeVerfuegbarkeitStimmig(wert);
  if (Object.keys(fehler).length > 0) throw errors.validation(fehler);
}

/**
 * Zusammenfassung mehrerer Verfuegbarkeitszeilen zu einer Aussage.
 *
 * Eine Ausstattung kann in derselben Generation mehrfach vorkommen: Serie in
 * der oberen Linie, Aufpreis in der Basis. Die Zusammenfassung darf daraus
 * NICHT "war Serie" machen. Sie nennt die guenstigste Form und sagt
 * ausdruecklich, dass es davon abhaengt.
 */
export interface AvailabilitySummary {
  /** Die fuer den Kaeufer guenstigste vorkommende Art. */
  best: AvailabilityKind;
  /** Alle vorkommenden Arten, ohne Doppelung, in fester Reihenfolge. */
  kinds: AvailabilityKind[];
  /** Haengt es von Linie, Motor, Baujahr oder Markt ab? */
  varies: boolean;
  /** Ein Satz, der beides zusammen ausdrueckt. */
  statement: string;
}

/**
 * Rangfolge fuer den Kaeufer: Serie ist am guenstigsten, marktabhaengig am
 * unsichersten.
 *
 * Ausgefuehrt (nicht modulintern), weil die Datenschicht sie beim
 * Zusammenfassen mehrfacher Zeilen ebenfalls braucht. Eine zweite Kopie dort
 * waere genau die Art Doppelung, die irgendwann auseinanderlaeuft -- und
 * dann waehlt der Ausstattungschecker eine andere Zeile als die Anzeige.
 */
export const AVAILABILITY_RANK: Record<AvailabilityKind, number> = {
  STANDARD: 0,
  OPTIONAL: 1,
  PACKAGE_ONLY: 2,
  SPECIAL_EDITION_ONLY: 3,
  MARKET_SPECIFIC: 4,
};

const RANG = AVAILABILITY_RANK;

export function fasseVerfuegbarkeitZusammen(
  zeilen: { kind: AvailabilityKind }[],
): AvailabilitySummary | null {
  if (zeilen.length === 0) return null;

  const kinds = AVAILABILITY_KINDS.filter((art) => zeilen.some((z) => z.kind === art));
  const best = kinds.reduce((a, b) => (RANG[a] <= RANG[b] ? a : b));
  const varies = kinds.length > 1;

  const statement = varies
    ? `${AVAILABILITY_LABELS[best].label} — aber nicht durchgehend: je nach Ausstattungslinie, Motor, Baujahr oder Markt auch ${kinds
        .filter((art) => art !== best)
        .map((art) => AVAILABILITY_LABELS[art].label.toLowerCase())
        .join(' bzw. ')}. Am Fahrzeug prüfen.`
    : AVAILABILITY_LABELS[best].explanation;

  return { best, kinds, varies, statement };
}
