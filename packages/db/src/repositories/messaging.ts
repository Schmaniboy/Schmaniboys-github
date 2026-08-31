import {
  MAX_ANHAENGE_JE_NACHRICHT,
  assertBeteiligt,
  assertSchreibbar,
  errors,
  gegenseite,
  nachrichtenBenachrichtigung,
  pruefeNachricht,
  type ConversationState,
} from '@ap/core';

import { type Prisma, prisma } from '../client';

/**
 * Nachrichten.
 *
 * Die Rechtepruefung liegt in der Domaenenschicht (`assertBeteiligt`), aber
 * jede Abfrage hier traegt die Benutzerkennung zusaetzlich in der
 * WHERE-Bedingung. Das ist keine doppelte Arbeit, sondern zwei Schichten:
 * Faellt eine Pruefung beim Umbauen weg, greift die andere noch.
 */

const NACHRICHT_FELDER = {
  id: true,
  senderId: true,
  body: true,
  readAt: true,
  hiddenAt: true,
  hiddenReason: true,
  createdAt: true,
  attachments: {
    orderBy: { createdAt: 'asc' },
    select: { id: true, storageKey: true, width: true, height: true },
  },
} satisfies Prisma.MessageSelect;

const GESPRAECH_FELDER = {
  id: true,
  kind: true,
  state: true,
  listingId: true,
  listingLabel: true,
  initiatorId: true,
  recipientId: true,
  lastMessageAt: true,
  createdAt: true,
  initiator: { select: { id: true, displayName: true } },
  recipient: { select: { id: true, displayName: true } },
  listing: { select: { slug: true, status: true } },
} satisfies Prisma.ConversationSelect;

export type ConversationRecord = Prisma.ConversationGetPayload<{
  select: typeof GESPRAECH_FELDER;
}>;

/**
 * Beginnt ein Gespraech zu einer Anzeige -- oder gibt das vorhandene zurueck.
 *
 * Die Eindeutigkeitsbedingung (listingId, initiatorId) ist der eigentliche
 * Schutz: Ohne sie liesse sich dieselbe Anzeige beliebig oft anschreiben und
 * damit der Posteingang fluten.
 */
export async function startListingConversation(input: {
  listingId: string;
  initiatorId: string;
  jetzt: Date;
}): Promise<ConversationRecord> {
  const anzeige = await prisma.listing.findUnique({
    where: { id: input.listingId },
    select: { id: true, sellerId: true, status: true, expiresAt: true, vehicleLabel: true },
  });

  if (!anzeige || anzeige.status !== 'ACTIVE') {
    throw errors.notFound();
  }
  if (anzeige.sellerId === input.initiatorId) {
    throw errors.conflict('Sie können sich nicht selbst zu Ihrer eigenen Anzeige schreiben.');
  }

  const vorhanden = await prisma.conversation.findUnique({
    where: { listingId_initiatorId: { listingId: anzeige.id, initiatorId: input.initiatorId } },
    select: GESPRAECH_FELDER,
  });
  if (vorhanden) return vorhanden;

  return prisma.conversation.create({
    data: {
      kind: 'LISTING',
      listingId: anzeige.id,
      // Kopiert, damit das Gespraech lesbar bleibt, wenn die Anzeige verschwindet.
      listingLabel: anzeige.vehicleLabel,
      initiatorId: input.initiatorId,
      recipientId: anzeige.sellerId,
      lastMessageAt: input.jetzt,
    },
    select: GESPRAECH_FELDER,
  });
}

/** Ein Gespraech, an dem die Person beteiligt ist. */
export async function findOwnConversation(
  conversationId: string,
  userId: string,
): Promise<ConversationRecord | null> {
  return prisma.conversation.findFirst({
    where: { id: conversationId, OR: [{ initiatorId: userId }, { recipientId: userId }] },
    select: GESPRAECH_FELDER,
  });
}

export async function listOwnConversations(userId: string): Promise<
  (ConversationRecord & { ungelesen: number })[]
