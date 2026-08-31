import { errors } from '@ap/core';

import { prisma } from '../client';

/**
 * "Mein Fahrzeug".
 *
 * Nicht dasselbe wie eine Anzeige: Ein Fahrzeug hier steht nicht zum
 * Verkauf. Es dient dem Abgleich mit dem Katalog -- welche Ausstattung ist
 * drin, was war Serie, was war selten.
 *
 * Zugriffsschutz wie ueberall: Ein fremdes Fahrzeug ergibt "nicht
 * gefunden", nicht "verboten". Ein Verbot bestaetigte, dass es das Fahrzeug
 * gibt, und liesse sich durch Kennungen blaettern.
 */

/** Mehr als das braucht niemand -- und es begrenzt den Schaden bei Missbrauch. */
export const MAX_FAHRZEUGE_JE_PERSON = 20;

const AUSWAHL = {
  id: true,
  label: true,
  vin: true,
  vinConfirmedByOwner: true,
  modelYear: true,
  firstRegistrationOn: true,
  mileageKm: true,
  note: true,
  createdAt: true,
  updatedAt: true,
  generation: {
    select: {
      id: true,
      name: true,
      slug: true,
      code: true,
      yearFrom: true,
      yearTo: true,
      model: {
        select: { name: true, slug: true, manufacturer: { select: { name: true, slug: true } } },
      },
    },
  },
  faceliftPhase: { select: { id: true, name: true, slug: true } },
  powertrain: {
    select: {
      id: true,
      powerKw: true,
      driveType: true,
      engine: { select: { name: true, code: true, fuelType: true, displacementCcm: true } },
      transmission: { select: { name: true, gears: true } },
    },
  },
  paintColor: { select: { id: true, name: true, code: true, approximateHex: true } },
  equipment: {
    select: {
      id: true,
      confirmed: true,
      note: true,
      option: { select: { id: true, name: true, optionCode: true, area: true, rarity: true } },
    },
    orderBy: { option: { name: 'asc' } },
  },
} as const;

export async function listUserVehicles(userId: string) {
  return prisma.userVehicle.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: MAX_FAHRZEUGE_JE_PERSON,
    select: AUSWAHL,
  });
}

export async function getUserVehicle(userId: string, id: string) {
  const fahrzeug = await prisma.userVehicle.findFirst({
    where: { id, userId },
    select: AUSWAHL,
  });
  if (!fahrzeug) throw errors.notFound();
  return fahrzeug;
}

export interface UserVehicleInput {
  label: string;
  generationId?: string | null | undefined;
  faceliftPhaseId?: string | null | undefined;
  powertrainId?: string | null | undefined;
  paintColorId?: string | null | undefined;
  vin?: string | null | undefined;
  vinConfirmedByOwner?: boolean | undefined;
  modelYear?: number | null | undefined;
  firstRegistrationOn?: Date | null | undefined;
  mileageKm?: number | null | undefined;
  note?: string | null | undefined;
}

export async function createUserVehicle(userId: string, eingabe: UserVehicleInput) {
  const anzahl = await prisma.userVehicle.count({ where: { userId } });
  if (anzahl >= MAX_FAHRZEUGE_JE_PERSON) {
    throw errors.conflict(
      `Mehr als ${MAX_FAHRZEUGE_JE_PERSON} Fahrzeuge lassen sich nicht speichern. ` +
        'Bitte löschen Sie eines, das Sie nicht mehr brauchen.',
    );
  }

  /*
   * Die Antriebskombination muss zur Generation gehoeren. Ohne diese
   * Pruefung liesse sich ueber die Schnittstelle ein Fahrzeug speichern,
   * dessen Motor es in dieser Baureihe nie gab -- und alle spaeteren
   * Auskuenfte dazu waeren falsch.
   */
  await assertStimmigeAuswahl(eingabe);

  return prisma.userVehicle.create({
    data: {
      userId,
      label: eingabe.label,
      generationId: eingabe.generationId ?? null,
      faceliftPhaseId: eingabe.faceliftPhaseId ?? null,
      powertrainId: eingabe.powertrainId ?? null,
      paintColorId: eingabe.paintColorId ?? null,
      vin: eingabe.vin ?? null,
      vinConfirmedByOwner: eingabe.vinConfirmedByOwner ?? false,
      modelYear: eingabe.modelYear ?? null,
      firstRegistrationOn: eingabe.firstRegistrationOn ?? null,
      mileageKm: eingabe.mileageKm ?? null,
      note: eingabe.note ?? null,
    },
    select: AUSWAHL,
  });
}

export async function updateUserVehicle(
  userId: string,
  id: string,
  eingabe: Partial<UserVehicleInput>,
) {
  // Erst pruefen, ob es dem Aufrufer gehoert -- sonst verriete schon der
  // Fehlerfall, dass die Kennung existiert.
  await getUserVehicle(userId, id);
  await assertStimmigeAuswahl(eingabe);

  return prisma.userVehicle.update({
    where: { id },
    data: {
      ...(eingabe.label !== undefined ? { label: eingabe.label } : {}),
      ...(eingabe.generationId !== undefined ? { generationId: eingabe.generationId } : {}),
      ...(eingabe.faceliftPhaseId !== undefined
        ? { faceliftPhaseId: eingabe.faceliftPhaseId }
        : {}),
      ...(eingabe.powertrainId !== undefined ? { powertrainId: eingabe.powertrainId } : {}),
      ...(eingabe.paintColorId !== undefined ? { paintColorId: eingabe.paintColorId } : {}),
      ...(eingabe.vin !== undefined ? { vin: eingabe.vin } : {}),
      ...(eingabe.vinConfirmedByOwner !== undefined
        ? { vinConfirmedByOwner: eingabe.vinConfirmedByOwner }
        : {}),
      ...(eingabe.modelYear !== undefined ? { modelYear: eingabe.modelYear } : {}),
      ...(eingabe.firstRegistrationOn !== undefined
        ? { firstRegistrationOn: eingabe.firstRegistrationOn }
        : {}),
      ...(eingabe.mileageKm !== undefined ? { mileageKm: eingabe.mileageKm } : {}),
      ...(eingabe.note !== undefined ? { note: eingabe.note } : {}),
    },
    select: AUSWAHL,
  });
}

