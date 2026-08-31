import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import {
  ASPIRATION_LABELS,
  COST_CATEGORY_LABELS,
  CatalogSubject,
  DRIVE_TYPE_LABELS,
  FUEL_LABELS,
  SEVERITY_LABELS,
  TOPIC_LABELS,
  TRANSMISSION_LABELS,
  formatBuildPeriod,
  formatCentsRange,
  formatConsumption,
  formatDisplacement,
  formatInterval,
  formatMileageRange,
  formatPower,
  type ConfidenceLevel,
  type EvidenceType,
} from '@ap/core';
import {
  findPublishedGeneration,
  findPublishedKnowledge,
  findSimilarVehicles,
  ladeGenerationsBilder,
  ladeGenerationsDetails,
  listSourceKindsFor,
  listSourcesFor,
} from '@ap/db';

import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Fahrzeugbild } from '@/components/katalog/Fahrzeugbild';
import { GenerationsDetails } from '@/components/katalog/GenerationsDetails';
import { Badge } from '@/components/ui/Badge';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { DataGap } from '@/components/ui/DataGap';
import { EvidenceBadge, EvidenceBasis } from '@/components/ui/EvidenceBadge';
import { SimilarVehicles } from '@/components/ui/SimilarVehicles';
import { SpecList, SpecRow } from '@/components/ui/SpecList';
import { Table, Td, Th } from '@/components/ui/Table';
import { Term } from '@/components/ui/Term';

export const dynamic = 'force-dynamic';
export const revalidate = 300;

