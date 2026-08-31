import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';

import { LISTING_STATUS_LABELS, type ListingStatus } from '@ap/core';
import { findOwnListing } from '@ap/db';

import { ListingEditForm } from '@/components/marketplace/ListingEditForm';
import { ListingImageManager } from '@/components/marketplace/ListingImageManager';
import { Badge } from '@/components/ui/Badge';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { getCurrentSession } from '@/lib/session';

export const metadata: Metadata = { title: 'Anzeige bearbeiten' };
export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AnzeigeBearbeitenPage({ params }: Props) {
  const { id } = await params;
  const session = await getCurrentSession();
  if (!session) redirect('/anmelden');

  const anzeige = await findOwnListing(id, session.principal.userId);
  if (!anzeige) notFound();

  const status = anzeige.status as ListingStatus;
  const gesperrt = status === 'SOLD';

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Breadcrumbs
        items={[
          { href: '/konto/anzeigen', label: 'Meine Anzeigen' },
          { label: anzeige.vehicleLabel },
        ]}
      />

      <div className="accent-rule mb-5 mt-4" />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Anzeige bearbeiten</h1>
        <Badge tone="neutral">{LISTING_STATUS_LABELS[status]}</Badge>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{anzeige.vehicleLabel}</p>

      {gesperrt ? (
        <Card className="mt-6">
          <CardBody>
            <p className="text-sm leading-relaxed text-ink-muted">
              Diese Anzeige ist als verkauft markiert und lässt sich nicht mehr ändern. Sie
              bleibt erhalten, damit Nachrichten und Aufrufe dazu nachvollziehbar bleiben.
            </p>
          </CardBody>
        </Card>
      ) : (
        <>
          <Card className="mt-6">
            <CardHeader title="Angaben zur Anzeige" eyebrow="Bearbeiten" />
            <CardBody>
              <ListingEditForm
                listingId={anzeige.id}
                werte={{
                  title: anzeige.title,
                  description: anzeige.description,
                  priceCents: anzeige.priceCents,
                  negotiable: anzeige.negotiable,
                  postalCode: anzeige.postalCode ?? '',
                  city: anzeige.city ?? '',
                }}
              />
            </CardBody>
          </Card>

          <Card className="mt-4">
            <CardHeader title="Bilder" eyebrow="Bearbeiten" />
            <CardBody>
              <ListingImageManager listingId={anzeige.id} bilder={anzeige.images} />
            </CardBody>
          </Card>
        </>
      )}

      <Card className="mt-4">
        <CardHeader title="Fahrzeugdaten" eyebrow="Aus dem Katalog" />
        <CardBody>
          <p className="text-sm leading-relaxed text-ink-muted">
            Die Fahrzeugzuordnung wurde beim Veröffentlichen aus dem Verkaufsentwurf
            übernommen und ist hier bewusst festgeschrieben. Eine veröffentlichte Anzeige
            ist ein Angebot — sie soll sich nicht ändern, weil jemand am Entwurf
            weiterarbeitet. Für ein anderes Fahrzeug bitte eine neue Anzeige anlegen.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
