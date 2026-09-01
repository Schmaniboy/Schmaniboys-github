import {
  AVAILABILITY_RANK,
  type CompletenessInput,
  type CompareCandidate,
  type CheckOption,
  type ParsedQuery,
  MAX_VERGLEICH,
  berechneBericht,
  zerlegeSuche,
} from '@ap/core';

import { type Prisma, prisma } from '../client';

/**
 * Abfragen fuer den Datenbank-Ausbau.
 *
 * Zwei Dinge gelten hier durchgehend:
 *
 * 1. Es wird nie der ganze Bestand geladen und dann im Speicher gefiltert.
 *    Jede Abfrage filtert, begrenzt und zaehlt in der Datenbank.
 * 2. Es wird nur veroeffentlichtes Material zurueckgegeben -- auf allen
 *    Ebenen. Ein Entwurf darf auch dann nicht erscheinen, wenn nur eine
 *    Ebene darueber unveroeffentlicht ist.
 */

const VEROEFFENTLICHT = { status: 'PUBLISHED' } as const;

const KETTE_VEROEFFENTLICHT = {
  ...VEROEFFENTLICHT,
  generation: {
    ...VEROEFFENTLICHT,
    model: { ...VEROEFFENTLICHT, manufacturer: VEROEFFENTLICHT },
  },
} satisfies Prisma.PowertrainCombinationWhereInput;

// ---------------------------------------------------------------------------
// Datenbestand
// ---------------------------------------------------------------------------

export interface BestandsZahlen {
  zeilen: ReturnType<typeof berechneBericht>;
  /** Wie viele Datensaetze welche Guete tragen. */
  guete: { quality: string; anzahl: number }[];
  /** Eintraege, die auf Pruefung warten. */
  zurPruefung: number;
  /** Katalogeintraege ohne jede Quellenangabe. */
  ohneQuelle: number;
}

/**
 * Der Datenbestand in Zahlen.
 *
 * Bewusst als Zaehlung und nicht als Quote: Wie viele Motoren es insgesamt
 * gab, weiss niemand. Eine Quote entsteht nur dort, wo jemand eine bekannte
 * Gesamtzahl MIT Quelle hinterlegt hat (CatalogExpectation).
 */
export async function ladeDatenbestand(): Promise<BestandsZahlen> {
  const [
    marken,
    modelle,
    generationen,
    facelifts,
    modelljahre,
    motoren,
    motorcodes,
    antriebe,
    ausstattungen,
    ausstattungscodes,
    pakete,
    lackfarben,
    raeder,
    sondermodelle,
    bilder,
    quellen,
    erwartungen,
    gueteRoh,
    zurPruefung,
  ] = await Promise.all([
    prisma.manufacturer.count({ where: VEROEFFENTLICHT }),
    prisma.model.count({ where: VEROEFFENTLICHT }),
    prisma.generation.count({ where: VEROEFFENTLICHT }),
    prisma.faceliftPhase.count({ where: VEROEFFENTLICHT }),
    prisma.modelYear.count({ where: VEROEFFENTLICHT }),
    prisma.engine.count({ where: VEROEFFENTLICHT }),
    prisma.engine.count({ where: { ...VEROEFFENTLICHT, code: { not: null } } }),
    prisma.powertrainCombination.count({ where: VEROEFFENTLICHT }),
    prisma.optionalEquipment.count({ where: VEROEFFENTLICHT }),
    prisma.optionalEquipment.count({ where: { ...VEROEFFENTLICHT, optionCode: { not: null } } }),
    prisma.equipmentPackage.count({ where: VEROEFFENTLICHT }),
    prisma.paintColor.count({ where: VEROEFFENTLICHT }),
    prisma.wheelOption.count({ where: VEROEFFENTLICHT }),
    prisma.specialEdition.count({ where: VEROEFFENTLICHT }),
    prisma.catalogImage.count({ where: VEROEFFENTLICHT }),
    prisma.source.count(),
    prisma.catalogExpectation.findMany({
      select: { aspect: true, knownTotal: true, sourceTitle: true },
    }),
    prisma.$queryRaw<{ quality: string; anzahl: bigint }[]>`
      SELECT "dataQuality"::text AS quality, count(*) AS anzahl
      FROM (
        SELECT "dataQuality" FROM "Engine"
        UNION ALL SELECT "dataQuality" FROM "PowertrainCombination"
        UNION ALL SELECT "dataQuality" FROM "Generation"
        UNION ALL SELECT "dataQuality" FROM "OptionalEquipment"
        UNION ALL SELECT "dataQuality" FROM "OptionAvailability"
        UNION ALL SELECT "dataQuality" FROM "CatalogImage"
        UNION ALL SELECT "dataQuality" FROM "PaintColor"
        UNION ALL SELECT "dataQuality" FROM "WheelOption"
        UNION ALL SELECT "dataQuality" FROM "SpecialEdition"
        UNION ALL SELECT "dataQuality" FROM "ModelYear"
        UNION ALL SELECT "dataQuality" FROM "EngineFamily"
        UNION ALL SELECT "dataQuality" FROM "HsnTsnEntry"
      ) AS alle
      GROUP BY "dataQuality"
      ORDER BY count(*) DESC
    `,
    prisma.$queryRaw<{ anzahl: bigint }[]>`
      SELECT count(*) AS anzahl FROM (
        SELECT 1 FROM "Engine" WHERE "dataQuality" = 'NEEDS_REVIEW'
        UNION ALL SELECT 1 FROM "PowertrainCombination" WHERE "dataQuality" = 'NEEDS_REVIEW'
        UNION ALL SELECT 1 FROM "Generation" WHERE "dataQuality" = 'NEEDS_REVIEW'
        UNION ALL SELECT 1 FROM "OptionalEquipment" WHERE "dataQuality" = 'NEEDS_REVIEW'
        UNION ALL SELECT 1 FROM "OptionAvailability" WHERE "dataQuality" = 'NEEDS_REVIEW'
        UNION ALL SELECT 1 FROM "CatalogImage" WHERE "dataQuality" = 'NEEDS_REVIEW'
        UNION ALL SELECT 1 FROM "PaintColor" WHERE "dataQuality" = 'NEEDS_REVIEW'
        UNION ALL SELECT 1 FROM "WheelOption" WHERE "dataQuality" = 'NEEDS_REVIEW'
        UNION ALL SELECT 1 FROM "SpecialEdition" WHERE "dataQuality" = 'NEEDS_REVIEW'
        UNION ALL SELECT 1 FROM "ModelYear" WHERE "dataQuality" = 'NEEDS_REVIEW'
        UNION ALL SELECT 1 FROM "HsnTsnEntry" WHERE "dataQuality" = 'NEEDS_REVIEW'
      ) AS offen
    `,
  ]);

  const gesamtzahl = new Map(
    erwartungen.map((e) => [e.aspect, { total: e.knownTotal, quelle: e.sourceTitle }]),
  );

  const eingaben: CompletenessInput[] = (
    [
      ['MODEL', modelle],
      ['GENERATION', generationen],
      ['FACELIFT', facelifts],
      ['MODEL_YEAR', modelljahre],
      ['ENGINE', motoren],
      ['OPTION_CODE', ausstattungscodes],
      ['POWERTRAIN', antriebe],
      ['OPTION', ausstattungen],
      ['PACKAGE', pakete],
      ['PAINT', lackfarben],
      ['WHEEL', raeder],
      ['SPECIAL_EDITION', sondermodelle],
      ['IMAGE', bilder],
      ['SOURCE', quellen],
    ] as const
  ).map(([aspect, recorded]) => {
    const bekannt = gesamtzahl.get(aspect);
    return {
      aspect,
      recorded,
      knownTotal: bekannt?.total ?? null,
      knownTotalSource: bekannt?.quelle ?? null,
    };
  });

  // Marken und Motorcodes bekommen eigene Zeilen, damit die Kennzahl
  // "wie viele Motoren tragen ueberhaupt einen Code" sichtbar bleibt.
  const zeilen = berechneBericht(eingaben);

  const ohneQuelle = await zaehleOhneQuelle();

  return {
    zeilen: [
      {
        aspect: 'MODEL',
        label: 'Marken',
        recorded: marken,
        knownTotal: null,
        knownTotalSource: null,
        percent: null,
        statement: `${marken} Marken erfasst. Gesamtzahl nicht belegt — die Liste ist offen und wächst mit jeder eingepflegten Quelle.`,
      },
      ...zeilen,
      {
        aspect: 'ENGINE',
        label: 'Motoren mit erfasstem Motorcode',
        recorded: motorcodes,
        knownTotal: motoren > 0 ? motoren : null,
        // Hier ist die Gesamtzahl ausnahmsweise bekannt: Es sind die
        // erfassten Motoren selbst. Der Anteil sagt, wie viele davon am
        // Fahrzeug eindeutig wiederzufinden sind.
        knownTotalSource: motoren > 0 ? 'den erfassten Motoren dieses Katalogs' : null,
        percent: motoren > 0 ? Math.round((motorcodes / motoren) * 100) : null,
        statement:
          motoren > 0
            ? `${motorcodes} von ${motoren} erfassten Motoren tragen einen Motorcode (${Math.round(
                (motorcodes / motoren) * 100,
              )} %). Ohne Code lässt sich ein Motor am Fahrzeug nicht eindeutig wiederfinden.`
            : 'Keine Motoren erfasst.',
      },
    ],
    guete: gueteRoh.map((zeile) => ({ quality: zeile.quality, anzahl: Number(zeile.anzahl) })),
    zurPruefung: Number(zurPruefung[0]?.anzahl ?? 0),
    ohneQuelle,
  };
}

