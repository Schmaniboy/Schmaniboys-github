import Link from 'next/link';
import type { Metadata } from 'next';

import { Card, CardBody } from '@/components/ui/Card';

export const metadata: Metadata = {
  title: 'Dokumente',
  description:
    'Kaufvertrag, Uebergabeprotokoll, Kaeufer-Checkliste und Fahrzeugbericht — als Vorlage zum Ausfuellen.',
};

const DOKUMENTE = [
  {
    titel: 'Kaufvertrag',
    beschreibung:
      'Vorlage fuer den Gebrauchtwagenverkauf (Privat oder Gewerblich). Online ausfuellen, drucken, unterschreiben.',
    href: '/dokumente/kaufvertrag',
    verfuegbar: true,
  },
  {
    titel: 'Uebergabeprotokoll',
    beschreibung:
      'Dokumentiert den Zustand des Fahrzeugs bei Uebergabe: Maengel, Kratzer, Zubehoer, Kilometerstand.',
    href: '/dokumente/uebergabeprotokoll',
    verfuegbar: true,
  },
  {
    titel: 'Kaeufer-Checkliste',
    beschreibung:
      'Worauf vor dem Kauf eines Gebrauchtwagens zu achten ist. Interaktive Pruefpunkte fuer Probefahrt, Papiere, Zustand.',
    href: '/dokumente/kaeufer-checkliste',
    verfuegbar: true,
  },
  {
    titel: 'Fahrzeugbericht',
    beschreibung:
      'Zusammenfassung aller Katalogdaten zu einem Fahrzeug — Generation, Motor, Ausstattung, bekannte Schwachstellen.',
    href: '/dokumente/fahrzeugbericht',
    verfuegbar: true,
  },
];

export default function DokumentePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="accent-rule mb-6" />
      <p className="eyebrow mb-2">Dokumente</p>
      <h1 className="text-3xl font-semibold tracking-tight text-ink">
        Vorlagen und Unterlagen
      </h1>
      <p className="mt-3 text-base leading-relaxed text-ink-muted">
        Vorlagen fuer den privaten Fahrzeugverkauf und -kauf. Direkt online
        ausfuellen, als PDF speichern oder ausdrucken.
      </p>

      <div className="mt-10 space-y-4">
        {DOKUMENTE.map((dok) => (
          <Card key={dok.titel}>
            <CardBody>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold text-ink">{dok.titel}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                    {dok.beschreibung}
                  </p>
                </div>
                {dok.verfuegbar ? (
                  <div className="flex shrink-0 gap-2">
                    <Link
                      href={dok.href}
                      className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-ink transition-colors hover:bg-accent-strong"
                    >
                      Oeffnen
                    </Link>
                    <Link
                      href={`${dok.href}?demo`}
                      className="rounded-md border border-caution/40 px-3 py-2 text-sm font-medium text-caution transition-colors hover:bg-caution/10"
                    >
                      Demo
                    </Link>
                  </div>
                ) : (
                  <span className="shrink-0 rounded-md border border-line px-4 py-2 text-sm text-ink-subtle">
                    In Arbeit
                  </span>
                )}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="mt-12 glass-card rounded-xl p-6">
        <p className="text-xs leading-relaxed text-ink-subtle">
          <strong>Rechtshinweis:</strong> Die hier angebotenen Vorlagen sind
          Arbeitshilfen und ersetzen keine individuelle Rechtsberatung. CARONEX
          ist nicht Vertragspartei und uebernimmt keine Gewaehr fuer die
          rechtliche Vollstaendigkeit oder Richtigkeit der Dokumente. Im
          Zweifelsfall ziehen Sie eine Rechtsanwaeltin oder einen Rechtsanwalt
          hinzu.
        </p>
      </div>
    </div>
  );
}
