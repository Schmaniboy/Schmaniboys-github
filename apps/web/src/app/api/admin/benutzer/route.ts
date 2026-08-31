import { z } from 'zod';

import {
  Permission,
  Role,
  errors,
  assertRollenwechselErlaubt,
  assertSperrungErlaubt,
  pruefeBegruendung,
} from '@ap/core';
import {
  auditLogger,
  countSuperAdmins,
  findUserRole,
  searchUsers,
  setUserRole,
  setUserStatus,
} from '@ap/db';

import { ok, route } from '@/lib/api';

const suche = z.object({
  q: z.string().trim().max(200).optional(),
  rolle: z.string().trim().max(40).optional(),
  seite: z.coerce.number().int().min(0).max(1000).default(0),
});

const massnahme = z.object({
  userId: z.string().min(1),
  /** Genau eine der beiden Angaben. */
  role: z.nativeEnum(Role).optional(),
  status: z.enum(['ACTIVE', 'BLOCKED']).optional(),
  reason: z.string().min(1).max(1000),
});

/**
 * Benutzerverwaltung.
 *
 * Jede Massnahme braucht eine Begruendung -- sie bleibt im Protokoll stehen
 * und ist spaeter die einzige Erklaerung dafuer. Die Regeln, wer was darf,
 * stehen in der Domaenenschicht (`admin/moderation.ts`), nicht hier.
 */
export const GET = route(
  async (context) => {
    const filter = context.query(suche);
    return ok(
      await searchUsers({
        suche: filter.q || undefined,
        rolle: filter.rolle || undefined,
        seite: filter.seite,
      }),
    );
  },
  { permission: Permission.ADMIN_USERS },
);

export const PATCH = route(
  async (context) => {
    const eingabe = await context.body(massnahme);
    const grund = pruefeBegruendung(eingabe.reason);

    if ((eingabe.role === undefined) === (eingabe.status === undefined)) {
      throw errors.validation({
        role: ['Bitte entweder eine Rolle oder einen Kontostatus ändern, nicht beides.'],
      });
    }

    const aktuelleRolle = await findUserRole(eingabe.userId);
    if (!aktuelleRolle) throw errors.notFound();

    if (eingabe.role !== undefined) {
      assertRollenwechselErlaubt({
        handelnde: context.principal,
        zielUserId: eingabe.userId,
        zielRolleAktuell: aktuelleRolle,
        zielRolleNeu: eingabe.role,
        verbleibendeSuperAdmins: await countSuperAdmins(),
      });

      await setUserRole(eingabe.userId, eingabe.role);
      await auditLogger.record({
        action: 'role.assigned',
        actorId: context.principal?.userId ?? null,
        subjectType: 'User',
        subjectId: eingabe.userId,
        metadata: { von: aktuelleRolle, nach: eingabe.role, grund },
      });
      return ok({ userId: eingabe.userId, role: eingabe.role });
    }

    assertSperrungErlaubt({
      handelnde: context.principal,
      zielUserId: eingabe.userId,
      zielRolle: aktuelleRolle,
    });

    await setUserStatus(eingabe.userId, eingabe.status as 'ACTIVE' | 'BLOCKED');
    await auditLogger.record({
      action: 'admin.user_blocked',
      actorId: context.principal?.userId ?? null,
      subjectType: 'User',
      subjectId: eingabe.userId,
      metadata: { status: eingabe.status ?? '', grund },
    });

    return ok({ userId: eingabe.userId, status: eingabe.status });
  },
  {
    permission: Permission.ADMIN_USERS,
    rateLimit: { limit: 120, windowSeconds: 3600, scope: 'admin:benutzer', perUser: true },
  },
);
