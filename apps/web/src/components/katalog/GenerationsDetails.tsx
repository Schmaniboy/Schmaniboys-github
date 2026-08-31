import {
  AVAILABILITY_LABELS,
  type DataQuality,
  PAINT_KIND_LABELS,
  RARITY_LABELS,
  formatBuildPeriod,
} from '@ap/core';

import { Badge } from '@/components/ui/Badge';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { DataGap } from '@/components/ui/DataGap';
import { DataQualityMark } from '@/components/ui/DataQualityMark';

/**
 * Modelljahre, Sondermodelle, Lackfarben und Radvarianten.
 *
 * Alle vier haben dasselbe Muster: Sie erscheinen nur, wenn etwas erfasst
 * ist. Ein leerer Abschnitt mit der Ueberschrift "Lackfarben" und dem Text
 * "keine erfasst" waere auf jeder Seite viermal zu lesen und traegt nichts
 * bei -- was fehlt, steht gesammelt auf der Datenbestandsseite.
 */

interface Guete {
  dataQuality: DataQuality;
  lastVerifiedAt: Date | null;
}

function euro(cents: number | null, waehrung: string | null): string | null {
  if (cents === null) return null;
  return (cents / 100).toLocaleString('de-DE', {
    style: 'currency',
    currency: waehrung ?? 'EUR',
    maximumFractionDigits: 0,
  });
}

export interface GenerationsDetailsDaten {
  modelljahre: (Guete & {
    id: string;
    year: number;
    changes: string | null;
    faceliftPhase: { name: string } | null;
  })[];
  sondermodelle: (Guete & {
    id: string;
    name: string;
    code: string | null;
    yearFrom: number | null;
    yearTo: number | null;
    buildCount: number | null;
    marketRegion: string | null;
    description: string | null;
    distinguishingFeatures: string | null;
    faceliftPhase: { name: string } | null;
    items: { optional: boolean; option: { id: string; name: string; optionCode: string | null } }[];
  })[];
  lackfarben: (Guete & {
    id: string;
    kind: keyof typeof AVAILABILITY_LABELS;
    yearFrom: number | null;
    yearTo: number | null;
    surchargeCents: number | null;
    surchargeCurrency: string | null;
    surchargeAsOf: Date | null;
    marketRegion: string | null;
    note: string | null;
    paintColor: {
      id: string;
      name: string;
      code: string | null;
      kind: keyof typeof PAINT_KIND_LABELS;
      approximateHex: string | null;
      rarity: string | null;
    };
  })[];
  raeder: (Guete & {
    id: string;
    kind: keyof typeof AVAILABILITY_LABELS;
    yearFrom: number | null;
    yearTo: number | null;
    surchargeCents: number | null;
    note: string | null;
    trimLine: { name: string } | null;
    wheelOption: {
      id: string;
      name: string;
      code: string | null;
      diameterInch: number | null;
      widthInch: unknown;
      tyreSize: string | null;
      design: string | null;
      rarity: string | null;
    };
  })[];
}