interface Props {
  params: Promise<{ hersteller: string; modell: string; generation: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { hersteller, modell, generation } = await params;
  const eintrag = await findPublishedGeneration(hersteller, modell, generation);
  if (!eintrag) return { title: 'Nicht gefunden' };

  const marke = eintrag.model.manufacturer.name;
  return {
    title: `${marke} ${eintrag.model.name} ${eintrag.name}`,
    description: `Technische Daten, Motorvarianten, Schwachstellen und Kosten: ${marke} ${eintrag.model.name} ${eintrag.name}.`,
  };
}

const SCHWERE_TON = {
  CRITICAL: 'critical',
  SIGNIFICANT: 'caution',
  MINOR: 'neutral',
} as const;

export default async function GenerationPage({ params }: Props) {
  const { hersteller, modell, generation } = await params;
  const eintrag = await findPublishedGeneration(hersteller, modell, generation);
  if (!eintrag) notFound();

  const wissen = await findPublishedKnowledge(eintrag.id);
  const [bilder, details] = await Promise.all([
    ladeGenerationsBilder(eintrag.id),
    ladeGenerationsDetails(eintrag.id),
  ]);
  const quellen = await listSourcesFor(CatalogSubject.GENERATION, [eintrag.id]);
  const jetzt = new Date();

  /*
   * Die Quellenarten der Wissenseintraege bestimmen mit, wie gut eine belegte
   * Angabe dasteht. Sie werden geladen und nicht angenommen -- eine
   * angenommene Quellenart waere genau die Art von erfundener Angabe, die die
   * Belegpflicht verhindern soll.
   */
  /*
   * Bezugspunkt fuer aehnliche Fahrzeuge ist die staerkste Variante der
   * Baureihe -- die Liste ist nach Leistung sortiert, also die erste.
   */
  const bezugsvariante = eintrag.powertrains[0];
  const aehnliche = bezugsvariante ? await findSimilarVehicles(bezugsvariante.id) : [];

  const [issueKinds, maintenanceKinds, costKinds, noteKinds] = await Promise.all([
    listSourceKindsFor(CatalogSubject.KNOWN_ISSUE, wissen.issues.map((e) => e.id)),
    listSourceKindsFor(CatalogSubject.MAINTENANCE_ITEM, wissen.maintenance.map((e) => e.id)),
    listSourceKindsFor(CatalogSubject.COST_ESTIMATE, wissen.costs.map((e) => e.id)),
    listSourceKindsFor(CatalogSubject.KNOWLEDGE_NOTE, wissen.notes.map((e) => e.id)),
  ]);

  const marke = eintrag.model.manufacturer;
  const vorteile = wissen.notes.filter((notiz) => notiz.topic === 'ADVANTAGE');
  const nachteile = wissen.notes.filter((notiz) => notiz.topic === 'DISADVANTAGE');
  const sonstigeNotizen = wissen.notes.filter(
    (notiz) => notiz.topic !== 'ADVANTAGE' && notiz.topic !== 'DISADVANTAGE',
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <Breadcrumbs
        items={[
          { href: '/katalog', label: 'Fahrzeugwissen' },
          { href: `/katalog/${marke.slug}`, label: marke.name },
          { href: `/katalog/${marke.slug}/${eintrag.model.slug}`, label: eintrag.model.name },
          { label: eintrag.name },
        ]}
      />

      <div className="accent-rule mb-6" />
      <p className="eyebrow mb-2">
        {marke.name} {eintrag.model.name}
      </p>
      <h1 className="text-3xl font-semibold tracking-tight text-ink">
        <Term term="generation">{eintrag.name}</Term>
        {eintrag.code ? (
          <span className="ml-3 font-mono text-xl text-ink-subtle">{eintrag.code}</span>
        ) : null}
      </h1>

      {/*
        Ein Bild nur, wenn es zu genau dieser Generation gehoert. Wo keines
        passt, steht der Hinweis statt eines Bildes einer anderen Phase --
        siehe core/catalog/images.ts.
      */}
      <div className="mt-6 max-w-2xl">
        <Fahrzeugbild
          bilder={bilder}
          gesucht={{
            kind: 'VEHICLE_EXTERIOR',
            generationId: eintrag.id,
          }}
        />
      </div>

      <SpecList>
        <SpecRow
          label="Bauzeitraum"
          value={formatBuildPeriod(eintrag.yearFrom, eintrag.yearTo)}
        />
        <SpecRow label="Karosserieform" value={eintrag.bodyType?.name} />
        <SpecRow
          label="Motorvarianten"
          value={eintrag.powertrains.length > 0 ? eintrag.powertrains.length : null}
          gapReason="keine veröffentlicht"
        />
      </SpecList>

      {eintrag.faceliftPhases.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-ink">
            <Term term="facelift">Facelift-Phasen</Term>
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-ink-muted">
            Innerhalb einer Generation ändert sich Technik und Ausstattung.
            Beim Gebrauchtkauf zählt die Phase oft mehr als das Baujahr — Fahrzeuge
            können umgebaut sein.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {eintrag.faceliftPhases.map((phase) => (
              <Card key={phase.id}>
                <CardBody className="space-y-2">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-base font-semibold text-ink">{phase.name}</h3>
                    <span className="tabular text-sm text-ink-muted">
                      {formatBuildPeriod(phase.yearFrom, phase.yearTo)}
                    </span>
                  </div>
                  {phase.distinguishingFeatures ? (
                    <p className="text-sm leading-relaxed text-ink-muted">
                      {phase.distinguishingFeatures}
                    </p>
                  ) : (
                    <DataGap reason="Erkennungsmerkmale nicht erfasst" />
                  )}
                </CardBody>
              </Card>
            ))}
          </div>
        </section>
      ) : null}

      {/*
        Modelljahre, Sondermodelle, Lackfarben und Radvarianten.
        Erscheinen nur, wo etwas erfasst ist -- vier leere Abschnitte auf
        jeder Seite traegen nichts bei. Was fehlt, steht gesammelt auf der
        Datenbestandsseite.
      */}
      <GenerationsDetails daten={details} />

      <section className="mt-12">
        <h2 className="text-lg font-semibold text-ink">Motorvarianten</h2>
        <p className="mt-2 max-w-2xl text-sm text-ink-muted">
          Fahrleistungen hängen an der ganzen Kombination aus Motor, Getriebe und{' '}
          <Term term="driveType">Antriebsart</Term> — nicht am Motor allein.
          Deshalb steht hier jede Kombination einzeln.
        </p>

        {eintrag.powertrains.length === 0 ? (
          <p className="mt-4 text-sm text-ink-muted">
            Für diese Generation ist noch keine Motorvariante veröffentlicht.
          </p>
        ) : (
          <div className="mt-4">
            <Table caption="Motorvarianten dieser Generation">
              <thead>
                <tr>
                  <Th>Motor</Th>
                  <Th>Kraftstoff</Th>
                  <Th>Getriebe / Antrieb</Th>
                  <Th numeric>Leistung</Th>
                  <Th numeric>0–100 km/h</Th>
                  <Th numeric>Verbrauch</Th>
                </tr>
              </thead>
              <tbody>
                {eintrag.powertrains.map((antrieb) => (
                  <tr key={antrieb.id}>
                    <Td>
                      <Link
                        href={`/katalog/${marke.slug}/${eintrag.model.slug}/${eintrag.slug}/motor/${antrieb.id}`}
                        className="text-ink underline decoration-line-interactive underline-offset-4 hover:decoration-accent"
                      >
                        {antrieb.engine.name}
                      </Link>
                      {antrieb.engine.code ? (
                        <span className="ml-2 font-mono text-xs text-ink-subtle">
                          {antrieb.engine.code}
                        </span>
                      ) : null}
                      <span className="mt-0.5 block text-xs text-ink-subtle">
                        {[
                          formatDisplacement(antrieb.engine.displacementCcm),
                          antrieb.engine.cylinders
                            ? `${antrieb.engine.cylinders} Zylinder`
                            : null,
                          ASPIRATION_LABELS[antrieb.engine.aspiration],
                        ]
                          .filter(Boolean)
                          .join(' · ')}
                      </span>
                    </Td>
                    <Td>{FUEL_LABELS[antrieb.engine.fuelType] ?? antrieb.engine.fuelType}</Td>
                    <Td>
                      {TRANSMISSION_LABELS[antrieb.transmission.type] ??
                        antrieb.transmission.type}
                      {antrieb.transmission.gears
                        ? ` (${antrieb.transmission.gears} ${antrieb.transmission.gears === 1 ? 'Gang' : 'Gänge'})`
                        : ''}
                      <span className="mt-0.5 block text-xs text-ink-subtle">
                        {DRIVE_TYPE_LABELS[antrieb.driveType]}
                      </span>
                    </Td>
                    <Td numeric>{formatPower(antrieb.powerKw) ?? <DataGap reason="" />}</Td>
                    <Td numeric>
                      {antrieb.acceleration0to100 ? (
                        `${Number(antrieb.acceleration0to100).toLocaleString('de-DE', {
                          minimumFractionDigits: 1,
                        })} s`
                      ) : (
                        <DataGap reason="" />
                      )}
                    </Td>
                    <Td numeric>
                      {formatConsumption(
                        antrieb.consumptionCombined
                          ? Number(antrieb.consumptionCombined)
                          : null,
                        antrieb.consumptionUnit,
                        antrieb.measurementStandard,
                      ) ?? <DataGap reason="" />}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <p className="mt-2 text-xs text-ink-subtle">
              Verbrauchswerte tragen ihr Messverfahren. Werte nach{' '}
              <Term term="wltp">WLTP</Term> und nach NEFZ sind nicht vergleichbar.
            </p>
          </div>
        )}
      </section>

      {eintrag.trimLines.length > 0 ? (
        <section className="mt-12">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="text-lg font-semibold text-ink">
              <Term term="trimLine">Ausstattungslinien</Term>
            </h2>
            <Link
              href={`/katalog/${marke.slug}/${eintrag.model.slug}/${eintrag.slug}/ausstattung`}
              className="text-sm text-accent hover:text-accent-strong"
            >
              Ausstattung im Einzelnen →
            </Link>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {eintrag.trimLines.map((linie) => (
              <Card key={linie.id}>
                <CardBody className="space-y-2">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-base font-semibold text-ink">{linie.name}</h3>
                    <span className="tabular text-sm text-ink-subtle">
                      {formatBuildPeriod(linie.yearFrom, linie.yearTo)}
                    </span>
                  </div>
                  {linie.description ? (
                    <p className="text-sm leading-relaxed text-ink-muted">
                      {linie.description}
                    </p>
                  ) : (
                    <DataGap reason="Beschreibung nicht erfasst" />
                  )}
                </CardBody>
              </Card>
            ))}
          </div>
        </section>
      ) : null}

      {wissen.issues.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-lg font-semibold text-ink">Bekannte Schwachstellen</h2>
          <p className="mt-2 max-w-2xl text-sm text-ink-muted">
            Nach Schwere sortiert. An jedem Eintrag steht, worauf er beruht —
            eine Einschätzung ist keine Messung.
          </p>
          <div className="mt-4 space-y-3">
            {wissen.issues.map((problem) => (
              <Card key={problem.id}>
                <CardBody className="space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold text-ink">{problem.title}</h3>
                      {problem.component ? (
                        <p className="mt-0.5 text-sm text-ink-subtle">{problem.component}</p>
                      ) : null}
                    </div>
                    <Badge tone={SCHWERE_TON[problem.severity]}>
                      {SEVERITY_LABELS[problem.severity]}
                    </Badge>
                  </div>

                  {problem.symptoms ? (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
                        Woran man es merkt
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                        {problem.symptoms}
                      </p>
                    </div>
                  ) : null}

                  {problem.remedy ? (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
                        Was hilft
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                        {problem.remedy}
                      </p>
                    </div>
                  ) : null}

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-muted">
                    {formatMileageRange(
                      problem.typicalMileageFromKm,
                      problem.typicalMileageToKm,
                    ) ? (
                      <span>
                        Typisch{' '}
                        <span className="tabular">
                          {formatMileageRange(
                            problem.typicalMileageFromKm,
                            problem.typicalMileageToKm,
                          )}
                        </span>
                      </span>
                    ) : null}
                    {formatBuildPeriod(problem.yearFrom, problem.yearTo) ? (
                      <span>Betrifft {formatBuildPeriod(problem.yearFrom, problem.yearTo)}</span>
                    ) : null}
                  </div>

                  <EvidenceBadge
                    evidenceType={problem.evidenceType as EvidenceType}
                    confidence={problem.confidence as ConfidenceLevel}
                    sourceKinds={issueKinds.get(problem.id) ?? []}
                    now={jetzt}
                  />
                  <EvidenceBasis reasoning={problem.reasoning} />
                </CardBody>
              </Card>
            ))}
          </div>
        </section>
      ) : null}

      {wissen.maintenance.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-lg font-semibold text-ink">Wartung</h2>
          <div className="mt-4">
            <Table caption="Wartungsarbeiten und Intervalle">
              <thead>
                <tr>
                  <Th>Arbeit</Th>
                  <Th>Intervall</Th>
                  <Th>Grundlage</Th>
                </tr>
              </thead>
              <tbody>
                {wissen.maintenance.map((arbeit) => (
                  <tr key={arbeit.id}>
                    <Td>
                      <span className="text-ink">{arbeit.task}</span>
                      {arbeit.note ? (
                        <span className="mt-0.5 block text-xs text-ink-subtle">
                          {arbeit.note}
                        </span>
                      ) : null}
                    </Td>
                    <Td>
                      {formatInterval(arbeit.intervalKm, arbeit.intervalMonths) ?? (
                        <DataGap reason="" />
                      )}
                    </Td>
                    <Td>
                      <EvidenceBadge
                        evidenceType={arbeit.evidenceType as EvidenceType}
                        confidence={arbeit.confidence as ConfidenceLevel}
                        sourceKinds={maintenanceKinds.get(arbeit.id) ?? []}
                        now={jetzt}
                      />
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <p className="mt-2 text-xs text-ink-subtle">
              Fällig ist, was zuerst eintritt — Kilometerstand oder Zeit.
            </p>
          </div>
        </section>
      ) : null}

      {wissen.costs.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-lg font-semibold text-ink">Kosten</h2>
          <p className="mt-2 max-w-2xl text-sm text-ink-muted">
            Alle Angaben als Spanne. Ein einzelner Betrag würde eine Genauigkeit
            vortäuschen, die es bei Betriebskosten nicht gibt.
          </p>
          <div className="mt-4 space-y-3">
            {wissen.costs.map((kosten) => (
              <Card key={kosten.id}>
                <CardBody className="space-y-2">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <div>
                      <p className="eyebrow">{COST_CATEGORY_LABELS[kosten.category]}</p>
                      <h3 className="mt-1 text-base font-semibold text-ink">{kosten.label}</h3>
                    </div>
                    <p className="tabular text-lg font-semibold text-ink">
                      {formatCentsRange(
                        kosten.amountFromCents,
                        kosten.amountToCents,
                        kosten.currency,
                      ) ?? <DataGap reason="" />}
                      {kosten.per ? (
                        <span className="ml-1 text-sm font-normal text-ink-subtle">
                          {kosten.per}
                        </span>
                      ) : null}
                    </p>
                  </div>
                  {kosten.region ? (
                    <p className="text-sm text-ink-subtle">Geltungsbereich: {kosten.region}</p>
                  ) : (
                    <DataGap reason="Geltungsbereich nicht erfasst" />
                  )}
                  <EvidenceBadge
                    evidenceType={kosten.evidenceType as EvidenceType}
                    confidence={kosten.confidence as ConfidenceLevel}
                    observedAt={kosten.observedAt}
                    sampleSize={kosten.sampleSize}
                    sourceKinds={costKinds.get(kosten.id) ?? []}
                    now={jetzt}
                  />
                  <EvidenceBasis
                    reasoning={kosten.reasoning}
                    dataBasis={kosten.dataBasis}
                    observedAt={kosten.observedAt}
                    sampleSize={kosten.sampleSize}
                  />
                </CardBody>
              </Card>
            ))}
          </div>
        </section>
      ) : null}

      {vorteile.length > 0 || nachteile.length > 0 ? (
        <section className="mt-12 grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader title="Spricht dafür" eyebrow="Einordnung" />
            <CardBody className="space-y-4">
              {vorteile.length === 0 ? (
                <DataGap reason="noch nichts erfasst" />
              ) : (
                vorteile.map((notiz) => (
                  <div key={notiz.id}>
                    <h3 className="text-sm font-semibold text-ink">{notiz.heading}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink-muted">{notiz.body}</p>
                    <EvidenceBadge
                      className="mt-2"
                      evidenceType={notiz.evidenceType as EvidenceType}
                      confidence={notiz.confidence as ConfidenceLevel}
                      observedAt={notiz.observedAt}
                      sampleSize={notiz.sampleSize}
                      sourceKinds={noteKinds.get(notiz.id) ?? []}
                      now={jetzt}
                    />
                  </div>
                ))
              )}
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Spricht dagegen" eyebrow="Einordnung" />
            <CardBody className="space-y-4">
              {nachteile.length === 0 ? (
                <DataGap reason="noch nichts erfasst" />
              ) : (
                nachteile.map((notiz) => (
                  <div key={notiz.id}>
                    <h3 className="text-sm font-semibold text-ink">{notiz.heading}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink-muted">{notiz.body}</p>
                    <EvidenceBadge
                      className="mt-2"
                      evidenceType={notiz.evidenceType as EvidenceType}
                      confidence={notiz.confidence as ConfidenceLevel}
                      observedAt={notiz.observedAt}
                      sampleSize={notiz.sampleSize}
                      sourceKinds={noteKinds.get(notiz.id) ?? []}
                      now={jetzt}
                    />
                  </div>
                ))
              )}
            </CardBody>
          </Card>
        </section>
      ) : null}

      {sonstigeNotizen.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-lg font-semibold text-ink">Im Alltag</h2>
          <div className="mt-4 space-y-4">
            {sonstigeNotizen.map((notiz) => (
              <Card key={notiz.id}>
                <CardBody className="space-y-2">
                  <p className="eyebrow">{TOPIC_LABELS[notiz.topic] ?? notiz.topic}</p>
                  <h3 className="text-base font-semibold text-ink">{notiz.heading}</h3>
                  <p className="text-sm leading-relaxed text-ink-muted">{notiz.body}</p>
                  <EvidenceBadge
                    evidenceType={notiz.evidenceType as EvidenceType}
                    confidence={notiz.confidence as ConfidenceLevel}
                    observedAt={notiz.observedAt}
                    sampleSize={notiz.sampleSize}
                    sourceKinds={noteKinds.get(notiz.id) ?? []}
                    now={jetzt}
                  />
                  <EvidenceBasis
                    reasoning={notiz.reasoning}
                    dataBasis={notiz.dataBasis}
                    observedAt={notiz.observedAt}
                    sampleSize={notiz.sampleSize}
                  />
                </CardBody>
              </Card>
            ))}
          </div>
        </section>
      ) : null}

      <SimilarVehicles vehicles={aehnliche} />

      <section className="mt-12 border-t border-line pt-6">
        <h2 className="text-base font-semibold text-ink">Quellen zu dieser Generation</h2>
        {quellen.length === 0 ? (
          <p className="mt-2 text-sm text-ink-subtle">
            Für diesen Eintrag sind keine Quellen hinterlegt.
          </p>
        ) : (
          <ul className="mt-3 space-y-1.5">
            {quellen.map((quelle) => (
              <li key={quelle.id} className="text-sm text-ink-muted">
                {quelle.title}
                {quelle.publishedOn
                  ? ` (${quelle.publishedOn.toLocaleDateString('de-DE')})`
                  : ''}
                {quelle.url ? (
                  <a
                    href={quelle.url}
                    rel="nofollow noopener noreferrer"
                    target="_blank"
                    className="ml-2 break-all text-accent hover:text-accent-strong"
                  >
                    {quelle.url}
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
