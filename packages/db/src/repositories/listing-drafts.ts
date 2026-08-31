import {
  type CatalogForContext,
  type ListingDraftRecord,
  type ListingDraftRepository,
  errors,
  formatBuildPeriod,
  DRIVE_TYPE_LABELS,
  FUEL_LABELS,
  TRANSMISSION_LABELS,
} from '@ap/core';

import { type Prisma, prisma } from '../client';

/**
 * Verkaufsentwuerfe.
 *
 * Die VIN wird hier gespeichert, aber nirgends weitergereicht: Es gibt keine
 * Leseabfrage in dieser Datei, die sie in eine oeffentliche Antwort bringt.
 * Wer sie braucht, holt sie ausdruecklich ueber `findOwnDraftWithVin` -- und
 * diese Funktion verlangt die Kennung der besitzenden Person.
 */

const ENTWURF_FELDER = {
  id: true,
  ownerId: true,
  status: true,
  updatedAt: true,
  catalogConfirmedAt: true,
  generationId: true,
  powertrainId: true,
  mileageKm: true,
  firstRegistration: true,
  previousOwners: true,
  huValidUntil: true,
  serviceHistory: true,
  condition: true,
  tyreCondition: true,
  damages: true,
  hadAccident: true,
  accidentDetails: true,
  additionalNotes: true,
  generatedTitle: true,
  generatedShortText: true,
  generatedLongText: true,
  generatedClassifiedText: true,
  generatedAt: true,
  generationModel: true,
  valuationJson: true,
  valuedAt: true,
  valuationAssumptionsId: true,
} satisfies Prisma.ListingDraftSelect;

export class PrismaListingDraftRepository implements ListingDraftRepository {
  async findById(draftId: string): Promise<ListingDraftRecord | null> {
    return prisma.listingDraft.findUnique({ where: { id: draftId }, select: ENTWURF_FELDER });
  }

  /**
   * Baut den Katalogkontext aus den bestaetigten Zuordnungen.
   *
   * Gibt null zurueck, sobald eine der drei Pflichtebenen fehlt. Ein
   * halbfertiger Kontext waere schlimmer als keiner -- die KI wuerde die
   * Luecke fuellen.
   */
  async loadCatalogContext(draftId: string): Promise<CatalogForContext | null> {
    const entwurf = await prisma.listingDraft.findUnique({
      where: { id: draftId },
      select: {
        manufacturerId: true,
        modelId: true,
        generationId: true,
        powertrainId: true,
        trimLineId: true,
      },
    });

    if (!entwurf?.manufacturerId || !entwurf.modelId || !entwurf.generationId) return null;

    const [hersteller, modell, generation, antrieb, linie] = await Promise.all([
      prisma.manufacturer.findUnique({
        where: { id: entwurf.manufacturerId },
        select: { name: true },
      }),
      prisma.model.findUnique({ where: { id: entwurf.modelId }, select: { name: true } }),
      prisma.generation.findUnique({
        where: { id: entwurf.generationId },
        select: {
          name: true,
          code: true,
          yearFrom: true,
          yearTo: true,
          bodyType: { select: { name: true } },
        },
      }),
      entwurf.powertrainId
        ? prisma.powertrainCombination.findUnique({
            where: { id: entwurf.powertrainId },
            select: {
              driveType: true,
              powerKw: true,
              engine: {
                select: { name: true, code: true, fuelType: true, displacementCcm: true, powerKw: true },
              },
              transmission: { select: { type: true } },
            },
          })
        : Promise.resolve(null),
      entwurf.trimLineId
        ? prisma.trimLine.findUnique({ where: { id: entwurf.trimLineId }, select: { name: true } })
        : Promise.resolve(null),
    ]);

    if (!hersteller || !modell || !generation) return null;

    /*
     * Ausstattung: nur, was fuer diese Generation und -- sofern gesetzt --
     * diese Ausstattungslinie tatsaechlich erfasst ist. Nur die Namen, keine
     * Verfuegbarkeitsdetails: Der Text soll nennen, was das Fahrzeug hat,
     * nicht ueber Bestellmoeglichkeiten reden.
     */
    const ausstattung = entwurf.trimLineId
      ? await prisma.optionAvailability.findMany({
          where: {
            generationId: entwurf.generationId,
            trimLineId: entwurf.trimLineId,
            // Nur Serienausstattung: Was gegen Aufpreis zu haben war, hat
            // dieses Fahrzeug nicht zwingend -- es in einen Anzeigentext zu
            // schreiben waere eine unbelegte Zusage an Kaeufer.
            kind: 'STANDARD',
            option: { status: 'PUBLISHED' },
          },
          select: { option: { select: { name: true } } },
        })
      : [];

    return {
      manufacturerName: hersteller.name,
      modelName: modell.name,
      generationName: generation.name,
      generationCode: generation.code,
      bodyTypeName: generation.bodyType?.name ?? null,
      trimLineName: linie?.name ?? null,
      engineName: antrieb?.engine.name ?? null,
      engineCode: antrieb?.engine.code ?? null,
      fuelTypeLabel: antrieb ? (FUEL_LABELS[antrieb.engine.fuelType] ?? null) : null,
      transmissionLabel: antrieb
        ? (TRANSMISSION_LABELS[antrieb.transmission.type] ?? null)
        : null,
      driveTypeLabel: antrieb ? (DRIVE_TYPE_LABELS[antrieb.driveType] ?? null) : null,
      powerKw: antrieb?.powerKw ?? antrieb?.engine.powerKw ?? null,
      displacementCcm: antrieb?.engine.displacementCcm ?? null,
      buildPeriod: formatBuildPeriod(generation.yearFrom, generation.yearTo),
      equipmentNames: ausstattung.map((eintrag) => eintrag.option.name),
    };
  }

