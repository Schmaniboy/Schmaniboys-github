/**
 * Automatische Qualitaetskontrolle.
 *
 * Was dieses Modul NICHT kann, steht zuerst, weil es sonst falsch verstanden
 * wird: Es kann nicht pruefen, ob ein Motorcode existiert. Dazu braeuchte es
 * die Unterlagen des Herstellers. Ein Code, der hier durchkommt, ist damit
 * nicht bestaetigt -- er ist nur nicht offensichtlich unmoeglich.
 *
 * Was es kann, ist der grosse Teil: innere Widersprueche finden. Ein
 * Elektromotor mit Turbolader. Euro 6 im Baujahr 1998. Eine Antriebsvariante,
 * die vor ihrer Generation angeboten wurde. 3000 PS aus 1,6 Litern. Ein
 * Facelift, das vor dem Modell beginnt. Solche Datensaetze entstehen beim
 * Abtippen, beim Importieren und beim Zusammenfuehren zweier Quellen -- und
 * sie fallen niemandem auf, weil jeder Wert fuer sich plausibel aussieht.
 *
 * Jeder Befund traegt eine Schwere. BLOCKER heisst: nicht uebernehmen.
 * WARNING heisst: uebernehmen, aber auf NEEDS_REVIEW setzen. HINT heisst:
 * jemand sollte einmal draufschauen.
 */

export type FindingSeverity = 'BLOCKER' | 'WARNING' | 'HINT';

export interface Finding {
  severity: FindingSeverity;
  /** Maschinenlesbare Kennung, etwa "motor.antrieb-widerspruch". */
  code: string;
  /** Was gefunden wurde, in einem Satz fuer Menschen. */
  message: string;
  /** Welches Feld betroffen ist. */
  field?: string | undefined;
}

const blocker = (code: string, message: string, field?: string): Finding => ({
  severity: 'BLOCKER',
  code,
  message,
  ...(field ? { field } : {}),
});
const warnung = (code: string, message: string, field?: string): Finding => ({
  severity: 'WARNING',
  code,
  message,
  ...(field ? { field } : {}),
});
const hinweis = (code: string, message: string, field?: string): Finding => ({
  severity: 'HINT',
  code,
  message,
  ...(field ? { field } : {}),
});

/** Gibt es einen Befund, der die Uebernahme verhindert? */
export function istBlockiert(befunde: Finding[]): boolean {
  return befunde.some((b) => b.severity === 'BLOCKER');
}

/**
 * Welche Guete ein Datensatz nach der Pruefung bekommen darf.
 *
 * Die Regel steht hier und nicht beim Aufrufer: Ein Datensatz mit einem
 * offenen Widerspruch darf nicht als bestaetigt in die Datenbank -- auch
 * dann nicht, wenn der Import ihn so mitbringt.
 */
export function gueteNachPruefung(
  gewuenscht: string,
  befunde: Finding[],
): 'VERIFIED' | 'PARTIALLY_VERIFIED' | 'EXPERIENCE' | 'UNVERIFIED' | 'NEEDS_REVIEW' {
  if (befunde.some((b) => b.severity === 'BLOCKER' || b.severity === 'WARNING')) {
    return 'NEEDS_REVIEW';
  }
  const erlaubt = [
    'VERIFIED',
    'PARTIALLY_VERIFIED',
    'EXPERIENCE',
    'UNVERIFIED',
    'NEEDS_REVIEW',
  ];
  return (erlaubt.includes(gewuenscht) ? gewuenscht : 'UNVERIFIED') as 'UNVERIFIED';
}

// ---------------------------------------------------------------------------
// Motor
// ---------------------------------------------------------------------------

export interface EngineForCheck {
  name?: string | null | undefined;
  code?: string | null | undefined;
  engineFamilyName?: string | null | undefined;
  displacementCcm?: number | null | undefined;
  cylinders?: number | null | undefined;
  cylinderLayout?: string | null | undefined;
  fuelType?: string | null | undefined;
  aspiration?: string | null | undefined;
  powerKw?: number | null | undefined;
  torqueNm?: number | null | undefined;
  emissionStandard?: string | null | undefined;
  yearFrom?: number | null | undefined;
  yearTo?: number | null | undefined;
}

/*
 * Motorcodes bestehen aus Grossbuchstaben und Ziffern, sind drei bis zwoelf
 * Zeichen lang und enthalten keine Leer- oder Sonderzeichen. Das ist eine
 * Formpruefung, keine Existenzpruefung -- "XXXX" kommt durch. Sie faengt,
 * was tatsaechlich passiert: "2.0 TDI" im Feld Motorcode.
 */
