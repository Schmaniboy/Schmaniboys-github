import { errors } from '../errors';

/**
 * Redaktionsablauf fuer Katalogeintraege.
 *
 * Der Ablauf ist die Antwort auf zwei Vorgaben zugleich:
 *
 * - C3 (keine erfundenen Daten): Ohne mindestens eine Quelle wird nichts
 *   veroeffentlicht. Das erzwingt diese Datei, nicht die Oberflaeche.
 * - Blocker B3 (wer erfasst, wer gibt frei): Erfassen und Freigeben sind
 *   getrennte Rechte und getrennte Schritte. Deshalb gibt es keinen direkten
 *   Weg von DRAFT nach PUBLISHED.
 */

export const EditorialStatus = {
  DRAFT: 'DRAFT',
  IN_REVIEW: 'IN_REVIEW',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED',
} as const;

export type EditorialStatus = (typeof EditorialStatus)[keyof typeof EditorialStatus];

const ERLAUBTE_UEBERGAENGE: Record<EditorialStatus, readonly EditorialStatus[]> = {
  DRAFT: [EditorialStatus.IN_REVIEW],
  // Zurueckweisen ist ausdruecklich vorgesehen, nicht nur Durchwinken.
  IN_REVIEW: [EditorialStatus.DRAFT, EditorialStatus.PUBLISHED],
  // Zurueckziehen statt loeschen -- die Historie bleibt.
  PUBLISHED: [EditorialStatus.ARCHIVED],
  ARCHIVED: [EditorialStatus.DRAFT],
};

export function isTransitionAllowed(from: EditorialStatus, to: EditorialStatus): boolean {
  return ERLAUBTE_UEBERGAENGE[from].includes(to);
}

/** Beschreibt einen Uebergang in Worten -- fuer Fehlermeldungen und Oberflaeche. */
export const STATUS_LABELS: Record<EditorialStatus, string> = {
  DRAFT: 'Entwurf',
  IN_REVIEW: 'in Prüfung',
  PUBLISHED: 'veröffentlicht',
  ARCHIVED: 'zurückgezogen',
};

export interface TransitionCheck {
  from: EditorialStatus;
  to: EditorialStatus;
  /** Anzahl hinterlegter Quellen zum Eintrag. */
  sourceCount: number;
}

/**
 * Prueft einen Statuswechsel. Wirft mit einer Begruendung, die der Redaktion
 * sagt, was fehlt -- nicht nur, dass etwas fehlt.
 */
export function assertTransition(check: TransitionCheck): void {
  if (check.from === check.to) {
    throw errors.conflict(`Der Eintrag steht bereits auf "${STATUS_LABELS[check.to]}".`);
  }

  if (!isTransitionAllowed(check.from, check.to)) {
    const moeglich = ERLAUBTE_UEBERGAENGE[check.from]
      .map((status) => `"${STATUS_LABELS[status]}"`)
      .join(' oder ');
    throw errors.conflict(
      `Aus "${STATUS_LABELS[check.from]}" ist nur ein Wechsel nach ${moeglich} moeglich.`,
    );
  }

  if (check.to === EditorialStatus.PUBLISHED && check.sourceCount < 1) {
    throw errors.conflict(
      'Ohne mindestens eine Quellenangabe wird nicht veroeffentlicht. ' +
        'Technische Angaben ohne Herkunft sind auf dieser Plattform nicht zulaessig.',
    );
  }
}

/** Nur veroeffentlichte Eintraege sind oeffentlich sichtbar. */
export function isPubliclyVisible(status: EditorialStatus): boolean {
  return status === EditorialStatus.PUBLISHED;
}
