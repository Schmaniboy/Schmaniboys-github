import { z } from 'zod';

import { Permission, setOpeningHours } from '@ap/core';

import { ok, route } from '@/lib/api';
import { dealerProfileDeps } from '@/lib/deps';

const rawBody = z.object({}).passthrough();

export const PUT = route(
  async (context) => {
    const ergebnis = await setOpeningHours(dealerProfileDeps, context.principal, await context.body(rawBody));
    return ok(ergebnis);
  },
  {
    permission: Permission.DEALER_MANAGE_OWN,
    rateLimit: { limit: 60, windowSeconds: 3600, scope: 'haendler:zeiten', perUser: true },
  },
);
