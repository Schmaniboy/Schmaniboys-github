/**
 * Einheiten und ihre Umrechnung.
 *
 * Grundsatz: Jede Groesse wird genau einmal gespeichert, in der gesetzlichen
 * Einheit. Alles andere wird berechnet. Zwei Spalten fuer dieselbe Groesse --
 * etwa kW und PS -- laufen frueher oder spaeter auseinander, und dann ist
 * nicht mehr entscheidbar, welche stimmt.
 */

/** 1 metrische Pferdestaerke = 735,49875 Watt (gesetzlich festgelegt). */
const WATT_PER_PS = 735.49875;

export function kwToPs(kilowatt: number): number {
  return Math.round((kilowatt * 1000) / WATT_PER_PS);
}

export function psToKw(ps: number): number {
  return Math.round((ps * WATT_PER_PS) / 1000);
}

/** Newtonmeter je Liter Hubraum -- grobes Mass fuer die Auslegung. */
export function litresFromCcm(ccm: number): number {
  return Math.round(ccm / 100) / 10;
}

/**
 * Formatiert Leistung so, wie sie in Deutschland gelesen wird: kW zuerst,
 * PS in Klammern.
 */
export function formatPower(kilowatt: number | null | undefined): string | null {
  if (kilowatt === null || kilowatt === undefined) return null;
  return `${kilowatt} kW (${kwToPs(kilowatt)} PS)`;
}

export function formatDisplacement(ccm: number | null | undefined): string | null {
  if (ccm === null || ccm === undefined) return null;
  return `${litresFromCcm(ccm).toLocaleString('de-DE', { minimumFractionDigits: 1 })} l`;
}

/**
 * Bauzeitraum als Text. `null` bei yearTo heisst "laeuft noch",
 * `undefined` heisst "nicht erfasst" -- das ist nicht dasselbe.
 */
export function formatBuildPeriod(
  yearFrom: number | null | undefined,
  yearTo: number | null | undefined,
): string | null {
  if (yearFrom === null || yearFrom === undefined) return null;
  if (yearTo === null) return `seit ${yearFrom}`;
  if (yearTo === undefined) return `ab ${yearFrom}`;
  return yearFrom === yearTo ? String(yearFrom) : `${yearFrom}–${yearTo}`;
}

/**
 * Messzyklus im Klartext. Ein Verbrauchswert ohne Zyklus ist nicht
 * vergleichbar, deshalb wird der Zyklus immer mit ausgegeben.
 */
export const MEASUREMENT_LABELS: Record<string, string> = {
  NEDC: 'NEFZ',
  WLTP: 'WLTP',
  EPA: 'EPA',
  MANUFACTURER: 'Herstellerangabe',
  UNKNOWN: 'Messzyklus nicht erfasst',
};

export function formatConsumption(
  value: number | null | undefined,
  unit: string | null | undefined,
  standard: string,
): string | null {
  if (value === null || value === undefined) return null;
  const einheit = unit ?? 'l/100 km';
  const zyklus = MEASUREMENT_LABELS[standard] ?? MEASUREMENT_LABELS.UNKNOWN;
  return `${value.toLocaleString('de-DE', { minimumFractionDigits: 1 })} ${einheit} (${zyklus})`;
}

/**
 * Geldbetraege. Gespeichert wird in Cent, formatiert wird hier.
 *
 * Kosten stehen bewusst als Spanne. Ein Punktwert taeuscht bei Betriebskosten
 * eine Genauigkeit vor, die es nicht gibt.
 */
