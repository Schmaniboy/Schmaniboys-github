'use client';

import { useState } from 'react';

/**
 * Bildergalerie einer Anzeige.
 *
 * Ohne JavaScript bleibt das erste Bild sichtbar -- die Miniaturen sind
 * Schaltflaechen, kein Ersatz fuer den Inhalt. Wer die Seite ausdruckt oder
 * mit abgeschaltetem Skript liest, sieht das Fahrzeug trotzdem.
 */

interface Bild {
  id: string;
  storageKey: string;
  altText: string | null;
  width: number;
  height: number;
}

export function ListingGallery({
  bilder,
  bezeichnung,
}: {
  bilder: Bild[];
  bezeichnung: string;
}) {
  const [aktiv, setAktiv] = useState(0);

  if (bilder.length === 0) {
    return (
      <div className="mt-6 flex aspect-[16/9] w-full items-center justify-center rounded-lg border border-line/60 bg-surface-2 text-sm text-ink-subtle">
        Zu dieser Anzeige sind keine Bilder hinterlegt.
      </div>
    );
  }

  const gezeigt = bilder[Math.min(aktiv, bilder.length - 1)];
  if (!gezeigt) return null;

  return (
    <div className="mt-6">
      <div className="overflow-hidden rounded-lg border border-line/60 bg-surface-2">
        {/* eslint-disable-next-line @next/next/no-img-element -- eigene Ablage,
            beim Hochladen bereits auf Zielgroesse gebracht. */}
        <img
          src={`/api/bilder/${gezeigt.storageKey}`}
          alt={gezeigt.altText ?? `${bezeichnung}, Bild ${aktiv + 1} von ${bilder.length}`}
          width={gezeigt.width}
          height={gezeigt.height}
          className="max-h-[70vh] w-full object-contain"
        />
      </div>

      {bilder.length > 1 ? (
        <ul className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {bilder.map((bild, index) => (
            <li key={bild.id} className="shrink-0">
              <button
                type="button"
                onClick={() => setAktiv(index)}
                aria-label={`Bild ${index + 1} von ${bilder.length} anzeigen`}
                aria-current={index === aktiv}
                className={`block h-16 w-24 overflow-hidden rounded border transition-colors ${
                  index === aktiv ? 'border-accent' : 'border-line/60 hover:border-line'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- s.o. */}
                <img
                  src={`/api/bilder/${bild.storageKey}`}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
