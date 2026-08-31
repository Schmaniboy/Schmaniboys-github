import { z } from 'zod';

import {
  MAX_NACHRICHTEN_JE_STUNDE,
  Permission,
  errors,
  findeWarnzeichen,
  systemClock,
} from '@ap/core';
import {
  countRecentMessages,
  findOwnConversation,
  listMessages,
  markConversationRead,
  sendMessage,
  setConversationState,
} from '@ap/db';

import { created, ok, route } from '@/lib/api';

const pfad = z.object({ id: z.string().min(1) });
const senden = z.object({ body: z.string().min(1).max(20_000) });
const zustand = z.object({ state: z.enum(['OPEN', 'CLOSED']) });

/**
 * Ein Gespraech lesen, darin schreiben, es schliessen.
 *
 * Wer nicht beteiligt ist, bekommt "nicht gefunden" -- nicht "verboten".
 * Die Pruefung liegt in der Domaenenschicht und zusaetzlich in jeder
 * WHERE-Bedingung.
 */
export const GET = route(
  async (context) => {
    const { id } = await context.params(pfad);
    const userId = context.userId();

    const gespraech = await findOwnConversation(id, userId);
    if (!gespraech) throw errors.notFound();

    const nachrichten = await listMessages(id, userId);
    await markConversationRead(id, userId, systemClock.now());

    /*
     * Warnzeichen werden bei jedem Lesen frisch berechnet, nicht gespeichert:
     * Die Muster koennen sich aendern, und ein alter Befund waere dann
     * falsch. Sie fuehren ausdruecklich zu einem Hinweis, nicht zu einer
     * Sperre.
     */
    const fremdeTexte = nachrichten
      .filter((nachricht) => nachricht.senderId !== userId && nachricht.body)
      .map((nachricht) => nachricht.body ?? '')
      .join('\n');

    return ok({
      conversation: gespraech,
      messages: nachrichten,
      warnungen: findeWarnzeichen(fremdeTexte),
    });
  },
  { permission: Permission.MESSAGE_READ_OWN },
);

export const POST = route(
  async (context) => {
    const { id } = await context.params(pfad);
    const { body } = await context.body(senden);
    const userId = context.userId();
    const jetzt = systemClock.now();

    const seit = new Date(jetzt.getTime() - 60 * 60 * 1000);
    if ((await countRecentMessages(userId, seit)) >= MAX_NACHRICHTEN_JE_STUNDE) {
      throw errors.rateLimited(3600);
    }

    const nachricht = await sendMessage({ conversationId: id, senderId: userId, body, jetzt });
    return created({ message: nachricht });
  },
  {
    permission: Permission.MESSAGE_SEND,
    rateLimit: { limit: 120, windowSeconds: 3600, scope: 'nachrichten:senden', perUser: true },
  },
);

export const PATCH = route(
  async (context) => {
    const { id } = await context.params(pfad);
    const { state } = await context.body(zustand);
    await setConversationState(id, context.userId(), state);
    return ok({ state });
  },
  {
    permission: Permission.MESSAGE_READ_OWN,
    rateLimit: { limit: 60, windowSeconds: 3600, scope: 'nachrichten:zustand', perUser: true },
  },
);
