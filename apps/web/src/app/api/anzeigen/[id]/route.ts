import { z } from 'zod';

import { Permission, errors, updateListingInput } from '@ap/core';
import { findOwnListing, updateOwnListing } from '@ap/db';

import { ok, route } from '@/lib/api';

const pfad = z.object({ id: z.string().min(1) });

/**
 * Eine eigene Anzeige lesen und bearbeiten.
 *
 * Eine fremde Anzeige antwortet mit NOT_FOUND, nicht mit FORBIDDEN -- sonst
 * liesse sich ueber die Fehlerantwort aufzaehlen, welche Anzeigen es gibt.
 * Fuer die oeffentliche Ansicht gibt es die Seite unter /marktplatz.
 */
export const GET = route(
  async (context) => {
    const { id } = await context.params(pfad);
    const anzeige = await findOwnListing(id, context.userId());
    if (!anzeige) throw errors.notFound();
    return ok({ listing: anzeige });
  },
  { auth: 'required' },
);

export const PATCH = route(
  async (context) => {
    const { id } = await context.params(pfad);
    const eingabe = await context.body(updateListingInput);
    return ok({ listing: await updateOwnListing(id, context.userId(), eingabe) });
  },
  {
    permission: Permission.LISTING_MANAGE_OWN,
    rateLimit: { limit: 120, windowSeconds: 3600, scope: 'anzeigen:aendern', perUser: true },
  },
);
