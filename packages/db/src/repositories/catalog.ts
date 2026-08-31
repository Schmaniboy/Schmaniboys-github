import {
  type CatalogRepository,
  CatalogSubject,
  type EditorialStatus,
  type SourceRecord,
  type StoredEvidence,
  errors,
  isKnowledgeSubject,
} from '@ap/core';

import { prisma } from '../client';

/**
 * Katalogzugriff.
 *
 * Der Redaktionsstand liegt in neun Tabellen mit gleicher Struktur. Statt
 * neunmal denselben Code zu schreiben, gibt es eine Zuordnung von Fachbegriff
 * auf Prisma-Delegate. Die Zuordnung ist vollstaendig typisiert -- ein neuer
 * Katalogtyp ohne Eintrag hier faellt beim Uebersetzen auf.
 */

interface StatusDelegate {
  findUnique(args: {
    where: { id: string };
    select: { status: true };
  }): Promise<{ status: EditorialStatus } | null>;
  update(args: {
    where: { id: string };
    data: { status: EditorialStatus; publishedAt: Date | null };
  }): Promise<unknown>;
}

function delegateFor(subject: CatalogSubject): StatusDelegate {
  switch (subject) {
    case CatalogSubject.MANUFACTURER:
      return prisma.manufacturer as unknown as StatusDelegate;
    case CatalogSubject.MODEL:
      return prisma.model as unknown as StatusDelegate;
    case CatalogSubject.GENERATION:
      return prisma.generation as unknown as StatusDelegate;
    case CatalogSubject.FACELIFT_PHASE:
      return prisma.faceliftPhase as unknown as StatusDelegate;
    case CatalogSubject.ENGINE:
      return prisma.engine as unknown as StatusDelegate;
    case CatalogSubject.POWERTRAIN:
      return prisma.powertrainCombination as unknown as StatusDelegate;
    case CatalogSubject.TRIM_LINE:
      return prisma.trimLine as unknown as StatusDelegate;
    case CatalogSubject.OPTIONAL_EQUIPMENT:
      return prisma.optionalEquipment as unknown as StatusDelegate;
    case CatalogSubject.EQUIPMENT_PACKAGE:
      return prisma.equipmentPackage as unknown as StatusDelegate;
    case CatalogSubject.KNOWN_ISSUE:
      return prisma.knownIssue as unknown as StatusDelegate;
    case CatalogSubject.MAINTENANCE_ITEM:
      return prisma.maintenanceItem as unknown as StatusDelegate;
    case CatalogSubject.COST_ESTIMATE:
      return prisma.costEstimate as unknown as StatusDelegate;
    case CatalogSubject.KNOWLEDGE_NOTE:
      return prisma.knowledgeNote as unknown as StatusDelegate;
  }
}

export class PrismaCatalogRepository implements CatalogRepository {
  async findStatus(subject: CatalogSubject, id: string): Promise<EditorialStatus | null> {
    const row = await delegateFor(subject).findUnique({
      where: { id },
      select: { status: true },
    });
    return row?.status ?? null;
  }

  async setStatus(
    subject: CatalogSubject,
    id: string,
    status: EditorialStatus,
    publishedAt: Date | null,
  ): Promise<void> {
    await delegateFor(subject).update({ where: { id }, data: { status, publishedAt } });
  }

  async countSources(subject: CatalogSubject, id: string): Promise<number> {
    return prisma.source.count({ where: { subjectType: subject, subjectId: id } });
  }

  async listSources(subject: CatalogSubject, id: string): Promise<SourceRecord[]> {
    const rows = await prisma.source.findMany({
                                       /* Obergrenze, damit eine wachsende Tabelle nicht irgendwann eine
                                          Antwort erzeugt, die niemand mehr liest -- und die den Speicher
                                          fuellt, bevor jemand es merkt. */
                                       take: 500,
      where: { subjectType: subject, subjectId: id },
      orderBy: { checkedAt: 'desc' },
    });
    return rows.map(toSourceRecord);
  }

