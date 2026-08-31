import {
  baueStatistik,
  errors,
  tageZwischen,
  type DealerProfileInput,
  type Kennzahl,
  type Zeitspanne,
} from '@ap/core';

import { type Prisma, prisma } from '../client';

/**
 * Haendler.
 *
 * Mandantentrennung heisst hier dasselbe wie Eigentum bei den Anzeigen: Die
 * Haendlerkennung steht in jeder Bedingung, nicht in einem Vergleich davor.
 */

const HAENDLER_FELDER = {
  id: true,
  name: true,
  slug: true,
  status: true,
  description: true,
  logoStorageKey: true,
  contactEmail: true,
  contactPhone: true,
  websiteUrl: true,
  street: true,
  postalCode: true,
  city: true,
  vatId: true,
  createdAt: true,
  openingHours: {
    orderBy: [{ weekday: 'asc' }, { opensMinute: 'asc' }],
    select: { id: true, weekday: true, opensMinute: true, closesMinute: true },
  },
} satisfies Prisma.DealerSelect;

export type DealerRecord = Prisma.DealerGetPayload<{ select: typeof HAENDLER_FELDER }>;

export async function findDealer(dealerId: string): Promise<DealerRecord | null> {
  return prisma.dealer.findUnique({ where: { id: dealerId }, select: HAENDLER_FELDER });
}

/** Oeffentliches Haendlerprofil ueber die Adresszeile. Nur freigeschaltete. */
export async function findPublicDealer(slug: string): Promise<DealerRecord | null> {
  return prisma.dealer.findFirst({
    where: { slug, status: 'ACTIVE' },
    select: HAENDLER_FELDER,
  });
}

export async function updateDealerProfile(
  dealerId: string,
  daten: DealerProfileInput,
): Promise<DealerRecord> {
  const geaendert = await prisma.dealer.updateMany({
    where: { id: dealerId },
    data: {
      name: daten.name,
      description: daten.description ?? null,
      contactEmail: daten.contactEmail ?? null,
      contactPhone: daten.contactPhone ?? null,
      websiteUrl: daten.websiteUrl ?? null,
      street: daten.street ?? null,
      postalCode: daten.postalCode ?? null,
      city: daten.city ?? null,
      vatId: daten.vatId ?? null,
    },
  });
  if (geaendert.count === 0) throw errors.notFound();

  const haendler = await findDealer(dealerId);
  if (!haendler) throw errors.notFound();
  return haendler;
}

export async function setDealerLogo(dealerId: string, storageKey: string | null): Promise<void> {
  const geaendert = await prisma.dealer.updateMany({
    where: { id: dealerId },
    data: { logoStorageKey: storageKey },
  });
  if (geaendert.count === 0) throw errors.notFound();
}

/**
 * Ersetzt die Oeffnungszeiten vollstaendig.
 *
 * Ersetzen statt einzeln aendern: Die Zeiten sind ein zusammenhaengender
 * Satz, und "Dienstag streichen" waere sonst eine eigene Operation mit
 * eigenen Fehlerquellen.
 */
export async function replaceOpeningHours(
  dealerId: string,
  spannen: Zeitspanne[],
): Promise<void> {
  await prisma.$transaction([
    prisma.dealerOpeningHour.deleteMany({ where: { dealerId } }),
    prisma.dealerOpeningHour.createMany({
      data: spannen.map((spanne) => ({
        dealerId,
        weekday: spanne.weekday,
        opensMinute: spanne.opensMinute,
        closesMinute: spanne.closesMinute,
      })),
    }),
  ]);
}

export interface DealerMemberRecord {
  id: string;
  email: string;
  displayName: string;
  role: string;
  status: string;
  createdAt: Date;
}

export async function listDealerMembers(dealerId: string): Promise<DealerMemberRecord[]> {
  return prisma.user.findMany({
    where: { dealerId },
    orderBy: [{ role: 'asc' }, { createdAt: 'asc' }],
    select: {
      id: true,
      email: true,
      displayName: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });
}

/**
 * Nimmt eine bestehende Person in den Betrieb auf.
 *
 * Ausdruecklich kein Anlegen eines Kontos: Wer aufgenommen wird, hat sich
 * selbst registriert. Sonst legte ein Betrieb Konten mit fremden
 * E-Mail-Adressen an, und die betroffene Person erfuehre davon nichts.
 */
export async function addDealerMember(
  dealerId: string,
  email: string,
  role: 'DEALER_STAFF' | 'DEALER_OWNER',
): Promise<DealerMemberRecord> {
  const person = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    select: { id: true, dealerId: true, role: true },
  });

  if (!person) {
    throw errors.validation({
      email: [
        'Zu dieser Adresse gibt es kein Konto. Die Person muss sich zuerst selbst ' +
          'registrieren — Konten für andere anzulegen ist nicht vorgesehen.',
      ],
    });
  }

  if (person.dealerId && person.dealerId !== dealerId) {
    throw errors.conflict('Diese Person gehört bereits zu einem anderen Betrieb.');
  }

  // Adminrollen werden hier nicht angetastet: Ein Administrator, der einem
  // Betrieb beitritt, wuerde sonst zum Mitarbeiter herabgestuft.
  if (['ADMIN', 'SUPER_ADMIN', 'EDITOR'].includes(person.role)) {
    throw errors.conflict(
      'Diese Person hat eine Rolle, die sich hier nicht ändern lässt. Bitte an die ' +
        'Administration wenden.',
    );
  }

  await prisma.user.update({
    where: { id: person.id },
    data: { dealerId, role },
  });

  const aktualisiert = await prisma.user.findUnique({
    where: { id: person.id },
    select: {
      id: true,
      email: true,
      displayName: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });
  if (!aktualisiert) throw errors.notFound();
  return aktualisiert;
}

