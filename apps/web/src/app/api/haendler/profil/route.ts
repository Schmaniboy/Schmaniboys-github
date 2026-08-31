import { Permission, dealerProfileInput, errors, requireSameDealer } from '@ap/core';
import { findDealer, updateDealerProfile } from '@ap/db';

import { ok, route } from '@/lib/api';

/**
 * Das eigene Haendlerprofil.
 *
 * Welcher Betrieb gemeint ist, steht in der Sitzung -- nicht in der Anfrage.
 * Eine Haendlerkennung entgegenzunehmen waere die Einladung, eine fremde
 * einzusetzen.
 */
export const GET = route(
  async (context) => {
    const dealerId = context.principal?.dealerId;
    requireSameDealer(context.principal, dealerId);
    const haendler = await findDealer(dealerId as string);
    if (!haendler) throw errors.notFound();
    return ok({ dealer: haendler });
  },
  { permission: Permission.DEALER_STATS_READ_OWN },
);

export const PATCH = route(
  async (context) => {
    const dealerId = context.principal?.dealerId;
    requireSameDealer(context.principal, dealerId);
    const eingabe = await context.body(dealerProfileInput);
    return ok({ dealer: await updateDealerProfile(dealerId as string, eingabe) });
  },
  {
    permission: Permission.DEALER_MANAGE_OWN,
    rateLimit: { limit: 60, windowSeconds: 3600, scope: 'haendler:profil', perUser: true },
  },
);
