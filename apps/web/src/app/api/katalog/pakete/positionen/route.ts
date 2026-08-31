import { z } from 'zod';

import { CatalogSubject, Permission } from '@ap/core';
import { addPackageItem, assertExists } from '@ap/db';

import { created, route } from '@/lib/api';

const eingabe = z.object({
  packageId: z.string().min(1),
  optionId: z.string().min(1),
  /** Manche Pakete enthalten Teile nur wahlweise. */
  optional: z.boolean().default(false),
});

export const POST = route(
  async (context) => {
    const input = await context.body(eingabe);
    await assertExists(CatalogSubject.EQUIPMENT_PACKAGE, input.packageId, 'packageId');
    await assertExists(CatalogSubject.OPTIONAL_EQUIPMENT, input.optionId, 'optionId');

    return created({ item: await addPackageItem(input) });
  },
  { permission: Permission.CATALOG_WRITE },
);