  async addSource(
    subject: CatalogSubject,
    id: string,
    source: {
      kind: string;
      title: string;
      url?: string | undefined;
      publishedOn?: Date | undefined;
      note?: string | undefined;
      checkedAt: Date;
      coversFields: string[];
    },
  ): Promise<SourceRecord> {
    const row = await prisma.source.create({
      data: {
        subjectType: subject,
        subjectId: id,
        kind: source.kind as never,
        title: source.title,
        url: source.url ?? null,
        publishedOn: source.publishedOn ?? null,
        note: source.note ?? null,
        checkedAt: source.checkedAt,
        coversFields: source.coversFields,
      },
    });
    return toSourceRecord(row);
  }

  async removeSource(sourceId: string): Promise<void> {
    await prisma.source.deleteMany({ where: { id: sourceId } });
  }

  /**
   * Belegangaben einer Wissensaussage.
   *
   * Die vier Wissenstabellen fuehren dieselben Belegfelder. Die Auswahl ist
   * deshalb identisch -- nur die Tabelle wechselt.
   */
  async findEvidence(subject: CatalogSubject, id: string): Promise<StoredEvidence | null> {
    if (!isKnowledgeSubject(subject)) return null;

    const auswahl = {
      where: { id },
      select: {
        evidenceType: true,
        confidence: true,
        reasoning: true,
        dataBasis: true,
        observedAt: true,
        sampleSize: true,
      },
    };

    switch (subject) {
      case CatalogSubject.KNOWN_ISSUE: {
        const row = await prisma.knownIssue.findUnique({
          where: { id },
          select: { evidenceType: true, confidence: true, reasoning: true },
        });
        return row
          ? { ...row, dataBasis: null, observedAt: null, sampleSize: null }
          : null;
      }
      case CatalogSubject.MAINTENANCE_ITEM: {
        const row = await prisma.maintenanceItem.findUnique({
          where: { id },
          select: { evidenceType: true, confidence: true, reasoning: true },
        });
        return row
          ? { ...row, dataBasis: null, observedAt: null, sampleSize: null }
          : null;
      }
      case CatalogSubject.COST_ESTIMATE:
        return prisma.costEstimate.findUnique(auswahl);
      case CatalogSubject.KNOWLEDGE_NOTE:
        return prisma.knowledgeNote.findUnique(auswahl);
      default:
        return null;
    }
  }
}

export const catalogRepository = new PrismaCatalogRepository();

function toSourceRecord(row: {
  id: string;
  kind: string;
  title: string;
  url: string | null;
  publishedOn: Date | null;
  checkedAt: Date;
  note: string | null;
  coversFields: string[];
}): SourceRecord {
  return {
    id: row.id,
    kind: row.kind,
    title: row.title,
    url: row.url,
    publishedOn: row.publishedOn,
    checkedAt: row.checkedAt,
    note: row.note,
    coversFields: row.coversFields,
  };
}

/* -------------------------------------------------------------------------
 * Oeffentliche Leseabfragen
 *
 * Alle filtern auf PUBLISHED. Ein Entwurf darf ueber keinen oeffentlichen
 * Weg sichtbar werden -- deshalb steht der Filter hier und nicht in der
 * Oberflaeche, wo er vergessen werden koennte.
 * ---------------------------------------------------------------------- */

const NUR_VEROEFFENTLICHT = { status: 'PUBLISHED' } as const;

export async function listPublishedManufacturers() {
  return prisma.manufacturer.findMany({
                               /* Obergrenze, damit eine wachsende Tabelle nicht irgendwann eine
                                  Antwort erzeugt, die niemand mehr liest -- und die den Speicher
                                  fuellt, bevor jemand es merkt. */
                               take: 500,
    where: NUR_VEROEFFENTLICHT,
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      slug: true,
      country: true,
      logoUrl: true,
      _count: { select: { models: { where: NUR_VEROEFFENTLICHT } } },
    },
  });
}

