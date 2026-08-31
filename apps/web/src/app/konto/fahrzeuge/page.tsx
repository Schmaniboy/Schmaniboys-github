import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

import { listPublishedManufacturers, listUserVehicles, MAX_FAHRZEUGE_JE_PERSON } from '@ap/db';

import { Badge } from '@/components/ui/Badge';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { DataGap } from '@/components/ui/DataGap';
import { FahrzeugAnlegen } from '@/components/konto/FahrzeugAnlegen';
import { KONTO_NAVIGATION } from '@/components/layout/konto-navigation';
import { getCurrentSession } from '@/lib/session';

export const metadata: Metadata = { title: 'Meine Fahrzeuge' };
export const dynamic = 'force-dynamic';

const ANTRIEB: Record<string, string> = {
  FRONT: 'Vorderrad',
  REAR: 'Hinterrad',
  ALL: 'Allrad',
};

/**
 * Die eigenen Fahrzeuge.
 *
 * Nicht dasselbe wie eine Anzeige: Was hier steht, ist nicht zu verkaufen.
 * Es dient dem Abgleich mit dem Katalog -- welche Ausstattung ist drin, was
 * war Serie, was war selten.
 */
export default async function FahrzeugePage() {
  const session = await getCurrentSession();
  if (!session) redirect('/anmelden');

  const [fahrzeuge, hersteller] = await Promise.all([
    listUserVehicles(session.principal.userId),
    listPublishedManufacturers(),
  ]);

  return (
    <DashboardShell
      title="Meine Fahrzeuge"
      description="Ihr eigenes Auto im Katalog wiederfinden — und sehen, was daran Serie war und was nicht."
      navigation={KONTO_NAVIGATION}
    >
      {fahrzeuge.length === 0 ? (
        <Card>
          <CardBody className="space-y-3">
            <h2 className="text-base font-semibold text-ink">Noch kein Fahrzeug eingetragen</h2>
            <p className="text-sm leading-relaxed text-ink-muted">
              Tragen Sie Ihr Auto ein, und Sie können nachschlagen, was daran ab Werk Serie
              war, was Aufpreis kostete und was selten ist. Sie brauchen dafür nicht alles
              zu wissen — eine Bezeichnung genügt zum Anfang, der Rest lässt sich ergänzen.
            </p>
          </CardBody>
        </Card>
      ) : (
        <ul className="space-y-4">
          {fahrzeuge.map((fahrzeug) => {
            const kette = fahrzeug.generation
              ? `${fahrzeug.generation.model.manufacturer.name} ${fahrzeug.generation.model.name} · ${fahrzeug.generation.name}`
              : null;

            return (
              <li key={fahrzeug.id}>
                <Card>
                  <CardHeader
                    title={fahrzeug.label}
                    eyebrow={kette ?? 'Baureihe nicht zugeordnet'}
                    action={
                      fahrzeug.generation ? (
                        <Link
                          href={`/katalog/${fahrzeug.generation.model.manufacturer.slug}/${fahrzeug.generation.model.slug}/${fahrzeug.generation.slug}/checker`}
                          className="text-sm text-accent underline-offset-4 hover:underline"
                        >
                          Ausstattung prüfen
                        </Link>
                      ) : null
                    }
                  />
                  <CardBody className="space-y-3">
                    <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
                      <div>
                        <dt className="text-xs text-ink-subtle">Motor</dt>
                        <dd className="text-sm text-ink">
                          {fahrzeug.powertrain ? (
                            <>
                              {fahrzeug.powertrain.engine.name}
                              {fahrzeug.powertrain.engine.code ? (
                                <span className="ml-2 font-mono text-xs text-ink-subtle">
                                  {fahrzeug.powertrain.engine.code}
                                </span>
                              ) : null}
                              {fahrzeug.powertrain.powerKw
                                ? ` · ${fahrzeug.powertrain.powerKw} kW`
                                : ''}
                              {` · ${ANTRIEB[fahrzeug.powertrain.driveType] ?? fahrzeug.powertrain.driveType}`}
                            </>
                          ) : (
                            <DataGap reason="nicht zugeordnet" />
                          )}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-ink-subtle">Facelift-Phase</dt>
                        <dd className="text-sm text-ink">
                          {fahrzeug.faceliftPhase?.name ?? <DataGap reason="nicht zugeordnet" />}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-ink-subtle">Modelljahr</dt>
                        <dd className="text-sm text-ink">
                          {fahrzeug.modelYear ?? <DataGap reason="nicht angegeben" />}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-ink-subtle">Kilometerstand</dt>
                        <dd className="text-sm text-ink">
                          {fahrzeug.mileageKm !== null ? (
                            `${fahrzeug.mileageKm.toLocaleString('de-DE')} km`
                          ) : (
                            <DataGap reason="nicht angegeben" />
                          )}
                        </dd>
                      </div>
                    </dl>

                    {fahrzeug.vin ? (
                      <div className="border-t border-line pt-3">
                        <p className="font-mono text-sm text-ink">{fahrzeug.vin}</p>
                        <p className="mt-1 text-xs leading-relaxed text-ink-subtle">
                          {fahrzeug.vinConfirmedByOwner
                            ? 'Von Ihnen bestätigt. Aus der Fahrgestellnummer selbst lässt sich ohne Herstellerdaten nur der Hersteller ablesen — alles Weitere beruht auf Ihrer Angabe.'
                            : 'Noch nicht bestätigt. Aus der Fahrgestellnummer selbst lässt sich ohne Herstellerdaten nur der Hersteller ablesen; die Zuordnung darunter ist ein Vorschlag, keine Auskunft.'}
                        </p>
                      </div>
                    ) : null}

                    {fahrzeug.equipment.length > 0 ? (
                      <div className="border-t border-line pt-3">
                        <p className="text-sm font-medium text-ink">
                          Vermerkte Ausstattung ({fahrzeug.equipment.length})
                        </p>
                        <ul className="mt-1.5 flex flex-wrap gap-1.5">
                          {fahrzeug.equipment.map((eintrag) => (
                            <li key={eintrag.id}>
                              <Badge
                                tone={eintrag.confirmed ? 'positive' : 'neutral'}
                                title={
                                  eintrag.confirmed
                                    ? 'Am Fahrzeug gesehen.'
                                    : 'Vermutet, aber noch nicht am Fahrzeug bestätigt.'
                                }
                              >
                                {eintrag.option.name}
                                {eintrag.confirmed ? '' : ' (vermutet)'}
                              </Badge>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    {fahrzeug.note ? (
                      <p className="border-t border-line pt-3 text-sm leading-relaxed text-ink-muted">
                        {fahrzeug.note}
                      </p>
                    ) : null}
                  </CardBody>
                </Card>
              </li>
            );
          })}
        </ul>
      )}

      {fahrzeuge.length < MAX_FAHRZEUGE_JE_PERSON ? (
        <div className="mt-6">
          <FahrzeugAnlegen hersteller={hersteller.map((h) => ({ slug: h.slug, name: h.name }))} />
        </div>
      ) : (
        <p className="mt-6 text-sm text-ink-subtle">
          Sie haben {MAX_FAHRZEUGE_JE_PERSON} Fahrzeuge gespeichert — mehr gehen nicht.
        </p>
      )}
    </DashboardShell>
  );
}
