'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import type { DashboardNavItem } from './DashboardShell';

const NAV_KLASSEN =
  'block whitespace-nowrap rounded-md px-3 py-2 text-sm transition-colors';

export function DashboardNav({ items }: { items: readonly DashboardNavItem[] }) {
  const pfad = usePathname();

  return (
    <nav aria-label="Bereichsnavigation" className="min-w-0">
      <ul className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
        {items.map((item) => {
          const aktiv = pfad === item.href;
          return (
            <li key={item.href} className="shrink-0">
              {item.upcoming ? (
                <span
                  aria-disabled="true"
                  className={`${NAV_KLASSEN} cursor-default text-ink-subtle`}
                >
                  {item.label}
                  <span className="ml-2 text-xs uppercase tracking-wide">in Arbeit</span>
                </span>
              ) : (
                <Link
                  href={item.href}
                  aria-current={aktiv ? 'page' : undefined}
                  className={`${NAV_KLASSEN} ${
                    aktiv
                      ? 'bg-surface-2 text-ink font-medium'
                      : 'text-ink-muted hover:bg-surface-2 hover:text-ink'
                  }`}
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
