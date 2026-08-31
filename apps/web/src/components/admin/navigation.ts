import type { DashboardNavItem } from '@/components/layout/DashboardShell';

/** Navigation der Verwaltung, an einer Stelle. */
export const ADMIN_NAVIGATION: readonly DashboardNavItem[] = [
  { href: '/admin', label: 'Übersicht' },
  { href: '/admin/benutzer', label: 'Benutzer' },
  { href: '/admin/anzeigen', label: 'Anzeigen' },
  { href: '/admin/katalog', label: 'Katalog' },
  { href: '/admin/datenqualitaet', label: 'Datenqualität' },
  { href: '/admin/protokoll', label: 'Protokoll' },
];
