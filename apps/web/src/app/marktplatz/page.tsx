import Link from 'next/link';
import type { Metadata } from 'next';

import { listingSearchInput, systemClock } from '@ap/core';
import { searchListings } from '@ap/db';

import { ListingCard } from '@/components/marketplace/ListingCard';
import { MarketplaceFilters } from '@/components/marketplace/MarketplaceFilters';
import { Card, CardBody } from '@/components/ui/Card';

export const metadata: Metadata = {
  title: 'Marktplatz',
  description: 'Fahrzeuge von privaten Anbietern und Händlern.',
};

export const dynamic = 'force-dynamic';

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Der oeffentliche Marktplatz.
 *
 * Die Filter werden mit `listingSearchInput` geparst, das Zahlen aus
 * Zeichenketten wandelt. Ohne diese Wandlung faellt die Pruefung still
 * durch und die Suche liefert ungefiltert alles -- genau dieser Fehler ist
 * in der Fahrzeugsuche schon einmal passiert.
 */
export default async function MarktplatzPage({ searchParams }: Props) {
  const roh = await searchParams;
  const einfach = Object.fromEntries(
    Object.entries(roh).map(([schluessel, wert]) => [
      schluessel,
      Array.isArray(wert) ? wert[0] : wert,
    ]),
  );

  const geparst = listingSearchInput.safeParse(einfach);
  const filter = geparst.success ? geparst.data : listingSearchInput.parse({});
  const ergebnis = await searchListings(filter, systemClock.now());

  const letzteSeite = Math.max(0, Math.ceil(ergebnis.gesamt / ergebnis.seitengroesse) - 1);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="accent-rule mb-6" />
      <h1 className="text-3xl font-semibold tracking-tight text-ink">Marktplatz</h1>
      <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-muted">
        Fahrzeuge von privaten Anbietern und Händlern. Jede Anzeige baut auf einem
        bestätigten Katalogeintrag auf — Modell, Generation und Motor sind ausgewählt,
        nicht geraten.
      </p>

      {!geparst.success ? (
        <p
          role="status"
          className="mt-4 rounded-md border border-caution/40 bg-caution/10 px-4 py-3 text-sm text-caution"
        >
          Ein Filter war nicht lesbar und wurde übergangen. Angezeigt werden alle Anzeigen.
        </p>
      ) : null}

      <div className="mt-8 grid gap-8 lg:grid-cols-[16rem_1fr]">
        <MarketplaceFilters werte={einfach} />

        <div className="min-w-0">
          <p className="mb-4 text-sm text-ink-muted">
            {ergebnis.gesamt === 0
              ? 'Keine Anzeigen gefunden.'
              : `${ergebnis.gesamt.toLocaleString('de-DE')} ${ergebnis.gesamt === 1 ? 'Anzeige' : 'Anzeigen'}`}
          </p>

          {ergebnis.treffer.length === 0 ? (
            <Card>
              <CardBody>
                <p className="text-sm leading-relaxed text-ink-muted">
                  Zu diesen Filtern gibt es derzeit keine Anzeige. Das ist keine Auskunft
                  darüber, ob es solche Fahrzeuge gibt — nur darüber, was hier gerade
                  angeboten wird.
                </p>
              </CardBody>
            </Card>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {ergebnis.treffer.map((anzeige) => (
                <ListingCard key={anzeige.id} anzeige={anzeige} />
              ))}
            </div>
          )}

          {letzteSeite > 0 ? (
            <nav className="mt-8 flex items-center justify-between" aria-label="Seiten">
              <SeitenLink
                werte={einfach}
                seite={filter.seite - 1}
                aktiv={filter.seite > 0}
                text="Zurück"
              />
              <span className="text-sm text-ink-subtle">
                Seite {filter.seite + 1} von {letzteSeite + 1}
              </span>
              <SeitenLink
                werte={einfach}
                seite={filter.seite + 1}
                aktiv={filter.seite < letzteSeite}
                text="Weiter"
              />
            </nav>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function SeitenLink({
  werte,
  seite,
  aktiv,
  text,
}: {
  werte: Record<string, string | undefined>;
  seite: number;
  aktiv: boolean;
  text: string;
}) {
  if (!aktiv) {
    return <span className="text-sm text-ink-subtle">{text}</span>;
  }
  const parameter = new URLSearchParams(
    Object.entries(werte).filter((eintrag): eintrag is [string, string] => Boolean(eintrag[1])),
  );
  parameter.set('seite', String(seite));
  return (
    <Link
      href={`/marktplatz?${parameter.toString()}`}
      className="text-sm text-ink underline-offset-4 hover:underline"
    >
      {text}
    </Link>
  );
}
