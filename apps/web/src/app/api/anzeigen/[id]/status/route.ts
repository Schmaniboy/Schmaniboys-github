import { z } from 'zod';

import { Permission, changeListingStatus } from '@ap/core';

import { ok, route } from '@/lib/api';
import { listingDeps } from '@/lib/deps';

const pfad = z.object({ id: z.string().min(1) });
const rawBody = z.object({}).passthrough();

export const PATCH = route(
  async (context) => {
    const { id } = await context.params(pfad);
    const aktualisiert = await changeListingStatus(
      listingDeps,
      id,
      context.userId(),
      await context.body(rawBody),
    );
    return ok({ listing: aktualisiert });
  },
  {
    permission: Permission.LISTING_MANAGE_OWN,
    rateLimit: { limit: 60, windowSeconds: 3600, scope: 'anzeigen:status', perUser: true },
  },
);
