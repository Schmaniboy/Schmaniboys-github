import type { ReactNode } from 'react';

import { DashboardNav } from './DashboardNav';

/**
 * Rahmen fuer alle angemeldeten Bereiche: Konto, Haendler, Administration.
 *
 * Die Navigationspunkte werden von aussen gesetzt, weil sie je nach Rolle
 * verschieden sind -- welche Rolle was sehen darf, entscheidet der Server.
 */

export interface DashboardNavItem {
  href: string;
  label: string;
  /**
   * Bereich ist geplant, aber noch nicht gebaut. Solche Punkte werden nicht
   * verlinkt: Ein Link auf eine 404-Seite ist ein Fehler, kein Ausblick --
   * und Next.js laedt verlinkte Routen im Hintergrund vor, was den Fehler
   * bereits beim Betreten der Seite ausloest.
   */
  upcoming?: boolean;
}

export function DashboardShell({
  title,
  description,
  navigation,
  actions,
  children,
}: {
  title: string;
  description?: string;
  navigation: readonly DashboardNavItem[];
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="accent-rule mb-3" />
          <h1 className="text-2xl font-semibold text-ink">{title}</h1>
          {description ? (
            <p className="mt-1 max-w-2xl text-sm text-ink-muted">{description}</p>
          ) : null}
        </div>
        {actions}
      </div>

      <div className="grid gap-6 lg:grid-cols-[13rem_1fr]">
        {/*
          * `min-w-0` ist hier kein Feinschliff, sondern die ganze Loesung.
          * Ein Rasterelement hat von sich aus `min-width: auto` und wird
          * damit nie schmaler als sein Inhalt. Das `overflow-x-auto` an der
          * Liste kam deshalb nie zum Zug: Statt zu scrollen, schob die
          * Navigation die ganze Seite auf 810px Breite -- auf einem
          * 390px-Fenster liess sich alles seitlich wegschieben, und der
          * Inhalt stand halb ausserhalb.
          */}
        <DashboardNav items={navigation} />

        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
