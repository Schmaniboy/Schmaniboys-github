import Link from 'next/link';
import type { Metadata } from 'next';

import { Card, CardBody } from '@/components/ui/Card';

export const metadata: Metadata = {
  title: 'Dokumente',
  description:
    'Kaufvertrag, Übergabeprotokoll, Käufer-Checkliste und Fahrzeugbericht — als Vorlage zum Ausfüllen.',
};

const DOKUMENTE = [
  {
    titel: 'Kaufvertrag',
    beschreibung:
      'Vorlage für einen privaten Gebrauchtwagenverkauf. Enthält Angaben zu Verkäufer, Käufer, Fahrzeug und Zahlungsbedingungen.',
    href: '/dokumente/kaufvertrag',
    verfuegbar: true,
  },
  {
    titel: 'Übergabeprotokoll',
    beschreibung:
      'Dokumentiert den Zustand des Fahrzeugs bei Übergabe: Mängel, Kratzer, Zubehör, Kilometerstand, Schlüssel.',
    href: '/dokumente/uebergabeprotokoll',
    verfuegbar: true,
  },
  {
    titel: 'Käufer-Checkliste',
    beschreibung:
      'Worauf vor dem Kauf eines Gebrauchtwagens zu achten ist. Prüfpunkte für Probefahrt, Papiere, Zustand.',
    href: '/dokumente/kaeufer-checkliste',
    verfuegbar: true,
  },
  {
    titel: 'Fahrzeugbericht',
    beschreibung:
      'Zusammenfassung aller Katalogdaten zu einem Fahrzeug — Generation, Motor, Ausstattung, bekannte Schwachstellen.',
    href: '/dokumente/fahrzeugbericht',
    verfuegbar: false,
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
        Vorlagen für den privaten Fahrzeugverkauf und -kauf. Ausfüllen, ausdrucken,
        unterschreiben.
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
                  <Link
                    href={dok.href}
                    className="shrink-0 rounded-md bg-accent px-4 py-2 text-sm font-medium text-surface-0 transition-colors hover:bg-accent-strong"
                  >
                    Öffnen
                  </Link>
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

      <div className="mt-12 rounded-lg border border-line bg-surface-1 p-6">
        <p className="text-xs leading-relaxed text-ink-subtle">
          <strong>Rechtshinweis:</strong> Die hier angebotenen Vorlagen sind
          Arbeitshilfen und ersetzen keine individuelle Rechtsberatung. CARONEX
          übernimmt keine Gewähr für die rechtliche Vollständigkeit oder Richtigkeit
          der Dokumente. Im Zweifelsfall ziehen Sie eine Rechtsanwältin oder einen
          Rechtsanwalt hinzu.
        </p>
      </div>
    </div>
  );
}
