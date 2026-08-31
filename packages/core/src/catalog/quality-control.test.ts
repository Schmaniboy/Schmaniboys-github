import { describe, expect, it } from 'vitest';

import {
  findeDubletten,
  gueteNachPruefung,
  istBlockiert,
  pruefeAntrieb,
  pruefeAusstattungscode,
  pruefeMotor,
  pruefeZeitraum,
  vergleichsschluessel,
} from './quality-control';

const codes = (befunde: { code: string }[]) => befunde.map((b) => b.code);

describe('Motorpruefung', () => {
  it('erkennt einen Handelsnamen im Motorcodefeld', () => {
    const befunde = pruefeMotor({ code: '2.0 TDI', fuelType: 'DIESEL' });
    expect(codes(befunde)).toContain('motor.code-form');
    expect(istBlockiert(befunde)).toBe(true);
  });

  it('laesst echte Motorcodeformen durch', () => {
    for (const code of ['DBKA', 'N47D20', 'OM651', 'CJXC', 'B48B20']) {
      const befunde = pruefeMotor({ code, fuelType: 'PETROL' });
      expect(codes(befunde)).not.toContain('motor.code-form');
    }
  });

  it('lehnt einen Elektromotor mit Turbolader und Hubraum ab', () => {
    const befunde = pruefeMotor({
      code: 'PRUEFE1',
      fuelType: 'ELECTRIC',
      aspiration: 'TURBOCHARGED',
      displacementCcm: 1600,
      cylinders: 4,
    });
    expect(codes(befunde)).toEqual(
      expect.arrayContaining([
        'motor.elektro-aufladung',
        'motor.elektro-hubraum',
        'motor.elektro-zylinder',
      ]),
    );
    expect(istBlockiert(befunde)).toBe(true);
  });

  it('erkennt eine Abgasnorm vor ihrer Zeit', () => {
    const befunde = pruefeMotor({
      code: 'PRUEFE2',
      fuelType: 'PETROL',
      emissionStandard: 'Euro 6',
      yearFrom: 1998,
    });
    expect(codes(befunde)).toContain('motor.abgasnorm-baujahr');
    expect(istBlockiert(befunde)).toBe(true);
  });

  it('erkennt Drehmoment, das nicht zur Leistung passt', () => {
    const befunde = pruefeMotor({
      code: 'PRUEFE3',
      fuelType: 'PETROL',
      powerKw: 85,
      torqueNm: 900,
    });
    expect(codes(befunde)).toContain('motor.drehmoment-leistung');
  });

  it('laesst ein uebliches Verhaeltnis von Diesel-Drehmoment zu Leistung durch', () => {
    // 110 kW und 340 Nm sind rund 3,1 Nm je kW -- fuer einen Diesel normal.
    const befunde = pruefeMotor({
      code: 'PRUEFA1',
      fuelType: 'DIESEL',
      powerKw: 110,
      torqueNm: 340,
      displacementCcm: 1968,
      cylinders: 4,
    });
    expect(codes(befunde)).not.toContain('motor.drehmoment-leistung');
  });

  it('erkennt eine unmoegliche Literleistung', () => {
    const befunde = pruefeMotor({
      code: 'PRUEFE5',
      fuelType: 'PETROL',
      displacementCcm: 1000,
      cylinders: 3,
      powerKw: 600,
    });
    expect(codes(befunde)).toContain('motor.literleistung');
  });

  it('erkennt einen verdrehten Bauzeitraum', () => {
    const befunde = pruefeMotor({
      code: 'PRUEFE6',
      fuelType: 'PETROL',
      yearFrom: 2018,
      yearTo: 2012,
    });
    expect(codes(befunde)).toContain('motor.zeitraum');
  });

  it('sagt nichts ueber die Existenz eines Codes aus', () => {
    /*
     * "ABCD" ist formal einwandfrei und mit ziemlicher Sicherheit erfunden.
     * Die Pruefung laesst ihn durch -- und genau das ist beabsichtigt: Sie
     * prueft Form, nicht Wahrheit. Wer das verwechselt, haelt einen
     * durchgelassenen Datensatz fuer bestaetigt.
     */
    const befunde = pruefeMotor({ code: 'ABCD', fuelType: 'PETROL' });
    expect(istBlockiert(befunde)).toBe(false);
  });
});

