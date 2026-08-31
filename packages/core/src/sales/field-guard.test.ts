import { describe, expect, it } from 'vitest';

import {
  NIEMALS_AN_DIE_KI,
  buildAiListingContext,
  type CatalogForContext,
  type DraftForContext,
} from './field-guard';

const vollstaendigerEntwurf: DraftForContext = {
  mileageKm: 128_500,
  firstRegistration: new Date('2016-03-14T00:00:00.000Z'),
  previousOwners: 2,
  huValidUntil: new Date('2027-05-31T00:00:00.000Z'),
  serviceHistory: 'FULL_MANUFACTURER',
  condition: 'GOOD',
  tyreCondition: 'Sommerreifen mit 5 mm Profil',
  damages: 'Kratzer an der hinteren Stoßstange',
  hadAccident: false,
  accidentDetails: null,
  additionalNotes: 'Nichtraucherfahrzeug',
  catalogConfirmedAt: new Date('2026-06-01T00:00:00.000Z'),
};

const katalog: CatalogForContext = {
  manufacturerName: 'Musterfahrzeug',
  modelName: 'Muster 300',
  generationName: 'Zweite Generation',
  generationCode: 'MB2',
  bodyTypeName: 'Limousine',
  trimLineName: 'Muster Sport',
  engineName: '2.0 Muster-Diesel',
  engineCode: 'DEMO20D',
  fuelTypeLabel: 'Diesel',
  transmissionLabel: 'Wandlerautomatik',
  driveTypeLabel: 'Heckantrieb',
  powerKw: 140,
  displacementCcm: 1995,
  buildPeriod: '2014–2021',
  equipmentNames: ['Muster-Matrixlicht', 'Muster-Sitzheizung'],
};

describe('Feld-Guard', () => {
  it('uebernimmt bestaetigte Katalogangaben', () => {
    const kontext = buildAiListingContext(vollstaendigerEntwurf, katalog);
    expect(kontext.vehicle.manufacturer).toBe('Musterfahrzeug');
    expect(kontext.vehicle.powerKw).toBe(140);
    expect(kontext.vehicle.powerPs).toBe(190);
    expect(kontext.vehicle.displacementLitres).toBe(2);
  });

  it('uebersetzt Zustand und Servicehistorie in verstaendliche Worte', () => {
    const kontext = buildAiListingContext(vollstaendigerEntwurf, katalog);
    expect(kontext.vehicleFacts.condition).toBe('gut');
    expect(kontext.vehicleFacts.serviceHistory).toContain('Scheckheft');
  });

  it('gibt die VIN unter keinen Umstaenden weiter', () => {
    /*
     * Der wichtigste Test dieser Datei. Der Kontext wird als vollstaendiger
     * Text durchsucht -- egal wie er kuenftig erweitert wird, die VIN darf
     * darin nicht auftauchen.
     */
    const kontext = buildAiListingContext(vollstaendigerEntwurf, katalog);
    const alsText = JSON.stringify(kontext);

    expect(alsText).not.toContain('WBA3A5C50F5A12345');
    for (const feld of NIEMALS_AN_DIE_KI) {
      expect(alsText).not.toContain(`"${feld}"`);
    }
  });

  it('gibt keine Angaben weiter, die nicht erfasst sind', () => {
    // Was fehlt, fehlt auch im Kontext -- sonst kann das Modell es "ergaenzen".
    const luecken: DraftForContext = {
      ...vollstaendigerEntwurf,
      mileageKm: null,
      damages: null,
      tyreCondition: null,
      additionalNotes: null,
    };
    const kontext = buildAiListingContext(luecken, katalog);

    expect(kontext.vehicleFacts).not.toHaveProperty('mileageKm');
    expect(kontext.vehicleFacts).not.toHaveProperty('damages');
    expect(kontext.vehicleFacts).not.toHaveProperty('tyreCondition');
  });

  it('benennt fehlende Pflichtangaben ausdruecklich', () => {
    const luecken: DraftForContext = {
      ...vollstaendigerEntwurf,
      mileageKm: null,
      huValidUntil: null,
    };
    const kontext = buildAiListingContext(luecken, katalog);

    expect(kontext.missingFields).toContain('Kilometerstand');
    expect(kontext.missingFields).toContain('HU gültig bis');
    expect(kontext.missingFields).not.toContain('Zustand');
  });

  it('meldet bei vollstaendigen Angaben keine Luecken', () => {
    expect(buildAiListingContext(vollstaendigerEntwurf, katalog).missingFields).toEqual([]);
  });

  it('laesst fehlende Katalogangaben weg statt sie zu raten', () => {
    const duenn: CatalogForContext = {
      ...katalog,
      engineName: null,
      powerKw: null,
      displacementCcm: null,
      trimLineName: null,
      bodyTypeName: null,
      equipmentNames: [],
    };
    const kontext = buildAiListingContext(vollstaendigerEntwurf, duenn);

    expect(kontext.vehicle).not.toHaveProperty('engineName');
    expect(kontext.vehicle).not.toHaveProperty('powerKw');
    expect(kontext.vehicle).not.toHaveProperty('trimLine');
    expect(kontext.equipment).toEqual([]);
    // Der Hersteller bleibt -- er ist immer bestaetigt.
    expect(kontext.vehicle.manufacturer).toBe('Musterfahrzeug');
  });

  it('gibt den Motorcode nicht weiter', () => {
    // Er hilft dem Text nicht und ist in der Anzeige ohnehin sichtbar.
    const kontext = buildAiListingContext(vollstaendigerEntwurf, katalog);
    expect(JSON.stringify(kontext)).not.toContain('DEMO20D');
  });

  it('uebernimmt Unfallangaben so, wie sie gemacht wurden', () => {
    const mitUnfall: DraftForContext = {
      ...vollstaendigerEntwurf,
      hadAccident: true,
      accidentDetails: 'Heckschaden 2019, fachgerecht instand gesetzt',
    };
    const kontext = buildAiListingContext(mitUnfall, katalog);
    expect(kontext.vehicleFacts.hadAccident).toBe(true);
    expect(kontext.vehicleFacts.accidentDetails).toContain('Heckschaden');
  });

  it('unterscheidet "kein Unfall" von "nicht angegeben"', () => {
    // false heisst unfallfrei, fehlend heisst unbekannt. Das darf nicht
    // eingeebnet werden -- die Aussage "unfallfrei" ist rechtlich erheblich.
    const ohneAngabe: DraftForContext = { ...vollstaendigerEntwurf, hadAccident: null };
    expect(
      buildAiListingContext(ohneAngabe, katalog).vehicleFacts,
    ).not.toHaveProperty('hadAccident');
    expect(buildAiListingContext(vollstaendigerEntwurf, katalog).vehicleFacts.hadAccident).toBe(
      false,
    );
  });
});
