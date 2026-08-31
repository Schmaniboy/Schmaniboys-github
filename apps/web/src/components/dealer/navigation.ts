import type { DashboardNavItem } from '@/components/layout/DashboardShell';

/**
 * Navigation des Haendlerbereichs.
 *
 * An einer Stelle, damit ein neuer Bereich nicht auf drei Seiten nachgetragen
 * werden muss -- und einer davon vergessen wird.
 */
export const DEALER_NAVIGATION: readonly DashboardNavItem[] = [
  { href: '/haendler', label: 'Übersicht' },
  { href: '/haendler/bestand', label: 'Fahrzeugbestand' },
  { href: '/haendler/profil', label: 'Profil' },
  { href: '/haendler/mitarbeiter', label: 'Mitarbeiter' },
];
