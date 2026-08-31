import { describe, expect, it } from 'vitest';

import type { MarketBasis } from '../ports/market-data';
import { UnavailableMarketData } from '../ports/market-data';

import { DEFAULT_ASSUMPTIONS, describeAssumptions } from './assumptions';
import { assessFactors, type FactorInput } from './factors';
import { assessConfidence, buildValuation } from './estimate';

const JETZT = new Date('2026-08-22T12:00:00Z');

function entwurf(teil: Partial<FactorInput> = {}): FactorInput {
  return {
    now: JETZT,
    mileageKm: null,
    firstRegistration: null,
    previousOwners: null,
    huValidUntil: null,
    serviceHistory: null,
    condition: null,
    tyreCondition: null,
    damages: null,
    hadAccident: null,
    accidentDetails: null,
    additionalNotes: null,
    catalogConfirmedAt: JETZT,
    ...teil,
  };
}

function grundwert(teil: Partial<MarketBasis> = {}): MarketBasis {
  return {
    medianCents: 1_500_000,
    lowerQuartileCents: 1_350_000,
    upperQuartileCents: 1_700_000,
    sampleSize: 40,
    observedFrom: new Date('2026-06-01T00:00:00Z'),
    observedTo: new Date('2026-08-01T00:00:00Z'),
    sourceLabel: 'Testquelle',
    priceKind: 'ACHIEVED',
    ...teil,
  };
}

describe('Bewertung: Faktoren', () => {
  it('ordnet einen Kilometerstand nur mit Erstzulassung ein', () => {
    // 90.000 km sind bei drei Jahren viel und bei fuenfzehn Jahren wenig.
    // Ohne Erstzulassung darf kein Faktor entstehen.
    const ohne = assessFactors(entwurf({ mileageKm: 90_000 }), DEFAULT_ASSUMPTIONS);
    expect(ohne.factors.find((f) => f.id === 'mileage')).toBeUndefined();
    expect(ohne.missingFields).toContain('Erstzulassung');

    const jung = assessFactors(
      entwurf({ mileageKm: 90_000, firstRegistration: new Date('2023-08-22T00:00:00Z') }),
      DEFAULT_ASSUMPTIONS,
    );
    const alt = assessFactors(
      entwurf({ mileageKm: 90_000, firstRegistration: new Date('2011-08-22T00:00:00Z') }),
      DEFAULT_ASSUMPTIONS,
    );
    expect(jung.factors.find((f) => f.id === 'mileage')?.direction).toBe('LOWERS');
    expect(alt.factors.find((f) => f.id === 'mileage')?.direction).toBe('RAISES');
  });

  it('macht aus fehlender Unfallangabe kein "unfallfrei"', () => {
    const ohne = assessFactors(entwurf(), DEFAULT_ASSUMPTIONS);
    expect(ohne.factors.find((f) => f.id === 'accident')).toBeUndefined();
    expect(ohne.totalAdjustment).toBe(0);
    expect(ohne.missingFields).toContain('Angabe zum Unfallschaden');

    const unfallfrei = assessFactors(entwurf({ hadAccident: false }), DEFAULT_ASSUMPTIONS);
    // Unfallfreiheit ist der Normalfall, kein Zuschlag.
    expect(unfallfrei.factors.find((f) => f.id === 'accident')).toBeUndefined();
  });

  it('begrenzt die Summe, statt Abschlaege beliebig zu stapeln', () => {
    const schlimm = assessFactors(
      entwurf({
        mileageKm: 400_000,
        firstRegistration: new Date('2018-08-22T00:00:00Z'),
        condition: 'POOR',
        serviceHistory: 'NONE',
        previousOwners: 9,
        huValidUntil: new Date('2025-01-01T00:00:00Z'),
        hadAccident: true,
        damages: 'Durchrostung an beiden Schwellern.',
      }),
      DEFAULT_ASSUMPTIONS,
    );
    const summeRoh = schlimm.factors.reduce((s, f) => s + f.adjustment, 0);
    expect(summeRoh).toBeLessThan(DEFAULT_ASSUMPTIONS.totalLowerBound);
    expect(schlimm.totalAdjustment).toBe(DEFAULT_ASSUMPTIONS.totalLowerBound);
    expect(schlimm.capped).toBe(true);
  });

  it('sortiert die Faktoren nach Gewicht', () => {
    const ergebnis = assessFactors(
      entwurf({
        hadAccident: true,
        huValidUntil: new Date('2028-01-01T00:00:00Z'),
        condition: 'GOOD',
      }),
      DEFAULT_ASSUMPTIONS,
    );
    const gewichte = ergebnis.factors.map((f) => Math.abs(f.adjustment));
    expect(gewichte).toEqual([...gewichte].sort((a, b) => b - a));
    expect(ergebnis.factors[0]?.id).toBe('accident');
  });

  it('gibt zu jedem Faktor eine Begruendung aus', () => {
    const ergebnis = assessFactors(
      entwurf({ condition: 'EXCELLENT', serviceHistory: 'FULL_MANUFACTURER', previousOwners: 1 }),
      DEFAULT_ASSUMPTIONS,
    );
    expect(ergebnis.factors.length).toBeGreaterThan(0);
    for (const faktor of ergebnis.factors) {
      expect(faktor.reasoning.length).toBeGreaterThan(10);
      expect(faktor.label).not.toBe('');
    }
  });
});