describe('Zeitraumpruefung', () => {
  it('erkennt eine Phase, die vor ihrer Generation beginnt', () => {
    const befunde = pruefeZeitraum(
      { label: 'Facelift', yearFrom: 2010 },
      { label: 'Generation', yearFrom: 2015, yearTo: 2020 },
    );
    expect(codes(befunde)).toContain('zeitraum.vor-eltern');
    expect(istBlockiert(befunde)).toBe(true);
  });

  it('laesst eine Phase innerhalb ihrer Generation durch', () => {
    const befunde = pruefeZeitraum(
      { label: 'Facelift', yearFrom: 2018, yearTo: 2020 },
      { label: 'Generation', yearFrom: 2015, yearTo: 2020 },
    );
    expect(befunde).toHaveLength(0);
  });
});

describe('Antriebspruefung', () => {
  it('meldet einen Verbrauchswert ohne Messzyklus', () => {
    const befunde = pruefeAntrieb({ consumptionCombined: 5.4 });
    expect(codes(befunde)).toContain('antrieb.verbrauch-ohne-zyklus');
  });

  it('meldet eine Leistung, die weit vom Motorwert abweicht', () => {
    const befunde = pruefeAntrieb({ powerKw: 200 }, { powerKw: 110 });
    expect(codes(befunde)).toContain('antrieb.leistung-weicht-ab');
  });

  it('laesst eine kleine Abweichung durch', () => {
    // Kombinationswerte weichen im Rahmen von ein paar Prozent regelmaessig ab.
    const befunde = pruefeAntrieb({ powerKw: 112 }, { powerKw: 110 });
    expect(codes(befunde)).not.toContain('antrieb.leistung-weicht-ab');
  });

  it('meldet ein Schaltgetriebe am Elektroantrieb', () => {
    const befunde = pruefeAntrieb({ fuelType: 'ELECTRIC', transmissionType: 'MANUAL' });
    expect(codes(befunde)).toContain('antrieb.elektro-getriebe');
  });
});

describe('Ausstattungscodes', () => {
  it('erkennt eine BMW-Bestellnummer und eine PR-Nummer als richtig geformt', () => {
    expect(
      codes(pruefeAusstattungscode({ optionCode: 'S610A', manufacturerSlug: 'bmw' })),
    ).not.toContain('ausstattung.code-form');
    expect(
      codes(pruefeAusstattungscode({ optionCode: 'PR-7X2', manufacturerSlug: 'audi' })),
    ).not.toContain('ausstattung.code-form');
  });

  it('meldet einen Code, der nicht zum Format des Herstellers passt', () => {
    expect(
      codes(pruefeAusstattungscode({ optionCode: 'PANORAMADACH', manufacturerSlug: 'bmw' })),
    ).toContain('ausstattung.code-form');
  });
});

describe('Dubletten', () => {
  it('fasst Schreibweisen derselben Ausstattung zusammen', () => {
    const gruppen = findeDubletten([
      { id: '1', label: 'Sitzheizung' },
      { id: '2', label: 'sitzheizung ' },
      { id: '3', label: 'Sitz-Heizung' },
      { id: '4', label: 'Panoramadach' },
    ]);
    expect(gruppen).toHaveLength(1);
    expect(gruppen[0]?.ids).toHaveLength(3);
  });

  it('wirft echte Unterscheidungen NICHT zusammen', () => {
    /*
     * Der gefaehrlichere Fehler waere hier, zu grob zu vereinheitlichen:
     * "vorn" und "hinten" sind keine Schreibvarianten.
     */
    const gruppen = findeDubletten([
      { id: '1', label: 'Sitzheizung vorn' },
      { id: '2', label: 'Sitzheizung hinten' },
    ]);
    expect(gruppen).toHaveLength(0);
  });

  it('vereinheitlicht Umlaute und Zeichensetzung', () => {
    expect(vergleichsschluessel('Anhängerkupplung, abnehmbar')).toBe(
      vergleichsschluessel('anhangerkupplung abnehmbar'),
    );
  });
});

describe('Guete nach der Pruefung', () => {
  it('setzt einen Datensatz mit Befund auf ZUR PRUEFUNG -- auch wenn er als belegt kam', () => {
    const guete = gueteNachPruefung('VERIFIED', [
      { severity: 'WARNING', code: 'x', message: 'y' },
    ]);
    expect(guete).toBe('NEEDS_REVIEW');
  });

  it('laesst eine saubere Angabe stehen', () => {
    expect(gueteNachPruefung('VERIFIED', [])).toBe('VERIFIED');
    expect(gueteNachPruefung('VERIFIED', [{ severity: 'HINT', code: 'x', message: 'y' }])).toBe(
      'VERIFIED',
    );
  });

  it('faellt bei unbekannter Angabe auf NICHT VERIFIZIERT zurueck', () => {
    expect(gueteNachPruefung('irgendwas', [])).toBe('UNVERIFIED');
  });
});
