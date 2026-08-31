import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

import { systemClock } from '@ap/core';
import { ladeMerkzettel, listFavorites } from '@ap/db';

import { euro, kilometer } from '@/components/marketplace/ListingCard';
import { Badge } from '@/components/ui/Badge';
import { Card, CardBody } from '@/components/ui/Card';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { KONTO_NAVIGATION } from '@/components/layout/konto-navigation';
import { getCurrentSession } from '@/lib/session';

export const metadata: Metadata = { title: 'Merkliste' };
export const dynamic = 'force-dynamic';

/**
 * Die eigene Merkliste.
 *
 * Anzeigen, die inzwischen verkauft oder abgelaufen sind, bleiben stehen und
 * werden gekennzeichnet. Sie stillschweigend zu entfernen waere bequemer und
 * schlechter: Wer sich etwas gemerkt hat, soll erfahren, was daraus wurde.
 */
export default async function MerklistePage() {
  const session = await getCurrentSession();
  if (!session) redirect('/anmelden');

  const [eintraege, katalog] = await Promise.all([
    listFavorites(session.principal.userId, systemClock.now()),
    ladeMerkzettel(session.principal.userId),
  ]);

  return (
    <DashboardShell
      title="Merkliste"
      description="Was Sie sich gemerkt haben — samt dem, was daraus geworden ist."
      navigation={KONTO_NAVIGATION}
    >
      {/*
        Katalogeintraege zuerst: Sie aendern sich selten und bleiben
        bestehen. Anzeigen darunter, weil sie verkauft werden oder ablaufen
        -- und weil genau das dort steht.
      */}
      {katalog.length > 0 ? (
        <Card className="mb-6">
          <CardBody className="p-0">
            <div className="border-b border-line px-5 py-3">
              <h2 className="text-base font-semibold text-ink">Aus dem Fahrzeugwissen</h2>
              <p className="mt-0.5 text-sm text-ink-muted">
                {katalog.length} gemerkte {katalog.length === 1 ? 'Eintrag' : 'Einträge'}
              </p>
            </div>
            <ul className="divide-y divide-line">
              {katalog.map((eintrag) => (
                <li key={eintrag.id} className="px-5 py-3">
                  {eintrag.href ? (
                    <Link href={eintrag.href} className="group block">
                      <p className="text-sm font-medium text-ink group-hover:text-accent">
                        {eintrag.titel}
                      </p>
                      {eintrag.untertitel ? (
                        <p className="text-sm text-ink-subtle">{eintrag.untertitel}</p>
                      ) : null}
                    </Link>
                  ) : (
                    /*
                     * Das Ziel ist weg oder nicht mehr veroeffentlicht. Der
                     * Eintrag bleibt trotzdem stehen und sagt es -- ihn still
                     * zu entfernen waere bequemer und schlechter.
                     */
                    <div>
                      <p className="text-sm text-ink-subtle">
                        Dieser Eintrag ist nicht mehr veröffentlicht.
                      </p>
                      <p className="text-xs text-ink-subtle">
                        Gemerkt am {eintrag.createdAt.toLocaleDateString('de-DE')}
                      </p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      ) : null}

      {eintraege.length === 0 ? (
        <Card>
          <CardBody>
            <p className="text-sm leading-relaxed text-ink-muted">
              Ihre Merkliste ist leer. Auf jeder Anzeige im Marktplatz gibt es dafür eine
              Schaltfläche.
            </p>
            <p className="mt-4">
              <Link
                href="/marktplatz"
                className="text-sm text-ink underline-offset-4 hover:underline"
              >
                Zum Marktplatz
              </Link>
            </p>
          </CardBody>
        </Card>
      ) : (
        <ul className="space-y-3">
          {eintraege.map((eintrag) => (
            <li key={eintrag.anzeige.id}>
              <Card>
                <CardBody className="flex flex-wrap items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wide text-ink-subtle">
                      {eintrag.anzeige.vehicleLabel}
                    </p>
                    {eintrag.nochVerfuegbar ? (
                      <Link
                        href={`/marktplatz/${eintrag.anzeige.slug}`}
                        className="text-base font-medium text-ink underline-offset-4 hover:underline"
                      >
                        {eintrag.anzeige.title}
                      </Link>
                    ) : (
                      <span className="text-base font-medium text-ink-muted">
                        {eintrag.anzeige.title}
                      </span>
                    )}
                    <p className="mt-1 text-sm text-ink-muted">
                      {[kilometer(eintrag.anzeige.mileageKm), eintrag.anzeige.city]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="tabular text-lg font-semibold text-accent">
                      {euro(eintrag.anzeige.priceCents)}
                    </p>
                    {!eintrag.nochVerfuegbar ? (
                      <Badge tone="caution">
                        {eintrag.anzeige.status === 'SOLD' ? 'Verkauft' : 'Nicht mehr online'}
                      </Badge>
                    ) : null}
                  </div>
                </CardBody>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </DashboardShell>
  );
}
