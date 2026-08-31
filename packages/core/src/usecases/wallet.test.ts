import { beforeEach, describe, expect, it } from 'vitest';

import { Role } from '../auth/roles';
import { AppError, ErrorCode } from '../errors';
import { fixedClock } from '../ports/clock';
import { TokenCost, priceOf } from '../wallet/policy';

import { FakeWalletRepository, RecordingAuditLogger } from './fakes';
import { type WalletDeps, adminCredit, adminDebit, getOwnWallet, spendTokens } from './wallet';

const JETZT = new Date('2026-07-01T12:00:00.000Z');

const nutzer = { userId: 'u1', role: Role.USER, dealerId: null };
const admin = { userId: 'a1', role: Role.ADMIN, dealerId: null };

let wallets: FakeWalletRepository;
let audit: RecordingAuditLogger;
let deps: WalletDeps;

beforeEach(() => {
  wallets = new FakeWalletRepository();
  audit = new RecordingAuditLogger();
  deps = { wallets, audit, clock: fixedClock(JETZT) };
});

async function codeOf(action: () => Promise<unknown>): Promise<string> {
  try {
    await action();
    return 'kein Fehler';
  } catch (error) {
    return error instanceof AppError ? error.code : 'falscher Fehlertyp';
  }
}

describe('Guthaben ansehen', () => {
  it('legt beim ersten Aufruf ein Konto mit null an', async () => {
    const konto = await getOwnWallet(deps, nutzer);
    expect(konto.balanceTokens).toBe(0);
    expect(konto.availableTokens).toBe(0);
  });

  it('verlangt eine Anmeldung', async () => {
    expect(await codeOf(() => getOwnWallet(deps, null))).toBe(ErrorCode.UNAUTHENTICATED);
  });
});

describe('Reservieren, ausfuehren, buchen', () => {
  const preis = priceOf(TokenCost.AI_LISTING_TEXT);

  beforeEach(() => {
    wallets.seedBalance('u1', preis * 2);
  });

  it('bucht erst nach erfolgreicher Ausfuehrung ab', async () => {
    let zustandWaehrendDerAusfuehrung = { guthaben: -1, reserviert: -1 };

    const ergebnis = await spendTokens(
      deps,
      nutzer,
      { kind: TokenCost.AI_LISTING_TEXT, reference: 'vorgang-1' },
      async () => {
        // Waehrend der Ausfuehrung ist der Betrag reserviert, aber noch nicht
        // gebucht -- genau das ist der Sinn des Verfahrens.
        const zwischenstand = await wallets.findWallet('u1');
        zustandWaehrendDerAusfuehrung = {
          guthaben: zwischenstand?.balanceTokens ?? -1,
          reserviert: zwischenstand?.reservedTokens ?? -1,
        };
        return 'fertiger Text';
      },
    );

    expect(zustandWaehrendDerAusfuehrung).toEqual({ guthaben: preis * 2, reserviert: preis });
    expect(ergebnis.result).toBe('fertiger Text');
    expect(ergebnis.charged).toBe(preis);

    const nachher = await wallets.findWallet('u1');
    expect(nachher?.balanceTokens).toBe(preis);
    expect(nachher?.reservedTokens).toBe(0);
  });

  it('bucht nichts ab, wenn die Ausfuehrung scheitert', async () => {
    await expect(
      spendTokens(
        deps,
        nutzer,
        { kind: TokenCost.AI_LISTING_TEXT, reference: 'vorgang-fehler' },
        async () => {
          throw new Error('Der externe Dienst antwortet nicht.');
        },
      ),
    ).rejects.toThrow('Der externe Dienst antwortet nicht.');

    const nachher = await wallets.findWallet('u1');
    expect(nachher?.balanceTokens).toBe(preis * 2);
    expect(nachher?.reservedTokens).toBe(0);
  });

  it('reicht den Fehler der Ausfuehrung unveraendert weiter', async () => {
    // Der Aufrufer soll die Ursache sehen, nicht eine Guthabenmeldung.
    let gefangen: unknown = null;
    try {
      await spendTokens(
        deps,
        nutzer,
        { kind: TokenCost.AI_LISTING_TEXT, reference: 'vorgang-fehler-2' },
        async () => {
          throw new AppError(ErrorCode.SERVICE_UNAVAILABLE);
        },
      );
    } catch (error) {
      gefangen = error;
    }

    expect(gefangen).toBeInstanceOf(AppError);
    expect((gefangen as AppError).code).toBe(ErrorCode.SERVICE_UNAVAILABLE);
  });

  it('lehnt die Ausfuehrung bei zu wenig Guthaben ab, ohne sie zu starten', async () => {
    wallets.seedBalance('u1', preis - 1);
    let ausgefuehrt = false;

    const code = await codeOf(() =>
      spendTokens(
        deps,
        nutzer,
        { kind: TokenCost.AI_LISTING_TEXT, reference: 'zu-arm' },
        async () => {
          ausgefuehrt = true;
          return 'sollte nicht laufen';
        },
      ),
    );

    expect(code).toBe(ErrorCode.INSUFFICIENT_FUNDS);
    expect(ausgefuehrt).toBe(false);
  });

  it('nennt in der Meldung den benoetigten und den vorhandenen Betrag', async () => {
    wallets.seedBalance('u1', 2);
    let meldung = 'kein Fehler';
    try {
      await spendTokens(
        deps,
        nutzer,
        { kind: TokenCost.AI_LISTING_TEXT, reference: 'zu-arm-2' },
        async () => 'x',
      );
    } catch (error) {
      meldung = error instanceof AppError ? error.message : 'falscher Fehlertyp';
    }

    expect(meldung).toContain(String(preis));
    expect(meldung).toContain('2');
  });

  it('erkennt einen doppelten Aufruf desselben Vorgangs', async () => {
    /*
     * Zwei gleichzeitige Klicks duerfen nicht zweimal abbuchen. Der zweite
     * Aufruf mit derselben Kennung wird als laufender Vorgang erkannt.
     */
    let freigeben: (() => void) | undefined;
    const warten = new Promise<void>((resolve) => {
      freigeben = resolve;
    });

    const erster = spendTokens(
      deps,
      nutzer,
      { kind: TokenCost.AI_LISTING_TEXT, reference: 'doppelklick' },
      async () => {
        await warten;
        return 'erstes Ergebnis';
      },
    );

    const zweiterCode = await codeOf(() =>
      spendTokens(
        deps,
        nutzer,
        { kind: TokenCost.AI_LISTING_TEXT, reference: 'doppelklick' },
        async () => 'zweites Ergebnis',
      ),
    );

    expect(zweiterCode).toBe(ErrorCode.CONFLICT);

    freigeben?.();
    await erster;

    const nachher = await wallets.findWallet('u1');
    expect(nachher?.balanceTokens).toBe(preis);
  });

  it('protokolliert den Verbrauch', async () => {
    await spendTokens(
      deps,
      nutzer,
      { kind: TokenCost.AI_LISTING_TEXT, reference: 'protokoll' },
      async () => 'x',
    );
    expect(audit.actions()).toContain('wallet.debited');
  });

  it('verlangt eine Anmeldung', async () => {
    expect(
      await codeOf(() =>
        spendTokens(
          deps,
          null,
          { kind: TokenCost.AI_LISTING_TEXT, reference: 'anonym' },
          async () => 'x',
        ),
      ),
    ).toBe(ErrorCode.UNAUTHENTICATED);
  });
});

