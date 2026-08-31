import { z } from 'zod';

import { errors } from '@ap/core';

import { route } from '@/lib/api';
import { imageStorage } from '@/lib/images/storage';

const pfad = z.object({ pfad: z.array(z.string().min(1)).min(1).max(6) });

/**
 * Liefert ein abgelegtes Bild aus.
 *
 * Oeffentlich: Ein Bild in einer Anzeige ist oeffentlich, sobald die Anzeige
 * es ist, und der Ablageschluessel ist nicht zu erraten (er enthaelt eine
 * cuid). Eine Zugriffspruefung je Bild waere hier ein Datenbankaufruf je
 * Vorschaubild in jeder Trefferliste -- der Preis steht in keinem
 * Verhaeltnis zum Gewinn.
 *
 * Was hier trotzdem passiert: Der Medientyp wird festgesetzt, nicht aus der
 * Ablage uebernommen, und `nosniff` verhindert, dass der Browser etwas
 * anderes daraus macht. Ausgeliefert wird ausschliesslich neu kodiertes
 * WebP -- siehe den Ablauf beim Hochladen.
 */
export const GET = route(
  async (context) => {
    const { pfad: teile } = await context.params(pfad);
    const schluessel = teile.join('/');

    const datei = await imageStorage.get(schluessel);
    if (!datei) throw errors.notFound();

    return new Response(new Uint8Array(datei.bytes), {
      status: 200,
      headers: {
        'content-type': 'image/webp',
        'x-content-type-options': 'nosniff',
        'content-length': String(datei.bytes.length),
        // Der Schluessel aendert sich, wenn das Bild sich aendert.
        'cache-control': 'public, max-age=31536000, immutable',
        'content-disposition': 'inline',
      },
    });
  },
  {
    auth: 'none',
    rateLimit: { limit: 600, windowSeconds: 60, scope: 'bilder' },
  },
);
