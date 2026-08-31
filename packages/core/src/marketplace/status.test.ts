import { describe, expect, it } from 'vitest';

import { AppError } from '../errors';

import {
  ALL_LISTING_STATUSES,
  ablaufDatum,
  allowedListingTransitions,
  assertListingTransition,
  canListingTransition,
  istAbgelaufen,
  istOeffentlichSichtbar,
  LAUFZEIT_TAGE,
  type ListingStatus,
} from './status';

const JETZT = new Date('2026-08-22T12:00:00Z');

function fehlerText(von: ListingStatus, nach: ListingStatus): string {
  try {
    assertListingTransition(von, nach);
    return 'kein Fehler';
  } catch (error) {
    return error instanceof AppError ? error.message : 'falscher Fehlertyp';
  }
}

describe('Anzeigenstatus', () => {
  it('kennt jeden Zustand in der Tabelle', () => {
    for (const status of ALL_LISTING_STATUSES) {
      expect(Array.isArray(allowedListingTransitions(status))).toBe(true);
    }
  });

  it('macht Verkauft und Geloescht zu Endzustaenden', () => {
    // Eine verkaufte Anzeige wieder online zu stellen waere ein zweites
    // Angebot fuer dasselbe Fahrzeug.
    for (const ziel of ALL_LISTING_STATUSES) {
      expect(canListingTransition('SOLD', ziel)).toBe(false);
      expect(canListingTransition('DELETED', ziel)).toBe(false);
    }
  });

  it('laesst pausierte und abgelaufene Anzeigen zurueck nach ACTIVE', () => {
    expect(canListingTransition('PAUSED', 'ACTIVE')).toBe(true);
    expect(canListingTransition('EXPIRED', 'ACTIVE')).toBe(true);
  });

  it('laesst einen Entwurf nicht direkt auf Verkauft springen', () => {
    expect(canListingTransition('DRAFT', 'SOLD')).toBe(false);
  });

  it('erklaert das Nein, statt nur abzulehnen', () => {
    const text = fehlerText('SOLD', 'ACTIVE');
    expect(text).toContain('Verkauft');
    expect(text).toContain('kein Wechsel mehr möglich');

    const zweiter = fehlerText('DRAFT', 'PAUSED');
    expect(zweiter).toContain('Möglich wäre');
    expect(zweiter).toContain('Online');
  });

  it('meldet einen Wechsel auf denselben Zustand als Konflikt', () => {
    expect(fehlerText('ACTIVE', 'ACTIVE')).toContain('bereits');
  });
});

describe('Laufzeit', () => {
  it('rechnet das Ablaufdatum aus der Laufzeit', () => {
    const ende = ablaufDatum(JETZT);
    const tage = (ende.getTime() - JETZT.getTime()) / (24 * 3600 * 1000);
    expect(tage).toBe(LAUFZEIT_TAGE);
  });

  it('blendet eine abgelaufene Anzeige aus, bevor der Hintergrundlauf sie umstellt', () => {
    /*
     * Zwischen dem Ablauf und dem Umstellen des Status liegt Zeit. In dieser
     * Zeit darf die Anzeige nicht mehr erscheinen -- sonst steht ein
     * abgelaufenes Angebot in der Trefferliste.
     */
    const abgelaufen = { status: 'ACTIVE' as const, expiresAt: new Date('2026-08-01T00:00:00Z') };
    expect(istAbgelaufen(abgelaufen, JETZT)).toBe(true);
    expect(istOeffentlichSichtbar(abgelaufen, JETZT)).toBe(false);
  });

  it('zeigt eine laufende Anzeige', () => {
    const laufend = { status: 'ACTIVE' as const, expiresAt: new Date('2026-10-01T00:00:00Z') };
    expect(istOeffentlichSichtbar(laufend, JETZT)).toBe(true);
  });

  it('zeigt nichts ausser ACTIVE', () => {
    for (const status of ALL_LISTING_STATUSES) {
      if (status === 'ACTIVE') continue;
      expect(istOeffentlichSichtbar({ status, expiresAt: null }, JETZT)).toBe(false);
    }
  });
});
