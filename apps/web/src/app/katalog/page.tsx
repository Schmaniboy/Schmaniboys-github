import Link from 'next/link';
import type { Metadata } from 'next';

import { listPublishedManufacturers } from '@ap/db';

import { Card, CardBody } from '@/components/ui/Card';
import { DataGap } from '@/components/ui/DataGap';

export const metadata: Metadata = {
  title: 'Fahrzeugwissen',
  description:
    'Hersteller, Modelle, Generationen, Motoren und Ausstattung — mit Quellenangabe je Zahl.',
};

/*
 * Der Katalog wird statisch ausgeliefert und regelmaessig erneuert.
 * Er aendert sich selten, wird aber oft gelesen -- die teuerste Abfrage
 * gehoert nicht in jeden Seitenaufruf.
 */
export const dynamic = 'force-dynamic';
export const revalidate = 300;

export default async function KatalogPage() {
  const hersteller = await listPublishedManufacturers();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="accent-rule mb-6" />
      <p className="eyebrow mb-3">Fahrzeugwissen</p>
      <h1 className="text-3xl font-semibold tracking-tight text-ink">Hersteller</h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-muted">
        Jede technische Angabe in diesem Katalog trägt ihre Quelle. Was nicht
        belegt ist, steht als Lücke — nicht als Schätzung.
      </p>

      {hersteller.length === 0 ? (
        <Card className="mt-8">
          <CardBody className="space-y-3">
            <h2 className="text-base font-semibold text-ink">
              Noch keine veröffentlichten Hersteller
            </h2>
            <p className="text-sm leading-relaxed text-ink-muted">
              Der Katalog wird redaktionell aufgebaut. Ein Eintrag erscheint hier
              erst, wenn er geprüft und mit mindestens einer Quelle belegt wurde.
              Diese Reihenfolge ist Absicht: lieber leer als falsch.
            </p>
            <p className="text-sm text-ink-subtle">
              Fortschritt und offene Punkte stehen in <code>STATUS.md</code> im
              Projektarchiv.
            </p>
          </CardBody>
        </Card>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {hersteller.map((eintrag) => (
            <li key={eintrag.id}>
              <Link
                href={`/katalog/${eintrag.slug}`}
                className="group block rounded-lg border border-line bg-surface-2 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-line-interactive hover:shadow-raised"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-ink">{eintrag.name}</h2>
                  <span className="text-ink-subtle transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">→</span>
                </div>
                <p className="mt-1 text-sm text-ink-subtle">
                  {eintrag.country ?? <DataGap reason="Land nicht erfasst" />}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="inline-flex h-5 items-center rounded bg-accent/10 px-2 text-xs font-medium text-accent">
                    {eintrag._count.models === 0
                      ? '—'
                      : eintrag._count.models}
                  </span>
                  <span className="text-sm text-ink-muted">
                    {eintrag._count.models === 0
                      ? 'Noch keine veröffentlichten Modelle'
                      : eintrag._count.models === 1 ? 'Modell' : 'Modelle'}
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
