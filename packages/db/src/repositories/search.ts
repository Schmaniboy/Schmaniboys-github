import {
  SEARCH_PAGE_SIZE,
  type VehicleSearchInput,
} from '@ap/core';

import { type Prisma, prisma } from '../client';

/**
 * Fahrzeugsuche.
 *
 * Gesucht wird auf Ebene der Antriebskombination (Begruendung in
 * packages/core/src/catalog/search.ts). Jede Bedingung filtert zuerst auf
 * veroeffentlichte Eintraege -- und zwar auf allen vier Ebenen: Kombination,
 * Generation, Modell und Hersteller. Ein Entwurf darf auch dann nicht
 * auftauchen, wenn nur eine der Ebenen darueber noch unveroeffentlicht ist.
 */

const VEROEFFENTLICHT = { status: 'PUBLISHED' } as const;

function buildWhere(input: VehicleSearchInput): Prisma.PowertrainCombinationWhereInput {
  const bedingungen: Prisma.PowertrainCombinationWhereInput = {
    ...VEROEFFENTLICHT,
    generation: {
      ...VEROEFFENTLICHT,
      model: { ...VEROEFFENTLICHT, manufacturer: VEROEFFENTLICHT },
    },
    engine: VEROEFFENTLICHT,
  };

  const generation = bedingungen.generation as Prisma.GenerationWhereInput;
  const model = generation.model as Prisma.ModelWhereInput;

  if (input.hersteller) {
    model.manufacturer = { ...VEROEFFENTLICHT, slug: input.hersteller };
  }
  if (input.modell) {
    model.slug = input.modell;
  }
  if (input.karosserie) {
    generation.bodyType = { slug: input.karosserie };
  }
  if (input.baureihe) {
    // Genau das Kuerzel, nicht "enthaelt": "B9" darf nicht "B90" treffen.
    generation.code = { equals: input.baureihe, mode: 'insensitive' };
  }

  /*
   * Baujahrfilter als Ueberschneidung, nicht als Enthaltensein: Wer "2016 bis
   * 2018" sucht, meint Fahrzeuge, die in dieser Zeit gebaut wurden -- auch
   * wenn die Baureihe schon 2014 begann. yearTo = null heisst "laeuft noch"
   * und ueberschneidet sich mit jedem spaeteren Jahr.
   */
  if (input.baujahrVon !== undefined) {
    generation.OR = [{ yearTo: null }, { yearTo: { gte: input.baujahrVon } }];
  }
  if (input.baujahrBis !== undefined) {
    generation.yearFrom = { lte: input.baujahrBis };
  }

  if (input.kraftstoff.length > 0) {
    bedingungen.engine = { ...VEROEFFENTLICHT, fuelType: { in: input.kraftstoff } };
  }
  if (input.getriebe.length > 0) {
    bedingungen.transmission = { type: { in: input.getriebe } };
  }
  if (input.antrieb.length > 0) {
    bedingungen.driveType = { in: input.antrieb };
  }

  /*
   * Leistung: Die Kombination fuehrt einen eigenen Wert, der vom Motorwert
   * abweichen kann. Fehlt er, gilt der Motorwert -- deshalb die Oder-Bedingung
   * ueber beide Felder statt einer einfachen Spaltenbedingung.
   */
  const leistungsgrenzen: Prisma.IntNullableFilter = {};
  if (input.leistungVonKw !== undefined) leistungsgrenzen.gte = input.leistungVonKw;
  if (input.leistungBisKw !== undefined) leistungsgrenzen.lte = input.leistungBisKw;
  if (Object.keys(leistungsgrenzen).length > 0) {
    bedingungen.AND = [
      {
        OR: [
          { powerKw: leistungsgrenzen },
          { powerKw: null, engine: { powerKw: leistungsgrenzen } },
        ],
      },
    ];
  }

  if (input.abgasnorm) {
    /*
     * Als Praefix: Wer "Euro 6" filtert, meint auch "Euro 6b" und
     * "Euro 6d-TEMP". Die Norm steht an der Kombination und ersatzweise am
     * Motor -- deshalb beide Felder.
     */
    const beginnt = { startsWith: input.abgasnorm, mode: 'insensitive' as const };
    const bisherAbgas = Array.isArray(bedingungen.AND) ? bedingungen.AND : [];
    bedingungen.AND = [
      ...bisherAbgas,
      {
        OR: [
          { emissionStandard: beginnt },
          { emissionStandard: null, engine: { emissionStandard: beginnt } },
        ],
      },
    ];
  }

  if (input.q) {
    const suchbegriff = input.q;
    const enthaelt = { contains: suchbegriff, mode: 'insensitive' as const };
    const bisher = Array.isArray(bedingungen.AND) ? bedingungen.AND : [];
    bedingungen.AND = [
      ...bisher,
      {
        OR: [
          { engine: { name: enthaelt } },
          { engine: { code: enthaelt } },
          { generation: { name: enthaelt } },
          { generation: { code: enthaelt } },
          { generation: { model: { name: enthaelt } } },
          { generation: { model: { manufacturer: { name: enthaelt } } } },
        ],
      },
    ];
  }

  return bedingungen;
}

