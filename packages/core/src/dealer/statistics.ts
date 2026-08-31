/**
 * Haendlerstatistik.
 *
 * Die Regel dieses Moduls: Eine Kennzahl, die sich nicht belegen laesst,
 * wird nicht ausgegeben -- auch nicht als 0. Eine Null sieht aus wie eine
 * Messung ("es gab keine Anfragen") und ist doch nur eine Luecke ("Anfragen
 * gibt es noch nicht"). Deshalb tragen die Kennzahlen einen Zustand mit.
 */

export type KennzahlZustand = 'GEMESSEN' | 'NICHT_VERFUEGBAR';

export interface Kennzahl {
  id: string;
  label: string;
  zustand: KennzahlZustand;
  /** Nur bei GEMESSEN gesetzt. */
  wert: number | null;
  /** Einheit oder Formatierungshinweis. */
  einheit: 'ANZAHL' | 'TAGE' | 'TOKENS' | 'EURO_CENT';
  /** Warum die Kennzahl fehlt, im Klartext. Nur bei NICHT_VERFUEGBAR. */
  hinweis?: string;
}

export interface BestandsZahlen {
  entwuerfe: number;
  aktiv: number;
  pausiert: number;
  verkauft: number;
  abgelaufen: number;
}

export interface StandzeitEingabe {
  /** Veroeffentlicht und verkauft: die abgeschlossenen Standzeiten in Tagen. */
  abgeschlosseneTage: number[];
  /** Noch laufende Anzeigen: Tage seit der Veroeffentlichung. */
  laufendeTage: number[];
}

/** Tage zwischen zwei Zeitpunkten, abgerundet. */
export function tageZwischen(von: Date, bis: Date): number {
  return Math.max(0, Math.floor((bis.getTime() - von.getTime()) / (24 * 60 * 60 * 1000)));
}

function median(werte: number[]): number | null {
  if (werte.length === 0) return null;
  const sortiert = [...werte].sort((links, rechts) => links - rechts);
  const mitte = Math.floor(sortiert.length / 2);
  if (sortiert.length % 2 === 1) return sortiert[mitte] ?? null;
  const links = sortiert[mitte - 1];
  const rechts = sortiert[mitte];
  if (links === undefined || rechts === undefined) return null;
  return Math.round((links + rechts) / 2);
}

export interface StatistikEingabe {
  bestand: BestandsZahlen;
  standzeit: StandzeitEingabe;
  /** Aufrufe aller Anzeigen des Haendlers. */
  aufrufe: number;
  /** Verbrauchte Tokens im Betrachtungszeitraum. */
  verbrauchteTokens: number;
  /** Wie viele KI-Texte erzeugt wurden. */
  kiTexte: number;
  /** Wie viele Bewertungen abgerufen wurden. */
  bewertungen: number;
}

