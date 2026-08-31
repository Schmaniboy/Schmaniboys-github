import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { formatBuildPeriod } from '@ap/core';
import { findPublishedModel } from '@ap/db';

import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { DataGap } from '@/components/ui/DataGap';

export const dynamic = 'force-dynamic';
export const revalidate = 300;

interface Props {
  params: Promise<{ hersteller: string; modell: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { hersteller, modell } = await params;
  const eintrag = await findPublishedModel(hersteller, modell);
  if (!eintrag) return { title: 'Nicht gefunden' };
  return {
    title: `${eintrag.manufacturer.name} ${eintrag.name}`,
    description: `Generationen, Motoren und Ausstattung des ${eintrag.manufacturer.name} ${eintrag.name}.`,
  };
}

export default async function ModellPage({ params }: Props) {
  const { hersteller, modell } = await params;
  const eintrag = await findPublishedModel(hersteller, modell);
  if (!eintrag) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <Breadcrumbs
        items={[
          { href: '/katalog', label: 'Fahrzeugwissen' },
          { href: `/katalog/${eintrag.manufacturer.slug}`, label: eintrag.manufacturer.name },
          { label: eintrag.name },
        ]}
      />

      <div className="accent-rule mb-6" />
      <p className="eyebrow mb-2">{eintrag.manufacturer.name}</p>
      <h1 className="text-3xl font-semibold tracking-tight text-ink">{eintrag.name}</h1>

      <h2 className="mt-10 text-lg font-semibold text-ink">Generationen</h2>
      <p className="mt-2 max-w-2xl text-sm text-ink-muted">
        Zwischen zwei Generationen ändert sich fast alles — Technik, Ersatzteile
        und typische Schwachstellen. Die Generation ist deshalb die wichtigste
        Unterscheidung beim Gebrauchtkauf.
      </p>

      {eintrag.generations.length === 0 ? (
        <p className="mt-4 text-sm text-ink-muted">
          Für dieses Modell ist noch keine Generation veröffentlicht.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {eintrag.generations.map((generation) => (
            <li key={generation.id}>
              <Link
                href={`/katalog/${eintrag.manufacturer.slug}/${eintrag.slug}/${generation.slug}`}
                className="flex flex-wrap items-baseline justify-between gap-3 rounded-lg border border-line bg-surface-2 p-5 transition-colors hover:border-line-interactive"
              >
                <div>
                  <h3 className="text-base font-semibold text-ink">
                    {generation.name}
                    {generation.code ? (
                      <span className="ml-2 font-mono text-sm text-ink-subtle">
                        {generation.code}
                      </span>
                    ) : null}
                  </h3>
                  <p className="mt-1 text-sm text-ink-muted">
                    {generation.bodyType?.name ?? <DataGap reason="Karosserieform offen" />}
                  </p>
                </div>
                <div className="text-right">
                  <p className="tabular text-sm text-ink">
                    {formatBuildPeriod(generation.yearFrom, generation.yearTo)}
                  </p>
                  <p className="mt-1 text-xs text-ink-subtle">
                    {generation._count.powertrains === 0
                      ? 'keine Motorvarianten erfasst'
                      : `${generation._count.powertrains} Motorvarianten`}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
