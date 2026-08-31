import { z } from 'zod';

import { systemClock } from '@ap/core';
import { countUnreadNotifications, listNotifications, markNotificationsRead } from '@ap/db';

import { ok, route } from '@/lib/api';

const abhaken = z.object({
  /** Null bedeutet: alle. */
  ids: z.array(z.string().min(1)).max(200).nullable().default(null),
});

/**
 * Benachrichtigungen.
 *
 * Die Kopfzeile fragt den Zaehler auf jeder Seite ab -- deshalb `auth:
 * optional` und eine Null fuer Nichtangemeldete statt eines 401. Ein 401 auf
 * jeder oeffentlichen Seite waere ein Dauerfehler in der Browserkonsole, in
 * dem echte Fehler untergehen.
 */
export const GET = route(
  async (context) => {
    const userId = context.principal?.userId;
    if (!userId) return ok({ notifications: [], unread: 0 });

    const nurUngelesene = context.request.nextUrl.searchParams.get('ungelesen') === 'true';
    const [benachrichtigungen, ungelesen] = await Promise.all([
      listNotifications(userId, nurUngelesene),
      countUnreadNotifications(userId),
    ]);

    return ok({ notifications: benachrichtigungen, unread: ungelesen });
  },
  { auth: 'optional' },
);

export const PATCH = route(
  async (context) => {
    const { ids } = await context.body(abhaken);
    const anzahl = await markNotificationsRead(context.userId(), ids, systemClock.now());
    return ok({ gelesen: anzahl });
  },
  {
    auth: 'required',
    rateLimit: { limit: 120, windowSeconds: 3600, scope: 'benachrichtigungen', perUser: true },
  },
);
