/**
 * Zugang zu Marktdaten fuer die Fahrzeugbewertung.
 *
 * Blocker B4: Es ist keine Quelle fuer Vergleichsangebote festgelegt. Diese
 * Schnittstelle existiert trotzdem, damit die Bewertung fertig gebaut werden
 * kann -- und damit spaeter nur ein Adapter dazukommt, nicht ein Umbau.
 *
 * Die wichtigste Regel steht im Typ: Ein Grundwert kommt IMMER mit seiner
 * Herkunft. Stichprobengroesse, Beobachtungszeitraum und Quellenbezeichnung
 * sind Pflichtfelder, keine Zusatzangaben. Ein Marktwert ohne diese Angaben
 * waere eine Behauptung.
 */

export interface ComparableQuery {
  manufacturerName: string;
  modelName: string;
  generationId: string;
  /** Motorvariante, sofern bestaetigt. Ohne sie ist die Stichprobe gemischt. */
  powertrainId: string | null;
  firstRegistrationYear: number | null;
  mileageKm: number | null;
}

/** Ein Grundwert samt allem, was noetig ist, um ihn einzuordnen. */
export interface MarketBasis {
  /** Mittlerer Angebotswert in Cent. Cent, weil Gleitkommazahlen bei Geld luegen. */
  medianCents: number;
  /** Unteres und oberes Quartil in Cent. Die Spanne ist Teil der Aussage. */
  lowerQuartileCents: number;
  upperQuartileCents: number;
  /** Wie viele Angebote in den Wert eingegangen sind. */
  sampleSize: number;
  /** Zeitraum der Beobachtung. */
  observedFrom: Date;
  observedTo: Date;
  /** Woher die Daten stammen, im Klartext fuer die Anzeige. */
  sourceLabel: string;
  /**
   * Ob es sich um Angebotspreise oder um erzielte Verkaufspreise handelt.
   * Angebotspreise liegen ueber den erzielten -- wer das verschweigt,
   * schoenrechnet.
   */
  priceKind: 'ASKING' | 'ACHIEVED';
}

export interface MarketDataSource {
  /** Ob eine Quelle eingerichtet ist. Wird vor jeder Bewertung geprueft. */
  isAvailable(): boolean;
  /**
   * Grundwert zu einer Anfrage. `null` heisst: keine ausreichende
   * Stichprobe -- nicht "Wert ist null".
   */
  findBasis(query: ComparableQuery): Promise<MarketBasis | null>;
}

/**
 * Ersatz, solange keine Quelle eingerichtet ist.
 *
 * Er wirft nicht, sondern meldet sich als nicht verfuegbar. Die Bewertung
 * laeuft dann trotzdem -- sie gibt die Faktorenanalyse aus und sagt
 * ausdruecklich, dass ein Marktwert fehlt. Eine Zahl zu erfinden waere die
 * einzige Antwort, die schlechter ist als keine Zahl.
 */
export class UnavailableMarketData implements MarketDataSource {
  readonly reason: string;

  constructor(
    reason = 'Für Vergleichsangebote ist keine Datenquelle eingerichtet (offener Punkt B4).',
  ) {
    this.reason = reason;
  }

  isAvailable(): boolean {
    return false;
  }

  async findBasis(): Promise<MarketBasis | null> {
    return null;
  }
}
