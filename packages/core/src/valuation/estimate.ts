import type { MarketBasis } from '../ports/market-data';

import type { ValuationAssumptions } from './assumptions';
import { describeAssumptions } from './assumptions';
import type { FactorResult, ValuationFactor } from './factors';

/**
 * Aus Faktoren und Grundwert eine Bewertung machen -- oder ehrlich sagen,
 * dass keine Zahl herauskommt.
 *
 * Der ganze Aufbau dreht sich um einen Satz aus dem Plan: "Keine erfundenen
 * Marktwerte." Ohne Grundwert aus tatsaechlichen Angeboten gibt es hier
 * keinen Eurobetrag. Die Faktorenanalyse gibt es trotzdem -- sie ist auch
 * ohne Bezugspunkt brauchbar, weil sie sagt, was an diesem Fahrzeug den
 * Preis hebt und was ihn drueckt.
 */

export type ValuationBasis = 'COMPARABLES' | 'NONE';

export type ValuationConfidence = 'GOOD' | 'LIMITED' | 'WEAK' | 'NONE';

export interface ValuationRange {
  /** Untere und obere Grenze in Cent. */
  lowCents: number;
  highCents: number;
}

export interface Valuation {
  basis: ValuationBasis;
  confidence: ValuationConfidence;
  /** Geschaetzter Marktwert in Cent. Null, wenn kein Grundwert vorliegt. */
  marketValueCents: number | null;
  /** Empfohlener Inseratspreis in Cent. Null ohne Grundwert. */
  suggestedListingCents: number | null;
  /** Realistische Verkaufsspanne. Null ohne Grundwert. */
  realisticRange: ValuationRange | null;
  /** Alle Faktoren, absteigend nach Gewicht. */
  factors: ValuationFactor[];
  valueDrivers: ValuationFactor[];
  valueReducers: ValuationFactor[];
  /** Begruendung in ganzen Saetzen, zur Anzeige. */
  reasoning: string[];
  /** Fehlende Angaben, ausdruecklich benannt. */
  missingFields: string[];
  /** Herkunft des Grundwerts, sofern vorhanden. */
  source: {
    label: string;
    sampleSize: number;
    observedFrom: Date;
    observedTo: Date;
    priceKind: 'ASKING' | 'ACHIEVED';
  } | null;
  /** Womit gerechnet wurde. */
  assumptionsId: string;
  assumptionNotes: string[];
  /**
   * Der Satz, der immer mitgeht. Eine Bewertung ohne diese Einordnung
   * liest sich wie ein Gutachten und ist keines.
   */
  disclaimer: string;
}

const HINWEIS =
  'Diese Bewertung ist eine Schätzung, kein Gutachten und kein verbindlicher ' +
  'Preis. Sie beruht auf Ihren Angaben und den genannten Annahmen.';

/**
 * Ein Angebotspreis ist kein erzielter Preis.
 *
 * Wer aus Angeboten rechnet, rechnet aus Wunschvorstellungen. Der Abschlag
 * dafuer ist selbst eine Annahme -- deshalb steht er in der Begruendung.
 */
const ANGEBOTSABSCHLAG = 0.07;

/** Aufschlag auf den Marktwert fuer den Inseratspreis: Raum zum Verhandeln. */
const VERHANDLUNGSSPIELRAUM = 0.05;

