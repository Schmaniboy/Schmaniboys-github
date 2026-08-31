import { z } from 'zod';

/**
 * VIN-Pruefung nach ISO 3779 / ISO 3780.
 *
 * WICHTIG (Vorgabe C3, keine erfundenen Daten): Aus einer VIN lassen sich
 * zuverlaessig nur Herstellerkennung (WMI), Modelljahrcode und Werkscode
 * ableiten. Modell, Generation und Motorcode sind NICHT aus der VIN
 * berechenbar -- dafuer braucht es herstellerspezifische Datenbestaende.
 * Diese Datei leitet daher bewusst nichts ab, was sie nicht belegen kann.
 */

/** I, O und Q sind in der VIN nicht zulaessig (Verwechslung mit 1 und 0). */
const VIN_ALPHABET = /^[A-HJ-NPR-Z0-9]{17}$/;

export const vin = z
  .string()
  .trim()
  .toUpperCase()
  .length(17, 'Eine VIN hat genau 17 Zeichen.')
  .regex(VIN_ALPHABET, 'Die VIN enthaelt unzulaessige Zeichen (I, O und Q kommen nicht vor).');

const TRANSLITERATION: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8,
  J: 1, K: 2, L: 3, M: 4, N: 5, P: 7, R: 9,
  S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9,
};

const WEIGHTS = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];

/**
 * Pruefziffernvalidierung (Stelle 9).
 *
 * Achtung: Diese Pruefziffer ist in Nordamerika vorgeschrieben, in Europa
 * jedoch nicht. Eine europaeische VIN kann formal korrekt sein und die
 * Pruefziffer trotzdem nicht erfuellen. Ergebnis deshalb dreiwertig.
 */
export function vinCheckDigit(value: string): 'valid' | 'invalid' | 'not-applicable' {
  if (!VIN_ALPHABET.test(value)) return 'invalid';

  let sum = 0;
  for (let index = 0; index < 17; index += 1) {
    const character = value[index] as string;
    const numeric = /[0-9]/.test(character)
      ? Number(character)
      : TRANSLITERATION[character];
    if (numeric === undefined) return 'invalid';
    sum += numeric * (WEIGHTS[index] as number);
  }

  const remainder = sum % 11;
  const expected = remainder === 10 ? 'X' : String(remainder);
  if (value[8] === expected) return 'valid';

  // Europaeische Hersteller fuehren die Pruefziffer haeufig nicht.
  const wmi = value.slice(0, 1);
  const isNorthAmerican = ['1', '4', '5'].includes(wmi);
  return isNorthAmerican ? 'invalid' : 'not-applicable';
}

/** Weltweite Herstellerkennung -- die ersten drei Zeichen. */
export function extractWmi(value: string): string {
  return value.slice(0, 3).toUpperCase();
}

/**
 * Herkunftsregion aus dem ersten Zeichen. Das ist in ISO 3780 festgelegt und
 * damit belegbar -- im Gegensatz zur Marke, die eine Zuordnungstabelle braucht.
 */
export function vinRegion(value: string): string | null {
  const first = value.charAt(0).toUpperCase();
  if (/[A-H]/.test(first)) return 'Afrika';
  if (/[J-R]/.test(first)) return 'Asien';
  if (/[S-Z]/.test(first)) return 'Europa';
  if (/[1-5]/.test(first)) return 'Nordamerika';
  if (/[6-7]/.test(first)) return 'Ozeanien';
  if (/[8-9]/.test(first)) return 'Suedamerika';
  return null;
}
