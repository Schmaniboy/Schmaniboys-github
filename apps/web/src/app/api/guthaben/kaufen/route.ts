import { z } from 'zod';

import { Permission, startTokenPurchase } from '@ap/core';

import { created, route } from '@/lib/api';
import { purchaseDeps } from '@/lib/billing-deps';

const eingabe = z.object({ paket: z.string().min(1).max(40) });

/**
 * Kauf beginnen.
 *
 * Ohne eingerichteten Zahlungsweg antwortet das mit 501 und einer Meldung,
 * die den Grund nennt -- und es entsteht kein Vorgang in der Datenbank.
 */
export const POST = route(
  async (context) => {
    const { paket } = await context.body(eingabe);
    const ergebnis = await startTokenPurchase(purchaseDeps, context.principal, paket);
    return created({
      reference: ergebnis.reference,
      redirectUrl: ergebnis.redirectUrl,
      amountGrossCents: ergebnis.amountGrossCents,
      tokens: ergebnis.paket.tokens,
    });
  },
  {
    permission: Permission.WALLET_PURCHASE,
    rateLimit: { limit: 20, windowSeconds: 3600, scope: 'guthaben:kaufen', perUser: true },
  },
);
