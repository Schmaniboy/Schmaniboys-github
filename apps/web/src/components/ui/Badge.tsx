import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

/**
 * Kurzkennzeichnung, etwa fuer Anzeigenstatus oder Datenqualitaet.
 *
 * Farbe allein traegt nie die Aussage -- der Text steht immer daneben.
 * Rot-Gruen-Blindheit betrifft rund acht Prozent der Maenner; ein rein
 * farbiger Punkt waere fuer sie bedeutungslos.
 */

type Tone = 'neutral' | 'accent' | 'positive' | 'caution' | 'critical';

const TONES: Record<Tone, string> = {
  neutral: 'border-line-interactive/60 text-ink-muted',
  accent: 'border-accent/50 text-accent-strong',
  positive: 'border-positive/40 text-positive',
  caution: 'border-caution/40 text-caution',
  critical: 'border-critical/40 text-critical',
};

export function Badge({
  tone = 'neutral',
  children,
  className,
  title,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
  /** Erlaeuterung beim Ueberfahren. Ersetzt nie den sichtbaren Text. */
  title?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm border px-2 py-0.5 text-xs font-medium',
        TONES[tone],
        className,
      )}
      title={title}
    >
      {children}
    </span>
  );
}
