/**
 * Versandweg fuer E-Mail.
 *
 * Bewusst SMTP und kein Anbieter-SDK. SMTP ist ein Standard, kein Erzeugnis
 * einer Firma -- derselbe Adapter funktioniert mit Postmark, Brevo, Mailgun,
 * Amazon SES oder einem eigenen Server, und der Wechsel ist eine Aenderung
 * an vier Umgebungsvariablen statt an Code.
 *
 * Das ist auch der Grund, warum hier keine Anbieterentscheidung noetig war:
 * Es gibt keine zu treffen.
 *
 * Wie ueberall in dieser Anwendung gibt es eine Umsetzung fuer den Fall,
 * dass nichts eingerichtet ist -- und sie sieht nicht so aus, als liefe sie.
 */

export interface MailMessage {
  to: string;
  subject: string;
  /** Reiner Text. Pflicht -- nicht jeder liest HTML, und Filter mögen es. */
  text: string;
  /** HTML-Fassung. Optional. */
  html?: string | undefined;
}

export interface Mailer {
  /** Ob ein Versandweg eingerichtet ist. Wird vor jedem Versand geprueft. */
  isAvailable(): boolean;
  /** Bezeichnung fuer Anzeige und Protokoll. */
  readonly label: string;
  send(message: MailMessage): Promise<void>;
}

/**
 * Kein Versandweg eingerichtet.
 *
 * Wirft mit einer Meldung, die den Grund nennt. Die Alternative -- den
 * Versand still verschlucken -- waere schlimmer: Registrierungen liefen
 * scheinbar durch, und niemand bekaeme je eine Bestaetigung.
 */
export class UnavailableMailer implements Mailer {
  readonly label = 'Kein E-Mail-Versand eingerichtet';

  readonly reason =
    'Es ist kein Versandweg für E-Mail eingerichtet. Bestätigungen und das Zurücksetzen ' +
    'von Passwörtern sind deshalb nicht möglich.';

  isAvailable(): boolean {
    return false;
  }

  async send(): Promise<void> {
    throw new Error(this.reason);
  }
}

/**
 * Versand ins Protokoll, fuer die Entwicklung.
 *
 * Ausdruecklich NICHT die Voreinstellung im Betrieb: Eine Anwendung, die
 * Passwort-Zuruecksetzungen in die Konsole schreibt und sich dabei als
 * "verfuegbar" meldet, gibt Zugaenge preis. Sie wird nur genommen, wenn sie
 * ausdruecklich eingeschaltet ist, und nur ausserhalb der Produktion.
 */
export class ConsoleMailer implements Mailer {
  readonly label = 'Konsolenausgabe (nur Entwicklung)';

  isAvailable(): boolean {
    return true;
  }

  async send(message: MailMessage): Promise<void> {
    console.log(
      [
        '',
        '─── E-MAIL (nicht versendet, nur ausgegeben) ───',
        `An:      ${message.to}`,
        `Betreff: ${message.subject}`,
        '',
        message.text,
        '───────────────────────────────────────────────',
        '',
      ].join('\n'),
    );
  }
}