export function formatCentsRange(
  fromCents: number | null | undefined,
  toCents: number | null | undefined,
  currency = 'EUR',
): string | null {
  const format = (cents: number): string =>
    (cents / 100).toLocaleString('de-DE', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

  if (fromCents !== null && fromCents !== undefined && toCents !== null && toCents !== undefined) {
    return fromCents === toCents ? format(fromCents) : `${format(fromCents)} – ${format(toCents)}`;
  }
  if (fromCents !== null && fromCents !== undefined) return `ab ${format(fromCents)}`;
  if (toCents !== null && toCents !== undefined) return `bis ${format(toCents)}`;
  return null;
}

/** Laufleistungsspanne, etwa "ab 120.000 km" oder "120.000–180.000 km". */
export function formatMileageRange(
  fromKm: number | null | undefined,
  toKm: number | null | undefined,
): string | null {
  const format = (km: number): string => `${km.toLocaleString('de-DE')} km`;
  if (fromKm !== null && fromKm !== undefined && toKm !== null && toKm !== undefined) {
    return `${fromKm.toLocaleString('de-DE')}–${format(toKm)}`;
  }
  if (fromKm !== null && fromKm !== undefined) return `ab ${format(fromKm)}`;
  if (toKm !== null && toKm !== undefined) return `bis ${format(toKm)}`;
  return null;
}

/** Wartungsintervall aus Kilometern und/oder Monaten. */
export function formatInterval(
  km: number | null | undefined,
  months: number | null | undefined,
): string | null {
  const teile: string[] = [];
  if (km !== null && km !== undefined) teile.push(`${km.toLocaleString('de-DE')} km`);
  if (months !== null && months !== undefined) {
    teile.push(months % 12 === 0 ? `${months / 12} Jahre` : `${months} Monate`);
  }
  if (teile.length === 0) return null;
  // "oder" und nicht "und": Faellig ist, was zuerst eintritt.
  return teile.join(' oder ');
}

export const DRIVE_TYPE_LABELS: Record<string, string> = {
  FRONT: 'Frontantrieb',
  REAR: 'Heckantrieb',
  ALL: 'Allradantrieb',
};

export const FUEL_LABELS: Record<string, string> = {
  PETROL: 'Benzin',
  DIESEL: 'Diesel',
  HYBRID_PETROL: 'Hybrid (Benzin)',
  HYBRID_DIESEL: 'Hybrid (Diesel)',
  PLUGIN_HYBRID: 'Plug-in-Hybrid',
  ELECTRIC: 'Elektro',
  LPG: 'Autogas (LPG)',
  CNG: 'Erdgas (CNG)',
  HYDROGEN: 'Wasserstoff',
  OTHER: 'Sonstiges',
};

export const TRANSMISSION_LABELS: Record<string, string> = {
  MANUAL: 'Schaltgetriebe',
  AUTOMATIC_TORQUE_CONVERTER: 'Wandlerautomatik',
  AUTOMATED_MANUAL: 'automatisiertes Schaltgetriebe',
  DUAL_CLUTCH: 'Doppelkupplungsgetriebe',
  CVT: 'stufenloses Getriebe',
  REDUCTION_GEAR: 'Eingang-Getriebe',
  OTHER: 'Sonstiges',
};

export const ASPIRATION_LABELS: Record<string, string> = {
  NATURALLY_ASPIRATED: 'Saugmotor',
  TURBOCHARGED: 'Turbolader',
  SUPERCHARGED: 'Kompressor',
  TWINCHARGED: 'Turbo und Kompressor',
  ELECTRIC_DRIVE: 'Elektroantrieb',
  OTHER: 'Sonstiges',
};


/**
 * Bezeichnungen der technischen Felder.
 *
 * Werden an zwei Stellen gebraucht: fuer die Darstellung und fuer die Angabe,
 * welche Werte eine Quelle deckt. Zwei getrennte Listen wuerden auseinander
 * laufen, sobald ein Feld dazukommt.
 */
export const SPEC_FIELD_LABELS: Record<string, string> = {
  powerKw: 'Leistung',
  torqueNm: 'Drehmoment',
  acceleration0to100: 'Beschleunigung 0-100 km/h',
  topSpeedKmh: 'Höchstgeschwindigkeit',
  consumptionCombined: 'Verbrauch kombiniert',
  co2CombinedGramPerKm: 'CO₂-Ausstoß',
  kerbWeightKg: 'Leergewicht',
  payloadKg: 'Zuladung',
  batteryCapacityKwh: 'Batteriekapazität',
  electricRangeKm: 'Elektrische Reichweite',
  fuelTankLitres: 'Tankinhalt',
  emissionStandard: 'Abgasnorm',
  seats: 'Sitzplätze',
  doors: 'Türen',
  towingCapacityBrakedKg: 'Anhängelast gebremst',
  towingCapacityUnbrakedKg: 'Anhängelast ungebremst',
  displacementCcm: 'Hubraum',
  cylinders: 'Zylinder',
};

export const SPEC_FIELDS = Object.keys(SPEC_FIELD_LABELS);

/** Gewicht, Zuladung und Anhaengelast in Kilogramm. */
export function formatKilograms(value: number | null | undefined): string | null {
  if (value === null || value === undefined) return null;
  return `${value.toLocaleString('de-DE')} kg`;
}

export function formatKilometres(value: number | null | undefined): string | null {
  if (value === null || value === undefined) return null;
  return `${value.toLocaleString('de-DE')} km`;
}

/**
 * Anhaengelast. Beide Werte gehoeren zusammen genannt -- wer nur den
 * gebremsten Wert liest, ueberlaedt den ungebremsten Anhaenger.
 */
export function formatTowingCapacity(
  brakedKg: number | null | undefined,
  unbrakedKg: number | null | undefined,
): string | null {
  const teile: string[] = [];
  if (brakedKg !== null && brakedKg !== undefined) {
    teile.push(`${brakedKg.toLocaleString('de-DE')} kg gebremst`);
  }
  if (unbrakedKg !== null && unbrakedKg !== undefined) {
    teile.push(`${unbrakedKg.toLocaleString('de-DE')} kg ungebremst`);
  }
  return teile.length > 0 ? teile.join(' · ') : null;
}
