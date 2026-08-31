import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

import { permissionsOf, systemClock } from '@ap/core';
import {
  countUnreadNotifications,
  listFavorites,
  listOwnConversations,
  listOwnListings,
  walletRepository,
} from '@ap/db';

import { LogoutButton } from '@/components/auth/LogoutButton';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { KONTO_NAVIGATION } from '@/components/layout/konto-navigation';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { DataGap } from '@/components/ui/DataGap';
import { getCurrentSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Mein Konto' };

interface DashboardTile {
  bezeichnung: string;
  wert: string;
  akzent?: boolean;
  href: string;
  hinweis?: string;
}

export default async function AccountPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/anmelden');

  const { user } = session;
  const userId = session.principal.userId;
  const permissions = [...permissionsOf(session.principal.role)];

  const [anzeigen, gespraeche, favoriten, benachrichtigungen, konto] = await Promise.all([
    listOwnListings(userId),
    listOwnConversations(userId),
    listFavorites(userId, systemClock.now()),
    countUnreadNotifications(userId),
    walletRepository.ensureWallet(userId),
  ]);

  const aktiveAnzeigen = anzeigen.filter((a) => a.status === 'ACTIVE').length;
  const ungeleseneNachrichten = gespraeche.reduce((s, g) => s + g.ungelesen, 0);

  const kacheln: DashboardTile[] = [
    {
      bezeichnung: 'Guthaben',
      wert: `${konto.availableTokens} Token`,
      href: '/konto/guthaben',
    },
    {
      bezeichnung: 'Anzeigen',
      wert: `${aktiveAnzeigen} aktiv`,
      href: '/konto/anzeigen',
      hinweis: anzeigen.length > aktiveAnzeigen ? `${anzeigen.length} gesamt` : undefined,
    },
    {
      bezeichnung: 'Nachrichten',
      wert: ungeleseneNachrichten > 0 ? `${ungeleseneNachrichten} ungelesen` : 'Keine neuen',
      akzent: ungeleseneNachrichten > 0,
      href: '/konto/nachrichten',
    },
    {
      bezeichnung: 'Merkliste',
      wert: `${favoriten.length} Einträge`,
      href: '/konto/merkliste',
    },
  ];

  if (benachrichtigungen > 0) {
    kacheln.push({
      bezeichnung: 'Benachrichtigungen',
      wert: `${benachrichtigungen} ungelesen`,
      akzent: true,
      href: '#',
    });
  }

  return (
    <DashboardShell
      title="Mein Konto"
      description="Ihre Zugangsdaten und Aktivitäten auf einen Blick."
      navigation={KONTO_NAVIGATION}
      actions={<LogoutButton />}
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {kacheln.map((kachel) => (
          <Link
            key={kachel.bezeichnung}
            href={kachel.href}
            className="group rounded-lg border border-line bg-surface-2 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-line-interactive hover:bg-surface-3 hover:shadow-raised"
          >
            <p className="text-xs uppercase tracking-wide text-ink-subtle">
              {kachel.bezeichnung}
            </p>
            <p
              className={`mt-1 text-lg font-semibold tabular-nums ${kachel.akzent ? 'text-accent' : 'text-ink'}`}
            >
              {kachel.wert}
            </p>
            {kachel.hinweis ? (
              <p className="mt-0.5 text-xs text-ink-subtle">{kachel.hinweis}</p>
            ) : null}
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Zugangsdaten" eyebrow="Konto" />
          <CardBody>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-ink-subtle">Name</dt>
                <dd className="text-ink">{user.displayName}</dd>
              </div>
              <div>
                <dt className="text-ink-subtle">E-Mail-Adresse</dt>
                <dd className="text-ink">{user.email}</dd>
              </div>
              <div>
                <dt className="text-ink-subtle">Rolle</dt>
                <dd className="text-ink">{user.role}</dd>
              </div>
              <div>
                <dt className="text-ink-subtle">Händlerzugehörigkeit</dt>
                <dd>
                  {user.dealerId ? (
                    <span className="text-ink">{user.dealerId}</span>
                  ) : (
                    <DataGap reason="kein Händlerkonto" />
                  )}
                </dd>
              </div>
            </dl>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Berechtigungen" eyebrow="Zugriff" />
          <CardBody>
            <p className="mb-3 text-xs text-ink-subtle">
              Diese Liste dient der Anzeige. Ob eine Aktion erlaubt ist,
              entscheidet in jedem Fall der Server.
            </p>
            <ul className="flex flex-wrap gap-1.5">
              {permissions.map((permission) => (
                <li
                  key={permission}
                  className="rounded-sm border border-line px-2 py-0.5 font-mono text-xs text-ink-muted"
                >
                  {permission}
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>
    </DashboardShell>
  );
}
