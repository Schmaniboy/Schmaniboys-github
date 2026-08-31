import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import {
  bewerteZuverlaessigkeit,
  giltAlsBehoben,
  ASPIRATION_LABELS,
  CONFIDENCE_LABELS,
  COST_CATEGORY_LABELS,
  CatalogSubject,
  DRIVE_TYPE_LABELS,
  FUEL_LABELS,
  SEVERITY_LABELS,
  SPEC_FIELD_LABELS,
  TOPIC_LABELS,
  TRANSMISSION_LABELS,
  formatBuildPeriod,
  formatCentsRange,
  formatConsumption,
  formatDisplacement,
  formatInterval,
  formatKilograms,
  formatKilometres,
  formatMileageRange,
  formatPower,
  formatTowingCapacity,
  type ConfidenceLevel,
  type EvidenceType,
} from '@ap/core';
import {
  findPowertrainKnowledge,
  findPublishedPowertrain,
  listSourcesFor,
} from '@ap/db';

import { Badge } from '@/components/ui/Badge';
import { Bewertungen } from '@/components/katalog/Bewertungen';
import { MerkenKnopf } from '@/components/katalog/MerkenKnopf';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { DataGap } from '@/components/ui/DataGap';
import { EvidenceBadge, EvidenceBasis } from '@/components/ui/EvidenceBadge';
import { SpecList, SpecRow } from '@/components/ui/SpecList';
import { Term } from '@/components/ui/Term';

export const dynamic = 'force-dynamic';
export const revalidate = 300;

