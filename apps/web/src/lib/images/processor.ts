import 'server-only';

import sharp from 'sharp';

import { errors, type ImageProcessor } from '@ap/core';

/**
 * Bildverarbeitung mit sharp.
 *
 * Vollstaendige Neukodierung, nicht Durchreichen: Was hereinkommt, wird
 * dekodiert und als WebP neu geschrieben. Damit sind EXIF-Daten weg -- bei
 * Fahrzeugbildern regelmaessig der Aufnahmeort, oft die Wohnadresse der
 * verkaufenden Person -- und ebenso alles, was sich sonst an eine Bilddatei
 * anhaengen laesst.
 *
 * `failOn: 'error'` und die Pixelgrenze sind kein Zierrat: Ohne sie liesse
 * sich mit einer kleinen Datei, die riesige Masse ankuendigt, der
 * Arbeitsspeicher fuellen.
 */

/** Obergrenze fuer die dekodierte Bildflaeche. */
const MAX_PIXEL = 80_000_000;

export class SharpImageProcessor implements ImageProcessor {
  async normalise(
    bytes: Uint8Array,
    maxKante: number,
  ): Promise<{ bytes: Uint8Array; width: number; height: number; contentType: string }> {
    try {
      const bild = sharp(Buffer.from(bytes), {
        failOn: 'error',
        limitInputPixels: MAX_PIXEL,
        // Nur ein Einzelbild. Ein animiertes WebP mit tausend Bildern waere
        // sonst eine sehr guenstige Art, Rechenzeit zu verbrauchen.
        animated: false,
      });

      const beschreibung = await bild.metadata();
      if (!beschreibung.width || !beschreibung.height) {
        throw errors.unsupportedMediaType('Die Bildmaße ließen sich nicht bestimmen.');
      }

      const ergebnis = await bild
        .rotate() // Nach der EXIF-Ausrichtung drehen, bevor sie verworfen wird.
        .resize({ width: maxKante, height: maxKante, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer({ resolveWithObject: true });

      return {
        bytes: new Uint8Array(ergebnis.data),
        width: ergebnis.info.width,
        height: ergebnis.info.height,
        contentType: 'image/webp',
      };
    } catch {
      // Ein kaputtes oder verkleidetes Bild ist kein Serverfehler.
      throw errors.unsupportedMediaType(
        'Diese Datei ließ sich nicht als Bild lesen. Bitte ein JPEG, PNG oder WebP hochladen.',
      );
    }
  }
}

export const imageProcessor = new SharpImageProcessor();
