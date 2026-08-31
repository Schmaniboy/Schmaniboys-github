import {
  buildListingSlug,
  errors,
  formatBuildPeriod,
  istOeffentlichSichtbar,
  type ListingSearchInput,
  type ListingStatus,
} from '@ap/core';
import { randomBytes } from 'node:crypto';

import { type Prisma, prisma } from '../client';

/**
 * Anzeigen des Marktplatzes.
 *
 * Zwei Regeln durchziehen diese Datei:
 *
 * 1. **Beim Veroeffentlichen wird kopiert, nicht verwiesen.** Eine Anzeige
 *    ist ein Angebot; sie darf sich nicht aendern, weil jemand am Entwurf
 *    weiterarbeitet.
 * 2. **Jede schreibende Abfrage traegt die Besitzerkennung in der
 *    WHERE-Bedingung.** Nicht erst lesen und dann vergleichen -- das ist ein
 *    Wettlauf und eine Zeile, die man vergessen kann.
 */

const ANZEIGE_FELDER = {
  id: true,
  sellerId: true,
  dealerId: true,
  draftId: true,
  status: true,
  manufacturerId: true,
  modelId: true,
  generationId: true,
  powertrainId: true,
  trimLineId: true,
  vehicleLabel: true,
  title: true,
  description: true,
  priceCents: true,
  negotiable: true,
  mileageKm: true,
  firstRegistration: true,
  previousOwners: true,
  huValidUntil: true,
  serviceHistory: true,
  condition: true,
  damages: true,
  hadAccident: true,
  accidentDetails: true,
  postalCode: true,
  city: true,
  slug: true,
  publishedAt: true,
  expiresAt: true,
  soldAt: true,
  viewCount: true,
  createdAt: true,
  updatedAt: true,
  dealer: { select: { id: true, name: true, slug: true, status: true, city: true } },
  images: {
    orderBy: { position: 'asc' },
    select: {
      id: true,
      storageKey: true,
      position: true,
      width: true,
      height: true,
      contentType: true,
      altText: true,
    },
  },
} satisfies Prisma.ListingSelect;

export type ListingRecord = Prisma.ListingGetPayload<{ select: typeof ANZEIGE_FELDER }>;

/** Kurzzeichenkette fuer die Adresszeile. */
function zufallsTeil(): string {
  return randomBytes(4).toString('hex');
}

/**
 * Anzeigebezeichnung aus dem Katalogeintrag.
 *
 * Sie wird gespeichert, damit eine alte Anzeige lesbar bleibt, auch wenn der
 * Katalogeintrag spaeter umbenannt wird.
 */
function fahrzeugBezeichnung(teile: {
  manufacturer: string;
  model: string;
  generation: string | null;
  engine: string | null;
  yearFrom: number | null;
  yearTo: number | null;
}): string {
  const zeit = formatBuildPeriod(teile.yearFrom, teile.yearTo);
  return [teile.manufacturer, teile.model, teile.generation, teile.engine, zeit]
    .filter((teil): teil is string => Boolean(teil))
    .join(' · ');
}

/**
 * Erzeugt eine Anzeige aus einem bestaetigten Verkaufsentwurf.
 *
 * Verlangt wird die Bestaetigung, nicht der erzeugte Text: Wer seine
 * Beschreibung selbst schreiben will, soll das duerfen. Ohne bestaetigtes
 * Fahrzeug entstuende dagegen eine Anzeige ueber ein geratenes Auto.
 */
