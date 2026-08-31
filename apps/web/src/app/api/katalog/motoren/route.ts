import { CatalogSubject, Permission, engineInput } from '@ap/core';
import { assertExists, createEngine } from '@ap/db';

import { created, route } from '@/lib/api';

export const POST = route(
  async (context) => {
    const input = await context.body(engineInput);
    await assertExists(CatalogSubject.MANUFACTURER, input.manufacturerId, 'manufacturerId');

    return created({
      engine: await createEngine({
        manufacturerId: input.manufacturerId,
        name: input.name,
        code: input.code,
        displacementCcm: input.displacementCcm,
        cylinders: input.cylinders,
        fuelType: input.fuelType,
        aspiration: input.aspiration,
        powerKw: input.powerKw,
        torqueNm: input.torqueNm,
      }),
    });
  },
  { permission: Permission.CATALOG_WRITE },
);
