import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

import { listNotifications, countUnreadNotifications } from '@ap/db';

import { DashboardShell } from '@/components/layout/DashboardShell';
import { KONTO_NAVIGATION } from '@/components/layout/konto-navigation';
import { Card, CardBody } from '@/components/ui/Card';
import { getCurrentSession } from '@/lib/session';
import { AlleGelesenKnopf } from './AlleGelesenKnopf';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Benachrichtigungen' };

const KIND_LABELS: Record<string, string> = {
  'message.received': 'Nachricht',
  'listing.expiring': 'Anzeige',
  'payment.confirmed': 'Zahlung',
  'listing.moderated': 'Moderation',
  'listing.sold': 'Verkauf',
};

function zeitformat(datum: Date): string {
  const diff = Date.now() - datum.getTime();
  const minuten = Math.floor(diff / 60_000);
  if (minuten < 1) return 'gerade eben';
  if (minuten < 60) return `vor ${minuten} Min.`;
  const stunden = Math.floor(minuten / 60);
  if (stunden < 24) return `vor ${stunden} Std.`;
  const tage = Math.floor(stunden / 24);
  if (tage === 1) return 'gestern';
  if (tage < 7) return `vor ${tage} Tagen`;
  return datum.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default async function BenachrichtigungenPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/anmelden');

  const userId = session.principal.userId;
  const [alle, ungelesen] = await Promise.all([
    listNotifications(userId),
    countUnreadNotifications(userId),
  ]);

  return (
    <DashboardShell
      title="Benachrichtigungen"
      description={
        ungelesen > 0
          ? `${ungelesen} ungelesene Benachrichtigung${ungelesen === 1 ? '' : 'en'}`
          : 'Alle Benachrichtigungen gelesen.'
      }
      navigation={KONTO_NAVIGATION}
      actions={ungelesen > 0 ? <AlleGelesenKnopf /> : undefined}
    >
      {alle.length === 0 ? (
        <Card>
          <CardBody>
            <p className="py-8 text-center text-sm text-ink-subtle">
              Noch keine Benachrichtigungen.
            </p>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-2">
          {alle.map((n) => {
            const ungelesen = n.readAt === null;
            const inner = (
              <div
                className={`flex items-start gap-4 rounded-lg border p-4 transition-colors ${
                  ungelesen
                    ? 'border-accent/20 bg-accent/[0.03]'
                    : 'border-line bg-surface-2'
                } hover:bg-surface-3`}
              >
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-3 text-xs font-semibold text-ink-muted">
                  {KIND_LABELS[n.kind]?.[0] ?? '●'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm ${ungelesen ? 'font-medium text-ink' : 'text-ink-muted'}`}>
                      {n.title}
                    </p>
                    {ungelesen ? (
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent" />
                    ) : null}
                  </div>
                  <p className="mt-0.5 text-sm text-ink-subtle">{n.body}</p>
                  <div className="mt-1.5 flex items-center gap-3 text-xs text-ink-subtle">
                    <span>{zeitformat(n.createdAt)}</span>
                    {KIND_LABELS[n.kind] ? (
                      <span className="rounded bg-surface-3 px-1.5 py-0.5 text-[11px]">
                        {KIND_LABELS[n.kind]}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            );

            return n.href ? (
              <Link key={n.id} href={n.href} className="block">
                {inner}
              </Link>
            ) : (
              <div key={n.id}>{inner}</div>
            );
          })}
        </div>
      )}
    </DashboardShell>
  );
}
