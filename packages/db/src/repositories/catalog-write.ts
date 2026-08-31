import { type Prisma, prisma } from '../client';
import {
  type AvailabilityKind,
  type DataQuality,
  assertVerfuegbarkeitStimmig,
  errors,
} from '@ap/core';

/**
 * Schreibzugriffe auf die Stammdaten.
 *
 * Diese Schicht entscheidet nichts. Rechte sind vorher geprueft, Eingaben
 * vorher validiert. Was sie beitraegt: Verletzungen der Eindeutigkeit werden
 * in verstaendliche Fehler uebersetzt, statt als 500 durchzuschlagen.
 *
 * Alle Eintraege entstehen als DRAFT. Es gibt keinen Weg, etwas direkt
 * veroeffentlicht anzulegen -- der Redaktionsablauf laesst sich nicht umgehen.
 */

/** P2002: Eindeutigkeit verletzt. P2003: Fremdschluessel zeigt ins Leere. */
function pruefe<T>(vorgang: Promise<T>, meldungen: { doppelt: string }): Promise<T> {
  return vorgang.catch((error: unknown) => {
    const code = (error as { code?: string }).code;
    if (code === 'P2002') throw errors.conflict(meldungen.doppelt);
    if (code === 'P2003') {
      throw errors.validation({ _: ['Ein verknuepfter Eintrag existiert nicht.'] });
    }
    throw error;
  });
}

export function createManufacturer(data: {
  name: string;
  slug: string;
  country?: string | undefined;
  wmiCodes: string[];
}) {
  return pruefe(
    prisma.manufacturer.create({
      data: {
        name: data.name,
        slug: data.slug,
        country: data.country ?? null,
        wmiCodes: data.wmiCodes,
      },
    }),
    { doppelt: 'Diesen Hersteller gibt es bereits.' },
  );
}

export function createModel(data: { manufacturerId: string; name: string; slug: string }) {
  return pruefe(prisma.model.create({ data }), {
    doppelt: 'Dieses Modell gibt es bei diesem Hersteller bereits.',
  });
}

export function createGeneration(data: {
  modelId: string;
  name: string;
  slug: string;
  code?: string | undefined;
  bodyTypeId?: string | undefined;
  yearFrom: number;
  yearTo?: number | null | undefined;
}) {
  return pruefe(
    prisma.generation.create({
      data: {
        modelId: data.modelId,
        name: data.name,
        slug: data.slug,
        code: data.code ?? null,
        bodyTypeId: data.bodyTypeId ?? null,
        yearFrom: data.yearFrom,
        yearTo: data.yearTo ?? null,
      },
    }),
    { doppelt: 'Diese Generation gibt es bei diesem Modell bereits.' },
  );
}

export function createFaceliftPhase(data: {
  generationId: string;
  name: string;
  slug: string;
  yearFrom: number;
  yearTo?: number | null | undefined;
  distinguishingFeatures?: string | undefined;
}) {
  return pruefe(
    prisma.faceliftPhase.create({
      data: {
        generationId: data.generationId,
        name: data.name,
        slug: data.slug,
        yearFrom: data.yearFrom,
        yearTo: data.yearTo ?? null,
        distinguishingFeatures: data.distinguishingFeatures ?? null,
      },
    }),
    { doppelt: 'Diese Facelift-Phase gibt es in dieser Generation bereits.' },
  );
}

export function createEngine(data: {
  manufacturerId: string;
  name: string;
  code?: string | undefined;
  displacementCcm?: number | undefined;
  cylinders?: number | undefined;
  fuelType: Prisma.EngineCreateInput['fuelType'];
  aspiration: Prisma.EngineCreateInput['aspiration'];
  powerKw?: number | undefined;
  torqueNm?: number | undefined;
}) {
  return pruefe(
    prisma.engine.create({
      data: {
        manufacturerId: data.manufacturerId,
        name: data.name,
        code: data.code ?? null,
        displacementCcm: data.displacementCcm ?? null,
        cylinders: data.cylinders ?? null,
        fuelType: data.fuelType,
        aspiration: data.aspiration,
        powerKw: data.powerKw ?? null,
        torqueNm: data.torqueNm ?? null,
      },
    }),
    { doppelt: 'Diesen Motorcode gibt es bei diesem Hersteller bereits.' },
  );
}

export function createTransmission(data: {
  name: string;
  type: Prisma.TransmissionCreateInput['type'];
  gears?: number | undefined;
}) {
  return pruefe(
    prisma.transmission.create({
      data: { name: data.name, type: data.type, gears: data.gears ?? null },
    }),
    { doppelt: 'Dieses Getriebe ist bereits erfasst.' },
  );
}