/**
 * Katalogeintraege ohne jede Quellenangabe.
 *
 * Die wichtigste einzelne Zahl im Bericht: Sie sagt, wie viel vom Bestand
 * niemand nachpruefen kann.
 */
async function zaehleOhneQuelle(): Promise<number> {
  const zeilen = await prisma.$queryRaw<{ anzahl: bigint }[]>`
    SELECT count(*) AS anzahl FROM (
      SELECT e.id FROM "Engine" e
        WHERE NOT EXISTS (
          SELECT 1 FROM "Source" s WHERE s."subjectType" = 'Engine' AND s."subjectId" = e.id)
      UNION ALL
      SELECT g.id FROM "Generation" g
        WHERE NOT EXISTS (
          SELECT 1 FROM "Source" s WHERE s."subjectType" = 'Generation' AND s."subjectId" = g.id)
      UNION ALL
      SELECT p.id FROM "PowertrainCombination" p
        WHERE NOT EXISTS (
          SELECT 1 FROM "Source" s WHERE s."subjectType" = 'PowertrainCombination' AND s."subjectId" = p.id)
      UNION ALL
      SELECT o.id FROM "OptionalEquipment" o
        WHERE NOT EXISTS (
          SELECT 1 FROM "Source" s WHERE s."subjectType" = 'OptionalEquipment' AND s."subjectId" = o.id)
    ) AS ohne
  `;
  return Number(zeilen[0]?.anzahl ?? 0);
}

// ---------------------------------------------------------------------------
// Fahrzeugvergleich
// ---------------------------------------------------------------------------