const MOTORCODE_FORM = /^[A-Z0-9]{3,12}$/;

/** Wann die jeweilige Abgasnorm fruehestens gelten konnte (EU-Typgenehmigung). */
const ABGASNORM_AB: { muster: RegExp; ab: number; label: string }[] = [
  { muster: /^euro\s?1$/i, ab: 1992, label: 'Euro 1' },
  { muster: /^euro\s?2$/i, ab: 1996, label: 'Euro 2' },
  { muster: /^euro\s?3$/i, ab: 2000, label: 'Euro 3' },
  { muster: /^euro\s?4$/i, ab: 2005, label: 'Euro 4' },
  { muster: /^euro\s?5[ab]?$/i, ab: 2009, label: 'Euro 5' },
  { muster: /^euro\s?6[a-z-]*$/i, ab: 2014, label: 'Euro 6' },
  { muster: /^euro\s?7.*$/i, ab: 2025, label: 'Euro 7' },
];

const ELEKTRISCH = new Set(['ELECTRIC']);
const VERBRENNER_MIT_HUBRAUM = new Set([
  'PETROL',
  'DIESEL',
  'HYBRID_PETROL',
  'HYBRID_DIESEL',
  'PLUGIN_HYBRID',
  'LPG',
  'CNG',
]);

export function pruefeMotor(motor: EngineForCheck): Finding[] {
  const befunde: Finding[] = [];

  if (motor.code) {
    const code = motor.code.trim();
    if (!MOTORCODE_FORM.test(code)) {
      befunde.push(
        blocker(
          'motor.code-form',
          `„${code}" sieht nicht wie ein Motorcode aus. Erwartet werden 3 bis 12 Großbuchstaben ` +
            'und Ziffern ohne Leerzeichen — „2.0 TDI" ist ein Handelsname, kein Code.',
          'code',
        ),
      );
    }
    if (motor.name && code.toUpperCase() === motor.name.trim().toUpperCase()) {
      befunde.push(
        hinweis(
          'motor.code-gleich-name',
          'Motorcode und Handelsname sind identisch. Das kommt vor, ist aber meist ein Zeichen ' +
            'dafür, dass der Code nicht bekannt war und der Name eingetragen wurde.',
          'code',
        ),
      );
    }
  } else {
    befunde.push(
      hinweis(
        'motor.code-fehlt',
        'Kein Motorcode erfasst. Ohne ihn lässt sich der Motor am Fahrzeug nicht eindeutig ' +
          'wiederfinden — mehrere technisch verschiedene Motoren teilen sich denselben Handelsnamen.',
        'code',
      ),
    );
  }

  const kraftstoff = motor.fuelType ?? null;
  const aufladung = motor.aspiration ?? null;

  if (kraftstoff && ELEKTRISCH.has(kraftstoff)) {
    if (aufladung && aufladung !== 'ELECTRIC_DRIVE' && aufladung !== 'OTHER') {
      befunde.push(
        blocker(
          'motor.elektro-aufladung',
          'Ein Elektromotor hat keine Aufladung. Turbolader oder Kompressor sind hier ein ' +
            'Widerspruch.',
          'aspiration',
        ),
      );
    }
    if ((motor.displacementCcm ?? 0) > 0) {
      befunde.push(
        blocker(
          'motor.elektro-hubraum',
          'Ein Elektromotor hat keinen Hubraum.',
          'displacementCcm',
        ),
      );
    }
    if ((motor.cylinders ?? 0) > 0) {
      befunde.push(
        blocker('motor.elektro-zylinder', 'Ein Elektromotor hat keine Zylinder.', 'cylinders'),
      );
    }
  }

  const hubraum = motor.displacementCcm ?? null;
  const zylinder = motor.cylinders ?? null;

  if (hubraum !== null) {
    if (hubraum < 400 || hubraum > 9000) {
      befunde.push(
        warnung(
          'motor.hubraum-bereich',
          `${hubraum} cm³ liegt außerhalb dessen, was in Personenkraftwagen verbaut wird ` +
            '(rund 600 bis 8200 cm³). Bitte prüfen — häufig ein Zahlendreher oder eine ' +
            'Verwechslung mit Litern.',
          'displacementCcm',
        ),
      );
    }
    if (zylinder !== null && zylinder > 0) {
      const jeZylinder = hubraum / zylinder;
      if (jeZylinder < 150 || jeZylinder > 1200) {
        befunde.push(
          warnung(
            'motor.hubraum-je-zylinder',
            `${Math.round(jeZylinder)} cm³ je Zylinder bei ${zylinder} Zylindern und ` +
              `${hubraum} cm³. Üblich sind 250 bis 900. Einer der beiden Werte stimmt vermutlich nicht.`,
            'cylinders',
          ),
        );
      }
    }
  }

  if (zylinder !== null && (zylinder < 1 || zylinder > 16)) {
    befunde.push(
      warnung('motor.zylinderzahl', `${zylinder} Zylinder ist unüblich.`, 'cylinders'),
    );
  }

  if (kraftstoff && VERBRENNER_MIT_HUBRAUM.has(kraftstoff) && hubraum === null) {
    befunde.push(
      hinweis(
        'motor.hubraum-fehlt',
        'Bei einem Verbrennungsmotor fehlt der Hubraum.',
        'displacementCcm',
      ),
    );
  }

  const leistung = motor.powerKw ?? null;
  if (leistung !== null) {
    if (leistung < 5 || leistung > 1500) {
      befunde.push(
        warnung(
          'motor.leistung-bereich',
          `${leistung} kW (${Math.round(leistung * 1.35962)} PS) liegt außerhalb des ` +
            'Üblichen. Bitte prüfen — eine häufige Ursache ist, dass PS ins kW-Feld geraten sind.',
          'powerKw',
        ),
      );
    }
    if (hubraum !== null && hubraum > 0 && !ELEKTRISCH.has(kraftstoff ?? '')) {
      const literleistung = leistung / (hubraum / 1000);
      if (literleistung > 200) {
        befunde.push(
          warnung(
            'motor.literleistung',
            `${Math.round(literleistung)} kW je Liter Hubraum. Selbst hochgezüchtete ` +
              'Serienmotoren bleiben unter 150. Leistung oder Hubraum ist vermutlich falsch.',
            'powerKw',
          ),
        );
      }
      if (literleistung < 15) {
        befunde.push(
          hinweis(
            'motor.literleistung-niedrig',
            `Nur ${Math.round(literleistung)} kW je Liter Hubraum. Ungewöhnlich niedrig.`,
            'powerKw',
          ),
        );
      }
    }
  }

  const drehmoment = motor.torqueNm ?? null;
  if (drehmoment !== null && leistung !== null) {
    /*
     * Drehmoment und Leistung haengen ueber die Drehzahl zusammen:
     * P[kW] = M[Nm] * n[1/min] / 9549. Bei Serienfahrzeugen liegt das
     * Verhaeltnis Nm je kW zwischen etwa 1,5 (hochdrehender Sauger) und 5
     * (Diesel mit viel Drehmoment). Alles darueber hinaus ist ein Fehler.
     */
    const verhaeltnis = drehmoment / leistung;
    if (verhaeltnis > 7 || verhaeltnis < 1.0) {
      befunde.push(
        warnung(
          'motor.drehmoment-leistung',
          `${drehmoment} Nm bei ${leistung} kW ergibt ${verhaeltnis.toFixed(1)} Nm je kW. ` +
            'Bei Serienmotoren liegt der Wert zwischen 1,5 und 5. Einer der beiden Werte ist ' +
            'vermutlich falsch.',
          'torqueNm',
        ),
      );
    }
  }

  if (motor.emissionStandard) {
    const norm = motor.emissionStandard.trim();
    const treffer = ABGASNORM_AB.find((eintrag) => eintrag.muster.test(norm));
    if (treffer && motor.yearFrom && motor.yearFrom < treffer.ab) {
      befunde.push(
        blocker(
          'motor.abgasnorm-baujahr',
          `${treffer.label} gilt frühestens ab ${treffer.ab}, der Motor ist ab ` +
            `${motor.yearFrom} eingetragen. Eines von beiden stimmt nicht.`,
          'emissionStandard',
        ),
      );
    }
  }

  if (motor.yearFrom && motor.yearTo && motor.yearTo < motor.yearFrom) {
    befunde.push(
      blocker(
        'motor.zeitraum',
        `Bauzeitraum endet (${motor.yearTo}) vor seinem Beginn (${motor.yearFrom}).`,
        'yearTo',
      ),
    );
  }

  return befunde;
}

