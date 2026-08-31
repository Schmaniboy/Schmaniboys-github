import { beforeEach, describe, expect, it } from 'vitest';

import { Role } from '../auth/roles';
import { DEFAULT_ASSUMPTIONS } from '../valuation/assumptions';
import { AppError, ErrorCode } from '../errors';
import { fixedClock } from '../ports/clock';
import type {
  ListingDraftRecord,
  ListingDraftRepository,
} from '../ports/listing-draft-repository';
import {
  UnavailableMarketData,
  type ComparableQuery,
  type MarketBasis,
  type MarketDataSource,
} from '../ports/market-data';
import type { CatalogForContext } from '../sales/field-guard';
import { priceOf, TokenCost } from '../wallet/policy';

import { FakeWalletRepository, RecordingAuditLogger } from './fakes';
import { valuateDraft, type ValuationDeps } from './valuation';

const JETZT = new Date('2026-07-01T12:00:00.000Z');
const verkaeufer = { userId: 'u1', role: Role.USER, dealerId: null };
const fremder = { userId: 'u2', role: Role.USER, dealerId: null };

const basisEntwurf: ListingDraftRecord = {
  id: 'draft-1',
  ownerId: 'u1',
  status: 'DETAILS_PROVIDED',
  updatedAt: new Date('2026-06-30T10:00:00.000Z'),
  catalogConfirmedAt: new Date('2026-06-30T09:00:00.000Z'),
  generationId: 'gen-1',
  powertrainId: 'pt-1',
  mileageKm: 120_000,
  firstRegistration: new Date('2016-03-01T00:00:00.000Z'),
  previousOwners: 2,
  huValidUntil: new Date('2027-05-31T00:00:00.000Z'),
  serviceHistory: 'FULL_MANUFACTURER',
  condition: 'GOOD',
  tyreCondition: null,
  damages: null,
  hadAccident: false,
  accidentDetails: null,
  additionalNotes: null,
  generatedTitle: null,
  generatedShortText: null,
  generatedLongText: null,
  generatedClassifiedText: null,
  generatedAt: null,
  generationModel: null,
  valuationJson: null,
  valuedAt: null,
  valuationAssumptionsId: null,
};

const katalog: CatalogForContext = {
  manufacturerName: 'Musterhersteller',
  modelName: 'Mustermodell',
  generationName: 'Erste Generation',
  generationCode: 'M1',
  bodyTypeName: 'Limousine',
  trimLineName: null,
  engineName: '2.0 Diesel',
  engineCode: 'DEMO20D',
  fuelTypeLabel: 'Diesel',
  transmissionLabel: 'Wandlerautomatik',
  driveTypeLabel: 'Heckantrieb',
  powerKw: 140,
  displacementCcm: 1995,
  buildPeriod: '2014–2021',
  equipmentNames: [],
};

class FakeDraftRepository implements ListingDraftRepository {
  entwurf: ListingDraftRecord | null = { ...basisEntwurf };
  katalogkontext: CatalogForContext | null = katalog;

  async findById(): Promise<ListingDraftRecord | null> {
    return this.entwurf;
  }
  async loadCatalogContext(): Promise<CatalogForContext | null> {
    return this.katalogkontext;
  }
  async saveGeneratedTexts(): Promise<void> {
    // Fuer die Bewertung ohne Bedeutung.
  }

  async saveValuation(
    _draftId: string,
    valuation: unknown,
    assumptionsId: string,
    valuedAt: Date,
  ): Promise<void> {
    // Wie in der echten Persistenz: Der Entwurf traegt die Bewertung danach.
    if (this.entwurf) {
      this.entwurf = {
        ...this.entwurf,
        valuationJson: valuation,
        valuationAssumptionsId: assumptionsId,
        valuedAt,
      };
    }
  }
}

/** Liefert einen Grundwert und merkt sich, wonach gefragt wurde. */
class FakeMarketData implements MarketDataSource {
  letzteAnfrage: ComparableQuery | null = null;
  grundwert: MarketBasis | null = {
    medianCents: 1_500_000,
    lowerQuartileCents: 1_350_000,
    upperQuartileCents: 1_700_000,
    sampleSize: 40,
    observedFrom: new Date('2026-05-01T00:00:00.000Z'),
    observedTo: new Date('2026-06-25T00:00:00.000Z'),
    sourceLabel: 'Testquelle',
    priceKind: 'ACHIEVED',
  };
  aufrufe = 0;