const VERGLEICH_AUSWAHL = {
  id: true,
  powerKw: true,
  torqueNm: true,
  acceleration0to100: true,
  topSpeedKmh: true,
  consumptionCombined: true,
  co2CombinedGramPerKm: true,
  measurementStandard: true,
  kerbWeightKg: true,
  fuelTankLitres: true,
  batteryCapacityKwh: true,
  electricRangeKm: true,
  seats: true,
  doors: true,
  payloadKg: true,
  towingCapacityBrakedKg: true,
  emissionStandard: true,
  driveType: true,
  yearFrom: true,
  yearTo: true,
  dataQuality: true,
  engine: {
    select: {
      name: true,
      code: true,
      displacementCcm: true,
      cylinders: true,
      fuelType: true,
      powerKw: true,
      torqueNm: true,
      emissionStandard: true,
      engineFamily: { select: { name: true } },
    },
  },
  transmission: { select: { name: true, type: true, gears: true } },
  generation: {
    select: {
      name: true,
      slug: true,
      code: true,
      yearFrom: true,
      yearTo: true,
      bodyType: { select: { name: true } },
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

export type VergleichsFahrzeug = Prisma.PowertrainCombinationGetPayload<{
  select: typeof VERGLEICH_AUSWAHL;
}>;

export async function ladeVergleichsfahrzeuge(ids: string[]): Promise<VergleichsFahrzeug[]> {
  const eindeutig = [...new Set(ids)].slice(0, MAX_VERGLEICH);
  if (eindeutig.length === 0) return [];

  const gefunden = await prisma.powertrainCombination.findMany({
    where: { id: { in: eindeutig }, ...KETTE_VEROEFFENTLICHT, engine: VEROEFFENTLICHT },
    select: VERGLEICH_AUSWAHL,
  });

  // Reihenfolge der Anfrage erhalten -- sonst springen die Spalten bei
  // jedem Aufruf.
  const nachId = new Map(gefunden.map((eintrag) => [eintrag.id, eintrag]));
  return eindeutig
    .map((id) => nachId.get(id))
    .filter((eintrag): eintrag is VergleichsFahrzeug => eintrag !== undefined);
}

/** Uebersetzt einen Datensatz in die Form, die core/comparison erwartet. */
export function alsVergleichskandidat(fahrzeug: VergleichsFahrzeug): CompareCandidate {
  const marke = fahrzeug.generation.model.manufacturer.name;
  const modell = fahrzeug.generation.model.name;

  return {
    id: fahrzeug.id,
    label: `${marke} ${modell} ${fahrzeug.engine.name}`,
    measurementStandard: fahrzeug.measurementStandard,
    dataQuality: fahrzeug.dataQuality,
    values: {
      powerKw: fahrzeug.powerKw ?? fahrzeug.engine.powerKw ?? null,
      torqueNm: fahrzeug.torqueNm ?? fahrzeug.engine.torqueNm ?? null,
      acceleration0to100: fahrzeug.acceleration0to100
        ? Number(fahrzeug.acceleration0to100)
        : null,
      topSpeedKmh: fahrzeug.topSpeedKmh,
      consumptionCombined: fahrzeug.consumptionCombined
        ? Number(fahrzeug.consumptionCombined)
        : null,
      co2CombinedGramPerKm: fahrzeug.co2CombinedGramPerKm,
      kerbWeightKg: fahrzeug.kerbWeightKg,
      fuelTankLitres: fahrzeug.fuelTankLitres,
      batteryCapacityKwh: fahrzeug.batteryCapacityKwh
        ? Number(fahrzeug.batteryCapacityKwh)
        : null,
      electricRangeKm: fahrzeug.electricRangeKm,
      seats: fahrzeug.seats,
      doors: fahrzeug.doors,
      payloadKg: fahrzeug.payloadKg,
      towingCapacityBrakedKg: fahrzeug.towingCapacityBrakedKg,
    },
  };
}

// ---------------------------------------------------------------------------
// Ausstattungschecker
// ---------------------------------------------------------------------------

export interface CheckerBasis {
  generation: {
    id: string;
    name: string;
    slug: string;
    yearFrom: number;
    yearTo: number | null;
    modell: string;
    modellSlug: string;
    marke: string;
    markeSlug: string;
  };
  optionen: CheckOption[];
}

export async function ladeCheckerBasis(
  herstellerSlug: string,
  modellSlug: string,
  generationSlug: string,
): Promise<CheckerBasis | null> {
  const generation = await prisma.generation.findFirst({
    where: {
      slug: generationSlug,
      ...VEROEFFENTLICHT,
      model: {
        slug: modellSlug,
        ...VEROEFFENTLICHT,
        manufacturer: { slug: herstellerSlug, ...VEROEFFENTLICHT },
      },
    },
    select: {
      id: true,
      name: true,
      slug: true,
      yearFrom: true,
      yearTo: true,
      model: {
        select: { name: true, slug: true, manufacturer: { select: { name: true, slug: true } } },
      },
    },
  });

  if (!generation) return null;

  const zeilen = await prisma.optionAvailability.findMany({
    where: { generationId: generation.id, option: VEROEFFENTLICHT },
    // Begrenzt: Eine Generation mit ueber tausend Ausstattungszeilen waere
    // ohnehin nicht mehr abhakbar, und die Seite soll nicht unbemerkt
    // beliebig gross werden.
    take: 800,
    orderBy: [{ option: { area: 'asc' } }, { option: { name: 'asc' } }],
    select: {
      kind: true,
      package: { select: { name: true } },
      specialEdition: { select: { name: true } },
      option: {
        select: {
          id: true,
          name: true,
          optionCode: true,
          area: true,
          rarity: true,
          purchaseRelevance: true,
          resaleRelevance: true,
        },
      },
    },
  });

  /*
   * Dieselbe Ausstattung kann mehrfach vorkommen -- Serie in der oberen
   * Linie, Aufpreis in der Basis. Fuer den Checker zaehlt die fuer den
   * Kaeufer guenstigste Form; die Rangfolge steht in core/availability.
   */
  const jeOption = new Map<string, CheckOption>();

  for (const zeile of zeilen) {
    const vorhanden = jeOption.get(zeile.option.id);
    const kandidat: CheckOption = {
      optionId: zeile.option.id,
      name: zeile.option.name,
      optionCode: zeile.option.optionCode,
      area: (zeile.option.area as CheckOption['area']) ?? 'OTHER',
      kind: zeile.kind,
      purchaseRelevance: zeile.option.purchaseRelevance,
      resaleRelevance: zeile.option.resaleRelevance,
      rarity: zeile.option.rarity,
      packageName: zeile.package?.name ?? null,
      specialEditionName: zeile.specialEdition?.name ?? null,
    };
    if (!vorhanden || AVAILABILITY_RANK[kandidat.kind] < AVAILABILITY_RANK[vorhanden.kind]) {
      jeOption.set(zeile.option.id, kandidat);
    }
  }

  return {
    generation: {
      id: generation.id,
      name: generation.name,
      slug: generation.slug,
      yearFrom: generation.yearFrom,
      yearTo: generation.yearTo,
      modell: generation.model.name,
      modellSlug: generation.model.slug,
      marke: generation.model.manufacturer.name,
      markeSlug: generation.model.manufacturer.slug,
    },
    optionen: [...jeOption.values()],
  };
}

// ---------------------------------------------------------------------------
// HSN/TSN
// ---------------------------------------------------------------------------

export async function sucheHsnTsn(hsn: string, tsn: string) {
  return prisma.hsnTsnEntry.findMany({
    where: { hsn, tsn, ...VEROEFFENTLICHT },
    take: 50,
    orderBy: [{ typeName: 'asc' }],
    select: {
      id: true,
      hsn: true,
      tsn: true,
      manufacturerName: true,
      typeName: true,
      yearFrom: true,
      yearTo: true,
      note: true,
      dataQuality: true,
      lastVerifiedAt: true,
      generation: {
        select: {
          name: true,
          slug: true,
          code: true,
          model: {
            select: { name: true, slug: true, manufacturer: { select: { name: true, slug: true } } },
          },
        },
      },
      powertrain: {
        select: { id: true, powerKw: true, engine: { select: { name: true, code: true } } },
      },
    },
  });
}

// ---------------------------------------------------------------------------
// Smart-Suche
// ---------------------------------------------------------------------------

export interface SmartTreffer {
  art: 'MOTOR' | 'FAHRZEUG' | 'AUSSTATTUNG' | 'GENERATION';
  titel: string;
  untertitel: string;
  href: string;
  /** Warum dieser Treffer erschien. Der Nutzer soll nicht raten muessen. */
  grund: string;
}

export interface SmartErgebnis {
  zerlegt: ParsedQuery;
  treffer: SmartTreffer[];
}

/**
 * Suche, die die Eingabe zuerst versteht.
 *
 * "DBKA" ist ein Motorcode und keine Zeichenkette im Fahrzeugnamen; "G20"
 * ist eine Baureihe; "S610A" eine Bestellnummer. Wer das alles in ein
 * LIKE '%...%' ueber den Modellnamen kippt, findet beim ersten Fall nichts.
 *
 * Jeder Treffer traegt seinen Grund mit. Das ist kein Beiwerk: Wer "DBKA"
 * eingibt und eine Liste Fahrzeuge bekommt, soll lesen koennen, warum
 * gerade diese.
 */
export async function smartSuche(eingabe: string, grenze = 8): Promise<SmartErgebnis> {
  const zerlegt = zerlegeSuche(eingabe);
  const treffer: SmartTreffer[] = [];

  if (eingabe.trim().length === 0) return { zerlegt, treffer };

  // 1. Motorcodes -- der praeziseste Treffer, deshalb zuerst.
  if (zerlegt.engineCodes.length > 0) {
    const motoren = await prisma.engine.findMany({
      where: {
        ...VEROEFFENTLICHT,
        code: { in: zerlegt.engineCodes, mode: 'insensitive' },
        manufacturer: VEROEFFENTLICHT,
      },
      take: grenze,
      select: {
        id: true,
        name: true,
        code: true,
        powerKw: true,
        displacementCcm: true,
        fuelType: true,
        engineFamily: { select: { name: true } },
        manufacturer: { select: { name: true, slug: true } },
        powertrains: {
          where: KETTE_VEROEFFENTLICHT,
          take: 1,
          select: {
            id: true,
            generation: {
              select: {
                slug: true,
                model: { select: { slug: true, manufacturer: { select: { slug: true } } } },
              },
            },
          },
        },
      },
    });

    for (const motor of motoren) {
      const antrieb = motor.powertrains[0];
      treffer.push({
        art: 'MOTOR',
        titel: `${motor.manufacturer.name} ${motor.name}${motor.code ? ` — ${motor.code}` : ''}`,
        untertitel: [
          motor.engineFamily?.name,
          motor.displacementCcm ? `${motor.displacementCcm} cm³` : null,
          motor.powerKw ? `${motor.powerKw} kW` : null,
        ]
          .filter(Boolean)
          .join(' · '),
        href: antrieb
          ? `/katalog/${antrieb.generation.model.manufacturer.slug}/${antrieb.generation.model.slug}/${antrieb.generation.slug}/motor/${antrieb.id}`
          : `/suche?q=${encodeURIComponent(motor.code ?? motor.name)}`,
        grund: `Motorcode ${motor.code}`,
      });
    }
  }

  // 2. Baureihenkuerzel, etwa "G20" oder "MK7".
  if (zerlegt.generationCodes.length > 0 && treffer.length < grenze) {
    const generationen = await prisma.generation.findMany({
      where: {
        ...VEROEFFENTLICHT,
        code: { in: zerlegt.generationCodes, mode: 'insensitive' },
        model: { ...VEROEFFENTLICHT, manufacturer: VEROEFFENTLICHT },
      },
      take: grenze - treffer.length,
      select: {
        name: true,
        slug: true,
        code: true,
        yearFrom: true,
        yearTo: true,
        model: {
          select: { name: true, slug: true, manufacturer: { select: { name: true, slug: true } } },
        },
      },
    });

    for (const generation of generationen) {
      treffer.push({
        art: 'GENERATION',
        titel: `${generation.model.manufacturer.name} ${generation.model.name} ${generation.code ?? ''}`.trim(),
        untertitel: `${generation.name} · ${generation.yearFrom}–${generation.yearTo ?? 'heute'}`,
        href: `/katalog/${generation.model.manufacturer.slug}/${generation.model.slug}/${generation.slug}`,
        grund: `Baureihe ${generation.code}`,
      });
    }
  }

  // 3. Ausstattungscodes.
  if (zerlegt.optionCodes.length > 0 && treffer.length < grenze) {
    const optionen = await prisma.optionalEquipment.findMany({
      where: {
        ...VEROEFFENTLICHT,
        optionCode: { in: zerlegt.optionCodes, mode: 'insensitive' },
        manufacturer: VEROEFFENTLICHT,
      },
      take: grenze - treffer.length,
      select: {
        name: true,
        slug: true,
        optionCode: true,
        category: true,
        manufacturer: { select: { name: true, slug: true } },
        availability: {
          take: 1,
          select: {
            generation: {
              select: {
                slug: true,
                model: { select: { slug: true, manufacturer: { select: { slug: true } } } },
              },
            },
          },
        },
      },
    });

    for (const option of optionen) {
      const wo = option.availability[0]?.generation;
      treffer.push({
        art: 'AUSSTATTUNG',
        titel: `${option.manufacturer.name} ${option.name}`,
        untertitel: [option.optionCode, option.category].filter(Boolean).join(' · '),
        href: wo
          ? `/katalog/${wo.model.manufacturer.slug}/${wo.model.slug}/${wo.slug}/ausstattung`
          : `/katalog/${option.manufacturer.slug}`,
        grund: `Ausstattungscode ${option.optionCode}`,
      });
    }
  }

  // 4. Volltext ueber Marke, Modell und Generation.
  if (zerlegt.words.length > 0 && treffer.length < grenze) {
    const begriffe = zerlegt.words.slice(0, 4);
    const generationen = await prisma.generation.findMany({
      where: {
        ...VEROEFFENTLICHT,
        model: { ...VEROEFFENTLICHT, manufacturer: VEROEFFENTLICHT },
        AND: begriffe.map((begriff) => ({
          OR: [
            { name: { contains: begriff, mode: 'insensitive' as const } },
            { code: { contains: begriff, mode: 'insensitive' as const } },
            { model: { name: { contains: begriff, mode: 'insensitive' as const } } },
            {
              model: {
                manufacturer: { name: { contains: begriff, mode: 'insensitive' as const } },
              },
            },
          ],
        })),
        ...(zerlegt.years.length > 0
          ? {
              yearFrom: { lte: Math.max(...zerlegt.years) },
              OR: [{ yearTo: null }, { yearTo: { gte: Math.min(...zerlegt.years) } }],
            }
          : {}),
      },
      take: grenze - treffer.length,
      orderBy: [{ yearFrom: 'desc' }],
      select: {
        name: true,
        slug: true,
        code: true,
        yearFrom: true,
        yearTo: true,
        model: {
          select: { name: true, slug: true, manufacturer: { select: { name: true, slug: true } } },
        },
      },
    });

    const schonDa = new Set(treffer.map((t) => t.href));
    for (const generation of generationen) {
      const href = `/katalog/${generation.model.manufacturer.slug}/${generation.model.slug}/${generation.slug}`;
      if (schonDa.has(href)) continue;
      treffer.push({
        art: 'FAHRZEUG',
        titel: `${generation.model.manufacturer.name} ${generation.model.name}`,
        untertitel: `${generation.name}${generation.code ? ` (${generation.code})` : ''} · ${generation.yearFrom}–${generation.yearTo ?? 'heute'}`,
        href,
        grund: `Textsuche nach ${begriffe.join(' ')}`,
      });
    }
  }

  return { zerlegt, treffer: treffer.slice(0, grenze) };
}

// ---------------------------------------------------------------------------
// Qualitaetskontrolle fuer die Verwaltung
// ---------------------------------------------------------------------------

export interface QualitaetsEintrag {
  bereich: string;
  id: string;
  bezeichnung: string;
  dataQuality: string;
  lastVerifiedAt: Date | null;
  /** Wohin die Redaktion springt, um es zu bearbeiten. */
  kontext: string | null;
}

/**
 * Was auf Pruefung wartet.
 *
 * Ausdruecklich ohne Fristen und ohne Zaehler, der auf null laufen soll.
 * Diese Liste ist ein Arbeitsvorrat, kein Mahnwesen -- ein Datensatz, der
 * hier steht, ist besser dran als einer, der falsch veroeffentlicht wurde.
 */
export async function ladeReviewListe(grenze = 100): Promise<QualitaetsEintrag[]> {
  const [motoren, generationen, antriebe, ausstattungen, bilder] = await Promise.all([
    prisma.engine.findMany({
      where: { dataQuality: 'NEEDS_REVIEW' },
      take: grenze,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        name: true,
        code: true,
        lastVerifiedAt: true,
        dataQuality: true,
        manufacturer: { select: { name: true } },
      },
    }),
    prisma.generation.findMany({
      where: { dataQuality: 'NEEDS_REVIEW' },
      take: grenze,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        name: true,
        lastVerifiedAt: true,
        dataQuality: true,
        model: {
          select: { name: true, slug: true, manufacturer: { select: { name: true, slug: true } } },
        },
        slug: true,
      },
    }),
    prisma.powertrainCombination.findMany({
      where: { dataQuality: 'NEEDS_REVIEW' },
      take: grenze,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        lastVerifiedAt: true,
        dataQuality: true,
        engine: { select: { name: true, code: true } },
        generation: { select: { name: true, model: { select: { name: true } } } },
      },
    }),
    prisma.optionalEquipment.findMany({
      where: { dataQuality: 'NEEDS_REVIEW' },
      take: grenze,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        name: true,
        optionCode: true,
        lastVerifiedAt: true,
        dataQuality: true,
        manufacturer: { select: { name: true } },
      },
    }),
    prisma.catalogImage.findMany({
      where: { dataQuality: 'NEEDS_REVIEW' },
      take: grenze,
      orderBy: { updatedAt: 'desc' },
      select: { id: true, description: true, lastVerifiedAt: true, dataQuality: true, origin: true },
    }),
  ]);

  return [
    ...motoren.map((eintrag) => ({
      bereich: 'Motor',
      id: eintrag.id,
      bezeichnung: `${eintrag.manufacturer.name} ${eintrag.name}${eintrag.code ? ` (${eintrag.code})` : ''}`,
      dataQuality: eintrag.dataQuality,
      lastVerifiedAt: eintrag.lastVerifiedAt,
      kontext: null,
    })),
    ...generationen.map((eintrag) => ({
      bereich: 'Generation',
      id: eintrag.id,
      bezeichnung: `${eintrag.model.manufacturer.name} ${eintrag.model.name} · ${eintrag.name}`,
      dataQuality: eintrag.dataQuality,
      lastVerifiedAt: eintrag.lastVerifiedAt,
      kontext: `/katalog/${eintrag.model.manufacturer.slug}/${eintrag.model.slug}/${eintrag.slug}`,
    })),
    ...antriebe.map((eintrag) => ({
      bereich: 'Antriebskombination',
      id: eintrag.id,
      bezeichnung: `${eintrag.generation.model.name} ${eintrag.generation.name} · ${eintrag.engine.name}`,
      dataQuality: eintrag.dataQuality,
      lastVerifiedAt: eintrag.lastVerifiedAt,
      kontext: null,
    })),
    ...ausstattungen.map((eintrag) => ({
      bereich: 'Ausstattung',
      id: eintrag.id,
      bezeichnung: `${eintrag.manufacturer.name} ${eintrag.name}${eintrag.optionCode ? ` (${eintrag.optionCode})` : ''}`,
      dataQuality: eintrag.dataQuality,
      lastVerifiedAt: eintrag.lastVerifiedAt,
      kontext: null,
    })),
    ...bilder.map((eintrag) => ({
      bereich: 'Bild',
      id: eintrag.id,
      bezeichnung: `${eintrag.origin} — ${eintrag.description.slice(0, 80)}`,
      dataQuality: eintrag.dataQuality,
      lastVerifiedAt: eintrag.lastVerifiedAt,
      kontext: null,
    })),
  ].slice(0, grenze);
}

