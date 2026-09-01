import { z } from 'zod';

import { verifyEmail } from '@ap/core';

import { ok, route } from '@/lib/api';
import { tokenDeps } from '@/lib/deps';

const rawBody = z.object({}).passthrough();

export const POST = route(
  async (context) => {
    const ergebnis = await verifyEmail(tokenDeps, await context.body(rawBody));
    return ok(ergebnis);
  },
  {
    auth: 'none',
    rateLimit: { limit: 20, windowSeconds: 3600, scope: 'auth:email-bestaetigen' },
  },
);
