import { errors, type Role } from '@ap/core';

import { type Prisma, prisma } from '../client';

/**
 * Lesende und schreibende Zugriffe der Verwaltung.
 *
 * Die Rechtepruefung liegt vollstaendig davor (`packages/core/src/admin/`)
 * und in den Route Handlern. Hier steht nur, WIE etwas geschieht -- und
 * dass jede Massnahme ihre Begruendung mitfuehrt.
 */

export async function countSuperAdmins(): Promise<number> {
  return prisma.user.count({ where: { role: 'SUPER_ADMIN' } });
}

export interface AdminUserRow {
  id: string;
  email: string;
  displayName: string;
  role: string;
  status: string;
  dealerId: string | null;
  dealerName: string | null;
  createdAt: Date;
  listings: number;
  balanceTokens: number;
}

export async function searchUsers(input: {
  suche?: string | undefined;
  rolle?: string | undefined;
  seite: number;
}): Promise<{ zeilen: AdminUserRow[]; gesamt: number }> {
  const where: Prisma.UserWhereInput = {
    ...(input.rolle ? { role: input.rolle as Prisma.EnumRoleFilter['equals'] } : {}),
    ...(input.suche
      ? {
          OR: [
            { email: { contains: input.suche, mode: 'insensitive' } },
            { displayName: { contains: input.suche, mode: 'insensitive' } },
          ],
        }
      : {}),
  };

  const [personen, gesamt] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: input.seite * 50,
      take: 50,
      select: {
        id: true,
        email: true,
        displayName: true,
        role: true,
        status: true,
        dealerId: true,
        createdAt: true,
        dealer: { select: { name: true } },
        wallet: { select: { balanceTokens: true } },
        _count: { select: { listings: true } },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    gesamt,
    zeilen: personen.map((person) => ({
      id: person.id,
      email: person.email,
      displayName: person.displayName,
      role: person.role,
      status: person.status,
      dealerId: person.dealerId,
      dealerName: person.dealer?.name ?? null,
      createdAt: person.createdAt,
      listings: person._count.listings,
      balanceTokens: person.wallet?.balanceTokens ?? 0,
    })),
  };
}

export async function findUserRole(userId: string): Promise<Role | null> {
  const person = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  return (person?.role as Role) ?? null;
}

/**
 * Setzt eine Rolle.
 *
 * Beim Wechsel weg von einer Haendlerrolle wird die Betriebszugehoerigkeit
 * geloest: Eine Person mit Rolle EDITOR und einer Haendlerkennung waere ein
 * Zustand, den die Mandantentrennung nicht vorsieht.
 */
export async function setUserRole(userId: string, rolle: Role): Promise<void> {
  const haendlerrolle = rolle === 'DEALER_OWNER' || rolle === 'DEALER_STAFF';
  const geaendert = await prisma.user.updateMany({
    where: { id: userId },
    data: { role: rolle, ...(haendlerrolle ? {} : { dealerId: null }) },
  });
  if (geaendert.count === 0) throw errors.notFound();
}

export async function setUserStatus(
  userId: string,
  status: 'ACTIVE' | 'BLOCKED',
): Promise<void> {
  const geaendert = await prisma.user.updateMany({ where: { id: userId }, data: { status } });
  if (geaendert.count === 0) throw errors.notFound();

  /*
   * Ein gesperrtes Konto verliert seine Sitzungen. Ohne das bliebe die
   * Sperre wirkungslos, bis die Sitzung von selbst ablaeuft -- bei einer
   * Woche Laufzeit also lange.
   */
  if (status === 'BLOCKED') {
    await prisma.session.deleteMany({ where: { userId } });
  }
}

/** Anzeigen fuer die Moderation, ueber alle Personen hinweg. */
export async function moderationListings(input: { status?: string | undefined; seite: number }) {
  const where: Prisma.ListingWhereInput = input.status
    ? { status: input.status as Prisma.EnumListingStatusFilter['equals'] }
    : {};

  const [zeilen, gesamt] = await Promise.all([
    prisma.listing.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      skip: input.seite * 50,
      take: 50,
      select: {
        id: true,
        slug: true,
        title: true,
        vehicleLabel: true,
        status: true,
        priceCents: true,
        viewCount: true,
        createdAt: true,
        seller: { select: { id: true, displayName: true, email: true } },
        dealer: { select: { name: true } },
      },
    }),
    prisma.listing.count({ where }),
  ]);

  return { zeilen, gesamt };
}

