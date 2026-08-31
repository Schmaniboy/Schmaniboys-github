import { z } from 'zod';

import { Permission, generateListingTexts } from '@ap/core';

import { ok, route } from '@/lib/api';
import { salesDeps } from '@/lib/sales-deps';

const pfad = z.object({ id: z.string().min(1) });

/**
 * Texterzeugung.
 *
 * Kostenpflichtig. Die Reihenfolge -- Eigentum, Bestaetigung, Verfuegbarkeit,
 * Guthaben, Aufruf, Pruefung, Buchung -- steht in `generateListingTexts`.
 * Hier bleibt nur: Recht pruefen, aufrufen, antworten.
 *
 * Die Ratenbegrenzung greift zusaetzlich zum Guthaben: Sie schuetzt vor
 * automatisierten Aufrufen, das Guthaben vor unerwarteten Kosten.
 */
export const POST = route(
  async (context) => {
    const { id } = await context.params(pfad);
    const ergebnis = await generateListingTexts(salesDeps, context.principal, id);

    return ok({
      texts: ergebnis.texts,
      charged: ergebnis.charged,
      /*
       * Die fehlenden Angaben gehen mit zurueck: Die verkaufende Person soll
       * sehen, worueber der Text nichts sagen konnte -- und die Luecken
       * gegebenenfalls schliessen.
       */
      missingFields: ergebnis.context.missingFields,
    });
  },
  {
    permission: Permission.AI_USE,
    rateLimit: { limit: 20, windowSeconds: 3600, scope: 'verkaufen:texte', perUser: true },
  },
);
