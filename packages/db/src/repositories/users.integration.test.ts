import { AppError, generateToken, hashPassword, hashToken } from '@ap/core';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { prisma } from '../client';

import {
  clearFailedLogins,
  createSession,
  createUser,
  deleteAllSessionsOfUser,
  deleteExpiredSessions,
  deleteSession,
  findSessionByTokenHash,
  findUserByEmail,
  registerFailedLogin,
  touchSession,
} from './users';

/**
 * Integrationstests gegen eine echte PostgreSQL-Datenbank.
 *
 * Ohne DATABASE_URL werden sie uebersprungen statt zu scheitern -- sonst
 * blockiert eine fehlende lokale Datenbank die gesamte Testsuite.
 */
const hasDatabase = Boolean(process.env.DATABASE_URL);
const suite = hasDatabase ? describe : describe.skip;

const marker = `it-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const mailOf = (name: string) => `${name}.${marker}@example.test`;

suite('Benutzer- und Sitzungszugriff', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: { contains: marker } } });
    await prisma.$disconnect();
  });

  it('legt einen Benutzer an und findet ihn ueber die E-Mail', async () => {
    const created = await createUser({
      email: mailOf('anlegen'),
      passwordHash: await hashPassword('ein-sehr-langes-passwort'),
      displayName: 'Testperson',
    });

    expect(created.role).toBe('USER');
    expect(created.status).toBe('ACTIVE');

    const found = await findUserByEmail(mailOf('anlegen'));
    expect(found?.id).toBe(created.id);
  });

  it('normalisiert die E-Mail auf Kleinbuchstaben', async () => {
    await createUser({
      email: mailOf('GROSS').toUpperCase(),
      passwordHash: await hashPassword('ein-sehr-langes-passwort'),
      displayName: 'Testperson',
    });

    const found = await findUserByEmail(mailOf('GROSS').toUpperCase());
    expect(found).not.toBeNull();
    expect(found?.email).toBe(mailOf('GROSS').toLowerCase());
  });

  it('meldet eine doppelte Registrierung als Konflikt, nicht als 500', async () => {
    const email = mailOf('doppelt');
    const passwordHash = await hashPassword('ein-sehr-langes-passwort');
    await createUser({ email, passwordHash, displayName: 'Erste' });

    await expect(
      createUser({ email, passwordHash, displayName: 'Zweite' }),
    ).rejects.toSatisfy((error: unknown) => error instanceof AppError && error.status === 409);
  });

  it('speichert nur den Hash des Sitzungstokens', async () => {
    const user = await createUser({
      email: mailOf('sitzung'),
      passwordHash: await hashPassword('ein-sehr-langes-passwort'),
      displayName: 'Testperson',
    });

    const token = generateToken();
    const session = await createSession({
      userId: user.id,
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + 60_000),
    });

    const stored = await prisma.session.findUnique({ where: { id: session.id } });
    expect(stored?.tokenHash).not.toContain(token);
    expect(stored?.tokenHash).toBe(hashToken(token));

    const resolved = await findSessionByTokenHash(hashToken(token));
    expect(resolved?.user.id).toBe(user.id);
  });

  it('findet keine Sitzung zu einem unbekannten Token', async () => {
    expect(await findSessionByTokenHash(hashToken(generateToken()))).toBeNull();
  });

  it('verlaengert und beendet Sitzungen', async () => {
    const user = await createUser({
      email: mailOf('verlaengern'),
      passwordHash: await hashPassword('ein-sehr-langes-passwort'),
      displayName: 'Testperson',
    });

    const token = generateToken();
    const session = await createSession({
      userId: user.id,
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + 60_000),
    });

    const later = new Date(Date.now() + 120_000);
    await touchSession(session.id, later);
    const refreshed = await prisma.session.findUnique({ where: { id: session.id } });
    expect(refreshed?.expiresAt.getTime()).toBe(later.getTime());

    await deleteSession(session.id);
    expect(await findSessionByTokenHash(hashToken(token))).toBeNull();
  });

  it('verwirft beim Passwortwechsel alle Sitzungen der Person', async () => {
    const user = await createUser({
      email: mailOf('alle-sitzungen'),
      passwordHash: await hashPassword('ein-sehr-langes-passwort'),
      displayName: 'Testperson',
    });

    for (let index = 0; index < 3; index += 1) {
      await createSession({
        userId: user.id,
        tokenHash: hashToken(generateToken()),
        expiresAt: new Date(Date.now() + 60_000),
      });
    }

    expect(await deleteAllSessionsOfUser(user.id)).toBe(3);
    expect(await prisma.session.count({ where: { userId: user.id } })).toBe(0);
  });

  it('raeumt abgelaufene Sitzungen ab, laesst gueltige stehen', async () => {
    const user = await createUser({
      email: mailOf('aufraeumen'),
      passwordHash: await hashPassword('ein-sehr-langes-passwort'),
      displayName: 'Testperson',
    });

    await createSession({
      userId: user.id,
      tokenHash: hashToken(generateToken()),
      expiresAt: new Date(Date.now() - 1000),
    });
    await createSession({
      userId: user.id,
      tokenHash: hashToken(generateToken()),
      expiresAt: new Date(Date.now() + 60_000),
    });

    await deleteExpiredSessions(new Date());
    expect(await prisma.session.count({ where: { userId: user.id } })).toBe(1);
  });

  it('zaehlt Fehlversuche und setzt sie nach Erfolg zurueck', async () => {
    const user = await createUser({
      email: mailOf('fehlversuche'),
      passwordHash: await hashPassword('ein-sehr-langes-passwort'),
      displayName: 'Testperson',
    });

    await registerFailedLogin(user.id, null);
    await registerFailedLogin(user.id, new Date(Date.now() + 60_000));

    const locked = await prisma.user.findUniqueOrThrow({ where: { id: user.id } });
    expect(locked.failedLoginCount).toBe(2);
    expect(locked.lockedUntil).not.toBeNull();

    await clearFailedLogins(user.id);
    const cleared = await prisma.user.findUniqueOrThrow({ where: { id: user.id } });
    expect(cleared.failedLoginCount).toBe(0);
    expect(cleared.lockedUntil).toBeNull();
  });

  it('entfernt Sitzungen mit dem Benutzer (Fremdschluessel mit Cascade)', async () => {
    const user = await createUser({
      email: mailOf('kaskade'),
      passwordHash: await hashPassword('ein-sehr-langes-passwort'),
      displayName: 'Testperson',
    });
    await createSession({
      userId: user.id,
      tokenHash: hashToken(generateToken()),
      expiresAt: new Date(Date.now() + 60_000),
    });

    await prisma.user.delete({ where: { id: user.id } });
    expect(await prisma.session.count({ where: { userId: user.id } })).toBe(0);
  });
});
