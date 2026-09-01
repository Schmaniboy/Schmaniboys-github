import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { Permission, can } from '@ap/core';
import { searchUsers } from '@ap/db';

import { ADMIN_NAVIGATION } from '@/components/admin/navigation';
import { UserTable } from '@/components/admin/UserTable';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { getCurrentSession } from '@/lib/session';

export const metadata: Metadata = { title: 'Benutzerverwaltung' };
export const dynamic = 'force-dynamic';

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AdminBenutzerPage({ searchParams }: Props) {
  const session = await getCurrentSession();
  if (!session || !can(session.principal.role, Permission.ADMIN_USERS)) notFound();

  const roh = await searchParams;
  const suche = typeof roh.q === 'string' ? roh.q : undefined;
  const rolle = typeof roh.rolle === 'string' && roh.rolle ? roh.rolle : undefined;
  const seite = Number(typeof roh.seite === 'string' ? roh.seite : 0) || 0;

  const ergebnis = await searchUsers({ suche, rolle, seite });
  const darfRollenVergeben = can(session.principal.role, Permission.ADMIN_ROLE_ASSIGN);

  return (
    <DashboardShell
      title="Benutzer"
      description={`${ergebnis.gesamt.toLocaleString('de-DE')} Konten`}
      navigation={ADMIN_NAVIGATION}
    >
      <Card className="mb-4">
        <CardBody>
          <form method="get" action="/admin/benutzer" className="flex flex-wrap gap-2">
            <input
              type="text"
              name="q"
              defaultValue={suche ?? ''}
              placeholder="Name oder E-Mail"
              aria-label="Suchbegriff"
              className="h-11 min-w-[14rem] flex-1 rounded-md border border-line-interactive bg-surface-1 px-3 text-base sm:text-sm text-ink placeholder:text-ink-subtle"
            />
            <select
              name="rolle"
              defaultValue={rolle ?? ''}
              aria-label="Rolle"
              className="h-11 rounded-md border border-line-interactive bg-surface-1 px-3 text-base sm:text-sm text-ink"
            >
              <option value="">Alle Rollen</option>
              {['USER', 'DEALER_STAFF', 'DEALER_OWNER', 'EDITOR', 'ADMIN', 'SUPER_ADMIN'].map(
                (wert) => (
                  <option key={wert} value={wert}>
                    {wert}
                  </option>
                ),
              )}
            </select>
            <button
              type="submit"
              className="h-11 rounded-md bg-accent px-4 text-base sm:text-sm font-medium text-accent-ink transition-colors hover:bg-accent-strong"
            >
              Suchen
            </button>
          </form>
        </CardBody>
      </Card>

      {!darfRollenVergeben ? (
        <Card className="mb-4">
          <CardBody>
            <p className="text-sm leading-relaxed text-ink-muted">
              Rollen vergibt ausschließlich die oberste Administration. Sie können Konten
              sperren und wieder freigeben.
            </p>
          </CardBody>
        </Card>
      ) : null}

      <Card>
        <CardHeader title="Konten" eyebrow="Verwalten" />
        <CardBody>
          <UserTable
            eigeneKennung={session.principal.userId}
            darfRollenVergeben={darfRollenVergeben}
            zeilen={ergebnis.zeilen.map((zeile) => ({
              id: zeile.id,
              email: zeile.email,
              displayName: zeile.displayName,
              role: zeile.role,
              status: zeile.status,
              dealerName: zeile.dealerName,
              listings: zeile.listings,
              balanceTokens: zeile.balanceTokens,
            }))}
          />
        </CardBody>
      </Card>
    </DashboardShell>
  );
}
