import Link from 'next/link';
import type { Metadata } from 'next';

import {
  DRIVE_TYPE_LABELS,
  MAX_VERGLEICH,
  FUEL_LABELS,
  SORT_LABELS,
  SORT_OPTIONS,
  TRANSMISSION_LABELS,
  buildSearchQuery,
  erklaereSuche,
  formatBuildPeriod,
  formatConsumption,
  formatDisplacement,
  formatPower,
  hasActiveFilters,
  pageCount,
  vehicleSearchInput,
} from '@ap/core';
import { fuelFacets, searchVehicles, smartSuche } from '@ap/db';

import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { DataGap } from '@/components/ui/DataGap';
import { Term } from '@/components/ui/Term';
import { cn } from '@/lib/cn';

import { SearchFilters } from './SearchFilters';

export const metadata: Metadata = {
  title: 'Fahrzeugsuche',
  description:
    'Fahrzeuge nach Motor, Leistung, Kraftstoff, Getriebe und Antrieb durchsuchen.',
};

/*
 * Dynamisch, weil das Ergebnis von den Filtern in der Adresse abhaengt.
 * Die Seite liegt nicht unter den geschuetzten Bereichen und laeuft deshalb
 * mit der lockeren Richtlinie -- siehe lib/csp.ts.
 */
