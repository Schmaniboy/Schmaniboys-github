import { hashPassword, needsRehash, verifyPassword } from '../auth/password';
import type { Principal } from '../auth/access';
import { Role } from '../auth/roles';
import {
  isSessionExpired,
  nextExpiry,
  sessionExpiryFrom,
} from '../auth/session-policy';
import { generateToken, hashToken } from '../auth/tokens';
import { AppError, ErrorCode, errors } from '../errors';
import type { AuditLogger } from '../ports/audit';
import type { Clock } from '../ports/clock';
import type {
  SessionRepository,
  StoredUser,
  UserRepository,
} from '../ports/user-repository';
import { displayName, email, password, parseOrThrow } from '../validation/common';
import { z } from 'zod';

/**
 * Anmeldevorgaenge.
 *
 * Diese Datei ist der Ort, an dem ueber Anmeldung entschieden wird -- nicht
 * der Route Handler (ADR-001). Alles Aeussere kommt ueber `AuthDeps` herein,
 * damit die Regeln ohne Datenbank pruefbar bleiben.
 */

export interface AuthDeps {
  users: UserRepository;
  sessions: SessionRepository;
  clock: Clock;
  audit: AuditLogger;
}

export interface RequestContext {
  ipHash?: string | null;
  userAgentDigest?: string | null;
}

/** Nach so vielen Fehlversuchen wird das Konto zeitweise gesperrt. */
export const MAX_FAILED_LOGINS = 8;
/** Dauer dieser Sperre. Kurz genug fuer Vertipper, lang genug gegen Raten. */
export const LOCKOUT_MINUTES = 15;

export const registerInput = z.object({
  email,
  password,
  displayName,
});

export const loginInput = z.object({
  email,
  // Beim Anmelden nur Laenge begrenzen: Aeltere Passwoerter koennen kuerzer
  // sein als die heutige Mindestlaenge, sie muessen trotzdem pruefbar bleiben.
  password: z.string().min(1).max(256),
});

export interface AuthResult {
  /** Klartext-Token. Gehoert in ein httpOnly-Cookie und nirgendwo sonst hin. */
  token: string;
  expiresAt: Date;
  principal: Principal;
  user: PublicUser;
}

export interface PublicUser {
  id: string;
  email: string;
  displayName: string;
  role: Role;
  dealerId: string | null;
}

export function toPublicUser(user: StoredUser): PublicUser {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    role: user.role,
    dealerId: user.dealerId,
  };
}

export async function register(
  deps: AuthDeps,
  rawInput: unknown,
  context: RequestContext = {},
): Promise<AuthResult> {
  const input = parseOrThrow(registerInput, rawInput);

  // Ein Passwort, das die eigene Adresse enthaelt, ist praktisch oeffentlich.
  const localPart = input.email.split('@')[0] ?? '';
  if (localPart.length >= 4 && input.password.toLowerCase().includes(localPart)) {
    throw errors.validation({
      password: ['Das Passwort darf die E-Mail-Adresse nicht enthalten.'],
    });
  }

  const user = await deps.users.create({
    email: input.email,
    passwordHash: await hashPassword(input.password),
    displayName: input.displayName,
    role: Role.USER,
  });

  await deps.audit.record({
    action: 'auth.register',
    actorId: user.id,
    subjectType: 'user',
    subjectId: user.id,
    ipHash: context.ipHash ?? null,
  });

  return startSession(deps, user, context);
}

