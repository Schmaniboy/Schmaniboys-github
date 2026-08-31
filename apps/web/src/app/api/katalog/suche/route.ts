import { z } from 'zod';

import { searchPublishedCatalog } from '@ap/db';

import { ok, route } from '@/lib/api';

/**
 * Einfache Katalogsuche ueber veroeffentlichte Hersteller und Modelle.
 * Die richtige Suche mit Filtern entsteht in Phase 4 -- dies hier macht den
 * vorhandenen Bestand auffindbar, mehr nicht.
 */
export const GET = route(
  async (context) => {
    const { q } = context.query(z.object({ q: z.string().trim().max(120).default('') }));
    return ok(await searchPublishedCatalog(q));
  },
  { auth: 'none', rateLimit: { limit: 60, windowSeconds: 60, scope: 'katalog:suche' } },
);
