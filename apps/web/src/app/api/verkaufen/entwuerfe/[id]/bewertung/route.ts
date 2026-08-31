import { z } from 'zod';

import { Permission, valuateDraft } from '@ap/core';

import { ok, route } from '@/lib/api';
import { valuationDeps } from '@/lib/sales-deps';

const pfad = z.object({ id: z.string().min(1) });

/**
 * Fahrzeugbewertung zu einem Entwurf.
 *
 * Kostenpflichtig -- aber nur, wenn tatsaechlich Marktdaten abgefragt
 * werden. Ist keine Quelle eingerichtet, kommt die Faktorenanalyse ohne
 * Eurobetrag zurueck und `charged` ist 0.
 */
export const POST = route(
  async (context) => {
    const { id } = await context.params(pfad);
    const ergebnis = await valuateDraft(valuationDeps, context.principal, id);

    return ok({ valuation: ergebnis.valuation, charged: ergebnis.charged });
  },
  {
    permission: Permission.VALUATION_USE,
    rateLimit: { limit: 30, windowSeconds: 3600, scope: 'verkaufen:bewertung', perUser: true },
  },
);
