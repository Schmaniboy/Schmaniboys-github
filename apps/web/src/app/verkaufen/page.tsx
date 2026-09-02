import { redirect } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

import { listOwnDrafts } from '@ap/db';

import { Badge } from '@/components/ui/Badge';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { VerkaufWizard } from '@/components/verkaufen/VerkaufWizard';
import { getCurrentSession } from '@/lib/session';

export const metadata: Metadata = {
  title: 'Fahrzeug verkaufen',
  description:
    'Fahrzeug Schritt fuer Schritt inserieren — Fahrzeugdaten, Zustand, Ausstattung, Bilder, Verkaufstext, Preis und PDF.',
};

export const dynamic = 'force-dynamic';

const STATUS_BEZEICHNUNG: Record<string, string> = {
  VIN_ENTERED: 'VIN erfasst',
  VEHICLE_CONFIRMED: 'Fahrzeug bestaetigt',
  DETAILS_PROVIDED: 'Angaben ergaenzt',
  TEXT_GENERATED: 'Texte erstellt',
  PUBLISHED: 'veroeffentlicht',
};

export default async function VerkaufenPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/anmelden');

  const entwuerfe = await listOwnDrafts(session.principal.userId);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="accent-rule mb-6" />
      <p className="eyebrow mb-2">Verkaufen</p>
      <h1 className="text-3xl font-semibold tracking-tight text-ink">Fahrzeug verkaufen</h1>
      <p className="mt-3 mb-8 text-base leading-relaxed text-ink-muted">
        In sieben Schritten zur professionellen Verkaufsanzeige — Fahrzeugdaten
        eingeben, Zustand beschreiben, Bilder vorbereiten und am Ende ein
        kostenloses PDF erhalten.
      </p>

      <VerkaufWizard />

      {entwuerfe.length > 0 ? (
        <Card className="mt-10">
          <CardHeader title="Ihre Entwuerfe" eyebrow="Fortsetzen" />
          <CardBody>
            <ul className="space-y-2">
              {entwuerfe.map((entwurf) => (
                <li
                  key={entwurf.id}
                  className="flex flex-wrap items-center justify-between gap-3 border-t border-line py-3 first:border-t-0 first:pt-0"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/verkaufen/entwurf/${entwurf.id}`}
                      className="text-sm text-ink hover:text-accent-strong"
                    >
                      {entwurf.generatedTitle ?? 'Entwurf ohne Titel'}
                    </Link>
                    <p className="mt-0.5 text-xs text-ink-subtle">
                      Zuletzt geaendert {entwurf.updatedAt.toLocaleDateString('de-DE')}
                    </p>
                  </div>
                  <Badge tone="neutral">
                    {STATUS_BEZEICHNUNG[entwurf.status] ?? entwurf.status}
                  </Badge>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      ) : null}
    </div>
  );
}
