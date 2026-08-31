import { cookies } from 'next/headers';

import {
  SESSION_COOKIE_NAME,
  errors,
  type Permission,
  type Principal,
  type PublicUser,
  requirePermission,
  resolveSession,
} from '@ap/core';

import { authDeps } from './deps';
import { useSecureCookies } from './env';

/**
 * Sitzung aus dem Cookie.
 *
 * Der Klartext-Token existiert ausschliesslich im Cookie. Er ist `httpOnly`,
 * damit JavaScript ihn nicht lesen kann, und `sameSite: lax`, damit er bei
 * fremd ausgeloesten Schreibzugriffen nicht mitgeschickt wird -- das ist der
 * CSRF-Schutz fuer alle nicht-GET-Anfragen.
 */

export interface CurrentSession {
  principal: Principal;
  user: PublicUser;
  sessionId: string;
}

export async function getCurrentSession(): Promise<CurrentSession | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE_NAME)?.value ?? null;
  return resolveSession(authDeps, token);
}

/** Fuer Server Components: wirft 401, wenn niemand angemeldet ist. */
export async function requireSession(): Promise<CurrentSession> {
  const session = await getCurrentSession();
  if (!session) throw errors.unauthenticated('Server Component ohne Sitzung');
  return session;
}

/** Fuer Server Components: prueft zusaetzlich ein Recht. */
export async function requireSessionWith(permission: Permission): Promise<CurrentSession> {
  const session = await requireSession();
  requirePermission(session.principal, permission);
  return session;
}

export function sessionCookieOptions(expiresAt: Date) {
  return {
    httpOnly: true,
    secure: useSecureCookies,
    sameSite: 'lax' as const,
    path: '/',
    expires: expiresAt,
  };
}

export async function setSessionCookie(token: string, expiresAt: Date): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE_NAME, token, sessionCookieOptions(expiresAt));
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE_NAME, '', { ...sessionCookieOptions(new Date(0)), maxAge: 0 });
}
