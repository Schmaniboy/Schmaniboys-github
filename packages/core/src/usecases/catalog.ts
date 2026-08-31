import { Permission } from '../auth/roles';
import { requirePermission, type Principal } from '../auth/access';
import {
  EditorialStatus,
  assertTransition,
  STATUS_LABELS,
} from '../catalog/publishing';
import { sourceInput, statusChangeInput } from '../catalog/schemas';
import { errors } from '../errors';
import type { AuditLogger } from '../ports/audit';
import type { Clock } from '../ports/clock';
import {
  type CatalogRepository,
  type CatalogSubject,
  type SourceRecord,
  isKnowledgeSubject,
} from '../ports/catalog-repository';
import { assertEvidenceSufficient } from '../catalog/evidence';
import { parseOrThrow } from '../validation/common';

/**
 * Redaktionsvorgaenge am Katalog.
 *
 * Hier steht die Regel, die den Unterschied zwischen einer Wissensplattform
 * und einer Sammlung von Behauptungen ausmacht: Veroeffentlicht wird nur, was
 * eine Quelle hat.
 */

export interface CatalogDeps {
  catalog: CatalogRepository;
  clock: Clock;
  audit: AuditLogger;
}

/** Erfassen und Aendern von Stammdaten. */
export function assertMayEditCatalog(principal: Principal | null): Principal {
  return requirePermission(principal, Permission.CATALOG_WRITE);
}

/** Freigeben und Zurueckziehen. Bewusst ein eigenes Recht. */
export function assertMayPublishCatalog(principal: Principal | null): Principal {
  return requirePermission(principal, Permission.CATALOG_PUBLISH);
}

export async function changeStatus(
  deps: CatalogDeps,
  principal: Principal | null,
  subject: CatalogSubject,
  id: string,
  rawInput: unknown,
): Promise<{ status: EditorialStatus }> {
  const { status: ziel } = parseOrThrow(statusChangeInput, rawInput);

  /*
   * Zwei getrennte Rechte, weil Erfassen und Freigeben getrennte Taetigkeiten
   * sind (Blocker B3). Wer nur erfassen darf, kann einen Eintrag zur Pruefung
   * stellen, aber nicht selbst freigeben.
   */
  const handelnde =
    ziel === EditorialStatus.PUBLISHED || ziel === EditorialStatus.ARCHIVED
      ? assertMayPublishCatalog(principal)
      : assertMayEditCatalog(principal);

  const aktuell = await deps.catalog.findStatus(subject, id);
  if (!aktuell) throw errors.notFound('Dieser Katalogeintrag existiert nicht.');

  const sourceCount = await deps.catalog.countSources(subject, id);
  assertTransition({ from: aktuell, to: ziel, sourceCount });

  /*
   * Fuer Wissensaussagen genuegt eine Quelle allein nicht. Je nach Belegmodell
   * braucht es eine belastbare Quellenart, eine Begruendung oder eine
   * Datengrundlage mit Stichtag. Diese Pruefung ist strenger als die
   * allgemeine Quellenpflicht, nicht anders.
   */
  if (ziel === EditorialStatus.PUBLISHED && isKnowledgeSubject(subject)) {
    const evidence = await deps.catalog.findEvidence(subject, id);
    if (!evidence) {
      throw errors.conflict('Zu dieser Aussage fehlt das Belegmodell.');
    }
    const quellen = await deps.catalog.listSources(subject, id);
    assertEvidenceSufficient({
      ...evidence,
      sourceKinds: quellen.map((quelle) => quelle.kind),
    });
  }

  const publishedAt = ziel === EditorialStatus.PUBLISHED ? deps.clock.now() : null;
  await deps.catalog.setStatus(subject, id, ziel, publishedAt);

  await deps.audit.record({
    action: ziel === EditorialStatus.PUBLISHED ? 'catalog.published' : 'catalog.updated',
    actorId: handelnde.userId,
    subjectType: subject,
    subjectId: id,
    metadata: { von: STATUS_LABELS[aktuell], nach: STATUS_LABELS[ziel], quellen: sourceCount },
  });

  return { status: ziel };
}

export async function addSource(
  deps: CatalogDeps,
  principal: Principal | null,
  subject: CatalogSubject,
  id: string,
  rawInput: unknown,
): Promise<SourceRecord> {
  const handelnde = assertMayEditCatalog(principal);
  const input = parseOrThrow(sourceInput, rawInput);

  const aktuell = await deps.catalog.findStatus(subject, id);
  if (!aktuell) throw errors.notFound('Dieser Katalogeintrag existiert nicht.');

  const gespeichert = await deps.catalog.addSource(subject, id, {
    kind: input.kind,
    title: input.title,
    url: input.url,
    publishedOn: input.publishedOn,
    note: input.note,
    checkedAt: deps.clock.now(),
    coversFields: input.coversFields,
  });

  await deps.audit.record({
    action: 'catalog.updated',
    actorId: handelnde.userId,
    subjectType: subject,
    subjectId: id,
    metadata: { quelle: 'hinzugefuegt', titel: input.title },
  });

  return gespeichert;
}

/**
 * Entfernt eine Quelle -- aber nicht die letzte eines veroeffentlichten
 * Eintrags. Sonst staende eine veroeffentlichte Angabe ohne Herkunft da, und
 * genau das soll der Ablauf verhindern.
 */
export async function removeSource(
  deps: CatalogDeps,
  principal: Principal | null,
  subject: CatalogSubject,
  id: string,
  sourceId: string,
): Promise<void> {
  const handelnde = assertMayEditCatalog(principal);

  const aktuell = await deps.catalog.findStatus(subject, id);
  if (!aktuell) throw errors.notFound('Dieser Katalogeintrag existiert nicht.');

  if (aktuell === EditorialStatus.PUBLISHED) {
    const verbleibend = (await deps.catalog.countSources(subject, id)) - 1;
    if (verbleibend < 1) {
      throw errors.conflict(
        'Das waere die letzte Quelle eines veroeffentlichten Eintrags. ' +
          'Bitte zuerst eine andere Quelle hinterlegen oder den Eintrag zurueckziehen.',
      );
    }
  }

  await deps.catalog.removeSource(sourceId);

  await deps.audit.record({
    action: 'catalog.updated',
    actorId: handelnde.userId,
    subjectType: subject,
    subjectId: id,
    metadata: { quelle: 'entfernt' },
  });
}
