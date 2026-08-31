import { describe, expect, it } from 'vitest';

import {
  EARLIEST_YEAR,
  buildPeriod,
  engineInput,
  manufacturerInput,
  optionAvailabilityInput,
  optionalEquipmentInput,
  powertrainInput,
  resolveSlug,
  sourceInput,
} from './schemas';

describe('Katalog-Eingaben', () => {
  it('leitet den Slug aus dem Namen ab, wenn keiner angegeben ist', () => {
    expect(resolveSlug({ name: 'Mercedes-Benz' })).toBe('mercedes-benz');
    expect(resolveSlug({ name: 'Škoda Octavia' })).toBe('skoda-octavia');
    expect(resolveSlug({ name: 'BMW 3er', slug: 'dreier' })).toBe('dreier');
  });

  it('nimmt nur gueltige WMI-Kennungen an', () => {
    expect(manufacturerInput.safeParse({ name: 'BMW', wmiCodes: ['wba', 'WBS'] }).success).toBe(
      true,
    );
    // I, O und Q kommen in einer VIN nicht vor.
    expect(manufacturerInput.safeParse({ name: 'BMW', wmiCodes: ['WBI'] }).success).toBe(false);
    expect(manufacturerInput.safeParse({ name: 'BMW', wmiCodes: ['WB'] }).success).toBe(false);
  });

  it('normalisiert WMI-Kennungen auf Grossbuchstaben', () => {
    const result = manufacturerInput.parse({ name: 'BMW', wmiCodes: ['wba'] });
    expect(result.wmiCodes).toEqual(['WBA']);
  });

  it('lehnt einen Bauzeitraum ab, der rueckwaerts laeuft', () => {
    expect(buildPeriod.safeParse({ yearFrom: 2019, yearTo: 2012 }).success).toBe(false);
    expect(buildPeriod.safeParse({ yearFrom: 2012, yearTo: 2019 }).success).toBe(true);
    // null heisst ausdruecklich "laeuft noch".
    expect(buildPeriod.safeParse({ yearFrom: 2019, yearTo: null }).success).toBe(true);
  });

  it('lehnt Jahreszahlen vor dem ersten Automobil ab', () => {
    expect(buildPeriod.safeParse({ yearFrom: EARLIEST_YEAR - 1 }).success).toBe(false);
    expect(buildPeriod.safeParse({ yearFrom: EARLIEST_YEAR }).success).toBe(true);
  });

  it('faengt Tippfehler bei technischen Werten ab', () => {
    const basis = { manufacturerId: 'm1', name: '2.0 TDI', fuelType: 'DIESEL' as const };
    expect(engineInput.safeParse({ ...basis, powerKw: 110 }).success).toBe(true);
    // 3000 kW waere ein Tippfehler, kein Auto.
    expect(engineInput.safeParse({ ...basis, powerKw: 3000 }).success).toBe(false);
    expect(engineInput.safeParse({ ...basis, cylinders: 24 }).success).toBe(false);
    expect(engineInput.safeParse({ ...basis, displacementCcm: 200000 }).success).toBe(false);
  });

  it('erkennt vertauschte Anhaengelasten', () => {
    /*
     * Die gebremste Anhaengelast ist nie kleiner als die ungebremste. Ist sie
     * es doch, wurden die Felder vertauscht -- und das ist im Betrieb
     * gefaehrlich, nicht nur unschoen.
     */
    const basis = {
      generationId: 'g1',
      engineId: 'e1',
      transmissionId: 't1',
      driveType: 'REAR' as const,
    };
    expect(
      powertrainInput.safeParse({
        ...basis,
        towingCapacityBrakedKg: 750,
        towingCapacityUnbrakedKg: 1800,
      }).success,
    ).toBe(false);
    expect(
      powertrainInput.safeParse({
        ...basis,
        towingCapacityBrakedKg: 1800,
        towingCapacityUnbrakedKg: 750,
      }).success,
    ).toBe(true);
  });

  it('nimmt Quellen mit ausdruecklicher Feldangabe an', () => {
    const ergebnis = sourceInput.parse({
      title: 'Technische Daten, Preisliste 03/2015',
      coversFields: ['powerKw', 'torqueNm'],
    });
    expect(ergebnis.coversFields).toEqual(['powerKw', 'torqueNm']);
    // Ohne Angabe deckt die Quelle den ganzen Eintrag -- das bleibt der Regelfall.
    expect(sourceInput.parse({ title: 'Irgendeine Unterlage' }).coversFields).toEqual([]);
  });

  it('setzt den Messzyklus auf "unbekannt", statt einen zu raten', () => {
    const result = powertrainInput.parse({
      generationId: 'g1',
      engineId: 'e1',
      transmissionId: 't1',
      driveType: 'REAR',
      consumptionCombined: 5.4,
    });
    expect(result.measurementStandard).toBe('UNKNOWN');
  });

  it('laesst Quellen ohne Adresse zu, aber nicht ohne Bezeichnung', () => {
    // Werkstattliteratur und Preislisten auf Papier haben keine Adresse.
    expect(sourceInput.safeParse({ title: 'Preisliste 03/2015, Seite 12' }).success).toBe(true);
    expect(sourceInput.safeParse({ title: 'ab' }).success).toBe(false);
    expect(sourceInput.safeParse({ title: 'Datenblatt', url: 'keine-url' }).success).toBe(false);
  });
});

