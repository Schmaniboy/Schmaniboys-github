import { z } from 'zod';

import { Permission, manageUser } from '@ap/core';
import { searchUsers } from '@ap/db';

import { ok, route } from '@/lib/api';
import { adminUserDeps } from '@/lib/deps';

const suche = z.object({
  q: z.string().trim().max(200).optional(),
  rolle: z.string().trim().max(40).optional(),
  seite: z.coerce.number().int().min(0).max(1000).default(0),
});

const rawBody = z.object({}).passthrough();

export const GET = route(
  async (context) => {
    const filter = context.query(suche);
    return ok(
      await searchUsers({
        suche: filter.q || undefined,
        rolle: filter.rolle || undefined,
        seite: filter.seite,
      }),
    );
  },
  { permission: Permission.ADMIN_USERS },
);

export const PATCH = route(
  async (context) => {
    const ergebnis = await manageUser(
      adminUserDeps,
      context.principal,
      await context.body(rawBody),
    );
    return ok(ergebnis);
  },
  {
    permission: Permission.ADMIN_USERS,
    rateLimit: { limit: 120, windowSeconds: 3600, scope: 'admin:benutzer', perUser: true },
  },
);
