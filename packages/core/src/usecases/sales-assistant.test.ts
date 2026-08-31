import { beforeEach, describe, expect, it } from 'vitest';

import { Role } from '../auth/roles';
import { AppError, ErrorCode } from '../errors';
import { fixedClock } from '../ports/clock';
import type {
  ListingDraftRecord,
  ListingDraftRepository,
} from '../ports/listing-draft-repository';
import {
  StubTextGenerator,
  UnavailableTextGenerator,
  type GeneratedListing,
  type TextGenerator,
} from '../ports/text-generator';
import type { CatalogForContext } from '../sales/field-guard';
import { priceOf, TokenCost } from '../wallet/policy';

import { FakeWalletRepository, RecordingAuditLogger } from './fakes';
import { generateListingTexts, type SalesAssistantDeps } from './sales-assistant';

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
  manufacturerName: 'Musterfahrzeug',
  modelName: 'Muster 300',
  generationName: 'Zweite Generation',
  generationCode: 'MB2',
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
  gespeichert: { title: string; model: string } | null = null;

  async findById(): Promise<ListingDraftRecord | null> {
    return this.entwurf;
  }

  async loadCatalogContext(): Promise<CatalogForContext | null> {
    return this.katalogkontext;
  }

  async saveValuation(): Promise<void> {
    // Fuer den Verkaufsassistenten ohne Bedeutung.
  }

  async saveGeneratedTexts(
    _draftId: string,
    texts: {
      title: string;
      shortText: string;
      longText: string;
      classifiedText: string;
      model: string;
    },
    generatedAt: Date,
  ): Promise<void> {
    this.gespeichert = { title: texts.title, model: texts.model };
    // Wie in der echten Persistenz: Der Entwurf traegt die Texte danach.
    if (this.entwurf) {
      this.entwurf = {
        ...this.entwurf,
        generatedTitle: texts.title,
        generatedShortText: texts.shortText,
        generatedLongText: texts.longText,
        generatedClassifiedText: texts.classifiedText,
        generationModel: texts.model,
        generatedAt,
      };
    }
  }
}

/** Erzeugt absichtlich unbrauchbare Texte. */
class SchlechterGenerator implements TextGenerator {
  isAvailable(): boolean {
    return true;
  }
  async generateListing(): Promise<GeneratedListing> {
    return { title: '', shortText: '', longText: '', classifiedText: '', model: 'kaputt' };
  }
}

let drafts: FakeDraftRepository;
let wallets: FakeWalletRepository;
let audit: RecordingAuditLogger;
let generator: StubTextGenerator;
let deps: SalesAssistantDeps;

const preis = priceOf(TokenCost.AI_LISTING_TEXT);

beforeEach(() => {
  drafts = new FakeDraftRepository();
  wallets = new FakeWalletRepository();
  audit = new RecordingAuditLogger();
  generator = new StubTextGenerator();
  wallets.seedBalance('u1', preis * 3);
  deps = { drafts, wallets, audit, generator, clock: fixedClock(JETZT) };
});

async function codeOf(action: () => Promise<unknown>): Promise<string> {
  try {
    await action();
    return 'kein Fehler';
  } catch (error) {
    return error instanceof AppError ? error.code : 'falscher Fehlertyp';
  }
}

