import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { cache } from 'react';

import {
  LISTING_STATUS_LABELS,
  SERVICE_HISTORY_LABELS,
  CONDITION_LABELS,
  systemClock,
} from '@ap/core';
import { countListingView, findPublicListing } from '@ap/db';

const getAnzeige = cache((slug: string) => findPublicListing(slug, systemClock.now()));

import { ContactSellerButton } from '@/components/messaging/ContactSellerButton';
import { FavoriteButton } from '@/components/marketplace/FavoriteButton';
import { ListingGallery } from '@/components/marketplace/ListingGallery';
import { euro, kilometer } from '@/components/marketplace/ListingCard';
import { Badge } from '@/components/ui/Badge';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { env } from '@/lib/env';
import { getCurrentSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

/**
 * Eine oeffentliche Anzeige.
 *
 * Suchmaschinentauglich heisst hier: sprechende Adresse, eigener Titel und
 * eigene Beschreibung je Anzeige, strukturierte Daten nach schema.org und
 * ein Vorschaubild fuer geteilte Verweise. Was NICHT dazugehoert: erfundene
 * Bewertungen oder Verfuegbarkeiten in den strukturierten Daten -- das waere
 * schlicht falsch und faellt bei Suchmaschinen ohnehin auf.
 */

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const anzeige = await getAnzeige(slug);
  if (!anzeige) return { title: 'Anzeige nicht gefunden' };

  const beschreibung = anzeige.description.slice(0, 300);
  const bild = anzeige.images[0];

  return {
    title: anzeige.title,
    description: beschreibung,
    alternates: { canonical: `/marktplatz/${anzeige.slug}` },
    openGraph: {
      type: 'website',
      title: anzeige.title,
      description: beschreibung,
      url: `${env.APP_URL}/marktplatz/${anzeige.slug}`,
      ...(bild ? { images: [{ url: `${env.APP_URL}/api/bilder/${bild.storageKey}` }] } : {}),
    },
  };
}

