import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { nachWochentagen, systemClock } from '@ap/core';
import { findPublicDealer, searchListings } from '@ap/db';

import { ListingCard } from '@/components/marketplace/ListingCard';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Pagination } from '@/components/ui/Pagination';
import { env } from '@/lib/env';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Oeffentliches Haendlerprofil.
 *
 * Liegt unter /autohaus/, nicht unter /haendler/: Dort liegt der angemeldete
 * Bereich, und der steht in NONCE_PREFIXES. Eine oeffentliche Seite unter
 * demselben Praefix wuerde unnoetig dynamisch.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const haendler = await findPublicDealer(slug);
  if (!haendler) return { title: 'Autohaus nicht gefunden' };

  return {
    title: haendler.name,
    description:
      haendler.description?.slice(0, 300) ??
      `Fahrzeugangebote von ${haendler.name}${haendler.city ? ` in ${haendler.city}` : ''}.`,
    alternates: { canonical: `/autohaus/${haendler.slug}` },
    openGraph: {
      type: 'website',
      title: haendler.name,
      url: `${env.APP_URL}/autohaus/${haendler.slug}`,
      ...(haendler.logoStorageKey
        ? { images: [{ url: `${env.APP_URL}/api/bilder/${haendler.logoStorageKey}` }] }
        : {}),
    },
  };
}

export default async function AutohausPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const haendler = await findPublicDealer(slug);
  if (!haendler) notFound();

  const roh = await searchParams;
  const seite = Number(typeof roh.seite === 'string' ? roh.seite : 0) || 0;

  const jetzt = systemClock.now();
  const angebote = await searchListings(
    { sortierung: 'neueste', seite, dealerId: haendler.id },
    jetzt,
  );

  const zeiten = nachWochentagen(
    haendler.openingHours.map((zeile) => ({
      weekday: zeile.weekday,
      opensMinute: zeile.opensMinute,
      closesMinute: zeile.closesMinute,
    })),
  );

  const anschrift = [
    haendler.street,
    [haendler.postalCode, haendler.city].filter(Boolean).join(' '),
  ].filter(Boolean);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ href: '/marktplatz', label: 'Marktplatz' }, { label: haendler.name }]} />

      <div className="accent-rule mb-5 mt-4" />

      <div className="flex flex-wrap items-start gap-5">
        {haendler.logoStorageKey ? (
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-md border border-line/60 bg-surface-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/bilder/${haendler.logoStorageKey}`}
              alt={`Logo von ${haendler.name}`}
              className="h-full w-full object-contain"
            />
          </div>
        ) : null}
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            {haendler.name}
          </h1>
          {anschrift.length > 0 ? (
            <p className="mt-1 text-sm text-ink-muted">{anschrift.join(', ')}</p>
          ) : null}
        </div>
      </div>

      {haendler.description ? (
        <Card className="mt-6">
          <CardHeader title="Über den Betrieb" />
          <CardBody>
            <p className="whitespace-pre-line text-sm leading-relaxed text-ink">
              {haendler.description}
            </p>
          </CardBody>
        </Card>
      ) : null}

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Kontakt und Anbieterkennzeichnung" />
          <CardBody>
            <dl className="text-sm">
              {[
                { bezeichnung: 'Anschrift', wert: anschrift.join(', ') || null },
                { bezeichnung: 'Telefon', wert: haendler.contactPhone },
                { bezeichnung: 'E-Mail', wert: haendler.contactEmail },
                { bezeichnung: 'USt-IdNr.', wert: haendler.vatId },
              ]
                .filter((eintrag) => eintrag.wert)
                .map((eintrag) => (
                  <div
                    key={eintrag.bezeichnung}
                    className="flex justify-between gap-4 border-b border-line/40 py-2 last:border-0"
                  >
                    <dt className="text-ink-subtle">{eintrag.bezeichnung}</dt>
                    <dd className="text-right text-ink">{eintrag.wert}</dd>
                  </div>
                ))}
            </dl>
            {haendler.websiteUrl ? (
              <p className="mt-3">
                <a
                  href={haendler.websiteUrl}
                  rel="noopener noreferrer nofollow"
                  target="_blank"
                  className="text-sm text-ink underline-offset-4 hover:underline"
                >
                  Website des Betriebs
                </a>
              </p>
            ) : null}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Öffnungszeiten" />
          <CardBody>
            {zeiten.every((tag) => tag.geschlossen) ? (
              <p className="text-sm text-ink-muted">
                Für diesen Betrieb sind keine Öffnungszeiten hinterlegt.
              </p>
            ) : (
              <dl className="text-sm">
                {zeiten.map((tag) => (
                  <div
                    key={tag.weekday}
                    className="flex justify-between gap-4 border-b border-line/40 py-1.5 last:border-0"
                  >
                    <dt className="text-ink-subtle">{tag.lang}</dt>
                    <dd className="tabular text-right text-ink">
                      {tag.geschlossen
                        ? 'geschlossen'
                        : tag.spannen.map((spanne) => `${spanne.von}–${spanne.bis}`).join(', ')}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </CardBody>
        </Card>
      </div>

      <h2 className="mt-10 text-xl font-semibold text-ink">Angebote</h2>
      {angebote.treffer.length === 0 ? (
        <p className="mt-2 text-sm text-ink-muted">
          Dieser Betrieb hat derzeit keine Anzeige online.{' '}
          <Link href="/marktplatz" className="underline-offset-4 hover:underline">
            Zum Marktplatz
          </Link>
        </p>
      ) : (
        <>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {angebote.treffer.map((anzeige) => (
              <ListingCard key={anzeige.id} anzeige={anzeige} />
            ))}
          </div>
          <Pagination
            pfad={`/autohaus/${slug}`}
            seite={angebote.seite}
            gesamt={angebote.gesamt}
            seitengroesse={angebote.seitengroesse}
          />
        </>
      )}
    </div>
  );
}
