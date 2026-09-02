import { z } from 'zod';

import { Permission, readDealerProfile, updateDealerProfileUseCase } from '@ap/core';

import { ok, route } from '@/lib/api';
import { dealerProfileDeps } from '@/lib/deps';

const rawBody = z.object({}).passthrough();

export const GET = route(
  async (context) => ok({ dealer: await readDealerProfile(dealerProfileDeps, context.principal) }),
  { permission: Permission.DEALER_STATS_READ_OWN },
);

export const PATCH = route(
  async (context) => {
    const dealer = await updateDealerProfileUseCase(
      dealerProfileDeps,
      context.principal,
      await context.body(rawBody),
    );
    return ok({ dealer });
  },
  {
    permission: Permission.DEALER_MANAGE_OWN,
    rateLimit: { limit: 60, windowSeconds: 3600, scope: 'haendler:profil', perUser: true },
  },
);
