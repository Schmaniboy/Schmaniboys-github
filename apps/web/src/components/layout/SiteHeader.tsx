import Image from 'next/image';
import Link from 'next/link';

import { AccountMenu } from './AccountMenu';
import { MobileNav } from './MobileNav';
import { NotificationBell } from './NotificationBell';

/**
 * Kopfzeile.
 *
 * Bewusst ohne Sitzungszugriff: Wuerde sie die Sitzung lesen, waere jede
 * Seite dynamisch. Den Anmeldezustand traegt AccountMenu nach.
 */

const NAVIGATION = [
  { href: '/katalog', label: 'Fahrzeugwissen', hint: 'Marken, Generationen, Motoren, Ausstattung' },
  { href: '/suche', label: 'Motorvarianten', hint: 'Motorvarianten filtern und vergleichen' },
  { href: '/katalog/vergleich', label: 'Vergleich', hint: 'Bis zu vier Fahrzeuge nebeneinander' },
  { href: '/katalog/datenbestand', label: 'Datenbestand', hint: 'Was erfasst ist — und was nicht' },
  { href: '/verkaufen', label: 'Verkaufen', hint: 'Anzeige erstellen' },
  { href: '/katalog/hsn-tsn', label: 'HSN/TSN', hint: 'Schlüsselnummern nachschlagen' },
  { href: '/registrieren', label: 'Konto erstellen', hint: 'Merkzettel, eigene Fahrzeuge, Anzeigen' },
];

/** Auf dem Desktop bleibt die Leiste kurz; das Uebrige steht im Fussbereich. */
const HAUPTNAVIGATION = NAVIGATION.filter((eintrag) =>
  ['/katalog', '/suche', '/verkaufen'].includes(eintrag.href),
);



export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-surface-0/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:gap-6 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <Image
            src="/logo-shield.svg"
            alt="CARONEX"
            width={36}
            height={38}
            className="h-9 w-auto transition-transform duration-200 group-hover:scale-105"
            priority
          />
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-ink">
            CARONEX
          </span>
        </Link>

        <nav aria-label="Hauptnavigation" className="hidden md:block">
          <ul className="flex items-center gap-0.5">
            {HAUPTNAVIGATION.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="relative rounded-md px-3 py-2 text-sm text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <NotificationBell />
          <AccountMenu />
          <MobileNav items={NAVIGATION} />
        </div>
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
    </header>
  );
}
