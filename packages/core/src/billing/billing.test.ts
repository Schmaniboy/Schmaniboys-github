import { describe, expect, it } from 'vitest';

import { AppError, ErrorCode } from '../errors';
import { UnavailablePaymentProvider } from '../ports/payment-provider';

import { berechneRechnung, formatiereCent, formatiereSteuersatz, rundeCent } from './invoice';
import { baueRechnungsnummer, leseRechnungsnummer } from './numbering';

function codeOf(aktion: () => unknown): string {
  try {
    aktion();
    return 'kein Fehler';
  } catch (error) {
    return error instanceof AppError ? error.code : 'falscher Fehlertyp';
  }
}

describe('Rechnungsberechnung', () => {
  const steuer = { rateBasisPoints: 1900, note: null };

  it('rechnet Netto, Steuer und Brutto in ganzen Cent', () => {
    const rechnung = berechneRechnung(
      [{ description: '100 Tokens', quantity: 1, unitNetCents: 1000 }],
      steuer,
    );
    expect(rechnung.totals.netCents).toBe(1000);
    expect(rechnung.totals.taxCents).toBe(190);
    expect(rechnung.totals.grossCents).toBe(1190);
    expect(Number.isInteger(rechnung.totals.taxCents)).toBe(true);
  });

  it('rechnet die Steuer auf die Summe, nicht je Position', () => {
    /*
     * Je Position gerundet ergaebe 2 x round(3,33 * 0,19) = 2 x 1 = 2 Cent.
     * Auf die Summe gerechnet: round(666 * 0,19) = 127 Cent. Beides ist
     * vertretbar -- aber wer beides mischt, bekommt Rechnungen, deren Summe
     * nicht aufgeht.
     */
    const rechnung = berechneRechnung(
      [
        { description: 'A', quantity: 1, unitNetCents: 333 },
        { description: 'B', quantity: 1, unitNetCents: 333 },
      ],
      steuer,
    );
    expect(rechnung.totals.netCents).toBe(666);
    expect(rechnung.totals.taxCents).toBe(127);
    expect(rechnung.totals.grossCents).toBe(793);
  });

  it('multipliziert die Menge', () => {
    const rechnung = berechneRechnung(
      [{ description: 'Tokenpaket', quantity: 3, unitNetCents: 2500 }],
      steuer,
    );
    expect(rechnung.lines[0]?.lineNetCents).toBe(7500);
    expect(rechnung.totals.netCents).toBe(7500);
  });

  it('kommt mit einem Steuersatz von null zurecht', () => {
    // Etwa bei Steuerschuldnerschaft des Leistungsempfaengers -- dann steht
    // der Grund als Hinweis auf der Rechnung.
    const rechnung = berechneRechnung([{ description: 'A', quantity: 1, unitNetCents: 5000 }], {
      rateBasisPoints: 0,
      note: 'Steuerschuldnerschaft des Leistungsempfängers.',
    });
    expect(rechnung.totals.taxCents).toBe(0);
    expect(rechnung.totals.grossCents).toBe(5000);
    expect(rechnung.taxNote).toContain('Leistungsempfängers');
  });

  it('lehnt eine Rechnung ohne Positionen ab', () => {
    expect(codeOf(() => berechneRechnung([], steuer))).toBe(ErrorCode.VALIDATION_FAILED);
  });

  it('lehnt gebrochene Cent und negative Betraege ab', () => {
    expect(
      codeOf(() =>
        berechneRechnung([{ description: 'A', quantity: 1, unitNetCents: 10.5 }], steuer),
      ),
    ).toBe(ErrorCode.VALIDATION_FAILED);
    expect(
      codeOf(() =>
        berechneRechnung([{ description: 'A', quantity: 1, unitNetCents: -100 }], steuer),
      ),
    ).toBe(ErrorCode.VALIDATION_FAILED);
  });

  it('lehnt einen unmoeglichen Steuersatz ab', () => {
    expect(
      codeOf(() =>
        berechneRechnung([{ description: 'A', quantity: 1, unitNetCents: 100 }], {
          rateBasisPoints: 20_000,
          note: null,
        }),
      ),
    ).toBe(ErrorCode.VALIDATION_FAILED);
  });

  it('rundet vom Nullpunkt weg', () => {
    // Math.round(-0.5) ist -0, nicht -1. Fuer Betraege ist das falsch.
    expect(rundeCent(0.5)).toBe(1);
    expect(rundeCent(-0.5)).toBe(-1);
    expect(rundeCent(1.4)).toBe(1);
  });

  it('formatiert Betraege und Saetze deutsch', () => {
    expect(formatiereCent(1190)).toContain('11,90');
    expect(formatiereSteuersatz(1900)).toBe('19 %');
    expect(formatiereSteuersatz(700)).toBe('7 %');
  });
});

describe('Rechnungsnummern', () => {
  it('baut eine fortlaufende Nummer je Jahr', () => {
    expect(baueRechnungsnummer(2026, 1)).toBe('AP-2026-00001');
    expect(baueRechnungsnummer(2026, 42)).toBe('AP-2026-00042');
  });

  it('laesst sich wieder zerlegen', () => {
    expect(leseRechnungsnummer('AP-2026-00042')).toEqual({ jahr: 2026, laufend: 42 });
    expect(leseRechnungsnummer('irgendwas')).toBeNull();
    expect(leseRechnungsnummer('AP-2026-42')).toBeNull();
  });

  it('beginnt bei eins, nicht bei null', () => {
    expect(codeOf(() => baueRechnungsnummer(2026, 0))).toBe(ErrorCode.VALIDATION_FAILED);
  });

  it('meldet einen Ueberlauf, statt still abzuschneiden', () => {
    // Eine sechsstellige Nummer in ein fuenfstelliges Feld zu pressen ergaebe
    // eine doppelte Rechnungsnummer.
    expect(codeOf(() => baueRechnungsnummer(2026, 100_000))).toBe(ErrorCode.CONFLICT);
  });
});

describe('Zahlungsanbieter', () => {
  it('meldet sich als nicht verfuegbar, statt ins Leere zu laufen', async () => {
    const anbieter = new UnavailablePaymentProvider();
    expect(anbieter.isAvailable()).toBe(false);
    expect(anbieter.reason).toContain('kein Zahlungsweg');
    // Vorhandenes Guthaben bleibt ausdruecklich nutzbar.
    expect(anbieter.reason).toContain('unverändert');

    await expect(anbieter.createCheckout()).rejects.toThrow();
    await expect(anbieter.getPaymentStatus()).rejects.toThrow();
  });
});
