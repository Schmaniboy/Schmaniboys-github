import { z } from 'zod';

import { Permission, changeConversationState, readConversation, sendMessageInConversation } from '@ap/core';

import { created, ok, route } from '@/lib/api';
import { messagingDeps } from '@/lib/deps';

const pfad = z.object({ id: z.string().min(1) });
const rawBody = z.object({}).passthrough();

export const GET = route(
  async (context) => {
    const { id } = await context.params(pfad);
    const ergebnis = await readConversation(messagingDeps, id, context.userId());
    return ok(ergebnis);
  },
  { permission: Permission.MESSAGE_READ_OWN },
);

export const POST = route(
  async (context) => {
    const { id } = await context.params(pfad);
    const nachricht = await sendMessageInConversation(
      messagingDeps,
      id,
      context.userId(),
      await context.body(rawBody),
    );
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
    const ergebnis = await changeConversationState(
      messagingDeps,
      id,
      context.userId(),
      await context.body(rawBody),
    );
    return ok(ergebnis);
  },
  {
    permission: Permission.MESSAGE_READ_OWN,
    rateLimit: { limit: 60, windowSeconds: 3600, scope: 'nachrichten:zustand', perUser: true },
  },
);
