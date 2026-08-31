import { describe, expect, it } from 'vitest';

import { AvailabilityKind, fasseVerfuegbarkeitZusammen, pruefeVerfuegbarkeitStimmig } from './availability';
import { berechneZeile, bestandsSatz } from './completeness';
import { MAX_VERGLEICH, vergleiche } from './comparison';
import { DataQuality, pruefungUeberfaellig, schwaechsteGuete } from './data-quality';
import { pruefeAusstattung } from './equipment-check';
import { bewerteAusstattungsgrad, bewerteSeltenheit, bewerteZuverlaessigkeit, hatBewertung } from './scores';
import { erklaereSuche, zerlegeSuche } from './smart-search';

describe('Verfuegbarkeitsarten', () => {
  it('verlangt zu jeder Art die Angabe, die sie verwertbar macht', () => {
    expect(pruefeVerfuegbarkeitStimmig({ kind: 'PACKAGE_ONLY' }).packageId).toBeDefined();
    expect(
      pruefeVerfuegbarkeitStimmig({ kind: 'SPECIAL_EDITION_ONLY' }).specialEditionId,
    ).toBeDefined();
    expect(pruefeVerfuegbarkeitStimmig({ kind: 'MARKET_SPECIFIC' }).marketRegion).toBeDefined();
  });

  it('schliesst Serie mit Aufpreis und Paketbindung aus', () => {
    expect(
      pruefeVerfuegbarkeitStimmig({ kind: 'STANDARD', packageId: 'p1' }).kind,
    ).toBeDefined();
    expect(
      pruefeVerfuegbarkeitStimmig({ kind: 'STANDARD', surchargeCents: 45000 }).surchargeCents,
    ).toBeDefined();
  });

  it('macht aus wechselnder Verfuegbarkeit KEIN pauschales „war Serie"', () => {
    /*
     * Der Kern von Vorgabe 9. Dieselbe Ausstattung war in der oberen Linie
     * Serie und in der Basis Aufpreis. Die Zusammenfassung darf daraus nicht
     * "Serie" machen -- sie muss sagen, dass es davon abhaengt.
     */
    const zusammen = fasseVerfuegbarkeitZusammen([
      { kind: AvailabilityKind.STANDARD },
      { kind: AvailabilityKind.OPTIONAL },
    ]);

    expect(zusammen?.varies).toBe(true);
    expect(zusammen?.statement).toContain('nicht durchgehend');
    expect(zusammen?.statement).toContain('prüfen');
  });

  it('fasst eine eindeutige Lage ohne Einschraenkung zusammen', () => {
    const zusammen = fasseVerfuegbarkeitZusammen([{ kind: AvailabilityKind.STANDARD }]);
    expect(zusammen?.varies).toBe(false);
    expect(zusammen?.best).toBe('STANDARD');
  });
});

describe('Vollstaendigkeit', () => {
  it('gibt OHNE belegte Gesamtzahl keine Quote aus', () => {
    const zeile = berechneZeile({ aspect: 'ENGINE', recorded: 42 });
    expect(zeile.percent).toBeNull();
    expect(zeile.statement).toContain('Gesamtzahl nicht belegt');
    expect(zeile.statement).not.toContain('%');
  });

  it('verlangt zur Gesamtzahl auch die Quelle', () => {
    // Eine Zahl ohne Quelle ist keine belegte Zahl -- sonst waere die
    // Aussage ueber die Vollstaendigkeit selbst unbelegt.
    const ohneQuelle = berechneZeile({ aspect: 'ENGINE', recorded: 42, knownTotal: 100 });
    expect(ohneQuelle.percent).toBeNull();

    const mitQuelle = berechneZeile({
      aspect: 'ENGINE',
      recorded: 42,
      knownTotal: 100,
      knownTotalSource: 'Typgenehmigungsunterlagen',
    });
    expect(mitQuelle.percent).toBe(42);
    expect(mitQuelle.statement).toContain('von 100 bekannten');
  });

  it('bildet keine Gesamtquote ueber Bereiche verschiedener Groesse', () => {
    const satz = bestandsSatz([
      berechneZeile({ aspect: 'ENGINE', recorded: 10 }),
      berechneZeile({ aspect: 'OPTION', recorded: 5 }),
    ]);
    expect(satz).toContain('nur als Anzahl');
    expect(satz).not.toMatch(/\d+\s?%/);
  });
});