export function GenerationsDetails({ daten }: { daten: GenerationsDetailsDaten }) {
  const { modelljahre, sondermodelle, lackfarben, raeder } = daten;

  return (
    <>
      {modelljahre.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-ink">Modelljahre</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
            Baujahr und Modelljahr sind nicht dasselbe: Ein im Oktober gebauter Wagen kann
            das Modelljahr des Folgejahres tragen — und dessen Ausstattungsumfang.
          </p>
          <Card className="mt-4">
            <CardBody className="p-0">
              <ul className="divide-y divide-line">
                {modelljahre.map((jahr) => (
                  <li key={jahr.id} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 px-5 py-3">
                    <span className="w-16 shrink-0 font-mono text-base tabular-nums text-ink">
                      {jahr.year}
                    </span>
                    <span className="min-w-0 flex-1 text-sm text-ink-muted">
                      {jahr.changes ?? <DataGap reason="keine Änderungen erfasst" />}
                    </span>
                    {jahr.faceliftPhase ? (
                      <Badge tone="neutral">{jahr.faceliftPhase.name}</Badge>
                    ) : null}
                    <DataQualityMark
                      quality={jahr.dataQuality}
                      lastVerifiedAt={jahr.lastVerifiedAt}
                    />
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </section>
      ) : null}

      {sondermodelle.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-ink">Sondermodelle</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
            Sondermodelle bündeln Ausstattung, die einzeln teuer war. Beim Gebrauchtkauf sind
            sie oft der einzige Weg zu einer bestimmten Kombination.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {sondermodelle.map((serie) => (
              <Card key={serie.id}>
                <CardHeader
                  title={serie.name}
                  eyebrow={
                    [
                      serie.code,
                      formatBuildPeriod(serie.yearFrom, serie.yearTo),
                      serie.faceliftPhase?.name,
                      serie.marketRegion,
                    ]
                      .filter(Boolean)
                      .join(' · ') || undefined
                  }
                  action={
                    <DataQualityMark
                      quality={serie.dataQuality}
                      lastVerifiedAt={serie.lastVerifiedAt}
                    />
                  }
                />
                <CardBody className="space-y-3">
                  {serie.description ? (
                    <p className="text-sm leading-relaxed text-ink-muted">{serie.description}</p>
                  ) : null}

                  {serie.distinguishingFeatures ? (
                    <div>
                      <p className="eyebrow">Woran man es erkennt</p>
                      <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                        {serie.distinguishingFeatures}
                      </p>
                    </div>
                  ) : null}

                  <p className="text-sm text-ink-muted">
                    Stückzahl:{' '}
                    {serie.buildCount !== null ? (
                      <span className="font-mono tabular-nums text-ink">
                        {serie.buildCount.toLocaleString('de-DE')}
                      </span>
                    ) : (
                      /* Eine geschaetzte Stueckzahl waere eine erfundene Zahl
                         mit dem Aussehen einer belegten. */
                      <DataGap reason="nicht belegt" />
                    )}
                  </p>

                  {serie.items.length > 0 ? (
                    <div className="border-t border-line pt-3">
                      <p className="eyebrow mb-1.5">Enthaltene Ausstattung</p>
                      <ul className="flex flex-wrap gap-1.5">
                        {serie.items.map((eintrag) => (
                          <li key={eintrag.option.id}>
                            <Badge tone={eintrag.optional ? 'neutral' : 'accent'}>
                              {eintrag.option.name}
                              {eintrag.optional ? ' (wahlweise)' : ''}
                            </Badge>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </CardBody>
              </Card>
            ))}
          </div>
        </section>
      ) : null}

      {lackfarben.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-ink">Lackfarben</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
            Der Farbcode ist das verlässlichste Merkmal einer Werksfarbe — er steht auf dem
            Typschild. Die Farbfläche daneben ist eine Näherung: Ein Bildschirmwert bildet
            keinen Lack ab.
          </p>
          <Card className="mt-4">
            <CardBody className="p-0">
              <ul className="divide-y divide-line">
                {lackfarben.map((eintrag) => {
                  const art = AVAILABILITY_LABELS[eintrag.kind];
                  const aufpreis = euro(eintrag.surchargeCents, eintrag.surchargeCurrency);
                  return (
                    <li key={eintrag.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3">
                      {/*
                        Der helle Ring ist noetig, nicht Zierde: Ein dunkler
                        Lack auf dunklem Grund waere sonst unsichtbar, und
                        die Flaeche saehe aus wie ein Ladefehler.
                      */}
                      <span
                        aria-hidden="true"
                        className="h-8 w-8 shrink-0 rounded-full ring-1 ring-inset ring-ink-subtle/40"
                        style={{
                          backgroundColor: eintrag.paintColor.approximateHex ?? 'transparent',
                        }}
                        title="Näherungswert — ein Bildschirmwert bildet keinen Lack ab."
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-ink">
                          {eintrag.paintColor.name}
                          {eintrag.paintColor.code ? (
                            <span className="ml-2 font-mono text-xs text-ink-subtle">
                              {eintrag.paintColor.code}
                            </span>
                          ) : null}
                        </p>
                        <p className="text-xs text-ink-subtle">
                          {[
                            PAINT_KIND_LABELS[eintrag.paintColor.kind],
                            eintrag.paintColor.rarity
                              ? RARITY_LABELS[eintrag.paintColor.rarity]
                              : null,
                            formatBuildPeriod(eintrag.yearFrom, eintrag.yearTo),
                            eintrag.marketRegion,
                          ]
                            .filter(Boolean)
                            .join(' · ')}
                        </p>
                      </div>
                      <Badge tone={art.tone} title={art.explanation}>
                        {art.short}
                      </Badge>
                      {aufpreis ? (
                        <span
                          className="font-mono text-sm tabular-nums text-ink-muted"
                          title={
                            eintrag.surchargeAsOf
                              ? `Listenaufpreis, Stand ${eintrag.surchargeAsOf.toLocaleDateString('de-DE')}. Nicht der heutige Wert.`
                              : 'Historischer Listenaufpreis, nicht der heutige Wert.'
                          }
                        >
                          {aufpreis}
                        </span>
                      ) : null}
                      <DataQualityMark
                        quality={eintrag.dataQuality}
                        lastVerifiedAt={eintrag.lastVerifiedAt}
                      />
                    </li>
                  );
                })}
              </ul>
            </CardBody>
          </Card>
        </section>
      ) : null}

      {raeder.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-ink">Radvarianten</h2>
          <Card className="mt-4">
            <CardBody className="p-0">
              <ul className="divide-y divide-line">
                {raeder.map((eintrag) => {
                  const art = AVAILABILITY_LABELS[eintrag.kind];
                  const rad = eintrag.wheelOption;
                  const masse = [
                    rad.diameterInch ? `${rad.diameterInch}″` : null,
                    rad.widthInch ? `${String(rad.widthInch)}J` : null,
                    rad.tyreSize,
                  ]
                    .filter(Boolean)
                    .join(' · ');
                  return (
                    <li key={eintrag.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-ink">
                          {rad.name}
                          {rad.code ? (
                            <span className="ml-2 font-mono text-xs text-ink-subtle">
                              {rad.code}
                            </span>
                          ) : null}
                        </p>
                        <p className="text-xs text-ink-subtle">
                          {[
                            masse,
                            rad.design,
                            rad.rarity ? RARITY_LABELS[rad.rarity] : null,
                            eintrag.trimLine ? `Linie ${eintrag.trimLine.name}` : null,
                            formatBuildPeriod(eintrag.yearFrom, eintrag.yearTo),
                          ]
                            .filter(Boolean)
                            .join(' · ')}
                        </p>
                      </div>
                      <Badge tone={art.tone} title={art.explanation}>
                        {art.short}
                      </Badge>
                      <DataQualityMark
                        quality={eintrag.dataQuality}
                        lastVerifiedAt={eintrag.lastVerifiedAt}
                      />
                    </li>
                  );
                })}
              </ul>
            </CardBody>
          </Card>
        </section>
      ) : null}
    </>
  );
}
