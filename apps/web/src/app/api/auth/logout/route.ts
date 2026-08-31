import { logout } from '@ap/core';

import { noContent, route } from '@/lib/api';
import { authDeps } from '@/lib/deps';
import { clearSessionCookie } from '@/lib/session';

export const POST = route(
  async (context) => {
    if (context.sessionId && context.principal) {
      await logout(authDeps, context.sessionId, context.principal.userId, {
        ipHash: context.ipHash,
      });
    }
    // Cookie in jedem Fall loeschen -- auch wenn die Sitzung serverseitig
    // schon weg war. Sonst bleibt ein totes Cookie im Browser stehen.
    await clearSessionCookie();
    return noContent();
  },
  { auth: 'optional' },
);
