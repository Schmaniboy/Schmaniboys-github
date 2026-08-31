/**
 * Demobestand fuer die Entwicklung.
 *
 * ACHTUNG -- LESEN, BEVOR JEMAND DIESE DATEN FUER ECHT HAELT:
 *
 * Alle hier angelegten Fahrzeuge, Motoren und Zahlen sind FREI ERFUNDEN.
 * Sie existieren, damit sich die Oberflaeche im Aufbau ansehen und pruefen
 * laesst -- nicht als Katalogdaten.
 *
 * Genau deshalb heisst der Hersteller "Musterfahrzeug (Demodaten)" und jede
 * Quelle traegt den Hinweis, dass sie keine reale Quelle ist. Vorgabe C3
 * verbietet erfundene Daten im Katalog; ein als solcher gekennzeichneter
 * Demobestand ist etwas anderes als eine Behauptung ueber ein echtes Auto --
 * aber nur, solange die Kennzeichnung untrennbar dranhaengt.
 *
 * Aufruf: npm run db:seed:demo
 * Entfernen: npm run db:seed:demo -- --entfernen
 */

import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

import { prisma } from '@ap/db';

const rootEnv = resolve(process.cwd(), '.env');
if (existsSync(rootEnv)) process.loadEnvFile(rootEnv);

const MARKE = 'Musterfahrzeug (Demodaten)';
const MARKE_SLUG = 'musterfahrzeug-demodaten';
const QUELLENHINWEIS = 'Demodaten — keine reale Quelle, frei erfunden';

async function entfernen(): Promise<void> {
  const marke = await prisma.manufacturer.findUnique({ where: { slug: MARKE_SLUG } });
  if (!marke) {
    console.log('Kein Demobestand vorhanden.');
    return;
  }
  const modelle = await prisma.model.findMany({ where: { manufacturerId: marke.id } });
  const generationen = await prisma.generation.findMany({
    where: { modelId: { in: modelle.map((m) => m.id) } },
  });
  const generationIds = generationen.map((g) => g.id);

  await prisma.knownIssue.deleteMany({ where: { generationId: { in: generationIds } } });
  await prisma.maintenanceItem.deleteMany({ where: { generationId: { in: generationIds } } });
  await prisma.costEstimate.deleteMany({ where: { generationId: { in: generationIds } } });
  await prisma.knowledgeNote.deleteMany({ where: { generationId: { in: generationIds } } });
  await prisma.optionAvailability.deleteMany({ where: { generationId: { in: generationIds } } });
  /*
   * Die neueren Tabellen. Sie haengen ueber Cascade an der Generation bzw.
   * am Hersteller -- aber nicht alle: PaintColor und WheelOption haengen am
   * Hersteller mit onDelete: Restrict, und ohne diese Zeilen scheitert das
   * Entfernen mit einem Fremdschluesselfehler, den niemand erwartet.
   */
  await prisma.modelYear.deleteMany({ where: { generationId: { in: generationIds } } });
  await prisma.specialEditionItem.deleteMany({
    where: { specialEdition: { generationId: { in: generationIds } } },
  });
  await prisma.specialEdition.deleteMany({ where: { generationId: { in: generationIds } } });
  await prisma.paintColorAvailability.deleteMany({
    where: { generationId: { in: generationIds } },
  });
  await prisma.wheelOptionAvailability.deleteMany({
    where: { generationId: { in: generationIds } },
  });
  await prisma.catalogImage.deleteMany({ where: { generationId: { in: generationIds } } });
  await prisma.hsnTsnEntry.deleteMany({ where: { generationId: { in: generationIds } } });
  await prisma.equipmentPackageItem.deleteMany({
    where: { package: { generationId: { in: generationIds } } },
  });
  await prisma.equipmentPackage.deleteMany({ where: { generationId: { in: generationIds } } });
  await prisma.powertrainCombination.deleteMany({
    where: { generationId: { in: generationIds } },
  });
  await prisma.trimLine.deleteMany({ where: { generationId: { in: generationIds } } });
  await prisma.faceliftPhase.deleteMany({ where: { generationId: { in: generationIds } } });
  await prisma.generation.deleteMany({ where: { id: { in: generationIds } } });
  await prisma.model.deleteMany({ where: { manufacturerId: marke.id } });
  await prisma.engine.deleteMany({ where: { manufacturerId: marke.id } });
  await prisma.optionalEquipment.deleteMany({ where: { manufacturerId: marke.id } });
  await prisma.paintColor.deleteMany({ where: { manufacturerId: marke.id } });
  await prisma.wheelOption.deleteMany({ where: { manufacturerId: marke.id } });
  await prisma.engineFamily.deleteMany({ where: { manufacturerId: marke.id } });
  await prisma.source.deleteMany({ where: { title: { contains: 'Demodaten' } } });
  await prisma.manufacturer.delete({ where: { id: marke.id } });
  await prisma.transmission.deleteMany({ where: { name: { startsWith: 'Muster-' } } });

  console.log('Demobestand entfernt.');
}

