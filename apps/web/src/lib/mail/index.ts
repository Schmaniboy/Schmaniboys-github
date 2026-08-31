import 'server-only';

import { ConsoleMailer, type Mailer, UnavailableMailer } from '@ap/core';

import { env, isProduction } from '../env';

import { SmtpMailer } from './smtp';

/**
 * Welcher Versandweg gilt.
 *
 * Die Reihenfolge ist Absicht: SMTP, wenn eingerichtet. Sonst die
 * Konsolenausgabe -- aber nur ausserhalb der Produktion und nur, wenn sie
 * ausdruecklich eingeschaltet ist. Sonst gar keiner, und der sagt das auch.
 *
 * Der Fall, den diese Reihenfolge verhindert: eine Produktivumgebung, in der
 * Passwort-Zuruecksetzlinks in ein Serverprotokoll geschrieben werden und die
 * Anwendung sich dabei als versandfaehig meldet.
 */
const smtp = new SmtpMailer({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  user: env.SMTP_USER,
  password: env.SMTP_PASSWORD,
  from: env.SMTP_FROM,
});

export const mailer: Mailer = smtp.isAvailable()
  ? smtp
  : env.MAIL_TO_CONSOLE && !isProduction
    ? new ConsoleMailer()
    : new UnavailableMailer();

/** Ob Bestaetigungen und Zuruecksetzungen ueberhaupt moeglich sind. */
export const mailVerfuegbar = mailer.isAvailable();
