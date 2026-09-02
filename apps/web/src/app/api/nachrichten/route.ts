import { z } from 'zod';

import { Permission, listConversations, startConversation } from '@ap/core';

import { created, ok, route } from '@/lib/api';
import { messagingDeps } from '@/lib/deps';

const rawBody = z.object({}).passthrough();

export const GET = route(
  async (context) => ok({ conversations: await listConversations(messagingDeps, context.userId()) }),
  { permission: Permission.MESSAGE_READ_OWN },
);

export const POST = route(
  async (context) => {
    const gespraech = await startConversation(messagingDeps, context.userId(), await context.body(rawBody));
    return created({ conversation: gespraech });
  },
  {
    permission: Permission.MESSAGE_SEND,
    rateLimit: { limit: 30, windowSeconds: 3600, scope: 'nachrichten:gespraech', perUser: true },
  },
);
