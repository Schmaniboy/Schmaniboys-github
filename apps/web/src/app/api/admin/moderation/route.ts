import { z } from 'zod';

import { Permission, moderate } from '@ap/core';

import { ok, route } from '@/lib/api';
import { moderationDeps } from '@/lib/deps';

const rawBody = z.object({}).passthrough();

export const POST = route(
  async (context) => {
    const ergebnis = await moderate(moderationDeps, context.principal, await context.body(rawBody));
    return ok(ergebnis);
  },
  {
    permission: Permission.LISTING_MODERATE,
    rateLimit: { limit: 200, windowSeconds: 3600, scope: 'admin:moderation', perUser: true },
  },
);
