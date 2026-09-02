import { type Principal, requirePrincipal } from '../auth/access';
import { Permission, Role, can } from '../auth/roles';
import { pruefeBegruendung } from '../admin/moderation';
import { errors } from '../errors';
import type { AuditLogger } from '../ports/audit';
import { parseOrThrow } from '../validation/common';
import { z } from 'zod';

const moderationInput = z.object({
  ziel: z.enum(['LISTING', 'MESSAGE']),
  id: z.string().min(1),
  aktion: z.enum(['HIDE', 'RESTORE']),
  reason: z.string().min(1).max(1000),
});

export interface ModerationRepository {
  moderateListing(input: {
    listingId: string;
    aktion: 'HIDE' | 'RESTORE';
    grund: string;
    actorId: string;
  }): Promise<void>;
  moderateMessage(input: {
    messageId: string;
    aktion: 'HIDE' | 'RESTORE';
    grund: string;
    jetzt: Date;
  }): Promise<void>;
}

export interface ModerationDeps {
  moderation: ModerationRepository;
  audit: AuditLogger;
  clock: { now(): Date };
}

export async function moderate(
  deps: ModerationDeps,
  principal: Principal | null,
  rawInput: unknown,
) {
  const admin = requirePrincipal(principal);
  const daten = parseOrThrow(moderationInput, rawInput);
  const grund = pruefeBegruendung(daten.reason);

  if (daten.ziel === 'LISTING') {
    if (!can(admin.role, Permission.LISTING_MODERATE)) {
      throw errors.forbidden();
    }

    await deps.moderation.moderateListing({
      listingId: daten.id,
      aktion: daten.aktion,
      grund,
      actorId: admin.userId,
    });
    await deps.audit.record({
      action: 'listing.moderated',
      actorId: admin.userId,
      subjectType: 'Listing',
      subjectId: daten.id,
      metadata: { aktion: daten.aktion, grund },
    });

    return { ziel: daten.ziel, id: daten.id, aktion: daten.aktion };
  }

  if (admin.role !== Role.ADMIN && admin.role !== Role.SUPER_ADMIN) {
    throw errors.forbidden();
  }

  await deps.moderation.moderateMessage({
    messageId: daten.id,
    aktion: daten.aktion,
    grund,
    jetzt: deps.clock.now(),
  });
  await deps.audit.record({
    action: 'message.moderated',
    actorId: admin.userId,
    subjectType: 'Message',
    subjectId: daten.id,
    metadata: { aktion: daten.aktion, grund },
  });

  return { ziel: daten.ziel, id: daten.id, aktion: daten.aktion };
}
