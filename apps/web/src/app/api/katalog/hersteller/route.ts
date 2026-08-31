import { Permission, manufacturerInput, resolveSlug } from '@ap/core';
import { createManufacturer, listPublishedManufacturers } from '@ap/db';

import { created, ok, route } from '@/lib/api';

/**
 * Hersteller.
 *
 * GET ist oeffentlich und liefert ausschliesslich veroeffentlichte Eintraege --
 * der Filter sitzt in der Abfrage, nicht hier.
 * POST verlangt das Recht, Stammdaten zu erfassen.
 */

export const GET = route(
  async () => ok({ manufacturers: await listPublishedManufacturers() }),
  { auth: 'none', rateLimit: { limit: 120, windowSeconds: 60, scope: 'katalog:lesen' } },
);

export const POST = route(
  async (context) => {
    const input = await context.body(manufacturerInput);
    const hersteller = await createManufacturer({
      name: input.name,
      slug: resolveSlug(input),
      country: input.country,
      wmiCodes: input.wmiCodes,
    });
    // Entsteht als Entwurf. Der Weg zur Veroeffentlichung fuehrt ueber
    // /api/katalog/eintraege/manufacturer/<id>/status.
    return created({ manufacturer: hersteller });
  },
  { permission: Permission.CATALOG_WRITE },
);
