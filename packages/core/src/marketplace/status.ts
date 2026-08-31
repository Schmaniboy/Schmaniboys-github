import { errors } from '../errors';

/**
 * Der Lebenslauf einer Anzeige.
 *
 * Uebergaenge stehen als Tabelle da, nicht als Kette von if-Abfragen. Der
 * Unterschied ist nicht Geschmack: Eine Tabelle laesst sich lesen und
 * pruefen, verstreute Bedingungen nicht.
 */

export const ListingStatus = {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  PAUSED: 'PAUSED',
  SOLD: 'SOLD',
  EXPIRED: 'EXPIRED',
  DELETED: 'DELETED',
} as const;

export type ListingStatus = (typeof ListingStatus)[keyof typeof ListingStatus];

const UEBERGAENGE: Record<ListingStatus, readonly ListingStatus[]> = {
  DRAFT: ['ACTIVE', 'DELETED'],
  ACTIVE: ['PAUSED', 'SOLD', 'EXPIRED', 'DELETED'],
  PAUSED: ['ACTIVE', 'SOLD', 'DELETED'],
  // Abgelaufen laesst sich wieder aktivieren -- die Laufzeit beginnt neu.
  EXPIRED: ['ACTIVE', 'DELETED'],
  /*
   * Verkauft und geloescht sind Endzustaende. Eine verkaufte Anzeige wieder
   * zu aktivieren waere ein zweites Angebot fuer dasselbe Fahrzeug; wer das
   * will, legt eine neue Anzeige an. Und "geloescht" muss verlaesslich
   * geloescht bleiben, sonst ist es keine Loeschung.
   */
  SOLD: [],
  DELETED: [],
};

export const ALL_LISTING_STATUSES = Object.keys(UEBERGAENGE) as ListingStatus[];

/** Zustaende, in denen die Anzeige oeffentlich sichtbar ist. */
export const SICHTBARE_ZUSTAENDE: readonly ListingStatus[] = ['ACTIVE'];

export const LISTING_STATUS_LABELS: Record<ListingStatus, string> = {
  DRAFT: 'Entwurf',
  ACTIVE: 'Online',
  PAUSED: 'Pausiert',
  SOLD: 'Verkauft',
  EXPIRED: 'Abgelaufen',
  DELETED: 'Gelöscht',
};

export function canListingTransition(von: ListingStatus, nach: ListingStatus): boolean {
  return UEBERGAENGE[von].includes(nach);
}

export function allowedListingTransitions(von: ListingStatus): readonly ListingStatus[] {
  return UEBERGAENGE[von];
}

/**
 * Prueft einen Statuswechsel und erklaert das Nein.
 *
 * Eine Fehlermeldung "Ungueltiger Status" hilft niemandem. Sie sagt hier,
 * was gerade gilt und was moeglich waere.
 */
export function assertListingTransition(von: ListingStatus, nach: ListingStatus): void {
  if (von === nach) {
    throw errors.conflict(`Die Anzeige steht bereits auf „${LISTING_STATUS_LABELS[nach]}".`);
  }
  if (!canListingTransition(von, nach)) {
    const moeglich = allowedListingTransitions(von);
    const auswahl =
      moeglich.length === 0
        ? 'Von hier aus ist kein Wechsel mehr möglich.'
        : `Möglich wäre: ${moeglich.map((s) => LISTING_STATUS_LABELS[s]).join(', ')}.`;
    throw errors.conflict(
      `Eine Anzeige im Zustand „${LISTING_STATUS_LABELS[von]}" lässt sich nicht auf ` +
        `„${LISTING_STATUS_LABELS[nach]}" setzen. ${auswahl}`,
    );
  }
}

/** Laufzeit einer Veroeffentlichung in Tagen. */
export const LAUFZEIT_TAGE = 60;

export function ablaufDatum(ab: Date): Date {
  return new Date(ab.getTime() + LAUFZEIT_TAGE * 24 * 60 * 60 * 1000);
}

/**
 * Ob eine Anzeige abgelaufen IST -- unabhaengig davon, ob jemand den Status
 * schon umgestellt hat.
 *
 * Der Hintergrundlauf setzt den Status; bis dahin darf eine abgelaufene
 * Anzeige trotzdem nicht mehr in Trefferlisten auftauchen. Sichtbarkeit
 * haengt deshalb an dieser Funktion, nicht nur am gespeicherten Zustand.
 */
export function istAbgelaufen(
  anzeige: { status: ListingStatus; expiresAt: Date | null },
  jetzt: Date,
): boolean {
  if (anzeige.status !== 'ACTIVE') return false;
  return anzeige.expiresAt !== null && anzeige.expiresAt <= jetzt;
}

export function istOeffentlichSichtbar(
  anzeige: { status: ListingStatus; expiresAt: Date | null },
  jetzt: Date,
): boolean {
  return SICHTBARE_ZUSTAENDE.includes(anzeige.status) && !istAbgelaufen(anzeige, jetzt);
}
