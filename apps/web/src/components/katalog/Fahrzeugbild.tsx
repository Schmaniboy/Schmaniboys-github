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
        className={`flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-line bg-surface-2 px-6 py-10 text-center ${className ?? ''}`}
      >
        <p className="text-sm text-ink-muted">{KEIN_BILD}</p>
        <figcaption className="max-w-md text-xs leading-relaxed text-ink-subtle">
          {ergebnis.rejected > 0
            ? 'Vorhandene Aufnahmen zeigen nachweislich eine andere Ausführung — eine andere ' +
              'Generation, Phase oder Karosserie. Ein falsches Bild wäre schlechter als keines.'
            : 'Zu diesem Eintrag liegt kein Bild mit belegter Herkunft vor. Bilder werden nur ' +
              'aufgenommen, wenn Fundstelle, Urheber und Lizenz feststehen.'}
        </figcaption>
      </figure>
    );
  }

  const bild = ergebnis.image;
  const quelle = bild.storageKey ? `/api/bilder/${bild.storageKey}` : bild.sourceUrl;

  if (!quelle) {
    return (
      <figure
        className={`flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-line bg-surface-2 px-6 py-10 text-center ${className ?? ''}`}
      >
        <p className="text-sm text-ink-muted">{KEIN_BILD}</p>
        <figcaption className="text-xs text-ink-subtle">
          Zu diesem Eintrag ist eine Fundstelle vermerkt, aber noch keine Bilddatei übernommen.
        </figcaption>
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