interface Props {
  params: Promise<{
    hersteller: string;
    modell: string;
    generation: string;
    variante: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { hersteller, modell, generation, variante } = await params;
  const eintrag = await findPublishedPowertrain(hersteller, modell, generation, variante);
  if (!eintrag) return { title: 'Nicht gefunden' };

  const marke = eintrag.generation.model.manufacturer.name;
  return {
    title: `${marke} ${eintrag.generation.model.name} ${eintrag.engine.name}`,
    description: `Technische Daten der Motorvariante ${eintrag.engine.name} im ${marke} ${eintrag.generation.model.name}.`,
  };
}

const SCHWERE_TON = {
  CRITICAL: 'critical',
  SIGNIFICANT: 'caution',
  MINOR: 'neutral',
} as const;

export default async function VariantePage({ params }: Props) {
  const { hersteller, modell, generation, variante } = await params;
  const eintrag = await findPublishedPowertrain(hersteller, modell, generation, variante);
  if (!eintrag) notFound();

  const [wissen, quellenVariante, quellenMotor] = await Promise.all([
    findPowertrainKnowledge(eintrag.id),
    listSourcesFor(CatalogSubject.POWERTRAIN, [eintrag.id]),
    listSourcesFor(CatalogSubject.ENGINE, [eintrag.engine.id]),
  ]);
  const jetzt = new Date();

  const marke = eintrag.generation.model.manufacturer;
  const quellen = [...quellenVariante, ...quellenMotor];
  const quellenarten = quellen.map((quelle) => quelle.kind);

  /*
   * Zu welchen Werten es eine ausdrueckliche Quelle gibt. Eine Quelle ohne
   * Feldangabe deckt den ganzen Eintrag -- das ist der Regelfall und wird
   * hier nicht einzeln ausgewiesen.
   */
  const belegteFelder = new Set(quellen.flatMap((quelle) => quelle.coversFields));

  const feldHinweis = (feld: string): string | undefined =>
    belegteFelder.has(feld) ? 'ausdrücklich belegt' : undefined;

  /*
   * Bewertungen.
   *
   * Als Baujahr gilt der Beginn des Angebotszeitraums dieser Kombination --
   * das ist das frueheste Fahrzeug, das es davon gibt, und damit die
   * vorsichtige Annahme: Eine spaeter behobene Schwachstelle gilt fuer
   * dieses Fahrzeug NICHT als behoben.
   */
  const baujahr = eintrag.yearFrom ?? eintrag.generation.yearFrom;

  const zuverlaessigkeit = bewerteZuverlaessigkeit(
    wissen.issues.map((problem) => ({
      severity: problem.severity,
      resolved: giltAlsBehoben(problem, baujahr),
    })),
  );

  const leistung = eintrag.powerKw ?? eintrag.engine.powerKw;
  const drehmoment = eintrag.torqueNm ?? eintrag.engine.torqueNm;
  const istStromer =
    eintrag.engine.fuelType === 'ELECTRIC' || eintrag.engine.fuelType === 'PLUGIN_HYBRID';

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Breadcrumbs
        items={[
          { href: '/katalog', label: 'Fahrzeugwissen' },
          { href: `/katalog/${marke.slug}`, label: marke.name },
          {
            href: `/katalog/${marke.slug}/${eintrag.generation.model.slug}`,
            label: eintrag.generation.model.name,
          },
          {
            href: `/katalog/${marke.slug}/${eintrag.generation.model.slug}/${eintrag.generation.slug}`,
            label: eintrag.generation.name,
          },
          { label: eintrag.engine.name },
        ]}
      />

      <div className="accent-rule mb-6" />
      <p className="eyebrow mb-2">
        {marke.name} {eintrag.generation.model.name} · {eintrag.generation.name}
      </p>
      <h1 className="text-3xl font-semibold tracking-tight text-ink">
        {eintrag.engine.name}
        {eintrag.engine.code ? (
          <span className="ml-3 font-mono text-xl text-ink-subtle">
            <Term term="engineCode">{eintrag.engine.code}</Term>
          </span>
        ) : null}
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted">
        {TRANSMISSION_LABELS[eintrag.transmission.type]} ·{' '}
        {DRIVE_TYPE_LABELS[eintrag.driveType]} ·{' '}
        {FUEL_LABELS[eintrag.engine.fuelType]}
      </p>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-ink">Antrieb</h2>
        <SpecList>
          <SpecRow
            label={<Term term="power">Leistung</Term>}
            value={formatPower(leistung)}
            hint={feldHinweis('powerKw')}
          />
          <SpecRow
            label={<Term term="torque">Drehmoment</Term>}
            value={drehmoment ? `${drehmoment} Nm` : null}
            hint={feldHinweis('torqueNm')}
          />
          <SpecRow
            label={<Term term="displacement">Hubraum</Term>}
            value={formatDisplacement(eintrag.engine.displacementCcm)}
          />
          <SpecRow label="Zylinder" value={eintrag.engine.cylinders} />
          <SpecRow
            label={<Term term="turbocharger">Aufladung</Term>}
            value={ASPIRATION_LABELS[eintrag.engine.aspiration]}
          />
          <SpecRow
            label={<Term term="transmission">Getriebe</Term>}
            value={`${eintrag.transmission.name} · ${TRANSMISSION_LABELS[eintrag.transmission.type]}${
              eintrag.transmission.gears
                ? ` (${eintrag.transmission.gears} ${eintrag.transmission.gears === 1 ? 'Gang' : 'Gänge'})`
                : ''
            }`}
          />
          <SpecRow
            label={<Term term="driveType">Antriebsart</Term>}
            value={DRIVE_TYPE_LABELS[eintrag.driveType]}
          />
          <SpecRow
            label="Angeboten"
            value={formatBuildPeriod(
              eintrag.yearFrom ?? eintrag.generation.yearFrom,
              eintrag.yearTo ?? eintrag.generation.yearTo,
            )}
          />
        </SpecList>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-ink">Fahrleistungen</h2>
        <p className="mt-2 max-w-2xl text-sm text-ink-muted">
          Diese Werte gelten für genau diese Kombination aus Motor, Getriebe und
          Antriebsart — nicht für den Motor allein.
        </p>
        <SpecList>
          <SpecRow
            label="Beschleunigung 0–100 km/h"
            value={
              eintrag.acceleration0to100
                ? `${Number(eintrag.acceleration0to100).toLocaleString('de-DE', {
                    minimumFractionDigits: 1,
                  })} s`
                : null
            }
            hint={feldHinweis('acceleration0to100')}
          />
          <SpecRow
            label="Höchstgeschwindigkeit"
            value={eintrag.topSpeedKmh ? `${eintrag.topSpeedKmh} km/h` : null}
          />
        </SpecList>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-ink">
          <Term term="consumption">Verbrauch</Term> und Abgas
        </h2>
        <SpecList>
          <SpecRow
            label="Verbrauch kombiniert"
            value={formatConsumption(
              eintrag.consumptionCombined ? Number(eintrag.consumptionCombined) : null,
              eintrag.consumptionUnit,
              eintrag.measurementStandard,
            )}
            hint={feldHinweis('consumptionCombined')}
          />
          <SpecRow
            label="CO₂ kombiniert"
            value={
              eintrag.co2CombinedGramPerKm ? `${eintrag.co2CombinedGramPerKm} g/km` : null
            }
          />
          <SpecRow
            label="Abgasnorm"
            value={eintrag.emissionStandard}
            gapReason="nicht erfasst"
            hint="Bestimmt in vielen Städten die Einfahrterlaubnis."
          />
          {istStromer ? (
            <>
              <SpecRow
                label="Batteriekapazität"
                value={
                  eintrag.batteryCapacityKwh
                    ? `${Number(eintrag.batteryCapacityKwh).toLocaleString('de-DE', {
                        minimumFractionDigits: 1,
                      })} kWh`
                    : null
                }
              />
              <SpecRow
                label="Elektrische Reichweite"
                value={formatKilometres(eintrag.electricRangeKm)}
              />
            </>
          ) : null}
          <SpecRow
            label="Tankinhalt"
            value={eintrag.fuelTankLitres ? `${eintrag.fuelTankLitres} l` : null}
          />
        </SpecList>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-ink">Alltag und Zuladung</h2>
        <SpecList>
          <SpecRow
            label={<Term term="kerbWeight">Leergewicht</Term>}
            value={formatKilograms(eintrag.kerbWeightKg)}
          />
          <SpecRow label="Zuladung" value={formatKilograms(eintrag.payloadKg)} />
          <SpecRow
            label="Anhängelast"
            value={formatTowingCapacity(
              eintrag.towingCapacityBrakedKg,
              eintrag.towingCapacityUnbrakedKg,
            )}
            hint="Gebremst und ungebremst sind verschiedene Grenzen."
          />
          <SpecRow label="Sitzplätze" value={eintrag.seats} />
          <SpecRow label="Türen" value={eintrag.doors} />
          <SpecRow label="Karosserieform" value={eintrag.generation.bodyType?.name} />
        </SpecList>
      </section>

      <div className="mt-8 flex flex-wrap gap-2">
        <MerkenKnopf
          subjectType="PowertrainCombination"
          subjectId={eintrag.id}
          label="Fahrzeug merken"
        />
        <MerkenKnopf subjectType="Engine" subjectId={eintrag.engine.id} label="Motor merken" />
      </div>

      <Bewertungen
        eintraege={[{ titel: 'Zuverlässigkeit', ergebnis: zuverlaessigkeit }]}
      />

      {wissen.issues.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-lg font-semibold text-ink">
            Schwachstellen dieser Motorvariante
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-ink-muted">
            Nur Angaben, die genau diese Kombination betreffen. Was für die
            ganze Baureihe gilt, steht auf der Generationsseite.
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
                    <p className="text-sm leading-relaxed text-ink-muted">{problem.symptoms}</p>
                  ) : null}
                  {problem.remedy ? (
                    <p className="text-sm leading-relaxed text-ink-muted">{problem.remedy}</p>
                  ) : null}
                  {formatMileageRange(
                    problem.typicalMileageFromKm,
                    problem.typicalMileageToKm,
                  ) ? (
                    <p className="tabular text-sm text-ink-muted">
                      Typisch{' '}
                      {formatMileageRange(
                        problem.typicalMileageFromKm,
                        problem.typicalMileageToKm,
                      )}
                    </p>
                  ) : null}
                  {/*
                    Die wichtigste Frage beim Gebrauchtkauf: Ist meins das
                    reparierte? Sie steht deshalb hervorgehoben und nicht als
                    Nebensatz -- und nur dann, wenn die Angabe belegt ist.
                  */}
                  {problem.resolvedFromYear ? (
                    <div
                      className={`rounded-md border px-3 py-2 ${
                        giltAlsBehoben(problem, baujahr)
                          ? 'border-positive/40 bg-positive/5'
                          : 'border-caution/40 bg-caution/5'
                      }`}
                    >
                      <p className="text-sm text-ink">
                        {giltAlsBehoben(problem, baujahr)
                          ? `Behoben ab Baujahr ${problem.resolvedFromYear} — diese Variante beginnt ${baujahr} und ist damit betroffen von der Änderung.`
                          : `Behoben ab Baujahr ${problem.resolvedFromYear}. Diese Variante beginnt ${baujahr} und liegt davor.`}
                      </p>
                      {problem.resolvedHowToIdentify ? (
                        <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                          Erkennbar an: {problem.resolvedHowToIdentify}
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                  <EvidenceBadge
                    evidenceType={problem.evidenceType as EvidenceType}
                    confidence={problem.confidence as ConfidenceLevel}
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
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-ink">Wartung dieser Variante</h2>
          <ul className="mt-4 space-y-2">
            {wissen.maintenance.map((arbeit) => (
              <li
                key={arbeit.id}
                className="flex flex-wrap items-baseline justify-between gap-3 border-t border-line py-3"
              >
                <div>
                  <p className="text-sm text-ink">{arbeit.task}</p>
                  {arbeit.note ? (
                    <p className="mt-0.5 text-xs text-ink-subtle">{arbeit.note}</p>
                  ) : null}
                </div>
                <p className="tabular text-sm text-ink-muted">
                  {formatInterval(arbeit.intervalKm, arbeit.intervalMonths) ?? (
                    <DataGap reason="" />
                  )}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {wissen.costs.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-ink">Kosten dieser Variante</h2>
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
                  <EvidenceBadge
                    evidenceType={kosten.evidenceType as EvidenceType}
                    confidence={kosten.confidence as ConfidenceLevel}
                    observedAt={kosten.observedAt}
                    sampleSize={kosten.sampleSize}
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

      {wissen.notes.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-ink">Einordnung</h2>
          <div className="mt-4 space-y-3">
            {wissen.notes.map((notiz) => (
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

      <section className="mt-12 border-t border-line pt-6">
        <CardHeader title="Quellen" eyebrow="Herkunft der Angaben" />
        {quellen.length === 0 ? (
          <p className="mt-3 text-sm text-ink-subtle">
            Für diese Variante sind keine Quellen hinterlegt.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {quellen.map((quelle) => (
              <li key={quelle.id} className="text-sm text-ink-muted">
                <span>{quelle.title}</span>
                {quelle.publishedOn ? (
                  <span className="text-ink-subtle">
                    {' '}
                    ({quelle.publishedOn.toLocaleDateString('de-DE')})
                  </span>
                ) : null}
                <span className="text-ink-subtle">
                  {' '}
                  · abgerufen {quelle.checkedAt.toLocaleDateString('de-DE')}
                </span>
                {quelle.coversFields.length > 0 ? (
                  <span className="mt-0.5 block text-xs text-ink-subtle">
                    Belegt:{' '}
                    {quelle.coversFields
                      .map((feld) => SPEC_FIELD_LABELS[feld] ?? feld)
                      .join(', ')}
                  </span>
                ) : null}
                {quelle.url ? (
                  <a
                    href={quelle.url}
                    rel="nofollow noopener noreferrer"
                    target="_blank"
                    className="mt-0.5 block break-all text-xs text-accent hover:text-accent-strong"
                  >
                    {quelle.url}
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        )}
        <p className="mt-4 text-xs leading-relaxed text-ink-subtle">
          Quellenlage insgesamt:{' '}
          {quellenarten.length === 0
            ? 'keine Quellen hinterlegt'
            : `${quellenarten.length} ${quellenarten.length === 1 ? 'Quelle' : 'Quellen'}`}
          . Werte ohne ausdrückliche Quellenangabe sind durch die Quellen des
          Eintrags gedeckt — {CONFIDENCE_LABELS.MEDIUM} oder besser, sofern
          nichts anderes dabeisteht.
        </p>
      </section>
    </div>
  );
}
