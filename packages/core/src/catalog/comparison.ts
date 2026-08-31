import { DataQuality, schwaechsteGuete } from './data-quality';

/**
 * Fahrzeugvergleich.
 *
 * Der heikle Teil eines Vergleichs ist nicht das Nebeneinanderstellen,
 * sondern der Umgang mit Luecken. Wenn bei einem Fahrzeug der Verbrauch
 * fehlt und beim anderen nicht, darf das vollstaendigere Fahrzeug nicht
 * automatisch "besser" aussehen -- und schon gar nicht darf die Luecke
 * stillschweigend als 0 in eine Rechnung eingehen.
 *
 * Deshalb: Ein Merkmal wird nur dann als besser/schlechter markiert, wenn es
 * bei ALLEN verglichenen Fahrzeugen vorliegt. Sonst steht dort "nicht
 * vergleichbar" mit dem Grund.
 */

export type CompareDirection = 'HIGHER_IS_BETTER' | 'LOWER_IS_BETTER' | 'NEUTRAL';

export interface CompareField {
  key: string;
  label: string;
  unit?: string | undefined;
  direction: CompareDirection;
  /** Wie viele Nachkommastellen die Anzeige hat. */
  decimals?: number | undefined;
}

/**
 * Die Merkmale, die verglichen werden.
 *
 * Bewusst als Liste und nicht als freie Auswahl: Ein Vergleich, bei dem
 * jede Seite andere Merkmale zeigt, vergleicht nichts.
 */
export const COMPARE_FIELDS: CompareField[] = [
  { key: 'powerKw', label: 'Leistung', unit: 'kW', direction: 'HIGHER_IS_BETTER' },
  { key: 'torqueNm', label: 'Drehmoment', unit: 'Nm', direction: 'HIGHER_IS_BETTER' },
  {
    key: 'acceleration0to100',
    label: '0 auf 100 km/h',
    unit: 's',
    direction: 'LOWER_IS_BETTER',
    decimals: 1,
  },
  { key: 'topSpeedKmh', label: 'Höchstgeschwindigkeit', unit: 'km/h', direction: 'HIGHER_IS_BETTER' },
  {
    key: 'consumptionCombined',
    label: 'Verbrauch kombiniert',
    direction: 'LOWER_IS_BETTER',
    decimals: 1,
  },
  { key: 'co2CombinedGramPerKm', label: 'CO₂ kombiniert', unit: 'g/km', direction: 'LOWER_IS_BETTER' },
  { key: 'kerbWeightKg', label: 'Leergewicht', unit: 'kg', direction: 'LOWER_IS_BETTER' },
  { key: 'fuelTankLitres', label: 'Tankinhalt', unit: 'l', direction: 'NEUTRAL' },
  { key: 'batteryCapacityKwh', label: 'Batterie nutzbar', unit: 'kWh', direction: 'HIGHER_IS_BETTER' },
  { key: 'electricRangeKm', label: 'Elektrische Reichweite', unit: 'km', direction: 'HIGHER_IS_BETTER' },
  { key: 'seats', label: 'Sitzplätze', unit: '', direction: 'NEUTRAL' },
  { key: 'doors', label: 'Türen', unit: '', direction: 'NEUTRAL' },
  { key: 'payloadKg', label: 'Zuladung', unit: 'kg', direction: 'HIGHER_IS_BETTER' },
  {
    key: 'towingCapacityBrakedKg',
    label: 'Anhängelast gebremst',
    unit: 'kg',
    direction: 'HIGHER_IS_BETTER',
  },
];

export interface CompareCandidate {
  id: string;
  label: string;
  /** Messzyklus des Verbrauchs. Ohne ihn ist der Wert nicht vergleichbar. */
  measurementStandard?: string | null | undefined;
  dataQuality?: DataQuality | null | undefined;
  values: Record<string, number | null | undefined>;
}

export interface CompareCell {
  candidateId: string;
  value: number | null;
  /** Bestes Ergebnis in dieser Zeile? Nur bei vollstaendiger Zeile gesetzt. */
  best: boolean;
  worst: boolean;
}

export interface CompareRow {
  field: CompareField;
  cells: CompareCell[];
  /** Sind alle Werte da und ist die Zeile ueberhaupt bewertbar? */
  comparable: boolean;
  /** Warum nicht, wenn nicht. */
  incomparableReason: string | null;
}

export interface CompareResult {
  candidates: CompareCandidate[];
  rows: CompareRow[];
  /** Die schwaechste Guete ueber alle Fahrzeuge. */
  quality: DataQuality | null;
  notes: string[];
}

