import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

import { LISTING_STATUS_LABELS, type ListingStatus } from '@ap/core';
import { listDealerListings } from '@ap/db';

import { euro, kilometer } from '@/components/marketplace/ListingCard';
import { Badge } from '@/components/ui/Badge';
import { Card, CardBody } from '@/components/ui/Card';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { DEALER_NAVIGATION } from '@/components/dealer/navigation';
import { getCurrentSession } from '@/lib/session';

export const metadata: Metadata = { title: 'Fahrzeugbestand' };
export const dynamic = 'force-dynamic';

const TON: Record<string, 'positive' | 'neutral' | 'caution'> = {
  ACTIVE: 'positive',
  DRAFT: 'neutral',
  PAUSED: 'caution',
  SOLD: 'neutral',
  EXPIRED: 'caution',
};

/**
 * Der Fahrzeugbestand des Betriebs.
 *
 * Gezeigt werden ausschliesslich Anzeigen mit der eigenen Haendlerkennung.
 * Eine Anzeige, die ein Mitarbeiter privat aufgegeben hat, gehoert nicht
 * dazu -- sie traegt keine Haendlerkennung.
 */
export default async function BestandPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/anmelden');
  const dealerId = session.principal.dealerId;
  if (!dealerId) redirect('/haendler');

  const anzeigen = await listDealerListings(dealerId);

  return (
    <DashboardShell
      title="Fahrzeugbestand"
      description="Alle Anzeigen, die im Namen dieses Betriebs aufgegeben wurden."
      navigation={DEALER_NAVIGATION}
    >
      {anzeigen.length === 0 ? (
        <Card>
          <CardBody>
            <p className="text-sm leading-relaxed text-ink-muted">
              Für diesen Betrieb ist noch keine Anzeige aufgegeben. Eine Anzeige entsteht
              aus einem Verkaufsentwurf; beim Anlegen lässt sich auswählen, ob sie im Namen
              des Betriebs erscheinen soll.
            </p>
            <p className="mt-4">
              <Link href="/verkaufen" className="text-sm text-ink underline-offset-4 hover:underline">
                Verkaufsentwurf beginnen
              </Link>
            </p>
          </CardBody>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[52rem] text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-subtle">
                <th className="py-2 pr-4">Fahrzeug</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4 text-right">Preis</th>
                <th className="py-2 pr-4 text-right">Kilometer</th>
                <th className="py-2 pr-4 text-right">Bilder</th>
                <th className="py-2 pr-4 text-right">Aufrufe</th>
                <th className="py-2 pr-4">Eingestellt von</th>
              </tr>
            </thead>
            <tbody>
              {anzeigen.map((anzeige) => {
                const status = anzeige.status as ListingStatus;
                return (
                  <tr key={anzeige.id} className="border-b border-line/40">
                    <td className="py-3 pr-4">
                      <Link
                        href={`/konto/anzeigen/${anzeige.id}`}
                        className="text-ink underline-offset-4 hover:underline"
                      >
                        {anzeige.title}
                      </Link>
                      <p className="text-xs text-ink-subtle">{anzeige.vehicleLabel}</p>
                    </td>
                    <td className="py-3 pr-4">
                      <Badge tone={TON[status] ?? 'neutral'}>
                        {LISTING_STATUS_LABELS[status]}
                      </Badge>
                    </td>
                    <td className="tabular py-3 pr-4 text-right text-ink">
                      {euro(anzeige.priceCents)}
                    </td>
                    <td className="tabular py-3 pr-4 text-right text-ink-muted">
                      {kilometer(anzeige.mileageKm) ?? '—'}
                    </td>
                    <td className="tabular py-3 pr-4 text-right text-ink-muted">
                      {anzeige._count.images}
                    </td>
                    <td className="tabular py-3 pr-4 text-right text-ink-muted">
                      {anzeige.viewCount}
                    </td>
                    <td className="py-3 pr-4 text-ink-muted">{anzeige.seller.displayName}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </DashboardShell>
  );
}
