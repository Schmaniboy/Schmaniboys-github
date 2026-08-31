import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

import { can, Permission } from '@ap/core';
import { findDealer } from '@ap/db';

import { DealerProfileForm } from '@/components/dealer/DealerProfileForm';
import { OpeningHoursForm } from '@/components/dealer/OpeningHoursForm';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { DEALER_NAVIGATION } from '@/components/dealer/navigation';
import { getCurrentSession } from '@/lib/session';

export const metadata: Metadata = { title: 'Händlerprofil' };
export const dynamic = 'force-dynamic';

export default async function HaendlerProfilPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/anmelden');
  const dealerId = session.principal.dealerId;
  if (!dealerId) redirect('/haendler');

  const haendler = await findDealer(dealerId);
  if (!haendler) redirect('/haendler');

  // Sichtbarkeit ist keine Berechtigung -- der Server prueft sie noch einmal.
  const darfAendern = can(session.principal.role, Permission.DEALER_MANAGE_OWN);

  return (
    <DashboardShell
      title="Händlerprofil"
      description="Was Kaufinteressenten über Ihren Betrieb sehen."
      navigation={DEALER_NAVIGATION}
    >
      {!darfAendern ? (
        <Card className="mb-4">
          <CardBody>
            <p className="text-sm leading-relaxed text-ink-muted">
              Sie sehen das Profil, dürfen es aber nicht ändern. Das kann ein Inhaber
              dieses Betriebs tun.
            </p>
          </CardBody>
        </Card>
      ) : null}

      <Card>
        <CardHeader title="Angaben zum Betrieb" eyebrow="Profil" />
        <CardBody>
          <DealerProfileForm
            schreibgeschuetzt={!darfAendern}
            logoStorageKey={haendler.logoStorageKey}
            werte={{
              name: haendler.name,
              description: haendler.description ?? '',
              contactEmail: haendler.contactEmail ?? '',
              contactPhone: haendler.contactPhone ?? '',
              websiteUrl: haendler.websiteUrl ?? '',
              street: haendler.street ?? '',
              postalCode: haendler.postalCode ?? '',
              city: haendler.city ?? '',
              vatId: haendler.vatId ?? '',
            }}
          />
        </CardBody>
      </Card>

      <Card className="mt-4">
        <CardHeader title="Öffnungszeiten" eyebrow="Profil" />
        <CardBody>
          <OpeningHoursForm
            schreibgeschuetzt={!darfAendern}
            spannen={haendler.openingHours.map((zeile) => ({
              weekday: zeile.weekday,
              opensMinute: zeile.opensMinute,
              closesMinute: zeile.closesMinute,
            }))}
          />
        </CardBody>
      </Card>

      <Card className="mt-4">
        <CardHeader title="Anbieterkennzeichnung" eyebrow="Rechtliches" />
        <CardBody>
          <p className="text-sm leading-relaxed text-ink-muted">
            Als gewerblicher Anbieter sind Sie zur Anbieterkennzeichnung verpflichtet.
            Anschrift, Kontakt und — sofern vorhanden — die Umsatzsteuer-Identifikationsnummer
            gehören deshalb ins Profil und erscheinen bei Ihren Anzeigen. Die Nummer wird
            hier nur auf ihre Form geprüft, nicht auf Gültigkeit: Dafür bräuchte es eine
            Abfrage beim Bundeszentralamt für Steuern, und eine selbst gebaute Prüfung gäbe
            eine Sicherheit vor, die es nicht gibt.
          </p>
        </CardBody>
      </Card>
    </DashboardShell>
  );
}