describe('Korrekturen durch die Administration', () => {
  it('laesst normale Benutzer nichts gutschreiben', async () => {
    expect(
      await codeOf(() =>
        adminCredit(deps, nutzer, {
          userId: 'u1',
          amountTokens: 100,
          reason: 'Weil ich es kann',
          reference: 'unerlaubt',
        }),
      ),
    ).toBe(ErrorCode.FORBIDDEN);
  });

  it('schreibt gut und protokolliert mit Grund', async () => {
    const buchung = await adminCredit(deps, admin, {
      userId: 'u1',
      amountTokens: 50,
      reason: 'Ausgleich fuer einen Ausfall',
      reference: 'gutschrift-1',
    });

    expect(buchung.balanceAfter).toBe(50);
    expect(audit.actions()).toContain('wallet.adjusted');
    expect(audit.events[0]?.metadata?.grund).toBe('Ausgleich fuer einen Ausfall');
  });

  it('lehnt Betraege ab, die keine positive ganze Zahl sind', async () => {
    for (const betrag of [0, -5, 1.5]) {
      expect(
        await codeOf(() =>
          adminCredit(deps, admin, {
            userId: 'u1',
            amountTokens: betrag,
            reason: 'Unsinn',
            reference: `unsinn-${betrag}`,
          }),
        ),
      ).toBe(ErrorCode.VALIDATION_FAILED);
    }
  });

  it('bucht denselben Vorgang nicht zweimal', async () => {
    await adminCredit(deps, admin, {
      userId: 'u1',
      amountTokens: 50,
      reason: 'Einmalig',
      reference: 'einmalig',
    });
    const nochmal = await adminCredit(deps, admin, {
      userId: 'u1',
      amountTokens: 50,
      reason: 'Einmalig',
      reference: 'einmalig',
    });

    expect(nochmal.balanceAfter).toBe(50);
    expect((await wallets.findWallet('u1'))?.balanceTokens).toBe(50);
  });

  it('lehnt eine Abbuchung ohne Deckung ab', async () => {
    wallets.seedBalance('u1', 10);
    expect(
      await codeOf(() =>
        adminDebit(deps, admin, {
          userId: 'u1',
          amountTokens: 50,
          reason: 'Zu viel',
          reference: 'zuviel',
        }),
      ),
    ).toBe(ErrorCode.INSUFFICIENT_FUNDS);
  });
});
