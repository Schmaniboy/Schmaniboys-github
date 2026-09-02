import { errors } from '../errors';
import type { Clock } from '../ports/clock';
import { MAX_NACHRICHTEN_JE_STUNDE, MAX_NEUE_GESPRAECHE_JE_STUNDE, findeWarnzeichen } from '../messaging/policy';
import { parseOrThrow } from '../validation/common';
import { z } from 'zod';

const sendenInput = z.object({ body: z.string().min(1).max(20_000) });
const zustandInput = z.object({ state: z.enum(['OPEN', 'CLOSED']) });
const gespraechAnlegenInput = z.object({ listingId: z.string().min(1) });

export interface ConversationRepository {
  findOwnConversation(conversationId: string, userId: string): Promise<unknown | null>;
  listOwnConversations(userId: string): Promise<unknown[]>;
  listMessages(conversationId: string, userId: string): Promise<Array<{ senderId: string; body: string | null; [k: string]: unknown }>>;
  markConversationRead(conversationId: string, userId: string, jetzt: Date): Promise<number | void>;
  countRecentMessages(userId: string, seit: Date): Promise<number>;
  countRecentConversations(userId: string, seit: Date): Promise<number>;
  sendMessage(input: { conversationId: string; senderId: string; body: string; jetzt: Date }): Promise<unknown>;
  startListingConversation(input: { listingId: string; initiatorId: string; jetzt: Date }): Promise<unknown>;
  setConversationState(conversationId: string, userId: string, state: 'OPEN' | 'CLOSED'): Promise<void>;
}

export interface MessagingDeps {
  conversations: ConversationRepository;
  clock: Clock;
}

export async function readConversation(
  deps: MessagingDeps,
  conversationId: string,
  userId: string,
) {
  const gespraech = await deps.conversations.findOwnConversation(conversationId, userId);
  if (!gespraech) throw errors.notFound();

  const nachrichten = await deps.conversations.listMessages(conversationId, userId);
  await deps.conversations.markConversationRead(conversationId, userId, deps.clock.now());

  const fremdeTexte = nachrichten
    .filter((n) => n.senderId !== userId && n.body)
    .map((n) => n.body ?? '')
    .join('\n');

  return {
    conversation: gespraech,
    messages: nachrichten,
    warnungen: findeWarnzeichen(fremdeTexte),
  };
}

export async function sendMessageInConversation(
  deps: MessagingDeps,
  conversationId: string,
  senderId: string,
  rawInput: unknown,
) {
  const { body } = parseOrThrow(sendenInput, rawInput);
  const jetzt = deps.clock.now();

  const seit = new Date(jetzt.getTime() - 60 * 60 * 1000);
  if ((await deps.conversations.countRecentMessages(senderId, seit)) >= MAX_NACHRICHTEN_JE_STUNDE) {
    throw errors.rateLimited(3600);
  }

  return deps.conversations.sendMessage({ conversationId, senderId, body, jetzt });
}

export async function changeConversationState(
  deps: MessagingDeps,
  conversationId: string,
  userId: string,
  rawInput: unknown,
) {
  const { state } = parseOrThrow(zustandInput, rawInput);
  await deps.conversations.setConversationState(conversationId, userId, state);
  return { state };
}

export async function listConversations(deps: MessagingDeps, userId: string) {
  return deps.conversations.listOwnConversations(userId);
}

export async function startConversation(
  deps: MessagingDeps,
  userId: string,
  rawInput: unknown,
) {
  const { listingId } = parseOrThrow(gespraechAnlegenInput, rawInput);
  const jetzt = deps.clock.now();

  const seit = new Date(jetzt.getTime() - 60 * 60 * 1000);
  if ((await deps.conversations.countRecentConversations(userId, seit)) >= MAX_NEUE_GESPRAECHE_JE_STUNDE) {
    throw errors.rateLimited(3600);
  }

  return deps.conversations.startListingConversation({ listingId, initiatorId: userId, jetzt });
}
