import { cn } from '@/lib/cn';

/**
 * Statusanzeige.
 *
 * Punkt UND Text -- die Farbe ist Zusatzinformation, nie die einzige.
 */

export type StatusTone = 'positive' | 'caution' | 'critical' | 'neutral' | 'idle';

const DOT: Record<StatusTone, string> = {
  positive: 'bg-positive',
  caution: 'bg-caution',
  critical: 'bg-critical',
  neutral: 'bg-neutral-state',
  idle: 'bg-ink-subtle',
};

export function StatusIndicator({
  tone,
  label,
  className,
}: {
  tone: StatusTone;
  label: string;
  className?: string;
}) {
  return (
    <span className={cn('inline-flex items-center gap-2 text-sm text-ink-muted', className)}>
      <span aria-hidden="true" className={cn('h-2 w-2 shrink-0 rounded-full', DOT[tone])} />
      {label}
    </span>
  );
}
