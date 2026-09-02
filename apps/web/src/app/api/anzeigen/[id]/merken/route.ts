import { z } from 'zod';

import { Permission, addListingFavorite, removeListingFavorite } from '@ap/core';

import { noContent, ok, route } from '@/lib/api';
import { listingDeps } from '@/lib/deps';

const pfad = z.object({ id: z.string().min(1) });

export const PUT = route(
  async (context) => {
    const { id } = await context.params(pfad);
    const ergebnis = await addListingFavorite(listingDeps, context.userId(), id);
    return ok(ergebnis);
  },
  {
    permission: Permission.LISTING_CREATE,
    rateLimit: { limit: 300, windowSeconds: 3600, scope: 'anzeigen:merken', perUser: true },
  },
);

export const DELETE = route(
  async (context) => {
    const { id } = await context.params(pfad);
    await removeListingFavorite(listingDeps, context.userId(), id);
    return noContent();
  },
  { auth: 'required' },
);