/**
 * Moegliche Dubletten unter den Ausstattungen eines Herstellers.
 *
 * Dubletten entstehen beim Importieren aus zwei Quellen, die dieselbe
 * Ausstattung verschieden benennen. Sie sind heikel, weil der
 * Ausstattungschecker sie doppelt zaehlt -- der Ausstattungsgrad faellt
 * dann, ohne dass am Fahrzeug etwas fehlt.
 */
export async function findeAusstattungsDubletten(grenze = 50) {
  /*
   * Der Vergleichsschluessel vereinheitlicht so weit, dass "Sitzheizung",
   * "sitzheizung " und "Sitz-Heizung" zusammenfallen -- aber nicht so weit,
   * dass "Sitzheizung vorn" und "Sitzheizung hinten" es tun. Der zweite
   * Fehler waere der schlimmere: Er loeschte eine echte Unterscheidung.
   */
  const zeilen = await prisma.$queryRaw<
    { manufacturerName: string; schluessel: string; namen: string[]; anzahl: bigint }[]
  >`
    SELECT m.name AS "manufacturerName",
           regexp_replace(lower(o.name), '[^a-z0-9]', '', 'g') AS schluessel,
           array_agg(o.name ORDER BY o.name) AS namen,
           count(*) AS anzahl
    FROM "OptionalEquipment" o
    JOIN "Manufacturer" m ON m.id = o."manufacturerId"
    GROUP BY m.name, regexp_replace(lower(o.name), '[^a-z0-9]', '', 'g')
    HAVING count(*) > 1
    ORDER BY count(*) DESC
    LIMIT ${grenze}
  `;

  return zeilen.map((zeile) => ({
    hersteller: zeile.manufacturerName,
    schluessel: zeile.schluessel,
    namen: zeile.namen,
    anzahl: Number(zeile.anzahl),
  }));
}

