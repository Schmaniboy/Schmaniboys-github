import Link from 'next/link';
import type { Metadata } from 'next';

import {
  DATA_QUALITY_LABELS,
  type DataQuality,
  MAX_VERGLEICH,
  kwToPs,
  vergleiche,
} from '@ap/core';
import { alsVergleichskandidat, ladeVergleichsfahrzeuge } from '@ap/db';

import { Badge } from '@/components/ui/Badge';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { DataGap } from '@/components/ui/DataGap';
import { LinkButton } from '@/components/ui/Button';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Fahrzeugvergleich',
  description:
    'Bis zu vier Motorvarianten nebeneinander — mit ausgewiesenen Lücken statt geschätzter Werte.',
};

/**
 * Fahrzeugvergleich.
 *
 * Der heikle Teil ist nicht das Nebeneinanderstellen, sondern der Umgang
 * mit Luecken. Ein Merkmal wird nur dann als besser oder schlechter
 * markiert, wenn es bei ALLEN Fahrzeugen vorliegt -- sonst saehe das
 * vollstaendiger erfasste Fahrzeug automatisch besser aus. Wo das nicht
 * geht, steht der Grund.
 */
export default async function VergleichPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const roh = params.v;
  const ids = (Array.isArray(roh) ? roh : roh ? [roh] : [])
    .flatMap((wert) => wert.split(','))
    .map((wert) => wert.trim())
    .filter((wert) => wert.length > 0 && wert.length <= 40);

  const fahrzeuge = await ladeVergleichsfahrzeuge(ids);
  const ergebnis = vergleiche(fahrzeuge.map(alsVergleichskandidat));
  const fehlend = ids.length - fahrzeuge.length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="accent-rule mb-6" />
      <p className="eyebrow mb-3">Fahrzeugwissen</p>
      <h1 className="text-3xl font-semibold tracking-tight text-ink">Vergleich</h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-muted">
        Bis zu {MAX_VERGLEICH} Motorvarianten nebeneinander. Ein Wert wird nur dann als
        besser markiert, wenn er bei allen verglichenen Fahrzeugen vorliegt — eine Lücke ist
        kein schlechterer Wert.
      </p>

      {fahrzeuge.length === 0 ? (
        <Card className="mt-8">
          <CardBody className="space-y-4">
            <h2 className="text-base font-semibold text-ink">Noch nichts ausgewählt</h2>
            <p className="text-sm leading-relaxed text-ink-muted">
              Fahrzeuge werden aus der Suche in den Vergleich übernommen. Öffnen Sie die
              Fahrzeugsuche, filtern Sie auf das, was Sie interessiert, und wählen Sie dort
              bis zu {MAX_VERGLEICH} Varianten aus.
            </p>
            {fehlend > 0 ? (
              <p className="text-sm text-caution">
                {fehlend === ids.length
                  ? 'Die aufgerufenen Fahrzeuge gibt es nicht oder sie sind nicht veröffentlicht.'
                  : `${fehlend} der aufgerufenen Fahrzeuge gibt es nicht.`}
              </p>
            ) : null}
            <LinkButton href="/suche">Zur Fahrzeugsuche</LinkButton>
          </CardBody>
        </Card>
      ) : (
        <>
          {ergebnis.notes.length > 0 ? (
            <Card className="mt-8">
              <CardBody className="space-y-1.5">
                {ergebnis.notes.map((hinweis) => (
                  <p key={hinweis} className="text-sm leading-relaxed text-ink-muted">
                    {hinweis}
                  </p>
                ))}
                {fehlend > 0 ? (
                  <p className="text-sm text-caution">
                    {fehlend} der aufgerufenen Fahrzeuge wurden nicht gefunden.
                  </p>
                ) : null}
              </CardBody>
            </Card>
          ) : null}

          {/* Kopfzeile der Fahrzeuge -- auf dem Handy untereinander, sonst als
              Spalten. Eine waagerechte Tabelle mit vier Spalten ist auf einem
              Telefon unlesbar; deshalb zwei Darstellungen statt einer
              zusammengeschobenen. */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {fahrzeuge.map((fahrzeug) => {
              const marke = fahrzeug.generation.model.manufacturer;
              const modell = fahrzeug.generation.model;
              const guete = DATA_QUALITY_LABELS[fahrzeug.dataQuality as DataQuality];
              return (
                <Card key={fahrzeug.id}>
                  <CardBody className="space-y-2">
                    <p className="eyebrow">{marke.name}</p>
                    <h2 className="text-base font-semibold leading-snug text-ink">
                      {modell.name} {fahrzeug.engine.name}
                    </h2>
                    <p className="text-sm text-ink-muted">
                      {fahrzeug.generation.name}
                      {fahrzeug.generation.code ? ` (${fahrzeug.generation.code})` : ''}
                      {fahrzeug.generation.bodyType
                        ? ` · ${fahrzeug.generation.bodyType.name}`
                        : ''}
                    </p>
                    <p className="font-mono text-xs text-ink-subtle">
                      {fahrzeug.engine.code ? `Motorcode ${fahrzeug.engine.code}` : 'Motorcode nicht erfasst'}
                      {fahrzeug.engine.engineFamily
                        ? ` · ${fahrzeug.engine.engineFamily.name}`
                        : ''}
                    </p>
                    {guete ? (
                      <Badge tone={guete.tone} title={guete.explanation}>
                        <span aria-hidden="true" className="mr-1">
                          {guete.mark}
                        </span>
                        {guete.label}
                      </Badge>
                    ) : null}
                    <p className="pt-1">
                      <Link
                        href={`/katalog/${marke.slug}/${modell.slug}/${fahrzeug.generation.slug}/motor/${fahrzeug.id}`}
                        className="text-sm text-accent underline-offset-4 hover:underline"
                      >
                        Datenblatt öffnen
                      </Link>
                    </p>
                  </CardBody>
                </Card>
              );
            })}
          </div>

          <Card className="mt-6">
            <CardHeader
              title="Technische Daten"
              description="Grün markiert ist der beste Wert einer Zeile — aber nur, wenn er bei allen Fahrzeugen vorliegt und der Vergleich zulässig ist."
            />
            <CardBody className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[36rem] border-collapse text-sm">
                  <caption className="sr-only">
                    Technische Daten der ausgewählten Fahrzeuge im Vergleich
                  </caption>
                  <thead>
                    <tr className="border-b border-line">
                      <th scope="col" className="px-4 py-2.5 text-left font-medium text-ink-subtle">
                        Merkmal
                      </th>
                      {fahrzeuge.map((fahrzeug) => (
                        <th
                          key={fahrzeug.id}
                          scope="col"
                          className="px-4 py-2.5 text-left font-medium text-ink"
                        >
                          {fahrzeug.engine.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {ergebnis.rows.map((zeile) => (
                      <tr key={zeile.field.key}>
                        <th
                          scope="row"
                          className="px-4 py-2.5 text-left align-top font-normal text-ink-subtle"
                        >
                          {zeile.field.label}
                          {zeile.field.unit ? (
                            <span className="text-ink-subtle"> ({zeile.field.unit})</span>
                          ) : null}
                          {!zeile.comparable && zeile.incomparableReason ? (
                            <span className="mt-0.5 block text-xs text-ink-subtle">
                              {zeile.incomparableReason}
                            </span>
                          ) : null}
                        </th>
                        {zeile.cells.map((zelle) => (
                          <td key={zelle.candidateId} className="px-4 py-2.5 align-top">
                            {zelle.value === null ? (
                              <DataGap reason="nicht erfasst" />
                            ) : (
                              <span
                                className={
                                  zelle.best
                                    ? 'font-mono tabular-nums text-positive'
                                    : zelle.worst
                                      ? 'font-mono tabular-nums text-ink-muted'
                                      : 'font-mono tabular-nums text-ink'
                                }
                              >
                                {zeile.field.decimals
                                  ? zelle.value.toLocaleString('de-DE', {
                                      minimumFractionDigits: zeile.field.decimals,
                                      maximumFractionDigits: zeile.field.decimals,
                                    })
                                  : zelle.value.toLocaleString('de-DE')}
                                {zeile.field.key === 'powerKw' ? (
                                  <span className="ml-1.5 text-xs text-ink-subtle">
                                    ({kwToPs(zelle.value)} PS)
                                  </span>
                                ) : null}
                              </span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>

          <Card className="mt-6">
            <CardHeader title="Motor, Getriebe und Abgasnorm" />
            <CardBody className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[36rem] border-collapse text-sm">
                  <tbody className="divide-y divide-line">
                    {(
                      [
                        ['Motorcode', (f: (typeof fahrzeuge)[number]) => f.engine.code],
                        [
                          'Motorfamilie',
                          (f: (typeof fahrzeuge)[number]) => f.engine.engineFamily?.name ?? null,
                        ],
                        [
                          'Hubraum',
                          (f: (typeof fahrzeuge)[number]) =>
                            f.engine.displacementCcm
                              ? `${f.engine.displacementCcm.toLocaleString('de-DE')} cm³`
                              : null,
                        ],
                        [
                          'Zylinder',
                          (f: (typeof fahrzeuge)[number]) => f.engine.cylinders?.toString() ?? null,
                        ],
                        [
                          'Getriebe',
                          (f: (typeof fahrzeuge)[number]) =>
                            `${f.transmission.name}${f.transmission.gears ? ` · ${f.transmission.gears} Gänge` : ''}`,
                        ],
                        [
                          'Antrieb',
                          (f: (typeof fahrzeuge)[number]) =>
                            ({ FRONT: 'Vorderrad', REAR: 'Hinterrad', ALL: 'Allrad' })[
                              f.driveType
                            ],
                        ],
                        [
                          'Abgasnorm',
                          (f: (typeof fahrzeuge)[number]) =>
                            f.emissionStandard ?? f.engine.emissionStandard,
                        ],
                        [
                          'Bauzeit',
                          (f: (typeof fahrzeuge)[number]) =>
                            f.yearFrom ? `${f.yearFrom}–${f.yearTo ?? 'heute'}` : null,
                        ],
                      ] as const
                    ).map(([label, lies]) => (
                      <tr key={label}>
                        <th
                          scope="row"
                          className="px-4 py-2.5 text-left align-top font-normal text-ink-subtle"
                        >
                          {label}
                        </th>
                        {fahrzeuge.map((fahrzeug) => {
                          const wert = lies(fahrzeug);
                          return (
                            <td key={fahrzeug.id} className="px-4 py-2.5 align-top text-ink">
                              {wert ? wert : <DataGap reason="nicht erfasst" />}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </>
      )}
    </div>
  );
}
