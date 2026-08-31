import { z } from 'zod';

import { login } from '@ap/core';

import { ok, route } from '@/lib/api';
import { authDeps } from '@/lib/deps';
import { setSessionCookie } from '@/lib/session';

const rawBody = z.object({}).passthrough();

export const POST = route(
  async (context) => {
    const result = await login(authDeps, await context.body(rawBody), {
      ipHash: context.ipHash,
      userAgentDigest: context.userAgentDigest,
    });

    await setSessionCookie(result.token, result.expiresAt);
    return ok({ user: result.user });
  },
  {
    auth: 'none',
    /*
     * Zweite Verteidigungslinie neben der kontobezogenen Sperre: Diese greift
     * pro IP-Adresse und bremst damit auch das Durchprobieren vieler
     * verschiedener Konten.
     */
    rateLimit: { limit: 10, windowSeconds: 300, scope: 'auth:login' },
  },
);
