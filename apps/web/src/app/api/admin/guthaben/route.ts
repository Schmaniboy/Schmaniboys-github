import { z } from 'zod';

import { Permission, adminCredit, adminDebit } from '@ap/core';

import { created, route } from '@/lib/api';
import { walletDeps } from '@/lib/wallet-deps';

const eingabe = z.object({
  userId: z.string().min(1),
  amountTokens: z.number().int().min(1).max(1_000_000),
  richtung: z.enum(['gutschrift', 'abbuchung']),
  grund: z.string().trim().min(5, 'Bitte einen nachvollziehbaren Grund angeben.').max(500),
  /**
   * Kennung des Vorgangs. Verhindert, dass ein wiederholter Aufruf zweimal
   * bucht -- bei Guthaben der Unterschied zwischen Korrektur und Fehler.
   */
  reference: z.string().trim().min(8).max(120),
});

/**
 * Guthabenkorrektur durch die Administration.
 *
 * Der Grund ist Pflicht und landet im Audit-Log. Wer Guthaben von Hand
 * vergibt oder abzieht, hinterlaesst eine Spur.
 */
export const POST = route(
  async (context) => {
    const input = await context.body(eingabe);

    const buchung =
      input.richtung === 'gutschrift'
        ? await adminCredit(walletDeps, context.principal, {
            userId: input.userId,
            amountTokens: input.amountTokens,
            reason: input.grund,
            reference: input.reference,
          })
        : await adminDebit(walletDeps, context.principal, {
            userId: input.userId,
            amountTokens: input.amountTokens,
            reason: input.grund,
            reference: input.reference,
          });

    return created({ transaction: buchung });
  },
  {
    permission: Permission.WALLET_ADMIN_ADJUST,
    rateLimit: { limit: 20, windowSeconds: 60, scope: 'admin-guthaben', perUser: true },
  },
);
