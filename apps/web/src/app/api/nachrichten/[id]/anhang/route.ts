import { z } from 'zod';

import {
  MAX_KANTE,
  MAX_UPLOAD_BYTES,
  Permission,
  errors,
  pruefeUpload,
  systemClock,
} from '@ap/core';
import { addMessageAttachment, findOwnConversation } from '@ap/db';

import { imageProcessor } from '@/lib/images/processor';
import { imageStorage } from '@/lib/images/storage';
import { created, route } from '@/lib/api';

const pfad = z.object({ id: z.string().min(1) });

/**
 * Bild an eine Nachricht anhaengen.
 *
 * "Sichere Anhaenge" heisst hier: **nur Bilder, und nur neu kodierte.**
 * Beliebige Dateien in einem Posteingang waeren ein Verteilweg fuer
 * Schadsoftware -- und ein Posteingang ist genau die Stelle, an der Leute
 * anklicken, was ihnen jemand schickt.
 *
 * Der Weg ist derselbe wie bei Anzeigenbildern (ADR-008): Dateianfang
 * pruefen, dekodieren, als WebP neu schreiben, unter selbst vergebenem
 * Schluessel ablegen. Danach traegt die Datei nichts mehr mit sich -- weder
 * eingebettete Skripte noch den Aufnahmeort.
 */
export const POST = route(
  async (context) => {
    const { id } = await context.params(pfad);
    const userId = context.userId();

    // Beteiligung am Gespraech, bevor irgendetwas verarbeitet wird.
    const gespraech = await findOwnConversation(id, userId);
    if (!gespraech) throw errors.notFound();

    const formular = await context.request.formData();
    const messageId = String(formular.get('messageId') ?? '');
    const datei = formular.get('datei');

    if (!messageId) {
      throw errors.validation({ messageId: ['Es fehlt die Kennung der Nachricht.'] });
    }
    if (!(datei instanceof File)) {
      throw errors.validation({ datei: ['Es wurde keine Datei übermittelt.'] });
    }
    if (datei.size > MAX_UPLOAD_BYTES) {
      throw errors.payloadTooLarge('Das Bild ist zu groß.');
    }

    const rohdaten = new Uint8Array(await datei.arrayBuffer());
    pruefeUpload({ bytes: rohdaten, vorhandeneBilder: 0 });

    const verarbeitet = await imageProcessor.normalise(rohdaten, MAX_KANTE);
    const jetzt = systemClock.now();

    /*
     * Zuerst der Eintrag -- der Schluessel enthaelt dessen Kennung. Erst
     * danach die Datei: Ein Schluessel, den wir selbst vergeben haben, ist
     * nicht zu erraten und enthaelt keinen fremden Dateinamen.
     */
    const platzhalter = `nachrichten/${id}/${crypto.randomUUID()}.webp`;
    const eintrag = await addMessageAttachment({
      messageId,
      senderId: userId,
      storageKey: platzhalter,
      width: verarbeitet.width,
      height: verarbeitet.height,
      byteSize: verarbeitet.bytes.length,
      contentType: verarbeitet.contentType,
      jetzt,
    });

    await imageStorage.put(platzhalter, verarbeitet.bytes, verarbeitet.contentType);

    return created({ attachment: eintrag });
  },
  {
    permission: Permission.MESSAGE_SEND,
    rateLimit: { limit: 60, windowSeconds: 3600, scope: 'nachrichten:anhang', perUser: true },
  },
);