  async saveValuation(
    draftId: string,
    valuation: unknown,
    assumptionsId: string,
    valuedAt: Date,
  ): Promise<void> {
    await prisma.listingDraft.update({
      where: { id: draftId },
      data: {
        valuationJson: valuation as Prisma.InputJsonValue,
        valuationAssumptionsId: assumptionsId,
        valuedAt,
      },
    });
  }

  async saveGeneratedTexts(
    draftId: string,
    texts: {
      title: string;
      shortText: string;
      longText: string;
      classifiedText: string;
      model: string;
    },
    generatedAt: Date,
  ): Promise<void> {
    await prisma.listingDraft.update({
      where: { id: draftId },
      data: {
        generatedTitle: texts.title,
        generatedShortText: texts.shortText,
        generatedLongText: texts.longText,
        generatedClassifiedText: texts.classifiedText,
        generationModel: texts.model,
        generatedAt,
        status: 'TEXT_GENERATED',
      },
    });
  }
}

export const listingDraftRepository = new PrismaListingDraftRepository();

/* ------------------------------------------------------------------------ */

/**
 * `vinHash` darf null sein: Ohne gesetztes Hash-Geheimnis gibt es keinen
 * Hash. Ein Ersatzwert waere hier schaedlich -- alle Entwuerfe haetten
 * denselben, und die spaetere Duplikaterkennung meldete lauter Treffer.
 */
export async function createListingDraft(input: {
  ownerId: string;
  vin: string;
  vinHash: string | null;
}) {
  return prisma.listingDraft.create({
    data: {
      ownerId: input.ownerId,
      vin: input.vin,
      vinHash: input.vinHash,
      status: 'VIN_ENTERED',
    },
    select: { id: true, status: true, createdAt: true },
  });
}

/**
 * Hersteller, deren Herstellerkennung zur VIN passt.
 *
 * Das ist der einzige Teil der Fahrzeugbestimmung, der sich aus der VIN
 * belegen laesst. Alles Weitere waehlt die verkaufende Person aus dem
 * Katalog -- aus tatsaechlich vorhandenen Eintraegen, nicht aus Vorschlaegen
 * eines Ratealgorithmus.
 */
export async function findManufacturersByWmi(wmi: string) {
  return prisma.manufacturer.findMany({
    where: { status: 'PUBLISHED', wmiCodes: { has: wmi.toUpperCase() } },
    orderBy: { name: 'asc' },
    select: { id: true, name: true, slug: true },
  });
}

