import { CatalogSubject, Permission, resolveSlug, trimLineInput } from '@ap/core';
import { assertExists, createTrimLine } from '@ap/db';

import { created, route } from '@/lib/api';

export const POST = route(
  async (context) => {
    const input = await context.body(trimLineInput);
    await assertExists(CatalogSubject.GENERATION, input.generationId, 'generationId');

    return created({
      trimLine: await createTrimLine({
        generationId: input.generationId,
        name: input.name,
        slug: resolveSlug(input),
        description: input.description,
        yearFrom: input.yearFrom,
        yearTo: input.yearTo,
      }),
    });
  },
  { permission: Permission.CATALOG_WRITE },
);