/** Katalogeintraege, deren letzte Pruefung zu lange her ist. */
export async function ladeUeberfaelligePruefungen(vor: Date, grenze = 50) {
  return prisma.engine.findMany({
    where: {
      status: 'PUBLISHED',
      dataQuality: { in: ['VERIFIED', 'PARTIALLY_VERIFIED'] },
      OR: [{ lastVerifiedAt: null }, { lastVerifiedAt: { lt: vor } }],
    },
    take: grenze,
    orderBy: [{ lastVerifiedAt: 'asc' }],
    select: {
      id: true,
      name: true,
      code: true,
      lastVerifiedAt: true,
      dataQuality: true,
      manufacturer: { select: { name: true } },
    },
  });
}

// ---------------------------------------------------------------------------
// Bilder
// ---------------------------------------------------------------------------

const BILD_AUSWAHL = {
  id: true,
  kind: true,
  generationId: true,
  faceliftPhaseId: true,
  bodyTypeId: true,
  trimLineId: true,
  powertrainId: true,
  specialEditionId: true,
  optionId: true,
  paintColorId: true,
  wheelOptionId: true,
  yearFrom: true,
  yearTo: true,
  origin: true,
  sourceType: true,
  licenceStatus: true,
  background: true,
  dataQuality: true,
  storageKey: true,
  sourceUrl: true,
  sourceTitle: true,
  author: true,
  licence: true,
  licenceUrl: true,
  description: true,
  width: true,
  height: true,
} satisfies Prisma.CatalogImageSelect;