export async function findOwnDraft(draftId: string, ownerId: string) {
  return prisma.listingDraft.findFirst({
    where: { id: draftId, ownerId },
    select: {
      ...ENTWURF_FELDER,
      vin: true,
      manufacturerId: true,
      modelId: true,
      trimLineId: true,
      createdAt: true,
    },
  });
}

export async function listOwnDrafts(ownerId: string) {
  return prisma.listingDraft.findMany({
    where: { ownerId, status: { not: 'ABANDONED' } },
    orderBy: { updatedAt: 'desc' },
    take: 50,
    select: {
      id: true,
      status: true,
      generatedTitle: true,
      updatedAt: true,
      createdAt: true,
    },
  });
}

/**
 * Bestaetigt die Fahrzeugzuordnung.
 *
 * Prueft die Kette: Das Modell muss zum Hersteller gehoeren, die Generation
 * zum Modell, die Antriebskombination zur Generation. Ohne diese Pruefung
 * liesse sich ein Fahrzeug zusammensetzen, das es nie gab -- und der Text
 * darueber saehe genauso echt aus wie jeder andere.
 */
export async function confirmVehicle(
  draftId: string,
  ownerId: string,
  auswahl: {
    manufacturerId: string;
    modelId: string;
    generationId: string;
    powertrainId?: string | null | undefined;
    trimLineId?: string | null | undefined;
  },
  confirmedAt: Date,
) {
  const modell = await prisma.model.findFirst({
    where: {
      id: auswahl.modelId,
      manufacturerId: auswahl.manufacturerId,
      status: 'PUBLISHED',
    },
    select: { id: true },
  });
  if (!modell) {
    throw errors.validation({ modelId: ['Dieses Modell gehört nicht zu diesem Hersteller.'] });
  }

  const generation = await prisma.generation.findFirst({
    where: { id: auswahl.generationId, modelId: auswahl.modelId, status: 'PUBLISHED' },
    select: { id: true },
  });
  if (!generation) {
    throw errors.validation({
      generationId: ['Diese Generation gehört nicht zu diesem Modell.'],
    });
  }

  if (auswahl.powertrainId) {
    const antrieb = await prisma.powertrainCombination.findFirst({
      where: {
        id: auswahl.powertrainId,
        generationId: auswahl.generationId,
        status: 'PUBLISHED',
      },
      select: { id: true },
    });
    if (!antrieb) {
      throw errors.validation({
        powertrainId: ['Diese Motorvariante gehört nicht zu dieser Generation.'],
      });
    }
  }

  if (auswahl.trimLineId) {
    const linie = await prisma.trimLine.findFirst({
      where: { id: auswahl.trimLineId, generationId: auswahl.generationId, status: 'PUBLISHED' },
      select: { id: true },
    });
    if (!linie) {
      throw errors.validation({
        trimLineId: ['Diese Ausstattungslinie gehört nicht zu dieser Generation.'],
      });
    }
  }

  const aktualisiert = await prisma.listingDraft.updateMany({
    where: { id: draftId, ownerId },
    data: {
      manufacturerId: auswahl.manufacturerId,
      modelId: auswahl.modelId,
      generationId: auswahl.generationId,
      powertrainId: auswahl.powertrainId ?? null,
      trimLineId: auswahl.trimLineId ?? null,
      catalogConfirmedAt: confirmedAt,
      status: 'VEHICLE_CONFIRMED',
    },
  });

  if (aktualisiert.count === 0) throw errors.notFound();
}

export async function updateDraftDetails(
  draftId: string,
  ownerId: string,
  angaben: {
    mileageKm?: number | undefined;
    firstRegistration?: Date | undefined;
    previousOwners?: number | undefined;
    huValidUntil?: Date | null | undefined;
    serviceHistory?: Prisma.ListingDraftUpdateInput['serviceHistory'];
    condition?: Prisma.ListingDraftUpdateInput['condition'];
    tyreCondition?: string | undefined;
    damages?: string | undefined;
    hadAccident?: boolean | undefined;
    accidentDetails?: string | undefined;
    additionalNotes?: string | undefined;
  },
) {
  const aktualisiert = await prisma.listingDraft.updateMany({
    where: { id: draftId, ownerId },
    data: { ...angaben, status: 'DETAILS_PROVIDED' },
  });

  if (aktualisiert.count === 0) throw errors.notFound();
}
