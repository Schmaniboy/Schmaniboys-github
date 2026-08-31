import { z } from 'zod';

import {
  Permission,
  errors,
  ablaufDatum,
  assertListingTransition,
  listingStatusInput,
  systemClock,
  type ListingStatus,
} from '@ap/core';
import { findOwnListing, setListingStatus } from '@ap/db';

import { ok, route } from '@/lib/api';

const pfad = z.object({ id: z.string().min(1) });

/**
 * Veroeffentlichen, pausieren, als verkauft markieren, loeschen.
 *
 * Der erlaubte Wechsel wird in der Domaenenschicht geprueft
 * (`assertListingTransition`), nicht hier. Diese Datei kennt nur den Weg
 * von der Anfrage zur Fachlogik.
 */
export const PATCH = route(
  async (context) => {
    const { id } = await context.params(pfad);
    const { status } = await context.body(listingStatusInput);
    const userId = context.userId();

    const anzeige = await findOwnListing(id, userId);
    if (!anzeige) throw errors.notFound();

    assertListingTransition(anzeige.status as ListingStatus, status);

    const jetzt = systemClock.now();
    const aktualisiert = await setListingStatus(id, userId, status, {
      jetzt,
      expiresAt: status === 'ACTIVE' ? ablaufDatum(jetzt) : null,
    });

    return ok({ listing: aktualisiert });
  },
  {
    permission: Permission.LISTING_MANAGE_OWN,
    rateLimit: { limit: 60, windowSeconds: 3600, scope: 'anzeigen:status', perUser: true },
  },
);