describe('Ausstattung', () => {
  const basis = { manufacturerId: 'm1', name: 'Matrixlicht' };

  it('nimmt eine Ausstattung ohne Einschaetzungsfelder an', () => {
    expect(optionalEquipmentInput.safeParse(basis).success).toBe(true);
  });

  it('verlangt ein Belegmodell, sobald Seltenheit oder Relevanz angegeben wird', () => {
    /*
     * Bestellquoten und Wiederverkaufswirkung stehen in keinem Datenblatt.
     * Ohne Belegmodell entstuende genau die Sorte Aussage, die wie eine
     * Tatsache aussieht und keine ist.
     */
    expect(optionalEquipmentInput.safeParse({ ...basis, rarity: 'RARE' }).success).toBe(false);
    expect(
      optionalEquipmentInput.safeParse({ ...basis, purchaseRelevance: 'HIGH' }).success,
    ).toBe(false);
    expect(
      optionalEquipmentInput.safeParse({
        ...basis,
        rarity: 'RARE',
        relevanceEvidenceType: 'ASSESSMENT',
      }).success,
    ).toBe(true);
  });

  it('laesst fuer Seltenheit keine belegte Angabe zu', () => {
    // SPECIFICATION ist hier gar nicht waehlbar -- es gibt keine Unterlage,
    // die eine Bestellquote belegt.
    expect(
      optionalEquipmentInput.safeParse({
        ...basis,
        rarity: 'RARE',
        relevanceEvidenceType: 'SPECIFICATION',
      }).success,
    ).toBe(false);
  });

  it('schliesst serienmaessig und an-ein-Paket-gebunden aus', () => {
    const verfuegbarkeit = { optionId: 'o1', generationId: 'g1' };
    expect(
      optionAvailabilityInput.safeParse({
        ...verfuegbarkeit,
        kind: 'STANDARD',
        packageId: 'p1',
      }).success,
    ).toBe(false);
    expect(
      optionAvailabilityInput.safeParse({ ...verfuegbarkeit, kind: 'STANDARD' }).success,
    ).toBe(true);
    expect(
      optionAvailabilityInput.safeParse({
        ...verfuegbarkeit,
        kind: 'PACKAGE_ONLY',
        packageId: 'p1',
      }).success,
    ).toBe(true);
  });

  it('verlangt zu jeder Art die Angabe, die sie erst verwertbar macht', () => {
    const basis = { optionId: 'o1', generationId: 'g1' };

    // Nur im Paket -- ohne Paket.
    expect(
      optionAvailabilityInput.safeParse({ ...basis, kind: 'PACKAGE_ONLY' }).success,
    ).toBe(false);
    // Nur im Sondermodell -- ohne Sondermodell.
    expect(
      optionAvailabilityInput.safeParse({ ...basis, kind: 'SPECIAL_EDITION_ONLY' }).success,
    ).toBe(false);
    // Marktabhaengig -- ohne Markt.
    expect(
      optionAvailabilityInput.safeParse({ ...basis, kind: 'MARKET_SPECIFIC' }).success,
    ).toBe(false);
    expect(
      optionAvailabilityInput.safeParse({
        ...basis,
        kind: 'MARKET_SPECIFIC',
        marketRegion: 'US',
      }).success,
    ).toBe(true);
  });

  it('laesst Serienausstattung keinen Aufpreis tragen', () => {
    expect(
      optionAvailabilityInput.safeParse({
        optionId: 'o1',
        generationId: 'g1',
        kind: 'STANDARD',
        surchargeCents: 45000,
      }).success,
    ).toBe(false);
  });

  it('setzt ohne Angabe die vorsichtige Voreinstellung', () => {
    const ergebnis = optionAvailabilityInput.parse({ optionId: 'o1', generationId: 'g1' });
    // Nicht STANDARD: Wer nichts angibt, hat nicht belegt, dass es Serie war.
    expect(ergebnis.kind).toBe('OPTIONAL');
    expect(ergebnis.dataQuality).toBe('UNVERIFIED');
  });

  it('nimmt die Einschraenkung auf eine Motorvariante an', () => {
    expect(
      optionAvailabilityInput.safeParse({
        optionId: 'o1',
        generationId: 'g1',
        powertrainId: 'a1',
        trimLineId: 'l1',
      }).success,
    ).toBe(true);
  });
});
