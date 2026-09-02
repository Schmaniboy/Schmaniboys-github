import { z } from 'zod';

import { Permission, createListing, listingSearchInput, searchPublicListings } from '@ap/core';

import { created, ok, route } from '@/lib/api';
import { listingDeps } from '@/lib/deps';

const rawBody = z.object({}).passthrough();

export const GET = route(
  async (context) => {
    const eigene = context.request.nextUrl.searchParams.get('eigene') === 'true';

    if (eigene) {
      const userId = context.principal?.userId;
      if (!userId) return ok({ listings: [] });
      return ok({ listings: await listingDeps.listings.listOwnListings(userId) });
    }

    const filter = context.query(listingSearchInput);
    return ok(await searchPublicListings(listingDeps, filter));
  },
  { auth: 'optional' },
);

export const POST = route(
  async (context) => {
    const anzeige = await createListing(listingDeps, context.principal, await context.body(rawBody));
    return created({ listing: anzeige });
  },
  {
    permission: Permission.LISTING_CREATE,
    rateLimit: { limit: 20, windowSeconds: 3600, scope: 'anzeigen:anlegen', perUser: true },
  },
);
