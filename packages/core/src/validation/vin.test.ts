import { describe, expect, it } from 'vitest';

import { extractWmi, vin, vinCheckDigit, vinRegion } from './vin';

describe('VIN-Pruefung', () => {
  it('nimmt eine formal gueltige VIN an und normalisiert sie', () => {
    const result = vin.safeParse(' wba3a5c50f5a12345 ');
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe('WBA3A5C50F5A12345');
  });

  it('lehnt die verbotenen Buchstaben I, O und Q ab', () => {
    for (const letter of ['I', 'O', 'Q']) {
      const candidate = `WBA3A5C50F5A1234${letter}`;
      expect(vin.safeParse(candidate).success).toBe(false);
    }
  });

  it('lehnt falsche Laengen ab', () => {
    expect(vin.safeParse('WBA3A5C50F5A1234').success).toBe(false);
    expect(vin.safeParse('WBA3A5C50F5A123456').success).toBe(false);
  });

  it('liest die Herstellerkennung aus den ersten drei Zeichen', () => {
    expect(extractWmi('WBA3A5C50F5A12345')).toBe('WBA');
  });

  it('ordnet die Herkunftsregion nach ISO 3780 zu', () => {
    expect(vinRegion('WBA3A5C50F5A12345')).toBe('Europa');
    expect(vinRegion('1FA3A5C50F5A12345')).toBe('Nordamerika');
    expect(vinRegion('JHM3A5C50F5A12345')).toBe('Asien');
  });

  it('behandelt eine fehlende Pruefziffer bei europaeischen VIN als nicht anwendbar', () => {
    // Europaeische Hersteller fuehren die Pruefziffer haeufig nicht --
    // ein Fehlschlag darf hier keine Ablehnung ausloesen.
    const result = vinCheckDigit('WBA3A5C50F5A12345');
    expect(['valid', 'not-applicable']).toContain(result);
  });

  it('meldet unzulaessige Zeichen als ungueltig', () => {
    expect(vinCheckDigit('WBA3A5C50F5A1234I')).toBe('invalid');
    expect(vinCheckDigit('zu-kurz')).toBe('invalid');
  });
});
