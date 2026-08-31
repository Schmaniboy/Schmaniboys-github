import { errors } from '../errors';

/**
 * Einmal-Token fuer E-Mail-Bestaetigung und Passwort-Zuruecksetzung.
 *
 * Die Regeln stehen hier und nicht in den Routen, weil sie an jeder Stelle
 * gleich gelten muessen -- und weil hier die eine Entscheidung faellt, die
 * bei Passwort-Zuruecksetzungen alles bestimmt:
 *
 * **Die Anfrage verraet nicht, ob es das Konto gibt.**
 *
 * Wer "Passwort vergessen" mit einer fremden Adresse absendet und daraufhin
 * "unbekannte Adresse" liest, hat gerade erfahren, wer hier kein Konto hat --
 * und wer eines hat. Das ist ein Werkzeug zum Abklopfen von Adresslisten.
 * Die Antwort ist deshalb IMMER dieselbe.
 */

export const TokenPurpose = {
  EMAIL_VERIFICATION: 'EMAIL_VERIFICATION',
  PASSWORD_RESET: 'PASSWORD_RESET',
} as const;

export type TokenPurpose = (typeof TokenPurpose)[keyof typeof TokenPurpose];

/**
 * Wie lange ein Token gilt.
 *
 * Zuruecksetzen kurz, Bestaetigung lang -- die Begruendung ist der Schaden
 * im Missbrauchsfall. Ein abgefangener Zuruecksetzlink uebernimmt das Konto;
 * ein abgefangener Bestaetigungslink bestaetigt eine Adresse, die dem
 * Angreifer ohnehin gehoert.
 */
export const TOKEN_GUELTIGKEIT_MINUTEN: Record<TokenPurpose, number> = {
  PASSWORD_RESET: 60,
  EMAIL_VERIFICATION: 60 * 24 * 7,
};

/**
 * Wie viele Token je Person und Zweck offen sein duerfen.
 *
 * Ohne Grenze liesse sich der Posteingang einer beliebigen Person mit
 * Zuruecksetzmails fluten -- die Adresse muss dafuer nicht einmal einem
 * Konto gehoeren, das merkt der Absender ja nicht.
 */
export const MAX_OFFENE_TOKEN = 3;

export interface TokenForCheck {
  purpose: TokenPurpose;
  expiresAt: Date;
  usedAt: Date | null;
}

export type TokenPruefung =
  | { gueltig: true }
  | { gueltig: false; grund: 'ABGELAUFEN' | 'VERBRAUCHT' | 'FALSCHER_ZWECK' };

/**
 * Prueft einen gefundenen Token.
 *
 * Gibt einen Grund zurueck, statt nur wahr oder falsch: Der Unterschied
 * zwischen "abgelaufen" und "bereits verwendet" ist fuer den Menschen davor
 * wichtig -- im ersten Fall fordert er einen neuen an, im zweiten hat er
 * vermutlich schon, was er wollte.
 *
 * Diese Unterscheidung ist unbedenklich: Wer den Token in der Hand hat, hat
 * die E-Mail bekommen.
 */
export function pruefeToken(
  token: TokenForCheck,
  erwarteterZweck: TokenPurpose,
  jetzt: Date,
): TokenPruefung {
  if (token.purpose !== erwarteterZweck) return { gueltig: false, grund: 'FALSCHER_ZWECK' };
  if (token.usedAt !== null) return { gueltig: false, grund: 'VERBRAUCHT' };
  if (token.expiresAt.getTime() <= jetzt.getTime()) return { gueltig: false, grund: 'ABGELAUFEN' };
  return { gueltig: true };
}

export const TOKEN_FEHLERTEXTE: Record<
  'ABGELAUFEN' | 'VERBRAUCHT' | 'FALSCHER_ZWECK' | 'UNBEKANNT',
  string