> {
  const gespraeche = await prisma.conversation.findMany({
    where: { OR: [{ initiatorId: userId }, { recipientId: userId }] },
    orderBy: { lastMessageAt: 'desc' },
    take: 100,
    select: {
      ...GESPRAECH_FELDER,
      _count: {
        select: {
          messages: { where: { readAt: null, senderId: { not: userId }, hiddenAt: null } },
        },
      },
    },
  });

  return gespraeche.map(({ _count, ...rest }) => ({ ...rest, ungelesen: _count.messages }));
}

/**
 * Nachrichten eines Gespraechs.
 *
 * Von der Moderation entfernte Nachrichten werden als entfernt ausgeliefert,
 * nicht verschwiegen: Ein Loch im Gespraechsverlauf ist verwirrender als
 * ein Hinweis.
 */
export async function listMessages(conversationId: string, userId: string) {
  const gespraech = await findOwnConversation(conversationId, userId);
  if (!gespraech) throw errors.notFound();

  const nachrichten = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'asc' },
    take: 500,
    select: NACHRICHT_FELDER,
  });

  return nachrichten.map((nachricht) => ({
    id: nachricht.id,
    senderId: nachricht.senderId,
    body: nachricht.hiddenAt ? null : nachricht.body,
    // Anhaenge einer entfernten Nachricht werden ebenfalls nicht mehr
    // ausgeliefert -- sonst waere die Entfernung nur halb.
    attachments: nachricht.hiddenAt ? [] : nachricht.attachments,
    entfernt: nachricht.hiddenAt !== null,
    /*
     * Der Grund wird den Beteiligten gezeigt, nicht nur gespeichert. Eine
     * entfernte Nachricht ohne Erklaerung laesst beide Seiten raten -- die
     * eine, warum ihre Nachricht weg ist, die andere, was darin stand.
     */
    entferntGrund: nachricht.hiddenReason,
    readAt: nachricht.readAt,
    createdAt: nachricht.createdAt,
  }));
}

/** Zaehlt, wie viele Gespraeche eine Person zuletzt begonnen hat. */
export async function countRecentConversations(userId: string, seit: Date): Promise<number> {
  return prisma.conversation.count({ where: { initiatorId: userId, createdAt: { gte: seit } } });
}

export async function countRecentMessages(userId: string, seit: Date): Promise<number> {
  return prisma.message.count({ where: { senderId: userId, createdAt: { gte: seit } } });
}

/**
 * Sendet eine Nachricht.
 *
 * Der Ablauf: beteiligt? schreibbar? Text pruefen? Dann in EINER Transaktion
 * Nachricht, Gespraechsstempel und Benachrichtigung. Ohne Transaktion gaebe
 * es Nachrichten ohne Benachrichtigung -- und niemand erfuehre davon.
 */
export async function sendMessage(input: {
  conversationId: string;
  senderId: string;
  body: string;
  jetzt: Date;
}) {
  const gespraech = await prisma.conversation.findUnique({
    where: { id: input.conversationId },
    select: {
      id: true,
      initiatorId: true,
      recipientId: true,
      state: true,
      listingLabel: true,
    },
  });
  if (!gespraech) throw errors.notFound();

  assertBeteiligt(
    { ...gespraech, state: gespraech.state as ConversationState },
    input.senderId,
  );
  assertSchreibbar({ ...gespraech, state: gespraech.state as ConversationState });

  const text = pruefeNachricht(input.body);
  const empfaenger = gegenseite(gespraech, input.senderId);

  const absender = await prisma.user.findUnique({
    where: { id: input.senderId },
    select: { displayName: true },
  });

  const [nachricht] = await prisma.$transaction([
    prisma.message.create({
      data: { conversationId: gespraech.id, senderId: input.senderId, body: text },
      select: NACHRICHT_FELDER,
    }),
    prisma.conversation.update({
      where: { id: gespraech.id },
      data: { lastMessageAt: input.jetzt },
    }),
    prisma.notification.create({
      data: {
        userId: empfaenger,
        ...nachrichtenBenachrichtigung({
          absender: absender?.displayName ?? 'Unbekannt',
          fahrzeug: gespraech.listingLabel,
          conversationId: gespraech.id,
        }),
      },
    }),
  ]);

  return nachricht;
}

