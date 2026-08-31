/**
 * Vollstaendigkeit -- und vor allem: was sich darueber NICHT sagen laesst.
 *
 * Vorgabe 24 lautet: keine vorgetaeuschte Vollstaendigkeit. Das ist keine
 * Formulierungsfrage, sondern eine Rechenfrage. Eine Quote braucht einen
 * Nenner. Wer nicht weiss, wie viele Motorcodes eine Baureihe hatte, kann
 * nicht sagen, wie viele Prozent davon erfasst sind -- und eine Zahl, die
 * dennoch dasteht, wird geglaubt.
 *
 * Deshalb rechnet dieses Modul eine Quote nur, wenn eine bekannte Gesamtzahl
 * MIT QUELLE hinterlegt ist (CatalogExpectation). Sonst gibt es die
 * erfasste Anzahl und den ausdruecklichen Satz, dass die Gesamtzahl nicht
 * belegt ist.
 */

export const CompletenessAspect = {
  MODEL: 'MODEL',
  GENERATION: 'GENERATION',
  FACELIFT: 'FACELIFT',
  MODEL_YEAR: 'MODEL_YEAR',
  ENGINE: 'ENGINE',
  POWERTRAIN: 'POWERTRAIN',
  OPTION: 'OPTION',
  OPTION_CODE: 'OPTION_CODE',
  PACKAGE: 'PACKAGE',
  PAINT: 'PAINT',
  WHEEL: 'WHEEL',
  SPECIAL_EDITION: 'SPECIAL_EDITION',
  IMAGE: 'IMAGE',
  SOURCE: 'SOURCE',
} as const;

export type CompletenessAspect =
  (typeof CompletenessAspect)[keyof typeof CompletenessAspect];

export const COMPLETENESS_ASPECTS: CompletenessAspect[] = [
  'MODEL',
  'GENERATION',
  'FACELIFT',
  'MODEL_YEAR',
  'ENGINE',
  'POWERTRAIN',
  'OPTION',
  'OPTION_CODE',
  'PACKAGE',
  'PAINT',
  'WHEEL',
  'SPECIAL_EDITION',
  'IMAGE',
  'SOURCE',
];

export const ASPECT_LABELS: Record<CompletenessAspect, string> = {
  MODEL: 'Modelle',
  GENERATION: 'Generationen',
  FACELIFT: 'Facelift-Phasen',
  MODEL_YEAR: 'Modelljahre',
  ENGINE: 'Motoren (Motorcodes)',
  POWERTRAIN: 'Motor-Fahrzeug-Zuordnungen',
  OPTION: 'Ausstattungen',
  OPTION_CODE: 'Ausstattungscodes',
  PACKAGE: 'Ausstattungspakete',
  PAINT: 'Lackfarben',
  WHEEL: 'Radvarianten',
  SPECIAL_EDITION: 'Sondermodelle',
  IMAGE: 'Bilder mit belegter Herkunft',
  SOURCE: 'Quellenangaben',
};

export function istAspekt(wert: string): wert is CompletenessAspect {
  return (COMPLETENESS_ASPECTS as string[]).includes(wert);
}

export interface CompletenessInput {
  aspect: CompletenessAspect;
  /** Wie viele Datensaetze tatsaechlich erfasst sind. */
  recorded: number;
  /**
   * Bekannte Gesamtzahl -- nur wenn sie mit Quelle hinterlegt ist.
   * `null` heisst nicht "null Stueck", sondern "nicht belegt".
   */
  knownTotal?: number | null | undefined;
  /** Titel der Quelle der Gesamtzahl. */
  knownTotalSource?: string | null | undefined;
}

export interface CompletenessLine {
  aspect: CompletenessAspect;
  label: string;
  recorded: number;
  knownTotal: number | null;
  knownTotalSource: string | null;
  /** Anteil in Prozent, gerundet -- nur bei belegter Gesamtzahl. */
  percent: number | null;
  /** Der Satz, den die Oberflaeche anzeigt. Nie eine Behauptung ueber Rest. */
  statement: string;
}

/**
 * Eine Zeile des Vollstaendigkeitsberichts.
 *
 * Die Saetze hier sind Teil der Fachlogik und nicht der Oberflaeche: Sie
 * sind der Ort, an dem Vorgabe 24 tatsaechlich durchgesetzt wird. Waeren sie
 * in einer Komponente, koennte die naechste Komponente es anders machen.
 */
export function berechneZeile(eingabe: CompletenessInput): CompletenessLine {
  const label = ASPECT_LABELS[eingabe.aspect];
  const recorded = Math.max(0, Math.trunc(eingabe.recorded));
  const gesamt =
    typeof eingabe.knownTotal === 'number' && eingabe.knownTotal > 0
      ? Math.trunc(eingabe.knownTotal)
      : null;
  const quelle = eingabe.knownTotalSource?.trim() || null;

  // Eine belegte Gesamtzahl ohne Quellenangabe ist keine belegte Gesamtzahl.
  const belegt = gesamt !== null && quelle !== null;

  if (!belegt) {
    return {
      aspect: eingabe.aspect,
      label,
      recorded,
      knownTotal: null,
      knownTotalSource: null,
      percent: null,
      statement:
        `${recorded.toLocaleString('de-DE')} ${label} erfasst. ` +
        'Gesamtzahl nicht belegt — wie viele es insgesamt gibt, ist hier nicht hinterlegt.',
    };
  }

  const total = gesamt;
  const percent = Math.round((recorded / total) * 100);

  return {
    aspect: eingabe.aspect,
    label,
    recorded,
    knownTotal: total,
    knownTotalSource: quelle,
    percent,
    statement:
      `${recorded.toLocaleString('de-DE')} von ${total.toLocaleString('de-DE')} bekannten ` +
      `${label} erfasst (${percent} %). Gesamtzahl laut: ${quelle}.`,
  };
}

export function berechneBericht(eingaben: CompletenessInput[]): CompletenessLine[] {
  return eingaben.map(berechneZeile);
}

/**
 * Der Satz ueber den Gesamtbestand.
 *
 * Ausdruecklich ohne Gesamtquote: Aspekte verschiedener Groessenordnung zu
 * einer Zahl zu mitteln ergaebe eine Zahl, die nichts bedeutet.
 */
export function bestandsSatz(zeilen: CompletenessLine[]): string {
  const mitGesamtzahl = zeilen.filter((z) => z.knownTotal !== null);
  const ohne = zeilen.length - mitGesamtzahl.length;

  if (mitGesamtzahl.length === 0) {
    return (
      'Für keinen Bereich ist eine belegte Gesamtzahl hinterlegt. ' +
      'Der Bestand lässt sich deshalb nur als Anzahl angeben, nicht als Anteil.'
    );
  }
  if (ohne === 0) {
    return `Für alle ${zeilen.length} Bereiche liegt eine belegte Gesamtzahl vor.`;
  }
  return (
    `Für ${mitGesamtzahl.length} von ${zeilen.length} Bereichen liegt eine belegte ` +
    `Gesamtzahl vor. Bei den übrigen ${ohne} steht nur die erfasste Anzahl.`
  );
}