export async function deleteUserVehicle(userId: string, id: string): Promise<void> {
  await getUserVehicle(userId, id);
  await prisma.userVehicle.delete({ where: { id } });
}

/** Ausstattung am eigenen Fahrzeug vermerken. */
export async function setUserVehicleEquipment(
  userId: string,
  vehicleId: string,
  optionId: string,
  zustand: { vorhanden: boolean; confirmed: boolean; note?: string | null | undefined },
) {
  const fahrzeug = await getUserVehicle(userId, vehicleId);

  if (!zustand.vorhanden) {
    await prisma.userVehicleEquipment.deleteMany({ where: { userVehicleId: vehicleId, optionId } });
    return null;
  }

  /*
   * Nur Ausstattung, die es fuer diese Generation ueberhaupt gab. Sonst
   * entstuende ein Fahrzeug mit einer Ausstattung, die dazu nie angeboten
   * wurde -- und der Ausstattungschecker rechnete damit.
   */
  if (fahrzeug.generation) {
    const angeboten = await prisma.optionAvailability.findFirst({
      where: { optionId, generationId: fahrzeug.generation.id },
      select: { id: true },
    });
    if (!angeboten) {
      throw errors.validation({
        optionId: [
          'Diese Ausstattung ist für diese Baureihe nicht erfasst. Das kann eine Nachrüstung ' +
            'sein oder eine Lücke in unseren Daten — als Werksausstattung lässt sie sich hier ' +
            'nicht vermerken.',
        ],
      });
    }
  }

  return prisma.userVehicleEquipment.upsert({
    where: { userVehicleId_optionId: { userVehicleId: vehicleId, optionId } },
    update: { confirmed: zustand.confirmed, note: zustand.note ?? null },
    create: {
      userVehicleId: vehicleId,
      optionId,
      confirmed: zustand.confirmed,
      note: zustand.note ?? null,
    },
    select: { id: true, confirmed: true, note: true },
  });
}

/**
 * Passen Generation, Facelift-Phase und Antriebskombination zusammen?
 *
 * Die Pruefung steht hier und nicht im Formular: Sie muss auch fuer die
 * Schnittstelle gelten. Ein Formular laesst sich umgehen.
 */
async function assertStimmigeAuswahl(eingabe: Partial<UserVehicleInput>): Promise<void> {
  const { generationId, faceliftPhaseId, powertrainId } = eingabe;
  if (!generationId) {
    // Ohne Generation gibt es nichts, wogegen sich das Uebrige pruefen
    // liesse. Dann darf auch nichts daran haengen.
    if (faceliftPhaseId || powertrainId) {
      throw errors.validation({
        generationId: [
          'Facelift-Phase und Motorvariante lassen sich nur zu einer gewählten Baureihe angeben.',
        ],
      });
    }
    return;
  }

  if (faceliftPhaseId) {
    const phase = await prisma.faceliftPhase.findFirst({
      where: { id: faceliftPhaseId, generationId },
      select: { id: true },
    });
    if (!phase) {
      throw errors.validation({
        faceliftPhaseId: ['Diese Facelift-Phase gehört nicht zur gewählten Baureihe.'],
      });
    }
  }

  if (powertrainId) {
    const antrieb = await prisma.powertrainCombination.findFirst({
      where: { id: powertrainId, generationId },
      select: { id: true },
    });
    if (!antrieb) {
      throw errors.validation({
        powertrainId: ['Diese Motorvariante gab es in der gewählten Baureihe nicht.'],
      });
    }
  }
}

// ---------------------------------------------------------------------------
// Merkzettel
// ---------------------------------------------------------------------------

export const KATALOG_MERKBARE_ARTEN = [
  'Engine',
  'PowertrainCombination',
  'OptionalEquipment',
  'Generation',
  'PaintColor',
  'WheelOption',
  'SpecialEdition',
] as const;

export type KatalogMerkArt = (typeof KATALOG_MERKBARE_ARTEN)[number];

export async function merkeKatalogeintrag(
  userId: string,
  subjectType: KatalogMerkArt,
  subjectId: string,
): Promise<{ gemerkt: boolean }> {
  const vorhanden = await prisma.catalogFavorite.findUnique({
    where: { userId_subjectType_subjectId: { userId, subjectType, subjectId } },
    select: { id: true },
  });

  // Umschalten statt zweier Endpunkte: Der Knopf in der Oberflaeche kennt
  // nur einen Zustand und soll ihn wechseln koennen.
  if (vorhanden) {
    await prisma.catalogFavorite.delete({ where: { id: vorhanden.id } });
    return { gemerkt: false };
  }

  await prisma.catalogFavorite.create({ data: { userId, subjectType, subjectId } });
  return { gemerkt: true };
}

export async function listKatalogMerkzettel(userId: string) {
  return prisma.catalogFavorite.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 200,
    select: { id: true, subjectType: true, subjectId: true, createdAt: true },
  });
}
