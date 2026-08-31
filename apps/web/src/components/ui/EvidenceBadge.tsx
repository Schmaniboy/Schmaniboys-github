import {
  CONFIDENCE_LABELS,
  EVIDENCE_EXPLANATIONS,
  EVIDENCE_LABELS,
  cappedConfidence,
  isStale,
  type ConfidenceLevel,
  type EvidenceType,
} from '@ap/core';

import { cn } from '@/lib/cn';

/**
 * Kennzeichnung, worauf eine Aussage beruht.
 *
 * Das ist keine Verzierung, sondern der sichtbare Teil von Vorgabe C3. Eine
 * Einschaetzung darf nicht aussehen wie ein Datenblattwert.
 *
 * WICHTIG: Die Guete wird hier gedeckelt und nicht roh angezeigt. Zuerst war
 * es andersherum -- dann stand an einer zwei Jahre alten Marktbeobachtung
 * "gut belegt" und daneben "ueberholt". Die Regel dafuer steht in
 * `cappedConfidence`; sie in der Anzeige zu vergessen war zu leicht, deshalb
 * rechnet die Komponente sie jetzt selbst.
 */

const TONE: Record<EvidenceType, string> = {
  SPECIFICATION: 'border-positive/40 text-positive',
  ASSESSMENT: 'border-caution/40 text-caution',
  MARKET_SIGNAL: 'border-neutral-state/40 text-neutral-state',
};

export interface EvidenceBadgeProps {
  evidenceType: EvidenceType;
  confidence: ConfidenceLevel;
  observedAt?: Date | null;
  sampleSize?: number | null;
  /** Quellenarten des Eintrags -- entscheiden ueber die Guete belegter Angaben. */
  sourceKinds?: readonly string[];
  /** Bezugszeitpunkt. Als Eigenschaft, damit die Anzeige pruefbar bleibt. */
  now: Date;
  className?: string;
}

export function EvidenceBadge({
  evidenceType,
  confidence,
  observedAt = null,
  sampleSize = null,
  sourceKinds = [],
  now,
  className,
}: EvidenceBadgeProps) {
  const claim = {
    evidenceType,
    confidence,
    observedAt,
    sampleSize,
    sourceKinds,
  };
  const gedeckelt = cappedConfidence(claim, now);
  const ueberholt = isStale(claim, now);

  return (
    <span
      className={cn('inline-flex flex-wrap items-center gap-1.5 text-xs', className)}
      title={EVIDENCE_EXPLANATIONS[evidenceType]}
    >
      <span className={cn('rounded-sm border px-1.5 py-0.5 font-medium', TONE[evidenceType])}>
        {EVIDENCE_LABELS[evidenceType]}
      </span>
      <span className="text-ink-subtle">{CONFIDENCE_LABELS[gedeckelt]}</span>
      {ueberholt ? (
        <span className="rounded-sm border border-critical/40 px-1.5 py-0.5 text-critical">
          überholt
        </span>
      ) : null}
    </span>
  );
}

/**
 * Begruendung einer Einschaetzung bzw. Datengrundlage einer Marktbeobachtung.
 * Steht sichtbar dabei, nicht hinter einem Aufklappen versteckt: Wer die
 * Aussage liest, soll ohne Zutun sehen, worauf sie beruht.
 */
export function EvidenceBasis({
  reasoning,
  dataBasis,
  observedAt,
  sampleSize,
}: {
  reasoning?: string | null;
  dataBasis?: string | null;
  observedAt?: Date | null;
  sampleSize?: number | null;
}) {
  const teile: string[] = [];
  if (dataBasis) teile.push(dataBasis);
  if (observedAt) teile.push(`Stand ${observedAt.toLocaleDateString('de-DE')}`);
  if (sampleSize) teile.push(`${sampleSize.toLocaleString('de-DE')} Beobachtungen`);

  if (!reasoning && teile.length === 0) return null;

  return (
    <div className="mt-2 border-l-2 border-line pl-3 text-xs leading-relaxed text-ink-subtle">
      {reasoning ? <p>{reasoning}</p> : null}
      {teile.length > 0 ? <p className={reasoning ? 'mt-1' : ''}>{teile.join(' · ')}</p> : null}
    </div>
  );
}