export type KatalogBild = Prisma.CatalogImageGetPayload<{ select: typeof BILD_AUSWAHL }>;

/**
 * Alle veroeffentlichten Bilder einer Generation.
 *
 * Bewusst ALLE und nicht "das passende": Welches passt, entscheidet
 * core/catalog/images.ts anhand der Bindungen -- und diese Entscheidung
 * gehoert nicht in eine SQL-Bedingung, weil sie einen Widerspruch anders
 * behandelt als eine fehlende Angabe. Eine Datenbankabfrage kennt diesen
 * Unterschied nicht.
 */
export async function ladeGenerationsBilder(generationId: string): Promise<KatalogBild[]> {
  return prisma.catalogImage.findMany({
    where: { generationId, ...VEROEFFENTLICHT },
    orderBy: [{ sortIndex: 'asc' }, { createdAt: 'asc' }],
    take: 60,
    select: BILD_AUSWAHL,
  });
}

/** Bilder zu einer Ausstattung -- Felge, Scheinwerfer, Sitz, Display. */
export async function ladeAusstattungsBilder(optionIds: string[]): Promise<KatalogBild[]> {
  if (optionIds.length === 0) return [];
  return prisma.catalogImage.findMany({
    where: { optionId: { in: optionIds.slice(0, 100) }, ...VEROEFFENTLICHT },
    orderBy: [{ sortIndex: 'asc' }],
    take: 200,
    select: BILD_AUSWAHL,
  });
}

// ---------------------------------------------------------------------------
// Sondermodelle, Lackfarben, Radvarianten, Modelljahre
// ---------------------------------------------------------------------------

