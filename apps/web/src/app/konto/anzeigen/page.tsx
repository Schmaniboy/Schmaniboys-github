import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

import { LISTING_STATUS_LABELS, allowedListingTransitions, type ListingStatus } from '@ap/core';
import { listOwnListings } from '@ap/db';

import { ListingActions } from '@/components/marketplace/ListingActions';
import { euro } from '@/components/marketplace/ListingCard';
import { Badge } from '@/components/ui/Badge';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { KONTO_NAVIGATION } from '@/components/layout/konto-navigation';
import { LinkButton } from '@/components/ui/Button';
import { getCurrentSession } from '@/lib/session';

export const metadata: Metadata = { title: 'Meine Anzeigen' };
export const dynamic = 'force-dynamic';

const TON: Record<string, 'positive' | 'neutral' | 'caution'> = {
  ACTIVE: 'positive',
  DRAFT: 'neutral',
  PAUSED: 'caution',
  SOLD: 'neutral',
  EXPIRED: 'caution',
  DELETED: 'caution',
};

export default async function MeineAnzeigenPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/anmelden');

  const anzeigen = await listOwnListings(session.principal.userId);

  return (
    <DashboardShell
      title="Meine Anzeigen"
      description="Was Sie inseriert haben — auch das, was noch niemand sieht."
      navigation={KONTO_NAVIGATION}
      actions={<LinkButton href="/verkaufen">Fahrzeug anlegen</LinkButton>}
    >
      {anzeigen.length === 0 ? (
        <Card>
          <CardBody>
            <p className="text-sm leading-relaxed text-ink-muted">
              Sie haben noch keine Anzeige. Eine Anzeige entsteht aus einem
              Verkaufsentwurf — dort wird zuerst das Fahrzeug bestätigt, damit die
              Angaben auf einem Katalogeintrag stehen und nicht auf einer Vermutung.
            </p>
            <p className="mt-4">
              <LinkButton href="/verkaufen">Verkaufsentwurf beginnen</LinkButton>
            </p>
          </CardBody>
        </Card>
      ) : (
        <ul className="space-y-4">
          {anzeigen.map((anzeige) => {
            const status = anzeige.status as ListingStatus;
            return (
              <li key={anzeige.id}>
                <Card>
                  <CardHeader
                    title={anzeige.title}
                    eyebrow={anzeige.vehicleLabel}
                    action={<Badge tone={TON[status] ?? 'neutral'}>{LISTING_STATUS_LABELS[status]}</Badge>}
                  />
                  <CardBody className="space-y-4">
                    <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 text-sm">
                      <span className="tabular text-lg font-semibold text-accent">
                        {euro(anzeige.priceCents)}
                      </span>
                      <span className="text-ink-muted">
                        {anzeige.images.length}{' '}
                        {anzeige.images.length === 1 ? 'Bild' : 'Bilder'}
                      </span>
                      <span className="text-ink-muted">{anzeige.viewCount} Aufrufe</span>
                      {anzeige.expiresAt && status === 'ACTIVE' ? (
                        <span className="text-ink-subtle">
                          läuft bis {anzeige.expiresAt.toLocaleDateString('de-DE')}
                        </span>
                      ) : null}
                    </div>

                    {anzeige.images.length === 0 ? (
                      <p className="text-sm leading-relaxed text-caution">
                        Ohne Bild wird diese Anzeige kaum beachtet. Kaufinteressenten lesen
                        eine Anzeige ohne Foto meist gar nicht erst.
                      </p>
                    ) : null}

                    <div className="flex flex-wrap items-center gap-3">
                      {status === 'ACTIVE' ? (
                        <Link
                          href={`/marktplatz/${anzeige.slug}`}
                          className="text-sm text-ink underline-offset-4 hover:underline"
                        >
                          Öffentlich ansehen
                        </Link>
                      ) : null}
                      <Link
                        href={`/konto/anzeigen/${anzeige.id}`}
                        className="text-sm text-ink underline-offset-4 hover:underline"
                      >
                        Bearbeiten
                      </Link>
                      <ListingActions
                        listingId={anzeige.id}
                        moegliche={[...allowedListingTransitions(status)]}
                      />
                    </div>
                  </CardBody>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </DashboardShell>
  );
}
