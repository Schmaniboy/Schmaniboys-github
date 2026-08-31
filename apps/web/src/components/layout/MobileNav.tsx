'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

/**
 * Navigation auf dem Handy.
 *
 * Vorher war die Hauptnavigation unterhalb der mittleren Breite schlicht
 * ausgeblendet -- auf dem Telefon gab es ausser dem Logo keinen Weg in den
 * Katalog. Das ist keine Geschmacksfrage, sondern ein Ausfall der Seite auf
 * dem Geraet, mit dem die meisten Menschen sie oeffnen.
 *
 * Die Umsetzung bleibt bewusst schlicht: ein Knopf, eine Liste, keine
 * Animation, die beim Antippen im Weg steht. Touchflaechen sind
 * durchgehend mindestens 44 Bildpunkte hoch -- darunter trifft man auf
 * einem Telefon zuverlaessig daneben.
 */

export interface MobileNavItem {
  href: string;
  label: string;
  hint?: string;
}

export function MobileNav({ items }: { items: MobileNavItem[] }) {
  const [offen, setOffen] = useState(false);
  const pfad = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);

  // Beim Seitenwechsel schliessen. Sonst bleibt das Menue ueber der neuen
  // Seite stehen und wirkt wie ein Fehler.
  useEffect(() => {
    setOffen(false);
  }, [pfad]);

  useEffect(() => {
    if (!offen) return;

    const beiTaste = (ereignis: KeyboardEvent) => {
      if (ereignis.key === 'Escape') setOffen(false);
    };
    document.addEventListener('keydown', beiTaste);
    return () => document.removeEventListener('keydown', beiTaste);
  }, [offen]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={offen}
        aria-controls="mobile-navigation"
        onClick={() => setOffen((wert) => !wert)}
        className="flex h-11 w-11 items-center justify-center rounded-md border border-line text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
      >
        <span className="sr-only">{offen ? 'Menü schließen' : 'Menü öffnen'}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        >
          {offen ? (
            <>
              <path d="M5 5l10 10" />
              <path d="M15 5L5 15" />
            </>
          ) : (
            <>
              <path d="M3 6h14" />
              <path d="M3 10h14" />
              <path d="M3 14h14" />
            </>
          )}
        </svg>
      </button>

      {offen ? (
        <div
          id="mobile-navigation"
          ref={panelRef}
          className="fixed inset-x-0 top-16 z-40 max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-line bg-surface-0 px-4 pb-6 pt-2 shadow-lg"
        >
          <nav aria-label="Hauptnavigation">
            <ul className="flex flex-col">
              {items.map((item) => {
                const aktiv = pfad === item.href || pfad.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={aktiv ? 'page' : undefined}
                      className={`flex min-h-[52px] flex-col justify-center border-b border-line/60 px-1 py-2 ${
                        aktiv ? 'text-accent' : 'text-ink'
                      }`}
                    >
                      <span className="text-base font-medium">{item.label}</span>
                      {item.hint ? (
                        <span className="text-sm text-ink-subtle">{item.hint}</span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
