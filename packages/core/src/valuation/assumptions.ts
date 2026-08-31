/**
 * Annahmen der Bewertung.
 *
 * Jede Zahl hier ist eine ANNAHME DER PLATTFORM, kein gemessener Marktwert.
 * Sie steht deshalb an einer einzigen Stelle, ist benannt, versioniert und
 * wird in jeder Bewertung mit ausgegeben -- wer das Ergebnis liest, sieht,
 * womit gerechnet wurde.
 *
 * Was hier ausdruecklich NICHT steht: ein Fahrzeugwert in Euro. Ein
 * Grundwert laesst sich nicht annehmen; er muss aus tatsaechlichen
 * Marktdaten kommen (siehe ports/market-data.ts, Blocker B4). Ohne
 * Grundwert gibt diese Bewertung keine Eurobetraege aus -- sie nennt die
 * Faktoren und sagt, warum die Zahl fehlt.
 */

export interface ValuationAssumptions {
  /** Kennung, damit eine gespeicherte Bewertung nachvollziehbar bleibt. */
  readonly id: string;
  /**
   * Angenommene Jahresfahrleistung in Kilometern. Dient nur dazu, einen
   * Kilometerstand als "ueber" oder "unter" dem Erwartbaren einzuordnen.
   */
  readonly expectedAnnualKm: number;
  /** Zuschlag je 10.000 km unter der Erwartung, als Anteil (0.02 = 2 %). */
  readonly perTenThousandKmBelow: number;
  /** Abschlag je 10.000 km ueber der Erwartung. */
  readonly perTenThousandKmAbove: number;
  /** Grenze, ab der die Kilometerkorrektur nicht weiter waechst. */
  readonly mileageCap: number;
  /** Zu- und Abschlaege je Zustandsstufe. */
  readonly condition: Readonly<Record<string, number>>;
  /** Zu- und Abschlaege je Servicehistorie. */
  readonly serviceHistory: Readonly<Record<string, number>>;
  /** Abschlag je Vorbesitzer ab dem dritten. */
  readonly perOwnerAboveTwo: number;
  /** Untergrenze der Vorbesitzerkorrektur. */
  readonly ownerCap: number;
  /** Abschlag bei abgelaufener Hauptuntersuchung. */
  readonly huExpired: number;
  /** Zuschlag bei HU mit mindestens zwoelf Monaten Restlaufzeit. */
  readonly huLongValid: number;
  /** Abschlag bei angegebenem Unfallschaden. */
  readonly accident: number;
  /** Abschlag bei angegebenen Schaeden ohne Unfall. */
  readonly damages: number;
  /** Gesamtgrenze nach oben und unten, damit sich Faktoren nicht aufschaukeln. */
  readonly totalUpperBound: number;
  readonly totalLowerBound: number;
}

/**
 * Voreinstellung.
 *
 * Die Werte sind bewusst zurueckhaltend gewaehlt und als Annahme
 * gekennzeichnet. Sie ersetzen keine Marktbeobachtung -- sie ordnen ein
 * Fahrzeug relativ zu einem Grundwert ein, den jemand anderes liefern muss.
 */
export const DEFAULT_ASSUMPTIONS: ValuationAssumptions = {
  id: 'plattform-annahmen-v1',
  expectedAnnualKm: 15_000,
  perTenThousandKmBelow: 0.02,
  perTenThousandKmAbove: 0.025,
  mileageCap: 0.2,
  condition: {
    EXCELLENT: 0.05,
    GOOD: 0,
    FAIR: -0.05,
    POOR: -0.2,
  },
  serviceHistory: {
    FULL_MANUFACTURER: 0.05,
    FULL_INDEPENDENT: 0.03,
    PARTIAL: 0,
    NONE: -0.05,
    UNKNOWN: -0.03,
  },
  perOwnerAboveTwo: -0.015,
  ownerCap: -0.06,
  huExpired: -0.04,
  huLongValid: 0.02,
  accident: -0.15,
  damages: -0.05,
  totalUpperBound: 0.25,
  totalLowerBound: -0.45,
};

/**
 * Erklaerung der Annahmen im Klartext, zur Ausgabe neben dem Ergebnis.
 *
 * Ohne diesen Text waere die Bewertung eine Zahl ohne Herkunft -- genau das,
 * wogegen sich der ganze Rest dieser Anwendung wendet.
 */
export function describeAssumptions(a: ValuationAssumptions): string[] {
  return [
    `Erwartete Fahrleistung: ${a.expectedAnnualKm.toLocaleString('de-DE')} km im Jahr.`,
    `Kilometerabweichung: ${(a.perTenThousandKmBelow * 100).toFixed(1)} % Zuschlag je ` +
      `10.000 km darunter, ${(a.perTenThousandKmAbove * 100).toFixed(1)} % Abschlag je ` +
      `10.000 km darüber, begrenzt auf ${(a.mileageCap * 100).toFixed(0)} %.`,
    `Unfallschaden: ${(a.accident * 100).toFixed(0)} %.`,
    `Gesamtkorrektur begrenzt auf ${(a.totalLowerBound * 100).toFixed(0)} % bis ` +
      `+${(a.totalUpperBound * 100).toFixed(0)} %.`,
    'Diese Werte sind Annahmen der Plattform, keine gemessenen Marktwerte.',
  ];
}
