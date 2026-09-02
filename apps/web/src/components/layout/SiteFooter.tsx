import Image from 'next/image';
import Link from 'next/link';

const COLUMNS = [
  {
    title: 'Plattform',
    links: [
      { href: '/katalog', label: 'Fahrzeuge' },
      { href: '/suche', label: 'Motoren' },
      { href: '/ausstattung', label: 'Ausstattung' },
      { href: '/marktplatz', label: 'Marktplatz' },
      { href: '/katalog/glossar', label: 'Glossar' },
    ],
  },
  {
    title: 'Verkaufen & Dokumente',
    links: [
      { href: '/verkaufen', label: 'Fahrzeug verkaufen' },
      { href: '/dokumente', label: 'Vorlagen & Dokumente' },
      { href: '/bewertung', label: 'Fahrzeugbewertung' },
      { href: '/haendler', label: 'Für Händler' },
    ],
  },
  {
    title: 'Rechtliches',
    links: [
      { href: '/impressum', label: 'Impressum' },
      { href: '/datenschutz', label: 'Datenschutz' },
      { href: '/agb', label: 'AGB' },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative border-t border-glass-border bg-glass-strong backdrop-blur-xl">
      <div className="section-divider absolute inset-x-0 top-0" />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4 sm:px-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <Image
              src="/logo-shield.svg"
              alt="CARONEX"
              width={40}
              height={43}
              className="h-10 w-auto"
            />
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-ink">CARONEX</p>
          </div>
          <p className="max-w-xs text-sm text-ink-subtle">
            Fahrzeugwissen und Fahrzeugverkauf an einem Ort. Technische Angaben
            werden belegt oder als fehlend gekennzeichnet — nie geschätzt.
          </p>
        </div>

        {COLUMNS.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <p className="eyebrow mb-3">{column.title}</p>
            <ul className="space-y-2">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink-muted transition-colors hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-glass-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <p className="text-xs text-ink-subtle">
            &copy; {new Date().getFullYear()} CARONEX
          </p>
          <p className="text-xs text-ink-subtle">
            Alle Angaben ohne Gewähr.
          </p>
        </div>
      </div>
    </footer>
  );
}
