import type { Clock } from '../ports/clock';

/**
 * Sitzungsregeln an einer Stelle, damit Cookie, Datenbank und Erneuerung
 * nicht auseinanderlaufen.
 */

export const SESSION_COOKIE_NAME = 'ap_session';

/** Gesamtlaufzeit einer Sitzung, auch bei staendiger Nutzung. */
export const SESSION_ABSOLUTE_LIFETIME_SECONDS = 60 * 60 * 24 * 30; // 30 Tage

/** Laufzeit ohne Aktivitaet. */
export const SESSION_IDLE_TIMEOUT_SECONDS = 60 * 60 * 24 * 7; // 7 Tage

/** Ab dieser Restlaufzeit wird der Ablauf beim naechsten Zugriff verlaengert. */
const RENEW_THRESHOLD_SECONDS = 60 * 60 * 24; // 1 Tag

export interface SessionTimestamps {
  createdAt: Date;
  expiresAt: Date;
}

export function sessionExpiryFrom(clock: Clock): { expiresAt: Date } {
  return {
    expiresAt: new Date(clock.now().getTime() + SESSION_IDLE_TIMEOUT_SECONDS * 1000),
  };
}

export function isSessionExpired(session: SessionTimestamps, clock: Clock): boolean {
  const now = clock.now().getTime();
  if (session.expiresAt.getTime() <= now) return true;
  const absoluteEnd =
    session.createdAt.getTime() + SESSION_ABSOLUTE_LIFETIME_SECONDS * 1000;
  return absoluteEnd <= now;
}

/**
 * Gleitende Verlaengerung, aber nie ueber die absolute Laufzeit hinaus --
 * sonst waere eine gestohlene Sitzung unbegrenzt gueltig.
 */
export function nextExpiry(session: SessionTimestamps, clock: Clock): Date | null {
  const now = clock.now().getTime();
  const remaining = session.expiresAt.getTime() - now;
  if (remaining > RENEW_THRESHOLD_SECONDS * 1000) return null;

  const absoluteEnd =
    session.createdAt.getTime() + SESSION_ABSOLUTE_LIFETIME_SECONDS * 1000;
  const proposed = now + SESSION_IDLE_TIMEOUT_SECONDS * 1000;
  const capped = Math.min(proposed, absoluteEnd);
  return capped > session.expiresAt.getTime() ? new Date(capped) : null;
}
