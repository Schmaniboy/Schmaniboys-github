import { z } from 'zod';

import { Permission, errors, istOeffentlichSichtbar, systemClock } from '@ap/core';
import { addFavorite, prisma, removeFavorite } from '@ap/db';

import { noContent, ok, route } from '@/lib/api';

const pfad = z.object({ id: z.string().min(1) });

/**
 * Merkliste.
 *
 * Gemerkt werden koennen nur sichtbare Anzeigen -- sonst liesse sich ueber
 * das Merken pruefen, ob eine bestimmte Kennung existiert. Das Entfernen
 * geht dagegen immer: Wer eine inzwischen verkaufte Anzeige aus seiner
 * Liste nehmen will, soll das koennen.
 */
export const PUT = route(
  async (context) => {
    const { id } = await context.params(pfad);

    const anzeige = await prisma.listing.findUnique({
      where: { id },
      select: { status: true, expiresAt: true },
    });
    if (!anzeige || !istOeffentlichSichtbar(anzeige, systemClock.now())) {
      throw errors.notFound();
    }

    await addFavorite(context.userId(), id);
    return ok({ gemerkt: true });
  },
  {
    permission: Permission.LISTING_CREATE,
    rateLimit: { limit: 300, windowSeconds: 3600, scope: 'anzeigen:merken', perUser: true },
  },
);

export const DELETE = route(
  async (context) => {
    const { id } = await context.params(pfad);
    await removeFavorite(context.userId(), id);
    return noContent();
  },
  { auth: 'required' },
);
