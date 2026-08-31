import { z } from 'zod';

import { CatalogSubject, Permission, displayName, resolveSlug, slug } from '@ap/core';
import { assertExists, createEquipmentPackage } from '@ap/db';

import { created, route } from '@/lib/api';

const eingabe = z.object({
  generationId: z.string().min(1),
  name: displayName,
  slug: slug.optional(),
  packageCode: z.string().trim().min(1).max(40).optional(),
  description: z.string().trim().max(4000).optional(),
});

/**
 * Ausstattungspakete buendeln mehrere Sonderausstattungen. Sie haengen an der
 * Generation, weil sich Zuschnitt und Name zwischen Baureihen aendern.
 */
export const POST = route(
  async (context) => {
    const input = await context.body(eingabe);
    await assertExists(CatalogSubject.GENERATION, input.generationId, 'generationId');

    return created({
      package: await createEquipmentPackage({
        generationId: input.generationId,
        name: input.name,
        slug: resolveSlug(input),
        packageCode: input.packageCode,
        description: input.description,
      }),
    });
  },
  { permission: Permission.CATALOG_WRITE },
);
