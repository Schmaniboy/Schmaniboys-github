import { errors } from '../errors';

/**
 * Regeln fuer Bilder in Anzeigen.
 *
 * Der wichtigste Satz zuerst: Ein `Content-Type` aus einem Upload ist eine
 * Behauptung der hochladenden Seite, kein Befund. Wer ihm glaubt, laesst
 * beliebige Dateien als Bild durch. Geprueft werden deshalb die ersten
 * Bytes -- und selbst danach wird die Datei nicht uebernommen, sondern
 * dekodiert und neu geschrieben.
 */

export const MAX_BILDER_JE_ANZEIGE = 20;
/** Grenze fuer die hochgeladene Datei. Grosszuegig, aber nicht unbegrenzt. */
export const MAX_UPLOAD_BYTES = 12 * 1024 * 1024;
/** Kantenlaenge, auf die verkleinert wird. Mehr braucht keine Anzeige. */
export const MAX_KANTE = 2000;
/** Unter dieser Kantenlaenge ist ein Fahrzeugbild nicht zu gebrauchen. */
export const MIN_KANTE = 400;

export type BildFormat = 'jpeg' | 'png' | 'webp';

/**
 * Erkennungsmerkmale am Dateianfang.
 *
 * JPEG beginnt mit FF D8 FF, PNG mit der festen Acht-Byte-Folge aus der
 * Spezifikation, WebP ist ein RIFF-Container mit der Kennung "WEBP" an
 * Stelle 8.
 */
const SIGNATUREN: { format: BildFormat; pruefe: (bytes: Uint8Array) => boolean }[] = [
  {
    format: 'jpeg',
    pruefe: (b) => b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  },
  {
    format: 'png',
    pruefe: (b) =>
      b.length >= 8 &&
      b[0] === 0x89 &&
      b[1] === 0x50 &&
      b[2] === 0x4e &&
      b[3] === 0x47 &&
      b[4] === 0x0d &&
      b[5] === 0x0a &&
      b[6] === 0x1a &&
      b[7] === 0x0a,
  },
  {
    format: 'webp',
    pruefe: (b) =>
      b.length >= 12 &&
      b[0] === 0x52 && // R
      b[1] === 0x49 && // I
      b[2] === 0x46 && // F
      b[3] === 0x46 && // F
      b[8] === 0x57 && // W
      b[9] === 0x45 && // E
      b[10] === 0x42 && // B
      b[11] === 0x50, // P
  },
];

/** Erkennt das Format anhand der ersten Bytes. `null` heisst: kein Bild. */
export function erkenneFormat(bytes: Uint8Array): BildFormat | null {
  return SIGNATUREN.find((eintrag) => eintrag.pruefe(bytes))?.format ?? null;
}

export interface UploadPruefung {
  format: BildFormat;
}

/**
 * Prueft einen Upload, bevor er ueberhaupt dekodiert wird.
 *
 * Der gemeldete Medientyp geht hier absichtlich nicht ein -- er wird nicht
 * einmal entgegengenommen. Was zaehlt, sind Groesse und Dateianfang.
 */
export function pruefeUpload(input: {
  bytes: Uint8Array;
  vorhandeneBilder: number;
}): UploadPruefung {
  if (input.vorhandeneBilder >= MAX_BILDER_JE_ANZEIGE) {
    throw errors.conflict(
      `Mehr als ${MAX_BILDER_JE_ANZEIGE} Bilder je Anzeige sind nicht vorgesehen.`,
    );
  }

  if (input.bytes.length === 0) {
    throw errors.validation({ datei: ['Die Datei ist leer.'] });
  }

  if (input.bytes.length > MAX_UPLOAD_BYTES) {
    throw errors.payloadTooLarge(
      `Bilder dürfen höchstens ${Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)} MB groß sein.`,
    );
  }

  const format = erkenneFormat(input.bytes);
  if (!format) {
    throw errors.unsupportedMediaType(
      'Diese Datei ist kein JPEG, PNG oder WebP. Erkannt wird das am Dateianfang, ' +
        'nicht an der Endung und nicht an der Angabe des Browsers.',
    );
  }

  return { format };
}

export interface BildMasse {
  width: number;
  height: number;
}

/** Prueft die Masse nach dem Dekodieren. */
export function pruefeMasse(masse: BildMasse): void {
  if (masse.width < MIN_KANTE && masse.height < MIN_KANTE) {
    throw errors.validation({
      datei: [
        `Das Bild ist mit ${masse.width}×${masse.height} zu klein. ` +
          `Mindestens ${MIN_KANTE} Pixel an der längeren Kante.`,
      ],
    });
  }
}

/**
 * Zielgroesse beim Verkleinern.
 *
 * Vergroessert wird nie: Aus einem kleinen Bild ein grosses zu rechnen
 * bringt keine Bildinformation dazu, nur Dateigroesse.
 */
export function zielMasse(masse: BildMasse, maxKante = MAX_KANTE): BildMasse {
  const laengste = Math.max(masse.width, masse.height);
  if (laengste <= maxKante) return masse;

  const faktor = maxKante / laengste;
  return {
    width: Math.max(1, Math.round(masse.width * faktor)),
    height: Math.max(1, Math.round(masse.height * faktor)),
  };
}

/**
 * Ablageschluessel.
 *
 * Der Dateiname der hochladenden Person geht ausdruecklich nicht ein: Er
 * kann Pfadanteile ("../"), Steuerzeichen oder einen zweiten Punkt vor einer
 * ausfuehrbaren Endung enthalten. Der Schluessel wird deshalb aus Kennungen
 * gebaut, die wir selbst vergeben haben.
 */
export function ablageSchluessel(listingId: string, bildId: string): string {
  return `listings/${listingId}/${bildId}.webp`;
}
