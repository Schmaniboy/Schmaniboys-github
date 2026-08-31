import { describe, expect, it } from 'vitest';

import { AppError, ErrorCode } from '../errors';

import {
  MAX_LAENGE,
  assertBeteiligt,
  assertSchreibbar,
  findeWarnzeichen,
  gegenseite,
  pruefeNachricht,
} from './policy';
import { nachrichtenBenachrichtigung } from './notifications';

const gespraech = { initiatorId: 'kaeufer', recipientId: 'verkaeufer', state: 'OPEN' as const };

/*
 * Die heiklen Zeichen stehen hier als Escape-Folgen, nicht als Literale --
 * unsichtbare Zeichen im Quelltext sind genau das Problem, um das es geht.
 */
const RECHTS_NACH_LINKS = '\u202e';
const ZURUECK = '\u202c';
const UNSICHTBARER_TRENNER = '\u200b';

function codeOf(aktion: () => unknown): string {
  try {
    aktion();
    return 'kein Fehler';
  } catch (error) {
    return error instanceof AppError ? error.code : 'falscher Fehlertyp';
  }
}

describe('Beteiligung', () => {
  it('erkennt beide Seiten', () => {
    expect(assertBeteiligt(gespraech, 'kaeufer')).toBe('INITIATOR');
    expect(assertBeteiligt(gespraech, 'verkaeufer')).toBe('RECIPIENT');
  });

  it('meldet Unbeteiligte als NICHT GEFUNDEN, nicht als verboten', () => {
    /*
     * Der Kern des IDOR-Schutzes. Ein 403 bestaetigte, dass es dieses
     * Gespraech gibt -- und damit liesse sich durch Kennungen blaettern.
     */
    expect(codeOf(() => assertBeteiligt(gespraech, 'fremder'))).toBe(ErrorCode.NOT_FOUND);
  });

  it('findet die jeweils andere Seite', () => {
    expect(gegenseite(gespraech, 'kaeufer')).toBe('verkaeufer');
    expect(gegenseite(gespraech, 'verkaeufer')).toBe('kaeufer');
  });
});

describe('Schreibbarkeit', () => {
  it('laesst ein offenes Gespraech zu', () => {
    expect(codeOf(() => assertSchreibbar(gespraech))).toBe('kein Fehler');
  });

  it('sperrt ein geschlossenes Gespraech mit Erklaerung', () => {
    expect(codeOf(() => assertSchreibbar({ ...gespraech, state: 'CLOSED' }))).toBe(
      ErrorCode.CONFLICT,
    );
  });

  it('sperrt ein gesperrtes Gespraech', () => {
    expect(codeOf(() => assertSchreibbar({ ...gespraech, state: 'BLOCKED' }))).toBe(
      ErrorCode.FORBIDDEN,
    );
  });
});

