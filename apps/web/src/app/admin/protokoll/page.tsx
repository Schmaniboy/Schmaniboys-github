import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { Permission, can } from '@ap/core';
import { auditEntries } from '@ap/db';

import { ADMIN_NAVIGATION } from '@/components/admin/navigation';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { getCurrentSession } from '@/lib/session';

export const metadata: Metadata = { title: 'Protokoll' };
export const dynamic = 'force-dynamic';

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Das Protokoll.
 *
 * Es wird gezeigt, nicht bearbeitet: Es gibt keine Schaltflaeche, die einen
 * Eintrag aendert oder loescht. Ein Protokoll, das sich aendern laesst, ist
 * keins.
 */
export default async function AdminProtokollPage({ searchParams }: Props) {
  const session = await getCurrentSession();
  if (!session || !can(session.principal.role, Permission.ADMIN_AUDIT_READ)) notFound();

  const roh = await searchParams;
  const action = typeof roh.action === 'string' && roh.action ? roh.action : undefined;
  const seite = Number(typeof roh.seite === 'string' ? roh.seite : 0) || 0;

  const ergebnis = await auditEntries({ action, seite });

  return (
    <DashboardShell
      title="Protokoll"
      description={`${ergebnis.gesamt.toLocaleString('de-DE')} Einträge`}
      navigation={ADMIN_NAVIGATION}
    >
      <Card className="mb-4">
        <CardBody>
          <form method="get" action="/admin/protokoll" className="flex flex-wrap gap-2">
            <input
              type="text"
              name="action"
              defaultValue={action ?? ''}
              placeholder="Ereignisart, etwa role.assigned"
              aria-label="Ereignisart"
              className="h-11 min-w-[16rem] flex-1 rounded-md border border-line-interactive bg-surface-1 px-3 font-mono text-base sm:text-sm text-ink placeholder:text-ink-subtle"
            />
            <button
              type="submit"
              className="h-11 rounded-md bg-accent px-4 text-base sm:text-sm font-medium text-on-accent transition-colors hover:bg-accent-strong"
            >
              Filtern
            </button>
          </form>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Einträge" eyebrow="Unveränderlich" />
        <CardBody>
          <p className="mb-4 text-sm leading-relaxed text-ink-muted">
            Das Protokoll wird gezeigt, nicht bearbeitet. Es gibt hier keine Schaltfläche,
            die einen Eintrag ändert oder löscht — ein Protokoll, das sich ändern lässt,
            ist keins.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[56rem] text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-subtle">
                  <th className="py-2 pr-4">Zeitpunkt</th>
                  <th className="py-2 pr-4">Ereignis</th>
                  <th className="py-2 pr-4">Handelnde</th>
                  <th className="py-2 pr-4">Gegenstand</th>
                  <th className="py-2">Angaben</th>
                </tr>
              </thead>
              <tbody>
                {ergebnis.zeilen.map((zeile) => (
                  <tr key={zeile.id} className="border-b border-line/40 align-top">
                    <td className="tabular py-2 pr-4 text-xs text-ink-subtle">
                      {zeile.createdAt.toLocaleString('de-DE')}
                    </td>
                    <td className="py-2 pr-4 font-mono text-xs text-accent">{zeile.action}</td>
                    <td className="py-2 pr-4 text-ink-muted">
                      {zeile.actor?.displayName ?? 'System'}
                    </td>
                    <td className="py-2 pr-4 text-ink-muted">
                      {zeile.subjectType}
                      {zeile.subjectId ? (
                        <span className="block font-mono text-xs text-ink-subtle">
                          {zeile.subjectId}
                        </span>
                      ) : null}
                    </td>
                    <td className="py-2 font-mono text-xs text-ink-subtle">
                      {zeile.metadata ? JSON.stringify(zeile.metadata) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </DashboardShell>
  );
}
