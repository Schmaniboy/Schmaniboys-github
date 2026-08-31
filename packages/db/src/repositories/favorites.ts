import { istOeffentlichSichtbar } from '@ap/core';

import { prisma } from '../client';

/**
 * Merkliste.
 *
 * Merken ist absichtlich idempotent: Zweimal auf denselben Stern zu klicken
 * ist kein Fehler, sondern ein Doppelklick.
 */

export async function addFavorite(userId: string, listingId: string): Promise<void> {
  await prisma.listingFavorite.upsert({
    where: { userId_listingId: { userId, listingId } },
    create: { userId, listingId },
    update: {},
  });
}

export async function removeFavorite(userId: string, listingId: string): Promise<void> {
  await prisma.listingFavorite.deleteMany({ where: { userId, listingId } });
}

export async function isFavorite(userId: string, listingId: string): Promise<boolean> {
  const treffer = await prisma.listingFavorite.findUnique({
    where: { userId_listingId: { userId, listingId } },
    select: { id: true },
  });
  return treffer !== null;
}

/**
 * Die eigene Merkliste.
 *
 * Anzeigen, die inzwischen nicht mehr sichtbar sind, werden mitgeliefert und
 * gekennzeichnet -- nicht stillschweigend verschluckt. Wer sich etwas gemerkt
 * hat, soll erfahren, dass es verkauft wurde, statt sich zu wundern.
 */
export async function listFavorites(userId: string, jetzt: Date) {
  const eintraege = await prisma.listingFavorite.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 200,
    select: {
      createdAt: true,
      listing: {
        select: {
          id: true,
          slug: true,
          title: true,
          vehicleLabel: true,
          priceCents: true,
          mileageKm: true,
          firstRegistration: true,
          status: true,
          expiresAt: true,
          city: true,
          images: {
            orderBy: { position: 'asc' },
            take: 1,
            select: { storageKey: true, altText: true },
          },
        },
      },
    },
  });

  return eintraege.map((eintrag) => ({
    gemerktAm: eintrag.createdAt,
    anzeige: eintrag.listing,
    nochVerfuegbar: istOeffentlichSichtbar(
      { status: eintrag.listing.status, expiresAt: eintrag.listing.expiresAt },
      jetzt,
    ),
  }));
}
