import type { DraftForContext } from '../sales/field-guard';

import type { ValuationAssumptions } from './assumptions';

/**
 * Die Faktorenanalyse.
 *
 * Sie ist der Teil der Bewertung, der ohne Marktdaten funktioniert: Wie
 * dieses Fahrzeug relativ zu einem durchschnittlichen Fahrzeug derselben
 * Baureihe dasteht. Was sie NICHT liefert, ist der Bezugspunkt -- der kommt
 * aus Marktdaten oder gar nicht.
 *
 * Jeder Faktor traegt seine Begruendung mit. Eine Prozentzahl ohne Satz
 * daneben ist fuer die verkaufende Person wertlos; sie will wissen, warum.
 */

export type FactorDirection = 'RAISES' | 'LOWERS' | 'NEUTRAL';

export interface ValuationFactor {
  /** Stabile Kennung, damit sich Faktoren wiedererkennen lassen. */
  id: string;
  label: string;
  direction: FactorDirection;
  /** Anteil, um den dieser Faktor den Grundwert veraendert (0.05 = +5 %). */
  adjustment: number;
  /** Begruendung im Klartext. */
  reasoning: string;
}

export interface FactorInput extends DraftForContext {
  /** Bezugszeitpunkt. Uebergeben statt `new Date()`, damit Tests bestimmbar sind. */
  now: Date;
}

