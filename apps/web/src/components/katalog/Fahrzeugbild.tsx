import {
  IMAGE_LICENCE_STATUS_LABELS,
  IMAGE_ORIGIN_LABELS,
  IMAGE_SOURCE_TYPE_LABELS,
  type ImageBinding,
  type ImageRequest,
  KEIN_BILD,
  hatBild,
  urhebernennungPflicht,
  waehleBild,
} from '@ap/core';

/**
 * Ein Fahrzeug- oder Ausstattungsbild -- oder ausdruecklich keines.
 *
 * Die Auswahl trifft core/catalog/images.ts. Diese Komponente stellt nur
 * dar, was dort entschieden wurde -- und das schliesst den Fall ein, dass
 * nichts passt. Dann steht hier "Kein verifiziertes Bild verfuegbar." und
 * kein Bild.
 *
 * Der Reflex waere, in diesem Fall irgendein Bild derselben Baureihe zu
 * nehmen. Genau das ist verboten: Ein Golf 7 vor dem Facelift mit einem
 * Facelift-Bild ist eine Falschaussage ueber das Aussehen des Fahrzeugs,
 * und beim Gebrauchtkauf ist das Aussehen das erste Erkennungsmerkmal.
 */

export interface BildDaten extends ImageBinding {
  sourceType: NonNullable<ImageBinding['sourceType']>;
  licenceStatus: NonNullable<ImageBinding['licenceStatus']>;
  storageKey: string | null;
  sourceUrl: string | null;
  sourceTitle: string | null;
  author: string | null;
  licence: string;
  licenceUrl: string | null;
  description: string;
  width: number | null;
  height: number | null;
}

