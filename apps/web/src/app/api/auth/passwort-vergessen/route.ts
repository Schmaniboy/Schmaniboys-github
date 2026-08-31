import { z } from 'zod';

import { ZURUECKSETZEN_ANTWORT, email, systemClock, zuruecksetzMail } from '@ap/core';
import { auditLogger, findeBenutzerFuerZuruecksetzung, stelleTokenAus } from '@ap/db';

import { ok, route } from '@/lib/api';
import { env } from '@/lib/env';
import { mailer } from '@/lib/mail';

const eingabe = z.object({ email });

/**
 * Passwort zuruecksetzen anfordern.
 *
 * Die eine Regel, die hier alles bestimmt: **Die Antwort ist immer
 * dieselbe.** Ob es das Konto gibt, ob es gesperrt ist, ob schon zu viele
 * Links offen sind -- der Aufrufer erfaehrt es nicht.
 *
 * Wer "Passwort vergessen" mit einer fremden Adresse absendet und daraufhin
 * "unbekannte Adresse" liest, hat gerade erfahren, wer hier kein Konto hat.
 * Damit laesst sich eine Adressliste durchprobieren.
 *
 * Auch die ANTWORTZEIT verraet nichts: Der Versand laeuft, aber sein
 * Ergebnis aendert die Antwort nicht.
 */
export const POST = route(
  async (context) => {
    const eingegeben = await context.body(eingabe);
    const jetzt = systemClock.now();

    const person = await findeBenutzerFuerZuruecksetzung(eingegeben.email);

    /*
     * Gesperrte Konten bekommen keinen Link: Ein Zuruecksetzen waere ein Weg
     * zurueck in ein Konto, das aus gutem Grund gesperrt wurde.
     */
    if (person && person.status === 'ACTIVE') {
      const ausgestellt = await stelleTokenAus({
        userId: person.id,
        purpose: 'PASSWORD_RESET',
        jetzt,
        ipHash: context.ipHash,
      });

      if (ausgestellt) {
        const link = `${env.APP_URL}/passwort-neu?token=${encodeURIComponent(ausgestellt.token)}`;
        const nachricht = zuruecksetzMail(link, person.displayName);

        try {
          await mailer.send({
            to: person.email,
            subject: nachricht.subject,
            text: nachricht.text,
          });
        } catch (fehler) {
          /*
           * Ein fehlgeschlagener Versand wird protokolliert, aendert aber
           * die Antwort nicht -- sonst waere der Unterschied wieder eine
           * Auskunft darueber, ob es das Konto gibt.
           */
          await auditLogger.record({
            action: 'auth.password_reset_mail_failed',
            actorId: person.id,
            subjectType: 'User',
            subjectId: person.id,
            metadata: { grund: fehler instanceof Error ? fehler.message : 'unbekannt' },
          });
        }
      }

      await auditLogger.record({
        action: 'auth.password_reset_requested',
        actorId: person.id,
        subjectType: 'User',
        subjectId: person.id,
        metadata: { ausgestellt: Boolean(ausgestellt) },
      });
    }

    return ok({ message: ZURUECKSETZEN_ANTWORT });
  },
  {
    auth: 'none',
    /*
     * Streng begrenzt, und zwar je Adresse des Aufrufers. Ohne das liesse
     * sich der Posteingang einer beliebigen Person fluten -- oder eine
     * Adressliste durchprobieren.
     */
    rateLimit: { limit: 5, windowSeconds: 3600, scope: 'auth:passwort-vergessen' },
  },
);