function buildOrderBy(
  sortierung: VehicleSearchInput['sortierung'],
): Prisma.PowertrainCombinationOrderByWithRelationInput[] {
  /*
   * `nulls: 'last'` durchgaengig: Ein fehlender Wert darf nicht als bester
   * Wert erscheinen. Ohne das stuende ein Fahrzeug ohne erfassten Verbrauch
   * bei "sparsamste zuerst" ganz oben -- die schlimmste Art, eine Luecke zu
   * praesentieren.
   */
  switch (sortierung) {
    case 'leistung-ab':
      return [{ powerKw: { sort: 'desc', nulls: 'last' } }, { id: 'asc' }];
    case 'leistung-auf':
      return [{ powerKw: { sort: 'asc', nulls: 'last' } }, { id: 'asc' }];
    case 'baujahr-ab':
      return [{ yearFrom: { sort: 'desc', nulls: 'last' } }, { id: 'asc' }];
    case 'baujahr-auf':
      return [{ yearFrom: { sort: 'asc', nulls: 'last' } }, { id: 'asc' }];
    case 'verbrauch-auf':
      return [{ consumptionCombined: { sort: 'asc', nulls: 'last' } }, { id: 'asc' }];
    case 'beschleunigung-auf':
      return [{ acceleration0to100: { sort: 'asc', nulls: 'last' } }, { id: 'asc' }];
    case 'relevanz':
    default:
      // Ohne ausdrueckliche Sortierung: die staerksten zuerst, dann stabil
      // nach id -- damit Seite 2 nicht dieselben Treffer zeigt wie Seite 1.
      return [{ powerKw: { sort: 'desc', nulls: 'last' } }, { id: 'asc' }];
  }
}

const TREFFER_AUSWAHL = {
  id: true,
  driveType: true,
  powerKw: true,
  torqueNm: true,
  acceleration0to100: true,
  topSpeedKmh: true,
  consumptionCombined: true,
  consumptionUnit: true,
  measurementStandard: true,
  yearFrom: true,
  yearTo: true,
  engine: {
    select: {
      name: true,
      code: true,
      fuelType: true,
      displacementCcm: true,
      cylinders: true,
      powerKw: true,
    },
  },
  transmission: { select: { name: true, type: true, gears: true } },
  generation: {
    select: {
      name: true,
      code: true,
      slug: true,
      yearFrom: true,
      yearTo: true,
      bodyType: { select: { name: true, slug: true } },
      model: {
        select: {
          name: true,
          slug: true,
          manufacturer: { select: { name: true, slug: true } },
        },
      },
    },
  },
} satisfies Prisma.PowertrainCombinationSelect;

export type SearchHit = Prisma.PowertrainCombinationGetPayload<{
  select: typeof TREFFER_AUSWAHL;
}>;

export interface SearchResult {
  hits: SearchHit[];
  total: number;
  page: number;
  pageSize: number;
}

