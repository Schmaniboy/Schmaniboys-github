import { CatalogSubject, Permission, optionAvailabilityInput } from '@ap/core';
import { assertExists, createOptionAvailability } from '@ap/db';

import { created, route } from '@/lib/api';

/**
 * Wo und wann eine Sonderausstattung zu haben war -- serienmaessig oder
 * gegen Aufpreis. Der Katalogeintrag selbst haengt am Hersteller, diese
 * Angabe an der Generation.
 */
export const POST = route(
  async (context) => {
    const input = await context.body(optionAvailabilityInput);
    await assertExists(CatalogSubject.OPTIONAL_EQUIPMENT, input.optionId, 'optionId');
    await assertExists(CatalogSubject.GENERATION, input.generationId, 'generationId');

    return created({
      availability: await createOptionAvailability({
        optionId: input.optionId,
        generationId: input.generationId,
        trimLineId: input.trimLineId,
        powertrainId: input.powertrainId,
        packageId: input.packageId,
        specialEditionId: input.specialEditionId,
        faceliftPhaseId: input.faceliftPhaseId,
        kind: input.kind,
        yearFrom: input.yearFrom,
        yearTo: input.yearTo,
        modelYearFrom: input.modelYearFrom,
        modelYearTo: input.modelYearTo,
        marketRegion: input.marketRegion,
        surchargeCents: input.surchargeCents,
        surchargeCurrency: input.surchargeCurrency,
        dataQuality: input.dataQuality,
        note: input.note,
      }),
    });
  },
  { permission: Permission.CATALOG_WRITE },
);
