import { describe, expect, it } from 'vitest';

import {
  TOKEN_FEHLERTEXTE,
  TOKEN_GUELTIGKEIT_MINUTEN,
  ZURUECKSETZEN_ANTWORT,
  ablaufZeitpunkt,
  assertTokenGueltig,
  bestaetigungsMail,
  pruefeToken,
  zuruecksetzMail,
} from './one-time-tokens';
import { AppError } from '../errors';

const JETZT = new Date('2026-08-23T12:00:00Z');

function token(teil: Partial<Parameters<typeof pruefeToken>[0]> = {}) {
  return {
    purpose: 'PASSWORD_RESET' as const,
    expiresAt: new Date(JETZT.getTime() + 60_000),
    usedAt: null,
    ...teil,
  };
}

describe('Gueltigkeit', () => {
  it('nimmt einen frischen Token an', () => {
    expect(pruefeToken(token(), 'PASSWORD_RESET', JETZT)).toEqual({ gueltig: true });
  });

  it('lehnt einen abgelaufenen ab', () => {
    const abgelaufen = token({ expiresAt: new Date(JETZT.getTime() - 1) });
    expect(pruefeToken(abgelaufen, 'PASSWORD_RESET', JETZT)).toEqual({
      gueltig: false,
      grund: 'ABGELAUFEN',
    });
  });

  it('lehnt einen genau am Ablaufzeitpunkt ab', () => {
    // Die Grenze gehoert nicht mehr dazu -- sonst gilt ein Token eine
    // Millisekunde laenger als zugesagt.
    const genau = token({ expiresAt: JETZT });
    expect(pruefeToken(genau, 'PASSWORD_RESET', JETZT).gueltig).toBe(false);
  });

  it('lehnt einen bereits verwendeten ab', () => {
    const verbraucht = token({ usedAt: new Date(JETZT.getTime() - 1000) });
    expect(pruefeToken(verbraucht, 'PASSWORD_RESET', JETZT)).toEqual({
      gueltig: false,
      grund: 'VERBRAUCHT',
    });
  });

  it('laesst einen Bestaetigungstoken nicht als Zuruecksetztoken durchgehen', () => {
    /*
     * Sonst liesse sich mit einem Bestaetigungslink -- den ein Angreifer bei
     * einer selbst angelegten Adresse bekommt -- ein Passwort setzen.
     */
    const falsch = token({ purpose: 'EMAIL_VERIFICATION' });
    expect(pruefeToken(falsch, 'PASSWORD_RESET', JETZT)).toEqual({
      gueltig: false,
      grund: 'FALSCHER_ZWECK',
    });
  });

  it('behandelt einen unbekannten Token wie einen ungueltigen', () => {
    try {
      assertTokenGueltig(null, 'PASSWORD_RESET', JETZT);
      throw new Error('haette werfen muessen');
    } catch (fehler) {
      expect(fehler).toBeInstanceOf(AppError);
      expect(JSON.stringify(fehler)).toContain('ungültig');
    }
  });

  it('unterscheidet abgelaufen und verbraucht in der Meldung', () => {
    // Der Unterschied ist unbedenklich -- wer den Token hat, hat die E-Mail
    // bekommen -- und fuer den Menschen davor wichtig.
    expect(TOKEN_FEHLERTEXTE.ABGELAUFEN).not.toBe(TOKEN_FEHLERTEXTE.VERBRAUCHT);
    expect(TOKEN_FEHLERTEXTE.VERBRAUCHT).toContain('bereits verwendet');
  });
});

describe('Gueltigkeitsdauer', () => {
  it('laesst Zuruecksetzlinks deutlich kuerzer gelten als Bestaetigungen', () => {
    /*
     * Begruendung ist der Schaden im Missbrauchsfall: Ein abgefangener
     * Zuruecksetzlink uebernimmt das Konto; ein abgefangener
     * Bestaetigungslink bestaetigt eine Adresse, die dem Angreifer ohnehin
     * gehoert.
     */
    expect(TOKEN_GUELTIGKEIT_MINUTEN.PASSWORD_RESET).toBeLessThan(
      TOKEN_GUELTIGKEIT_MINUTEN.EMAIL_VERIFICATION,
    );
    expect(TOKEN_GUELTIGKEIT_MINUTEN.PASSWORD_RESET).toBeLessThanOrEqual(120);
  });

  it('rechnet den Ablauf aus der Dauer', () => {
    const ablauf = ablaufZeitpunkt('PASSWORD_RESET', JETZT);
    expect(ablauf.getTime() - JETZT.getTime()).toBe(
      TOKEN_GUELTIGKEIT_MINUTEN.PASSWORD_RESET * 60_000,
    );
  });
});

describe('Auskunftsfreiheit', () => {
  it('verraet in der Antwort nicht, ob es das Konto gibt', () => {
    /*
     * Der ganze Zweck: Wer "Passwort vergessen" mit einer fremden Adresse
     * absendet, darf daraus nicht schliessen koennen, ob dort ein Konto ist.
     */
    expect(ZURUECKSETZEN_ANTWORT).toContain('Wenn zu dieser Adresse ein Konto besteht');
    expect(ZURUECKSETZEN_ANTWORT).not.toMatch(/unbekannt|existiert nicht|kein Konto gefunden/i);
  });
});

describe('Nachrichtentexte', () => {
  it('nennt in der Bestaetigungsmail die zugesagte Dauer', () => {
    const mail = bestaetigungsMail('https://example.test/x', 'Max Muster');
    const tage = TOKEN_GUELTIGKEIT_MINUTEN.EMAIL_VERIFICATION / (60 * 24);
    expect(mail.text).toContain(`${tage} Tage`);
    expect(mail.text).toContain('https://example.test/x');
    expect(mail.text).toContain('Max Muster');
  });

  it('sagt in der Zuruecksetzmail, dass ohne Klick nichts geschieht', () => {
    // Wichtig fuer Menschen, die eine solche Mail unerwartet bekommen.
    const mail = zuruecksetzMail('https://example.test/y', 'Max Muster');
    expect(mail.text).toContain('bleibt dann unverändert');
    expect(mail.text).toContain(`${TOKEN_GUELTIGKEIT_MINUTEN.PASSWORD_RESET} Minuten`);
    expect(mail.text).toContain('nur einmal');
  });
});