describe('Guetekennzeichen', () => {
  it('laesst die schwaechste Guete gelten', () => {
    expect(schwaechsteGuete([DataQuality.VERIFIED, DataQuality.UNVERIFIED])).toBe('UNVERIFIED');
    expect(schwaechsteGuete([DataQuality.VERIFIED, DataQuality.NEEDS_REVIEW])).toBe(
      'NEEDS_REVIEW',
    );
    expect(schwaechsteGuete([DataQuality.VERIFIED])).toBe('VERIFIED');
    expect(schwaechsteGuete([])).toBeNull();
  });

  it('haelt eine nie erfolgte Pruefung fuer ueberfaellig', () => {
    expect(pruefungUeberfaellig(null, new Date('2026-01-01'))).toBe(true);
    expect(pruefungUeberfaellig(new Date('2025-06-01'), new Date('2026-01-01'))).toBe(false);
    expect(pruefungUeberfaellig(new Date('2020-01-01'), new Date('2026-01-01'))).toBe(true);
  });
});

describe('Ausstattungschecker', () => {
  const optionen = [
    { optionId: 'a', name: 'Serienteil', kind: 'STANDARD' as const },
    { optionId: 'b', name: 'Xenon', kind: 'OPTIONAL' as const, purchaseRelevance: 'HIGH' as const },
    { optionId: 'c', name: 'Sitzheizung', kind: 'OPTIONAL' as const, purchaseRelevance: 'LOW' as const },
    { optionId: 'd', name: 'Panorama', kind: 'PACKAGE_ONLY' as const, purchaseRelevance: 'MEDIUM' as const },
  ];

  it('rechnet NUR ueber Aufpreisausstattung, nicht ueber Serie', () => {
    // Serie hat jedes Fahrzeug. Sie mitzurechnen liesse jeden Wagen gleich
    // gut aussehen.
    const ergebnis = pruefeAusstattung({ available: optionen, presentOptionIds: ['a'] });
    expect(ergebnis.optionalTotal).toBe(3);
    expect(ergebnis.standardTotal).toBe(1);
    expect(ergebnis.percent).toBe(0);
  });

  it('gewichtet nach Kaufrelevanz', () => {
    // Xenon (hoch, Gewicht 3) von insgesamt 3+1+2 = 6 → 50 Prozent.
    const ergebnis = pruefeAusstattung({ available: optionen, presentOptionIds: ['b'] });
    expect(ergebnis.percent).toBe(50);
  });

  it('meldet angehakte Ausstattung, die es hier nicht gab', () => {
    const ergebnis = pruefeAusstattung({
      available: optionen,
      presentOptionIds: ['gibt-es-nicht'],
    });
    expect(ergebnis.unknownIds).toEqual(['gibt-es-nicht']);
    expect(ergebnis.caveats.join(' ')).toContain('nicht erfasst');
  });

  it('sagt immer dazu, worauf sich die Zahl bezieht', () => {
    const ergebnis = pruefeAusstattung({ available: optionen, presentOptionIds: [] });
    expect(ergebnis.caveats.join(' ')).toContain('nicht alles, was es je gab');
  });
});

describe('Bewertungen', () => {
  it('gibt keine Note, wenn die Datengrundlage fehlt', () => {
    const wenig = bewerteZuverlaessigkeit([{ severity: 'SIGNIFICANT', resolved: false }]);
    expect(hatBewertung(wenig)).toBe(false);
    if (hatBewertung(wenig)) return;
    // Und sie sagt, dass wenige Eintraege nicht wenige Probleme heissen.
    expect(wenig.reason).toContain('nicht, dass es wenige Probleme gibt');
  });

  it('rechnet nachvollziehbar, wenn genug da ist', () => {
    const note = bewerteZuverlaessigkeit([
      { severity: 'SIGNIFICANT', resolved: false },
      { severity: 'MINOR', resolved: true },
      { severity: 'SIGNIFICANT', resolved: true },
    ]);
    expect(hatBewertung(note)).toBe(true);
    if (!hatBewertung(note)) return;
    expect(note.value).toBeGreaterThan(0);
    expect(note.value).toBeLessThanOrEqual(100);
    expect(note.inputs.length).toBeGreaterThan(0);
    expect(note.basis.length).toBeGreaterThan(20);
  });

  it('verweigert einen Ausstattungsgrad auf duenner Grundlage', () => {
    expect(hatBewertung(bewerteAusstattungsgrad(80, 2))).toBe(false);
    expect(hatBewertung(bewerteAusstattungsgrad(null, 30))).toBe(false);
    expect(hatBewertung(bewerteAusstattungsgrad(80, 30))).toBe(true);
  });

  it('behandelt fehlende Seltenheit nicht als „haeufig"', () => {
    const ohne = bewerteSeltenheit([null, undefined]);
    expect(hatBewertung(ohne)).toBe(false);

    const mit = bewerteSeltenheit(['VERY_RARE', null]);
    expect(hatBewertung(mit)).toBe(true);
    if (!hatBewertung(mit)) return;
    expect(mit.value).toBeGreaterThan(80);
  });
});

