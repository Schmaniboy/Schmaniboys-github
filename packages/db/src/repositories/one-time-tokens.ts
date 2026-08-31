import {
  MAX_OFFENE_TOKEN,
  type TokenPurpose,
  ablaufZeitpunkt,
  generateToken,
  hashToken,
} from '@ap/core';

import { prisma } from '../client';

/**
 * Einmal-Token in der Datenbank.
 *
 * Gespeichert wird ausschliesslich der Hash. Der Klartext verlaesst diese
 * Funktion einmal -- in die E-Mail -- und ist danach nicht mehr
 * rekonstruierbar. Ein Datenbankleck gibt damit keine gueltigen Links preis.
 */

export interface AusgestellterToken {
  /** Der Klartext. Geht in die E-Mail und wird nirgends gespeichert. */
  token: string;
  expiresAt: Date;
}

/**
 * Stellt einen Token aus -- oder nicht, wenn schon zu viele offen sind.
 *
 * Die Grenze schuetzt fremde Posteingaenge: Ohne sie liesse sich eine
 * beliebige Adresse mit Zuruecksetzmails fluten, und die Adresse muesste
 * dafuer nicht einmal einem Konto gehoeren -- das merkt der Absender ja
 * nicht.
 */
export async function stelleTokenAus(input: {
  userId: string;
  purpose: TokenPurpose;
  jetzt: Date;
  ipHash?: string | null | undefined;
}): Promise<AusgestellterToken | null> {
  const offen = await prisma.oneTimeToken.count({
    where: {
      userId: input.userId,
      purpose: input.purpose,
      usedAt: null,
      expiresAt: { gt: input.jetzt },
    },
  });

  if (offen >= MAX_OFFENE_TOKEN) return null;

  const klartext = generateToken();
  const expiresAt = ablaufZeitpunkt(input.purpose, input.jetzt);

  await prisma.oneTimeToken.create({
    data: {
      tokenHash: hashToken(klartext),
      userId: input.userId,
      purpose: input.purpose,
      expiresAt,
      requestedFromIpHash: input.ipHash ?? null,
    },
  });

  return { token: klartext, expiresAt };
}

export async function findeToken(klartext: string) {
  return prisma.oneTimeToken.findUnique({
    where: { tokenHash: hashToken(klartext) },
    select: {
      id: true,
      userId: true,
      purpose: true,
      expiresAt: true,
      usedAt: true,
      user: { select: { id: true, email: true, displayName: true, status: true } },
    },
  });
}

/**
 * Verbraucht einen Token -- genau einmal.
 *
 * Das bedingte UPDATE ist der Kern: Zwei gleichzeitige Aufrufe mit demselben
 * Link koennen nicht beide gewinnen. Ohne das liesse sich ein
 * Zuruecksetzlink parallel zweimal einloesen.
 */
export async function verbraucheToken(id: string, jetzt: Date): Promise<boolean> {
  const ergebnis = await prisma.oneTimeToken.updateMany({
    where: { id, usedAt: null, expiresAt: { gt: jetzt } },
    data: { usedAt: jetzt },
  });
  return ergebnis.count === 1;
}

/**
 * Alle offenen Token eines Zwecks entwerten.
 *
 * Nach einer Passwortaenderung: Wer den alten Zuruecksetzlink noch hat, soll
 * ihn nicht mehr verwenden koennen.
 */
export async function entwerteToken(
  userId: string,
  purpose: TokenPurpose,
  jetzt: Date,
): Promise<number> {
  const ergebnis = await prisma.oneTimeToken.updateMany({
    where: { userId, purpose, usedAt: null },
    data: { usedAt: jetzt },
  });
  return ergebnis.count;
}

/** Abgelaufene Token aufraeumen. Fuer einen Wartungslauf. */
export async function loescheAbgelaufeneToken(vor: Date): Promise<number> {
  const ergebnis = await prisma.oneTimeToken.deleteMany({
    where: { expiresAt: { lt: vor } },
  });
  return ergebnis.count;
}

/** Setzt die Adresse als bestaetigt. Idempotent. */
export async function markiereEmailBestaetigt(userId: string, jetzt: Date): Promise<void> {
  await prisma.user.updateMany({
    where: { id: userId, emailVerifiedAt: null },
    data: { emailVerifiedAt: jetzt },
  });
}

/**
 * Setzt ein neues Passwort und beendet alle Sitzungen.
 *
 * Das Beenden gehoert dazu und ist keine Bequemlichkeitsfrage: Wer sein
 * Passwort zuruecksetzt, weil jemand anders Zugriff hatte, will genau das --
 * dass dieser Zugriff endet.
 */
export async function setzePasswortUndBeendeSitzungen(input: {
  userId: string;
  passwordHash: string;
  jetzt: Date;
}): Promise<void> {
  await prisma.$transaction([
    prisma.user.update({
      where: { id: input.userId },
      data: {
        passwordHash: input.passwordHash,
        // Eine Sperre nach Fehlversuchen ist mit dem neuen Passwort erledigt.
        failedLoginCount: 0,
        lockedUntil: null,
      },
    }),
    prisma.session.deleteMany({ where: { userId: input.userId } }),
    prisma.oneTimeToken.updateMany({
      where: { userId: input.userId, purpose: 'PASSWORD_RESET', usedAt: null },
      data: { usedAt: input.jetzt },
    }),
  ]);
}

/** Sucht eine Person ueber die Adresse. Fuer die Zuruecksetz-Anfrage. */
export async function findeBenutzerFuerZuruecksetzung(email: string) {
  return prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, displayName: true, status: true },
  });
}
