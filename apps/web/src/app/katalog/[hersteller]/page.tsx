import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { findPublishedManufacturer } from '@ap/db';

import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { DataGap } from '@/components/ui/DataGap';

export const dynamic = 'force-dynamic';
export const revalidate = 300;

interface Props {
  params: Promise<{ hersteller: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { hersteller } = await params;
  const eintrag = await findPublishedManufacturer(hersteller);
  if (!eintrag) return { title: 'Nicht gefunden' };
  return {
    title: eintrag.name,
    description: `Modelle und Generationen von ${eintrag.name} mit belegten technischen Daten.`,
  };
}

export default async function HerstellerPage({ params }: Props) {
  const { hersteller } = await params;
  const eintrag = await findPublishedManufacturer(hersteller);
  if (!eintrag) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <Breadcrumbs
        items={[
          { href: '/katalog', label: 'Fahrzeugwissen' },
          { label: eintrag.name },
        ]}
      />

      <div className="accent-rule mb-6" />
      <h1 className="text-3xl font-semibold tracking-tight text-ink">{eintrag.name}</h1>
      <dl className="mt-3 flex flex-wrap gap-x-8 gap-y-2 text-sm">
        <div>
          <dt className="text-ink-subtle">Land</dt>
          <dd className="text-ink">{eintrag.country ?? <DataGap />}</dd>
        </div>
        {eintrag.wmiCodes.length > 0 ? (
          <div>
            <dt className="text-ink-subtle">Herstellerkennung in der VIN</dt>
            <dd className="font-mono text-ink">{eintrag.wmiCodes.join(', ')}</dd>
          </div>
        ) : null}
      </dl>

      <h2 className="mt-10 text-lg font-semibold text-ink">Modelle</h2>
      {eintrag.models.length === 0 ? (
        <p className="mt-3 text-sm text-ink-muted">
          Für diesen Hersteller ist noch kein Modell veröffentlicht.
        </p>
      ) : (
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {eintrag.models.map((modell) => (
            <li key={modell.id}>
              <Link
                href={`/katalog/${eintrag.slug}/${modell.slug}`}
                className="block rounded-lg border border-line bg-surface-2 p-5 transition-colors hover:border-line-interactive"
              >
                <h3 className="text-base font-semibold text-ink">{modell.name}</h3>
                <p className="mt-2 text-sm text-ink-muted">
                  {modell._count.generations === 0
                    ? 'Noch keine veröffentlichte Generation'
                    : `${modell._count.generations} ${modell._count.generations === 1 ? 'Generation' : 'Generationen'}`}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