/**
 * Nimmt eine Anzeige aus dem Marktplatz.
 *
 * Der Zustand PAUSED statt DELETED: Die Moderation entzieht die
 * Sichtbarkeit, sie loescht nicht das Eigentum. Wird der Verdacht ausgeraeumt,
 * stellt dieselbe Massnahme sie zurueck.
 */
export async function moderateListing(input: {
  listingId: string;
  aktion: 'HIDE' | 'RESTORE';
  grund: string;
  actorId: string;
}): Promise<void> {
  const geaendert = await prisma.listing.updateMany({
    where: { id: input.listingId, status: { notIn: ['DELETED', 'SOLD'] } },
    data: { status: input.aktion === 'HIDE' ? 'PAUSED' : 'ACTIVE' },
  });
  if (geaendert.count === 0) throw errors.notFound();
}

export async function moderateMessage(input: {
  messageId: string;
  aktion: 'HIDE' | 'RESTORE';
  grund: string;
  jetzt: Date;
}): Promise<void> {
  const geaendert = await prisma.message.updateMany({
    where: { id: input.messageId },
    data:
      input.aktion === 'HIDE'
        ? { hiddenAt: input.jetzt, hiddenReason: input.grund }
        : { hiddenAt: null, hiddenReason: null },
  });
  if (geaendert.count === 0) throw errors.notFound();
}

/** Gemeldete oder auffaellige Gespraeche. */
export async function moderationConversations(seite: number) {
  const [zeilen, gesamt] = await Promise.all([
    prisma.conversation.findMany({
      orderBy: { lastMessageAt: 'desc' },
      skip: seite * 50,
      take: 50,
      select: {
        id: true,
        state: true,
        listingLabel: true,
        lastMessageAt: true,
        initiator: { select: { displayName: true, email: true } },
        recipient: { select: { displayName: true, email: true } },
        _count: { select: { messages: true } },
      },
    }),
    prisma.conversation.count(),
  ]);
  return { zeilen, gesamt };
}

/** Auszug aus dem Protokoll. */
export async function auditEntries(input: {
  action?: string | undefined;
  seite: number;
}) {
  const where: Prisma.AuditLogWhereInput = input.action ? { action: input.action } : {};

  const [zeilen, gesamt] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: input.seite * 100,
      take: 100,
      select: {
        id: true,
        action: true,
        subjectType: true,
        subjectId: true,
        metadata: true,
        createdAt: true,
        actor: { select: { displayName: true, email: true } },
      },
    }),
    prisma.auditLog.count({ where }),
  ]);

  return { zeilen, gesamt };
}

/** Kennzahlen der Plattform fuer die Adminuebersicht. */
export async function platformOverview(jetzt: Date) {
  const vor24h = new Date(jetzt.getTime() - 24 * 60 * 60 * 1000);

  const [
    personen,
    gesperrte,
    haendler,
    anzeigenAktiv,
    anzeigenGesamt,
    gespraeche,
    nachrichten24h,
    rechnungen,
    kiAufrufe,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { status: 'BLOCKED' } }),
    prisma.dealer.count({ where: { status: 'ACTIVE' } }),
    prisma.listing.count({ where: { status: 'ACTIVE' } }),
    prisma.listing.count({ where: { status: { not: 'DELETED' } } }),
    prisma.conversation.count(),
    prisma.message.count({ where: { createdAt: { gte: vor24h } } }),
    prisma.invoice.count(),
    prisma.auditLog.count({ where: { action: 'ai.invoked' } }),
  ]);

  return {
    personen,
    gesperrte,
    haendler,
    anzeigenAktiv,
    anzeigenGesamt,
    gespraeche,
    nachrichten24h,
    rechnungen,
    kiAufrufe,
  };
}

/**
 * Sicherheitsrelevante Ereignisse der letzten Zeit.
 *
 * Ausgewaehlt statt "alles": Eine Liste, in der jeder Katalogeintrag steht,
 * liest niemand -- und dann faellt auch das Wesentliche nicht auf.
 */
const SICHERHEITSEREIGNISSE = [
  'auth.login_failed',
  'role.assigned',
  'admin.user_blocked',
  'payment.failed',
  'wallet.adjusted',
  'listing.moderated',
];

export async function securityEvents(seit: Date) {
  return prisma.auditLog.findMany({
    where: { action: { in: SICHERHEITSEREIGNISSE }, createdAt: { gte: seit } },
    orderBy: { createdAt: 'desc' },
    take: 200,
    select: {
      id: true,
      action: true,
      subjectType: true,
      subjectId: true,
      ipHash: true,
      metadata: true,
      createdAt: true,
      actor: { select: { displayName: true, email: true } },
    },
  });
}
