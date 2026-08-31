import { describe, expect, it } from 'vitest';

import {
  formatBuildPeriod,
  formatKilograms,
  formatTowingCapacity,
  formatConsumption,
  formatDisplacement,
  formatPower,
  kwToPs,
  psToKw,
} from './units';

describe('Einheiten', () => {
  it('rechnet Kilowatt in PS nach der gesetzlichen Definition um', () => {
    // 1 PS = 735,49875 W. Bekannte Eckwerte aus Fahrzeugpapieren:
    expect(kwToPs(100)).toBe(136);
    expect(kwToPs(0)).toBe(0);
    expect(kwToPs(190)).toBe(258);
    expect(kwToPs(75)).toBe(102);
  });

  it('rechnet zurueck, ohne davonzulaufen', () => {
    for (const kw of [45, 75, 100, 140, 190, 331]) {
      expect(Math.abs(psToKw(kwToPs(kw)) - kw)).toBeLessThanOrEqual(1);
    }
  });

  it('gibt Leistung in beiden Einheiten aus', () => {
    expect(formatPower(140)).toBe('140 kW (190 PS)');
    expect(formatPower(null)).toBeNull();
    expect(formatPower(undefined)).toBeNull();
  });

  it('gibt Hubraum in Litern aus', () => {
    expect(formatDisplacement(1995)).toBe('2,0 l');
    expect(formatDisplacement(2979)).toBe('3,0 l');
    expect(formatDisplacement(null)).toBeNull();
  });

  it('unterscheidet "laeuft noch" von "nicht erfasst"', () => {
    // Das ist kein Detail: null heisst, der Wagen wird noch gebaut.
    expect(formatBuildPeriod(2012, 2019)).toBe('2012–2019');
    expect(formatBuildPeriod(2019, null)).toBe('seit 2019');
    expect(formatBuildPeriod(2019, undefined)).toBe('ab 2019');
    expect(formatBuildPeriod(2019, 2019)).toBe('2019');
    expect(formatBuildPeriod(null, 2019)).toBeNull();
  });

  it('nennt beim Verbrauch immer den Messzyklus', () => {
    // Ohne Zyklus waeren zwei Werte nicht vergleichbar.
    expect(formatConsumption(5.4, 'l/100 km', 'WLTP')).toBe('5,4 l/100 km (WLTP)');
    expect(formatConsumption(4.1, 'l/100 km', 'NEDC')).toBe('4,1 l/100 km (NEFZ)');
    expect(formatConsumption(18.2, 'kWh/100 km', 'UNKNOWN')).toContain(
      'Messzyklus nicht erfasst',
    );
    expect(formatConsumption(null, 'l/100 km', 'WLTP')).toBeNull();
  });
});

describe('Gewichte und Anhaengelast', () => {
  it('setzt Tausendertrennzeichen', () => {
    expect(formatKilograms(1585)).toBe('1.585 kg');
    expect(formatKilograms(null)).toBeNull();
  });

  it('nennt gebremste und ungebremste Anhaengelast zusammen', () => {
    // Wer nur den gebremsten Wert liest, ueberlaedt den ungebremsten Anhaenger.
    expect(formatTowingCapacity(1800, 750)).toBe('1.800 kg gebremst · 750 kg ungebremst');
  });

  it('gibt auch eine einzelne Angabe aus, statt beide zu verschweigen', () => {
    expect(formatTowingCapacity(1800, null)).toBe('1.800 kg gebremst');
    expect(formatTowingCapacity(null, 750)).toBe('750 kg ungebremst');
    expect(formatTowingCapacity(null, null)).toBeNull();
  });
});
