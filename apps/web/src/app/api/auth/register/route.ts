import { z } from 'zod';

import { bestaetigungsMail, register, systemClock } from '@ap/core';
import { auditLogger, stelleTokenAus } from '@ap/db';

import { created, route } from '@/lib/api';
import { authDeps } from '@/lib/deps';
import { env } from '@/lib/env';
import { mailer } from '@/lib/mail';
import { setSessionCookie } from '@/lib/session';

/**
 * Bewusst durchlaessig: Die fachliche Pruefung steckt in `registerInput`
 * innerhalb von core. Hier wird nur sichergestellt, dass ueberhaupt ein
 * Objekt ankommt -- die Regeln stehen nicht zweimal.
 */
const rawBody = z.object({}).passthrough();

/**
 * Registrierung.
 *
 * Der Handler validiert und entscheidet nicht selbst -- beides passiert in
 * `register` aus `packages/core` (ADR-001). Hier bleibt: aufrufen, Cookie
 * setzen, antworten.
 */
export const POST = route(
  async (context) => {
    const result = await register(authDeps, await context.body(rawBody), {
      ipHash: context.ipHash,
      userAgentDigest: context.userAgentDigest,
    });

    await setSessionCookie(result.token, result.expiresAt);

    /*
     * Bestaetigungsmail -- wenn ein Versandweg eingerichtet ist.
     *
     * Sie steht NACH dem Setzen des Cookies und ausserhalb des kritischen
     * Pfads: Eine fehlgeschlagene Zustellung darf keine Registrierung
     * zurueckdrehen, die bereits stattgefunden hat. Die Person ist
     * angemeldet, die Adresse gilt als unbestaetigt, und das steht auf der
     * Kontoseite.
     */
    let bestaetigungVersendet = false;
    if (mailer.isAvailable()) {
      try {
        const ausgestellt = await stelleTokenAus({
          userId: result.user.id,
          purpose: 'EMAIL_VERIFICATION',
          jetzt: systemClock.now(),
          ipHash: context.ipHash,
        });

        if (ausgestellt) {
          const link = `${env.APP_URL}/email-bestaetigen?token=${encodeURIComponent(
            ausgestellt.token,
          )}`;
          const nachricht = bestaetigungsMail(link, result.user.displayName);
          await mailer.send({
            to: result.user.email,
            subject: nachricht.subject,
            text: nachricht.text,
          });
          bestaetigungVersendet = true;
        }
      } catch (fehler) {
        await auditLogger.record({
          action: 'auth.verification_mail_failed',
          actorId: result.user.id,
          subjectType: 'User',
          subjectId: result.user.id,
          metadata: {
            zweck: 'bestaetigung',
            grund: fehler instanceof Error ? fehler.message : 'unbekannt',
          },
        });
      }
    }

    // Der Token gehoert ins Cookie und nirgendwo sonst hin.
    return created({ user: result.user, bestaetigungVersendet });
  },
  {
    auth: 'none',
    // Gegen automatisiertes Anlegen von Konten.
    rateLimit: { limit: 5, windowSeconds: 3600, scope: 'auth:register' },
  },
);
