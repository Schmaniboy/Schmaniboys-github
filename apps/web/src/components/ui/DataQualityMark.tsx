import { DATA_QUALITY_LABELS, type DataQuality, pruefungUeberfaellig } from '@ap/core';

import { cn } from '@/lib/cn';

/**
 * Guetekennzeichen an einer einzelnen Angabe.
 *
 * Bewusst klein und immer sichtbar statt einer Legende am Seitenende: Wer
 * eine Zahl liest, soll im selben Blick sehen, wie fest sie ist. Eine
 * Fussnote wird nicht gelesen.
 *
 * Das Zeichen traegt die Aussage nie allein -- Bezeichnung und Erklaerung
 * stehen im Titel, und bei ueberfaelliger Pruefung kommt ein sichtbarer
 * Zusatz dazu.
 */

const FARBEN: Record<DataQuality, string> = {
  VERIFIED: 'text-positive',
  PARTIALLY_VERIFIED: 'text-accent-strong',
  EXPERIENCE: 'text-ink-muted',
  UNVERIFIED: 'text-caution',
  NEEDS_REVIEW: 'text-critical',
};

export function DataQualityMark({
  quality,
  lastVerifiedAt,
  showLabel = false,
  className,
}: {
  quality: DataQuality;
  lastVerifiedAt?: Date | string | null | undefined;
  showLabel?: boolean;
  className?: string;
}) {
  const beschreibung = DATA_QUALITY_LABELS[quality];
  const geprueftAm = lastVerifiedAt ? new Date(lastVerifiedAt) : null;
  const gueltig = geprueftAm && !Number.isNaN(geprueftAm.getTime()) ? geprueftAm : null;
  const ueberfaellig = pruefungUeberfaellig(gueltig, new Date());

  const titel = [
    `${beschreibung.label}: ${beschreibung.explanation}`,
    gueltig
      ? `Zuletzt geprüft am ${gueltig.toLocaleDateString('de-DE')}.`
      : 'Noch nicht gegen eine Quelle geprüft.',
  ].join(' ');

  return (
    <span
      className={cn('inline-flex items-baseline gap-1 text-xs', FARBEN[quality], className)}
      title={titel}
    >
      <span aria-hidden="true">{beschreibung.mark}</span>
      <span className={showLabel ? undefined : 'sr-only'}>{beschreibung.label}</span>
      {ueberfaellig && (quality === 'VERIFIED' || quality === 'PARTIALLY_VERIFIED') ? (
        <span className="text-caution">· Prüfung überfällig</span>
      ) : null}
    </span>
  );
}
