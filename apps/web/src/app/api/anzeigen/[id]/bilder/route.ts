import { z } from 'zod';

import {
  MAX_KANTE,
  MAX_UPLOAD_BYTES,
  Permission,
  ablageSchluessel,
  errors,
  imageOrderInput,
  pruefeMasse,
  pruefeUpload,
} from '@ap/core';
import {
  addImage,
  countImages,
  removeImage,
  reorderImages,
  setImageStorageKey,
} from '@ap/db';

import { imageProcessor } from '@/lib/images/processor';
import { imageStorage } from '@/lib/images/storage';
import { created, noContent, ok, route } from '@/lib/api';

const pfad = z.object({ id: z.string().min(1) });

/**
 * Bilder einer Anzeige.
 *
 * Der Ablauf beim Hochladen ist die eigentliche Sicherheitsmassnahme:
 *
 *  1. Groesse und Dateianfang pruefen -- der gemeldete Medientyp wird gar
 *     nicht erst entgegengenommen. Er ist eine Behauptung, kein Befund.
 *  2. Dekodieren und als WebP NEU SCHREIBEN. Damit sind EXIF-Daten weg --
 *     bei Fahrzeugbildern regelmaessig der Aufnahmeort, oft die Wohnadresse.
 *  3. Erst dann ablegen, unter einem selbst vergebenen Schluessel. Der
 *     Dateiname der hochladenden Person geht nirgends ein.
 */
export const POST = route(
  async (context) => {
    const { id } = await context.params(pfad);
    const userId = context.userId();

    const formular = await context.request.formData();
    const datei = formular.get('datei');
    if (!(datei instanceof File)) {
      throw errors.validation({ datei: ['Es wurde keine Datei übermittelt.'] });
    }
    if (datei.size > MAX_UPLOAD_BYTES) {
      throw errors.payloadTooLarge(
        `Bilder dürfen höchstens ${Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)} MB groß sein.`,
      );
    }

    const rohdaten = new Uint8Array(await datei.arrayBuffer());
    const vorhandene = await countImages(id);
    pruefeUpload({ bytes: rohdaten, vorhandeneBilder: vorhandene });

    const verarbeitet = await imageProcessor.normalise(rohdaten, MAX_KANTE);
    pruefeMasse({ width: verarbeitet.width, height: verarbeitet.height });

    // Zuerst den Eintrag, damit der Schluessel aus einer Kennung entsteht,
    // die wir vergeben haben -- und nicht aus etwas Erratenem.
    const eintrag = await addImage({
      listingId: id,
      sellerId: userId,
      storageKey: `platzhalter-${crypto.randomUUID()}`,
      width: verarbeitet.width,
      height: verarbeitet.height,
      byteSize: verarbeitet.bytes.length,
      contentType: verarbeitet.contentType,
    });

    const schluessel = ablageSchluessel(id, eintrag.id);
    await imageStorage.put(schluessel, verarbeitet.bytes, verarbeitet.contentType);
    await setImageStorageKey(eintrag.id, userId, schluessel);

    return created({ image: { ...eintrag, storageKey: schluessel } });
  },
  {
    permission: Permission.LISTING_MANAGE_OWN,
    rateLimit: { limit: 100, windowSeconds: 3600, scope: 'anzeigen:bild', perUser: true },
  },
);

export const PATCH = route(
  async (context) => {
    const { id } = await context.params(pfad);
    const { imageIds } = await context.body(imageOrderInput);
    await reorderImages(id, context.userId(), imageIds);
    return ok({ imageIds });
  },
  {
    permission: Permission.LISTING_MANAGE_OWN,
    rateLimit: { limit: 100, windowSeconds: 3600, scope: 'anzeigen:bildfolge', perUser: true },
  },
);

export const DELETE = route(
  async (context) => {
    await context.params(pfad);
    const bildId = context.request.nextUrl.searchParams.get('bildId');
    if (!bildId) throw errors.validation({ bildId: ['Es fehlt die Kennung des Bildes.'] });

    const { storageKey } = await removeImage(bildId, context.userId());
    await imageStorage.delete(storageKey);
    return noContent();
  },
  {
    permission: Permission.LISTING_MANAGE_OWN,
    rateLimit: { limit: 100, windowSeconds: 3600, scope: 'anzeigen:bildweg', perUser: true },
  },
);