export async function createListingFromDraft(input: {
  draftId: string;
  sellerId: string;
  dealerId: string | null;
  title: string;
  description: string;
  priceCents: number;
  negotiable: boolean;
  postalCode: string;
  city: string;
}): Promise<ListingRecord> {
  const entwurf = await prisma.listingDraft.findFirst({
    where: { id: input.draftId, ownerId: input.sellerId },
    select: {
      id: true,
      catalogConfirmedAt: true,
      manufacturerId: true,
      modelId: true,
      generationId: true,
      powertrainId: true,
      trimLineId: true,
      mileageKm: true,
      firstRegistration: true,
      previousOwners: true,
      huValidUntil: true,
      serviceHistory: true,
      condition: true,
      damages: true,
      hadAccident: true,
      accidentDetails: true,
    },
  });

  if (!entwurf) throw errors.notFound();
  if (!entwurf.catalogConfirmedAt || !entwurf.manufacturerId || !entwurf.modelId) {
    throw errors.conflict(
      'Bitte zuerst das Fahrzeug bestätigen. Ohne bestätigte Zuordnung entstünde eine ' +
        'Anzeige über ein geratenes Fahrzeug.',
    );
  }

  const [hersteller, modell, generation, antrieb] = await Promise.all([
    prisma.manufacturer.findUnique({
      where: { id: entwurf.manufacturerId },
      select: { name: true },
    }),
    prisma.model.findUnique({ where: { id: entwurf.modelId }, select: { name: true } }),
    entwurf.generationId
      ? prisma.generation.findUnique({
          where: { id: entwurf.generationId },
          select: { name: true, yearFrom: true, yearTo: true },
        })
      : Promise.resolve(null),
    entwurf.powertrainId
      ? prisma.powertrainCombination.findUnique({
          where: { id: entwurf.powertrainId },
          select: { engine: { select: { name: true } } },
        })
      : Promise.resolve(null),
  ]);

  if (!hersteller || !modell) throw errors.conflict('Die Fahrzeugzuordnung ist unvollständig.');

  const bezeichnung = fahrzeugBezeichnung({
    manufacturer: hersteller.name,
    model: modell.name,
    generation: generation?.name ?? null,
    engine: antrieb?.engine.name ?? null,
    yearFrom: generation?.yearFrom ?? null,
    yearTo: generation?.yearTo ?? null,
  });

  return prisma.listing.create({
    data: {
      sellerId: input.sellerId,
      dealerId: input.dealerId,
      draftId: entwurf.id,
      status: 'DRAFT',
      manufacturerId: entwurf.manufacturerId,
      modelId: entwurf.modelId,
      generationId: entwurf.generationId,
      powertrainId: entwurf.powertrainId,
      trimLineId: entwurf.trimLineId,
      vehicleLabel: bezeichnung,
      title: input.title,
      description: input.description,
      priceCents: input.priceCents,
      negotiable: input.negotiable,
      postalCode: input.postalCode,
      city: input.city,
      // Kopiert, nicht verwiesen: siehe Kopf der Datei.
      mileageKm: entwurf.mileageKm,
      firstRegistration: entwurf.firstRegistration,
      previousOwners: entwurf.previousOwners,
      huValidUntil: entwurf.huValidUntil,
      serviceHistory: entwurf.serviceHistory,
      condition: entwurf.condition,
      damages: entwurf.damages,
      hadAccident: entwurf.hadAccident,
      accidentDetails: entwurf.accidentDetails,
      slug: buildListingSlug({
        title: input.title,
        vehicleLabel: bezeichnung,
        zufall: zufallsTeil(),
      }),
    },
    select: ANZEIGE_FELDER,
  });
}

/** Eine eigene Anzeige, gleich welchen Zustands. */
export async function findOwnListing(
  listingId: string,
  sellerId: string,
): Promise<ListingRecord | null> {
  return prisma.listing.findFirst({
    where: { id: listingId, sellerId, status: { not: 'DELETED' } },
    select: ANZEIGE_FELDER,
  });
}

export async function listOwnListings(sellerId: string): Promise<ListingRecord[]> {
  return prisma.listing.findMany({
    where: { sellerId, status: { not: 'DELETED' } },
    orderBy: { updatedAt: 'desc' },
    take: 100,
    select: ANZEIGE_FELDER,
  });
}

/**
 * Eine oeffentliche Anzeige ueber ihre Adresszeile.
 *
 * Gibt null zurueck, sobald sie nicht sichtbar ist -- auch wenn der Status
 * noch ACTIVE lautet, die Laufzeit aber abgelaufen ist. Zwischen dem Ablauf
 * und dem Umstellen durch den Hintergrundlauf liegt Zeit; in dieser Zeit
 * darf niemand ein abgelaufenes Angebot zu sehen bekommen.
 */
export async function findPublicListing(
  slug: string,
  jetzt: Date,
): Promise<ListingRecord | null> {
  const anzeige = await prisma.listing.findUnique({ where: { slug }, select: ANZEIGE_FELDER });
  if (!anzeige) return null;
  if (!istOeffentlichSichtbar({ status: anzeige.status, expiresAt: anzeige.expiresAt }, jetzt)) {
    return null;
  }
  return anzeige;
}

export async function updateOwnListing(
  listingId: string,
  sellerId: string,
  daten: {
    title?: string;
    description?: string;
    priceCents?: number;
    negotiable?: boolean;
    postalCode?: string;
    city?: string;
  },
): Promise<ListingRecord> {
  // Besitzerkennung in der WHERE-Bedingung, nicht in einem Vergleich davor.
  const geaendert = await prisma.listing.updateMany({
    where: { id: listingId, sellerId, status: { notIn: ['DELETED', 'SOLD'] } },
    data: daten,
  });
  if (geaendert.count === 0) throw errors.notFound();

  const anzeige = await prisma.listing.findUnique({
    where: { id: listingId },
    select: ANZEIGE_FELDER,
  });
  if (!anzeige) throw errors.notFound();
  return anzeige;
}

export async function setListingStatus(
  listingId: string,
  sellerId: string,
  neuerStatus: ListingStatus,
  zeiten: { jetzt: Date; expiresAt: Date | null },
): Promise<ListingRecord> {
  const geaendert = await prisma.listing.updateMany({
    where: { id: listingId, sellerId },
    data: {
      status: neuerStatus,
      ...(neuerStatus === 'ACTIVE'
        ? { publishedAt: zeiten.jetzt, expiresAt: zeiten.expiresAt }
        : {}),
      ...(neuerStatus === 'SOLD' ? { soldAt: zeiten.jetzt } : {}),
      ...(neuerStatus === 'DELETED' ? { deletedAt: zeiten.jetzt } : {}),
    },
  });
  if (geaendert.count === 0) throw errors.notFound();

  const anzeige = await prisma.listing.findUnique({
    where: { id: listingId },
    select: ANZEIGE_FELDER,
  });
  if (!anzeige) throw errors.notFound();
  return anzeige;
}