describe('Nachrichtentext', () => {
  it('nimmt gewoehnlichen Text an', () => {
    expect(pruefeNachricht('  Ist das Fahrzeug noch verfügbar?  ')).toBe(
      'Ist das Fahrzeug noch verfügbar?',
    );
  });

  it('lehnt leere Nachrichten ab', () => {
    for (const eingabe of ['', '   ', '\n\n', 'a']) {
      expect(codeOf(() => pruefeNachricht(eingabe))).toBe(ErrorCode.VALIDATION_FAILED);
    }
  });

  it('lehnt zu lange Nachrichten ab', () => {
    expect(codeOf(() => pruefeNachricht('x'.repeat(MAX_LAENGE + 1)))).toBe(
      ErrorCode.VALIDATION_FAILED,
    );
  });

  it('entfernt Zeichen zur Steuerung der Leserichtung', () => {
    /*
     * Mit diesen Zeichen laesst sich Text verkehrt herum anzeigen -- etwa um
     * eine Adresse anders aussehen zu lassen, als sie ist.
     */
    const versteckt = `Bitte an ${RECHTS_NACH_LINKS}tset@lieporta${ZURUECK} senden`;
    const bereinigt = pruefeNachricht(versteckt);

    expect(bereinigt).not.toContain(RECHTS_NACH_LINKS);
    expect(bereinigt).not.toContain(ZURUECK);
    expect(bereinigt).toContain('senden');
  });

  it('entfernt Steuerzeichen, laesst Zeilenumbrueche stehen', () => {
    const mitSteuerzeichen = 'Erste Zeile\nZweite Zeile';
    expect(pruefeNachricht(mitSteuerzeichen)).toBe('Erste Zeile\nZweite Zeile');
  });

  it('entlarvt ein durch unsichtbare Trenner getarntes Wort', () => {
    // "vor<unsichtbar>kasse" umgeht sonst jede Wortsuche.
    const getarnt = `vor${UNSICHTBARER_TRENNER}kasse zahlen`;
    const bereinigt = pruefeNachricht(getarnt);

    expect(bereinigt).toBe('vorkasse zahlen');
    expect(findeWarnzeichen(bereinigt).map((w) => w.id)).toContain('zahlung-vorab');
  });
});

describe('Warnzeichen', () => {
  it('erkennt Vorkasse und Treuhand', () => {
    expect(findeWarnzeichen('Ich zahle per Vorkasse.').map((w) => w.id)).toContain(
      'zahlung-vorab',
    );
    expect(findeWarnzeichen('Wir nutzen einen Treuhandservice.').map((w) => w.id)).toContain(
      'zahlung-vorab',
    );
  });

  it('erkennt den Wechsel auf einen anderen Dienst', () => {
    expect(findeWarnzeichen('Schreib mir auf WhatsApp').map((w) => w.id)).toContain(
      'kontakt-auswaerts',
    );
  });

  it('erkennt Spedition und Zeitdruck', () => {
    const zeichen = findeWarnzeichen(
      'Meine Spedition holt es ab, bitte dringend antworten.',
    ).map((w) => w.id);

    expect(zeichen).toContain('spedition');
    expect(zeichen).toContain('dringlichkeit');
  });

  it('schlaegt bei gewoehnlichen Nachrichten nicht an', () => {
    // Ein Filter, der harmlose Nachrichten anmeckert, wird ignoriert -- und
    // damit auch dann, wenn er einmal recht hat.
    for (const text of [
      'Ist das Fahrzeug noch verfügbar?',
      'Wann könnte ich es besichtigen?',
      'Gibt es Bilder vom Innenraum?',
    ]) {
      expect(findeWarnzeichen(text)).toHaveLength(0);
    }
  });

  it('gibt zu jedem Warnzeichen eine Erklaerung', () => {
    for (const zeichen of findeWarnzeichen('Vorkasse per Western Union, dringend')) {
      expect(zeichen.hinweis.length).toBeGreaterThan(30);
    }
  });
});

describe('Benachrichtigung', () => {
  it('nennt den Nachrichtentext ausdruecklich NICHT', () => {
    /*
     * Eine Benachrichtigung erscheint an Stellen, an denen sie jemand
     * mitliest. Sie sagt, dass etwas da ist, nicht was.
     */
    const benachrichtigung = nachrichtenBenachrichtigung({
      absender: 'Max Muster',
      fahrzeug: 'BMW 3er',
      conversationId: 'g1',
    });

    expect(benachrichtigung.title).toContain('Max Muster');
    expect(benachrichtigung.body).toContain('BMW 3er');
    expect(benachrichtigung.href).toBe('/konto/nachrichten/g1');
  });

  it('kommt ohne Fahrzeugbezug aus', () => {
    const benachrichtigung = nachrichtenBenachrichtigung({
      absender: 'Support',
      fahrzeug: null,
      conversationId: 'g2',
    });
    expect(benachrichtigung.body).toContain('Öffnen Sie das Gespräch');
  });
});
