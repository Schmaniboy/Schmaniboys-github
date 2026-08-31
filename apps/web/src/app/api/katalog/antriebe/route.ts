import { CatalogSubject, Permission, powertrainInput } from '@ap/core';
import { assertExists, createPowertrain } from '@ap/db';

import { created, route } from '@/lib/api';

/**
 * Antriebskombination: Generation + Motor + Getriebe + Antriebsart.
 *
 * Hier landen die Fahrleistungen -- sie haengen an der Kombination, nicht am
 * Motor allein. Siehe Schema-Kommentar in packages/db/prisma/schema.prisma.
 */
export const POST = route(
  async (context) => {
    const input = await context.body(powertrainInput);
    await assertExists(CatalogSubject.GENERATION, input.generationId, 'generationId');
    await assertExists(CatalogSubject.ENGINE, input.engineId, 'engineId');

    return created({
      powertrain: await createPowertrain({
        generationId: input.generationId,
        engineId: input.engineId,
        transmissionId: input.transmissionId,
        driveType: input.driveType,
        measurementStandard: input.measurementStandard,
        yearFrom: input.yearFrom,
        yearTo: input.yearTo,
        powerKw: input.powerKw,
        torqueNm: input.torqueNm,
        acceleration0to100: input.acceleration0to100,
        topSpeedKmh: input.topSpeedKmh,
        consumptionCombined: input.consumptionCombined,
        consumptionUnit: input.consumptionUnit,
        co2CombinedGramPerKm: input.co2CombinedGramPerKm,
        kerbWeightKg: input.kerbWeightKg,
        batteryCapacityKwh: input.batteryCapacityKwh,
        fuelTankLitres: input.fuelTankLitres,
        electricRangeKm: input.electricRangeKm,
        emissionStandard: input.emissionStandard,
        seats: input.seats,
        doors: input.doors,
        payloadKg: input.payloadKg,
        towingCapacityBrakedKg: input.towingCapacityBrakedKg,
        towingCapacityUnbrakedKg: input.towingCapacityUnbrakedKg,
      }),
    });
  },
  { permission: Permission.CATALOG_WRITE },
);
