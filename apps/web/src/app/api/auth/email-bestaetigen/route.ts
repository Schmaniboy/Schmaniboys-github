import { z } from 'zod';

import { TOKEN_FEHLERTEXTE, assertTokenGueltig, errors, systemClock } from '@ap/core';
import { auditLogger, findeToken, markiereEmailBestaetigt, verbraucheToken } from '@ap/db';

import { ok, route } from '@/lib/api';

const eingabe = z.object({ token: z.string().min(1).max(200) });

/**
 * E-Mail-Adresse bestaetigen.
 *
 * Ohne Anmeldung erreichbar: Der Link kommt aus dem Posteingang, und niemand
 * meldet sich erst an, um ihn zu oeffnen.
 */
export const POST = route(
  async (context) => {
    const { token: klartext } = await context.body(eingabe);
    const jetzt = systemClock.now();

    const token = await findeToken(klartext);
    assertTokenGueltig(token, 'EMAIL_VERIFICATION', jetzt);
    const gefunden = token as NonNullable<typeof token>;

    if (gefunden.user.status !== 'ACTIVE') {
      throw errors.validation({ token: [TOKEN_FEHLERTEXTE.UNBEKANNT] });
    }

    const gewonnen = await verbraucheToken(gefunden.id, jetzt);
    if (!gewonnen) {
      throw errors.validation({ token: [TOKEN_FEHLERTEXTE.VERBRAUCHT] });
    }

    await markiereEmailBestaetigt(gefunden.userId, jetzt);

    await auditLogger.record({
      action: 'auth.email_verified',
      actorId: gefunden.userId,
      subjectType: 'User',
      subjectId: gefunden.userId,
      metadata: {},
    });

    return ok({ message: 'Ihre E-Mail-Adresse ist bestätigt.' });
  },
  {
    auth: 'none',
    rateLimit: { limit: 20, windowSeconds: 3600, scope: 'auth:email-bestaetigen' },
  },
);
