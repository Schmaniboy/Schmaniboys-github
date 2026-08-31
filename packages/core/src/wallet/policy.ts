/**
 * Was kostet was.
 *
 * Die Preise stehen an einer Stelle und nicht verstreut in den Aufrufstellen.
 * Sonst kostet dieselbe Funktion an zwei Orten Verschiedenes, und niemand
 * merkt es.
 *
 * Die Betraege sind eine erste Festlegung und keine kaufmaennische
 * Entscheidung -- die steht noch aus. Wichtig ist hier die Struktur: dass
 * jede kostenpflichtige Funktion einen benannten Preis hat und keinen
 * beilaeufig hingeschriebenen.
 */

export const TokenCost = {
  /** Verkaufsanzeige aus bestaetigten Fahrzeugdaten erzeugen. */
  AI_LISTING_TEXT: 'ai.listing_text',
  /** Kurzfassung fuer Kleinanzeigen. */
  AI_SHORT_TEXT: 'ai.short_text',
  /** Fahrzeugbewertung. */
  VALUATION: 'valuation',
} as const;

export type TokenCost = (typeof TokenCost)[keyof typeof TokenCost];

const PREISE: Record<TokenCost, number> = {
  'ai.listing_text': 10,
  'ai.short_text': 3,
  valuation: 5,
};

export const COST_LABELS: Record<TokenCost, string> = {
  'ai.listing_text': 'Verkaufsanzeige erstellen',
  'ai.short_text': 'Kurzfassung erstellen',
  valuation: 'Fahrzeugbewertung',
};

export function priceOf(kind: TokenCost): number {
  return PREISE[kind];
}

export const ALL_TOKEN_COSTS = Object.keys(PREISE) as TokenCost[];

/**
 * Wie lange eine Reservierung gilt.
 *
 * Lang genug fuer einen langsamen KI-Aufruf, kurz genug, dass ein
 * haengengebliebener Vorgang das Guthaben nicht dauerhaft blockiert.
 */
export const HOLD_LIFETIME_SECONDS = 15 * 60;
