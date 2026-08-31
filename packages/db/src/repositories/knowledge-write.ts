import { type Prisma, prisma } from '../client';

/**
 * Schreibzugriffe auf die Wissensdatenbank.
 *
 * Wie bei den Stammdaten: keine Entscheidungen, nur Schreiben. Alles entsteht
 * als Entwurf; ob es je veroeffentlicht wird, entscheidet der Belegcheck in
 * packages/core.
 */

interface Belege {
  evidenceType: Prisma.KnownIssueCreateInput['evidenceType'];
  confidence: Prisma.KnownIssueCreateInput['confidence'];
  reasoning?: string | undefined;
}

interface MarktBelege extends Belege {
  dataBasis?: string | undefined;
  observedAt?: Date | undefined;
  sampleSize?: number | undefined;
}

export function createKnownIssue(
  data: Belege & {
    generationId: string;
    powertrainId?: string | null | undefined;
    title: string;
    component?: string | undefined;
    severity: Prisma.KnownIssueCreateInput['severity'];
    symptoms?: string | undefined;
    remedy?: string | undefined;
    typicalMileageFromKm?: number | undefined;
    typicalMileageToKm?: number | undefined;
    yearFrom?: number | undefined;
    yearTo?: number | null | undefined;
  },
) {
  return prisma.knownIssue.create({
    data: {
      generationId: data.generationId,
      powertrainId: data.powertrainId ?? null,
      title: data.title,
      component: data.component ?? null,
      severity: data.severity,
      symptoms: data.symptoms ?? null,
      remedy: data.remedy ?? null,
      typicalMileageFromKm: data.typicalMileageFromKm ?? null,
      typicalMileageToKm: data.typicalMileageToKm ?? null,
      yearFrom: data.yearFrom ?? null,
      yearTo: data.yearTo ?? null,
      evidenceType: data.evidenceType,
      confidence: data.confidence,
      reasoning: data.reasoning ?? null,
    },
  });
}

export function createMaintenanceItem(
  data: Belege & {
    generationId: string;
    powertrainId?: string | null | undefined;
    task: string;
    intervalKm?: number | undefined;
    intervalMonths?: number | undefined;
    note?: string | undefined;
  },
) {
  return prisma.maintenanceItem.create({
    data: {
      generationId: data.generationId,
      powertrainId: data.powertrainId ?? null,
      task: data.task,
      intervalKm: data.intervalKm ?? null,
      intervalMonths: data.intervalMonths ?? null,
      note: data.note ?? null,
      evidenceType: data.evidenceType,
      confidence: data.confidence,
      reasoning: data.reasoning ?? null,
    },
  });
}

export function createCostEstimate(
  data: MarktBelege & {
    generationId: string;
    powertrainId?: string | null | undefined;
    category: Prisma.CostEstimateCreateInput['category'];
    label: string;
    amountFromCents?: number | undefined;
    amountToCents?: number | undefined;
    currency: string;
    per?: string | undefined;
    region?: string | undefined;
  },
) {
  return prisma.costEstimate.create({
    data: {
      generationId: data.generationId,
      powertrainId: data.powertrainId ?? null,
      category: data.category,
      label: data.label,
      amountFromCents: data.amountFromCents ?? null,
      amountToCents: data.amountToCents ?? null,
      currency: data.currency,
      per: data.per ?? null,
      region: data.region ?? null,
      evidenceType: data.evidenceType,
      confidence: data.confidence,
      reasoning: data.reasoning ?? null,
      dataBasis: data.dataBasis ?? null,
      observedAt: data.observedAt ?? null,
      sampleSize: data.sampleSize ?? null,
    },
  });
}

export function createKnowledgeNote(
  data: MarktBelege & {
    generationId: string;
    powertrainId?: string | null | undefined;
    topic: Prisma.KnowledgeNoteCreateInput['topic'];
    heading: string;
    body: string;
  },
) {
  return prisma.knowledgeNote.create({
    data: {
      generationId: data.generationId,
      powertrainId: data.powertrainId ?? null,
      topic: data.topic,
      heading: data.heading,
      body: data.body,
      evidenceType: data.evidenceType,
      confidence: data.confidence,
      reasoning: data.reasoning ?? null,
      dataBasis: data.dataBasis ?? null,
      observedAt: data.observedAt ?? null,
      sampleSize: data.sampleSize ?? null,
    },
  });
}

/* ------------------------------------------------------------------------ */

const VEROEFFENTLICHT = { status: 'PUBLISHED' } as const;

/**
 * Alle veroeffentlichten Wissensinhalte einer Generation.
 *
 * Schwachstellen kommen nach Schwere sortiert -- wer ein Auto kauft, will
 * zuerst wissen, was teuer werden kann.
 */
export async function findPublishedKnowledge(generationId: string) {
  const [issues, maintenance, costs, notes] = await Promise.all([
    prisma.knownIssue.findMany({
                        /* Obergrenze, damit eine wachsende Tabelle nicht irgendwann eine
                           Antwort erzeugt, die niemand mehr liest -- und die den Speicher
                           fuellt, bevor jemand es merkt. */
                        take: 500,
      where: { generationId, ...VEROEFFENTLICHT },
      orderBy: [{ severity: 'asc' }, { title: 'asc' }],
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
        yearFrom: true,
        yearTo: true,
        evidenceType: true,
        confidence: true,
        reasoning: true,
        powertrainId: true,
      },
    }),
    prisma.maintenanceItem.findMany({
                             /* Obergrenze, damit eine wachsende Tabelle nicht irgendwann eine
                                Antwort erzeugt, die niemand mehr liest -- und die den Speicher
                                fuellt, bevor jemand es merkt. */
                             take: 500,
      where: { generationId, ...VEROEFFENTLICHT },
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
        powertrainId: true,
      },
    }),
    prisma.costEstimate.findMany({
                          /* Obergrenze, damit eine wachsende Tabelle nicht irgendwann eine
                             Antwort erzeugt, die niemand mehr liest -- und die den Speicher
                             fuellt, bevor jemand es merkt. */
                          take: 500,
      where: { generationId, ...VEROEFFENTLICHT },
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
        powertrainId: true,
      },
    }),
    prisma.knowledgeNote.findMany({
                           /* Obergrenze, damit eine wachsende Tabelle nicht irgendwann eine
                              Antwort erzeugt, die niemand mehr liest -- und die den Speicher
                              fuellt, bevor jemand es merkt. */
                           take: 500,
      where: { generationId, ...VEROEFFENTLICHT },
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
        powertrainId: true,
      },
    }),
  ]);

  return { issues, maintenance, costs, notes };
}