export function baueStatistik(eingabe: StatistikEingabe): Kennzahl[] {
  const { bestand, standzeit } = eingabe;
  const bestandGesamt =
    bestand.entwuerfe + bestand.aktiv + bestand.pausiert + bestand.verkauft + bestand.abgelaufen;

  /*
   * Der Median, nicht der Mittelwert: Ein einzelnes Fahrzeug, das zwei Jahre
   * steht, verschoebe einen Mittelwert so weit, dass die Zahl nichts mehr
   * ueber den Normalfall sagt.
   */
  const medianAbgeschlossen = median(standzeit.abgeschlosseneTage);
  const medianLaufend = median(standzeit.laufendeTage);

  const kennzahlen: Kennzahl[] = [
    { id: 'bestand', label: 'Fahrzeuge insgesamt', zustand: 'GEMESSEN', wert: bestandGesamt, einheit: 'ANZAHL' },
    { id: 'aktiv', label: 'Aktive Anzeigen', zustand: 'GEMESSEN', wert: bestand.aktiv, einheit: 'ANZAHL' },
    { id: 'entwuerfe', label: 'Entwürfe', zustand: 'GEMESSEN', wert: bestand.entwuerfe, einheit: 'ANZAHL' },
    { id: 'pausiert', label: 'Pausiert', zustand: 'GEMESSEN', wert: bestand.pausiert, einheit: 'ANZAHL' },
    { id: 'verkauft', label: 'Verkauft', zustand: 'GEMESSEN', wert: bestand.verkauft, einheit: 'ANZAHL' },
    { id: 'abgelaufen', label: 'Abgelaufen', zustand: 'GEMESSEN', wert: bestand.abgelaufen, einheit: 'ANZAHL' },
    { id: 'aufrufe', label: 'Aufrufe aller Anzeigen', zustand: 'GEMESSEN', wert: eingabe.aufrufe, einheit: 'ANZAHL' },
  ];

  kennzahlen.push(
    medianAbgeschlossen === null
      ? {
          id: 'standzeit-verkauft',
          label: 'Standzeit bis zum Verkauf (Median)',
          zustand: 'NICHT_VERFUEGBAR',
          wert: null,
          einheit: 'TAGE',
          hinweis:
            'Noch kein Fahrzeug über diese Plattform verkauft. Die Zahl entsteht mit dem ' +
            'ersten Verkauf — geschätzt wird sie nicht.',
        }
      : {
          id: 'standzeit-verkauft',
          label: 'Standzeit bis zum Verkauf (Median)',
          zustand: 'GEMESSEN',
          wert: medianAbgeschlossen,
          einheit: 'TAGE',
        },
  );

  kennzahlen.push(
    medianLaufend === null
      ? {
          id: 'standzeit-laufend',
          label: 'Laufende Anzeigen: Alter (Median)',
          zustand: 'NICHT_VERFUEGBAR',
          wert: null,
          einheit: 'TAGE',
          hinweis: 'Derzeit ist keine Anzeige online.',
        }
      : {
          id: 'standzeit-laufend',
          label: 'Laufende Anzeigen: Alter (Median)',
          zustand: 'GEMESSEN',
          wert: medianLaufend,
          einheit: 'TAGE',
        },
  );

  kennzahlen.push(
    { id: 'ki-texte', label: 'Erzeugte Verkaufstexte', zustand: 'GEMESSEN', wert: eingabe.kiTexte, einheit: 'ANZAHL' },
    { id: 'bewertungen', label: 'Abgerufene Bewertungen', zustand: 'GEMESSEN', wert: eingabe.bewertungen, einheit: 'ANZAHL' },
    { id: 'tokens', label: 'Verbrauchte Tokens', zustand: 'GEMESSEN', wert: eingabe.verbrauchteTokens, einheit: 'TOKENS' },
    {
      /*
       * Anfragen gaebe es erst mit den Nachrichten (MASTERPLAN Phase 12).
       * Hier 0 auszugeben waere die bequeme und falsche Loesung: Eine Null
       * liest sich als "niemand hat sich gemeldet".
       */
      id: 'anfragen',
      label: 'Anfragen',
      zustand: 'NICHT_VERFUEGBAR',
      wert: null,
      einheit: 'ANZAHL',
      hinweis:
        'Anfragen laufen über plattforminterne Nachrichten. Dieser Teil ist noch nicht ' +
        'gebaut — deshalb steht hier keine Zahl und ausdrücklich auch keine Null.',
    },
  );

  return kennzahlen;
}

export function formatiereKennzahl(kennzahl: Kennzahl): string {
  if (kennzahl.zustand !== 'GEMESSEN' || kennzahl.wert === null) return '—';

  switch (kennzahl.einheit) {
    case 'TAGE':
      return `${kennzahl.wert.toLocaleString('de-DE')} ${kennzahl.wert === 1 ? 'Tag' : 'Tage'}`;
    case 'TOKENS':
      return `${kennzahl.wert.toLocaleString('de-DE')} Tokens`;
    case 'EURO_CENT':
      return (kennzahl.wert / 100).toLocaleString('de-DE', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0,
      });
    default:
      return kennzahl.wert.toLocaleString('de-DE');
  }
}