/**
 * Markiert die Nachrichten der GEGENSEITE als gelesen.
 *
 * Ausdruecklich nur die der Gegenseite: Die eigenen als gelesen zu markieren
 * ergaebe keinen Sinn und verfaelschte die Zaehlung.
 */
export async function markConversationRead(
  conversationId: string,
  userId: string,
  jetzt: Date,
): Promise<number> {
  const gespraech = await findOwnConversation(conversationId, userId);
  if (!gespraech) throw errors.notFound();

  const ergebnis = await prisma.message.updateMany({
    where: { conversationId, senderId: { not: userId }, readAt: null },
    data: { readAt: jetzt },
  });
  return ergebnis.count;
}

export async function setConversationState(
  conversationId: string,
  userId: string,
  state: 'OPEN' | 'CLOSED',
): Promise<void> {
  const geaendert = await prisma.conversation.updateMany({
    where: {
      id: conversationId,
      OR: [{ initiatorId: userId }, { recipientId: userId }],
      // Ein gesperrtes Gespraech oeffnet die Moderation, nicht die Beteiligten.
      state: { not: 'BLOCKED' },
    },
    data: { state },
  });
  if (geaendert.count === 0) throw errors.notFound();
}

/* --- Benachrichtigungen -------------------------------------------------- */

export async function listNotifications(userId: string, nurUngelesene = false) {
  return prisma.notification.findMany({
    where: { userId, ...(nurUngelesene ? { readAt: null } : {}) },
    orderBy: { createdAt: 'desc' },
    take: 100,
    select: {
      id: true,
      kind: true,
      title: true,
      body: true,
      href: true,
      readAt: true,
      createdAt: true,
    },
  });
}

export async function countUnreadNotifications(userId: string): Promise<number> {
  return prisma.notification.count({ where: { userId, readAt: null } });
}

export async function markNotificationsRead(
  userId: string,
  ids: string[] | null,
  jetzt: Date,
): Promise<number> {
  const ergebnis = await prisma.notification.updateMany({
    // Die Benutzerkennung steht in der Bedingung -- ohne sie liessen sich
    // mit fremden Kennungen fremde Benachrichtigungen abhaken.
    where: { userId, readAt: null, ...(ids ? { id: { in: ids } } : {}) },
    data: { readAt: jetzt },
  });
  return ergebnis.count;
}

/**
 * Haengt ein bereits verarbeitetes Bild an eine eigene Nachricht.
 *
 * "Bereits verarbeitet" ist der Punkt: Die Route dekodiert und schreibt neu,
 * bevor sie hierher kommt. Diese Funktion legt nur den Eintrag an -- und
 * prueft dabei, dass die Nachricht der anfragenden Person gehoert und noch
 * frisch ist. Ohne die Frist liesse sich an eine Monate alte Nachricht noch
 * etwas anhaengen, das dort niemand mehr erwartet.
 */
export async function addMessageAttachment(input: {
  messageId: string;
  senderId: string;
  storageKey: string;
  width: number;
  height: number;
  byteSize: number;
  contentType: string;
  jetzt: Date;
}) {
  const frist = new Date(input.jetzt.getTime() - 10 * 60 * 1000);
  const nachricht = await prisma.message.findFirst({
    where: { id: input.messageId, senderId: input.senderId, createdAt: { gte: frist } },
    select: { id: true, _count: { select: { attachments: true } } },
  });
  if (!nachricht) throw errors.notFound();

  if (nachricht._count.attachments >= MAX_ANHAENGE_JE_NACHRICHT) {
    throw errors.conflict(
      `Mehr als ${MAX_ANHAENGE_JE_NACHRICHT} Bilder je Nachricht sind nicht vorgesehen.`,
    );
  }

  return prisma.messageAttachment.create({
    data: {
      messageId: nachricht.id,
      storageKey: input.storageKey,
      width: input.width,
      height: input.height,
      byteSize: input.byteSize,
      contentType: input.contentType,
    },
    select: { id: true, storageKey: true, width: true, height: true },
  });
}
