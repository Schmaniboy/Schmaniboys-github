import { extractWmi, vinCheckDigit, vinRegion } from '../validation/vin';

/**
 * VIN-Auswertung -- und ihre Grenzen.
 *
 * DAS WICHTIGSTE ZUERST (Blocker B7):
 *
 * Aus einer VIN sind zuverlaessig nur drei Dinge ableitbar:
 *   1. die Herstellerkennung (WMI, Stellen 1-3),
 *   2. ein Hinweis auf das Modelljahr (Stelle 10),
 *   3. der Werkscode (Stelle 11).
 *
 * NICHT ableitbar sind Modell, Generation, Motor und Ausstattung. Diese
 * Angaben stehen in herstellereigenen Datenbestaenden, nicht in der Nummer.
 * Wer sie trotzdem "erkennt", raet -- und Vorgabe C3 verbietet genau das.
 *
 * Deshalb heisst der Ablauf in dieser Anwendung "VIN schlaegt vor, Nutzer
 * bestaetigt" und nicht "VIN erkennt Fahrzeug".
 */

/**
 * Modelljahrcode an Stelle 10.
 *
 * ACHTUNG -- ZWEI EINSCHRAENKUNGEN:
 *
 * 1. Der Code wiederholt sich alle 30 Jahre. "F" heisst 1985 ODER 2015.
 *    Deshalb liefert diese Funktion Kandidaten, keinen Wert.
 *
 * 2. Die Belegung von Stelle 10 ist in Nordamerika vorgeschrieben
 *    (49 CFR 565), in Europa NICHT. Viele europaeische Hersteller halten
 *    sich daran, manche nicht. Ein Ergebnis ist also ein Hinweis, keine
 *    Tatsache -- und wird auch so gekennzeichnet.
 */
const MODELLJAHR_CODES = 'ABCDEFGHJKLMNPRSTVWXY123456789';

/** Erstes Jahr des aktuellen 30-Jahre-Zyklus im Code-Alphabet. */
const ZYKLUS_START = 1980;
const ZYKLUS_LAENGE = 30;

export interface VinDecoding {
  vin: string;
  /** Weltweite Herstellerkennung, Stellen 1-3. */
  wmi: string;
  /** Herkunftsregion nach ISO 3780, aus Stelle 1. */
  region: string | null;
  /** Ergebnis der Pruefziffer an Stelle 9. */
  checkDigit: 'valid' | 'invalid' | 'not-applicable';
  /**
   * Moegliche Modelljahre aus Stelle 10, aufsteigend.
   * Leer, wenn die Stelle keinen gueltigen Code enthaelt.
   */
  modelYearCandidates: number[];
  /** Zuverlaessigkeit der Modelljahrangabe. */
  modelYearReliability: 'convention' | 'unknown';
  /** Werkscode, Stelle 11. Ohne Herstellertabelle nicht auflösbar. */
  plantCode: string | null;
  /** Fortlaufende Nummer, Stellen 12-17. */
  serialNumber: string;
}

/**
 * Wertet eine bereits gepruefte VIN aus.
 *
 * Erwartet 17 gueltige Zeichen in Grossschreibung -- die Formpruefung macht
 * `vin` aus `validation/vin.ts`.
 */
export function decodeVin(value: string, now: Date = new Date()): VinDecoding {
  const normalisiert = value.trim().toUpperCase();

  return {
    vin: normalisiert,
    wmi: extractWmi(normalisiert),
    region: vinRegion(normalisiert),
    checkDigit: vinCheckDigit(normalisiert),
    modelYearCandidates: modelYearCandidates(normalisiert.charAt(9), now),
    modelYearReliability: istNordamerikanisch(normalisiert) ? 'convention' : 'unknown',
    plantCode: normalisiert.charAt(10) || null,
    serialNumber: normalisiert.slice(11),
  };
}

/**
 * Moegliche Modelljahre zu einem Code.
 *
 * Gibt bis zu zwei Kandidaten zurueck -- den aktuellen Zyklus und den
 * vorherigen. Jahre in der Zukunft werden weggelassen: Ein Fahrzeug, das es
 * noch nicht gibt, steht auch nicht zum Verkauf.
 */
export function modelYearCandidates(code: string, now: Date = new Date()): number[] {
  const index = MODELLJAHR_CODES.indexOf(code.toUpperCase());
  if (index === -1) return [];

  const grenze = now.getUTCFullYear() + 1;
  const kandidaten: number[] = [];

  for (let zyklus = 0; zyklus < 4; zyklus += 1) {
    const jahr = ZYKLUS_START + index + zyklus * ZYKLUS_LAENGE;
    if (jahr <= grenze) kandidaten.push(jahr);
  }

  // Die zwei jüngsten Kandidaten genuegen: Aeltere Fahrzeuge sind selten und
  // dann ohnehin bestaetigungspflichtig.
  return kandidaten.slice(-2);
}

/**
 * Nur fuer nordamerikanische Fahrzeuge ist die Belegung von Stelle 10
 * vorgeschrieben. Ueberall sonst ist sie ueblich, aber nicht verbindlich.
 */
function istNordamerikanisch(vin: string): boolean {
  return ['1', '4', '5'].includes(vin.charAt(0));
}

/**
 * Beschreibt in einem Satz, was aus dieser VIN ablesbar ist -- und was nicht.
 * Wird dem Nutzer angezeigt, damit die Grenze nicht nur in der Dokumentation
 * steht.
 */
export function describeDecoding(decoding: VinDecoding): string {
  const teile: string[] = [`Herstellerkennung ${decoding.wmi}`];

  if (decoding.region) teile.push(`Herkunft ${decoding.region}`);

  if (decoding.modelYearCandidates.length === 1) {
    teile.push(`Modelljahr vermutlich ${decoding.modelYearCandidates[0]}`);
  } else if (decoding.modelYearCandidates.length > 1) {
    teile.push(`Modelljahr ${decoding.modelYearCandidates.join(' oder ')}`);
  }

  return `${teile.join(' · ')}. Modell, Motor und Ausstattung stehen nicht in der VIN und müssen bestätigt werden.`;
}