export default async function AnzeigePage({ params }: Props) {
  const { slug } = await params;
  const anzeige = await getAnzeige(slug);
  if (!anzeige) notFound();

  const session = await getCurrentSession();
  const istEigene = session?.principal.userId === anzeige.sellerId;

  // Eigene Aufrufe zaehlen nicht -- sonst zaehlt der Verkaeufer sich selbst.
  if (!istEigene) {
    await countListingView(anzeige.id).catch(() => {
      // Ein verlorener Zaehler ist kein Grund, die Seite nicht zu zeigen.
    });
  }

  const angaben: { bezeichnung: string; wert: string | null }[] = [
    { bezeichnung: 'Fahrzeug', wert: anzeige.vehicleLabel },
    { bezeichnung: 'Kilometerstand', wert: kilometer(anzeige.mileageKm) },
    {
      bezeichnung: 'Erstzulassung',
      wert: anzeige.firstRegistration
        ? anzeige.firstRegistration.toLocaleDateString('de-DE', {
            month: '2-digit',
            year: 'numeric',
          })
        : null,
    },
    {
      bezeichnung: 'Vorbesitzer',
      wert: anzeige.previousOwners === null ? null : String(anzeige.previousOwners),
    },
    {
      bezeichnung: 'HU gültig bis',
      wert: anzeige.huValidUntil
        ? anzeige.huValidUntil.toLocaleDateString('de-DE', { month: '2-digit', year: 'numeric' })
        : null,
    },
    {
      bezeichnung: 'Zustand',
      wert: anzeige.condition ? (CONDITION_LABELS[anzeige.condition] ?? null) : null,
    },
    {
      bezeichnung: 'Servicehistorie',
      wert: anzeige.serviceHistory
        ? (SERVICE_HISTORY_LABELS[anzeige.serviceHistory] ?? null)
        : null,
    },
    { bezeichnung: 'Standort', wert: [anzeige.postalCode, anzeige.city].filter(Boolean).join(' ') || null },
  ];

  const strukturierteDaten = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: anzeige.title,
    description: anzeige.description.slice(0, 500),
    ...(anzeige.images.length > 0
      ? { image: anzeige.images.map((bild) => `${env.APP_URL}/api/bilder/${bild.storageKey}`) }
      : {}),
    offers: {
      '@type': 'Offer',
      price: (anzeige.priceCents / 100).toFixed(2),
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/UsedCondition',
      url: `${env.APP_URL}/marktplatz/${anzeige.slug}`,
    },
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      {/*
        Strukturierte Daten enthalten nur, was auch auf der Seite steht.
        Bewertungen oder Verfuegbarkeiten zu erfinden, die es nicht gibt,
        waere schlicht falsch.
      */}
      <script
        type="application/ld+json"
        /* Der Ersatz von "<" ist die eigentliche Absicherung: Ohne ihn liesse
           sich aus einem Anzeigentext heraus das script-Element schliessen. */
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(strukturierteDaten).replace(/</g, '\\u003c'),
        }}
      />

      <Breadcrumbs
        items={[{ href: '/marktplatz', label: 'Marktplatz' }, { label: anzeige.vehicleLabel }]}
      />

      <div className="accent-rule mb-5 mt-4" />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm uppercase tracking-wide text-ink-subtle">
            {anzeige.vehicleLabel}
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            {anzeige.title}
          </h1>
        </div>
        <div className="text-right">
          <p className="tabular text-2xl font-semibold text-accent sm:text-3xl">
            {euro(anzeige.priceCents)}
          </p>
          {anzeige.negotiable ? (
            <p className="text-sm text-ink-subtle">Verhandlungsbasis</p>
          ) : null}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {anzeige.hadAccident === false ? <Badge tone="positive">Unfallfrei</Badge> : null}
        {anzeige.hadAccident === true ? <Badge tone="caution">Unfallschaden</Badge> : null}
        {anzeige.hadAccident === null ? (
          <Badge tone="neutral">Keine Angabe zum Unfallschaden</Badge>
        ) : null}
        {!istEigene ? <FavoriteButton listingId={anzeige.id} /> : null}
        {istEigene ? (
          <span className="text-sm text-ink-subtle">
            Ihre eigene Anzeige · {LISTING_STATUS_LABELS[anzeige.status]}
          </span>
        ) : null}
      </div>

      <ListingGallery bilder={anzeige.images} bezeichnung={anzeige.vehicleLabel} />

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="min-w-0 space-y-4">
          <Card>
            <CardHeader title="Beschreibung" />
            <CardBody>
              <p className="whitespace-pre-line text-sm leading-relaxed text-ink">
                {anzeige.description}
              </p>
            </CardBody>
          </Card>

          {anzeige.damages ? (
            <Card>
              <CardHeader title="Schäden" eyebrow="Angabe des Verkäufers" />
              <CardBody>
                <p className="whitespace-pre-line text-sm leading-relaxed text-ink">
                  {anzeige.damages}
                </p>
              </CardBody>
            </Card>
          ) : null}

          {anzeige.hadAccident && anzeige.accidentDetails ? (
            <Card>
              <CardHeader title="Zum Unfallschaden" eyebrow="Angabe des Verkäufers" />
              <CardBody>
                <p className="whitespace-pre-line text-sm leading-relaxed text-ink">
                  {anzeige.accidentDetails}
                </p>
              </CardBody>
            </Card>
          ) : null}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Angaben" />
            <CardBody>
              <dl className="text-sm">
                {angaben
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
              <p className="mt-3 text-xs leading-relaxed text-ink-subtle">
                Alle Angaben stammen vom Verkäufer. Was hier nicht steht, wurde nicht
                angegeben — und nicht geschätzt.
              </p>
            </CardBody>
          </Card>

          {anzeige.dealer && anzeige.dealer.status === 'ACTIVE' ? (
            <Card>
              <CardHeader title="Gewerblicher Anbieter" eyebrow="Verkäufer" />
              <CardBody>
                <p className="text-sm text-ink">{anzeige.dealer.name}</p>
                {anzeige.dealer.city ? (
                  <p className="text-sm text-ink-muted">{anzeige.dealer.city}</p>
                ) : null}
                <p className="mt-3">
                  <Link
                    href={`/autohaus/${anzeige.dealer.slug}`}
                    className="text-sm text-ink underline-offset-4 hover:underline"
                  >
                    Betrieb ansehen
                  </Link>
                </p>
              </CardBody>
            </Card>
          ) : (
            <Card>
              <CardHeader title="Verkäufer" />
              <CardBody>
                <p className="text-sm leading-relaxed text-ink-muted">
                  Privates Angebot.
                </p>
              </CardBody>
            </Card>
          )}

          <Card>
            <CardHeader title="Kontakt" />
            <CardBody className="space-y-3">
              {istEigene ? (
                <p className="text-sm leading-relaxed text-ink-muted">
                  Das ist Ihre eigene Anzeige. Anfragen finden Sie unter &bdquo;Nachrichten&ldquo;.
                </p>
              ) : (
                <>
                  <ContactSellerButton listingId={anzeige.id} angemeldet={session !== null} />
                  <p className="text-xs leading-relaxed text-ink-subtle">
                    Die Kontaktaufnahme läuft über plattforminterne Nachrichten. Hier steht
                    bewusst keine E-Mail-Adresse und keine Telefonnummer: Auf der Plattform
                    bleibt der Gesprächsverlauf erhalten, und die Adresse der anbietenden
                    Person landet nicht in jedem Posteingang.
                  </p>
                </>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
