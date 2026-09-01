import { z } from 'zod';

import type { Principal } from '../auth/access';
import { Role } from '../auth/roles';
import {
  assertRollenwechselErlaubt,
  assertSperrungErlaubt,
  pruefeBegruendung,
} from '../admin/moderation';
import { errors } from '../errors';
import type { AuditLogger } from '../ports/audit';

/**
 * Benutzerverwaltung durch die Administration.
 *
 * Die Regeln stehen in `admin/moderation.ts`; die Persistenz kommt ueber
 * die Schnittstelle herein. Damit ist beides ohne HTTP pruefbar (ADR-001).
 */

export interface AdminUserDeps {
  findUserRole(userId: string): Promise<Role | null>;
  countSuperAdmins(): Promise<number>;
  setUserRole(userId: string, role: Role): Promise<void>;
  setUserStatus(userId: string, status: 'ACTIVE' | 'BLOCKED'): Promise<void>;
  audit: AuditLogger;
}

const massnahme = z.object({
  userId: z.string().min(1),
  role: z.nativeEnum(Role).optional(),
  status: z.enum(['ACTIVE', 'BLOCKED']).optional(),
  reason: z.string().min(1).max(1000),
});

export async function manageUser(
  deps: AdminUserDeps,
  principal: Principal | null,
  rawInput: unknown,
): Promise<{ userId: string; role?: Role; status?: string }> {
  const eingabe = massnahme.parse(rawInput);
  const grund = pruefeBegruendung(eingabe.reason);

  if ((eingabe.role === undefined) === (eingabe.status === undefined)) {
    throw errors.validation({
      role: ['Bitte entweder eine Rolle oder einen Kontostatus ändern, nicht beides.'],
    });
  }

  const aktuelleRolle = await deps.findUserRole(eingabe.userId);
  if (!aktuelleRolle) throw errors.notFound();

  if (eingabe.role !== undefined) {
    assertRollenwechselErlaubt({
      handelnde: principal,
      zielUserId: eingabe.userId,
      zielRolleAktuell: aktuelleRolle,
      zielRolleNeu: eingabe.role,
      verbleibendeSuperAdmins: await deps.countSuperAdmins(),
    });

    await deps.setUserRole(eingabe.userId, eingabe.role);
    await deps.audit.record({
      action: 'role.assigned',
      actorId: principal?.userId ?? null,
      subjectType: 'User',
      subjectId: eingabe.userId,
      metadata: { von: aktuelleRolle, nach: eingabe.role, grund },
    });
    return { userId: eingabe.userId, role: eingabe.role };
  }

  assertSperrungErlaubt({
    handelnde: principal,
    zielUserId: eingabe.userId,
    zielRolle: aktuelleRolle,
  });

  await deps.setUserStatus(eingabe.userId, eingabe.status as 'ACTIVE' | 'BLOCKED');
  await deps.audit.record({
    action: 'admin.user_blocked',
    actorId: principal?.userId ?? null,
    subjectType: 'User',
    subjectId: eingabe.userId,
    metadata: { status: eingabe.status ?? '', grund },
  });

  return { userId: eingabe.userId, status: eingabe.status };
}
