import 'server-only';

import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

import type { MailMessage, Mailer } from '@ap/core';

/**
 * E-Mail-Versand ueber SMTP.
 *
 * Bewusst SMTP und kein Anbieter-SDK: SMTP ist ein Standard, kein Erzeugnis
 * einer Firma. Derselbe Adapter funktioniert mit Postmark, Brevo, Mailgun,
 * Amazon SES oder einem eigenen Server -- der Wechsel ist eine Aenderung an
 * vier Umgebungsvariablen statt an Code.
 *
 * Deshalb brauchte es hier auch keine Anbieterentscheidung: Es gibt keine zu
 * treffen.
 */

export interface SmtpConfig {
  host: string | undefined;
  port: number;
  user: string | undefined;
  password: string | undefined;
  /** Absenderadresse, etwa "CARONEX <noreply@example.de>". */
  from: string | undefined;
}

export class SmtpMailer implements Mailer {
  readonly label = 'SMTP';

  readonly #config: SmtpConfig;
  #transport: Transporter | null = null;

  constructor(config: SmtpConfig) {
    this.#config = config;
  }

  isAvailable(): boolean {
    const { host, from } = this.#config;
    return Boolean(host?.trim() && from?.trim());
  }

  #verbindung(): Transporter {
    if (!this.isAvailable()) {
      throw new Error(
        'Der E-Mail-Versand ist nicht eingerichtet: SMTP_HOST oder SMTP_FROM fehlt.',
      );
    }

    this.#transport ??= nodemailer.createTransport({
      host: this.#config.host as string,
      port: this.#config.port,
      /*
       * Port 465 spricht von der ersten Zeile an TLS, alles andere beginnt
       * im Klartext und wechselt ueber STARTTLS. `requireTLS` erzwingt
       * diesen Wechsel: Ohne das faellt der Versand auf eine unverschluesselte
       * Verbindung zurueck, wenn der Server sich als unfaehig ausgibt -- und
       * dann gehen Zuruecksetzlinks im Klartext ueber das Netz.
       */
      secure: this.#config.port === 465,
      requireTLS: this.#config.port !== 465,
      auth: this.#config.user
        ? { user: this.#config.user, pass: this.#config.password ?? '' }
        : undefined,
    });

    return this.#transport;
  }

  async send(message: MailMessage): Promise<void> {
    await this.#verbindung().sendMail({
      from: this.#config.from as string,
      to: message.to,
      subject: message.subject,
      text: message.text,
      ...(message.html ? { html: message.html } : {}),
    });
  }
}
