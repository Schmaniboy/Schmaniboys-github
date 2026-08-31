import type { Metadata } from 'next';

import { DATA_QUALITY_LABELS, type DataQuality, bestandsSatz } from '@ap/core';
import { ladeDatenbestand } from '@ap/db';

import { Badge } from '@/components/ui/Badge';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';

export const metadata: Metadata = {
  title: 'Datenbestand',
  description:
    'Wie viele Datensätze erfasst sind, wie belegt sie sind — und wo die Gesamtzahl unbekannt ist.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 120;

/**
 * Was der Katalog enthaelt -- und was er nicht enthaelt.
 *
 * Diese Seite ist der Gegenentwurf zu dem, was Fahrzeugdatenbanken sonst
 * zeigen. Ueblich ist eine grosse Zahl ("2,4 Millionen Fahrzeugvarianten")
 * und daneben ein Fortschrittsbalken auf 100 Prozent. Beides ist eine
 * Behauptung ueber etwas, das niemand nachgezaehlt hat.
 *
 * Hier steht die erfasste Anzahl -- und ein Anteil nur dort, wo jemand eine
 * bekannte Gesamtzahl MIT Quelle hinterlegt hat. Sonst steht ausdruecklich
 * "Gesamtzahl nicht belegt".
 */
export default async function DatenbestandPage() {
  const bestand = await ladeDatenbestand();
  const gesamtGuete = bestand.guete.reduce((summe, zeile) => summe + zeile.anzahl, 0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="accent-rule mb-6" />
      <p className="eyebrow mb-3">Fahrzeugwissen</p>
      <h1 className="text-3xl font-semibold tracking-tight text-ink">Datenbestand</h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-muted">
        Diese Seite sagt, wie viel hier steht — und wie viel nicht. Ein Anteil in Prozent
        erscheint nur dort, wo eine bekannte Gesamtzahl mit Quelle hinterlegt ist. Überall
        sonst steht die erfasste Anzahl und der Hinweis, dass die Gesamtzahl offen ist.
      </p>

      <Card className="mt-8">
        <CardHeader
          title="Bestand nach Bereich"
          description={
            <>
              {bestandsSatz(bestand.zeilen)} Wo keine Gesamtzahl belegt ist, steht die
              erfasste Anzahl ohne Anteil — wie viele es insgesamt gibt, ist dort nicht
              hinterlegt.
            </>
          }
        />
        <CardBody className="p-0">
          <ul className="divide-y divide-line">
            {bestand.zeilen.map((zeile) => (
              <li
                key={`${zeile.aspect}-${zeile.label}`}
                className="flex flex-col gap-1.5 px-5 py-4 sm:flex-row sm:items-baseline sm:gap-6"
              >
                <div className="flex items-baseline gap-3 sm:w-64 sm:shrink-0">
                  <span className="font-mono text-lg tabular-nums text-ink">
                    {zeile.recorded.toLocaleString('de-DE')}
                  </span>
                  <span className="text-sm text-ink-muted">{zeile.label}</span>
                </div>
                <div className="min-w-0 flex-1">
                  {zeile.percent === null ? (
                    /*
                     * Bewusst nur zwei Worte statt des ganzen Satzes: Er stand
                     * fuenfzehnmal untereinander und wurde dadurch zu Tapete.
                     * Was er sagt, steht einmal ueber der Liste.
                     */
                    <p className="text-sm text-ink-subtle">Gesamtzahl nicht belegt</p>
                  ) : (
                    <div className="space-y-1.5">
                      <div
                        className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2"
                        role="img"
                        aria-label={`${zeile.percent} Prozent`}
                      >
                        <div
                          className="h-full rounded-full bg-accent"
                          style={{ width: `${Math.min(100, zeile.percent)}%` }}
                        />
                      </div>
                      <p className="text-sm text-ink-muted">
                        {zeile.recorded.toLocaleString('de-DE')} von{' '}
                        {zeile.knownTotal?.toLocaleString('de-DE')} ({zeile.percent} %)
                        {zeile.knownTotalSource ? (
                          <span className="text-ink-subtle">
                            {' '}
                            · Gesamtzahl laut {zeile.knownTotalSource}
                          </span>
                        ) : null}
                      </p>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>

      <Card className="mt-6">
        <CardHeader
          title="Wie belegt der Bestand ist"
          description={
            gesamtGuete === 0
              ? 'Noch keine Datensätze erfasst.'
              : `${gesamtGuete.toLocaleString('de-DE')} Datensätze aus Motoren, Antriebskombinationen, ` +
                'Generationen, Ausstattungen, Verfügbarkeiten und Bildern.'
          }
        />
        <CardBody className="space-y-4">
          {gesamtGuete === 0 ? (
            <p className="text-sm text-ink-muted">
              Sobald Daten eingepflegt sind, steht hier, welcher Anteil belegt, teilweise
              belegt oder ungeprüft ist.
            </p>
          ) : (
            <ul className="space-y-3">
              {bestand.guete.map((zeile) => {
                const beschreibung = DATA_QUALITY_LABELS[zeile.quality as DataQuality];
                if (!beschreibung) return null;
                const anteil = Math.round((zeile.anzahl / gesamtGuete) * 100);
                return (
                  <li key={zeile.quality} className="space-y-1">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <Badge tone={beschreibung.tone} title={beschreibung.explanation}>
                        <span aria-hidden="true" className="mr-1">
                          {beschreibung.mark}
                        </span>
                        {beschreibung.label}
                      </Badge>
                      <span className="font-mono text-sm tabular-nums text-ink">
                        {zeile.anzahl.toLocaleString('de-DE')}
                      </span>
                      <span className="text-sm text-ink-subtle">{anteil} %</span>
                    </div>
                    <p className="text-sm leading-relaxed text-ink-muted">
                      {beschreibung.explanation}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </CardBody>
      </Card>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Card>
          <CardBody className="space-y-2">
            <p className="font-mono text-2xl tabular-nums text-ink">
              {bestand.ohneQuelle.toLocaleString('de-DE')}
            </p>
            <h2 className="text-sm font-semibold text-ink">Einträge ohne jede Quelle</h2>
            <p className="text-sm leading-relaxed text-ink-muted">
              Motoren, Generationen, Antriebskombinationen und Ausstattungen, zu denen keine
              einzige Quellenangabe gespeichert ist. Sie lassen sich nicht nachprüfen und
              werden nicht veröffentlicht.
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="space-y-2">
            <p className="font-mono text-2xl tabular-nums text-ink">
              {bestand.zurPruefung.toLocaleString('de-DE')}
            </p>
            <h2 className="text-sm font-semibold text-ink">Einträge zur Prüfung</h2>
            <p className="text-sm leading-relaxed text-ink-muted">
              Datensätze, bei denen die Qualitätskontrolle einen Widerspruch gemeldet hat
              oder Quellen einander widersprechen. Sie bleiben sichtbar und tragen die
              Kennzeichnung — sie werden nicht stillschweigend geglättet.
            </p>
          </CardBody>
        </Card>
      </div>

      <Card className="mt-6">
        <CardBody className="space-y-3">
          <h2 className="text-base font-semibold text-ink">Warum hier keine große Zahl steht</h2>
          <p className="text-sm leading-relaxed text-ink-muted">
            Es wäre einfach, diesen Katalog mit zehntausend Motorvarianten zu füllen. Die
            Bezeichnungen sind bekannt, die Muster auch — man müsste sie nur fortschreiben.
            Das Ergebnis sähe vollständig aus und wäre wertlos: Wer einen Motorcode
            nachschlägt, tut das, weil er eine verlässliche Antwort braucht.
          </p>
          <p className="text-sm leading-relaxed text-ink-muted">
            Deshalb kommt hier nichts hinein, was nicht aus einer nachprüfbaren Unterlage
            stammt. Hundert belegte Varianten sind mehr wert als zehntausend plausible.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