// ---------------------------------------------------------------------------
// Zeitraeume in der Kette Modell -> Generation -> Facelift -> Antrieb
// ---------------------------------------------------------------------------

export interface PeriodForCheck {
  label: string;
  yearFrom?: number | null | undefined;
  yearTo?: number | null | undefined;
}

/**
 * Ein Zeitraum muss im Zeitraum seines Uebergeordneten liegen.
 *
 * Eine Facelift-Phase, die vor ihrer Generation beginnt, ist kein Detail:
 * Sie fuehrt dazu, dass Fahrzeuge der falschen Phase zugeordnet werden --
 * und damit die falschen Bilder und die falsche Ausstattung bekommen.
 */
export function pruefeZeitraum(kind: PeriodForCheck, eltern: PeriodForCheck): Finding[] {
  const befunde: Finding[] = [];

  if (kind.yearFrom && kind.yearTo && kind.yearTo < kind.yearFrom) {
    befunde.push(
      blocker(
        'zeitraum.verdreht',
        `${kind.label}: Ende (${kind.yearTo}) liegt vor dem Beginn (${kind.yearFrom}).`,
        'yearTo',
      ),
    );
  }
  if (kind.yearFrom && eltern.yearFrom && kind.yearFrom < eltern.yearFrom) {
    befunde.push(
      blocker(
        'zeitraum.vor-eltern',
        `${kind.label} beginnt ${kind.yearFrom}, ${eltern.label} erst ${eltern.yearFrom}.`,
        'yearFrom',
      ),
    );
  }
  if (kind.yearTo && eltern.yearTo && kind.yearTo > eltern.yearTo) {
    befunde.push(
      warnung(
        'zeitraum.nach-eltern',
        `${kind.label} endet ${kind.yearTo}, ${eltern.label} bereits ${eltern.yearTo}. ` +
          'Möglich bei Abverkauf, sonst ein Fehler.',
        'yearTo',
      ),
    );
  }

  return befunde;
}