export const dynamic = 'force-dynamic';

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function SuchePage({ searchParams }: Props) {
  const roh = await searchParams;
  const geparst = vehicleSearchInput.safeParse(roh);

  /*
   * Eine unsinnige Adresse fuehrt nicht zu einem Fehler, sondern zur
   * ungefilterten Suche mit Hinweis. Eine Fehlerseite waere hier die
   * schlechtere Antwort -- Suchadressen werden geteilt und veraendert.
   */
  const input = geparst.success ? geparst.data : vehicleSearchInput.parse({});
  const eingabeFehlerhaft = !geparst.success;

  const [ergebnis, facetten, smartRoh] = await Promise.all([
    searchVehicles(input),
    fuelFacets(input),
    /*
     * Die Smart-Suche laeuft NEBEN der Filtersuche, nicht statt ihr.
     *
     * Ein Motorcode oder ein Baureihenkuerzel ist ein Sprungziel, kein
     * Filter -- wer "DBKA" eintippt, will diesen einen Motor, nicht eine
     * gefilterte Liste. Beides zusammen zu zeigen ist ehrlicher als sich
     * fuer eines zu entscheiden: Der Sprung steht oben, die Liste bleibt
     * darunter, und beide sagen, worauf sie beruhen.
     */
    input.q ? smartSuche(input.q, 6) : Promise.resolve(null),
  ]);

  const smart = smartRoh
    ? { erklaerung: erklaereSuche(smartRoh.zerlegt), treffer: smartRoh.treffer }
    : null;

  /*
   * Die Vergleichsauswahl steht in der Adresse, nicht im Browserspeicher.
   *
   * Damit funktioniert sie ohne JavaScript, ueberlebt einen Neuladen und
   * laesst sich teilen -- und die Suchseite bleibt eine Serverkomponente.
   * Der Preis ist eine laengere Adresse; das ist es wert.
   */
  const vergleichRoh = roh.v;
  const vergleich = (Array.isArray(vergleichRoh) ? vergleichRoh : vergleichRoh ? [vergleichRoh] : [])
    .flatMap((wert) => String(wert).split(','))
    .map((wert) => wert.trim())
    .filter((wert) => wert.length > 0 && wert.length <= 40)
    .slice(0, MAX_VERGLEICH);

  const vergleichSet = new Set(vergleich);

  /** Adresse derselben Suche mit geaenderter Vergleichsauswahl. */
  const mitAuswahl = (ids: string[]): string => {
    const basis = buildSearchQuery(input);
    if (ids.length === 0) return `/suche${basis}`;
    const trenner = basis.includes('?') ? '&' : '?';
    return `/suche${basis}${trenner}v=${ids.join(',')}`;
  };

  const seiten = pageCount(ergebnis.total, ergebnis.pageSize);
  const gefiltert = hasActiveFilters(input);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="accent-rule mb-6" />
      <h1 className="text-3xl font-semibold tracking-tight text-ink">Fahrzeugsuche</h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-muted">
        Gesucht wird nach Motorvariante — also nach der Kombination aus Motor,
        Getriebe und <Term term="driveType">Antriebsart</Term>. Ein Fahrzeug
        derselben Baureihe kann sich darin deutlich unterscheiden.
      </p>

      {eingabeFehlerhaft ? (
        <p
          role="status"
          className="mt-4 rounded-md border border-caution/40 bg-caution/10 px-4 py-3 text-sm text-caution"
        >
          Die Filter in der Adresse waren nicht lesbar. Angezeigt wird die
          ungefilterte Suche.
        </p>
      ) : null}

      <form action="/suche" method="get" className="mt-6 flex flex-wrap gap-2">
        <label htmlFor="q" className="sr-only">
          Suchbegriff
        </label>
        <input
          id="q"
          name="q"
          type="search"
          defaultValue={input.q ?? ''}
          placeholder="BMW 320d G20 · DBKA · Golf 7 Panorama"
          className="h-11 min-w-0 flex-1 rounded-md border border-line-interactive bg-surface-1 px-3 text-base text-ink placeholder:text-ink-subtle transition-all duration-200 hover:border-ink-subtle focus:border-accent focus:shadow-[0_0_0_3px_rgba(255,51,85,0.15)] focus:outline-none sm:text-sm"
        />
        <Button type="submit" variant="primary" className="h-11 px-5">
          Suchen
        </Button>
        {gefiltert ? (
          <Link
            href="/suche"
            className="inline-flex h-10 items-center rounded-md px-3 text-sm text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink"
          >
            Filter zurücksetzen
          </Link>
        ) : null}
      </form>

      {/*
        Was die Suche aus der Eingabe gelesen hat.

        Wer "DBKA" eintippt und eine Liste Fahrzeuge bekommt, soll nicht
        raten muessen, warum gerade diese. Die Zeile steht deshalb ueber den
        Treffern und nicht in einer Hilfe.
      */}
      {smart && (smart.erklaerung || smart.treffer.length > 0) ? (
        <div className="mt-4 rounded-lg border border-line bg-surface-2 px-4 py-3">
          {smart.erklaerung ? (
            <p className="text-sm text-ink-muted">{smart.erklaerung}</p>
          ) : null}
          {smart.treffer.length > 0 ? (
            <ul className="mt-2 space-y-1.5">
              {smart.treffer.map((treffer) => (
                <li key={`${treffer.art}-${treffer.href}`}>
                  <Link
                    href={treffer.href}
                    className="group flex flex-wrap items-baseline gap-x-2 text-sm"
                  >
                    <span className="font-medium text-accent underline-offset-4 group-hover:underline">
                      {treffer.titel}
                    </span>
                    {treffer.untertitel ? (
                      <span className="text-ink-muted">{treffer.untertitel}</span>
                    ) : null}
                    <span className="text-xs text-ink-subtle">— {treffer.grund}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      <div className="mt-8 grid gap-6 lg:grid-cols-[17rem_1fr]">
        <SearchFilters input={input} fuelFacets={facetten} />

        <div className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-ink-muted">
              {ergebnis.total === 0
                ? 'Keine Treffer'
                : `${ergebnis.total.toLocaleString('de-DE')} ${
                    ergebnis.total === 1 ? 'Motorvariante' : 'Motorvarianten'
                  }`}
            </p>

            <nav aria-label="Sortierung" className="flex flex-wrap gap-1.5">
              {Object.values(SORT_OPTIONS).map((option) => (
                <Link
                  key={option}
                  href={`/suche${buildSearchQuery(input, { sortierung: option })}`}
                  aria-current={input.sortierung === option ? 'true' : undefined}
                  className={cn(
                    'rounded-sm border px-2.5 py-1 text-xs transition-colors',
                    input.sortierung === option
                      ? 'border-accent bg-accent/10 text-accent-strong'
                      : 'border-line text-ink-subtle hover:border-line-interactive hover:text-ink',
                  )}
                >
                  {SORT_LABELS[option]}
                </Link>
              ))}
            </nav>
          </div>

          {vergleich.length > 0 ? (
            <div className="sticky top-16 z-20 mb-3 flex flex-wrap items-center gap-3 rounded-lg border border-accent/40 bg-surface-2 px-4 py-3">
              <p className="text-sm text-ink">
                {vergleich.length} von {MAX_VERGLEICH} für den Vergleich ausgewählt
              </p>
              <Link
                href={`/katalog/vergleich?v=${vergleich.join(',')}`}
                className="rounded-md bg-accent px-3 py-1.5 text-sm font-semibold text-accent-ink transition-colors hover:bg-accent-strong"
              >
                Vergleich öffnen
              </Link>
              <Link
                href={mitAuswahl([])}
                className="text-sm text-ink-muted underline-offset-4 hover:text-ink hover:underline"
              >
                Auswahl leeren
              </Link>
            </div>
          ) : null}

          {ergebnis.hits.length === 0 ? (
            <Card>
              <CardBody className="space-y-3">
                <h2 className="text-base font-semibold text-ink">
                  {gefiltert ? 'Keine Treffer zu diesen Filtern' : 'Der Katalog ist noch leer'}
                </h2>
                <p className="text-sm leading-relaxed text-ink-muted">
                  {gefiltert
                    ? 'Die Suche findet nur veröffentlichte Katalogeinträge. Weniger Filter führen zu mehr Treffern.'
                    : 'Es ist noch keine Motorvariante veröffentlicht. Der Katalog wird redaktionell aufgebaut — ein Eintrag erscheint erst, wenn er geprüft und belegt ist.'}
                </p>
              </CardBody>
            </Card>
          ) : (
            <ul className="space-y-3">
              {ergebnis.hits.map((treffer) => {
                const marke = treffer.generation.model.manufacturer;
                /*
                 * Der Treffer ist eine Motorvariante, also fuehrt er auch auf
                 * deren Seite -- nicht auf die Generation. Sonst muesste man
                 * die gefundene Variante dort erneut suchen.
                 */
                const adresse = `/katalog/${marke.slug}/${treffer.generation.model.slug}/${treffer.generation.slug}/motor/${treffer.id}`;
                const leistung = treffer.powerKw ?? treffer.engine.powerKw;

                const ausgewaehlt = vergleichSet.has(treffer.id);
                const voll = vergleich.length >= MAX_VERGLEICH && !ausgewaehlt;
                const auswahlZiel = mitAuswahl(
                  ausgewaehlt
                    ? vergleich.filter((id) => id !== treffer.id)
                    : [...vergleich, treffer.id],
                );

                return (
                  <li
                    key={treffer.id}
                    className="relative rounded-lg border border-line bg-surface-2 transition-all duration-200 hover:-translate-y-0.5 hover:border-line-interactive hover:shadow-raised"
                  >
                    {/*
                      Der Auswahlknopf steht NEBEN dem Trefferlink, nicht
                      darin: Ein Link im Link ist ungueltiges HTML, und der
                      Browser entscheidet dann selbst, welcher gewinnt.
                    */}
                    {voll ? (
                      <span
                        className="absolute right-4 top-4 z-10 rounded-md border border-line px-2.5 py-1 text-xs text-ink-subtle"
                        title={`Es lassen sich höchstens ${MAX_VERGLEICH} Fahrzeuge vergleichen.`}
                      >
                        Vergleich voll
                      </span>
                    ) : (
                      <Link
                        href={auswahlZiel}
                        scroll={false}
                        className={cn(
                          'absolute right-4 top-4 z-10 rounded-md border px-2.5 py-1 text-xs transition-colors',
                          ausgewaehlt
                            ? 'border-accent bg-accent/10 text-accent-strong'
                            : 'border-line text-ink-subtle hover:border-line-interactive hover:text-ink',
                        )}
                      >
                        {ausgewaehlt ? 'Im Vergleich ✓' : '+ Vergleich'}
                      </Link>
                    )}
                    <Link
                      href={adresse}
                      className="block rounded-lg p-5 pr-32"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                        <div className="min-w-0">
                          <p className="eyebrow">{marke.name}</p>
                          <h2 className="mt-1 text-base font-semibold text-ink">
                            {treffer.generation.model.name}{' '}
                            <span className="text-ink-muted">{treffer.engine.name}</span>
                            {treffer.engine.code ? (
                              <span className="ml-2 font-mono text-xs text-ink-subtle">
                                {treffer.engine.code}
                              </span>
                            ) : null}
                          </h2>
                          <p className="mt-1 text-sm text-ink-subtle">
                            {treffer.generation.name}
                            {treffer.generation.code ? ` · ${treffer.generation.code}` : ''}
                            {treffer.generation.bodyType
                              ? ` · ${treffer.generation.bodyType.name}`
                              : ''}
                          </p>
                        </div>
                        <p className="tabular shrink-0 text-sm text-ink">
                          {formatBuildPeriod(
                            treffer.yearFrom ?? treffer.generation.yearFrom,
                            treffer.yearTo ?? treffer.generation.yearTo,
                          )}
                        </p>
                      </div>

                      <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5 text-sm text-ink-muted">
                        <div className="flex gap-1.5">
                          <dt className="text-ink-subtle">Leistung</dt>
                          <dd className="tabular text-ink">
                            {formatPower(leistung) ?? <DataGap reason="" />}
                          </dd>
                        </div>
                        <div className="flex gap-1.5">
                          <dt className="text-ink-subtle">Kraftstoff</dt>
                          <dd>{FUEL_LABELS[treffer.engine.fuelType]}</dd>
                        </div>
                        <div className="flex gap-1.5">
                          <dt className="text-ink-subtle">Getriebe</dt>
                          <dd>{TRANSMISSION_LABELS[treffer.transmission.type]}</dd>
                        </div>
                        <div className="flex gap-1.5">
                          <dt className="text-ink-subtle">Antrieb</dt>
                          <dd>{DRIVE_TYPE_LABELS[treffer.driveType]}</dd>
                        </div>
                        {treffer.engine.displacementCcm ? (
                          <div className="flex gap-1.5">
                            <dt className="text-ink-subtle">Hubraum</dt>
                            <dd className="tabular">
                              {formatDisplacement(treffer.engine.displacementCcm)}
                            </dd>
                          </div>
                        ) : null}
                        <div className="flex gap-1.5">
                          <dt className="text-ink-subtle">Verbrauch</dt>
                          <dd className="tabular">
                            {formatConsumption(
                              treffer.consumptionCombined
                                ? Number(treffer.consumptionCombined)
                                : null,
                              treffer.consumptionUnit,
                              treffer.measurementStandard,
                            ) ?? <DataGap reason="" />}
                          </dd>
                        </div>
                      </dl>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          {seiten > 1 ? (
            <nav aria-label="Seiten" className="mt-6 flex flex-wrap items-center gap-2">
              {input.seite > 1 ? (
                <Link
                  href={`/suche${buildSearchQuery(input, { seite: input.seite - 1 })}`}
                  className="rounded-md border border-line-interactive px-3 py-1.5 text-sm text-ink-muted hover:text-ink"
                >
                  Zurück
                </Link>
              ) : null}
              <span className="tabular text-sm text-ink-subtle">
                Seite {input.seite} von {seiten}
              </span>
              {input.seite < seiten ? (
                <Link
                  href={`/suche${buildSearchQuery(input, { seite: input.seite + 1 })}`}
                  className="rounded-md border border-line-interactive px-3 py-1.5 text-sm text-ink-muted hover:text-ink"
                >
                  Weiter
                </Link>
              ) : null}
            </nav>
          ) : null}
        </div>
      </div>
    </div>
  );
}
