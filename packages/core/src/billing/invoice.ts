import { errors } from '../errors';

/**
 * Rechnungsberechnung.
 *
 * Zwei Festlegungen, die alles andere bestimmen:
 *
 * 1. **Gerechnet wird in Cent, als ganze Zahl.** Gleitkommazahlen luegen bei
 *    Geld: 0.1 + 0.2 ist dort nicht 0.3. Bei einer Rechnung faellt das
 *    irgendwann auf, und dann ist es ein Buchhaltungsfehler.
 * 2. **Der Steuersatz ist eine Konfiguration, keine Konstante.** Er steht
 *    auf jeder Rechnung und wird mit ihr gespeichert -- eine spaetere
 *    Aenderung darf alte Rechnungen nicht umschreiben.
 *
 * Was dieses Modul ausdruecklich NICHT tut: steuerliche Richtigkeit
 * zusichern. Es rechnet, was ihm gesagt wird, und macht die Bestandteile
 * sichtbar. Ob eine Rechnung den Anforderungen genuegt, entscheidet nicht
 * dieser Code.
 */

export interface InvoiceLine {
  /** Bezeichnung der Position, wie sie auf der Rechnung steht. */
  description: string;
  quantity: number;
  /** Einzelpreis netto in Cent. */
  unitNetCents: number;
}

export interface TaxTreatment {
  /** Steuersatz in Basispunkten: 1900 = 19,00 %. Ganzzahlig, siehe oben. */
  rateBasisPoints: number;
  /**
   * Hinweis, der auf die Rechnung gehoert -- etwa zur Steuerschuldnerschaft
   * des Leistungsempfaengers oder zur Kleinunternehmerregelung. Wird
   * uebergeben, nicht hier entschieden.
   */
  note: string | null;
}

export interface InvoiceTotals {
  netCents: number;
  taxCents: number;
  grossCents: number;
  rateBasisPoints: number;
}

export interface CalculatedInvoice {
  lines: (InvoiceLine & { lineNetCents: number })[];
  totals: InvoiceTotals;
  taxNote: string | null;
}

/**
 * Kaufmaennisch runden.
 *
 * `Math.round` rundet -0,5 zur Null hin und ist damit fuer Betraege nicht
 * brauchbar. Hier wird der Betrag immer vom Nullpunkt weg gerundet.
 */
export function rundeCent(betrag: number): number {
  return betrag < 0 ? -Math.round(-betrag) : Math.round(betrag);
}

export function berechneRechnung(
  lines: InvoiceLine[],
  tax: TaxTreatment,
): CalculatedInvoice {
  if (lines.length === 0) {
    throw errors.validation({ lines: ['Eine Rechnung ohne Positionen gibt es nicht.'] });
  }
  if (tax.rateBasisPoints < 0 || tax.rateBasisPoints > 10_000) {
    throw errors.validation({
      rateBasisPoints: ['Der Steuersatz muss zwischen 0 und 100 Prozent liegen.'],
    });
  }

  const berechnet = lines.map((line) => {
    if (!Number.isInteger(line.unitNetCents) || line.unitNetCents < 0) {
      throw errors.validation({
        unitNetCents: ['Beträge werden in ganzen Cent angegeben und sind nicht negativ.'],
      });
    }
    if (!Number.isInteger(line.quantity) || line.quantity <= 0) {
      throw errors.validation({ quantity: ['Die Menge muss eine ganze Zahl größer null sein.'] });
    }
    return { ...line, lineNetCents: line.unitNetCents * line.quantity };
  });

  const netCents = berechnet.reduce((summe, line) => summe + line.lineNetCents, 0);

  /*
   * Die Steuer wird auf die SUMME gerechnet, nicht je Position und dann
   * addiert. Beides ist vertretbar, aber die Ergebnisse unterscheiden sich um
   * Cent-Betraege -- und wer beides mischt, bekommt Rechnungen, deren Summe
   * nicht aufgeht.
   */
  const taxCents = rundeCent((netCents * tax.rateBasisPoints) / 10_000);

  return {
    lines: berechnet,
    totals: {
      netCents,
      taxCents,
      grossCents: netCents + taxCents,
      rateBasisPoints: tax.rateBasisPoints,
    },
    taxNote: tax.note,
  };
}

/** Betrag als Text, fuer Anzeige und Rechnung. */
export function formatiereCent(cents: number): string {
  return (cents / 100).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
}

export function formatiereSteuersatz(basisPoints: number): string {
  return `${(basisPoints / 100).toLocaleString('de-DE', { maximumFractionDigits: 2 })} %`;
}