export function Fahrzeugbild({
  bilder,
  gesucht,
  className,
}: {
  bilder: BildDaten[];
  gesucht: ImageRequest;
  className?: string;
}) {
  const ergebnis = waehleBild(bilder, gesucht);

  if (!hatBild(ergebnis)) {
    return (
      <figure
        className={`relative overflow-hidden rounded-lg border border-line bg-gradient-to-br from-surface-2 to-surface-1 text-center ${className ?? ''}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_60%,rgba(255,51,85,0.04),transparent)]" />
        <div className="relative flex flex-col items-center justify-center gap-3 px-6 py-14">
          <svg viewBox="0 0 120 48" className="h-12 w-auto text-ink-subtle/30" fill="currentColor" aria-hidden="true">
            <path d="M18 38h-6a2 2 0 0 1-2-2v-8a2 2 0 0 1 .6-1.4l8-8A2 2 0 0 1 20 18h16l6-6a2 2 0 0 1 1.4-.6H80a2 2 0 0 1 1.4.6l10 10a2 2 0 0 1 .6 1.4v12a2 2 0 0 1-2 2h-6" />
            <path d="M18 38a6 6 0 1 0 12 0 6 6 0 0 0-12 0Zm60 0a6 6 0 1 0 12 0 6 6 0 0 0-12 0Z" />
            <rect x="36" y="24" width="28" height="8" rx="1.5" opacity="0.3" />
          </svg>
          <p className="text-sm font-medium text-ink-muted">{KEIN_BILD}</p>
          <figcaption className="max-w-sm text-xs leading-relaxed text-ink-subtle">
            {ergebnis.rejected > 0
              ? 'Vorhandene Aufnahmen zeigen eine andere Ausführung. Ein falsches Bild wäre schlechter als keines.'
              : 'Kein Bild mit belegter Herkunft vorhanden. Bilder werden nur aufgenommen, wenn Fundstelle, Urheber und Lizenz feststehen.'}
          </figcaption>
        </div>
      </figure>
    );
  }

  const bild = ergebnis.image;
  const quelle = bild.storageKey ? `/api/bilder/${bild.storageKey}` : bild.sourceUrl;

  if (!quelle) {
    return (
      <figure
        className={`relative overflow-hidden rounded-lg border border-line bg-gradient-to-br from-surface-2 to-surface-1 text-center ${className ?? ''}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_60%,rgba(255,51,85,0.04),transparent)]" />
        <div className="relative flex flex-col items-center justify-center gap-3 px-6 py-14">
          <svg viewBox="0 0 120 48" className="h-12 w-auto text-ink-subtle/30" fill="currentColor" aria-hidden="true">
            <path d="M18 38h-6a2 2 0 0 1-2-2v-8a2 2 0 0 1 .6-1.4l8-8A2 2 0 0 1 20 18h16l6-6a2 2 0 0 1 1.4-.6H80a2 2 0 0 1 1.4.6l10 10a2 2 0 0 1 .6 1.4v12a2 2 0 0 1-2 2h-6" />
            <path d="M18 38a6 6 0 1 0 12 0 6 6 0 0 0-12 0Zm60 0a6 6 0 1 0 12 0 6 6 0 0 0-12 0Z" />
            <rect x="36" y="24" width="28" height="8" rx="1.5" opacity="0.3" />
          </svg>
          <p className="text-sm font-medium text-ink-muted">{KEIN_BILD}</p>
          <figcaption className="max-w-sm text-xs leading-relaxed text-ink-subtle">
            Fundstelle vermerkt, aber noch keine Bilddatei übernommen.
          </figcaption>
        </div>
      </figure>
    );
  }

  return (
    <figure className={`overflow-hidden rounded-lg border border-line ${className ?? ''}`}>
      {/*
        Bewusst ohne next/image: Die Quellen liegen teils ausserhalb, und
        eine Bildoptimierung, die auf fremde Adressen zugreift, waere ein
        offener Weiterleitungspunkt. Die Groesse steht am Datensatz, damit
        der Platz reserviert bleibt und die Seite beim Laden nicht springt.
      */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={quelle}
        alt={bild.description}
        width={bild.width ?? undefined}
        height={bild.height ?? undefined}
        loading="lazy"
        decoding="async"
        className="block h-auto w-full bg-surface-2"
      />
      <figcaption className="space-y-1 border-t border-line bg-surface-1 px-4 py-3">
        <p className="text-sm text-ink">{bild.description}</p>

        {ergebnis.generated ? (
          <p className="text-xs font-medium text-caution">
            KI-erzeugte Darstellung. Zeigt kein tatsächlich gebautes Fahrzeug.
          </p>
        ) : null}

        {ergebnis.level !== 'EXACT' ? (
          <p className="text-xs text-ink-subtle">{ergebnis.statement}</p>
        ) : null}

        {/*
          Urhebernennung ist bei manchen Lizenzen Pflicht, nicht Zierde.
          Fehlt sie, wird das ausdruecklich gesagt statt still weggelassen --
          ein Bild unter CC BY ohne Nennung ist eine Rechtsverletzung.
        */}
        {urhebernennungPflicht({ licenceStatus: bild.licenceStatus }) && !bild.author ? (
          <p className="text-xs font-medium text-critical">
            Diese Lizenz verlangt eine Urhebernennung, es ist aber kein Urheber erfasst.
          </p>
        ) : null}

        <p className="text-xs text-ink-subtle">
          {IMAGE_SOURCE_TYPE_LABELS[bild.sourceType]}
          {' · '}
          {IMAGE_ORIGIN_LABELS[bild.origin]}
          {bild.author ? ` · ${bild.author}` : ''}
          {' · '}
          {bild.licenceUrl ? (
            <a
              href={bild.licenceUrl}
              rel="noopener noreferrer nofollow"
              target="_blank"
              className="underline underline-offset-2"
            >
              {bild.licence}
            </a>
          ) : (
            bild.licence
          )}
          {' · '}
          {IMAGE_LICENCE_STATUS_LABELS[bild.licenceStatus]}
          {bild.sourceUrl ? (
            <>
              {' · '}
              <a
                href={bild.sourceUrl}
                rel="noopener noreferrer nofollow"
                target="_blank"
                className="underline underline-offset-2"
              >
                Fundstelle
              </a>
            </>
          ) : null}
        </p>
      </figcaption>
    </figure>
  );
}
