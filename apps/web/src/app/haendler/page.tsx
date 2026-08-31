import Link from 'next/link';
import type { Metadata } from 'next';

import { formatiereKennzahl, systemClock } from '@ap/core';
import { dealerStatistics, findDealer } from '@ap/db';

import { ComingSoon } from '@/components/layout/ComingSoon';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { DEALER_NAVIGATION } from '@/components/dealer/navigation';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { getCurrentSession } from '@/lib/session';

export const metadata: Metadata = { title: 'Für Händler' };

/*
 * Bewusst dynamisch: /haendler liegt in NONCE_PREFIXES, weil hier der
 * angemeldete Haendlerbereich liegt. Eine statische Seite unter diesem
 * Praefix wuerde ihre Skripte durch die Nonce-Richtlinie verlieren -- genau
 * das prueft tests/csp-routes.test.ts.
 */
export const dynamic = 'force-dynamic';

/**
 * Einstieg in den Haendlerbereich.
 *
 * Wer keinem Betrieb angehoert, sieht die Vorstellung. Wer angehoert, sieht
 * die Kennzahlen. Die Unterscheidung faellt auf dem Server -- was der Browser
 * anzeigt, ist nie eine Berechtigung.
 */
export default async function HaendlerPage() {
  const session = await getCurrentSession();
  const dealerId = session?.principal.dealerId;

  if (!session || !dealerId) {
    return (
      <ComingSoon
        eyebrow="Händler"
        title="Der Händlerbereich"
        description="Autohäuser bekommen einen eigenen Bereich mit Bestand, Anzeigen, Mitarbeiterrechten und Auswertungen. Händlerdaten sind dabei strikt voneinander getrennt. Die Freischaltung eines Betriebs läuft über die Administration."
        phase="MASTERPLAN Phase 10"
        scope={[
          'Händlerprofil, Kontakt, Öffnungszeiten und Standort',
          'Fahrzeugbestand und Anzeigenverwaltung',
          'Mitarbeiter mit getrennten Rechten',
          'Auswertungen zu Bestand, Standzeit und Tokenverbrauch',
        ]}
      />
    );
  }

  const [haendler, kennzahlen] = await Promise.all([
    findDealer(dealerId),
    dealerStatistics(dealerId, systemClock.now()),
  ]);

  const gemessen = kennzahlen.filter((k) => k.zustand === 'GEMESSEN');
  const fehlend = kennzahlen.filter((k) => k.zustand !== 'GEMESSEN');

  return (
    <DashboardShell
      title={haendler?.name ?? 'Händlerbereich'}
      description="Bestand, Anzeigen und Auswertungen Ihres Betriebs."
      navigation={DEALER_NAVIGATION}
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {gemessen.map((kennzahl) => (
          <div key={kennzahl.id} className="rounded-md border border-line/60 bg-surface-2 p-4">
            <p className="text-xs uppercase tracking-wide text-ink-subtle">{kennzahl.label}</p>
            <p className="tabular mt-1 text-2xl font-semibold text-ink">
              {formatiereKennzahl(kennzahl)}
            </p>
          </div>
        ))}
      </div>

      {fehlend.length > 0 ? (
        <Card className="mt-6">
          <CardHeader title="Wozu es keine Zahl gibt" eyebrow="Ehrlich gesagt" />
          <CardBody>
            <dl className="space-y-3 text-sm">
              {fehlend.map((kennzahl) => (
                <div key={kennzahl.id}>
                  <dt className="font-medium text-ink">{kennzahl.label}</dt>
                  <dd className="mt-0.5 leading-relaxed text-ink-muted">{kennzahl.hinweis}</dd>
                </div>
              ))}
            </dl>
          </CardBody>
        </Card>
      ) : null}

      <Card className="mt-4">
        <CardHeader title="Tokenverbrauch" eyebrow="Einordnung" />
        <CardBody>
          <p className="text-sm leading-relaxed text-ink-muted">
            Der ausgewiesene Verbrauch summiert die Buchungen aller Personen, die zu diesem
            Betrieb gehören. Guthaben hängt am Konto der Person, nicht am Betrieb — wer
            privat etwas erzeugt, taucht deshalb ebenfalls hier auf. Das ist eine Näherung
            und keine Betriebsabrechnung.
          </p>
        </CardBody>
      </Card>

      <p className="mt-6 text-sm text-ink-muted">
        <Link href="/haendler/bestand" className="underline-offset-4 hover:underline">
          Zum Fahrzeugbestand
        </Link>
      </p>
    </DashboardShell>
  );
}
