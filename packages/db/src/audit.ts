import type { AuditEvent, AuditLogger } from '@ap/core';

import { prisma } from './client';

/**
 * Audit-Log in der Datenbank.
 *
 * Bewusst fehlertolerant: Ein fehlgeschlagener Audit-Eintrag darf den
 * fachlichen Vorgang nicht abbrechen. Er wird protokolliert, nicht geworfen --
 * sonst scheitert eine Anmeldung daran, dass das Log klemmt.
 *
 * Fuer Vorgaenge, bei denen der Nachweis zwingend ist (Guthabenbuchungen),
 * wird der Eintrag stattdessen innerhalb derselben Transaktion geschrieben.
 * Dafuer ist `recordInTransaction` vorgesehen.
 */
export class PrismaAuditLogger implements AuditLogger {
  async record(event: AuditEvent): Promise<void> {
    try {
      await prisma.auditLog.create({
        data: {
          action: event.action,
          actorId: event.actorId,
          subjectType: event.subjectType,
          subjectId: event.subjectId,
          metadata: event.metadata ?? undefined,
          ipHash: event.ipHash ?? null,
        },
      });
    } catch (error) {
      console.error('[audit] Eintrag konnte nicht geschrieben werden', {
        action: event.action,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}

export const auditLogger = new PrismaAuditLogger();
