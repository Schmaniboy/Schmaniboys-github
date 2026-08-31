import { SESSION_COOKIE_NAME, hashPassword } from '@ap/core';
import { createUser, prisma } from '@ap/db';
import { afterAll, describe, expect, it } from 'vitest';

import { eigeneAdresse } from './helpers/adresse';

/**
 * Die Anmeldung ueber die echte Schnittstelle.
 *
 * Alle anderen Live-Tests legen ihre Sitzung direkt an (siehe
 * helpers/session.ts), weil sie sich sonst an der Ratenbegrenzung
 * gegenseitig aussperren. Damit der Endpunkt trotzdem geprueft bleibt, tut
 * es diese Datei -- mit wenigen Aufrufen und je einer eigenen
 * Aufruferadresse (siehe helpers/adresse.ts), damit ein zweiter Testlauf
 * innerhalb desselben Zeitfensters nicht am ersten scheitert.
 */

const BASE_URL = process.env.SMOKE_BASE_URL ?? 'http://127.0.0.1:3000';

const reachable = await fetch(`${BASE_URL}/api/health`, { signal: AbortSignal.timeout(2000) })
  .then((r) => r.ok)
  .catch(() => false);

const suite = reachable ? describe : describe.skip;

const marker = `anm${Date.now().toString(36)}`;
const EMAIL = `anmeldung.${marker}@example.test`;
const PASSWORT = 'ein-ausreichend-langes-passwort';

async function anmelden(passwort: string) {
  return fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: eigeneAdresse({ 'content-type': 'application/json' }),
    body: JSON.stringify({ email: EMAIL, password: passwort }),
  });
}

suite('Anmeldung', () => {
  afterAll(async () => {
    await prisma.session.deleteMany({ where: { user: { email: EMAIL } } });
    await prisma.user.deleteMany({ where: { email: EMAIL } });
    await prisma.$disconnect();
  });

  it('setzt bei richtigem Passwort ein Sitzungs-Cookie', async () => {
    await createUser({
      email: EMAIL,
      passwordHash: await hashPassword(PASSWORT),
      displayName: 'Anmeldeprobe',
      role: 'USER',
    });

    const antwort = await anmelden(PASSWORT);
    expect(antwort.status).toBe(200);

    const cookie = antwort.headers.get('set-cookie') ?? '';
    expect(cookie).toContain(`${SESSION_COOKIE_NAME}=`);
    // Gross-/Kleinschreibung der Attributwerte ist im Standard offen; Next.js
    // schreibt "lax" klein.
    expect(cookie).toContain('HttpOnly');
    expect(cookie.toLowerCase()).toContain('samesite=lax');

    // Im Cookie steht ein Zufallstoken, in der Datenbank nur dessen Hash.
    const token = cookie.split(';')[0]?.split('=')[1] ?? '';
    expect(token.length).toBeGreaterThan(20);
    const gespeichert = await prisma.session.findFirst({
      where: { user: { email: EMAIL } },
      select: { tokenHash: true },
    });
    expect(gespeichert?.tokenHash).not.toBe(token);
  });

  it('nennt bei falschem Passwort keinen Grund', async () => {
    const antwort = await anmelden('ein-ganz-anderes-passwort');
    expect(antwort.status).toBe(401);

    const inhalt = (await antwort.json()) as { error?: { message?: string } };
    const meldung = inhalt.error?.message ?? '';
    // Weder "Benutzer unbekannt" noch "Passwort falsch": Beides verriete,
    // ob es diese Adresse gibt.
    expect(meldung.toLowerCase()).not.toContain('passwort falsch');
    expect(meldung.toLowerCase()).not.toContain('unbekannt');
    expect(antwort.headers.get('set-cookie') ?? '').not.toContain(`${SESSION_COOKIE_NAME}=`);
  });
});