> = {
  ABGELAUFEN:
    'Dieser Link ist abgelaufen. Fordern Sie einen neuen an — der alte funktioniert nicht mehr.',
  VERBRAUCHT:
    'Dieser Link wurde bereits verwendet. Falls Sie ihn nicht selbst benutzt haben, ändern Sie ' +
    'bitte umgehend Ihr Passwort.',
  FALSCHER_ZWECK: 'Dieser Link gehört zu einem anderen Vorgang.',
  UNBEKANNT: 'Dieser Link ist ungültig. Bitte fordern Sie einen neuen an.',
};

export function ablaufZeitpunkt(zweck: TokenPurpose, jetzt: Date): Date {
  return new Date(jetzt.getTime() + TOKEN_GUELTIGKEIT_MINUTEN[zweck] * 60_000);
}

/**
 * Die Antwort auf eine Zuruecksetz-Anfrage.
 *
 * Immer dieselbe, ob es das Konto gibt oder nicht. Das ist keine
 * Unhoeflichkeit, sondern der ganze Zweck: Eine unterschiedliche Antwort
 * waere eine Auskunft darueber, wer hier ein Konto hat.
 */
export const ZURUECKSETZEN_ANTWORT =
  'Wenn zu dieser Adresse ein Konto besteht, ist eine E-Mail mit einem Link unterwegs. ' +
  'Der Link gilt eine Stunde. Sehen Sie auch im Spam-Ordner nach.';

/** Ein Token, der nicht existiert, wird wie ein ungueltiger behandelt. */
export function assertTokenGueltig(
  token: TokenForCheck | null,
  erwarteterZweck: TokenPurpose,
  jetzt: Date,
): void {
  if (!token) throw errors.validation({ token: [TOKEN_FEHLERTEXTE.UNBEKANNT] });

  const ergebnis = pruefeToken(token, erwarteterZweck, jetzt);
  if (!ergebnis.gueltig) {
    throw errors.validation({ token: [TOKEN_FEHLERTEXTE[ergebnis.grund]] });
  }
}

// ---------------------------------------------------------------------------
// Nachrichtentexte
// ---------------------------------------------------------------------------

export interface MailTexte {
  subject: string;
  text: string;
}

/**
 * Die Texte stehen in der Domaenenschicht, nicht in der Route.
 *
 * Grund: Sie enthalten Zusagen ("der Link gilt eine Stunde"), die zu den
 * Werten oben passen muessen. Stuenden sie in einer Komponente, liefe die
 * Zusage irgendwann an der Gueltigkeitsdauer vorbei.
 */
export function bestaetigungsMail(link: string, anzeigename: string): MailTexte {
  const tage = TOKEN_GUELTIGKEIT_MINUTEN.EMAIL_VERIFICATION / (60 * 24);
  return {
    subject: 'Bitte bestätigen Sie Ihre E-Mail-Adresse',
    text: [
      `Hallo ${anzeigename},`,
      '',
      'bitte bestätigen Sie Ihre E-Mail-Adresse über diesen Link:',
      '',
      link,
      '',
      `Der Link gilt ${tage} Tage.`,
      '',
      'Wenn Sie sich nicht angemeldet haben, können Sie diese Nachricht ignorieren — ',
      'ohne Bestätigung geschieht nichts weiter.',
    ].join('\n'),
  };
}

export function zuruecksetzMail(link: string, anzeigename: string): MailTexte {
  const minuten = TOKEN_GUELTIGKEIT_MINUTEN.PASSWORD_RESET;
  return {
    subject: 'Passwort zurücksetzen',
    text: [
      `Hallo ${anzeigename},`,
      '',
      'über diesen Link vergeben Sie ein neues Passwort:',
      '',
      link,
      '',
      `Der Link gilt ${minuten} Minuten und lässt sich nur einmal verwenden.`,
      '',
      'Wenn Sie das nicht angefordert haben, ignorieren Sie diese Nachricht. Ihr Passwort',
      'bleibt dann unverändert — allein durch diese E-Mail ändert sich nichts.',
    ].join('\n'),
  };
}