// ---------------------------------------------------------------------------
// Antriebskombination
// ---------------------------------------------------------------------------

export interface PowertrainForCheck {
  powerKw?: number | null | undefined;
  torqueNm?: number | null | undefined;
  acceleration0to100?: number | null | undefined;
  topSpeedKmh?: number | null | undefined;
  consumptionCombined?: number | null | undefined;
  measurementStandard?: string | null | undefined;
  kerbWeightKg?: number | null | undefined;
  seats?: number | null | undefined;
  doors?: number | null | undefined;
  fuelType?: string | null | undefined;
  driveType?: string | null | undefined;
  transmissionType?: string | null | undefined;
  transmissionGears?: number | null | undefined;
  batteryCapacityKwh?: number | null | undefined;
  electricRangeKm?: number | null | undefined;
}

export function pruefeAntrieb(
  antrieb: PowertrainForCheck,
  motor?: EngineForCheck | null,
): Finding[] {
  const befunde: Finding[] = [];

  if (motor?.powerKw && antrieb.powerKw) {
    const abweichung = Math.abs(antrieb.powerKw - motor.powerKw) / motor.powerKw;
    if (abweichung > 0.15) {
      befunde.push(
        warnung(
          'antrieb.leistung-weicht-ab',
          `Die Kombination nennt ${antrieb.powerKw} kW, der Motor ${motor.powerKw} kW ` +
            `(${Math.round(abweichung * 100)} % Unterschied). Kleine Abweichungen sind normal, ` +
            'diese nicht — vermutlich ist die falsche Motorvariante zugeordnet.',
          'powerKw',
        ),
      );
    }
  }

  if (antrieb.consumptionCombined != null && !antrieb.measurementStandard) {
    befunde.push(
      warnung(
        'antrieb.verbrauch-ohne-zyklus',
        'Verbrauchswert ohne Messzyklus. NEFZ und WLTP unterscheiden sich um 10 bis 20 % — ' +
          'ohne den Zyklus ist der Wert nicht vergleichbar und damit wertlos.',
        'measurementStandard',
      ),
    );
  }
  if (antrieb.measurementStandard === 'UNKNOWN' && antrieb.consumptionCombined != null) {
    befunde.push(
      hinweis(
        'antrieb.zyklus-unbekannt',
        'Der Messzyklus ist als unbekannt erfasst. Der Verbrauchswert wird deshalb ohne ' +
          'Vergleichsmöglichkeit angezeigt.',
        'measurementStandard',
      ),
    );
  }

  if (antrieb.acceleration0to100 != null) {
    const wert = antrieb.acceleration0to100;
    if (wert < 1.5 || wert > 40) {
      befunde.push(
        warnung(
          'antrieb.beschleunigung',
          `${wert} s auf 100 km/h liegt außerhalb des Möglichen für Serienfahrzeuge.`,
          'acceleration0to100',
        ),
      );
    }
    if (antrieb.powerKw && antrieb.kerbWeightKg) {
      /*
       * Grobe Gegenprobe ueber das Leistungsgewicht. Bewusst weit gefasst:
       * Sie soll Zahlendreher fangen, nicht Fahrleistungen nachrechnen.
       */
      const kgJeKw = antrieb.kerbWeightKg / antrieb.powerKw;
      const erwartetMin = kgJeKw * 0.35;
      const erwartetMax = kgJeKw * 1.6;
      if (wert < erwartetMin || wert > erwartetMax) {
        befunde.push(
          hinweis(
            'antrieb.beschleunigung-passt-nicht',
            `${wert} s passt schlecht zu ${antrieb.powerKw} kW bei ${antrieb.kerbWeightKg} kg ` +
              `(erwartet grob ${erwartetMin.toFixed(1)} bis ${erwartetMax.toFixed(1)} s).`,
            'acceleration0to100',
          ),
        );
      }
    }
  }

  if (antrieb.topSpeedKmh != null && (antrieb.topSpeedKmh < 60 || antrieb.topSpeedKmh > 400)) {
    befunde.push(
      warnung(
        'antrieb.hoechstgeschwindigkeit',
        `${antrieb.topSpeedKmh} km/h ist für ein Serienfahrzeug unplausibel.`,
        'topSpeedKmh',
      ),
    );
  }

  if (antrieb.kerbWeightKg != null && (antrieb.kerbWeightKg < 400 || antrieb.kerbWeightKg > 4000)) {
    befunde.push(
      warnung(
        'antrieb.leergewicht',
        `${antrieb.kerbWeightKg} kg Leergewicht ist für einen Personenkraftwagen unplausibel.`,
        'kerbWeightKg',
      ),
    );
  }

  if (antrieb.seats != null && (antrieb.seats < 1 || antrieb.seats > 9)) {
    befunde.push(warnung('antrieb.sitze', `${antrieb.seats} Sitzplätze sind unplausibel.`, 'seats'));
  }
  if (antrieb.doors != null && (antrieb.doors < 2 || antrieb.doors > 6)) {
    befunde.push(warnung('antrieb.tueren', `${antrieb.doors} Türen sind unplausibel.`, 'doors'));
  }

  const elektrisch = antrieb.fuelType === 'ELECTRIC';
  if (elektrisch) {
    if (
      antrieb.transmissionType &&
      !['REDUCTION_GEAR', 'OTHER', 'AUTOMATIC_TORQUE_CONVERTER'].includes(
        antrieb.transmissionType,
      )
    ) {
      befunde.push(
        warnung(
          'antrieb.elektro-getriebe',
          'Ein Elektrofahrzeug mit Schalt- oder Doppelkupplungsgetriebe ist die große Ausnahme. ' +
            'Bitte prüfen.',
          'transmissionType',
        ),
      );
    }
    if (antrieb.transmissionGears != null && antrieb.transmissionGears > 2) {
      befunde.push(
        warnung(
          'antrieb.elektro-gaenge',
          `${antrieb.transmissionGears} Gänge bei einem Elektroantrieb. Üblich ist einer.`,
          'transmissionGears',
        ),
      );
    }
  } else {
    if (antrieb.batteryCapacityKwh != null && antrieb.fuelType && !antrieb.fuelType.includes('HYBRID')) {
      befunde.push(
        warnung(
          'antrieb.batterie-ohne-elektro',
          'Batteriekapazität bei einem Fahrzeug ohne Elektroantrieb erfasst.',
          'batteryCapacityKwh',
        ),
      );
    }
    if (antrieb.electricRangeKm != null && antrieb.fuelType && !antrieb.fuelType.includes('HYBRID')) {
      befunde.push(
        warnung(
          'antrieb.reichweite-ohne-elektro',
          'Elektrische Reichweite bei einem Fahrzeug ohne Elektroantrieb erfasst.',
          'electricRangeKm',
        ),
      );
    }
  }

  if (
    antrieb.transmissionGears != null &&
    (antrieb.transmissionGears < 1 || antrieb.transmissionGears > 10) &&
    !elektrisch
  ) {
    befunde.push(
      warnung(
        'antrieb.gangzahl',
        `${antrieb.transmissionGears} Gänge sind unplausibel.`,
        'transmissionGears',
      ),
    );
  }

  return befunde;
}

