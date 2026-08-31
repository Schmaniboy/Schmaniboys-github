import { CatalogSubject, Permission, modelInput, resolveSlug } from '@ap/core';
import { assertExists, createModel } from '@ap/db';

import { created, route } from '@/lib/api';

export const POST = route(
  async (context) => {
    const input = await context.body(modelInput);
    await assertExists(CatalogSubject.MANUFACTURER, input.manufacturerId, 'manufacturerId');

    return created({
      model: await createModel({
        manufacturerId: input.manufacturerId,
        name: input.name,
        slug: resolveSlug(input),
      }),
    });
  },
  { permission: Permission.CATALOG_WRITE },
);