export const MAX_VERGLEICH = 4;

export function vergleiche(kandidaten: CompareCandidate[]): CompareResult {
  const auswahl = kandidaten.slice(0, MAX_VERGLEICH);

  /*
   * Verbrauch und CO2 nur vergleichen, wenn derselbe Messzyklus zugrunde
   * liegt. NEFZ- gegen WLTP-Werte zu stellen ergibt einen Unterschied von
   * zehn bis zwanzig Prozent, der nichts ueber die Fahrzeuge aussagt.
   */
  const zyklen = new Set(
    auswahl.map((k) => k.measurementStandard ?? 'UNKNOWN'),
  );
  const zyklusEinheitlich = zyklen.size === 1 && !zyklen.has('UNKNOWN');

  const zyklusFelder = new Set(['consumptionCombined', 'co2CombinedGramPerKm']);

  const rows: CompareRow[] = COMPARE_FIELDS.map((field) => {
    const werte = auswahl.map((k) => {
      const roh = k.values[field.key];
      return typeof roh === 'number' && Number.isFinite(roh) ? roh : null;
    });

    const vollstaendig = werte.every((w) => w !== null);
    const belegt = werte.filter((w) => w !== null).length;

    let comparable = vollstaendig && field.direction !== 'NEUTRAL' && auswahl.length > 1;
    let incomparableReason: string | null = null;

    if (!vollstaendig) {
      incomparableReason =
        belegt === 0
          ? 'Für keines der Fahrzeuge erfasst.'
          : `Nur bei ${belegt} von ${auswahl.length} Fahrzeugen erfasst — eine Lücke ist kein schlechterer Wert.`;
    } else if (field.direction === 'NEUTRAL') {
      incomparableReason = 'Kein Merkmal, bei dem mehr oder weniger besser wäre.';
    } else if (zyklusFelder.has(field.key) && !zyklusEinheitlich) {
      comparable = false;
      incomparableReason = zyklen.has('UNKNOWN')
        ? 'Bei mindestens einem Fahrzeug ist der Messzyklus nicht erfasst.'
        : 'Unterschiedliche Messzyklen (NEFZ/WLTP). Die Werte sind nicht vergleichbar.';
    }

    const gueltige = werte.filter((w): w is number => w !== null);
    const bester =
      comparable && gueltige.length > 0
        ? field.direction === 'LOWER_IS_BETTER'
          ? Math.min(...gueltige)
          : Math.max(...gueltige)
        : null;
    const schlechtester =
      comparable && gueltige.length > 0
        ? field.direction === 'LOWER_IS_BETTER'
          ? Math.max(...gueltige)
          : Math.min(...gueltige)
        : null;

    const cells: CompareCell[] = auswahl.map((k, i) => ({
      candidateId: k.id,
      value: werte[i] ?? null,
      // Bei Gleichstand ist niemand schlechter -- sonst waere die Markierung
      // eine Aussage ueber nichts.
      best: comparable && bester !== null && werte[i] === bester && bester !== schlechtester,
      worst:
        comparable &&
        schlechtester !== null &&
        werte[i] === schlechtester &&
        bester !== schlechtester,
    }));

    return { field, cells, comparable, incomparableReason };
  });

  const notes: string[] = [];
  if (auswahl.length < 2) {
    notes.push('Für einen Vergleich sind mindestens zwei Fahrzeuge nötig.');
  }
  if (kandidaten.length > MAX_VERGLEICH) {
    notes.push(
      `Es lassen sich höchstens ${MAX_VERGLEICH} Fahrzeuge nebeneinander stellen; die übrigen wurden weggelassen.`,
    );
  }
  if (!zyklusEinheitlich && auswahl.length > 1) {
    notes.push(
      'Verbrauch und CO₂ werden nicht gegenübergestellt, weil die Werte auf unterschiedlichen ' +
        'oder nicht erfassten Messzyklen beruhen.',
    );
  }
  const luecken = rows.filter((r) => !r.comparable).length;
  if (luecken > 0) {
    notes.push(
      `${luecken} von ${rows.length} Merkmalen sind nicht vergleichbar. Der Grund steht jeweils dabei.`,
    );
  }

  const gueten = auswahl
    .map((k) => k.dataQuality)
    .filter((q): q is DataQuality => typeof q === 'string');

  return {
    candidates: auswahl,
    rows,
    quality: schwaechsteGuete(gueten),
    notes,
  };
}
