import { Permission, transmissionInput } from '@ap/core';
import { createTransmission } from '@ap/db';

import { created, route } from '@/lib/api';

export const POST = route(
  async (context) => {
    const input = await context.body(transmissionInput);
    return created({
      transmission: await createTransmission({
        name: input.name,
        type: input.type,
        gears: input.gears,
      }),
    });
  },
  { permission: Permission.CATALOG_WRITE },
);