/**
 * Alles, was eine Generation ausser Motoren und Ausstattung noch hat.
 *
 * In einer Abfrage statt in vieren: Die Generationsseite braucht alles
 * gleichzeitig, und vier Rundreisen zur Datenbank fuer vier Listen sind
 * dreimal zu viel.
 */
export async function ladeGenerationsDetails(generationId: string) {
  const [modelljahre, sondermodelle, lackfarben, raeder] = await Promise.all([
    prisma.modelYear.findMany({
      where: { generationId, ...VEROEFFENTLICHT },
      orderBy: { year: 'asc' },
      take: 40,
      select: {
        id: true,
        year: true,
        changes: true,
        dataQuality: true,
        lastVerifiedAt: true,
        faceliftPhase: { select: { name: true } },
      },
    }),
    prisma.specialEdition.findMany({
      where: { generationId, ...VEROEFFENTLICHT },
      orderBy: [{ yearFrom: 'asc' }, { name: 'asc' }],
      take: 60,
      select: {
        id: true,
        name: true,
        slug: true,
        code: true,
        yearFrom: true,
        yearTo: true,
        buildCount: true,
        marketRegion: true,
        description: true,
        distinguishingFeatures: true,
        dataQuality: true,
        lastVerifiedAt: true,
        faceliftPhase: { select: { name: true } },
        items: {
          take: 30,
          orderBy: { option: { name: 'asc' } },
          select: {
            optional: true,
            option: { select: { id: true, name: true, optionCode: true } },
          },
        },
      },
    }),
    prisma.paintColorAvailability.findMany({
      where: { generationId, paintColor: VEROEFFENTLICHT },
      orderBy: [{ paintColor: { name: 'asc' } }],
      take: 120,
      select: {
        id: true,
        kind: true,
        yearFrom: true,
        yearTo: true,
        surchargeCents: true,
        surchargeCurrency: true,
        surchargeAsOf: true,
        marketRegion: true,
        note: true,
        dataQuality: true,
        lastVerifiedAt: true,
        paintColor: {
          select: {
            id: true,
            name: true,
            code: true,
            kind: true,
            approximateHex: true,
            rarity: true,
          },
        },
      },
    }),
    prisma.wheelOptionAvailability.findMany({
      where: { generationId, wheelOption: VEROEFFENTLICHT },
      orderBy: [{ wheelOption: { diameterInch: 'asc' } }],
      take: 120,
      select: {
        id: true,
        kind: true,
        yearFrom: true,
        yearTo: true,
        surchargeCents: true,
        note: true,
        dataQuality: true,
        lastVerifiedAt: true,
        trimLine: { select: { name: true } },
        wheelOption: {
          select: {
            id: true,
            name: true,
            code: true,
            diameterInch: true,
            widthInch: true,
            tyreSize: true,
            design: true,
            rarity: true,
          },
        },
      },
    }),
  ]);

  return { modelljahre, sondermodelle, lackfarben, raeder };
}

// ---------------------------------------------------------------------------
// Redaktionsarbeitsplatz
// ---------------------------------------------------------------------------

export interface RedaktionsEintrag {
  subject: string;
  subjectLabel: string;
  id: string;
  bezeichnung: string;
  status: string;
  dataQuality: string | null;
  quellen: number;
  updatedAt: Date;
  /** Wohin man springt, um den Eintrag im Katalog zu sehen. */
  kontext: string | null;
}

const SUBJEKT_LABEL: Record<string, string> = {
  manufacturer: 'Marke',
  model: 'Modell',
  generation: 'Generation',
  faceliftPhase: 'Facelift-Phase',
  engine: 'Motor',
  powertrain: 'Antriebskombination',
  trimLine: 'Ausstattungslinie',
  optionalEquipment: 'Ausstattung',
  equipmentPackage: 'Paket',
};

/**
 * Die Arbeitsliste der Redaktion.
 *
 * Zeigt Entwuerfe und eingereichte Eintraege quer ueber alle Arten. Die
 * Quellenzahl steht dabei, weil sie darueber entscheidet, ob sich ein
 * Eintrag ueberhaupt veroeffentlichen laesst -- ohne Quelle geht das nicht,
 * und das soll man sehen, bevor man es versucht.
 */
