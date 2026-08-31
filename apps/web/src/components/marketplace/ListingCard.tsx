import Link from 'next/link';

/**
 * Eine Anzeige in der Trefferliste.
 *
 * Das Vorschaubild kommt aus der Bildablage. Fehlt es, steht dort ein
 * Platzhalter mit dem Hinweis, dass kein Bild vorliegt -- eine Anzeige ohne
 * Bild ist ein Signal fuer Kaufinteressenten, kein Layoutproblem.
 */

export interface ListingCardData {
  slug: string;
  title: string;
  vehicleLabel: string;
  priceCents: number;
  negotiable?: boolean;
  mileageKm: number | null;
  firstRegistration: Date | null;
  city: string | null;
  images: { storageKey: string; altText: string | null }[];
}

export function euro(cents: number): string {
  return (cents / 100).toLocaleString('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  });
}

export function kilometer(km: number | null): string | null {
  return km === null ? null : `${km.toLocaleString('de-DE')} km`;
}

export function erstzulassung(datum: Date | null): string | null {
  if (!datum) return null;
  return `EZ ${datum.toLocaleDateString('de-DE', { month: '2-digit', year: 'numeric' })}`;
}

export function ListingCard({ anzeige }: { anzeige: ListingCardData }) {
  const vorschau = anzeige.images[0];
  const merkmale = [kilometer(anzeige.mileageKm), erstzulassung(anzeige.firstRegistration), anzeige.city]
    .filter((teil): teil is string => Boolean(teil));

  return (
    <article className="group overflow-hidden rounded-lg border border-line/60 bg-surface-1 transition-colors hover:border-accent/50">
      <Link href={`/marktplatz/${anzeige.slug}`} className="block">
        <div className="aspect-[4/3] w-full overflow-hidden bg-surface-2">
          {vorschau ? (
            /* Bilder liegen in der eigenen Ablage und sind beim Hochladen
               bereits auf Zielgroesse gebracht; der Optimierer haette hier
               nichts zu tun. */
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`/api/bilder/${vorschau.storageKey}`}
              alt={vorschau.altText ?? anzeige.vehicleLabel}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-ink-subtle">
              Kein Bild vorhanden
            </div>
          )}
        </div>

        <div className="p-4">
          <p className="text-xs uppercase tracking-wide text-ink-subtle">
            {anzeige.vehicleLabel}
          </p>
          <h3 className="mt-1 line-clamp-2 text-base font-medium text-ink">{anzeige.title}</h3>

          <p className="tabular mt-2 text-lg font-semibold text-accent">
            {euro(anzeige.priceCents)}
            {anzeige.negotiable ? (
              <span className="ml-2 text-xs font-normal text-ink-subtle">VB</span>
            ) : null}
          </p>

          {merkmale.length > 0 ? (
            <p className="mt-1 text-sm text-ink-muted">{merkmale.join(' · ')}</p>
          ) : null}
        </div>
      </Link>
    </article>
  );
}
