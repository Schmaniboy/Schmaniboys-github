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
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {eintrag.models.map((modell) => (
            <li key={modell.id}>
              <Link
                href={`/katalog/${eintrag.slug}/${modell.slug}`}
                className="group block rounded-lg border border-line bg-surface-2 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-line-interactive hover:shadow-raised"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-ink">{modell.name}</h3>
                  <span className="text-ink-subtle transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">→</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="inline-flex h-5 items-center rounded bg-accent/10 px-2 text-xs font-medium text-accent">
                    {modell._count.generations === 0 ? '—' : modell._count.generations}
                  </span>
                  <span className="text-sm text-ink-muted">
                    {modell._count.generations === 0
                      ? 'Noch keine veröffentlichte Generation'
                      : modell._count.generations === 1 ? 'Generation' : 'Generationen'}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