function jahre(von: Date, bis: Date): number {
  return (bis.getTime() - von.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
}

function begrenze(wert: number, unten: number, oben: number): number {
  return Math.min(oben, Math.max(unten, wert));
}

function richtung(anpassung: number): FactorDirection {
  if (anpassung > 0.0001) return 'RAISES';
  if (anpassung < -0.0001) return 'LOWERS';
  return 'NEUTRAL';
}

const ZUSTAND_TEXT: Record<string, string> = {
  EXCELLENT: 'sehr gut',
  GOOD: 'gut',
  FAIR: 'gebrauchsspurig',
  POOR: 'reparaturbedürftig',
};

const SERVICE_TEXT: Record<string, string> = {
  FULL_MANUFACTURER: 'Scheckheft lückenlos beim Hersteller',
  FULL_INDEPENDENT: 'Scheckheft lückenlos in freier Werkstatt',
  PARTIAL: 'Scheckheft teilweise geführt',
  NONE: 'kein Scheckheft vorhanden',
  UNKNOWN: 'Servicehistorie nicht bekannt',
};

/**
 * Kilometerstand gegen die erwartete Fahrleistung.
 *
 * Ohne Erstzulassung laesst sich ein Kilometerstand nicht einordnen: 90.000 km
 * sind bei drei Jahren viel und bei fuenfzehn Jahren wenig. Fehlt eines von
 * beidem, entsteht kein Faktor -- und die fehlende Angabe wird gemeldet.
 */
function kilometerFaktor(
  input: FactorInput,
  a: ValuationAssumptions,
): ValuationFactor | null {
  if (input.mileageKm === null || input.firstRegistration === null) return null;

  const alter = jahre(input.firstRegistration, input.now);
  if (alter < 0.25) return null;

  const erwartet = alter * a.expectedAnnualKm;
  const abweichung = erwartet - input.mileageKm;
  const zehntausender = abweichung / 10_000;
  const satz = abweichung >= 0 ? a.perTenThousandKmBelow : a.perTenThousandKmAbove;
  const anpassung = begrenze(zehntausender * satz, -a.mileageCap, a.mileageCap);

  const gerundet = Math.round(Math.abs(abweichung) / 1000) * 1000;
  const erwartetText = Math.round(erwartet).toLocaleString('de-DE');
  const reasoning =
    abweichung >= 0
      ? `Bei ${alter.toFixed(1)} Jahren wären rund ${erwartetText} km zu erwarten. ` +
        `Der Stand liegt etwa ${gerundet.toLocaleString('de-DE')} km darunter.`
      : `Bei ${alter.toFixed(1)} Jahren wären rund ${erwartetText} km zu erwarten. ` +
        `Der Stand liegt etwa ${gerundet.toLocaleString('de-DE')} km darüber.`;

  return {
    id: 'mileage',
    label: 'Kilometerstand',
    direction: richtung(anpassung),
    adjustment: anpassung,
    reasoning,
  };
}

function zustandFaktor(input: FactorInput, a: ValuationAssumptions): ValuationFactor | null {
  if (!input.condition) return null;
  const anpassung = a.condition[input.condition];
  if (anpassung === undefined) return null;

  return {
    id: 'condition',
    label: 'Zustand',
    direction: richtung(anpassung),
    adjustment: anpassung,
    reasoning: `Angegeben ist „${ZUSTAND_TEXT[input.condition] ?? input.condition}".`,
  };
}

function serviceFaktor(input: FactorInput, a: ValuationAssumptions): ValuationFactor | null {
  if (!input.serviceHistory) return null;
  const anpassung = a.serviceHistory[input.serviceHistory];
  if (anpassung === undefined) return null;

  return {
    id: 'serviceHistory',
    label: 'Servicehistorie',
    direction: richtung(anpassung),
    adjustment: anpassung,
    reasoning: `Angegeben ist „${SERVICE_TEXT[input.serviceHistory] ?? input.serviceHistory}".`,
  };
}

function vorbesitzerFaktor(
  input: FactorInput,
  a: ValuationAssumptions,
): ValuationFactor | null {
  if (input.previousOwners === null) return null;
  if (input.previousOwners <= 2) {
    return {
      id: 'previousOwners',
      label: 'Vorbesitzer',
      direction: 'NEUTRAL',
      adjustment: 0,
      reasoning:
        input.previousOwners === 0
          ? 'Erstbesitz.'
          : `${input.previousOwners} Vorbesitzer — im üblichen Rahmen.`,
    };
  }

  const ueberzaehlig = input.previousOwners - 2;
  const anpassung = Math.max(a.ownerCap, ueberzaehlig * a.perOwnerAboveTwo);
  return {
    id: 'previousOwners',
    label: 'Vorbesitzer',
    direction: richtung(anpassung),
    adjustment: anpassung,
    reasoning: `${input.previousOwners} Vorbesitzer.`,
  };
}

/**
 * Hauptuntersuchung.
 *
 * Eine abgelaufene HU ist nicht nur ein Formfehler: Der Kaeufer traegt das
 * Risiko der Nachbesserung, und er rechnet es ein.
 */
function huFaktor(input: FactorInput, a: ValuationAssumptions): ValuationFactor | null {
  if (input.huValidUntil === null) return null;

  const monate = (input.huValidUntil.getTime() - input.now.getTime()) / (30.44 * 24 * 3600 * 1000);
  if (monate < 0) {
    return {
      id: 'hu',
      label: 'Hauptuntersuchung',
      direction: richtung(a.huExpired),
      adjustment: a.huExpired,
      reasoning: 'Die Hauptuntersuchung ist abgelaufen. Die Kosten trägt sonst der Käufer.',
    };
  }
  if (monate >= 12) {
    return {
      id: 'hu',
      label: 'Hauptuntersuchung',
      direction: richtung(a.huLongValid),
      adjustment: a.huLongValid,
      reasoning: 'Die Hauptuntersuchung läuft noch mindestens zwölf Monate.',
    };
  }
  return {
    id: 'hu',
    label: 'Hauptuntersuchung',
    direction: 'NEUTRAL',
    adjustment: 0,
    reasoning: `Die Hauptuntersuchung läuft noch rund ${Math.round(monate)} Monate.`,
  };
}

/**
 * Unfallschaden und sonstige Schaeden.
 *
 * "Keine Angabe" ist hier ausdruecklich kein "unfallfrei". Wer nichts sagt,
 * bekommt keinen Zuschlag -- und keinen Abschlag.
 */
function schadenFaktoren(input: FactorInput, a: ValuationAssumptions): ValuationFactor[] {
  const faktoren: ValuationFactor[] = [];

  if (input.hadAccident === true) {
    faktoren.push({
      id: 'accident',
      label: 'Unfallschaden',
      direction: richtung(a.accident),
      adjustment: a.accident,
      reasoning:
        'Ein angegebener Unfallschaden wirkt sich deutlich aus, unabhängig von der ' +
        'Qualität der Instandsetzung.',
    });
  }

  const hatSchaeden = (input.damages ?? '').trim().length > 0;
  if (hatSchaeden) {
    faktoren.push({
      id: 'damages',
      label: 'Schäden',
      direction: richtung(a.damages),
      adjustment: a.damages,
      reasoning: 'Es sind Schäden angegeben.',
    });
  }

  return faktoren;
}

/** Angaben, ohne die die Bewertung erkennbar weniger wert ist. */
const WICHTIGE_ANGABEN: { schluessel: keyof DraftForContext; bezeichnung: string }[] = [
  { schluessel: 'mileageKm', bezeichnung: 'Kilometerstand' },
  { schluessel: 'firstRegistration', bezeichnung: 'Erstzulassung' },
  { schluessel: 'condition', bezeichnung: 'Zustand' },
  { schluessel: 'serviceHistory', bezeichnung: 'Servicehistorie' },
  { schluessel: 'previousOwners', bezeichnung: 'Zahl der Vorbesitzer' },
  { schluessel: 'huValidUntil', bezeichnung: 'HU gültig bis' },
  { schluessel: 'hadAccident', bezeichnung: 'Angabe zum Unfallschaden' },
];

export interface FactorResult {
  factors: ValuationFactor[];
  /** Summe aller Anpassungen, begrenzt. */
  totalAdjustment: number;
  /** Ob die Grenze gegriffen hat -- gehoert in die Begruendung. */
  capped: boolean;
  /** Angaben, die fehlen. Werden ausgegeben, nicht verschwiegen. */
  missingFields: string[];
}

export function assessFactors(
  input: FactorInput,
  assumptions: ValuationAssumptions,
): FactorResult {
  const faktoren = [
    kilometerFaktor(input, assumptions),
    zustandFaktor(input, assumptions),
    serviceFaktor(input, assumptions),
    vorbesitzerFaktor(input, assumptions),
    huFaktor(input, assumptions),
    ...schadenFaktoren(input, assumptions),
  ].filter((f): f is ValuationFactor => f !== null);

  const summe = faktoren.reduce((s, f) => s + f.adjustment, 0);
  const begrenzt = begrenze(summe, assumptions.totalLowerBound, assumptions.totalUpperBound);

  const fehlend = WICHTIGE_ANGABEN.filter(
    ({ schluessel }) => input[schluessel] === null || input[schluessel] === undefined,
  ).map(({ bezeichnung }) => bezeichnung);

  // Absteigend nach Gewicht: Was am staerksten wirkt, steht oben.
  faktoren.sort((links, rechts) => Math.abs(rechts.adjustment) - Math.abs(links.adjustment));

  return {
    factors: faktoren,
    totalAdjustment: begrenzt,
    capped: Math.abs(begrenzt - summe) > 0.0001,
    missingFields: fehlend,
  };
}