describe('Bewertung: ohne Marktdaten', () => {
  it('nennt keinen Eurobetrag, wenn kein Grundwert vorliegt', () => {
    const ergebnis = buildValuation({
      factorResult: assessFactors(
        entwurf({ mileageKm: 60_000, firstRegistration: new Date('2020-01-01T00:00:00Z') }),
        DEFAULT_ASSUMPTIONS,
      ),
      basis: null,
      assumptions: DEFAULT_ASSUMPTIONS,
      now: JETZT,
    });

    expect(ergebnis.basis).toBe('NONE');
    expect(ergebnis.marketValueCents).toBeNull();
    expect(ergebnis.suggestedListingCents).toBeNull();
    expect(ergebnis.realisticRange).toBeNull();
    expect(ergebnis.confidence).toBe('NONE');
    // Aber die Faktorenanalyse gibt es trotzdem.
    expect(ergebnis.factors.length).toBeGreaterThan(0);
    expect(ergebnis.reasoning.join(' ')).toContain('erfinden');
  });

  it('nennt den Grund, wenn die Quelle einen mitgibt', () => {
    const quelle = new UnavailableMarketData();
    expect(quelle.isAvailable()).toBe(false);

    const ergebnis = buildValuation({
      factorResult: assessFactors(entwurf(), DEFAULT_ASSUMPTIONS),
      basis: null,
      assumptions: DEFAULT_ASSUMPTIONS,
      now: JETZT,
      missingBasisReason: quelle.reason,
    });
    expect(ergebnis.reasoning[0]).toContain('B4');
  });

  it('traegt die Annahmen immer mit', () => {
    const ergebnis = buildValuation({
      factorResult: assessFactors(entwurf(), DEFAULT_ASSUMPTIONS),
      basis: null,
      assumptions: DEFAULT_ASSUMPTIONS,
      now: JETZT,
    });
    expect(ergebnis.assumptionsId).toBe(DEFAULT_ASSUMPTIONS.id);
    expect(ergebnis.assumptionNotes).toEqual(describeAssumptions(DEFAULT_ASSUMPTIONS));
    expect(ergebnis.assumptionNotes.join(' ')).toContain('keine gemessenen Marktwerte');
    expect(ergebnis.disclaimer).toContain('Schätzung');
  });
});

