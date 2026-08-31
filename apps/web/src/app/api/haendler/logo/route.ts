import {
  MAX_UPLOAD_BYTES,
  Permission,
  errors,
  pruefeUpload,
  requireSameDealer,
} from '@ap/core';
import { findDealer, setDealerLogo } from '@ap/db';

import { imageProcessor } from '@/lib/images/processor';
import { imageStorage } from '@/lib/images/storage';
import { noContent, ok, route } from '@/lib/api';

/** Kantenlaenge des Logos. Groesser braucht es in keiner Ansicht. */
const LOGO_KANTE = 600;

/**
 * Haendlerlogo.
 *
 * Derselbe Weg wie bei Anzeigenbildern (ADR-008): Dateianfang pruefen,
 * dekodieren, als WebP neu schreiben, unter selbst vergebenem Schluessel
 * ablegen. Auch ein Logo kann eine verkleidete Datei sein.
 *
 * Die Massenpruefung entfaellt hier bewusst -- ein Logo darf klein sein.
 */
export const PUT = route(
  async (context) => {
    const dealerId = context.principal?.dealerId;
    requireSameDealer(context.principal, dealerId);

    const formular = await context.request.formData();
    const datei = formular.get('datei');
    if (!(datei instanceof File)) {
      throw errors.validation({ datei: ['Es wurde keine Datei übermittelt.'] });
    }
    if (datei.size > MAX_UPLOAD_BYTES) {
      throw errors.payloadTooLarge('Das Logo ist zu groß.');
    }

    const rohdaten = new Uint8Array(await datei.arrayBuffer());
    pruefeUpload({ bytes: rohdaten, vorhandeneBilder: 0 });

    const verarbeitet = await imageProcessor.normalise(rohdaten, LOGO_KANTE);

    /*
     * Neuer Schluessel je Upload, nicht ein fester Name. Bilder werden mit
     * `immutable` und einem Jahr Gueltigkeit ausgeliefert -- unter demselben
     * Schluessel bliebe das alte Logo in Browser-Zwischenspeichern stehen,
     * moeglicherweise fuer immer.
     */
    const vorher = await findDealer(dealerId as string);
    const schluessel = `dealers/${dealerId}/logo-${crypto.randomUUID()}.webp`;

    await imageStorage.put(schluessel, verarbeitet.bytes, verarbeitet.contentType);
    await setDealerLogo(dealerId as string, schluessel);

    if (vorher?.logoStorageKey && vorher.logoStorageKey !== schluessel) {
      await imageStorage.delete(vorher.logoStorageKey);
    }

    return ok({ logoStorageKey: schluessel });
  },
  {
    permission: Permission.DEALER_MANAGE_OWN,
    rateLimit: { limit: 20, windowSeconds: 3600, scope: 'haendler:logo', perUser: true },
  },
);

export const DELETE = route(
  async (context) => {
    const dealerId = context.principal?.dealerId;
    requireSameDealer(context.principal, dealerId);

    const haendler = await findDealer(dealerId as string);
    if (haendler?.logoStorageKey) await imageStorage.delete(haendler.logoStorageKey);
    await setDealerLogo(dealerId as string, null);

    return noContent();
  },
  { permission: Permission.DEALER_MANAGE_OWN },
);
