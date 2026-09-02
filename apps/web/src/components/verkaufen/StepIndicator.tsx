'use client';

import { cn } from '@/lib/cn';

const SCHRITTE = [
  'Fahrzeug',
  'Zustand',
  'Ausstattung',
  'Bilder',
  'Verkaufstext',
  'Preis',
  'PDF',
] as const;

export function StepIndicator({ aktuellerSchritt }: { aktuellerSchritt: number }) {
  return (
    <nav aria-label="Fortschritt" className="mb-8">
      <ol className="flex items-center gap-1 overflow-x-auto pb-2 sm:gap-2">
        {SCHRITTE.map((label, index) => {
          const schritt = index + 1;
          const aktiv = schritt === aktuellerSchritt;
          const erledigt = schritt < aktuellerSchritt;

          return (
            <li key={label} className="flex items-center gap-1 sm:gap-2">
              <span
                className={cn(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors',
                  aktiv && 'bg-accent text-white',
                  erledigt && 'bg-accent/20 text-accent',
                  !aktiv && !erledigt && 'bg-surface-2 text-ink-subtle',
                )}
              >
                {erledigt ? (
                  <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
                  </svg>
                ) : (
                  schritt
                )}
              </span>
              <span
                className={cn(
                  'hidden whitespace-nowrap text-xs sm:inline',
                  aktiv ? 'font-medium text-ink' : 'text-ink-subtle',
                )}
              >
                {label}
              </span>
              {index < SCHRITTE.length - 1 && (
                <span
                  className={cn(
                    'h-px w-4 sm:w-6',
                    erledigt ? 'bg-accent/40' : 'bg-line',
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
