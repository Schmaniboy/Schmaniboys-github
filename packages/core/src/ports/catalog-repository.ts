import type { ConfidenceLevel, EvidenceType } from '../catalog/evidence';
import type { EditorialStatus } from '../catalog/publishing';

/**
 * Persistenz des Katalogs, soweit die Domaenenschicht sie braucht.
 *
 * Die Schnittstelle ist bewusst schmal: Sie deckt nur das ab, worueber hier
 * entschieden wird -- Redaktionsstand und Quellen. Das gewoehnliche Anlegen
 * und Aendern der Katalogtabellen liegt in `packages/db` und wird von den
 * Route Handlern nach der Rechtepruefung aufgerufen.
 */

/** Die Katalogtabellen, die einen Redaktionsstand fuehren. */
export const CatalogSubject = {
  MANUFACTURER: 'manufacturer',
  MODEL: 'model',
  GENERATION: 'generation',
  FACELIFT_PHASE: 'faceliftPhase',
  ENGINE: 'engine',
  POWERTRAIN: 'powertrain',
  TRIM_LINE: 'trimLine',
  OPTIONAL_EQUIPMENT: 'optionalEquipment',
  EQUIPMENT_PACKAGE: 'equipmentPackage',
  // Wissensaussagen (Phase 3). Sie fuehren zusaetzlich ein Belegmodell.
  KNOWN_ISSUE: 'knownIssue',
  MAINTENANCE_ITEM: 'maintenanceItem',
  COST_ESTIMATE: 'costEstimate',
  KNOWLEDGE_NOTE: 'knowledgeNote',
} as const;

export type CatalogSubject = (typeof CatalogSubject)[keyof typeof CatalogSubject];

export const ALL_CATALOG_SUBJECTS: readonly CatalogSubject[] = Object.values(CatalogSubject);

export interface SourceRecord {
  id: string;
  kind: string;
  title: string;
  url: string | null;
  publishedOn: Date | null;
  checkedAt: Date;
  note: string | null;
  /** Welche Werte diese Quelle deckt. Leer heisst: den ganzen Eintrag. */
  coversFields: string[];
}

/**
 * Katalogtypen, die eine Wissensaussage tragen und deshalb zusaetzlich das
 * Belegmodell erfuellen muessen.
 */
export const KNOWLEDGE_SUBJECTS: readonly CatalogSubject[] = [
  'knownIssue',
  'maintenanceItem',
  'costEstimate',
  'knowledgeNote',
];

export function isKnowledgeSubject(subject: CatalogSubject): boolean {
  return KNOWLEDGE_SUBJECTS.includes(subject);
}

export interface CatalogRepository {
  /** Aktueller Redaktionsstand, oder null wenn es den Eintrag nicht gibt. */
  findStatus(subject: CatalogSubject, id: string): Promise<EditorialStatus | null>;

  setStatus(
    subject: CatalogSubject,
    id: string,
    status: EditorialStatus,
    publishedAt: Date | null,
  ): Promise<void>;

  countSources(subject: CatalogSubject, id: string): Promise<number>;

  listSources(subject: CatalogSubject, id: string): Promise<SourceRecord[]>;

  addSource(
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
  ): Promise<SourceRecord>;

  removeSource(sourceId: string): Promise<void>;

  /**
   * Belegangaben einer Wissensaussage. Gibt null zurueck, wenn der Typ kein
   * Belegmodell fuehrt oder der Eintrag nicht existiert.
   */
  findEvidence(subject: CatalogSubject, id: string): Promise<StoredEvidence | null>;
}

export interface StoredEvidence {
  evidenceType: EvidenceType;
  confidence: ConfidenceLevel;
  reasoning: string | null;
  dataBasis: string | null;
  observedAt: Date | null;
  sampleSize: number | null;
}
