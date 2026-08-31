import Link from 'next/link';
import type { Metadata } from 'next';

import { DATA_QUALITY_LABELS, type DataQuality } from '@ap/core';
import { sucheHsnTsn } from '@ap/db';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { DataQualityMark } from '@/components/ui/DataQualityMark';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'HSN/TSN nachschlagen',
  description:
    'Schlüsselnummern aus der Zulassungsbescheinigung nachschlagen — mit Quellenangabe und ohne erfundene Zuordnungen.',
};

const HSN_FORM = /^\d{4}$/;
const TSN_FORM = /^[A-Za-z0-9]{3}$/;

/**
 * HSN/TSN.
 *
 * Die beiden Nummern stehen in der Zulassungsbescheinigung Teil I, in den
 * Feldern 2.1 und 2.2. Zusammen bezeichnen sie eine Typvariante -- aber
 * nicht eindeutig ein Fahrzeug: Dieselbe Kombination kann mehrere Varianten
 * umfassen. Deshalb liefert diese Seite eine Liste und keinen einzelnen
 * Treffer, und deshalb steht bei jedem Eintrag, wie belegt er ist.
 */
export default async function HsnTsnPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const roh = (schluessel: string) => {
    const wert = params[schluessel];
    return (Array.isArray(wert) ? wert[0] : wert)?.trim() ?? '';
  };

  const hsn = roh('hsn').slice(0, 4);
  const tsn = roh('tsn').slice(0, 3).toUpperCase();

  const gesucht = hsn.length > 0 || tsn.length > 0;
  const gueltig = HSN_FORM.test(hsn) && TSN_FORM.test(tsn);
  const treffer = gueltig ? await sucheHsnTsn(hsn, tsn) : [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="accent-rule mb-6" />
      <p className="eyebrow mb-3">Fahrzeugwissen</p>
      <h1 className="text-3xl font-semibold tracking-tight text-ink">HSN und TSN</h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-muted">
        Die beiden Schlüsselnummern stehen in der Zulassungsbescheinigung Teil I: HSN in
        Feld 2.1, TSN in Feld 2.2. Sie bezeichnen eine Typvariante — nicht eindeutig ein
        einzelnes Fahrzeug.
      </p>

      <Card className="mt-8">
        <CardBody>
          <form method="get" className="flex flex-wrap items-end gap-4">
            <div className="min-w-0">
              <label htmlFor="hsn" className="mb-1.5 block text-sm text-ink">
                HSN <span className="text-ink-subtle">(Feld 2.1, vier Ziffern)</span>
              </label>
              <input
                id="hsn"
                name="hsn"
                defaultValue={hsn}
                inputMode="numeric"
                autoComplete="off"
                maxLength={4}
                pattern="[0-9]{4}"
                placeholder="0603"
                className="h-11 w-32 rounded-md border border-line bg-surface-2 px-3 font-mono text-base text-ink placeholder:text-ink-subtle focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
              />
            </div>
            <div className="min-w-0">
              <label htmlFor="tsn" className="mb-1.5 block text-sm text-ink">
                TSN <span className="text-ink-subtle">(Feld 2.2, drei Zeichen)</span>
              </label>
              <input
                id="tsn"
                name="tsn"
                defaultValue={tsn}
                autoComplete="off"
                maxLength={3}
                pattern="[A-Za-z0-9]{3}"
                placeholder="BGX"
                className="h-11 w-32 rounded-md border border-line bg-surface-2 px-3 font-mono text-base uppercase text-ink placeholder:text-ink-subtle focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
              />
            </div>
            <Button type="submit">Nachschlagen</Button>
          </form>

          {gesucht && !gueltig ? (
            <p className="mt-4 text-sm text-caution">
              Bitte vier Ziffern für die HSN und drei Zeichen für die TSN eingeben. Beide
              Nummern stehen in der Zulassungsbescheinigung Teil I nebeneinander.
            </p>
          ) : null}
        </CardBody>
      </Card>

      {gueltig ? (
        treffer.length === 0 ? (
          <Card className="mt-6">
            <CardBody className="space-y-3">
              <h2 className="text-base font-semibold text-ink">
                Zu {hsn}/{tsn} ist hier nichts erfasst
              </h2>
              <p className="text-sm leading-relaxed text-ink-muted">
                Das heißt nicht, dass es die Kombination nicht gibt — es heißt, dass sie in
                diesem Katalog nicht steht. Die Zuordnung von Schlüsselnummern zu
                Fahrzeugtypen stammt aus dem Verzeichnis des Kraftfahrt-Bundesamtes. Was
                daraus hier steht, ist eingepflegt und belegt; alles Übrige fehlt.
              </p>
              <p className="text-sm leading-relaxed text-ink-muted">
                Eine Zuordnung zu erraten wäre hier besonders schädlich: Sie führt zu
                falschen technischen Daten, falschen Wartungsangaben und im schlimmsten Fall
                zu einem falschen Ersatzteil.
              </p>
              <p className="text-sm text-ink-subtle">
                <Link href="/suche" className="text-accent underline-offset-4 hover:underline">
                  Über Marke und Modell suchen
                </Link>
              </p>
            </CardBody>
          </Card>
        ) : (
          <Card className="mt-6">
            <CardHeader
              title={`${treffer.length} Eintrag${treffer.length === 1 ? '' : 'e'} zu ${hsn}/${tsn}`}
              description="Eine Schlüsselnummernkombination kann mehrere Varianten umfassen. Prüfen Sie die Typbezeichnung in Ihren Papieren gegen die hier genannte."
            />
            <CardBody className="p-0">
              <ul className="divide-y divide-line">
                {treffer.map((eintrag) => {
                  const guete = DATA_QUALITY_LABELS[eintrag.dataQuality as DataQuality];
                  return (
                    <li key={eintrag.id} className="space-y-2 px-5 py-4">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="text-base font-semibold text-ink">
                          {eintrag.manufacturerName} {eintrag.typeName}
                        </h3>
                        <DataQualityMark
                          quality={eintrag.dataQuality}
                          lastVerifiedAt={eintrag.lastVerifiedAt}
                          showLabel
                        />
                      </div>

                      <p className="font-mono text-sm text-ink-muted">
                        {eintrag.hsn} / {eintrag.tsn}
                        {eintrag.yearFrom
                          ? ` · ${eintrag.yearFrom}–${eintrag.yearTo ?? 'heute'}`
                          : ''}
                      </p>

                      {eintrag.generation ? (
                        <p className="text-sm">
                          <Link
                            href={`/katalog/${eintrag.generation.model.manufacturer.slug}/${eintrag.generation.model.slug}/${eintrag.generation.slug}`}
                            className="text-accent underline-offset-4 hover:underline"
                          >
                            {eintrag.generation.model.manufacturer.name}{' '}
                            {eintrag.generation.model.name} · {eintrag.generation.name}
                            {eintrag.generation.code ? ` (${eintrag.generation.code})` : ''}
                          </Link>
                        </p>
                      ) : (
                        <p className="text-sm text-ink-subtle">
                          Noch keiner Generation im Katalog zugeordnet.
                        </p>
                      )}

                      {eintrag.powertrain ? (
                        <p className="text-sm text-ink-muted">
                          Motor: {eintrag.powertrain.engine.name}
                          {eintrag.powertrain.engine.code
                            ? ` (${eintrag.powertrain.engine.code})`
                            : ''}
                          {eintrag.powertrain.powerKw ? ` · ${eintrag.powertrain.powerKw} kW` : ''}
                        </p>
                      ) : null}

                      {eintrag.note ? (
                        <p className="text-sm text-ink-subtle">{eintrag.note}</p>
                      ) : null}

                      {guete && eintrag.dataQuality !== 'VERIFIED' ? (
                        <p className="text-sm leading-relaxed text-ink-subtle">
                          {guete.explanation}
                        </p>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </CardBody>
          </Card>
        )
      ) : null}

      <Card className="mt-6">
        <CardBody className="space-y-2">
          <h2 className="text-sm font-semibold text-ink">Wo die Nummern stehen</h2>
          <p className="text-sm leading-relaxed text-ink-muted">
            In der Zulassungsbescheinigung Teil I (dem Fahrzeugschein) finden Sie die HSN in
            Feld 2.1 und die TSN in Feld 2.2. In älteren Fahrzeugscheinen heißen sie
            Schlüsselnummer zu 2 und zu 3.
          </p>
          <Badge tone="neutral">Keine erfundenen Zuordnungen</Badge>
        </CardBody>
      </Card>
    </div>
  );
}
