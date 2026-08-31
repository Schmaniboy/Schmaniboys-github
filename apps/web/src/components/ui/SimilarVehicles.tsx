import Link from 'next/link';

import { DRIVE_TYPE_LABELS, FUEL_LABELS, formatBuildPeriod, formatPower } from '@ap/core';

/**
 * Aehnliche Fahrzeuge.
 *
 * "Aehnlich" heisst hier: vergleichbare Leistung, gleiche Karosserieform,
 * aber ein anderes Modell. Ein anderer Motor derselben Baureihe ist keine
 * Alternative, sondern eine Variante -- die steht ohnehin schon weiter oben
 * auf derselben Seite.
 */

export interface SimilarVehicle {
  id: string;
  driveType: string;
  powerKw: number | null;
  engine: { name: string; fuelType: string; powerKw: number | null };
  generation: {
    name: string;
    slug: string;
    yearFrom: number;
    yearTo: number | null;
    bodyType: { name: string } | null;
    model: { name: string; slug: string; manufacturer: { name: string; slug: string } };
  };
}

export function SimilarVehicles({ vehicles }: { vehicles: readonly SimilarVehicle[] }) {
  if (vehicles.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-lg font-semibold text-ink">Ähnliche Fahrzeuge</h2>
      <p className="mt-2 max-w-2xl text-sm text-ink-muted">
        Vergleichbare Leistung und gleiche Karosserieform, aber eine andere
        Baureihe.
      </p>

      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {vehicles.map((fahrzeug) => {
          const marke = fahrzeug.generation.model.manufacturer;
          const leistung = fahrzeug.powerKw ?? fahrzeug.engine.powerKw;
          return (
            <li key={fahrzeug.id}>
              <Link
                href={`/katalog/${marke.slug}/${fahrzeug.generation.model.slug}/${fahrzeug.generation.slug}`}
                className="block rounded-lg border border-line bg-surface-2 p-4 transition-colors hover:border-line-interactive"
              >
                <p className="eyebrow">{marke.name}</p>
                <h3 className="mt-1 text-sm font-semibold text-ink">
                  {fahrzeug.generation.model.name}{' '}
                  <span className="text-ink-muted">{fahrzeug.engine.name}</span>
                </h3>
                <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-ink-subtle">
                  <span className="tabular">{formatPower(leistung)}</span>
                  <span>{FUEL_LABELS[fahrzeug.engine.fuelType]}</span>
                  <span>{DRIVE_TYPE_LABELS[fahrzeug.driveType]}</span>
                  <span className="tabular">
                    {formatBuildPeriod(
                      fahrzeug.generation.yearFrom,
                      fahrzeug.generation.yearTo,
                    )}
                  </span>
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
