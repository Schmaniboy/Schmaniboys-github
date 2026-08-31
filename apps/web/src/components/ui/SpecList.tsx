import type { ReactNode } from 'react';

import { DataGap } from './DataGap';

/**
 * Technische Daten als Beschreibungsliste.
 *
 * Fehlende Werte werden ausgewiesen statt weggelassen. Das ist bewusst:
 * Wer eine Angabe sucht und sie nicht findet, weiss sonst nicht, ob sie
 * fehlt oder ob es sie nicht gibt.
 */

export function SpecList({ children }: { children: ReactNode }) {
  return <dl className="divide-y divide-line">{children}</dl>;
}

export function SpecRow({
  label,
  value,
  gapReason = 'nicht erfasst',
  hint,
}: {
  label: ReactNode;
  value: ReactNode | null | undefined;
  gapReason?: string;
  hint?: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-1 py-2.5 sm:grid-cols-[14rem_1fr] sm:gap-4">
      <dt className="text-sm text-ink-subtle">{label}</dt>
      <dd className="text-sm text-ink">
        {value === null || value === undefined || value === '' ? (
          <DataGap reason={gapReason} />
        ) : (
          value
        )}
        {hint ? <p className="mt-0.5 text-xs text-ink-subtle">{hint}</p> : null}
      </dd>
    </div>
  );
}