export async function findPublishedManufacturer(slug: string) {
  return prisma.manufacturer.findFirst({
    where: { slug, ...NUR_VEROEFFENTLICHT },
    select: {
      id: true,
      name: true,
      slug: true,
      country: true,
      wmiCodes: true,
      models: {
        where: NUR_VEROEFFENTLICHT,
        orderBy: { name: 'asc' },
        select: {
          id: true,
          name: true,
          slug: true,
          _count: { select: { generations: { where: NUR_VEROEFFENTLICHT } } },
        },
      },
    },
  });
}

export async function findPublishedModel(manufacturerSlug: string, modelSlug: string) {
  return prisma.model.findFirst({
    where: {
      slug: modelSlug,
      ...NUR_VEROEFFENTLICHT,
      manufacturer: { slug: manufacturerSlug, ...NUR_VEROEFFENTLICHT },
    },
    select: {
      id: true,
      name: true,
      slug: true,
      manufacturer: { select: { name: true, slug: true } },
      generations: {
        where: NUR_VEROEFFENTLICHT,
        orderBy: { yearFrom: 'desc' },
        select: {
          id: true,
          name: true,
          code: true,
          slug: true,
          yearFrom: true,
          yearTo: true,
          bodyType: { select: { name: true } },
          _count: { select: { powertrains: { where: NUR_VEROEFFENTLICHT } } },
        },
      },
    },
  });
}

export async function findPublishedGeneration(
  manufacturerSlug: string,
  modelSlug: string,
  generationSlug: string,
) {
  return prisma.generation.findFirst({
    where: {
      slug: generationSlug,
      ...NUR_VEROEFFENTLICHT,
      model: {
        slug: modelSlug,
        ...NUR_VEROEFFENTLICHT,
        manufacturer: { slug: manufacturerSlug, ...NUR_VEROEFFENTLICHT },
      },
    },
    select: {
      id: true,
      name: true,
      code: true,
      slug: true,
      yearFrom: true,
      yearTo: true,
      bodyType: { select: { name: true } },
      model: {
        select: { name: true, slug: true, manufacturer: { select: { name: true, slug: true } } },
      },
      faceliftPhases: {
        where: NUR_VEROEFFENTLICHT,
        orderBy: { yearFrom: 'asc' },
        select: {
          id: true,
          name: true,
          yearFrom: true,
          yearTo: true,
          distinguishingFeatures: true,
        },
      },
      powertrains: {
        where: NUR_VEROEFFENTLICHT,
        orderBy: [{ powerKw: 'desc' }],
        select: {
          id: true,
          driveType: true,
          powerKw: true,
          torqueNm: true,
          acceleration0to100: true,
          topSpeedKmh: true,
          consumptionCombined: true,
          consumptionUnit: true,
          co2CombinedGramPerKm: true,
          measurementStandard: true,
          kerbWeightKg: true,
          batteryCapacityKwh: true,
          fuelTankLitres: true,
          electricRangeKm: true,
          emissionStandard: true,
          seats: true,
          doors: true,
          payloadKg: true,
          towingCapacityBrakedKg: true,
          towingCapacityUnbrakedKg: true,
          yearFrom: true,
          yearTo: true,
          engine: {
            select: {
              id: true,
              name: true,
              code: true,
              fuelType: true,
              aspiration: true,
              displacementCcm: true,
              cylinders: true,
            },
          },
          transmission: { select: { name: true, type: true, gears: true } },
        },
      },
      trimLines: {
        where: NUR_VEROEFFENTLICHT,
        orderBy: { name: 'asc' },
        select: { id: true, name: true, slug: true, description: true, yearFrom: true, yearTo: true },
      },
    },
  });
}

/**
 * Eine einzelne Antriebskombination mit allem, was ihre Seite braucht.
 *
 * Die Pfadbestandteile werden mitgeprueft: Wer die Kennung einer Variante
 * kennt, soll sie nicht unter einem beliebigen Modell aufrufen koennen --
 * das erzeugte sonst zwei Adressen fuer denselben Inhalt.
 */
