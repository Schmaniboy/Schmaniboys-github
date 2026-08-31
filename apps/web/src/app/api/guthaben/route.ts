import { z } from 'zod';

import { getOwnWallet, listOwnTransactions } from '@ap/core';

import { ok, route } from '@/lib/api';
import { walletDeps } from '@/lib/wallet-deps';

const abfrage = z.object({
  seite: z.coerce.number().int().min(1).max(1000).default(1),
});

const SEITENGROESSE = 25;

/**
 * Eigenes Guthaben und Buchungshistorie.
 *
 * Bewusst ohne Fremdzugriff: Diese Route liefert immer das Konto der
 * angemeldeten Person, nie ein anderes. Eine Kennung im Pfad gibt es gar
 * nicht -- so kann sie auch nicht manipuliert werden.
 */
export const GET = route(
  async (context) => {
    const { seite } = context.query(abfrage);

    const [konto, historie] = await Promise.all([
      getOwnWallet(walletDeps, context.principal),
      listOwnTransactions(walletDeps, context.principal, {
        limit: SEITENGROESSE,
        offset: (seite - 1) * SEITENGROESSE,
      }),
    ]);

    return ok({
      wallet: {
        balanceTokens: konto.balanceTokens,
        reservedTokens: konto.reservedTokens,
        availableTokens: konto.availableTokens,
      },
      transactions: historie.items,
      total: historie.total,
      page: seite,
      pageSize: SEITENGROESSE,
    });
  },
  { auth: 'required' },
);
