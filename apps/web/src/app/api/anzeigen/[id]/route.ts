import { z } from 'zod';

import { Permission, readOwnListing, updateListing } from '@ap/core';

import { ok, route } from '@/lib/api';
import { listingDeps } from '@/lib/deps';

const pfad = z.object({ id: z.string().min(1) });
const rawBody = z.object({}).passthrough();

export const GET = route(
  async (context) => {
    const { id } = await context.params(pfad);
    const anzeige = await readOwnListing(listingDeps, id, context.userId());
    return ok({ listing: anzeige });
  },
  { auth: 'required' },
);

export const PATCH = route(
  async (context) => {
    const { id } = await context.params(pfad);
    const anzeige = await updateListing(listingDeps, id, context.userId(), await context.body(rawBody));
    return ok({ listing: anzeige });
  },
  {
    permission: Permission.LISTING_MANAGE_OWN,
    rateLimit: { limit: 120, windowSeconds: 3600, scope: 'anzeigen:aendern', perUser: true },
  },
);