export async function ladeRedaktionsliste(
  status: 'DRAFT' | 'IN_REVIEW' | 'PUBLISHED' | 'ARCHIVED',
  grenze = 60,
): Promise<RedaktionsEintrag[]> {
  const filter = { status } as const;

  const [marken, modelle, generationen, motoren, antriebe, ausstattungen] = await Promise.all([
    prisma.manufacturer.findMany({
      where: filter,
      take: grenze,
      orderBy: { updatedAt: 'desc' },
      select: { id: true, name: true, slug: true, status: true, updatedAt: true },
    }),
    prisma.model.findMany({
      where: filter,
      take: grenze,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        name: true,
        slug: true,
        status: true,
        updatedAt: true,
        manufacturer: { select: { name: true, slug: true } },
      },
    }),
    prisma.generation.findMany({
      where: filter,
      take: grenze,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        name: true,
        slug: true,
        status: true,
        updatedAt: true,
        dataQuality: true,
        model: {
          select: { name: true, slug: true, manufacturer: { select: { name: true, slug: true } } },
        },
      },
    }),
    prisma.engine.findMany({
      where: filter,
      take: grenze,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        name: true,
        code: true,
        status: true,
        updatedAt: true,
        dataQuality: true,
        manufacturer: { select: { name: true } },
      },
    }),
    prisma.powertrainCombination.findMany({
      where: filter,
      take: grenze,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        status: true,
        updatedAt: true,
        dataQuality: true,
        engine: { select: { name: true } },
        generation: {
          select: {
            name: true,
            slug: true,
            model: {
              select: { name: true, slug: true, manufacturer: { select: { slug: true } } },
            },
          },
        },
      },
    }),
    prisma.optionalEquipment.findMany({
      where: filter,
      take: grenze,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        name: true,
        optionCode: true,
        status: true,
        updatedAt: true,
        dataQuality: true,
        manufacturer: { select: { name: true } },
      },
    }),
  ]);

  const roh: Omit<RedaktionsEintrag, 'quellen' | 'subjectLabel'>[] = [
    ...marken.map((e) => ({
      subject: 'manufacturer',
      id: e.id,
      bezeichnung: e.name,
      status: e.status,
      dataQuality: null,
      updatedAt: e.updatedAt,
      kontext: `/katalog/${e.slug}`,
    })),
    ...modelle.map((e) => ({
      subject: 'model',
      id: e.id,
      bezeichnung: `${e.manufacturer.name} ${e.name}`,
      status: e.status,
      dataQuality: null,
      updatedAt: e.updatedAt,
      kontext: `/katalog/${e.manufacturer.slug}/${e.slug}`,
    })),
    ...generationen.map((e) => ({
      subject: 'generation',
      id: e.id,
      bezeichnung: `${e.model.manufacturer.name} ${e.model.name} · ${e.name}`,
      status: e.status,
      dataQuality: e.dataQuality,
      updatedAt: e.updatedAt,
      kontext: `/katalog/${e.model.manufacturer.slug}/${e.model.slug}/${e.slug}`,
    })),
    ...motoren.map((e) => ({
      subject: 'engine',
      id: e.id,
      bezeichnung: `${e.manufacturer.name} ${e.name}${e.code ? ` (${e.code})` : ''}`,
      status: e.status,
      dataQuality: e.dataQuality,
      updatedAt: e.updatedAt,
      kontext: null,
    })),
    ...antriebe.map((e) => ({
      subject: 'powertrain',
      id: e.id,
      bezeichnung: `${e.generation.model.name} ${e.generation.name} · ${e.engine.name}`,
      status: e.status,
      dataQuality: e.dataQuality,
      updatedAt: e.updatedAt,
      kontext: `/katalog/${e.generation.model.manufacturer.slug}/${e.generation.model.slug}/${e.generation.slug}/motor/${e.id}`,
    })),
    ...ausstattungen.map((e) => ({
      subject: 'optionalEquipment',
      id: e.id,
      bezeichnung: `${e.manufacturer.name} ${e.name}${e.optionCode ? ` (${e.optionCode})` : ''}`,
      status: e.status,
      dataQuality: e.dataQuality,
      updatedAt: e.updatedAt,
      kontext: null,
    })),
  ];

  if (roh.length === 0) return [];

  /*
   * Quellen in EINER Abfrage statt je Eintrag. Bei sechzig Eintraegen waeren
   * das sonst sechzig Rundreisen -- der klassische Weg, eine Verwaltungsseite
   * unbrauchbar langsam zu machen.
   */
  const quellzahlen = await prisma.source.groupBy({
    by: ['subjectType', 'subjectId'],
    where: { subjectId: { in: roh.map((e) => e.id) } },
    _count: { _all: true },
  });

  const nachId = new Map(
    quellzahlen.map((zeile) => [zeile.subjectId, zeile._count._all]),
  );

  return roh
    .map((eintrag) => ({
      ...eintrag,
      subjectLabel: SUBJEKT_LABEL[eintrag.subject] ?? eintrag.subject,
      quellen: nachId.get(eintrag.id) ?? 0,
    }))
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, grenze);
}

/** Wie viele Eintraege je Status warten. Fuer die Reiter der Verwaltung. */
export async function zaehleRedaktionsstatus() {
  const zaehlen = async (status: 'DRAFT' | 'IN_REVIEW' | 'PUBLISHED' | 'ARCHIVED') => {
    const [a, b, c, d, e, f] = await Promise.all([
      prisma.manufacturer.count({ where: { status } }),
      prisma.model.count({ where: { status } }),
      prisma.generation.count({ where: { status } }),
      prisma.engine.count({ where: { status } }),
      prisma.powertrainCombination.count({ where: { status } }),
      prisma.optionalEquipment.count({ where: { status } }),
    ]);
    return a + b + c + d + e + f;
  };

  const [entwurf, pruefung, veroeffentlicht, archiv] = await Promise.all([
    zaehlen('DRAFT'),
    zaehlen('IN_REVIEW'),
    zaehlen('PUBLISHED'),
    zaehlen('ARCHIVED'),
  ]);

  return { DRAFT: entwurf, IN_REVIEW: pruefung, PUBLISHED: veroeffentlicht, ARCHIVED: archiv };
}

// ---------------------------------------------------------------------------
// Gefuehrte Fahrzeugbestimmung
// ---------------------------------------------------------------------------

type AuswahlEbene = 'modelle' | 'generationen' | 'antriebe' | 'linien';

export interface AuswahlOption {
  id: string;
  name: string;
}

export async function katalogAuswahl(
  ebene: AuswahlEbene,
  eltern: string,
): Promise<AuswahlOption[]> {
  switch (ebene) {
    case 'modelle':
      return prisma.model.findMany({
        where: { manufacturerId: eltern, ...VEROEFFENTLICHT },
        orderBy: { name: 'asc' },
        select: { id: true, name: true },
      });

    case 'generationen': {
      const rows = await prisma.generation.findMany({
        where: { modelId: eltern, ...VEROEFFENTLICHT },
        orderBy: { yearFrom: 'desc' },
        select: { id: true, name: true, code: true, yearFrom: true, yearTo: true },
      });
      return rows.map((row) => ({
        id: row.id,
        name: [row.name, row.code, `${row.yearFrom}–${row.yearTo ?? 'heute'}`]
          .filter(Boolean)
          .join(' · '),
      }));
    }

    case 'antriebe': {
      const rows = await prisma.powertrainCombination.findMany({
        where: { generationId: eltern, ...VEROEFFENTLICHT },
        orderBy: { powerKw: 'desc' },
        select: {
          id: true,
          powerKw: true,
          driveType: true,
          engine: { select: { name: true, powerKw: true } },
          transmission: { select: { name: true } },
        },
      });
      return rows.map((row) => ({
        id: row.id,
        name: [
          row.engine.name,
          row.powerKw ?? row.engine.powerKw ? `${row.powerKw ?? row.engine.powerKw} kW` : null,
          row.transmission.name,
        ]
          .filter(Boolean)
          .join(' · '),
      }));
    }

    case 'linien':
      return prisma.trimLine.findMany({
        where: { generationId: eltern, ...VEROEFFENTLICHT },
        orderBy: { name: 'asc' },
        select: { id: true, name: true },
      });
  }
}