describe('Fahrzeugvergleich', () => {
  const a = {
    id: 'a',
    label: 'A',
    measurementStandard: 'WLTP',
    values: { powerKw: 110, torqueNm: 340, kerbWeightKg: null },
  };
  const b = {
    id: 'b',
    label: 'B',
    measurementStandard: 'WLTP',
    values: { powerKw: 140, torqueNm: 320, kerbWeightKg: 1500 },
  };

  it('markiert den besseren Wert nur bei vollstaendiger Zeile', () => {
    const ergebnis = vergleiche([a, b]);

    const leistung = ergebnis.rows.find((z) => z.field.key === 'powerKw');
    expect(leistung?.comparable).toBe(true);
    expect(leistung?.cells.find((z) => z.candidateId === 'b')?.best).toBe(true);

    // Leergewicht fehlt bei A -- die Zeile darf B nicht zum Sieger machen.
    const gewicht = ergebnis.rows.find((z) => z.field.key === 'kerbWeightKg');
    expect(gewicht?.comparable).toBe(false);
    expect(gewicht?.cells.every((z) => !z.best)).toBe(true);
    expect(gewicht?.incomparableReason).toContain('Lücke ist kein schlechterer Wert');
  });

  it('stellt Verbrauch bei unterschiedlichen Messzyklen nicht gegenueber', () => {
    const ergebnis = vergleiche([
      { ...a, measurementStandard: 'NEDC', values: { ...a.values, consumptionCombined: 4.2 } },
      { ...b, measurementStandard: 'WLTP', values: { ...b.values, consumptionCombined: 5.8 } },
    ]);
    const verbrauch = ergebnis.rows.find((z) => z.field.key === 'consumptionCombined');
    expect(verbrauch?.comparable).toBe(false);
    expect(verbrauch?.incomparableReason).toContain('Messzyklen');
  });

  it('markiert bei Gleichstand niemanden', () => {
    const ergebnis = vergleiche([a, { ...b, values: { ...b.values, powerKw: 110 } }]);
    const leistung = ergebnis.rows.find((z) => z.field.key === 'powerKw');
    expect(leistung?.cells.every((z) => !z.best && !z.worst)).toBe(true);
  });

  it('begrenzt die Zahl der Fahrzeuge und sagt es', () => {
    const viele = Array.from({ length: 6 }, (_, i) => ({ ...a, id: `f${i}` }));
    const ergebnis = vergleiche(viele);
    expect(ergebnis.candidates).toHaveLength(MAX_VERGLEICH);
    expect(ergebnis.notes.join(' ')).toContain('weggelassen');
  });
});

describe('Smart-Suche', () => {
  it('liest „BMW 320d G20 190 PS 2019" auseinander', () => {
    const zerlegt = zerlegeSuche('BMW 320d G20 190 PS 2019');
    expect(zerlegt.generationCodes).toContain('G20');
    expect(zerlegt.years).toContain(2019);
    expect(zerlegt.powerPs).toContain(190);
    expect(zerlegt.words.map((w) => w.toUpperCase())).toContain('BMW');
  });

  it('erkennt einen alleinstehenden Motorcode', () => {
    const zerlegt = zerlegeSuche('DBKA');
    expect(zerlegt.engineCodes).toContain('DBKA');
    expect(zerlegt.structured).toBe(true);
  });

  it('haelt ein Baureihenkuerzel nicht fuer einen Motorcode', () => {
    const zerlegt = zerlegeSuche('G20');
    expect(zerlegt.generationCodes).toContain('G20');
    expect(zerlegt.engineCodes).toHaveLength(0);
  });

  it('erkennt Bestellnummern beider Konzernformate', () => {
    expect(zerlegeSuche('S610A').optionCodes).toContain('S610A');
    expect(zerlegeSuche('PR-7X2').optionCodes).toContain('7X2');
  });

  it('behandelt „Golf 7 Panorama" als Modell, Generationsnummer und Wort', () => {
    const zerlegt = zerlegeSuche('Golf 7 Panorama');
    expect(zerlegt.generationNumbers).toContain(7);
    expect(zerlegt.words.map((w) => w.toLowerCase())).toEqual(
      expect.arrayContaining(['golf', 'panorama']),
    );
  });

  it('sagt dem Menschen, was sie verstanden hat', () => {
    const erklaerung = erklaereSuche(zerlegeSuche('DBKA 2019'));
    expect(erklaerung).toContain('Motorcode DBKA');
    expect(erklaerung).toContain('2019');
  });

  it('erklaert nichts, wenn sie nichts Strukturiertes gefunden hat', () => {
    expect(erklaereSuche(zerlegeSuche('kombi mit anhaengerkupplung'))).toBeNull();
  });
});
