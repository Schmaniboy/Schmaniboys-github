import { Permission, createListingInput, listingSearchInput, systemClock } from '@ap/core';

import { createListingFromDraft, listOwnListings, searchListings } from '@ap/db';

import { created, ok, route } from '@/lib/api';

/**
 * Anzeigen.
 *
 * GET ohne Anmeldung sucht im oeffentlichen Marktplatz. GET mit
 * `?eigene=true` und Anmeldung liefert die eigenen Anzeigen, auch die
 * unveroeffentlichten.
 */
export const GET = route(
  async (context) => {
    const eigene = context.request.nextUrl.searchParams.get('eigene') === 'true';

    if (eigene) {
      const userId = context.principal?.userId;
      if (!userId) return ok({ listings: [] });
      return ok({ listings: await listOwnListings(userId) });
    }

    const filter = context.query(listingSearchInput);
    return ok(await searchListings(filter, systemClock.now()));
  },
  { auth: 'optional' },
);

export const POST = route(
  async (context) => {
    const eingabe = await context.body(createListingInput);
    const userId = context.userId();

    /*
     * Im Namen eines Haendlers zu inserieren setzt Zugehoerigkeit voraus.
     * Die Pruefung steht hier und nicht im Formular: Was der Browser
     * schickt, ist ein Wunsch, keine Tatsache.
     */
    const dealerId =
      eingabe.dealerId && eingabe.dealerId === context.principal?.dealerId
        ? eingabe.dealerId
        : null;

    const anzeige = await createListingFromDraft({
      draftId: eingabe.draftId,
      sellerId: userId,
      dealerId,
      title: eingabe.title,
      description: eingabe.description,
      priceCents: eingabe.priceCents,
      negotiable: eingabe.negotiable,
      postalCode: eingabe.postalCode,
      city: eingabe.city,
    });

    return created({ listing: anzeige });
  },
  {
    permission: Permission.LISTING_CREATE,
    rateLimit: { limit: 20, windowSeconds: 3600, scope: 'anzeigen:anlegen', perUser: true },
  },
);