describe('Bewertung: mit Marktdaten', () => {
  it('rechnet den Grundwert mit der Gesamtkorrektur', () => {
    const faktoren = assessFactors(
      entwurf({ condition: 'EXCELLENT', serviceHistory: 'FULL_MANUFACTURER' }),
      DEFAULT_ASSUMPTIONS,
    );
    // 5 % Zustand + 5 % Scheckheft = 10 %.
    expect(faktoren.totalAdjustment).toBeCloseTo(0.1, 5);

    const ergebnis = buildValuation({
      factorResult: faktoren,
      basis: grundwert(),
      assumptions: DEFAULT_ASSUMPTIONS,
      now: JETZT,
    });

    expect(ergebnis.basis).toBe('COMPARABLES');
    // 15.000 EUR + 10 % = 16.500 EUR, auf volle 50 EUR gerundet.
    expect(ergebnis.marketValueCents).toBe(1_650_000);
    expect(ergebnis.suggestedListingCents).toBeGreaterThan(ergebnis.marketValueCents ?? 0);
    expect(ergebnis.realisticRange?.lowCents).toBeLessThan(ergebnis.marketValueCents ?? 0);
    expect(ergebnis.realisticRange?.highCents).toBeGreaterThan(ergebnis.marketValueCents ?? 0);
  });

  it('zieht bei Angebotspreisen ab und sagt das auch', () => {
    const faktoren = assessFactors(entwurf(), DEFAULT_ASSUMPTIONS);
    const erzielt = buildValuation({
      factorResult: faktoren,
      basis: grundwert({ priceKind: 'ACHIEVED' }),
      assumptions: DEFAULT_ASSUMPTIONS,
      now: JETZT,
    });
    const angeboten = buildValuation({
      factorResult: faktoren,
      basis: grundwert({ priceKind: 'ASKING' }),
      assumptions: DEFAULT_ASSUMPTIONS,
      now: JETZT,
    });

    expect(angeboten.marketValueCents).toBeLessThan(erzielt.marketValueCents ?? 0);
    expect(angeboten.reasoning.join(' ')).toContain('Angebotspreise');
    expect(angeboten.source?.priceKind).toBe('ASKING');
  });

  it('nennt Stichprobe und Zeitraum in der Begruendung', () => {
    const ergebnis = buildValuation({
      factorResult: assessFactors(entwurf(), DEFAULT_ASSUMPTIONS),
      basis: grundwert({ sampleSize: 41, sourceLabel: 'Beispielquelle' }),
      assumptions: DEFAULT_ASSUMPTIONS,
      now: JETZT,
    });
    expect(ergebnis.reasoning[0]).toContain('41');
    expect(ergebnis.reasoning[0]).toContain('Beispielquelle');
    expect(ergebnis.source?.sampleSize).toBe(41);
  });

  it('rundet auf volle fuenfzig Euro, statt Genauigkeit vorzutaeuschen', () => {
    const ergebnis = buildValuation({
      factorResult: assessFactors(entwurf(), DEFAULT_ASSUMPTIONS),
      basis: grundwert({ medianCents: 1_234_567 }),
      assumptions: DEFAULT_ASSUMPTIONS,
      now: JETZT,
    });
    expect((ergebnis.marketValueCents ?? 0) % 5000).toBe(0);
    expect((ergebnis.suggestedListingCents ?? 0) % 5000).toBe(0);
  });
});

describe('Bewertung: Guete', () => {
  it('ist ohne Grundwert keine', () => {
    expect(assessConfidence(null, 0, JETZT)).toBe('NONE');
  });

  it('sinkt bei kleiner Stichprobe', () => {
    expect(assessConfidence(grundwert({ sampleSize: 5 }), 0, JETZT)).toBe('WEAK');
    expect(assessConfidence(grundwert({ sampleSize: 15 }), 0, JETZT)).toBe('LIMITED');
    expect(assessConfidence(grundwert({ sampleSize: 40 }), 0, JETZT)).toBe('GOOD');
  });

  it('sinkt bei alten Beobachtungen', () => {
    const alt = grundwert({
      observedFrom: new Date('2024-01-01T00:00:00Z'),
      observedTo: new Date('2024-06-01T00:00:00Z'),
    });
    expect(assessConfidence(alt, 0, JETZT)).toBe('WEAK');
  });

  it('sinkt bei vielen fehlenden Angaben', () => {
    expect(assessConfidence(grundwert(), 5, JETZT)).toBe('LIMITED');
  });
});
