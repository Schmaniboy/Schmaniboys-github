import Link from 'next/link';

import { Badge } from './Badge';
import { DataGap } from './DataGap';

/**
 * Fahrzeugkarte fuer Katalog, Suche und Marktplatz.
 *
 * Fehlende Angaben werden ausgewiesen statt geschaetzt (Vorgabe C3). Deshalb
 * sind fast alle Felder optional -- ein unvollstaendig erfasstes Fahrzeug soll
 * darstellbar bleiben, ohne dass jemand Zahlen erfindet.
 */

export interface VehicleCardProps {
  href: string;
  brand: string;
  model: string;
  variant?: string;
  yearFrom?: number;
  yearTo?: number | null;
  powerPs?: number;
  fuel?: string;
  bodyType?: string;
  imageUrl?: string | null;
  badge?: { label: string; tone: 'accent' | 'positive' | 'caution' | 'neutral' };
}

export function VehicleCard({
  href,
  brand,
  model,
  variant,
  yearFrom,
  yearTo,
  powerPs,
  fuel,
  bodyType,
  imageUrl,
  badge,
}: VehicleCardProps) {
  const buildPeriod =
    yearFrom === undefined
      ? null
      : yearTo === null
        ? `seit ${yearFrom}`
        : yearTo === undefined
          ? `ab ${yearFrom}`
          : `${yearFrom}–${yearTo}`;

  return (
    <article className="group relative overflow-hidden rounded-lg border border-line bg-surface-2 transition-colors hover:border-line-interactive">
      <div className="relative aspect-[16/10] bg-surface-3">
        {imageUrl ? (
          /* Bildquellen und Zuschnitte stehen erst mit Phase 9 fest. Bis dahin
             kein next/image-Loader, sonst wird eine Entscheidung festgezurrt,
             die noch nicht getroffen ist. */
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={`${brand} ${model}`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <DataGap reason="kein Bild hinterlegt" />
          </div>
        )}
        {badge ? (
          <div className="absolute left-3 top-3">
            <Badge tone={badge.tone}>{badge.label}</Badge>
          </div>
        ) : null}
      </div>

      <div className="space-y-2 p-4">
        <div>
          <p className="eyebrow">{brand}</p>
          <h3 className="text-base font-semibold text-ink">
            {/* Der Link deckt die ganze Karte ab, bleibt aber ein echter Link
                mit lesbarem Text -- keine klickbare Kachel ohne Ziel. */}
            <Link href={href} className="after:absolute after:inset-0">
              {model}
              {variant ? <span className="text-ink-muted"> {variant}</span> : null}
            </Link>
          </h3>
        </div>

        <dl className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-muted">
          {buildPeriod ? (
            <div className="flex gap-1">
              <dt className="sr-only">Bauzeit</dt>
              <dd className="tabular">{buildPeriod}</dd>
            </div>
          ) : null}
          {powerPs !== undefined ? (
            <div className="flex gap-1">
              <dt className="sr-only">Leistung</dt>
              <dd className="tabular">{powerPs} PS</dd>
            </div>
          ) : null}
          {fuel ? (
            <div className="flex gap-1">
              <dt className="sr-only">Kraftstoff</dt>
              <dd>{fuel}</dd>
            </div>
          ) : null}
          {bodyType ? (
            <div className="flex gap-1">
              <dt className="sr-only">Karosserie</dt>
              <dd>{bodyType}</dd>
            </div>
          ) : null}
        </dl>
      </div>
    </article>
  );
}
