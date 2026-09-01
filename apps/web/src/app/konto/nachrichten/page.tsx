import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

import { listOwnConversations } from '@ap/db';

import { Badge } from '@/components/ui/Badge';
import { Card, CardBody } from '@/components/ui/Card';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { KONTO_NAVIGATION } from '@/components/layout/konto-navigation';
import { getCurrentSession } from '@/lib/session';

export const metadata: Metadata = { title: 'Nachrichten' };
export const dynamic = 'force-dynamic';

const ZUSTAND_TEXT: Record<string, string> = {
  OPEN: 'Offen',
  CLOSED: 'Geschlossen',
  BLOCKED: 'Gesperrt',
};

export default async function NachrichtenPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/anmelden');

  const gespraeche = await listOwnConversations(session.principal.userId);

  return (
    <DashboardShell
      title="Nachrichten"
      description="Ihre Gespräche zu Fahrzeugen."
      navigation={KONTO_NAVIGATION}
    >
      {gespraeche.length === 0 ? (
        <Card>
          <CardBody>
            <p className="text-sm leading-relaxed text-ink-muted">
              Sie haben noch keine Gespräche. Auf jeder Anzeige im Marktplatz gibt es eine
              Schaltfläche, um die anbietende Person anzuschreiben.
            </p>
            <p className="mt-4">
              <Link href="/marktplatz" className="text-sm text-ink underline-offset-4 hover:underline">
                Zum Marktplatz
              </Link>
            </p>
          </CardBody>
        </Card>
      ) : (
        <ul className="divide-y divide-line/40">
          {gespraeche.map((gespraech) => {
            const gegenueber =
              gespraech.initiatorId === session.principal.userId
                ? gespraech.recipient
                : gespraech.initiator;

            return (
              <li key={gespraech.id}>
                <Link
                  href={`/konto/nachrichten/${gespraech.id}`}
                  className="flex flex-wrap items-center justify-between gap-3 py-4 transition-colors hover:bg-surface-2"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink">
                      {gegenueber.displayName}
                      {gespraech.ungelesen > 0 ? (
                        <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-xs text-accent-ink">
                          {gespraech.ungelesen}
                        </span>
                      ) : null}
                    </p>
                    <p className="text-xs text-ink-subtle">
                      {gespraech.listingLabel ?? 'Ohne Fahrzeugbezug'}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-right">
                    {gespraech.state !== 'OPEN' ? (
                      <Badge tone="caution">{ZUSTAND_TEXT[gespraech.state]}</Badge>
                    ) : null}
                    <span className="text-xs text-ink-subtle">
                      {gespraech.lastMessageAt.toLocaleDateString('de-DE')}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </DashboardShell>
  );
}