// ---------------------------------------------------------------------------
// Ausstattung
// ---------------------------------------------------------------------------

export interface EquipmentForCheck {
  name?: string | null | undefined;
  optionCode?: string | null | undefined;
  manufacturerSlug?: string | null | undefined;
}

/*
 * Bestellnummern folgen je Konzern einem Muster. Die Pruefung ist bewusst
 * nur dort scharf, wo das Muster eindeutig ist -- und sie ist eine
 * Formpruefung: Sie sagt nichts darueber, ob es die Nummer gibt.
 */
const CODE_MUSTER: { marken: string[]; muster: RegExp; beschreibung: string }[] = [
  {
    marken: ['bmw', 'mini'],
    muster: /^S?\d{3}[A-Z]$/,
    beschreibung: 'BMW-Sonderausstattungen haben die Form S610A (drei Ziffern, ein Buchstabe)',
  },
  {
    marken: ['volkswagen', 'audi', 'skoda', 'seat', 'cupra'],
    muster: /^(PR[- ]?)?[0-9A-Z]{3}$/,
    beschreibung: 'PR-Nummern im VW-Konzern haben drei Zeichen, etwa 7X2',
  },
];

export function pruefeAusstattungscode(ausstattung: EquipmentForCheck): Finding[] {
  const befunde: Finding[] = [];

  if (!ausstattung.optionCode) {
    befunde.push(
      hinweis(
        'ausstattung.code-fehlt',
        'Kein Bestellcode erfasst. Er ist das sicherste Merkmal, um eine Ausstattung am ' +
          'Fahrzeug nachzuweisen — über den Aufkleber im Serviceheft oder im Kofferraum.',
        'optionCode',
      ),
    );
    return befunde;
  }

  const code = ausstattung.optionCode.trim().toUpperCase();
  const marke = ausstattung.manufacturerSlug?.toLowerCase() ?? '';
  const regel = CODE_MUSTER.find((eintrag) => eintrag.marken.includes(marke));

  if (regel && !regel.muster.test(code)) {
    befunde.push(
      warnung(
        'ausstattung.code-form',
        `„${code}" passt nicht zum bekannten Format: ${regel.beschreibung}. Das kann eine ` +
          'Besonderheit sein — oder ein Tippfehler.',
        'optionCode',
      ),
    );
  }

  if (code.length > 16) {
    befunde.push(
      warnung(
        'ausstattung.code-laenge',
        'Der Bestellcode ist ungewöhnlich lang. Steht dort vielleicht eine Beschreibung?',
        'optionCode',
      ),
    );
  }

  return befunde;
}

