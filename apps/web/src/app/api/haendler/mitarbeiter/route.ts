import { z } from 'zod';

import {
  Permission,
  dealerMemberInviteInput,
  dealerMemberRoleInput,
  errors,
  requireSameDealer,
} from '@ap/core';
import {
  addDealerMember,
  listDealerMembers,
  removeDealerMember,
  setDealerMemberRole,
} from '@ap/db';

import { created, noContent, ok, route } from '@/lib/api';

/**
 * Mitarbeiter eines Betriebs.
 *
 * Aufgenommen werden koennen nur Personen, die sich selbst registriert
 * haben. Konten fuer andere anzulegen ist ausdruecklich nicht vorgesehen:
 * Sonst legte ein Betrieb Konten mit fremden E-Mail-Adressen an, und die
 * betroffene Person erfuehre davon nichts.
 */
export const GET = route(
  async (context) => {
    const dealerId = context.principal?.dealerId;
    requireSameDealer(context.principal, dealerId);
    return ok({ members: await listDealerMembers(dealerId as string) });
  },
  { permission: Permission.DEALER_STAFF_MANAGE },
);

export const POST = route(
  async (context) => {
    const dealerId = context.principal?.dealerId;
    requireSameDealer(context.principal, dealerId);
    const { email, role } = await context.body(dealerMemberInviteInput);
    return created({ member: await addDealerMember(dealerId as string, email, role) });
  },
  {
    permission: Permission.DEALER_STAFF_MANAGE,
    rateLimit: { limit: 30, windowSeconds: 3600, scope: 'haendler:aufnehmen', perUser: true },
  },
);

export const PATCH = route(
  async (context) => {
    const dealerId = context.principal?.dealerId;
    const handelnde = requireSameDealer(context.principal, dealerId);
    const { userId, role } = await context.body(dealerMemberRoleInput);

    // Sich selbst herabzustufen ist der schnellste Weg, sich auszusperren.
    if (userId === handelnde.userId && role === 'DEALER_STAFF') {
      throw errors.conflict(
        'Die eigene Rolle lässt sich hier nicht herabstufen. Bitte von einem anderen ' +
          'Inhaber ändern lassen.',
      );
    }

    await setDealerMemberRole(dealerId as string, userId, role);
    return ok({ userId, role });
  },
  {
    permission: Permission.DEALER_STAFF_MANAGE,
    rateLimit: { limit: 60, windowSeconds: 3600, scope: 'haendler:rolle', perUser: true },
  },
);

const entfernen = z.object({ userId: z.string().min(1) });

export const DELETE = route(
  async (context) => {
    const dealerId = context.principal?.dealerId;
    const handelnde = requireSameDealer(context.principal, dealerId);
    const { userId } = entfernen.parse({
      userId: context.request.nextUrl.searchParams.get('userId') ?? '',
    });

    if (userId === handelnde.userId) {
      throw errors.conflict(
        'Sich selbst aus dem Betrieb zu entfernen ist hier nicht vorgesehen. Bitte von ' +
          'einem anderen Inhaber entfernen lassen.',
      );
    }

    await removeDealerMember(dealerId as string, userId);
    return noContent();
  },
  {
    permission: Permission.DEALER_STAFF_MANAGE,
    rateLimit: { limit: 60, windowSeconds: 3600, scope: 'haendler:entfernen', perUser: true },
  },
);