export function createPowertrain(data: {
  generationId: string;
  engineId: string;
  transmissionId: string;
  driveType: Prisma.PowertrainCombinationCreateInput['driveType'];
  measurementStandard: Prisma.PowertrainCombinationCreateInput['measurementStandard'];
  yearFrom?: number | undefined;
  yearTo?: number | null | undefined;
  powerKw?: number | undefined;
  torqueNm?: number | undefined;
  acceleration0to100?: number | undefined;
  topSpeedKmh?: number | undefined;
  consumptionCombined?: number | undefined;
  consumptionUnit?: string | undefined;
  co2CombinedGramPerKm?: number | undefined;
  kerbWeightKg?: number | undefined;
  batteryCapacityKwh?: number | undefined;
  fuelTankLitres?: number | undefined;
  electricRangeKm?: number | undefined;
  emissionStandard?: string | undefined;
  seats?: number | undefined;
  doors?: number | undefined;
  payloadKg?: number | undefined;
  towingCapacityBrakedKg?: number | undefined;
  towingCapacityUnbrakedKg?: number | undefined;
}) {
  return pruefe(
    prisma.powertrainCombination.create({
      data: {
        generationId: data.generationId,
        engineId: data.engineId,
        transmissionId: data.transmissionId,
        driveType: data.driveType,
        measurementStandard: data.measurementStandard,
        yearFrom: data.yearFrom ?? null,
        yearTo: data.yearTo ?? null,
        powerKw: data.powerKw ?? null,
        torqueNm: data.torqueNm ?? null,
        acceleration0to100: data.acceleration0to100 ?? null,
        topSpeedKmh: data.topSpeedKmh ?? null,
        consumptionCombined: data.consumptionCombined ?? null,
        consumptionUnit: data.consumptionUnit ?? null,
        co2CombinedGramPerKm: data.co2CombinedGramPerKm ?? null,
        kerbWeightKg: data.kerbWeightKg ?? null,
        batteryCapacityKwh: data.batteryCapacityKwh ?? null,
        fuelTankLitres: data.fuelTankLitres ?? null,
        electricRangeKm: data.electricRangeKm ?? null,
        emissionStandard: data.emissionStandard ?? null,
        seats: data.seats ?? null,
        doors: data.doors ?? null,
        payloadKg: data.payloadKg ?? null,
        towingCapacityBrakedKg: data.towingCapacityBrakedKg ?? null,
        towingCapacityUnbrakedKg: data.towingCapacityUnbrakedKg ?? null,
      },
    }),
    {
      doppelt:
        'Diese Antriebskombination ist fuer diese Generation bereits erfasst.',
    },
  );
}

export function createTrimLine(data: {
  generationId: string;
  name: string;
  slug: string;
  description?: string | undefined;
  yearFrom?: number | undefined;
  yearTo?: number | null | undefined;
}) {
  return pruefe(
    prisma.trimLine.create({
      data: {
        generationId: data.generationId,
        name: data.name,
        slug: data.slug,
        description: data.description ?? null,
        yearFrom: data.yearFrom ?? null,
        yearTo: data.yearTo ?? null,
      },
    }),
    { doppelt: 'Diese Ausstattungslinie gibt es in dieser Generation bereits.' },
  );
}

export function createOptionalEquipment(data: {
  manufacturerId: string;
  name: string;
  slug: string;
  optionCode?: string | undefined;
  category?: string | undefined;
  description?: string | undefined;
  howToIdentify?: string | undefined;
  rarity?: Prisma.OptionalEquipmentCreateInput['rarity'];
  purchaseRelevance?: Prisma.OptionalEquipmentCreateInput['purchaseRelevance'];
  resaleRelevance?: Prisma.OptionalEquipmentCreateInput['resaleRelevance'];
  relevanceEvidenceType?: Prisma.OptionalEquipmentCreateInput['relevanceEvidenceType'];
  relevanceConfidence: Prisma.OptionalEquipmentCreateInput['relevanceConfidence'];
  relevanceReasoning?: string | undefined;
  relevanceDataBasis?: string | undefined;
  relevanceObservedAt?: Date | undefined;
  relevanceSampleSize?: number | undefined;
}) {
  return pruefe(
    prisma.optionalEquipment.create({
      data: {
        manufacturerId: data.manufacturerId,
        name: data.name,
        slug: data.slug,
        optionCode: data.optionCode ?? null,
        category: data.category ?? null,
        description: data.description ?? null,
        howToIdentify: data.howToIdentify ?? null,
        rarity: data.rarity ?? null,
        purchaseRelevance: data.purchaseRelevance ?? null,
        resaleRelevance: data.resaleRelevance ?? null,
        relevanceEvidenceType: data.relevanceEvidenceType ?? null,
        relevanceConfidence: data.relevanceConfidence,
        relevanceReasoning: data.relevanceReasoning ?? null,
        relevanceDataBasis: data.relevanceDataBasis ?? null,
        relevanceObservedAt: data.relevanceObservedAt ?? null,
        relevanceSampleSize: data.relevanceSampleSize ?? null,
      },
    }),
    { doppelt: 'Diese Sonderausstattung gibt es bei diesem Hersteller bereits.' },
  );
}