export async function findPublishedPowertrain(
  manufacturerSlug: string,
  modelSlug: string,
  generationSlug: string,
  powertrainId: string,
) {
  return prisma.powertrainCombination.findFirst({
    where: {
      id: powertrainId,
      ...NUR_VEROEFFENTLICHT,
      generation: {
        slug: generationSlug,
        ...NUR_VEROEFFENTLICHT,
        model: {
          slug: modelSlug,
          ...NUR_VEROEFFENTLICHT,
          manufacturer: { slug: manufacturerSlug, ...NUR_VEROEFFENTLICHT },
        },
      },
    },
    select: {
      id: true,
      driveType: true,
      powerKw: true,
      torqueNm: true,
      acceleration0to100: true,
      topSpeedKmh: true,
      consumptionCombined: true,
      consumptionUnit: true,
      co2CombinedGramPerKm: true,
      measurementStandard: true,
      kerbWeightKg: true,
      payloadKg: true,
      batteryCapacityKwh: true,
      electricRangeKm: true,
      fuelTankLitres: true,
      emissionStandard: true,
      seats: true,
      doors: true,
      towingCapacityBrakedKg: true,
      towingCapacityUnbrakedKg: true,
      yearFrom: true,
      yearTo: true,
      engine: {
        select: {
          id: true,
          name: true,
          code: true,
          fuelType: true,
          aspiration: true,
          displacementCcm: true,
          cylinders: true,
          powerKw: true,
          torqueNm: true,
        },
      },
      transmission: { select: { name: true, type: true, gears: true } },
      generation: {
        select: {
          id: true,
          name: true,
          code: true,
          slug: true,
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
    },
  });
}

/**
 * Wissensinhalte, die genau eine Antriebskombination betreffen.
 *
 * "Der Diesel hat Probleme mit der Steuerkette" ist eine andere Aussage als
 * "die Baureihe rostet" -- deshalb wird hier nur das Erstere geladen.
 */
export async function findPowertrainKnowledge(powertrainId: string) {
  const [issues, maintenance, costs, notes] = await Promise.all([
    prisma.knownIssue.findMany({
                        /* Obergrenze, damit eine wachsende Tabelle nicht irgendwann eine
                           Antwort erzeugt, die niemand mehr liest -- und die den Speicher
                           fuellt, bevor jemand es merkt. */
                        take: 500,
      where: { powertrainId, ...NUR_VEROEFFENTLICHT },
      orderBy: [{ severity: 'asc' }],
      select: {
        id: true,
        title: true,
        component: true,
        severity: true,
        symptoms: true,
        remedy: true,
        typicalMileageFromKm: true,
        typicalMileageToKm: true,
        resolvedFromYear: true,
        resolvedHowToIdentify: true,
        evidenceType: true,
        confidence: true,
        reasoning: true,
      },
    }),
    prisma.maintenanceItem.findMany({
                             /* Obergrenze, damit eine wachsende Tabelle nicht irgendwann eine
                                Antwort erzeugt, die niemand mehr liest -- und die den Speicher
                                fuellt, bevor jemand es merkt. */
                             take: 500,
      where: { powertrainId, ...NUR_VEROEFFENTLICHT },
      orderBy: { task: 'asc' },
      select: {
        id: true,
        task: true,
        intervalKm: true,
        intervalMonths: true,
        note: true,
        evidenceType: true,
        confidence: true,
        reasoning: true,
      },
    }),
    prisma.costEstimate.findMany({
                          /* Obergrenze, damit eine wachsende Tabelle nicht irgendwann eine
                             Antwort erzeugt, die niemand mehr liest -- und die den Speicher
                             fuellt, bevor jemand es merkt. */
                          take: 500,
      where: { powertrainId, ...NUR_VEROEFFENTLICHT },
      orderBy: { category: 'asc' },
      select: {
        id: true,
        category: true,
        label: true,
        amountFromCents: true,
        amountToCents: true,
        currency: true,
        per: true,
        region: true,
        evidenceType: true,
        confidence: true,
        reasoning: true,
        dataBasis: true,
        observedAt: true,
        sampleSize: true,
      },
    }),
    prisma.knowledgeNote.findMany({
                           /* Obergrenze, damit eine wachsende Tabelle nicht irgendwann eine
                              Antwort erzeugt, die niemand mehr liest -- und die den Speicher
                              fuellt, bevor jemand es merkt. */
                           take: 500,
      where: { powertrainId, ...NUR_VEROEFFENTLICHT },
      orderBy: { topic: 'asc' },
      select: {
        id: true,
        topic: true,
        heading: true,
        body: true,
        evidenceType: true,
        confidence: true,
        reasoning: true,
        dataBasis: true,
        observedAt: true,
        sampleSize: true,
      },
    }),
  ]);

  return { issues, maintenance, costs, notes };
}

/**
 * Ausstattung einer Generation: Linien, Pakete und die Verfuegbarkeitsmatrix.
 *
 * Die Matrix ist der Kern: Eine Sonderausstattung kann serienmaessig, gegen
 * Aufpreis oder nur im Paket zu haben sein -- und das je nach Baujahr,
 * Ausstattungslinie und Motorvariante verschieden. Genau das macht sie beim
 * Gebrauchtkauf schwer nachvollziehbar, und genau deshalb wird es hier
 * ausgeschrieben statt zusammengefasst.
 */
export async function findGenerationEquipment(
  manufacturerSlug: string,
  modelSlug: string,
  generationSlug: string,
) {
  const generation = await prisma.generation.findFirst({
    where: {
      slug: generationSlug,
      ...NUR_VEROEFFENTLICHT,
      model: {
        slug: modelSlug,
        ...NUR_VEROEFFENTLICHT,
        manufacturer: { slug: manufacturerSlug, ...NUR_VEROEFFENTLICHT },
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
      trimLines: {
        where: NUR_VEROEFFENTLICHT,
        orderBy: { name: 'asc' },
        select: { id: true, name: true, description: true, yearFrom: true, yearTo: true },
      },
      packages: {
        where: NUR_VEROEFFENTLICHT,
        orderBy: { name: 'asc' },
        select: {
          id: true,
          name: true,
          packageCode: true,
          description: true,
          items: {
            orderBy: { option: { name: 'asc' } },
            select: {
              id: true,
              optional: true,
              option: {
                select: { id: true, name: true, optionCode: true, category: true },
              },
            },
          },
        },
      },
    },
  });

  if (!generation) return null;

  const availability = await prisma.optionAvailability.findMany({
                                                         /* Obergrenze, damit eine wachsende Tabelle nicht irgendwann eine
                                                            Antwort erzeugt, die niemand mehr liest -- und die den Speicher
                                                            fuellt, bevor jemand es merkt. */
                                                         take: 500,
    where: {
      generationId: generation.id,
      // Eine Verfuegbarkeit ohne veroeffentlichte Ausstattung waere ein
      // Verweis ins Leere.
      option: NUR_VEROEFFENTLICHT,
    },
    orderBy: [{ option: { category: 'asc' } }, { option: { name: 'asc' } }],
    select: {
      id: true,
      kind: true,
      yearFrom: true,
      yearTo: true,
      modelYearFrom: true,
      modelYearTo: true,
      marketRegion: true,
      surchargeCents: true,
      surchargeCurrency: true,
      surchargeAsOf: true,
      surchargeSourceType: true,
      surchargeSourceRef: true,
      surchargeSourceDate: true,
      surchargeSourceNote: true,
      dataQuality: true,
      lastVerifiedAt: true,
      note: true,
      specialEdition: { select: { id: true, name: true, slug: true } },
      faceliftPhase: { select: { id: true, name: true } },
      trimLine: { select: { id: true, name: true } },
      powertrain: {
        select: { id: true, engine: { select: { name: true } } },
      },
      package: { select: { id: true, name: true } },
      option: {
        select: {
          id: true,
          name: true,
          slug: true,
          optionCode: true,
          category: true,
          description: true,
          howToIdentify: true,
          rarity: true,
          purchaseRelevance: true,
          resaleRelevance: true,
          relevanceEvidenceType: true,
          relevanceConfidence: true,
          relevanceReasoning: true,
          relevanceDataBasis: true,
          relevanceObservedAt: true,
          relevanceSampleSize: true,
        },
      },
    },
  });

  return { generation, availability };
}

/** Quellen mehrerer Eintraege auf einmal -- fuer Detailseiten. */
export async function listSourcesFor(subjectType: CatalogSubject, subjectIds: string[]) {
  if (subjectIds.length === 0) return [];
  return prisma.source.findMany({
                         /* Obergrenze, damit eine wachsende Tabelle nicht irgendwann eine
                            Antwort erzeugt, die niemand mehr liest -- und die den Speicher
                            fuellt, bevor jemand es merkt. */
                         take: 500,
    where: { subjectType, subjectId: { in: subjectIds } },
    orderBy: { checkedAt: 'desc' },
    select: {
      id: true,
      subjectId: true,
      kind: true,
      title: true,
      url: true,
      publishedOn: true,
      checkedAt: true,
      coversFields: true,
    },
  });
}

/**
 * Quellenarten je Eintrag, als Zuordnung.
 *
 * Wird gebraucht, um die Guete einer belegten Angabe richtig anzuzeigen: Ohne
 * belastbare Quellenart gilt sie als schwach belegt. Die Quellenarten dafuer
 * zu erfinden waere genau der Fehler, den die ganze Belegpflicht verhindert.
 */
export async function listSourceKindsFor(
  subjectType: CatalogSubject,
  subjectIds: string[],
): Promise<Map<string, string[]>> {
  const zuordnung = new Map<string, string[]>();
  if (subjectIds.length === 0) return zuordnung;

  const rows = await prisma.source.findMany({
                                     /* Obergrenze, damit eine wachsende Tabelle nicht irgendwann eine
                                        Antwort erzeugt, die niemand mehr liest -- und die den Speicher
                                        fuellt, bevor jemand es merkt. */
                                     take: 500,
    where: { subjectType, subjectId: { in: subjectIds } },
    select: { subjectId: true, kind: true },
  });

  for (const row of rows) {
    zuordnung.set(row.subjectId, [...(zuordnung.get(row.subjectId) ?? []), row.kind]);
  }
  return zuordnung;
}

/**
 * Sucht im veroeffentlichten Katalog.
 * Bewusst einfach gehalten: Die richtige Suche entsteht in Phase 4.
 */
export async function searchPublishedCatalog(query: string, limit = 20) {
  const suchbegriff = query.trim();
  if (suchbegriff.length < 2) return { manufacturers: [], models: [] };

  const [manufacturers, models] = await Promise.all([
    prisma.manufacturer.findMany({
      where: { ...NUR_VEROEFFENTLICHT, name: { contains: suchbegriff, mode: 'insensitive' } },
      take: limit,
      orderBy: { name: 'asc' },
      select: { id: true, name: true, slug: true },
    }),
    prisma.model.findMany({
      where: {
        ...NUR_VEROEFFENTLICHT,
        name: { contains: suchbegriff, mode: 'insensitive' },
        manufacturer: NUR_VEROEFFENTLICHT,
      },
      take: limit,
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        manufacturer: { select: { name: true, slug: true } },
      },
    }),
  ]);

  return { manufacturers, models };
}

/** Wirft, wenn ein Fremdschluessel ins Leere zeigt -- mit klarer Meldung. */
export async function assertExists(
  subject: CatalogSubject,
  id: string,
  bezeichnung: string,
): Promise<void> {
  const row = await delegateFor(subject).findUnique({ where: { id }, select: { status: true } });
  if (!row) throw errors.validation({ [bezeichnung]: ['Dieser Eintrag existiert nicht.'] });
}
