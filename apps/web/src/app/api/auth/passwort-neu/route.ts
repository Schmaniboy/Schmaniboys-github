import { z } from 'zod';

import {
  TOKEN_FEHLERTEXTE,
  assertTokenGueltig,
  errors,
  hashPassword,
  password,
  systemClock,
} from '@ap/core';
import {
  auditLogger,
  findeToken,
  setzePasswortUndBeendeSitzungen,
  verbraucheToken,
} from '@ap/db';

import { ok, route } from '@/lib/api';

const eingabe = z.object({
  token: z.string().min(1).max(200),
  passwort: password,
});

/**
 * Neues Passwort setzen.
 *
 * Reihenfolge mit Bedacht:
 *
 *  1. Token suchen und pruefen.
 *  2. Token verbrauchen -- als bedingtes UPDATE, damit zwei gleichzeitige
 *     Aufrufe nicht beide gewinnen.
 *  3. Erst dann das Passwort setzen und alle Sitzungen beenden.
 *
 * Das Beenden gehoert dazu: Wer sein Passwort zuruecksetzt, weil jemand
 * anders Zugriff hatte, will genau das -- dass dieser Zugriff endet.
 */
export const POST = route(
  async (context) => {
    const eingegeben = await context.body(eingabe);
    const jetzt = systemClock.now();

    const token = await findeToken(eingegeben.token);
    assertTokenGueltig(token, 'PASSWORD_RESET', jetzt);

    // assertTokenGueltig hat geworfen, wenn token null waere.
    const gefunden = token as NonNullable<typeof token>;

    if (gefunden.user.status !== 'ACTIVE') {
      // Kein Weg zurueck in ein gesperrtes Konto.
      throw errors.validation({ token: [TOKEN_FEHLERTEXTE.UNBEKANNT] });
    }

    const gewonnen = await verbraucheToken(gefunden.id, jetzt);
    if (!gewonnen) {
      // Jemand war schneller -- oder derselbe Link wurde doppelt geoeffnet.
      throw errors.validation({ token: [TOKEN_FEHLERTEXTE.VERBRAUCHT] });
    }

    await setzePasswortUndBeendeSitzungen({
      userId: gefunden.userId,
      passwordHash: await hashPassword(eingegeben.passwort),
      jetzt,
    });

    await auditLogger.record({
      action: 'auth.password_changed',
      actorId: gefunden.userId,
      subjectType: 'User',
      subjectId: gefunden.userId,
      metadata: { weg: 'zuruecksetzung' },
    });

    return ok({
      message:
        'Ihr Passwort wurde geändert. Alle bestehenden Anmeldungen wurden beendet — ' +
        'bitte melden Sie sich neu an.',
    });
  },
  {
    auth: 'none',
    rateLimit: { limit: 10, windowSeconds: 3600, scope: 'auth:passwort-neu' },
  },
);
