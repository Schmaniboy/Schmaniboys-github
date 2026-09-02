import { z } from 'zod';

import {
  Permission,
  changeDealerMemberRole,
  inviteDealerMember,
  listDealerStaff,
  removeDealerMemberUseCase,
} from '@ap/core';

import { created, noContent, ok, route } from '@/lib/api';
import { dealerMemberDeps } from '@/lib/deps';

const rawBody = z.object({}).passthrough();

export const GET = route(
  async (context) => {
    const members = await listDealerStaff(dealerMemberDeps, context.principal);
    return ok({ members });
  },
  { permission: Permission.DEALER_STAFF_MANAGE },
);

export const POST = route(
  async (context) => {
    const member = await inviteDealerMember(
      dealerMemberDeps,
      context.principal,
      await context.body(rawBody),
    );
    return created({ member });
  },
  {
    permission: Permission.DEALER_STAFF_MANAGE,
    rateLimit: { limit: 30, windowSeconds: 3600, scope: 'haendler:aufnehmen', perUser: true },
  },
);

export const PATCH = route(
  async (context) => {
    const ergebnis = await changeDealerMemberRole(
      dealerMemberDeps,
      context.principal,
      await context.body(rawBody),
    );
    return ok(ergebnis);
  },
  {
    permission: Permission.DEALER_STAFF_MANAGE,
    rateLimit: { limit: 60, windowSeconds: 3600, scope: 'haendler:rolle', perUser: true },
  },
);

export const DELETE = route(
  async (context) => {
    await removeDealerMemberUseCase(dealerMemberDeps, context.principal, {
      userId: context.request.nextUrl.searchParams.get('userId') ?? '',
    });
    return noContent();
  },
  {
    permission: Permission.DEALER_STAFF_MANAGE,
    rateLimit: { limit: 60, windowSeconds: 3600, scope: 'haendler:entfernen', perUser: true },
  },
);
