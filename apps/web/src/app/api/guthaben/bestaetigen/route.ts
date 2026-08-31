import { z } from 'zod';

import { Permission, confirmTokenPurchase, errors } from '@ap/core';
import { findPaymentIntent } from '@ap/db';

import { ok, route } from '@/lib/api';
import { confirmDeps } from '@/lib/billing-deps';

const eingabe = z.object({ reference: z.string().min(1).max(200) });

/**
 * Eine Zahlung bestaetigen.
 *
 * Aufgerufen wird das nach der Rueckkehr vom Anbieter -- aber geglaubt wird
 * der Rueckkehr nichts. Der Zustand kommt aus einer Nachfrage beim Anbieter.
 *
 * Die Besitzpruefung steht hier und nicht im Anwendungsfall: Dieser Endpunkt
 * ist von aussen erreichbar, und ohne sie liesse sich mit einer fremden
 * Vorgangskennung dessen Zustand abfragen.
 */
export const POST = route(
  async (context) => {
    const { reference } = await context.body(eingabe);
    const userId = context.userId();

    const vorgang = await findPaymentIntent(reference);
    if (!vorgang || vorgang.userId !== userId) throw errors.notFound();

    const ergebnis = await confirmTokenPurchase(confirmDeps, reference);
    return ok(ergebnis);
  },
  {
    permission: Permission.WALLET_PURCHASE,
    rateLimit: { limit: 60, windowSeconds: 3600, scope: 'guthaben:bestaetigen', perUser: true },
  },
);
