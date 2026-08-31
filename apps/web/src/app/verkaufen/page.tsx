import { redirect } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

import { listOwnDrafts } from '@ap/db';

import { VinForm } from '@/components/sales/VinForm';
import { Badge } from '@/components/ui/Badge';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Term } from '@/components/ui/Term';
import { getCurrentSession } from '@/lib/session';

export const metadata: Metadata = {
  title: 'Fahrzeug verkaufen',
  description:
    'Fahrzeugdaten strukturiert erfassen und daraus eine Verkaufsanzeige erzeugen — ohne geratene Angaben.',
};

export const dynamic = 'force-dynamic';

const STATUS_BEZEICHNUNG: Record<string, string> = {
  VIN_ENTERED: 'VIN erfasst',
  VEHICLE_CONFIRMED: 'Fahrzeug bestätigt',
  DETAILS_PROVIDED: 'Angaben ergänzt',
  TEXT_GENERATED: 'Texte erstellt',
  PUBLISHED: 'veröffentlicht',
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
      <p className="mt-3 text-base leading-relaxed text-ink-muted">
        Beginnen Sie mit der <Term term="vin">Fahrzeug-Identifizierungsnummer</Term>.
        Daraus lesen wir aus, was tatsächlich darin steht — den Hersteller, die
        Herkunft und einen Hinweis auf das Modelljahr.
      </p>

      <Card className="mt-6">
        <CardBody className="space-y-2">
          <p className="text-sm font-semibold text-ink">
            Was die VIN nicht verrät
          </p>
          <p className="text-sm leading-relaxed text-ink-muted">
            Modell, Generation, Motor und Ausstattung stehen <strong>nicht</strong> in
            der Nummer. Sie stehen in herstellereigenen Datenbeständen. Deshalb
            wählen Sie diese Angaben im nächsten Schritt aus dem Katalog aus und
            bestätigen sie — statt dass wir raten und Sie es glauben müssen.
          </p>
        </CardBody>
      </Card>

      <div className="mt-8">
        <VinForm />
      </div>

      {entwuerfe.length > 0 ? (
        <Card className="mt-10">
          <CardHeader title="Ihre Entwürfe" eyebrow="Fortsetzen" />
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
                      Zuletzt geändert {entwurf.updatedAt.toLocaleDateString('de-DE')}
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
