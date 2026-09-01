import { z } from 'zod';

import { resetPassword } from '@ap/core';

import { ok, route } from '@/lib/api';
import { tokenDeps } from '@/lib/deps';

const rawBody = z.object({}).passthrough();

export const POST = route(
  async (context) => {
    const ergebnis = await resetPassword(tokenDeps, await context.body(rawBody));
    return ok(ergebnis);
  },
  {
    auth: 'none',
    rateLimit: { limit: 10, windowSeconds: 3600, scope: 'auth:passwort-neu' },
  },
);