/**
 * Setzt abgelaufene Anzeigen auf EXPIRED.
 *
 * Fuer den Hintergrundlauf. Die Sichtbarkeit haengt nicht daran (siehe
 * `findPublicListing`) -- dies raeumt nur auf, damit der Zustand der
 * Wirklichkeit entspricht.
 */
export async function expireOverdueListings(jetzt: Date): Promise<number> {
  const ergebnis = await prisma.listing.updateMany({
    where: { status: 'ACTIVE', expiresAt: { lte: jetzt } },
    data: { status: 'EXPIRED' },
  });
  return ergebnis.count;
}

const SEITENGROESSE = 24;

/**
 * Suche im Marktplatz.
 *
 * Nur sichtbare Anzeigen, immer. Die Bedingung steht am Anfang und wird
 * nicht durch einen Filter ueberschrieben.
 */
export async function searchListings(
  filter: ListingSearchInput,
  jetzt: Date,
): Promise<{ treffer: ListingRecord[]; gesamt: number; seite: number; seitengroesse: number }> {
  const where: Prisma.ListingWhereInput = {
    status: 'ACTIVE',
    OR: [{ expiresAt: null }, { expiresAt: { gt: jetzt } }],
    ...(filter.manufacturerId ? { manufacturerId: filter.manufacturerId } : {}),
    ...(filter.modelId ? { modelId: filter.modelId } : {}),
    ...(filter.generationId ? { generationId: filter.generationId } : {}),
    ...(filter.dealerId ? { dealerId: filter.dealerId } : {}),
    ...(filter.nurUnfallfrei ? { hadAccident: false } : {}),
  };

  if (filter.preisVon !== undefined || filter.preisBis !== undefined) {
    where.priceCents = {
      ...(filter.preisVon !== undefined ? { gte: filter.preisVon * 100 } : {}),
      ...(filter.preisBis !== undefined ? { lte: filter.preisBis * 100 } : {}),
    };
  }
  if (filter.kilometerBis !== undefined) {
    where.mileageKm = { lte: filter.kilometerBis };
  }
  if (filter.baujahrVon !== undefined || filter.baujahrBis !== undefined) {
    where.firstRegistration = {
      ...(filter.baujahrVon !== undefined
        ? { gte: new Date(Date.UTC(filter.baujahrVon, 0, 1)) }
        : {}),
      ...(filter.baujahrBis !== undefined
        ? { lte: new Date(Date.UTC(filter.baujahrBis, 11, 31, 23, 59, 59)) }
        : {}),
    };
  }
  if (filter.q) {
    where.AND = [
      {
        OR: [
          { title: { contains: filter.q, mode: 'insensitive' } },
          { vehicleLabel: { contains: filter.q, mode: 'insensitive' } },
        ],
      },
    ];
  }

  const orderBy: Prisma.ListingOrderByWithRelationInput =
    filter.sortierung === 'preis-auf'
      ? { priceCents: 'asc' }
      : filter.sortierung === 'preis-ab'
        ? { priceCents: 'desc' }
        : filter.sortierung === 'kilometer-auf'
          ? { mileageKm: 'asc' }
          : { publishedAt: 'desc' };

  const [treffer, gesamt] = await Promise.all([
    prisma.listing.findMany({
      where,
      orderBy,
      skip: filter.seite * SEITENGROESSE,
      take: SEITENGROESSE,
      select: ANZEIGE_FELDER,
    }),
    prisma.listing.count({ where }),
  ]);

  return { treffer, gesamt, seite: filter.seite, seitengroesse: SEITENGROESSE };
}

/** Alle sichtbaren Anzeigen fuer die Sitemap. */
export async function listPublicSlugs(
  jetzt: Date,
): Promise<{ slug: string; updatedAt: Date }[]> {
  return prisma.listing.findMany({
    where: { status: 'ACTIVE', OR: [{ expiresAt: null }, { expiresAt: { gt: jetzt } }] },
    orderBy: { publishedAt: 'desc' },
    take: 5000,
    select: { slug: true, updatedAt: true },
  });
}

/**
 * Zaehlt einen Aufruf.
 *
 * Bewusst ein blindes `update` ohne vorheriges Lesen: Der Zaehler ist
 * nebensaechlich, und ein Lese-Schreib-Zyklus verlierte unter Last Aufrufe.
 */
export async function countListingView(listingId: string): Promise<void> {
  await prisma.listing.update({
    where: { id: listingId },
    data: { viewCount: { increment: 1 } },
  });
}
