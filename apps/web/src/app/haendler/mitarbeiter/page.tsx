import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

import { can, Permission } from '@ap/core';
import { listDealerMembers } from '@ap/db';

import { DealerMembers } from '@/components/dealer/DealerMembers';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { DEALER_NAVIGATION } from '@/components/dealer/navigation';
import { getCurrentSession } from '@/lib/session';

export const metadata: Metadata = { title: 'Mitarbeiter' };
export const dynamic = 'force-dynamic';

/**
 * Mitarbeiter des Betriebs.
 *
 * Wer die Liste sehen darf, entscheidet der Server. Ein Mitarbeiter ohne
 * Verwaltungsrecht bekommt sie gar nicht erst geliefert -- nicht nur eine
 * ausgegraute Schaltflaeche.
 */
export default async function MitarbeiterPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/anmelden');
  const dealerId = session.principal.dealerId;
  if (!dealerId) redirect('/haendler');

  const darfVerwalten = can(session.principal.role, Permission.DEALER_STAFF_MANAGE);

  if (!darfVerwalten) {
    return (
      <DashboardShell
        title="Mitarbeiter"
        description="Wer zu diesem Betrieb gehört."
        navigation={DEALER_NAVIGATION}
      >
        <Card>
          <CardBody>
            <p className="text-sm leading-relaxed text-ink-muted">
              Die Mitarbeiterverwaltung ist den Inhabern dieses Betriebs vorbehalten. Das
              ist keine Anzeigefrage: Die Liste wird Ihnen auch nicht geliefert.
            </p>
          </CardBody>
        </Card>
      </DashboardShell>
    );
  }

  const mitglieder = await listDealerMembers(dealerId);

  return (
    <DashboardShell
      title="Mitarbeiter"
      description="Wer zu diesem Betrieb gehört und was er darf."
      navigation={DEALER_NAVIGATION}
    >
      <Card>
        <CardHeader title="Rollen im Betrieb" eyebrow="Erläuterung" />
        <CardBody>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="font-medium text-ink">Inhaber</dt>
              <dd className="text-ink-muted">
                Darf das Profil ändern, Mitarbeiter aufnehmen, ihre Rolle ändern und sie
                entfernen. Sieht die Auswertungen.
              </dd>
            </div>
            <div>
              <dt className="font-medium text-ink">Mitarbeiter</dt>
              <dd className="text-ink-muted">
                Sieht Bestand und Auswertungen und kann im Namen des Betriebs inserieren.
                Ändert weder Profil noch Mitarbeiter.
              </dd>
            </div>
          </dl>
        </CardBody>
      </Card>

      <Card className="mt-4">
        <CardHeader title="Personen" eyebrow="Verwalten" />
        <CardBody>
          <DealerMembers
            eigeneKennung={session.principal.userId}
            mitglieder={mitglieder.map((person) => ({
              id: person.id,
              email: person.email,
              displayName: person.displayName,
              role: person.role,
            }))}
          />
        </CardBody>
      </Card>
    </DashboardShell>
  );
}
