import type { DashboardNavItem } from './DashboardShell';

/**
 * Navigation des Kontobereichs.
 *
 * An einer Stelle, damit ein neuer Bereich nicht auf fuenf Seiten
 * nachgetragen werden muss -- und eine davon vergessen wird. Genau das ist
 * in Phase 7 passiert: Zwei Verweise zeigten auf Seiten, die es nicht gab.
 */
export const KONTO_NAVIGATION: readonly DashboardNavItem[] = [
  { href: '/konto', label: 'Übersicht' },
  { href: '/konto/anzeigen', label: 'Meine Anzeigen' },
  { href: '/konto/fahrzeuge', label: 'Meine Fahrzeuge' },
  { href: '/konto/merkliste', label: 'Merkliste' },
  { href: '/konto/guthaben', label: 'Guthaben' },
  { href: '/konto/rechnungen', label: 'Rechnungen' },
  { href: '/konto/nachrichten', label: 'Nachrichten' },
];
