import { errors } from '../errors';

/**
 * Rechnungsnummern.
 *
 * Eine Rechnungsnummer muss eindeutig und fortlaufend sein. "Fortlaufend"
 * heisst hier: aus einem Zaehler, der nur hochgeht -- nicht aus einem
 * Zufallswert und nicht aus einem Zeitstempel.
 *
 * Der Zaehler laeuft je Jahr, damit die Nummern nicht ins Unermessliche
 * wachsen und sich der Zeitraum ablesen laesst. Der Jahreswechsel ist die
 * einzige Stelle, an der er zurueckgesetzt wird.
 *
 * Was hier NICHT behauptet wird: dass dieses Format irgendeine rechtliche
 * Anforderung erfuellt. Es ist ein Format, das sich anpassen laesst -- genau
 * das verlangt der Plan.
 */

export const RECHNUNGS_PRAEFIX = 'AP';

/** Stellen des laufenden Teils. Fuenf reichen fuer 99.999 Rechnungen im Jahr. */
const STELLEN = 5;

export function baueRechnungsnummer(jahr: number, laufend: number): string {
  if (!Number.isInteger(jahr) || jahr < 2000 || jahr > 9999) {
    throw errors.validation({ jahr: ['Das Rechnungsjahr ist nicht plausibel.'] });
  }
  if (!Number.isInteger(laufend) || laufend < 1) {
    throw errors.validation({ laufend: ['Die laufende Nummer beginnt bei 1.'] });
  }
  if (laufend >= 10 ** STELLEN) {
    throw errors.conflict(
      `Für ${jahr} sind mehr als ${10 ** STELLEN - 1} Rechnungen angefallen. Das Format ` +
        'der Rechnungsnummer muss erweitert werden, bevor weitere entstehen.',
    );
  }

  return `${RECHNUNGS_PRAEFIX}-${jahr}-${String(laufend).padStart(STELLEN, '0')}`;
}

/** Zerlegt eine Rechnungsnummer wieder. Null, wenn sie nicht dem Format folgt. */
export function leseRechnungsnummer(
  nummer: string,
): { jahr: number; laufend: number } | null {
  const treffer = new RegExp(`^${RECHNUNGS_PRAEFIX}-(\\d{4})-(\\d{${STELLEN},})$`).exec(
    nummer.trim(),
  );
  if (!treffer) return null;
  return { jahr: Number(treffer[1]), laufend: Number(treffer[2]) };
}
