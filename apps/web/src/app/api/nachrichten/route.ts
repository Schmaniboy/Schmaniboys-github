import { z } from 'zod';

import {
  MAX_NEUE_GESPRAECHE_JE_STUNDE,
  Permission,
  errors,
  systemClock,
} from '@ap/core';
import { countRecentConversations, listOwnConversations, startListingConversation } from '@ap/db';

import { created, ok, route } from '@/lib/api';

const anlegen = z.object({ listingId: z.string().min(1) });

/**
 * Gespraeche.
 *
 * Die zusaetzliche Zaehlung neuer Gespraeche je Stunde ergaenzt die
 * allgemeine Ratenbegrenzung: Diese zaehlt Aufrufe, jene zaehlt tatsaechlich
 * angelegte Gespraeche. Wer zehn Anzeigen anschreibt, hat etwas vor -- wer
 * hundert anschreibt, etwas anderes.
 */
export const GET = route(
  async (context) => ok({ conversations: await listOwnConversations(context.userId()) }),
  { permission: Permission.MESSAGE_READ_OWN },
);

export const POST = route(
  async (context) => {
    const { listingId } = await context.body(anlegen);
    const userId = context.userId();
    const jetzt = systemClock.now();

    const seit = new Date(jetzt.getTime() - 60 * 60 * 1000);
    if ((await countRecentConversations(userId, seit)) >= MAX_NEUE_GESPRAECHE_JE_STUNDE) {
      throw errors.rateLimited(3600);
    }

    const gespraech = await startListingConversation({ listingId, initiatorId: userId, jetzt });
    return created({ conversation: gespraech });
  },
  {
    permission: Permission.MESSAGE_SEND,
    rateLimit: { limit: 30, windowSeconds: 3600, scope: 'nachrichten:gespraech', perUser: true },
  },
);
