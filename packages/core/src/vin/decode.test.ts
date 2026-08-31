import { describe, expect, it } from 'vitest';

import { decodeVin, describeDecoding, modelYearCandidates } from './decode';

const JETZT = new Date('2026-06-01T00:00:00.000Z');

describe('VIN-Auswertung', () => {
  it('liest Herstellerkennung, Region und Seriennummer', () => {
    const ergebnis = decodeVin('WBA3A5C50F5A12345', JETZT);
    expect(ergebnis.wmi).toBe('WBA');
    expect(ergebnis.region).toBe('Europa');
    expect(ergebnis.serialNumber).toBe('A12345');
    expect(ergebnis.plantCode).toBe('5');
  });

  it('normalisiert Kleinschreibung und Leerzeichen', () => {
    expect(decodeVin(' wba3a5c50f5a12345 ', JETZT).vin).toBe('WBA3A5C50F5A12345');
  });

  it('gibt beim Modelljahr Kandidaten aus, keinen einzelnen Wert', () => {
    /*
     * Der Code an Stelle 10 wiederholt sich alle 30 Jahre. "F" heisst 1985
     * ODER 2015 -- wer daraus einen Wert macht, raet.
     */
    const kandidaten = modelYearCandidates('F', JETZT);
    expect(kandidaten).toContain(2015);
    expect(kandidaten.length).toBeGreaterThan(1);
  });

  it('nennt keine Modelljahre in der Zukunft', () => {
    for (const code of 'ABCDEFGHJKLMNPRSTVWXY123456789') {
      for (const jahr of modelYearCandidates(code, JETZT)) {
        expect(jahr).toBeLessThanOrEqual(2027);
      }
    }
  });

  it('gibt bei ungueltigem Code keine Kandidaten aus', () => {
    // I, O, Q und U kommen in einer VIN nicht vor.
    for (const code of ['I', 'O', 'Q', 'U', '0', '-']) {
      expect(modelYearCandidates(code, JETZT)).toEqual([]);
    }
  });

  it('kennzeichnet die Modelljahrangabe bei europaeischen VIN als unsicher', () => {
    /*
     * Stelle 10 ist nur in Nordamerika vorgeschrieben. In Europa halten sich
     * viele Hersteller daran, manche nicht -- das gehoert dazugesagt.
     */
    expect(decodeVin('WBA3A5C50F5A12345', JETZT).modelYearReliability).toBe('unknown');
    expect(decodeVin('1FA3A5C50F5A12345', JETZT).modelYearReliability).toBe('convention');
  });

  it('sagt in der Beschreibung ausdruecklich, was NICHT in der VIN steht', () => {
    // Blocker B7 in Lesersprache -- die Einschraenkung muss beim Nutzer
    // ankommen, nicht nur im Gehirn stehen.
    const text = describeDecoding(decodeVin('WBA3A5C50F5A12345', JETZT));
    expect(text).toContain('Modell');
    expect(text).toContain('nicht in der VIN');
    expect(text).toContain('bestätigt');
  });

  it('leitet weder Modell noch Motor ab', () => {
    // Absichtlich als Test formuliert: Wer diese Felder ergaenzt, muss sich
    // fragen, woher die Angabe kommen soll.
    const ergebnis = decodeVin('WBA3A5C50F5A12345', JETZT);
    expect(Object.keys(ergebnis)).not.toContain('model');
    expect(Object.keys(ergebnis)).not.toContain('engine');
    expect(Object.keys(ergebnis)).not.toContain('generation');
  });
});
