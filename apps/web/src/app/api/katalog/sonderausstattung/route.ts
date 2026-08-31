import { CatalogSubject, Permission, optionalEquipmentInput, resolveSlug } from '@ap/core';
import { assertExists, createOptionalEquipment } from '@ap/db';

import { created, route } from '@/lib/api';

export const POST = route(
  async (context) => {
    const input = await context.body(optionalEquipmentInput);
    await assertExists(CatalogSubject.MANUFACTURER, input.manufacturerId, 'manufacturerId');

    return created({
      option: await createOptionalEquipment({
        manufacturerId: input.manufacturerId,
        name: input.name,
        slug: resolveSlug(input),
        optionCode: input.optionCode,
        category: input.category,
        description: input.description,
        howToIdentify: input.howToIdentify,
        rarity: input.rarity,
        purchaseRelevance: input.purchaseRelevance,
        resaleRelevance: input.resaleRelevance,
        relevanceEvidenceType: input.relevanceEvidenceType,
        relevanceConfidence: input.relevanceConfidence,
        relevanceReasoning: input.relevanceReasoning,
        relevanceDataBasis: input.relevanceDataBasis,
        relevanceObservedAt: input.relevanceObservedAt,
        relevanceSampleSize: input.relevanceSampleSize,
      }),
    });
  },
  { permission: Permission.CATALOG_WRITE },
);