function euro(cents: number): string {
  return (cents / 100).toLocaleString('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  });
}

/** Auf volle 50 Euro runden. Ein Schaetzwert auf den Cent genau taeuscht Genauigkeit vor. */
function rundeAufFuenfzigEuro(cents: number): number {
  return Math.round(cents / 5000) * 5000;
}

/**
 * Guete der Bewertung.
 *
 * Sie haengt an der Stichprobe, am Alter der Beobachtung und an der Zahl
 * fehlender Angaben -- nicht am Wunsch, eine belastbare Zahl zu liefern.
 */
export function assessConfidence(
  basis: MarketBasis | null,
  fehlendeAngaben: number,
  now: Date,
): ValuationConfidence {
  if (!basis) return 'NONE';

  const monateAlt = (now.getTime() - basis.observedTo.getTime()) / (30.44 * 24 * 3600 * 1000);
  if (basis.sampleSize < 8 || monateAlt > 12) return 'WEAK';
  if (basis.sampleSize < 25 || monateAlt > 6 || fehlendeAngaben > 2) return 'LIMITED';
  return 'GOOD';
}

export function buildValuation(input: {
  factorResult: FactorResult;
  basis: MarketBasis | null;
  assumptions: ValuationAssumptions;
  now: Date;
  /** Grund, warum kein Grundwert vorliegt. Wird woertlich ausgegeben. */
  missingBasisReason?: string;
}): Valuation {
  const { factorResult, basis, assumptions, now } = input;

  const treiber = factorResult.factors.filter((f) => f.direction === 'RAISES');
  const minderer = factorResult.factors.filter((f) => f.direction === 'LOWERS');
  const konfidenz = assessConfidence(basis, factorResult.missingFields.length, now);

  const gemeinsam = {
    factors: factorResult.factors,
    valueDrivers: treiber,
    valueReducers: minderer,
    missingFields: factorResult.missingFields,
    assumptionsId: assumptions.id,
    assumptionNotes: describeAssumptions(assumptions),
    disclaimer: HINWEIS,
  };

  if (!basis) {
    const begruendung = [
      input.missingBasisReason ??
        'Für diese Baureihe liegen keine Vergleichsangebote vor. Ein Marktwert in Euro ' +
          'lässt sich daraus nicht ableiten — eine Zahl zu nennen hieße, sie zu erfinden.',
      'Was sich ohne Vergleichsangebote sagen lässt, steht unten: welche Merkmale dieses ' +
        'Fahrzeugs den Preis heben und welche ihn drücken.',
    ];

    if (factorResult.factors.length === 0) {
      begruendung.push(
        'Bislang ist keine Angabe gemacht, die sich auswerten ließe. Kilometerstand, ' +
          'Erstzulassung und Zustand wären der Anfang.',
      );
    } else {
      begruendung.push(
        `Zusammengenommen liegt dieses Fahrzeug etwa ${(factorResult.totalAdjustment * 100).toFixed(0)} % ` +
          'über oder unter einem durchschnittlichen Fahrzeug derselben Baureihe — sobald ein ' +
          'Vergleichswert vorliegt, lässt sich das in Euro umrechnen.',
      );
    }

    return {
      ...gemeinsam,
      basis: 'NONE',
      confidence: 'NONE',
      marketValueCents: null,
      suggestedListingCents: null,
      realisticRange: null,
      reasoning: begruendung,
      source: null,
    };
  }

  const angebotskorrektur = basis.priceKind === 'ASKING' ? 1 - ANGEBOTSABSCHLAG : 1;
  const grundwert = basis.medianCents * angebotskorrektur;
  const marktwert = rundeAufFuenfzigEuro(grundwert * (1 + factorResult.totalAdjustment));

  const spanne: ValuationRange = {
    lowCents: rundeAufFuenfzigEuro(
      basis.lowerQuartileCents * angebotskorrektur * (1 + factorResult.totalAdjustment),
    ),
    highCents: rundeAufFuenfzigEuro(
      basis.upperQuartileCents * angebotskorrektur * (1 + factorResult.totalAdjustment),
    ),
  };

  const begruendung = [
    `Grundlage sind ${basis.sampleSize} Vergleichsangebote aus ${basis.sourceLabel}, ` +
      `beobachtet zwischen ${basis.observedFrom.toLocaleDateString('de-DE')} und ` +
      `${basis.observedTo.toLocaleDateString('de-DE')}.`,
  ];

  if (basis.priceKind === 'ASKING') {
    begruendung.push(
      `Die Vergleichswerte sind Angebotspreise, keine erzielten Preise. Dafür sind ` +
        `${(ANGEBOTSABSCHLAG * 100).toFixed(0)} % abgezogen — auch das ist eine Annahme.`,
    );
  }

  begruendung.push(
    factorResult.totalAdjustment === 0
      ? 'Die Angaben zu diesem Fahrzeug ergeben in der Summe keine Abweichung vom Durchschnitt.'
      : `Die Angaben zu diesem Fahrzeug ergeben in der Summe ` +
        `${(factorResult.totalAdjustment * 100).toFixed(0)} % gegenüber dem Durchschnitt.`,
  );

  if (factorResult.capped) {
    begruendung.push(
      'Die Summe der Einzelfaktoren wurde begrenzt. Einzelne Merkmale addieren sich nicht ' +
        'beliebig — sonst käme bei jedem zusätzlichen Mangel ein weiterer Abschlag heraus.',
    );
  }

  if (factorResult.missingFields.length > 0) {
    begruendung.push(
      `Ohne ${factorResult.missingFields.join(', ')} bleibt die Schätzung ungenauer als nötig.`,
    );
  }

  const inserat = rundeAufFuenfzigEuro(marktwert * (1 + VERHANDLUNGSSPIELRAUM));
  begruendung.push(
    `Der empfohlene Inseratspreis liegt mit ${euro(inserat)} über dem geschätzten Marktwert ` +
      `von ${euro(marktwert)} — üblicherweise wird verhandelt.`,
  );

  return {
    ...gemeinsam,
    basis: 'COMPARABLES',
    confidence: konfidenz,
    marketValueCents: marktwert,
    suggestedListingCents: inserat,
    realisticRange: spanne,
    reasoning: begruendung,
    source: {
      label: basis.sourceLabel,
      sampleSize: basis.sampleSize,
      observedFrom: basis.observedFrom,
      observedTo: basis.observedTo,
      priceKind: basis.priceKind,
    },
  };
}
