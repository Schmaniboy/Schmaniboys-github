import { z } from 'zod';

import { Permission, errors, pruefeBegruendung, systemClock } from '@ap/core';
import { auditLogger, moderateListing, moderateMessage } from '@ap/db';

import { ok, route } from '@/lib/api';

const eingabe = z.object({
  ziel: z.enum(['LISTING', 'MESSAGE']),
  id: z.string().min(1),
  aktion: z.enum(['HIDE', 'RESTORE']),
  reason: z.string().min(1).max(1000),
});

/**
 * Moderation von Anzeigen und Nachrichten.
 *
 * Die Massnahme entzieht die Sichtbarkeit, sie loescht nichts: Eine Anzeige
 * geht auf PAUSED, eine Nachricht wird als entfernt markiert und bleibt fuer
 * die Moderation lesbar. Wird der Verdacht ausgeraeumt, stellt dieselbe
 * Massnahme sie zurueck.
 */
export const POST = route(
  async (context) => {
    const daten = await context.body(eingabe);
    const grund = pruefeBegruendung(daten.reason);
    const actorId = context.principal?.userId ?? null;

    if (daten.ziel === 'LISTING') {
      await moderateListing({
        listingId: daten.id,
        aktion: daten.aktion,
        grund,
        actorId: actorId ?? '',
      });
      await auditLogger.record({
        action: 'listing.moderated',
        actorId,
        subjectType: 'Listing',
        subjectId: daten.id,
        metadata: { aktion: daten.aktion, grund },
      });
      return ok({ ziel: daten.ziel, id: daten.id, aktion: daten.aktion });
    }

    if (!context.principal || !hatRecht(context.principal.role)) {
      throw errors.forbidden();
    }

    await moderateMessage({
      messageId: daten.id,
      aktion: daten.aktion,
      grund,
      jetzt: systemClock.now(),
    });
    await auditLogger.record({
      action: 'message.moderated',
      actorId,
      subjectType: 'Message',
      subjectId: daten.id,
      metadata: { aktion: daten.aktion, grund },
    });

    return ok({ ziel: daten.ziel, id: daten.id, aktion: daten.aktion });
  },
  {
    permission: Permission.LISTING_MODERATE,
    rateLimit: { limit: 200, windowSeconds: 3600, scope: 'admin:moderation', perUser: true },
  },
);

/** Nachrichten zu moderieren ist ein eigenes Recht. */
function hatRecht(rolle: string): boolean {
  return rolle === 'ADMIN' || rolle === 'SUPER_ADMIN';
}