describe('Verkaufsassistent', () => {
  it('erzeugt Texte und bucht den Preis ab', async () => {
    const ergebnis = await generateListingTexts(deps, verkaeufer, 'draft-1');

    expect(ergebnis.charged).toBe(preis);
    expect(ergebnis.texts.longText).toContain('Ich biete hier meinen');
    expect(drafts.gespeichert?.model).toBe('stub');
    expect((await wallets.findWallet('u1'))?.balanceTokens).toBe(preis * 2);
  });

  it('gibt der KI niemals die VIN oder die Kennung des Entwurfs', async () => {
    await generateListingTexts(deps, verkaeufer, 'draft-1');
    const uebergeben = JSON.stringify(generator.aufrufe[0]);

    expect(uebergeben).not.toContain('draft-1');
    expect(uebergeben).not.toContain('u1');
    expect(uebergeben).not.toContain('DEMO20D');
  });

  it('laesst fremde Entwuerfe nicht anfassen und meldet sie als nicht gefunden', async () => {
    expect(await codeOf(() => generateListingTexts(deps, fremder, 'draft-1'))).toBe(
      ErrorCode.NOT_FOUND,
    );
  });

  it('verlangt eine Anmeldung', async () => {
    expect(await codeOf(() => generateListingTexts(deps, null, 'draft-1'))).toBe(
      ErrorCode.UNAUTHENTICATED,
    );
  });

  it('erzeugt nichts ohne bestaetigte Fahrzeugzuordnung', async () => {
    /*
     * Der Kern von Blocker B7: Aus der VIN allein ist das Fahrzeug nicht
     * bestimmbar. Ohne Bestaetigung schriebe die KI ueber ein geratenes Auto.
     */
    drafts.entwurf = { ...basisEntwurf, catalogConfirmedAt: null };
    expect(await codeOf(() => generateListingTexts(deps, verkaeufer, 'draft-1'))).toBe(
      ErrorCode.CONFLICT,
    );
    expect((await wallets.findWallet('u1'))?.balanceTokens).toBe(preis * 3);
  });

  it('prueft die Verfuegbarkeit vor der Guthabenreservierung', async () => {
    /*
     * Sonst wuerde Guthaben blockiert, der Aufruf schluege fehl, und die
     * Freigabe muesste es wieder geraderuecken -- sichtbar und unnoetig.
     */
    deps = { ...deps, generator: new UnavailableTextGenerator() };
    expect(await codeOf(() => generateListingTexts(deps, verkaeufer, 'draft-1'))).toBe(
      ErrorCode.NOT_IMPLEMENTED,
    );

    const konto = await wallets.findWallet('u1');
    expect(konto?.balanceTokens).toBe(preis * 3);
    expect(konto?.reservedTokens).toBe(0);
  });

  it('bucht nichts ab, wenn die erzeugten Texte unbrauchbar sind', async () => {
    deps = { ...deps, generator: new SchlechterGenerator() };
    await codeOf(() => generateListingTexts(deps, verkaeufer, 'draft-1'));

    const konto = await wallets.findWallet('u1');
    expect(konto?.balanceTokens).toBe(preis * 3);
    expect(konto?.reservedTokens).toBe(0);
    expect(drafts.gespeichert).toBeNull();
  });

  it('lehnt bei zu wenig Guthaben ab, ohne die KI aufzurufen', async () => {
    wallets.seedBalance('u1', preis - 1);
    expect(await codeOf(() => generateListingTexts(deps, verkaeufer, 'draft-1'))).toBe(
      ErrorCode.INSUFFICIENT_FUNDS,
    );
    expect(generator.aufrufe.length).toBe(0);
  });

  it('berechnet einen unveraenderten Entwurf nur einmal', async () => {
    /*
     * Zweimal auf denselben Knopf zu druecken kostet einmal -- und gibt beim
     * zweiten Mal den vorhandenen Text zurueck, nicht eine Fehlermeldung.
     * Zuerst meldete der zweite Aufruf "zu wenig Guthaben", obwohl reichlich
     * vorhanden war.
     */
    const erstes = await generateListingTexts(deps, verkaeufer, 'draft-1');
    const nachErstem = (await wallets.findWallet('u1'))?.balanceTokens;

    const zweites = await generateListingTexts(deps, verkaeufer, 'draft-1');

    expect(zweites.charged).toBe(0);
    expect(zweites.texts.longText).toBe(erstes.texts.longText);
    expect((await wallets.findWallet('u1'))?.balanceTokens).toBe(nachErstem);
    // Und die KI wurde kein zweites Mal aufgerufen.
    expect(generator.aufrufe.length).toBe(1);
  });

  it('berechnet nach einer Aenderung am Entwurf erneut', async () => {
    await generateListingTexts(deps, verkaeufer, 'draft-1');
    drafts.entwurf = {
      ...(drafts.entwurf as ListingDraftRecord),
      mileageKm: 125_000,
      updatedAt: new Date('2026-07-01T13:00:00.000Z'),
    };

    await generateListingTexts(deps, verkaeufer, 'draft-1');
    expect((await wallets.findWallet('u1'))?.balanceTokens).toBe(preis);
  });

  it('meldet eine unvollstaendige Katalogzuordnung als Konflikt', async () => {
    drafts.katalogkontext = null;
    expect(await codeOf(() => generateListingTexts(deps, verkaeufer, 'draft-1'))).toBe(
      ErrorCode.CONFLICT,
    );
  });

  it('gibt fehlende Angaben an die KI weiter, statt sie zu verschweigen', async () => {
    drafts.entwurf = { ...basisEntwurf, mileageKm: null };
    await generateListingTexts(deps, verkaeufer, 'draft-1');
    expect(generator.aufrufe[0]?.missingFields).toContain('Kilometerstand');
  });

  it('protokolliert den KI-Aufruf', async () => {
    await generateListingTexts(deps, verkaeufer, 'draft-1');
    expect(audit.actions()).toContain('ai.invoked');
  });
});
