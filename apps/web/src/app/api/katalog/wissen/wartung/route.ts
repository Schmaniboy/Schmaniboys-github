import { CatalogSubject, Permission, maintenanceItemInput } from '@ap/core';
import { assertExists, createMaintenanceItem } from '@ap/db';

import { created, route } from '@/lib/api';

export const POST = route(
  async (context) => {
    const input = await context.body(maintenanceItemInput);
    await assertExists(CatalogSubject.GENERATION, input.generationId, 'generationId');

    return created({ item: await createMaintenanceItem(input) });
  },
  { permission: Permission.CATALOG_WRITE },
);
