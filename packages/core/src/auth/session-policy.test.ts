import { describe, expect, it } from 'vitest';

import { fixedClock } from '../ports/clock';

import {
  SESSION_ABSOLUTE_LIFETIME_SECONDS,
  SESSION_IDLE_TIMEOUT_SECONDS,
  isSessionExpired,
  nextExpiry,
  sessionExpiryFrom,
} from './session-policy';

const start = new Date('2026-01-01T00:00:00.000Z');
const seconds = (value: number) => value * 1000;

describe('Sitzungsregeln', () => {
  it('setzt den Ablauf auf die Leerlauffrist', () => {
    const { expiresAt } = sessionExpiryFrom(fixedClock(start));
    expect(expiresAt.getTime()).toBe(start.getTime() + seconds(SESSION_IDLE_TIMEOUT_SECONDS));
  });

  it('laesst eine frische Sitzung gelten', () => {
    const session = { createdAt: start, expiresAt: new Date(start.getTime() + seconds(3600)) };
    expect(isSessionExpired(session, fixedClock(start))).toBe(false);
  });

  it('beendet eine Sitzung nach Ablauf der Leerlauffrist', () => {
    const session = { createdAt: start, expiresAt: new Date(start.getTime() + seconds(60)) };
    const later = fixedClock(new Date(start.getTime() + seconds(61)));
    expect(isSessionExpired(session, later)).toBe(true);
  });

  it('beendet eine Sitzung nach der absoluten Laufzeit, auch bei Aktivitaet', () => {
    const session = {
      createdAt: start,
      // Bewusst weit in der Zukunft: die absolute Grenze muss trotzdem greifen.
      expiresAt: new Date(start.getTime() + seconds(SESSION_ABSOLUTE_LIFETIME_SECONDS * 10)),
    };
    const later = fixedClock(
      new Date(start.getTime() + seconds(SESSION_ABSOLUTE_LIFETIME_SECONDS + 1)),
    );
    expect(isSessionExpired(session, later)).toBe(true);
  });

  it('verlaengert nicht, solange reichlich Restlaufzeit besteht', () => {
    const session = {
      createdAt: start,
      expiresAt: new Date(start.getTime() + seconds(SESSION_IDLE_TIMEOUT_SECONDS)),
    };
    expect(nextExpiry(session, fixedClock(start))).toBeNull();
  });

  it('verlaengert kurz vor Ablauf', () => {
    const session = {
      createdAt: start,
      expiresAt: new Date(start.getTime() + seconds(3600)),
    };
    const renewed = nextExpiry(session, fixedClock(start));
    expect(renewed).not.toBeNull();
    expect((renewed as Date).getTime()).toBeGreaterThan(session.expiresAt.getTime());
  });

  it('verlaengert niemals ueber die absolute Laufzeit hinaus', () => {
    const createdAt = start;
    const nearAbsoluteEnd = new Date(
      createdAt.getTime() + seconds(SESSION_ABSOLUTE_LIFETIME_SECONDS - 3600),
    );
    const session = { createdAt, expiresAt: new Date(nearAbsoluteEnd.getTime() + seconds(600)) };
    const renewed = nextExpiry(session, fixedClock(nearAbsoluteEnd));
    const absoluteEnd = createdAt.getTime() + seconds(SESSION_ABSOLUTE_LIFETIME_SECONDS);
    if (renewed) expect(renewed.getTime()).toBeLessThanOrEqual(absoluteEnd);
  });
});
