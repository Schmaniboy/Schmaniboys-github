import { SESSION_COOKIE_NAME, generateToken, hashPassword, hashToken } from '@ap/core';
import type { Role } from '@ap/core';
import { createSession, createUser } from '@ap/db';

/**
 * Legt einen Benutzer an und gibt gleich ein gueltiges Sitzungs-Cookie zurueck.
 *
 * Warum nicht ueber /api/auth/login: Die Anmeldung ist bewusst auf zehn
 * Versuche je fuenf Minuten und IP-Adresse begrenzt. Das ist richtig so --
 * aber die Testlaeufe kommen alle von derselben Adresse und wuerden sich
 * gegenseitig aussperren, sobald ein paar Testdateien mehr dazukommen. Das
 * Ergebnis waere ein Testlauf, der von der Reihenfolge abhaengt.
 *
 * Die Sitzung entsteht hier auf demselben Weg wie in der Anwendung: Zufalls-
 * token ins Cookie, nur dessen Hash in die Datenbank. Wer die Anmeldung
 * selbst pruefen will, ruft den Endpunkt auf -- dafuer ist er da.
 */

const PASSWORT = 'ein-ausreichend-langes-passwort';

export async function benutzerMitSitzung(input: {
  email: string;
  displayName: string;
  role: Role;
  gueltigTage?: number;
}): Promise<{ userId: string; cookie: string; passwort: string }> {
  const benutzer = await createUser({
    email: input.email,
    passwordHash: await hashPassword(PASSWORT),
    displayName: input.displayName,
    role: input.role,
  });

  const token = generateToken();
  await createSession({
    userId: benutzer.id,
    tokenHash: hashToken(token),
    expiresAt: new Date(Date.now() + (input.gueltigTage ?? 1) * 24 * 60 * 60 * 1000),
  });

  return { userId: benutzer.id, cookie: `${SESSION_COOKIE_NAME}=${token}`, passwort: PASSWORT };
}
