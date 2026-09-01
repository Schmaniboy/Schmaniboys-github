import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

import { listPublishedManufacturers } from '@ap/db';

export const metadata: Metadata = {
  title: 'Ausstattung',
  description:
    'Sonderausstattung, Pakete und Optionscodes — nach Hersteller und Generation.',
};

export const dynamic = 'force-dynamic';

export default async function AusstattungPage() {
  const hersteller = await listPublishedManufacturers();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="accent-rule mb-6" />
      <p className="eyebrow mb-2">Ausstattung</p>
      <h1 className="text-3xl font-semibold tracking-tight text-ink">
        Sonderausstattung und Pakete
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-muted">
        Welche Extras waren wann bestellbar, was kosteten sie, und wie erkennt man
        sie am Gebrauchtfahrzeug? Wählen Sie einen Hersteller, dann ein Modell und
        eine Generation.
      </p>

      {hersteller.length === 0 ? (
        <p className="mt-10 text-sm text-ink-subtle">
          Es sind noch keine Hersteller im Katalog veröffentlicht.
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {hersteller.map((h) => (
            <Link
              key={h.id}
              href={`/katalog/${h.slug}`}
              className="group flex flex-col items-center gap-3 rounded-lg border border-line bg-surface-1 px-4 py-6 transition-all hover:border-accent/40 hover:bg-surface-2"
            >
              {h.logoUrl ? (
                <Image
                  src={h.logoUrl}
                  alt={`${h.name} Logo`}
                  width={48}
                  height={48}
                  className="h-12 w-12 object-contain"
                />
              ) : (
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-2 text-lg font-semibold text-ink-muted">
                  {h.name.charAt(0)}
                </span>
              )}
              <span className="text-sm font-medium text-ink group-hover:text-accent">
                {h.name}
              </span>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-12 rounded-lg border border-line bg-surface-1 p-6">
        <p className="text-xs leading-relaxed text-ink-subtle">
          <strong>Hinweis:</strong> Ausstattungsangaben beruhen auf den im Katalog
          hinterlegten Daten. Jeder Eintrag zeigt seine Quelle und den Erfassungszeitraum.
          Historische Preise sind Listenpreise des jeweiligen Zeitraums, nicht
          aktuelle Gebrauchtpreise. Irrtümer vorbehalten.
        </p>
      </div>
    </div>
  );
}
