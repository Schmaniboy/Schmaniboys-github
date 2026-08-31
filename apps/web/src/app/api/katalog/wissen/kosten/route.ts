import { CatalogSubject, Permission, costEstimateInput } from '@ap/core';
import { assertExists, createCostEstimate } from '@ap/db';

import { created, route } from '@/lib/api';

/**
 * Kostenangaben -- immer als Spanne, immer in Cent.
 * Ein Punktwert taeuscht eine Genauigkeit vor, die es bei Betriebskosten
 * nicht gibt.
 */
export const POST = route(
  async (context) => {
    const input = await context.body(costEstimateInput);
    await assertExists(CatalogSubject.GENERATION, input.generationId, 'generationId');

    return created({ estimate: await createCostEstimate(input) });
  },
  { permission: Permission.CATALOG_WRITE },
);