/** Legt eine Quelle an und veroeffentlicht den Eintrag in einem Schritt. */
async function veroeffentlichen(
  subjectType: string,
  subjectId: string,
  coversFields: string[] = [],
): Promise<void> {
  await prisma.source.create({
    data: {
      subjectType,
      subjectId,
      kind: 'MANUFACTURER_DOCUMENT',
      title: QUELLENHINWEIS,
      note: 'Nur zur Ansicht der Oberflaeche. Enthaelt keine belegten Angaben.',
      coversFields,
    },
  });
}

async function anlegen(): Promise<void> {
  if (await prisma.manufacturer.findUnique({ where: { slug: MARKE_SLUG } })) {
    console.log('Demobestand ist bereits vorhanden. Zuerst entfernen.');
    return;
  }

  const jetzt = new Date();
  const veroeffentlicht = { status: 'PUBLISHED' as const, publishedAt: jetzt };

  const karosserie = await prisma.bodyType.upsert({
    where: { slug: 'limousine' },
    update: {},
    create: { name: 'Limousine', slug: 'limousine' },
  });

  const marke = await prisma.manufacturer.create({
    data: {
      name: MARKE,
      slug: MARKE_SLUG,
      country: 'Beispielland',
      wmiCodes: ['WDM'],
      ...veroeffentlicht,
    },
  });
  await veroeffentlichen('manufacturer', marke.id);

  const modell = await prisma.model.create({
    data: { manufacturerId: marke.id, name: 'Muster 300', slug: 'muster-300', ...veroeffentlicht },
  });
  await veroeffentlichen('model', modell.id);

  const generation = await prisma.generation.create({
    data: {
      modelId: modell.id,
      name: 'Zweite Generation',
      code: 'MB2',
      slug: 'zweite-generation',
      bodyTypeId: karosserie.id,
      yearFrom: 2014,
      yearTo: 2021,
      ...veroeffentlicht,
    },
  });
  await veroeffentlichen('generation', generation.id);

  await prisma.faceliftPhase.create({
    data: {
      generationId: generation.id,
      name: 'Nachfacelift',
      slug: 'nachfacelift',
      yearFrom: 2018,
      yearTo: 2021,
      distinguishingFeatures:
        'Erfundenes Merkmal zur Ansicht: geänderte Rückleuchten und größerer Bildschirm.',
      ...veroeffentlicht,
    },
  });

  const motor = await prisma.engine.create({
    data: {
      manufacturerId: marke.id,
      name: '2.0 Muster-Diesel',
      code: 'DEMO20D',
      displacementCcm: 1995,
      cylinders: 4,
      fuelType: 'DIESEL',
      aspiration: 'TURBOCHARGED',
      powerKw: 140,
      torqueNm: 400,
      ...veroeffentlicht,
    },
  });
  await veroeffentlichen('engine', motor.id);

  const elektro = await prisma.engine.create({
    data: {
      manufacturerId: marke.id,
      name: 'Muster-Elektroantrieb',
      code: 'DEMOEV',
      cylinders: null,
      fuelType: 'ELECTRIC',
      aspiration: 'ELECTRIC_DRIVE',
      powerKw: 150,
      torqueNm: 310,
      ...veroeffentlicht,
    },
  });
  await veroeffentlichen('engine', elektro.id);

  /*
   * Getriebe haengen nicht am Hersteller und ueberleben deshalb das Entfernen
   * des Demobestands. upsert statt create -- sonst scheitert der zweite Lauf.
   */
  const automatik = await prisma.transmission.upsert({
    where: {
      name_type_gears: { name: 'Muster-Automatik', type: 'AUTOMATIC_TORQUE_CONVERTER', gears: 8 },
    },
    update: {},
    create: { name: 'Muster-Automatik', type: 'AUTOMATIC_TORQUE_CONVERTER', gears: 8 },
  });
  const eingang = await prisma.transmission.upsert({
    where: {
      name_type_gears: { name: 'Muster-Untersetzung', type: 'REDUCTION_GEAR', gears: 1 },
    },
    update: {},
    create: { name: 'Muster-Untersetzung', type: 'REDUCTION_GEAR', gears: 1 },
  });

  const antriebDiesel = await prisma.powertrainCombination.create({
    data: {
      generationId: generation.id,
      engineId: motor.id,
      transmissionId: automatik.id,
      driveType: 'REAR',
      yearFrom: 2014,
      yearTo: 2021,
      powerKw: 140,
      torqueNm: 400,
      acceleration0to100: 7.9,
      topSpeedKmh: 230,
      consumptionCombined: 4.9,
      consumptionUnit: 'l/100 km',
      co2CombinedGramPerKm: 129,
      measurementStandard: 'NEDC',
      kerbWeightKg: 1585,
      payloadKg: 545,
      fuelTankLitres: 57,
      emissionStandard: 'Euro 6 (Demodaten)',
      seats: 5,
      doors: 4,
      towingCapacityBrakedKg: 1800,
      towingCapacityUnbrakedKg: 750,
      ...veroeffentlicht,
    },
  });

  await prisma.powertrainCombination.create({
    data: {
      generationId: generation.id,
      engineId: elektro.id,
      transmissionId: eingang.id,
      driveType: 'ALL',
      yearFrom: 2019,
      yearTo: 2021,
      powerKw: 150,
      torqueNm: 310,
      acceleration0to100: 8.4,
      topSpeedKmh: 160,
      consumptionCombined: 18.6,
      consumptionUnit: 'kWh/100 km',
      measurementStandard: 'WLTP',
      kerbWeightKg: 1980,
      payloadKg: 470,
      batteryCapacityKwh: 64,
      electricRangeKm: 380,
      emissionStandard: 'Nicht anwendbar (Demodaten)',
      seats: 5,
      doors: 4,
      ...veroeffentlicht,
    },
  });

  const linien: Record<string, string> = {};
  for (const linie of [
    { name: 'Basis', beschreibung: 'Erfundene Grundausstattung zur Ansicht.' },
    { name: 'Muster Sport', beschreibung: 'Erfundene Sportlinie zur Ansicht.' },
  ]) {
    const angelegt = await prisma.trimLine.create({
      data: {
        generationId: generation.id,
        name: linie.name,
        slug: linie.name.toLowerCase().replace(/\s+/g, '-'),
        description: linie.beschreibung,
        yearFrom: 2014,
        yearTo: 2021,
        ...veroeffentlicht,
      },
    });
    linien[linie.name] = angelegt.id;
  }

  // --- Ausstattung: Katalog, Paket und Verfuegbarkeitsmatrix --------------

  const scheinwerfer = await prisma.optionalEquipment.create({
    data: {
      manufacturerId: marke.id,
      name: 'Muster-Matrixlicht',
      slug: 'muster-matrixlicht',
      optionCode: 'S001A',
      category: 'Licht',
      description: 'Erfundene Lichtanlage zur Ansicht der Darstellung.',
      howToIdentify:
        'Erfundenes Erkennungsmerkmal: waagerechte Leuchtleiste im Scheinwerfer.',
      rarity: 'RARE',
      purchaseRelevance: 'HIGH',
      resaleRelevance: 'HIGH',
      relevanceEvidenceType: 'ASSESSMENT',
      relevanceConfidence: 'MEDIUM',
      relevanceReasoning:
        'Frei erfundene Begruendung, damit die Kennzeichnung als Einschaetzung sichtbar wird.',
      ...veroeffentlicht,
    },
  });

  const sitzheizung = await prisma.optionalEquipment.create({
    data: {
      manufacturerId: marke.id,
      name: 'Muster-Sitzheizung',
      slug: 'muster-sitzheizung',
      optionCode: 'S002A',
      category: 'Komfort',
      description: 'Erfundene Sitzheizung zur Ansicht der Darstellung.',
      howToIdentify: 'Erfundenes Erkennungsmerkmal: Schalter in der Mittelkonsole.',
      rarity: 'COMMON',
      purchaseRelevance: 'MEDIUM',
      resaleRelevance: 'MEDIUM',
      relevanceEvidenceType: 'MARKET_SIGNAL',
      relevanceConfidence: 'HIGH',
      relevanceDataBasis: 'Frei erfundene Auswertung, ausschliesslich zur Ansicht.',
      relevanceObservedAt: new Date('2026-04-01T00:00:00.000Z'),
      relevanceSampleSize: 64,
      ...veroeffentlicht,
    },
  });

  const winterpaket = await prisma.equipmentPackage.create({
    data: {
      generationId: generation.id,
      name: 'Muster-Winterpaket',
      slug: 'muster-winterpaket',
      packageCode: 'P100',
      description: 'Erfundenes Paket zur Ansicht der Darstellung.',
      ...veroeffentlicht,
    },
  });
  await prisma.equipmentPackageItem.create({
    data: { packageId: winterpaket.id, optionId: sitzheizung.id, optional: false },
  });

  // Dieselbe Ausstattung, verschiedene Bedingungen -- genau das macht die
  // Matrix beim Gebrauchtkauf schwer nachvollziehbar.
  await prisma.optionAvailability.create({
    data: {
      optionId: scheinwerfer.id,
      generationId: generation.id,
      trimLineId: linien['Muster Sport'] ?? null,
      kind: 'STANDARD',
      yearFrom: 2018,
      yearTo: 2021,
      note: 'Erfundene Angabe: erst ab dem Facelift.',
    },
  });
  await prisma.optionAvailability.create({
    data: {
      optionId: scheinwerfer.id,
      generationId: generation.id,
      trimLineId: linien['Basis'] ?? null,
      kind: 'OPTIONAL',
      yearFrom: 2018,
      yearTo: 2021,
    },
  });
  await prisma.optionAvailability.create({
    data: {
      optionId: sitzheizung.id,
      generationId: generation.id,
      packageId: winterpaket.id,
      kind: 'PACKAGE_ONLY',
      yearFrom: 2014,
      yearTo: 2021,
      note: 'Erfundene Angabe: einzeln nicht bestellbar.',
    },
  });

  // --- Wissen, jeweils mit unterschiedlichem Belegmodell zur Ansicht -------

  const schwachstelle = await prisma.knownIssue.create({
    data: {
      generationId: generation.id,
      powertrainId: antriebDiesel.id,
      title: 'Erfundene Schwachstelle an der Musterbaugruppe',
      component: 'Musterbaugruppe',
      severity: 'SIGNIFICANT',
      symptoms: 'Frei erfundenes Symptom, nur zur Ansicht der Darstellung.',
      remedy: 'Frei erfundene Abhilfe, nur zur Ansicht der Darstellung.',
      typicalMileageFromKm: 120000,
      typicalMileageToKm: 180000,
      evidenceType: 'ASSESSMENT',
      confidence: 'MEDIUM',
      reasoning:
        'Diese Einschätzung ist frei erfunden und dient ausschließlich dazu, die Kennzeichnung von Einschätzungen sichtbar zu machen.',
      ...veroeffentlicht,
    },
  });

  const wartung = await prisma.maintenanceItem.create({
    data: {
      generationId: generation.id,
      task: 'Musterwartung durchführen',
      intervalKm: 30000,
      intervalMonths: 24,
      note: 'Fällig ist, was zuerst eintritt.',
      evidenceType: 'SPECIFICATION',
      confidence: 'HIGH',
      ...veroeffentlicht,
    },
  });

  const kosten = await prisma.costEstimate.create({
    data: {
      generationId: generation.id,
      category: 'VEHICLE_TAX',
      label: 'Erfundene Steuerangabe zur Ansicht',
      amountFromCents: 24000,
      amountToCents: 31000,
      currency: 'EUR',
      per: 'pro Jahr',
      region: 'Beispielland',
      evidenceType: 'MARKET_SIGNAL',
      confidence: 'MEDIUM',
      dataBasis: 'Frei erfundene Datengrundlage, ausschließlich zur Ansicht der Darstellung.',
      observedAt: new Date('2026-03-01T00:00:00.000Z'),
      sampleSize: 42,
      ...veroeffentlicht,
    },
  });

  await prisma.knowledgeNote.create({
    data: {
      generationId: generation.id,
      topic: 'ADVANTAGE',
      heading: 'Erfundener Vorteil',
      body: 'Dieser Text ist frei erfunden. Er zeigt, wie eine Einschätzung mit Begründung dargestellt wird.',
      evidenceType: 'ASSESSMENT',
      confidence: 'MEDIUM',
      reasoning:
        'Begründung ebenfalls frei erfunden, nur damit die Anzeige der Begründung sichtbar wird.',
      ...veroeffentlicht,
    },
  });

  await prisma.knowledgeNote.create({
    data: {
      generationId: generation.id,
      topic: 'RESALE_VALUE',
      heading: 'Erfundene Marktbeobachtung mit altem Stichtag',
      body: 'Dieser Eintrag hat absichtlich einen alten Stichtag, damit die Kennzeichnung "überholt" sichtbar wird.',
      evidenceType: 'MARKET_SIGNAL',
      confidence: 'HIGH',
      dataBasis: 'Frei erfundene Auswertung, nur zur Ansicht.',
      observedAt: new Date('2023-01-15T00:00:00.000Z'),
      sampleSize: 12,
      ...veroeffentlicht,
    },
  });

  /*
   * Auch Wissenseintraege brauchen ihre Quelle -- sonst zeigt die Oberflaeche
   * sie zu Recht als schwach belegt an. Die Quelle ist auch hier als Demodatum
   * gekennzeichnet.
   */
  // Eine Quelle mit ausdruecklicher Feldangabe, damit die Anzeige
  // "ausdruecklich belegt" auf der Variantenseite sichtbar wird.
  await veroeffentlichen('powertrain', antriebDiesel.id, ['powerKw', 'consumptionCombined']);
  await veroeffentlichen('knownIssue', schwachstelle.id);
  await veroeffentlichen('maintenanceItem', wartung.id);
  await veroeffentlichen('costEstimate', kosten.id);

  /*
   * Modelljahre, Sondermodell, Lackfarben und Radvariante.
   *
   * Wie alles hier: frei erfunden. Sie sind da, damit sich die Darstellung
   * dieser Abschnitte pruefen laesst -- nicht als Fahrzeugdaten.
   */
  for (const [jahr, aenderung] of [
    [2015, 'Erfundene Angabe: Markteinfuehrung.'],
    [2018, 'Erfundene Angabe: ueberarbeitete Frontpartie, neues Infotainment.'],
    [2020, 'Erfundene Angabe: letztes Modelljahr vor dem Auslauf.'],
  ] as const) {
    await prisma.modelYear.create({
      data: {
        generationId: generation.id,
        year: jahr,
        changes: aenderung,
        ...veroeffentlicht,
      },
    });
  }

  const sondermodell = await prisma.specialEdition.create({
    data: {
      generationId: generation.id,
      name: 'Muster Edition',
      slug: 'muster-edition',
      code: 'ME1',
      yearFrom: 2019,
      yearTo: 2020,
      // Ausdruecklich ohne Stueckzahl: Die Oberflaeche soll zeigen, wie sie
      // eine nicht belegte Zahl behandelt.
      marketRegion: 'Europa',
      description: 'Erfundene Sonderserie zur Ansicht der Darstellung.',
      distinguishingFeatures: 'Erfundenes Erkennungsmerkmal: Schriftzug am Kotfluegel.',
      ...veroeffentlicht,
    },
  });

  await prisma.specialEditionItem.createMany({
    data: [
      { specialEditionId: sondermodell.id, optionId: scheinwerfer.id, optional: false },
      { specialEditionId: sondermodell.id, optionId: sitzheizung.id, optional: true },
    ],
  });
  await veroeffentlichen('specialEdition', sondermodell.id);

  const farben = [
    { name: 'Musterschwarz', code: '001', kind: 'UNI' as const, hex: '#141416', rarity: 'COMMON' as const, aufpreis: null },
    { name: 'Musterrot Metallic', code: '475', kind: 'METALLIC' as const, hex: '#b5142c', rarity: 'RARE' as const, aufpreis: 89000 },
    { name: 'Musterblau Perleffekt', code: 'A2B', kind: 'PEARL_EFFECT' as const, hex: '#2a3f6b', rarity: 'VERY_RARE' as const, aufpreis: 145000 },
  ];

  for (const farbe of farben) {
    const lack = await prisma.paintColor.create({
      data: {
        manufacturerId: marke.id,
        name: farbe.name,
        slug: farbe.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        code: farbe.code,
        kind: farbe.kind,
        approximateHex: farbe.hex,
        rarity: farbe.rarity,
        rarityEvidenceType: 'MARKET_SIGNAL',
        rarityReasoning: 'Frei erfundene Begruendung, ausschliesslich zur Ansicht.',
        rarityDataBasis: 'Erfundene Datengrundlage.',
        ...veroeffentlicht,
      },
    });

    await prisma.paintColorAvailability.create({
      data: {
        paintColorId: lack.id,
        generationId: generation.id,
        kind: farbe.aufpreis === null ? 'STANDARD' : 'OPTIONAL',
        yearFrom: 2014,
        yearTo: 2021,
        surchargeCents: farbe.aufpreis,
        surchargeAsOf: farbe.aufpreis === null ? null : new Date('2018-01-01'),
      },
    });

    await veroeffentlichen('paintColor', lack.id);
  }

  const rad = await prisma.wheelOption.create({
    data: {
      manufacturerId: marke.id,
      name: 'Muster-Doppelspeiche 118',
      slug: 'muster-doppelspeiche-118',
      code: 'S2NP',
      diameterInch: 18,
      widthInch: 8,
      tyreSize: '225/45 R18',
      design: 'Doppelspeiche',
      rarity: 'UNCOMMON',
      rarityEvidenceType: 'ASSESSMENT',
      rarityReasoning: 'Frei erfundene Begruendung, ausschliesslich zur Ansicht.',
      ...veroeffentlicht,
    },
  });

  await prisma.wheelOptionAvailability.create({
    data: {
      wheelOptionId: rad.id,
      generationId: generation.id,
      trimLineId: linien['Muster Sport'] ?? null,
      kind: 'OPTIONAL',
      yearFrom: 2014,
      yearTo: 2021,
      surchargeCents: 120000,
    },
  });
  await veroeffentlichen('wheelOption', rad.id);

  console.log(`Demobestand angelegt: /katalog/${MARKE_SLUG}/muster-300/zweite-generation`);
  console.log('ACHTUNG: Alle Werte sind frei erfunden und nicht fuer den Betrieb bestimmt.');
}

async function main(): Promise<void> {
  try {
    if (process.argv.includes('--entfernen')) {
      await entfernen();
    } else {
      await anlegen();
    }
  } finally {
    await prisma.$disconnect();
  }
}

void main();