/**
 * Verhindert doppelte Verfuegbarkeitsangaben.
 *
 * Die Eindeutigkeitsbedingung in der Datenbank greift hier nur teilweise:
 * PostgreSQL behandelt NULL-Werte als voneinander verschieden. Zwei Zeilen
 * mit derselben Option, derselben Generation und ueberall sonst NULL
 * verletzen sie also nicht. Diese Pruefung schliesst die Luecke.
 *
 * Sie ist kein Ersatz fuer die Bedingung in der Datenbank, sondern ihre
 * Ergaenzung: Zwischen Pruefung und Einfuegen kann theoretisch eine zweite
 * Anfrage dazwischenkommen. Fuer redaktionelle Stammdaten mit wenigen
 * Bearbeitenden ist dieses Restrisiko vertretbar; die Bedingung faengt alle
 * Faelle ab, in denen tatsaechlich Werte gesetzt sind.
 */
async function assertKeineDoppelteVerfuegbarkeit(data: {
  optionId: string;
  generationId: string;
  trimLineId?: string | null | undefined;
  powertrainId?: string | null | undefined;
}): Promise<void> {
  const vorhanden = await prisma.optionAvailability.findFirst({
    where: {
      optionId: data.optionId,
      generationId: data.generationId,
      trimLineId: data.trimLineId ?? null,
      powertrainId: data.powertrainId ?? null,
    },
    select: { id: true },
  });
  if (vorhanden) {
    throw errors.conflict('Diese Verfuegbarkeit ist fuer diese Kombination bereits erfasst.');
  }
}

export async function createOptionAvailability(data: {
  optionId: string;
  generationId: string;
  trimLineId?: string | null | undefined;
  powertrainId?: string | null | undefined;
  packageId?: string | null | undefined;
  specialEditionId?: string | null | undefined;
  faceliftPhaseId?: string | null | undefined;
  kind: AvailabilityKind;
  yearFrom?: number | undefined;
  yearTo?: number | null | undefined;
  modelYearFrom?: number | undefined;
  modelYearTo?: number | null | undefined;
  marketRegion?: string | undefined;
  surchargeCents?: number | undefined;
  surchargeCurrency?: string | undefined;
  dataQuality?: DataQuality | undefined;
  note?: string | undefined;
}) {
  /*
   * Erst die fachliche Stimmigkeit, dann die Doppelung. Umgekehrt bekaeme
   * jemand, der eine widerspruechliche Zeile zweimal eintraegt, beim zweiten
   * Mal die falsche Fehlermeldung.
   */
  assertVerfuegbarkeitStimmig({
    kind: data.kind,
    packageId: data.packageId ?? null,
    specialEditionId: data.specialEditionId ?? null,
    marketRegion: data.marketRegion ?? null,
    surchargeCents: data.surchargeCents ?? null,
  });
  await assertKeineDoppelteVerfuegbarkeit(data);

  return pruefe(
    prisma.optionAvailability.create({
      data: {
        optionId: data.optionId,
        generationId: data.generationId,
        trimLineId: data.trimLineId ?? null,
        powertrainId: data.powertrainId ?? null,
        packageId: data.packageId ?? null,
        specialEditionId: data.specialEditionId ?? null,
        faceliftPhaseId: data.faceliftPhaseId ?? null,
        kind: data.kind,
        yearFrom: data.yearFrom ?? null,
        yearTo: data.yearTo ?? null,
        modelYearFrom: data.modelYearFrom ?? null,
        modelYearTo: data.modelYearTo ?? null,
        marketRegion: data.marketRegion ?? null,
        surchargeCents: data.surchargeCents ?? null,
        surchargeCurrency: data.surchargeCurrency ?? null,
        dataQuality: data.dataQuality ?? 'UNVERIFIED',
        note: data.note ?? null,
      },
    }),
    { doppelt: 'Diese Verfuegbarkeit ist bereits erfasst.' },
  );
}

export function createEquipmentPackage(data: {
  generationId: string;
  name: string;
  slug: string;
  packageCode?: string | undefined;
  description?: string | undefined;
}) {
  return pruefe(
    prisma.equipmentPackage.create({
      data: {
        generationId: data.generationId,
        name: data.name,
        slug: data.slug,
        packageCode: data.packageCode ?? null,
        description: data.description ?? null,
      },
    }),
    { doppelt: 'Dieses Paket gibt es in dieser Generation bereits.' },
  );
}

export function addPackageItem(data: {
  packageId: string;
  optionId: string;
  optional: boolean;
}) {
  return pruefe(prisma.equipmentPackageItem.create({ data }), {
    doppelt: 'Diese Ausstattung ist in dem Paket bereits enthalten.',
  });
}

export function upsertBodyType(data: { name: string; slug: string }) {
  return prisma.bodyType.upsert({
    where: { slug: data.slug },
    update: {},
    create: data,
  });
}
