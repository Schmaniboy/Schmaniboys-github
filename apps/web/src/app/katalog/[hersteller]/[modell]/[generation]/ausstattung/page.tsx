import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import {
  AVAILABILITY_LABELS,
  PRICE_SOURCE_LABELS,
  RARITY_LABELS,
  RELEVANCE_LABELS,
  formatBuildPeriod,
  type ConfidenceLevel,
  type EvidenceType,
  type PriceSourceType,
} from '@ap/core';
import { findGenerationEquipment } from '@ap/db';

import { Badge } from '@/components/ui/Badge';
import { DataQualityMark } from '@/components/ui/DataQualityMark';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Card, CardBody } from '@/components/ui/Card';
import { DataGap } from '@/components/ui/DataGap';
import { EvidenceBadge, EvidenceBasis } from '@/components/ui/EvidenceBadge';
import { Term } from '@/components/ui/Term';

export const dynamic = 'force-dynamic';
export const revalidate = 300;

interface Props {
  params: Promise<{ hersteller: string; modell: string; generation: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { hersteller, modell, generation } = await params;
  const daten = await findGenerationEquipment(hersteller, modell, generation);
  if (!daten) return { title: 'Nicht gefunden' };

  const marke = daten.generation.model.manufacturer.name;
  return {
    title: `Ausstattung ${marke} ${daten.generation.model.name} ${daten.generation.name}`,
    description:
      'Ausstattungslinien, Pakete und Sonderausstattung mit Erkennungsmerkmalen und Verfügbarkeit.',
  };
}

export default async function AusstattungPage({ params }: Props) {
  const { hersteller, modell, generation } = await params;
  const daten = await findGenerationEquipment(hersteller, modell, generation);
  if (!daten) notFound();

  const jetzt = new Date();
  const marke = daten.generation.model.manufacturer;
  const basis = `/katalog/${marke.slug}/${daten.generation.model.slug}/${daten.generation.slug}`;

  /*
   * Nach Ausstattung gruppieren, nicht nach Verfuegbarkeitszeile: Eine
   * Ausstattung kann mehrere Zeilen haben -- serienmaessig in der einen
   * Linie, gegen Aufpreis in der anderen. Der Leser sucht die Ausstattung,
   * nicht die Zeile.
   */
  const nachAusstattung = new Map<
    string,
    { option: (typeof daten.availability)[number]['option']; zeilen: typeof daten.availability }
  >();

  for (const eintrag of daten.availability) {
    const vorhanden = nachAusstattung.get(eintrag.option.id);
    if (vorhanden) vorhanden.zeilen.push(eintrag);
    else nachAusstattung.set(eintrag.option.id, { option: eintrag.option, zeilen: [eintrag] });
  }

  const gruppen = [...nachAusstattung.values()];

  /** Kategorien in stabiler Reihenfolge, Unkategorisiertes ans Ende. */
  const kategorien = [
    ...new Set(gruppen.map((gruppe) => gruppe.option.category ?? '')),
  ].sort((a, b) => (a === '' ? 1 : b === '' ? -1 : a.localeCompare(b, 'de')));

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <Breadcrumbs
        items={[
          { href: '/katalog', label: 'Fahrzeugwissen' },
          { href: `/katalog/${marke.slug}`, label: marke.name },
          {
            href: `/katalog/${marke.slug}/${daten.generation.model.slug}`,
            label: daten.generation.model.name,
          },
          { href: basis, label: daten.generation.name },
          { label: 'Ausstattung' },
        ]}
      />

      <div className="accent-rule mb-6" />
      <p className="eyebrow mb-2">
        {marke.name} {daten.generation.model.name} · {daten.generation.name}
      </p>
      <h1 className="text-3xl font-semibold tracking-tight text-ink">Ausstattung</h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-muted">
        Was serienmäßig war, was Aufpreis kostete und was es nur im Paket gab —
        je nach Baujahr, <Term term="trimLine">Ausstattungslinie</Term> und
        Motorvariante verschieden. Zu jeder Ausstattung steht, woran man sie am
        Fahrzeug erkennt.
      </p>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-ink">Ausstattungslinien</h2>
        {daten.generation.trimLines.length === 0 ? (
          <p className="mt-3 text-sm text-ink-muted">
            Für diese Generation ist noch keine Ausstattungslinie veröffentlicht.
          </p>
        ) : (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {daten.generation.trimLines.map((linie) => (
              <Card key={linie.id}>
                <CardBody className="space-y-2">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-base font-semibold text-ink">{linie.name}</h3>
                    <span className="tabular text-sm text-ink-subtle">
                      {formatBuildPeriod(linie.yearFrom, linie.yearTo)}
                    </span>
                  </div>
                  {linie.description ? (
                    <p className="text-sm leading-relaxed text-ink-muted">{linie.description}</p>
                  ) : (
                    <DataGap reason="Beschreibung nicht erfasst" />
                  )}
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </section>

      {daten.generation.packages.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-lg font-semibold text-ink">Pakete</h2>
          <p className="mt-2 max-w-2xl text-sm text-ink-muted">
            Ein Paket bündelt mehrere Sonderausstattungen. Beim Gebrauchtkauf
            zählt, was tatsächlich drin war — nicht, was im Prospekt stand.
          </p>
          <div className="mt-4 space-y-3">
            {daten.generation.packages.map((paket) => (
              <Card key={paket.id}>
                <CardBody className="space-y-3">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <h3 className="text-base font-semibold text-ink">
                      {paket.name}
                      {paket.packageCode ? (
                        <span className="ml-2 font-mono text-xs text-ink-subtle">
                          {paket.packageCode}
                        </span>
                      ) : null}
                    </h3>
                  </div>
                  {paket.description ? (
                    <p className="text-sm leading-relaxed text-ink-muted">{paket.description}</p>
                  ) : null}
                  {paket.items.length === 0 ? (
                    <DataGap reason="Inhalt nicht erfasst" />
                  ) : (
                    <ul className="flex flex-wrap gap-1.5">
                      {paket.items.map((position) => (
                        <li key={position.id}>
                          <Badge tone={position.optional ? 'neutral' : 'accent'}>
                            {position.option.name}
                            {position.optional ? ' (wahlweise)' : ''}
                          </Badge>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardBody>
              </Card>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-12">
        <h2 className="text-lg font-semibold text-ink">Sonderausstattung</h2>

        {gruppen.length === 0 ? (
          <p className="mt-3 text-sm text-ink-muted">
            Für diese Generation ist noch keine Sonderausstattung veröffentlicht.
          </p>
        ) : (
          kategorien.map((kategorie) => {
            const eintraege = gruppen.filter(
              (gruppe) => (gruppe.option.category ?? '') === kategorie,
            );
            if (eintraege.length === 0) return null;

            return (
              <div key={kategorie || 'ohne'} className="mt-6">
                <p className="eyebrow mb-3">{kategorie || 'Ohne Kategorie'}</p>
                <div className="space-y-3">
                  {eintraege.map(({ option, zeilen }) => (
                    <Card key={option.id}>
                      <CardBody className="space-y-3">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h3 className="text-base font-semibold text-ink">
                              {option.name}
                              {option.optionCode ? (
                                <span className="ml-2 font-mono text-xs text-ink-subtle">
                                  {option.optionCode}
                                </span>
                              ) : null}
                            </h3>
                            {option.description ? (
                              <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                                {option.description}
                              </p>
                            ) : null}
                          </div>
                          {option.rarity ? (
                            <Badge tone="neutral">{RARITY_LABELS[option.rarity]}</Badge>
                          ) : null}
                        </div>

                        {option.howToIdentify ? (
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
                              Woran man es erkennt
                            </p>
                            <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                              {option.howToIdentify}
                            </p>
                          </div>
                        ) : (
                          <DataGap reason="Erkennungsmerkmal nicht erfasst" />
                        )}

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
                            Verfügbarkeit
                          </p>
                          <ul className="mt-1.5 space-y-1.5">
                            {zeilen.map((zeile) => {
                              const einschraenkungen = [
                                zeile.trimLine ? `Linie ${zeile.trimLine.name}` : null,
                                zeile.powertrain
                                  ? `Motor ${zeile.powertrain.engine.name}`
                                  : null,
                                zeile.package ? `Paket „${zeile.package.name}"` : null,
                                zeile.specialEdition
                                  ? `Sondermodell „${zeile.specialEdition.name}"`
                                  : null,
                                zeile.faceliftPhase ? `Phase ${zeile.faceliftPhase.name}` : null,
                                zeile.marketRegion ? `Markt ${zeile.marketRegion}` : null,
                                formatBuildPeriod(zeile.yearFrom, zeile.yearTo),
                              ].filter(Boolean);

                              const art = AVAILABILITY_LABELS[zeile.kind];

                              const hatPreis = zeile.surchargeCents != null && zeile.surchargeCents > 0;
                              const preisFormatiert = hatPreis
                                ? new Intl.NumberFormat('de-DE', {
                                    style: 'currency',
                                    currency: zeile.surchargeCurrency ?? 'EUR',
                                  }).format(zeile.surchargeCents! / 100)
                                : null;
                              const quellenTyp = zeile.surchargeSourceType as PriceSourceType | null;

                              return (
                                <li key={zeile.id} className="space-y-1 text-sm">
                                  <div className="flex flex-wrap items-baseline gap-2">
                                    <Badge tone={art.tone} title={art.explanation}>
                                      {art.label}
                                    </Badge>
                                    <DataQualityMark
                                      quality={zeile.dataQuality}
                                      lastVerifiedAt={zeile.lastVerifiedAt}
                                    />
                                    <span className="text-ink-muted">
                                      {einschraenkungen.length > 0
                                        ? einschraenkungen.join(' · ')
                                        : 'in der ganzen Baureihe'}
                                    </span>
                                    {zeile.note ? (
                                      <span className="text-ink-subtle">— {zeile.note}</span>
                                    ) : null}
                                  </div>
                                  {hatPreis ? (
                                    <div className="ml-1 flex flex-wrap items-baseline gap-x-3 gap-y-0.5 text-xs">
                                      <span className="font-semibold text-accent">
                                        Aufpreis {preisFormatiert}
                                      </span>
                                      {zeile.surchargeAsOf ? (
                                        <span className="text-ink-subtle">
                                          (Stand{' '}
                                          {new Date(zeile.surchargeAsOf).toLocaleDateString('de-DE', {
                                            month: 'long',
                                            year: 'numeric',
                                          })}
                                          )
                                        </span>
                                      ) : null}
                                      {quellenTyp ? (
                                        <span className="text-ink-subtle">
                                          Quelle: {PRICE_SOURCE_LABELS[quellenTyp]}
                                          {zeile.surchargeSourceRef ? ` — ${zeile.surchargeSourceRef}` : ''}
                                        </span>
                                      ) : (
                                        <span className="text-ink-subtle italic">
                                          Quelle nicht verifiziert
                                        </span>
                                      )}
                                    </div>
                                  ) : null}
                                </li>
                              );
                            })}
                          </ul>
                        </div>

                        {option.purchaseRelevance || option.resaleRelevance ? (
                          <div className="border-t border-line pt-3">
                            <p className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-ink-muted">
                              {option.purchaseRelevance ? (
                                <span>
                                  Beim Kauf:{' '}
                                  <span className="text-ink">
                                    {RELEVANCE_LABELS[option.purchaseRelevance]}
                                  </span>
                                </span>
                              ) : null}
                              {option.resaleRelevance ? (
                                <span>
                                  Beim Wiederverkauf:{' '}
                                  <span className="text-ink">
                                    {RELEVANCE_LABELS[option.resaleRelevance]}
                                  </span>
                                </span>
                              ) : null}
                            </p>
                            {option.relevanceEvidenceType ? (
                              <>
                                <EvidenceBadge
                                  className="mt-2"
                                  evidenceType={option.relevanceEvidenceType as EvidenceType}
                                  confidence={option.relevanceConfidence as ConfidenceLevel}
                                  observedAt={option.relevanceObservedAt}
                                  sampleSize={option.relevanceSampleSize}
                                  now={jetzt}
                                />
                                <EvidenceBasis
                                  reasoning={option.relevanceReasoning}
                                  dataBasis={option.relevanceDataBasis}
                                  observedAt={option.relevanceObservedAt}
                                  sampleSize={option.relevanceSampleSize}
                                />
                              </>
                            ) : null}
                          </div>
                        ) : null}
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </section>

      <aside className="mt-16 border-t border-line pt-6">
        <p className="text-xs leading-relaxed text-ink-subtle">
          <strong>Hinweis zu Preisangaben:</strong> Alle genannten Aufpreise sind
          historische Listenpreise zum Zeitpunkt der Bestellung und dienen
          ausschließlich der Information. Sie stellen kein aktuelles Angebot dar.
          Preise können je nach Markt, Modelljahr und Händler abgewichen haben.
          {' '}Angaben ohne Quellennachweis sind als „Quelle nicht verifiziert"
          gekennzeichnet und erheben keinen Anspruch auf Richtigkeit.
        </p>
      </aside>
    </div>
  );
}
