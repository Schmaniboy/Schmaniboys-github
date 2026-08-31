/**
 * Guetekennzeichen je Angabe.
 *
 * Das Belegmodell (evidence.ts) sagt, WELCHER ART eine Aussage ist:
 * Spezifikation, Einschaetzung oder Marktbeobachtung. Es sagt nicht, wie gut
 * geprueft der einzelne Datensatz gerade ist.
 *
 * Genau das fehlte. Ein Datensatz kann eine Spezifikation sein und trotzdem
 * ungeprueft aus einer Sammlung uebernommen worden sein. Beides gleich
 * darzustellen waere wieder die Form von erfundener Sicherheit, gegen die der
 * ganze Katalog gebaut ist.
 *
 * Deshalb tragen Katalogdatensaetze zusaetzlich einen Guetestand und ein
 * Datum der letzten Pruefung -- und die Oberflaeche zeigt beides an.
 */

export const DataQuality = {
  /** Bestaetigt: jede tragende Angabe ist durch eine belastbare Quelle gedeckt. */
  VERIFIED: 'VERIFIED',
  /** Teilweise bestaetigt: ein Teil belegt, ein Teil nicht. */
  PARTIALLY_VERIFIED: 'PARTIALLY_VERIFIED',
  /** Erfahrungswert aus der Praxis, nicht aus einer Unterlage. */
  EXPERIENCE: 'EXPERIENCE',
  /** Nicht geprueft. Die Voreinstellung. */
  UNVERIFIED: 'UNVERIFIED',
  /** Zur Pruefung: Widerspruch oder Befund der Qualitaetskontrolle. */
  NEEDS_REVIEW: 'NEEDS_REVIEW',
} as const;

export type DataQuality = (typeof DataQuality)[keyof typeof DataQuality];

/** Als Tupel fuer zod. */
export const DATA_QUALITY_VALUES = [
  'VERIFIED',
  'PARTIALLY_VERIFIED',
  'EXPERIENCE',
  'UNVERIFIED',
  'NEEDS_REVIEW',
] as const;

/** Von der staerksten zur schwaechsten Guete. */
export const DATA_QUALITY_ORDER: DataQuality[] = [
  'VERIFIED',
  'PARTIALLY_VERIFIED',
  'EXPERIENCE',
  'UNVERIFIED',
  'NEEDS_REVIEW',
];

export interface DataQualityDescriptor {
  /** Zeichen fuer die kompakte Darstellung in Listen. */
  mark: string;
  label: string;
  explanation: string;
  tone: 'neutral' | 'accent' | 'positive' | 'caution' | 'critical';
}

export const DATA_QUALITY_LABELS: Record<DataQuality, DataQualityDescriptor> = {
  VERIFIED: {
    mark: '\u2713',
    label: 'bestätigt',
    explanation:
      'Jede tragende Angabe dieses Eintrags ist durch mindestens eine belastbare Quelle gedeckt und wurde zuletzt zum genannten Datum geprüft.',
    tone: 'positive',
  },
  PARTIALLY_VERIFIED: {
    mark: '\u25d1',
    label: 'teilweise bestätigt',
    explanation:
      'Ein Teil der Angaben ist belegt, ein Teil nicht. Welche das sind, steht bei den Quellen — jede Quelle nennt die Felder, die sie deckt.',
    tone: 'accent',
  },
  EXPERIENCE: {
    mark: '\u25d0',
    label: 'Erfahrungswert',
    explanation:
      'Aus der Praxis, nicht aus einer Unterlage. Nachvollziehbar, aber nicht nachprüfbar — behandeln Sie es als Hinweis, nicht als Zusage.',
    tone: 'neutral',
  },
  UNVERIFIED: {
    mark: '?',
    label: 'nicht verifiziert',
    explanation:
      'Übernommen, aber gegen keine Quelle gehalten. Kann stimmen, kann falsch sein. Vor einer Kaufentscheidung selbst nachsehen.',
    tone: 'caution',
  },
  NEEDS_REVIEW: {
    mark: '\u26a0',
    label: 'zur Prüfung',
    explanation:
      'Hier stimmt etwas nicht — widersprüchliche Quellen oder ein Befund der Qualitätskontrolle. Der Widerspruch wird nicht stillschweigend aufgelöst; was gemeldet ist, steht dabei.',
    tone: 'critical',
  },
};

/** Darf ein Wert mit dieser Guete als Tatsache dargestellt werden? */
export function alsTatsacheDarstellbar(guete: DataQuality): boolean {
  return guete === DataQuality.VERIFIED;
}

/**
 * Wie lange gilt eine Pruefung als aktuell?
 *
 * Technische Daten aendern sich nicht mehr, wenn ein Fahrzeug aus der
 * Produktion ist -- aber unsere Erfassung kann fehlerhaft sein, und ein
 * Pruefdatum von vor drei Jahren sagt darueber nichts mehr aus. Der Wert ist
 * bewusst grosszuegig: er soll auf vergessene Datensaetze hinweisen, nicht
 * gepflegte entwerten.
 */
export const PRUEFUNG_GUELTIG_MONATE = 36;

export function pruefungUeberfaellig(
  lastVerifiedAt: Date | null | undefined,
  jetzt: Date,
): boolean {
  if (!lastVerifiedAt) return true;
  const grenze = new Date(lastVerifiedAt);
  grenze.setMonth(grenze.getMonth() + PRUEFUNG_GUELTIG_MONATE);
  return grenze.getTime() < jetzt.getTime();
}

/**
 * Die Guete einer zusammengesetzten Aussage.
 *
 * Wenn eine Seite mehrere Datensaetze zusammenfasst -- etwa eine
 * Motorseite aus Motor, Antriebskombination und Ausstattung -- gilt die
 * schwaechste Guete fuer das Ganze. Ein bestaetigter Hubraum macht eine
 * ungepruefte Abgasnorm nicht sicherer.
 */
export function schwaechsteGuete(werte: DataQuality[]): DataQuality | null {
  if (werte.length === 0) return null;
  // Die Reihenfolge ist die Rangfolge: Der schlechteste Wert entscheidet.
  for (const stufe of [...DATA_QUALITY_ORDER].reverse()) {
    if (werte.includes(stufe)) return stufe;
  }
  return DataQuality.UNVERIFIED;
}