// ---------------------------------------------------------------------------
// Dubletten
// ---------------------------------------------------------------------------

/**
 * Vergleichsschluessel fuer die Dublettensuche.
 *
 * Vereinheitlicht so weit, dass "Sitzheizung", "sitzheizung " und
 * "Sitz-Heizung" denselben Schluessel ergeben -- aber nicht so weit, dass
 * "Sitzheizung vorn" und "Sitzheizung hinten" zusammenfallen. Der zweite
 * Fehler waere der schlimmere: Er loescht eine echte Unterscheidung.
 */
export function vergleichsschluessel(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '')
    .trim();
}

export interface DuplicateGroup {
  key: string;
  ids: string[];
  labels: string[];
}

export function findeDubletten(
  eintraege: { id: string; label: string }[],
): DuplicateGroup[] {
  const gruppen = new Map<string, { ids: string[]; labels: string[] }>();

  for (const eintrag of eintraege) {
    const schluessel = vergleichsschluessel(eintrag.label);
    if (schluessel.length === 0) continue;
    const gruppe = gruppen.get(schluessel) ?? { ids: [], labels: [] };
    gruppe.ids.push(eintrag.id);
    gruppe.labels.push(eintrag.label);
    gruppen.set(schluessel, gruppe);
  }

  return [...gruppen.entries()]
    .filter(([, gruppe]) => gruppe.ids.length > 1)
    .map(([key, gruppe]) => ({ key, ids: gruppe.ids, labels: gruppe.labels }));
}
