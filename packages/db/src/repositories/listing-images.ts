import { MAX_BILDER_JE_ANZEIGE, errors } from '@ap/core';

import { prisma } from '../client';

/**
 * Bilder einer Anzeige.
 *
 * Die Reihenfolge ist eine eigene Spalte mit Eindeutigkeitsbedingung je
 * Anzeige. Sie neu zu vergeben braucht deshalb einen Umweg -- siehe
 * `reorderImages`.
 */

export interface ListingImageRecord {
  id: string;
  storageKey: string;
  position: number;
  width: number;
  height: number;
  byteSize: number;
  contentType: string;
  altText: string | null;
}

export async function countImages(listingId: string): Promise<number> {
  return prisma.listingImage.count({ where: { listingId } });
}

/**
 * Legt einen Bildeintrag an.
 *
 * Die Position ergibt sich aus dem hoechsten vorhandenen Wert plus eins --
 * nicht aus der Anzahl. Nach einer Loeschung gibt es Luecken, und
 * `count` liefe dann in die Eindeutigkeitsbedingung.
 */
export async function addImage(input: {
  listingId: string;
  sellerId: string;
  storageKey: string;
  width: number;
  height: number;
  byteSize: number;
  contentType: string;
}): Promise<ListingImageRecord> {
  const anzeige = await prisma.listing.findFirst({
    where: { id: input.listingId, sellerId: input.sellerId, status: { not: 'DELETED' } },
    select: { id: true },
  });
  if (!anzeige) throw errors.notFound();

  const hoechste = await prisma.listingImage.findFirst({
    where: { listingId: input.listingId },
    orderBy: { position: 'desc' },
    select: { position: true },
  });
  const anzahl = await countImages(input.listingId);
  if (anzahl >= MAX_BILDER_JE_ANZEIGE) {
    throw errors.conflict(
      `Mehr als ${MAX_BILDER_JE_ANZEIGE} Bilder je Anzeige sind nicht vorgesehen.`,
    );
  }

  return prisma.listingImage.create({
    data: {
      listingId: input.listingId,
      storageKey: input.storageKey,
      position: (hoechste?.position ?? -1) + 1,
      width: input.width,
      height: input.height,
      byteSize: input.byteSize,
      contentType: input.contentType,
    },
    select: {
      id: true,
      storageKey: true,
      position: true,
      width: true,
      height: true,
      byteSize: true,
      contentType: true,
      altText: true,
    },
  });
}

/**
 * Setzt den endgueltigen Ablageschluessel.
 *
 * Beim Anlegen steht dort ein Platzhalter: Der richtige Schluessel enthaelt
 * die Kennung des Bildes, und die gibt es erst nach dem Anlegen. Die Spalte
 * ist eindeutig, ein fester Platzhalterwert ginge also nur einmal.
 */
export async function setImageStorageKey(
  imageId: string,
  sellerId: string,
  storageKey: string,
): Promise<void> {
  const geaendert = await prisma.listingImage.updateMany({
    where: { id: imageId, listing: { sellerId } },
    data: { storageKey },
  });
  if (geaendert.count === 0) throw errors.notFound();
}

/** Bild einer eigenen Anzeige loeschen. Gibt den Ablageschluessel zurueck. */
export async function removeImage(
  imageId: string,
  sellerId: string,
): Promise<{ storageKey: string }> {
  const bild = await prisma.listingImage.findFirst({
    where: { id: imageId, listing: { sellerId } },
    select: { id: true, storageKey: true },
  });
  if (!bild) throw errors.notFound();

  await prisma.listingImage.delete({ where: { id: bild.id } });
  return { storageKey: bild.storageKey };
}

export async function setImageAltText(
  imageId: string,
  sellerId: string,
  altText: string | null,
): Promise<void> {
  const geaendert = await prisma.listingImage.updateMany({
    where: { id: imageId, listing: { sellerId } },
    data: { altText },
  });
  if (geaendert.count === 0) throw errors.notFound();
}

/**
 * Neue Reihenfolge.
 *
 * Der Umweg ueber negative Positionen ist noetig, weil `(listingId,
 * position)` eindeutig ist: Wuerde direkt umnummeriert, kollidierte der
 * erste Schreibvorgang mit einer noch bestehenden Zeile. Negative Werte
 * kommen im Normalbetrieb nicht vor und sind deshalb sicher frei.
 */
export async function reorderImages(
  listingId: string,
  sellerId: string,
  imageIds: string[],
): Promise<void> {
  const anzeige = await prisma.listing.findFirst({
    where: { id: listingId, sellerId, status: { not: 'DELETED' } },
    select: { id: true },
  });
  if (!anzeige) throw errors.notFound();

  const vorhandene = await prisma.listingImage.findMany({
    where: { listingId },
    select: { id: true },
  });
  const bekannte = new Set(vorhandene.map((bild) => bild.id));

  if (imageIds.length !== bekannte.size || imageIds.some((id) => !bekannte.has(id))) {
    throw errors.validation({
      imageIds: ['Die Reihenfolge muss genau die Bilder dieser Anzeige enthalten.'],
    });
  }

  await prisma.$transaction([
    ...imageIds.map((id, index) =>
      prisma.listingImage.update({ where: { id }, data: { position: -1 - index } }),
    ),
    ...imageIds.map((id, index) =>
      prisma.listingImage.update({ where: { id }, data: { position: index } }),
    ),
  ]);
}