export async function searchVehicles(input: VehicleSearchInput): Promise<SearchResult> {
  const where = buildWhere(input);
  const skip = (input.seite - 1) * SEARCH_PAGE_SIZE;

  // Treffer und Gesamtzahl in einer Runde -- die Gesamtzahl wird fuer die
  // Seitennavigation gebraucht und soll keinen zweiten Umlauf kosten.
  const [hits, total] = await Promise.all([
    prisma.powertrainCombination.findMany({
      where,
      orderBy: buildOrderBy(input.sortierung),
      skip,
      take: SEARCH_PAGE_SIZE,
      select: TREFFER_AUSWAHL,
    }),
    prisma.powertrainCombination.count({ where }),
  ]);

  return { hits, total, page: input.seite, pageSize: SEARCH_PAGE_SIZE };
}

/**
 * Auswahlmoeglichkeiten mit Trefferzahl.
 *
 * Ein Filter, der zu null Treffern fuehrt, ist eine Sackgasse. Deshalb zeigt
 * die Oberflaeche neben jeder Kraftstoffart, wie viele Fahrzeuge dahinter
 * stehen -- gezaehlt unter den uebrigen gesetzten Filtern.
 */
export async function fuelFacets(input: VehicleSearchInput) {
  // Ohne den eigenen Filter zaehlen -- sonst zeigt "Diesel (12)" immer nur
  // die Treffer, die man ohnehin schon sieht.
  const ohneKraftstoff: VehicleSearchInput = { ...input, kraftstoff: [] };
  const gruppen = await prisma.powertrainCombination.groupBy({
    by: ['engineId'],
    where: buildWhere(ohneKraftstoff),
    _count: true,
  });

  if (gruppen.length === 0) return [];

  const motoren = await prisma.engine.findMany({
    where: { id: { in: gruppen.map((gruppe) => gruppe.engineId) } },
    select: { id: true, fuelType: true },
  });
  const kraftstoffJeMotor = new Map(motoren.map((motor) => [motor.id, motor.fuelType]));

  const zaehler = new Map<string, number>();
  for (const gruppe of gruppen) {
    const kraftstoff = kraftstoffJeMotor.get(gruppe.engineId);
    if (!kraftstoff) continue;
    zaehler.set(kraftstoff, (zaehler.get(kraftstoff) ?? 0) + gruppe._count);
  }

  return [...zaehler.entries()]
    .map(([fuelType, count]) => ({ fuelType, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Aehnliche Fahrzeuge.
 *
 * Aehnlich heisst hier: vergleichbare Leistung (plus/minus ein Viertel),
 * gleiche Karosserieform, aber ein anderes Modell. Ein anderer Motor
 * derselben Baureihe ist keine Alternative, sondern eine Variante -- die
 * steht ohnehin schon auf der Fahrzeugseite.
 */
export async function findSimilarVehicles(powertrainId: string, limit = 6) {
  const ausgangspunkt = await prisma.powertrainCombination.findFirst({
    where: { id: powertrainId, ...VEROEFFENTLICHT },
    select: {
      powerKw: true,
      engine: { select: { powerKw: true } },
      generation: {
        select: { bodyTypeId: true, modelId: true, yearFrom: true },
      },
    },
  });

  if (!ausgangspunkt) return [];

  const leistung = ausgangspunkt.powerKw ?? ausgangspunkt.engine.powerKw;
  if (leistung === null || leistung === undefined) return [];

  return prisma.powertrainCombination.findMany({
    where: {
      ...VEROEFFENTLICHT,
      id: { not: powertrainId },
      powerKw: { gte: Math.round(leistung * 0.75), lte: Math.round(leistung * 1.25) },
      generation: {
        ...VEROEFFENTLICHT,
        modelId: { not: ausgangspunkt.generation.modelId },
        ...(ausgangspunkt.generation.bodyTypeId
          ? { bodyTypeId: ausgangspunkt.generation.bodyTypeId }
          : {}),
        model: { ...VEROEFFENTLICHT, manufacturer: VEROEFFENTLICHT },
      },
    },
    take: limit,
    orderBy: { powerKw: 'desc' },
    select: TREFFER_AUSWAHL,
  });
}
