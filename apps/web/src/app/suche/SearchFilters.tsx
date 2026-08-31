import Link from 'next/link';

import {
  DRIVE_TYPE_LABELS,
  FUEL_LABELS,
  TRANSMISSION_LABELS,
  buildSearchQuery,
  type VehicleSearchInput,
} from '@ap/core';

import { cn } from '@/lib/cn';

/**
 * Filterleiste.
 *
 * Bewusst ohne JavaScript: Jeder Filter ist ein Link, jede Auswahl eine
 * eigene Adresse. Damit ist ein Suchergebnis teilbar, im Verlauf auffindbar
 * und funktioniert auch dann, wenn ein Skript nicht laedt.
 */

function FilterGruppe({
  titel,
  children,
}: {
  titel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-line py-4 first:border-t-0 first:pt-0">
      <p className="eyebrow mb-2.5">{titel}</p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function FilterChip({
  href,
  aktiv,
  children,
}: {
  href: string;
  aktiv: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-pressed={aktiv}
      className={cn(
        'rounded-sm border px-2.5 py-1 text-sm transition-colors',
        aktiv
          ? 'border-accent bg-accent/10 text-accent-strong'
          : 'border-line-interactive text-ink-muted hover:border-ink-subtle hover:text-ink',
      )}
    >
      {children}
    </Link>
  );
}

/** Schaltet einen Wert in einem Mehrfachfilter an oder aus. */
function umschalten(werte: readonly string[], wert: string): string | undefined {
  const neu = werte.includes(wert)
    ? werte.filter((eintrag) => eintrag !== wert)
    : [...werte, wert];
  return neu.length === 0 ? undefined : neu.join(',');
}

export function SearchFilters({
  input,
  fuelFacets,
}: {
  input: VehicleSearchInput;
  fuelFacets: readonly { fuelType: string; count: number }[];
}) {
  /*
   * Mehrfachwerte werden hier als kommagetrennte Liste in die Adresse
   * geschrieben; das Schema in core nimmt beide Formen an. Ein Link kann
   * anders als ein Formular nicht mehrere gleichnamige Felder setzen.
   */
  const linkFuer = (schluessel: string, wert: string | undefined) =>
    `/suche${buildSearchQuery(input, { [schluessel]: wert })}`;

  return (
    <aside aria-label="Filter" className="rounded-lg border border-line bg-surface-2 p-5">
      <FilterGruppe titel="Kraftstoff">
        {fuelFacets.length === 0 ? (
          <p className="text-sm text-ink-subtle">Keine Auswahl vorhanden</p>
        ) : (
          fuelFacets.map((facette) => (
            <FilterChip
              key={facette.fuelType}
              aktiv={input.kraftstoff.includes(facette.fuelType as never)}
              href={linkFuer('kraftstoff', umschalten(input.kraftstoff, facette.fuelType))}
            >
              {FUEL_LABELS[facette.fuelType] ?? facette.fuelType}
              <span className="ml-1.5 tabular text-xs text-ink-subtle">{facette.count}</span>
            </FilterChip>
          ))
        )}
      </FilterGruppe>

      <FilterGruppe titel="Antrieb">
        {Object.entries(DRIVE_TYPE_LABELS).map(([wert, bezeichnung]) => (
          <FilterChip
            key={wert}
            aktiv={input.antrieb.includes(wert as never)}
            href={linkFuer('antrieb', umschalten(input.antrieb, wert))}
          >
            {bezeichnung}
          </FilterChip>
        ))}
      </FilterGruppe>

      <FilterGruppe titel="Getriebe">
        {Object.entries(TRANSMISSION_LABELS)
          .filter(([wert]) => wert !== 'OTHER')
          .map(([wert, bezeichnung]) => (
            <FilterChip
              key={wert}
              aktiv={input.getriebe.includes(wert as never)}
              href={linkFuer('getriebe', umschalten(input.getriebe, wert))}
            >
              {bezeichnung}
            </FilterChip>
          ))}
      </FilterGruppe>

      <FilterGruppe titel="Leistung">
        {[
          { label: 'bis 75 kW', von: undefined, bis: 75 },
          { label: '75–110 kW', von: 75, bis: 110 },
          { label: '110–160 kW', von: 110, bis: 160 },
          { label: 'ab 160 kW', von: 160, bis: undefined },
        ].map((stufe) => {
          const aktiv =
            input.leistungVonKw === stufe.von && input.leistungBisKw === stufe.bis;
          const href = `/suche${buildSearchQuery(input, {
            leistungVonKw: aktiv ? undefined : stufe.von,
            leistungBisKw: aktiv ? undefined : stufe.bis,
          })}`;
          return (
            <FilterChip key={stufe.label} aktiv={aktiv} href={href}>
              {stufe.label}
            </FilterChip>
          );
        })}
      </FilterGruppe>

      {/*
        Abgasnorm als Stufen und nicht als Eingabefeld: Die Bezeichnungen
        sind zahlreich und uneinheitlich ("Euro 6b", "Euro 6d-TEMP"), und
        niemand tippt sie vollstaendig. Gesucht wird deshalb als Praefix.
      */}
      <FilterGruppe titel="Abgasnorm">
        {['Euro 4', 'Euro 5', 'Euro 6'].map((norm) => {
          const aktiv = input.abgasnorm === norm;
          return (
            <FilterChip
              key={norm}
              aktiv={aktiv}
              href={`/suche${buildSearchQuery(input, { abgasnorm: aktiv ? undefined : norm })}`}
            >
              {norm}
            </FilterChip>
          );
        })}
      </FilterGruppe>

      {input.baureihe ? (
        <FilterGruppe titel="Baureihe">
          <FilterChip
            aktiv
            href={`/suche${buildSearchQuery(input, { baureihe: undefined })}`}
          >
            {input.baureihe} ×
          </FilterChip>
        </FilterGruppe>
      ) : null}
    </aside>
  );
}
