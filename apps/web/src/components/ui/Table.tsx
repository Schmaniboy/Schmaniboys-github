import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

/**
 * Datentabelle.
 *
 * Der Rahmen scrollt waagerecht in sich selbst -- die Seite selbst darf nie
 * waagerecht scrollen, sonst ist sie auf dem Telefon unbrauchbar.
 */

export function Table({ children, caption }: { children: ReactNode; caption?: string }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-line">
      <table className="w-full min-w-full border-collapse text-sm">
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        {children}
      </table>
    </div>
  );
}

export function Th({
  children,
  numeric = false,
}: {
  children: ReactNode;
  numeric?: boolean;
}) {
  return (
    <th
      scope="col"
      className={cn(
        'bg-surface-3 px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-ink-muted',
        numeric && 'text-right',
      )}
    >
      {children}
    </th>
  );
}

export function Td({
  children,
  numeric = false,
  className,
}: {
  children: ReactNode;
  numeric?: boolean;
  className?: string;
}) {
  return (
    <td
      className={cn(
        'border-t border-line px-4 py-3 text-ink-muted',
        numeric && 'tabular text-right',
        className,
      )}
    >
      {children}
    </td>
  );
}
