import { type Role, errors } from '@ap/core';

import { prisma } from '../client';

/**
 * Zugriff auf Benutzer und Sitzungen.
 *
 * Die Schicht enthaelt keine fachlichen Regeln -- keine Ablaufpruefung, keine
 * Rechtepruefung, keine Sperrlogik. Sie liest und schreibt. Entschieden wird
 * in packages/core.
 */

export interface UserRecord {
  id: string;
  email: string;
  passwordHash: string;
  displayName: string;
  role: Role;
  status: 'PENDING_VERIFICATION' | 'ACTIVE' | 'BLOCKED';
  failedLoginCount: number;
  lockedUntil: Date | null;
  dealerId: string | null;
  emailVerifiedAt: Date | null;
  createdAt: Date;
}

export interface SessionRecord {
  id: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
  lastSeenAt: Date;
}

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  return prisma.user.findUnique({ where: { email: email.toLowerCase() } });
}

export async function findUserById(id: string): Promise<UserRecord | null> {
  return prisma.user.findUnique({ where: { id } });
}

export async function createUser(input: {
  email: string;
  passwordHash: string;
  displayName: string;
  role?: Role;
}): Promise<UserRecord> {
  try {
    return await prisma.user.create({
      data: {
        email: input.email.toLowerCase(),
        passwordHash: input.passwordHash,
        displayName: input.displayName,
        ...(input.role ? { role: input.role } : {}),
      },
    });
  } catch (error) {
    // P2002 = Verletzung einer Eindeutigkeitsbedingung.
    if (isUniqueViolation(error)) {
      throw errors.conflict('Diese E-Mail-Adresse ist bereits registriert.');
    }
    throw error;
  }
}

export async function updatePasswordHash(userId: string, passwordHash: string): Promise<void> {
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });
}

export async function registerFailedLogin(
  userId: string,
  lockedUntil: Date | null,
): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      failedLoginCount: { increment: 1 },
      ...(lockedUntil ? { lockedUntil } : {}),
    },
  });
}

export async function clearFailedLogins(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { failedLoginCount: 0, lockedUntil: null },
  });
}

export async function createSession(input: {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  ipHash?: string | null;
  userAgentDigest?: string | null;
}): Promise<SessionRecord> {
  return prisma.session.create({
    data: {
      userId: input.userId,
      tokenHash: input.tokenHash,
      expiresAt: input.expiresAt,
      ipHash: input.ipHash ?? null,
      userAgentDigest: input.userAgentDigest ?? null,
    },
  });
}

export interface SessionWithUser {
  session: SessionRecord;
  user: UserRecord;
}

export async function findSessionByTokenHash(tokenHash: string): Promise<SessionWithUser | null> {
  const row = await prisma.session.findUnique({
    where: { tokenHash },
    include: { user: true },
  });
  if (!row) return null;
  return { session: row, user: row.user };
}

export async function touchSession(sessionId: string, expiresAt: Date | null): Promise<void> {
  await prisma.session.update({
    where: { id: sessionId },
    data: {
      lastSeenAt: new Date(),
      ...(expiresAt ? { expiresAt } : {}),
    },
  });
}

export async function deleteSession(sessionId: string): Promise<void> {
  await prisma.session.deleteMany({ where: { id: sessionId } });
}

/** Bei Passwortwechsel und Sperrung: alle Sitzungen der Person verwerfen. */
export async function deleteAllSessionsOfUser(userId: string): Promise<number> {
  const result = await prisma.session.deleteMany({ where: { userId } });
  return result.count;
}

/** Aufraeumauftrag fuer den Worker. */
export async function deleteExpiredSessions(now: Date): Promise<number> {
  const result = await prisma.session.deleteMany({ where: { expiresAt: { lte: now } } });
  return result.count;
}

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: unknown }).code === 'P2002'
  );
}
