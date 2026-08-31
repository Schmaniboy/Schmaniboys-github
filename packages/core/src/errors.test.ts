import { describe, expect, it } from 'vitest';

import { AppError, ErrorCode, errors, toAppError } from './errors';

describe('Fehlertaxonomie', () => {
  it('liefert Meldungen zu Eingabefehlern aus', () => {
    const fehler = errors.validation({ email: ['Ungueltig.'] });
    expect(fehler.status).toBe(400);
    expect(fehler.toPublicJSON().error.issues?.email).toEqual(['Ungueltig.']);
  });

  it('haelt interne Meldungen zurueck', () => {
    /*
     * Der Text darf Implementierungsdetails enthalten -- deshalb erreicht er
     * den Client nicht.
     */
    const fehler = errors.internal(new Error('Verbindung zu 10.0.0.5 abgelehnt'));
    expect(fehler.status).toBe(500);
    expect(fehler.toPublicJSON().error.message).not.toContain('10.0.0.5');
  });

  it('liefert Betriebsmeldungen bei 501 und 503 aus', () => {
    /*
     * Zuerst galt schlicht "5xx bleibt intern". Das verschluckte genau die
     * Meldungen, die einer wartenden Person erklaeren, warum eine Funktion
     * nicht laeuft -- und dass sie nichts bezahlt hat.
     */
    const nichtVerfuegbar = new AppError(ErrorCode.NOT_IMPLEMENTED, {
      message: 'Noch nicht verfügbar. Es wurde kein Guthaben verbraucht.',
    });
    expect(nichtVerfuegbar.status).toBe(501);
    expect(nichtVerfuegbar.toPublicJSON().error.message).toContain('kein Guthaben');

    const ueberlastet = new AppError(ErrorCode.SERVICE_UNAVAILABLE, {
      message: 'Gerade überlastet. Es wurde kein Guthaben verbraucht.',
    });
    expect(ueberlastet.toPublicJSON().error.message).toContain('kein Guthaben');
  });

  it('macht aus unbekannten Fehlern eine nichtssagende 500', () => {
    const fehler = toAppError(new Error('irgendetwas Internes'));
    expect(fehler.code).toBe(ErrorCode.INTERNAL);
    expect(fehler.toPublicJSON().error.message).not.toContain('irgendetwas');
  });

  it('laesst einen AppError unveraendert durch', () => {
    const original = errors.notFound('Nicht da.');
    expect(toAppError(original)).toBe(original);
  });

  it('fuehrt bei Ratenbegrenzung die Wartezeit mit', () => {
    expect(errors.rateLimited(42).retryAfterSeconds).toBe(42);
  });
});
