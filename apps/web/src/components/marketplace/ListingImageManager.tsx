'use client';

import { useEffect, useRef, useState } from 'react';

import { MAX_BILDER_JE_ANZEIGE, MAX_UPLOAD_BYTES } from '@ap/core/marketplace/images';


/**
 * Bilder einer Anzeige verwalten.
 *
 * Die Groessenpruefung hier ist eine Bequemlichkeit, keine Sicherung: Der
 * Server prueft dieselbe Grenze noch einmal, und zwar am Dateianfang statt
 * am gemeldeten Medientyp. Was der Browser sagt, ist eine Behauptung.
 */

interface Bild {
  id: string;
  storageKey: string;
  position: number;
  width: number;
  height: number;
  altText: string | null;
}

export function ListingImageManager({
  listingId,
  bilder: anfaenglich,
}: {
  listingId: string;
  bilder: Bild[];
}) {
  const [bilder, setBilder] = useState<Bild[]>(anfaenglich);
  const [bereit, setBereit] = useState(false);
  const [laeuft, setLaeuft] = useState(false);
  const [meldung, setMeldung] = useState<string | null>(null);
  const dateiFeld = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setBereit(true);
  }, []);

  async function hochladen(dateien: FileList | null) {
    if (!dateien || dateien.length === 0) return;
    setLaeuft(true);
    setMeldung(null);

    const neue: Bild[] = [];
    for (const datei of Array.from(dateien)) {
      if (datei.size > MAX_UPLOAD_BYTES) {
        setMeldung(
          `„${datei.name}" ist größer als ${Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)} MB.`,
        );
        continue;
      }

      const formular = new FormData();
      formular.append('datei', datei);

      try {
        const antwort = await fetch(`/api/anzeigen/${listingId}/bilder`, {
          method: 'POST',
          body: formular,
        });
        const inhalt = (await antwort.json()) as {
          data?: { image: Bild };
          error?: { message?: string };
        };
        if (antwort.ok && inhalt.data) {
          neue.push(inhalt.data.image);
        } else {
          setMeldung(inhalt.error?.message ?? `„${datei.name}" wurde nicht angenommen.`);
        }
      } catch {
        setMeldung(`„${datei.name}" wurde nicht angenommen.`);
      }
    }

    if (neue.length > 0) setBilder((bisher) => [...bisher, ...neue]);
    if (dateiFeld.current) dateiFeld.current.value = '';
    setLaeuft(false);
  }

  async function entfernen(bildId: string) {
    if (!window.confirm('Dieses Bild wird gelöscht. Fortfahren?')) return;
    setLaeuft(true);
    try {
      const antwort = await fetch(
        `/api/anzeigen/${listingId}/bilder?bildId=${encodeURIComponent(bildId)}`,
        { method: 'DELETE' },
      );
      if (antwort.ok) {
        setBilder((bisher) => bisher.filter((bild) => bild.id !== bildId));
      } else {
        setMeldung('Das Bild ließ sich nicht entfernen.');
      }
    } catch {
      setMeldung('Das Bild ließ sich nicht entfernen.');
    } finally {
      setLaeuft(false);
    }
  }

  async function verschieben(index: number, richtung: -1 | 1) {
    const ziel = index + richtung;
    if (ziel < 0 || ziel >= bilder.length) return;

    const neu = [...bilder];
    const [bewegt] = neu.splice(index, 1);
    if (!bewegt) return;
    neu.splice(ziel, 0, bewegt);
    setBilder(neu);

    try {
      await fetch(`/api/anzeigen/${listingId}/bilder`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ imageIds: neu.map((bild) => bild.id) }),
      });
    } catch {
      setMeldung('Die Reihenfolge ließ sich nicht speichern.');
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed text-ink-muted">
        JPEG, PNG oder WebP, höchstens {MAX_BILDER_JE_ANZEIGE} Bilder. Jedes Bild wird beim
        Hochladen neu geschrieben — damit verschwinden die Aufnahmedaten aus der Datei,
        insbesondere der Aufnahmeort. Das erste Bild ist das Vorschaubild.
      </p>

      {meldung ? (
        <p
          role="status"
          className="rounded-md border border-caution/40 bg-caution/10 px-4 py-3 text-sm text-caution"
        >
          {meldung}
        </p>
      ) : null}

      {bilder.length > 0 ? (
        <ul className="grid gap-3 sm:grid-cols-2">
          {bilder.map((bild, index) => (
            <li
              key={bild.id}
              className="overflow-hidden rounded-md border border-line/60 bg-surface-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/api/bilder/${bild.storageKey}`}
                alt={bild.altText ?? `Bild ${index + 1}`}
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="flex items-center justify-between gap-2 p-2">
                <span className="text-xs text-ink-subtle">
                  {index === 0 ? 'Vorschaubild' : `Bild ${index + 1}`}
                </span>
                <span className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => verschieben(index, -1)}
                    disabled={!bereit || index === 0}
                    aria-label="Nach vorne"
                    className="rounded border border-line px-2 py-1 text-xs text-ink-muted disabled:opacity-40"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => verschieben(index, 1)}
                    disabled={!bereit || index === bilder.length - 1}
                    aria-label="Nach hinten"
                    className="rounded border border-line px-2 py-1 text-xs text-ink-muted disabled:opacity-40"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => entfernen(bild.id)}
                    disabled={!bereit || laeuft}
                    className="rounded border border-caution/50 px-2 py-1 text-xs text-caution disabled:opacity-40"
                  >
                    Entfernen
                  </button>
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-ink-subtle">Noch keine Bilder.</p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={dateiFeld}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          disabled={!bereit || laeuft || bilder.length >= MAX_BILDER_JE_ANZEIGE}
          onChange={(ereignis) => hochladen(ereignis.currentTarget.files)}
          className="block text-sm text-ink-muted file:mr-3 file:rounded-md file:border file:border-line file:bg-surface-2 file:px-3 file:py-1.5 file:text-sm file:text-ink"
        />
        {laeuft ? <span className="text-sm text-ink-subtle">Wird hochgeladen …</span> : null}
      </div>

      {bilder.length >= MAX_BILDER_JE_ANZEIGE ? (
        <p className="text-sm text-ink-subtle">
          Die Höchstzahl von {MAX_BILDER_JE_ANZEIGE} Bildern ist erreicht.
        </p>
      ) : null}
    </div>
  );
}
