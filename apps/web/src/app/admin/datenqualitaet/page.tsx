import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import {
  DATA_QUALITY_LABELS,
  type DataQuality,
  PRUEFUNG_GUELTIG_MONATE,
  Permission,
  can,
  systemClock,
} from '@ap/core';
import {
  findeAusstattungsDubletten,
  ladeDatenbestand,
  ladeReviewListe,
  ladeUeberfaelligePruefungen,
} from '@ap/db';

import { ADMIN_NAVIGATION } from '@/components/admin/navigation';
import { Badge } from '@/components/ui/Badge';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { getCurrentSession } from '@/lib/session';

export const metadata: Metadata = { title: 'Datenqualität' };
export const dynamic = 'force-dynamic';

/**
 * Datenqualitaet.
 *
 * Der Arbeitsvorrat der Redaktion an einem Ort: Was die Qualitaetskontrolle
 * beanstandet hat, was doppelt aussieht, wessen Pruefung zu lange her ist.
 *
 * Bewusst kein Zaehler, der auf null laufen soll. Ein Datensatz, der hier
 * steht, ist besser dran als einer, der falsch veroeffentlicht wurde -- und
 * eine Liste, die man leerraeumen will, wird leergeraeumt statt bearbeitet.
 */
export default async function DatenqualitaetPage() {
  const session = await getCurrentSession();
  if (!session || !can(session.principal.role, Permission.ADMIN_USERS)) notFound();

  const jetzt = systemClock.now();
  const grenze = new Date(jetzt);
  grenze.setMonth(grenze.getMonth() - PRUEFUNG_GUELTIG_MONATE);

  const [bestand, review, dubletten, ueberfaellig] = await Promise.all([
    ladeDatenbestand(),
    ladeReviewListe(100),
    findeAusstattungsDubletten(50),
    ladeUeberfaelligePruefungen(grenze, 50),
  ]);

  return (
    <DashboardShell
      title="Datenqualität"
      description="Was geprüft werden muss, was doppelt aussieht und wo Belege fehlen."
      navigation={ADMIN_NAVIGATION}
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardBody className="space-y-1">
            <p className="font-mono text-2xl tabular-nums text-ink">{review.length}</p>
            <p className="text-sm text-ink-muted">zur Prüfung gemeldet</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="space-y-1">
            <p className="font-mono text-2xl tabular-nums text-ink">
              {bestand.ohneQuelle.toLocaleString('de-DE')}
            </p>
            <p className="text-sm text-ink-muted">Einträge ohne jede Quelle</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="space-y-1">
            <p className="font-mono text-2xl tabular-nums text-ink">{dubletten.length}</p>
            <p className="text-sm text-ink-muted">mögliche Dubletten</p>
          </CardBody>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader
          title="Zur Prüfung"
          description="Datensätze, bei denen die Qualitätskontrolle einen Widerspruch gemeldet hat oder Quellen einander widersprechen. Sie bleiben sichtbar und tragen die Kennzeichnung."
        />
        <CardBody className="p-0">
          {review.length === 0 ? (
            <p className="px-5 py-6 text-sm text-ink-muted">
              Nichts gemeldet. Das heißt nicht, dass alles stimmt — es heißt, dass die
              automatischen Prüfungen nichts gefunden haben.
            </p>
          ) : (
            <ul className="divide-y divide-line">
              {review.map((eintrag) => {
                const guete = DATA_QUALITY_LABELS[eintrag.dataQuality as DataQuality];
                return (
                  <li
                    key={`${eintrag.bereich}-${eintrag.id}`}
                    className="flex flex-wrap items-baseline gap-x-3 gap-y-1 px-5 py-3"
                  >
                    <span className="w-40 shrink-0 text-xs uppercase tracking-wide text-ink-subtle">
                      {eintrag.bereich}
                    </span>
                    <span className="min-w-0 flex-1 text-sm text-ink">
                      {eintrag.kontext ? (
                        <Link
                          href={eintrag.kontext}
                          className="text-accent underline-offset-4 hover:underline"
                        >
                          {eintrag.bezeichnung}
                        </Link>
                      ) : (
                        eintrag.bezeichnung
                      )}
                    </span>
                    {guete ? (
                      <Badge tone={guete.tone} title={guete.explanation}>
                        {guete.mark} {guete.label}
                      </Badge>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}
        </CardBody>
      </Card>

      <Card className="mt-6">
        <CardHeader
          title="Mögliche Dubletten"
          description="Ausstattungen desselben Herstellers, deren Namen sich nur in Schreibweise oder Zeichensetzung unterscheiden. Der Ausstattungschecker zählt sie doppelt — der Ausstattungsgrad fällt dann, ohne dass am Fahrzeug etwas fehlt."
        />
        <CardBody className="p-0">
          {dubletten.length === 0 ? (
            <p className="px-5 py-6 text-sm text-ink-muted">Keine gefunden.</p>
          ) : (
            <ul className="divide-y divide-line">
              {dubletten.map((gruppe) => (
                <li key={`${gruppe.hersteller}-${gruppe.schluessel}`} className="px-5 py-3">
                  <p className="text-xs uppercase tracking-wide text-ink-subtle">
                    {gruppe.hersteller} · {gruppe.anzahl} Einträge
                  </p>
                  <p className="mt-1 text-sm text-ink">{gruppe.namen.join(' · ')}</p>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>

      <Card className="mt-6">
        <CardHeader
          title="Prüfung überfällig"
          description={`Als belegt gekennzeichnete Motoren, deren letzte Prüfung länger als ${PRUEFUNG_GUELTIG_MONATE} Monate zurückliegt oder nie stattfand. Technische Daten ändern sich nicht mehr — unsere Erfassung kann trotzdem fehlerhaft sein.`}
        />
        <CardBody className="p-0">
          {ueberfaellig.length === 0 ? (
            <p className="px-5 py-6 text-sm text-ink-muted">Nichts überfällig.</p>
          ) : (
            <ul className="divide-y divide-line">
              {ueberfaellig.map((motor) => (
                <li
                  key={motor.id}
                  className="flex flex-wrap items-baseline justify-between gap-2 px-5 py-3"
                >
                  <span className="text-sm text-ink">
                    {motor.manufacturer.name} {motor.name}
                    {motor.code ? (
                      <span className="ml-2 font-mono text-xs text-ink-subtle">{motor.code}</span>
                    ) : null}
                  </span>
                  <span className="text-xs text-ink-subtle">
                    {motor.lastVerifiedAt
                      ? `zuletzt geprüft ${motor.lastVerifiedAt.toLocaleDateString('de-DE')}`
                      : 'nie geprüft'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>

      <Card className="mt-6">
        <CardHeader title="Daten einlesen" />
        <CardBody className="space-y-3">
          <p className="text-sm leading-relaxed text-ink-muted">
            Katalogdaten kommen über die Import-Pipeline in die Datenbank. Jede Datei nennt
            ihre Quelle, jeder Datensatz darf eine eigene nennen — ohne Quelle kein Import.
          </p>
          <pre className="overflow-x-auto rounded-md border border-line bg-surface-2 px-4 py-3 text-xs text-ink">
            <code>{`# Probelauf — nichts wird geschrieben
npx tsx scripts/import-katalog.ts <datei.json>

# Übernehmen
npx tsx scripts/import-katalog.ts <datei.json> --schreiben`}</code>
          </pre>
          <p className="text-sm leading-relaxed text-ink-muted">
            Der Probelauf ist die Voreinstellung. Ein Import, der beim Schreiben merkt, dass
            die Hälfte der Verweise ins Leere zeigt, hat die andere Hälfte schon geschrieben.
          </p>
          <p className="text-sm text-ink-subtle">
            Format und ein Prüfbeispiel liegen in <code>docs/import/</code>.
          </p>
        </CardBody>
      </Card>
    </DashboardShell>
  );
}