/**
 * Aendert die Rolle eines Mitarbeiters.
 *
 * Die Bedingung enthaelt die Haendlerkennung -- ohne sie liesse sich mit
 * einer fremden Benutzerkennung die Rolle irgendeiner Person aendern.
 */
export async function setDealerMemberRole(
  dealerId: string,
  userId: string,
  role: 'DEALER_STAFF' | 'DEALER_OWNER',
): Promise<void> {
  if (role === 'DEALER_STAFF') await pruefeLetzterInhaber(dealerId, userId);

  const geaendert = await prisma.user.updateMany({
    where: { id: userId, dealerId, role: { in: ['DEALER_STAFF', 'DEALER_OWNER'] } },
    data: { role },
  });
  if (geaendert.count === 0) throw errors.notFound();
}

export async function removeDealerMember(dealerId: string, userId: string): Promise<void> {
  await pruefeLetzterInhaber(dealerId, userId);

  const geaendert = await prisma.user.updateMany({
    where: { id: userId, dealerId, role: { in: ['DEALER_STAFF', 'DEALER_OWNER'] } },
    data: { dealerId: null, role: 'USER' },
  });
  if (geaendert.count === 0) throw errors.notFound();
}

/**
 * Verhindert, dass der letzte Inhaber verschwindet.
 *
 * Ohne diese Pruefung liesse sich ein Betrieb in einen Zustand bringen, aus
 * dem ihn nur noch die Administration befreit: Mitarbeiter ohne Rechte, das
 * Profil unveraenderlich, niemand kann jemanden aufnehmen.
 */
async function pruefeLetzterInhaber(dealerId: string, userId: string): Promise<void> {
  const betroffene = await prisma.user.findFirst({
    where: { id: userId, dealerId },
    select: { role: true },
  });
  if (betroffene?.role !== 'DEALER_OWNER') return;

  const inhaber = await prisma.user.count({ where: { dealerId, role: 'DEALER_OWNER' } });
  if (inhaber <= 1) {
    throw errors.conflict(
      'Das ist der letzte Inhaber dieses Betriebs. Bitte zuerst eine andere Person zum ' +
        'Inhaber machen — sonst könnte niemand mehr das Profil oder die Mitarbeiter ändern.',
    );
  }
}

/** Anzeigen eines Haendlers, alle Zustaende. */
export async function listDealerListings(dealerId: string) {
  return prisma.listing.findMany({
    where: { dealerId, status: { not: 'DELETED' } },
    orderBy: { updatedAt: 'desc' },
    take: 200,
    select: {
      id: true,
      slug: true,
      title: true,
      vehicleLabel: true,
      status: true,
      priceCents: true,
      mileageKm: true,
      viewCount: true,
      publishedAt: true,
      expiresAt: true,
      soldAt: true,
      createdAt: true,
      seller: { select: { displayName: true } },
      images: { orderBy: { position: 'asc' }, take: 1, select: { storageKey: true } },
      _count: { select: { images: true } },
    },
  });
}

/** Kennzahlen eines Haendlers. */
export async function dealerStatistics(dealerId: string, jetzt: Date): Promise<Kennzahl[]> {
  const anzeigen = await prisma.listing.findMany({
    where: { dealerId, status: { not: 'DELETED' } },
    select: { status: true, publishedAt: true, soldAt: true, viewCount: true },
  });

  const bestand = {
    entwuerfe: anzeigen.filter((a) => a.status === 'DRAFT').length,
    aktiv: anzeigen.filter((a) => a.status === 'ACTIVE').length,
    pausiert: anzeigen.filter((a) => a.status === 'PAUSED').length,
    verkauft: anzeigen.filter((a) => a.status === 'SOLD').length,
    abgelaufen: anzeigen.filter((a) => a.status === 'EXPIRED').length,
  };

  const abgeschlosseneTage = anzeigen
    .filter((a) => a.status === 'SOLD' && a.publishedAt && a.soldAt)
    .map((a) => tageZwischen(a.publishedAt as Date, a.soldAt as Date));

  const laufendeTage = anzeigen
    .filter((a) => a.status === 'ACTIVE' && a.publishedAt)
    .map((a) => tageZwischen(a.publishedAt as Date, jetzt));

  const aufrufe = anzeigen.reduce((summe, a) => summe + a.viewCount, 0);

  /*
   * Tokenverbrauch der Mitarbeiter. Das ist eine Naeherung und wird als
   * solche benannt: Ein Mitarbeiter kann Guthaben auch privat verbrauchen,
   * und die Buchungen haengen am Konto der Person, nicht am Betrieb.
   */
  const buchungen = await prisma.tokenTransaction.findMany({
    where: { wallet: { user: { dealerId } }, amountTokens: { lt: 0 } },
    select: { amountTokens: true, type: true, reference: true },
  });

  const verbrauchteTokens = buchungen.reduce((summe, b) => summe + Math.abs(b.amountTokens), 0);
  const kiTexte = buchungen.filter((b) => b.reference?.startsWith('listing-text:')).length;
  const bewertungen = buchungen.filter((b) => b.reference?.startsWith('valuation:')).length;

  return baueStatistik({
    bestand,
    standzeit: { abgeschlosseneTage, laufendeTage },
    aufrufe,
    verbrauchteTokens,
    kiTexte,
    bewertungen,
  });
}
