import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { LISTING_STATUS_LABELS, Permission, can, type ListingStatus } from '@ap/core';
import { moderationListings } from '@ap/db';

import { ADMIN_NAVIGATION } from '@/components/admin/navigation';
import { ModerationButtons } from '@/components/admin/ModerationButtons';
import { euro } from '@/components/marketplace/ListingCard';
import { Badge } from '@/components/ui/Badge';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { getCurrentSession } from '@/lib/session';

export const metadata: Metadata = { title: 'Anzeigenmoderation' };
export const dynamic = 'force-dynamic';

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AdminAnzeigenPage({ searchParams }: Props) {
  const session = await getCurrentSession();
  if (!session || !can(session.principal.role, Permission.LISTING_MODERATE)) notFound();

  const roh = await searchParams;
  const status = typeof roh.status === 'string' && roh.status ? roh.status : undefined;
  const seite = Number(typeof roh.seite === 'string' ? roh.seite : 0) || 0;

  const ergebnis = await moderationListings({ status, seite });

  return (
    <DashboardShell
      title="Anzeigen"
      description={`${ergebnis.gesamt.toLocaleString('de-DE')} Anzeigen`}
      navigation={ADMIN_NAVIGATION}
    >
      <Card className="mb-4">
        <CardBody>
          <form method="get" action="/admin/anzeigen" className="flex flex-wrap gap-2">
            <select
              name="status"
              defaultValue={status ?? ''}
              aria-label="Status"
              className="h-11 rounded-md border border-line-interactive bg-surface-1 px-3 text-base sm:text-sm text-ink"
            >
              <option value="">Alle Zustände</option>
              {(['DRAFT', 'ACTIVE', 'PAUSED', 'SOLD', 'EXPIRED'] as ListingStatus[]).map((wert) => (
                <option key={wert} value={wert}>
                  {LISTING_STATUS_LABELS[wert]}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="h-11 rounded-md bg-accent px-4 text-base sm:text-sm font-medium text-accent-ink transition-colors hover:bg-accent-strong"
            >
              Filtern
            </button>
          </form>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Moderation" eyebrow="Sichtbarkeit" />
        <CardBody>
          <p className="mb-4 text-sm leading-relaxed text-ink-muted">
            Eine Maßnahme entzieht die Sichtbarkeit, sie löscht nichts: Die Anzeige geht auf
            &bdquo;Pausiert&ldquo; und gehört weiterhin der einstellenden Person. Wird der Verdacht
            ausgeräumt, stellt dieselbe Maßnahme sie zurück. Jede Maßnahme braucht eine
            Begründung und steht danach im Protokoll.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[52rem] text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-subtle">
                  <th className="py-2 pr-4">Anzeige</th>
                  <th className="py-2 pr-4">Verkäufer</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4 text-right">Preis</th>
                  <th className="py-2 pr-4 text-right">Aufrufe</th>
                  <th className="py-2">Maßnahme</th>
                </tr>
              </thead>
              <tbody>
                {ergebnis.zeilen.map((zeile) => {
                  const zustand = zeile.status as ListingStatus;
                  return (
                    <tr key={zeile.id} className="border-b border-line/40">
                      <td className="py-3 pr-4">
                        {zustand === 'ACTIVE' ? (
                          <Link
                            href={`/marktplatz/${zeile.slug}`}
                            className="text-ink underline-offset-4 hover:underline"
                          >
                            {zeile.title}
                          </Link>
                        ) : (
                          <span className="text-ink">{zeile.title}</span>
                        )}
                        <p className="text-xs text-ink-subtle">{zeile.vehicleLabel}</p>
                      </td>
                      <td className="py-3 pr-4">
                        <p className="text-ink-muted">{zeile.seller.displayName}</p>
                        {zeile.dealer ? (
                          <p className="text-xs text-ink-subtle">{zeile.dealer.name}</p>
                        ) : null}
                      </td>
                      <td className="py-3 pr-4">
                        <Badge tone={zustand === 'ACTIVE' ? 'positive' : 'neutral'}>
                          {LISTING_STATUS_LABELS[zustand]}
                        </Badge>
                      </td>
                      <td className="tabular py-3 pr-4 text-right text-ink-muted">
                        {euro(zeile.priceCents)}
                      </td>
                      <td className="tabular py-3 pr-4 text-right text-ink-muted">
                        {zeile.viewCount}
                      </td>
                      <td className="py-3">
                        <ModerationButtons
                          ziel="LISTING"
                          id={zeile.id}
                          bezeichnung={zeile.title}
                          verborgen={zustand !== 'ACTIVE'}
                          moeglich={zustand !== 'SOLD' && zustand !== 'DELETED'}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </DashboardShell>
  );
}
