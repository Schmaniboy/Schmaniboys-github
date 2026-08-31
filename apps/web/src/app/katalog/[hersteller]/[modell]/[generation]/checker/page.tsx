import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { ladeCheckerBasis } from '@ap/db';

import { AusstattungsChecker } from '@/components/katalog/AusstattungsChecker';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Card, CardBody } from '@/components/ui/Card';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ hersteller: string; modell: string; generation: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { hersteller, modell, generation } = await params;
  const basis = await ladeCheckerBasis(hersteller, modell, generation);
  if (!basis) return { title: 'Ausstattungschecker' };

  return {
    title: `Ausstattungschecker — ${basis.generation.marke} ${basis.generation.modell}`,
    description:
      'Haken Sie ab, was am Fahrzeug tatsächlich verbaut ist, und sehen Sie, wie es im ' +
      'Vergleich zum damaligen Angebot dasteht.',
  };
}

/**
 * Ausstattungschecker.
 *
 * Die Frage, die ein Gebrauchtwagenkaeufer wirklich hat, ist nicht "was hat
 * das Auto", sondern "was hat es von dem, was es haben konnte". Ein Golf mit
 * fuenf Extras ist gut ausgestattet, ein Oberklassewagen mit fuenf Extras
 * ist nackt.
 */
export default async function CheckerPage({ params }: Props) {
  const { hersteller, modell, generation } = await params;
  const basis = await ladeCheckerBasis(hersteller, modell, generation);

  if (!basis) notFound();

  const pfad = `/katalog/${basis.generation.markeSlug}/${basis.generation.modellSlug}/${basis.generation.slug}`;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-12">
      <Breadcrumbs
        items={[
          { href: '/katalog', label: 'Fahrzeugwissen' },
          { href: `/katalog/${basis.generation.markeSlug}`, label: basis.generation.marke },
          {
            href: `/katalog/${basis.generation.markeSlug}/${basis.generation.modellSlug}`,
            label: basis.generation.modell,
          },
          { href: pfad, label: basis.generation.name },
          { label: 'Ausstattungschecker' },
        ]}
      />

      <div className="accent-rule mb-6 mt-6" />
      <p className="eyebrow mb-3">
        {basis.generation.marke} {basis.generation.modell} · {basis.generation.name}
      </p>
      <h1 className="text-3xl font-semibold tracking-tight text-ink">Ausstattungschecker</h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-muted">
        Haken Sie ab, was am Fahrzeug verbaut ist. Der Ausstattungsgrad rechnet gegen das,
        was für diese Baureihe erfasst ist — nicht gegen alles, was es je gab.
      </p>

      {basis.optionen.length === 0 ? (
        <Card className="mt-8">
          <CardBody className="space-y-3">
            <h2 className="text-base font-semibold text-ink">
              Für diese Baureihe ist noch keine Ausstattung erfasst
            </h2>
            <p className="text-sm leading-relaxed text-ink-muted">
              Ohne erfasste Ausstattung gibt es nichts abzuhaken und keinen Ausstattungsgrad
              zu berechnen. Ein Prozentwert auf leerer Grundlage wäre eine Zufallszahl.
            </p>
          </CardBody>
        </Card>
      ) : (
        <AusstattungsChecker
          optionen={basis.optionen}
          generationLabel={`${basis.generation.marke} ${basis.generation.modell}, ${basis.generation.name}`}
          ausstattungHref={`${pfad}/ausstattung`}
        />
      )}
    </div>
  );
}