export async function login(
  deps: AuthDeps,
  rawInput: unknown,
  context: RequestContext = {},
): Promise<AuthResult> {
  const input = parseOrThrow(loginInput, rawInput);
  const now = deps.clock.now();

  const user = await deps.users.findByEmail(input.email);

  if (!user) {
    // Gleiche Arbeit wie bei einem existierenden Konto leisten, damit die
    // Antwortzeit nicht verraet, ob die Adresse registriert ist.
    await equalizeTiming(input.password);
    await deps.audit.record({
      action: 'auth.login_failed',
      actorId: null,
      subjectType: 'user',
      subjectId: null,
      metadata: { reason: 'unbekannte-adresse' },
      ipHash: context.ipHash ?? null,
    });
    throw invalidCredentials();
  }

  if (user.lockedUntil && user.lockedUntil.getTime() > now.getTime()) {
    const retryAfterSeconds = Math.ceil((user.lockedUntil.getTime() - now.getTime()) / 1000);
    throw new AppError(ErrorCode.RATE_LIMITED, {
      message: 'Zu viele Fehlversuche. Das Konto ist voruebergehend gesperrt.',
      retryAfterSeconds,
    });
  }

  const passwordCorrect = await verifyPassword(input.password, user.passwordHash);

  if (!passwordCorrect) {
    const attempts = user.failedLoginCount + 1;
    const lockedUntil =
      attempts >= MAX_FAILED_LOGINS
        ? new Date(now.getTime() + LOCKOUT_MINUTES * 60_000)
        : null;
    await deps.users.registerFailedLogin(user.id, lockedUntil);
    await deps.audit.record({
      action: 'auth.login_failed',
      actorId: user.id,
      subjectType: 'user',
      subjectId: user.id,
      metadata: { attempts, locked: lockedUntil !== null },
      ipHash: context.ipHash ?? null,
    });
    throw invalidCredentials();
  }

  // Sperrstatus erst NACH der Passwortpruefung auswerten: sonst laesst sich
  // ueber die Fehlermeldung herausfinden, welche Konten gesperrt sind.
  if (user.status === 'BLOCKED') {
    await deps.sessions.deleteAllOfUser(user.id);
    throw errors.forbidden('Dieses Konto ist gesperrt.');
  }

  if (user.failedLoginCount > 0 || user.lockedUntil) {
    await deps.users.clearFailedLogins(user.id);
  }

  // Gelegenheit zum Nachziehen veralteter Hash-Parameter.
  if (needsRehash(user.passwordHash)) {
    await deps.users.updatePasswordHash(user.id, await hashPassword(input.password));
  }

  await deps.audit.record({
    action: 'auth.login',
    actorId: user.id,
    subjectType: 'user',
    subjectId: user.id,
    ipHash: context.ipHash ?? null,
  });

  return startSession(deps, user, context);
}

/**
 * Loest ein Sitzungstoken auf. Gibt null zurueck, wenn keine gueltige Sitzung
 * besteht -- Aufrufer entscheiden, ob daraus ein 401 wird.
 */
export async function resolveSession(
  deps: AuthDeps,
  token: string | null | undefined,
): Promise<{ principal: Principal; user: PublicUser; sessionId: string } | null> {
  if (!token) return null;

  const found = await deps.sessions.findByTokenHash(hashToken(token));
  if (!found) return null;

  const { session, user } = found;

  if (isSessionExpired(session, deps.clock)) {
    await deps.sessions.delete(session.id);
    return null;
  }

  if (user.status === 'BLOCKED') {
    await deps.sessions.deleteAllOfUser(user.id);
    return null;
  }

  const renewed = nextExpiry(session, deps.clock);
  await deps.sessions.touch(session.id, renewed);

  return {
    sessionId: session.id,
    user: toPublicUser(user),
    principal: { userId: user.id, role: user.role, dealerId: user.dealerId },
  };
}

export async function logout(
  deps: AuthDeps,
  sessionId: string,
  actorId: string,
  context: RequestContext = {},
): Promise<void> {
  await deps.sessions.delete(sessionId);
  await deps.audit.record({
    action: 'auth.logout',
    actorId,
    subjectType: 'session',
    subjectId: sessionId,
    ipHash: context.ipHash ?? null,
  });
}

async function startSession(
  deps: AuthDeps,
  user: StoredUser,
  context: RequestContext,
): Promise<AuthResult> {
  const token = generateToken();
  const { expiresAt } = sessionExpiryFrom(deps.clock);

  await deps.sessions.create({
    userId: user.id,
    tokenHash: hashToken(token),
    expiresAt,
    ipHash: context.ipHash ?? null,
    userAgentDigest: context.userAgentDigest ?? null,
  });

  return {
    token,
    expiresAt,
    user: toPublicUser(user),
    principal: { userId: user.id, role: user.role, dealerId: user.dealerId },
  };
}

/** Immer dieselbe Meldung -- sie darf nicht verraten, was genau falsch war. */
function invalidCredentials(): AppError {
  return new AppError(ErrorCode.UNAUTHENTICATED, {
    message: 'E-Mail-Adresse oder Passwort ist falsch.',
  });
}

/**
 * Fuehrt bei unbekannter Adresse dieselbe teure Rechnung aus wie bei einer
 * bekannten. Ohne das waere an der Antwortzeit ablesbar, welche Adressen
 * registriert sind.
 */
const DUMMY_HASH_PROMISE = hashPassword('platzhalter-fuer-zeitangleich');

async function equalizeTiming(candidate: string): Promise<void> {
  await verifyPassword(candidate, await DUMMY_HASH_PROMISE);
}
