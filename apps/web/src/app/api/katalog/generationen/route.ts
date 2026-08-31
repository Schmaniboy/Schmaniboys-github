import { CatalogSubject, Permission, generationInput, resolveSlug } from '@ap/core';
import { assertExists, createGeneration } from '@ap/db';

import { created, route } from '@/lib/api';

export const POST = route(
  async (context) => {
    const input = await context.body(generationInput);
    await assertExists(CatalogSubject.MODEL, input.modelId, 'modelId');

    return created({
      generation: await createGeneration({
        modelId: input.modelId,
        name: input.name,
        slug: resolveSlug(input),
        code: input.code,
        bodyTypeId: input.bodyTypeId,
        yearFrom: input.yearFrom,
        yearTo: input.yearTo,
      }),
    });
  },
  { permission: Permission.CATALOG_WRITE },
);