  isAvailable(): boolean {
    return true;
  }
  async findBasis(query: ComparableQuery): Promise<MarketBasis | null> {
    this.aufrufe += 1;
    this.letzteAnfrage = query;
    return this.grundwert;
  }
}

let drafts: FakeDraftRepository;
let wallets: FakeWalletRepository;
let audit: RecordingAuditLogger;
let market: FakeMarketData;
let deps: ValuationDeps;

const preis = priceOf(TokenCost.VALUATION);

beforeEach(() => {
  drafts = new FakeDraftRepository();
  wallets = new FakeWalletRepository();
  audit = new RecordingAuditLogger();
  market = new FakeMarketData();
  wallets.seedBalance('u1', preis * 3);
  deps = { drafts, wallets, audit, market, clock: fixedClock(JETZT) };
});

async function codeOf(action: () => Promise<unknown>): Promise<string> {
  try {
    await action();
    return 'kein Fehler';
  } catch (error) {
    return error instanceof AppError ? error.code : 'falscher Fehlertyp';
  }
}

describe('Fahrzeugbewertung', () => {
  it('bewertet und bucht den Preis ab', async () => {
    const ergebnis = await valuateDraft(deps, verkaeufer, 'draft-1');

    expect(ergebnis.charged).toBe(preis);
    expect(ergebnis.valuation.basis).toBe('COMPARABLES');
    expect(ergebnis.valuation.marketValueCents).toBeGreaterThan(0);
    expect((await wallets.findWallet('u1'))?.balanceTokens).toBe(preis * 2);
  });

  it('laesst fremde Entwuerfe nicht anfassen und meldet sie als nicht gefunden', async () => {
    expect(await codeOf(() => valuateDraft(deps, fremder, 'draft-1'))).toBe(ErrorCode.NOT_FOUND);
    expect(market.aufrufe).toBe(0);
  });

  it('verlangt eine Anmeldung', async () => {
    expect(await codeOf(() => valuateDraft(deps, null, 'draft-1'))).toBe(
      ErrorCode.UNAUTHENTICATED,
    );
  });

  it('bewertet nichts ohne bestaetigte Fahrzeugzuordnung', async () => {
    drafts.entwurf = { ...basisEntwurf, catalogConfirmedAt: null };
    expect(await codeOf(() => valuateDraft(deps, verkaeufer, 'draft-1'))).toBe(ErrorCode.CONFLICT);
    expect((await wallets.findWallet('u1'))?.balanceTokens).toBe(preis * 3);
  });

  it('bucht nichts ab, wenn keine Marktdatenquelle eingerichtet ist', async () => {
    /*
     * Der wichtigste Test dieser Datei. Ohne Quelle gibt es keinen Marktwert
     * -- aber auch keine Abbuchung und keine erfundene Zahl.
     */
    deps = { ...deps, market: new UnavailableMarketData() };
    const ergebnis = await valuateDraft(deps, verkaeufer, 'draft-1');

    expect(ergebnis.charged).toBe(0);
    expect((await wallets.findWallet('u1'))?.balanceTokens).toBe(preis * 3);
    expect(ergebnis.valuation.basis).toBe('NONE');
    expect(ergebnis.valuation.marketValueCents).toBeNull();
    expect(ergebnis.valuation.suggestedListingCents).toBeNull();
    expect(ergebnis.valuation.realisticRange).toBeNull();
    // Die Faktorenanalyse gibt es trotzdem -- sie kostet nichts und hilft.
    expect(ergebnis.valuation.factors.length).toBeGreaterThan(0);
    expect(ergebnis.valuation.reasoning.join(' ')).toContain('kein Guthaben verbraucht');
  });

  it('gibt die Reservierung frei, wenn die Stichprobe nicht reicht', async () => {
    market.grundwert = null;
    const ergebnis = await valuateDraft(deps, verkaeufer, 'draft-1');

    expect(ergebnis.valuation.basis).toBe('NONE');
    expect(ergebnis.valuation.marketValueCents).toBeNull();
    expect(ergebnis.valuation.reasoning.join(' ')).toContain('erfinden');
  });

  it('sucht Vergleichsangebote zur bestaetigten Baureihe, nicht zur VIN', async () => {
    await valuateDraft(deps, verkaeufer, 'draft-1');

    expect(market.letzteAnfrage?.generationId).toBe('gen-1');
    expect(market.letzteAnfrage?.powertrainId).toBe('pt-1');
    expect(market.letzteAnfrage?.manufacturerName).toBe('Musterhersteller');
    expect(market.letzteAnfrage?.firstRegistrationYear).toBe(2016);
    // Die VIN taucht in der Marktabfrage nirgends auf.
    expect(JSON.stringify(market.letzteAnfrage)).not.toContain('vin');
  });

  it('berechnet einen unveraenderten Entwurf nur einmal', async () => {
    const erste = await valuateDraft(deps, verkaeufer, 'draft-1');
    const zweite = await valuateDraft(deps, verkaeufer, 'draft-1');

    expect(erste.charged).toBe(preis);
    expect(zweite.charged).toBe(0);
    expect((await wallets.findWallet('u1'))?.balanceTokens).toBe(preis * 2);
  });

  it('berechnet nach einer Aenderung am Entwurf erneut', async () => {
    await valuateDraft(deps, verkaeufer, 'draft-1');
    drafts.entwurf = { ...basisEntwurf, updatedAt: new Date('2026-06-30T11:00:00.000Z') };
    const zweite = await valuateDraft(deps, verkaeufer, 'draft-1');

    expect(zweite.charged).toBe(preis);
    expect((await wallets.findWallet('u1'))?.balanceTokens).toBe(preis);
  });

  it('lehnt bei zu wenig Guthaben ab, ohne die Marktquelle zu fragen', async () => {
    wallets.seedBalance('u1', 0);
    expect(await codeOf(() => valuateDraft(deps, verkaeufer, 'draft-1'))).toBe(
      ErrorCode.INSUFFICIENT_FUNDS,
    );
    expect(market.aufrufe).toBe(0);
  });

  it('meldet eine unvollstaendige Katalogzuordnung als Konflikt', async () => {
    drafts.katalogkontext = null;
    expect(await codeOf(() => valuateDraft(deps, verkaeufer, 'draft-1'))).toBe(ErrorCode.CONFLICT);
    expect((await wallets.findWallet('u1'))?.balanceTokens).toBe(preis * 3);
  });

  it('traegt Annahmen und Hinweis in jedem Fall mit', async () => {
    const mit = await valuateDraft(deps, verkaeufer, 'draft-1');
    deps = { ...deps, market: new UnavailableMarketData() };
    drafts.entwurf = { ...basisEntwurf, updatedAt: new Date('2026-06-30T11:00:00.000Z') };
    const ohne = await valuateDraft(deps, verkaeufer, 'draft-1');

    for (const ergebnis of [mit.valuation, ohne.valuation]) {
      expect(ergebnis.disclaimer).toContain('Schätzung');
      expect(ergebnis.assumptionNotes.join(' ')).toContain('keine gemessenen Marktwerte');
      expect(ergebnis.assumptionsId).not.toBe('');
    }
  });

  it('gibt die gespeicherte Bewertung mit echten Datumsangaben zurueck', async () => {
    /*
     * Der Rueckweg fuehrt durch JSON, und JSON kennt kein Datum. Ohne
     * Aufbereitung kaeme hier eine Zeichenkette zurueck, wo der Typ ein Date
     * verspricht -- der Fehler faellt sonst erst beim Formatieren auf.
     */
    await valuateDraft(deps, verkaeufer, 'draft-1');
    // Wie aus der Datenbank: durch JSON und zurueck.
    if (drafts.entwurf) {
      drafts.entwurf = {
        ...drafts.entwurf,
        valuationJson: JSON.parse(JSON.stringify(drafts.entwurf.valuationJson)) as unknown,
      };
    }

    const zweite = await valuateDraft(deps, verkaeufer, 'draft-1');
    expect(zweite.charged).toBe(0);
    expect(zweite.valuation.source?.observedTo).toBeInstanceOf(Date);
    expect(zweite.valuation.source?.observedTo.getFullYear()).toBe(2026);
    expect(market.aufrufe).toBe(1);
  });

  it('rechnet neu, wenn sich die Annahmen geaendert haben', async () => {
    await valuateDraft(deps, verkaeufer, 'draft-1');
    // Eine gespeicherte Bewertung neben einer Annahmenliste zu zeigen, mit der
    // sie nicht zustande kam, waere irrefuehrend.
    deps = {
      ...deps,
      assumptions: { ...DEFAULT_ASSUMPTIONS, id: 'plattform-annahmen-v2' },
    };
    const zweite = await valuateDraft(deps, verkaeufer, 'draft-1');
    expect(zweite.charged).toBe(preis);
    expect(zweite.valuation.assumptionsId).toBe('plattform-annahmen-v2');
  });

  it('protokolliert die Bewertung', async () => {
    await valuateDraft(deps, verkaeufer, 'draft-1');
    expect(audit.events.length).toBeGreaterThan(0);
  });
});
