import { errors } from '../errors';

/**
 * Regeln fuer Nachrichten.
 *
 * Der Grundgedanke: Ein Marktplatz ist fuer Betrueger interessant, und der
 * Posteingang ist ihr Werkzeug. Die Regeln hier sind deshalb keine
 * Bequemlichkeiten, sondern Schutz -- und sie stehen in der Domaenenschicht,
 * damit sie nicht an einer Route haengen, die jemand vergisst.
 */

export const MIN_LAENGE = 2;
export const MAX_LAENGE = 5000;

/** Wie viele Gespraeche eine Person je Stunde neu beginnen darf. */
export const MAX_NEUE_GESPRAECHE_JE_STUNDE = 10;
/** Wie viele Nachrichten insgesamt je Stunde. */
export const MAX_NACHRICHTEN_JE_STUNDE = 60;

/**
 * Bilder je Nachricht.
 *
 * Anhaenge sind ausschliesslich Bilder und werden wie Anzeigenbilder neu
 * kodiert (ADR-008). Beliebige Dateien in einem Posteingang waeren ein
 * Verteilweg fuer Schadsoftware; ein Bild, das dekodiert und neu geschrieben
 * wird, traegt nichts mehr mit sich.
 */
export const MAX_ANHAENGE_JE_NACHRICHT = 5;

export type ConversationState = 'OPEN' | 'CLOSED' | 'BLOCKED';

export interface ConversationForCheck {
  initiatorId: string;
  recipientId: string;
  state: ConversationState;
}

/**
 * Darf diese Person dieses Gespraech ueberhaupt sehen?
 *
 * Der Schutz gegen IDOR steht hier und nicht in der Abfrage: Wer nicht
 * beteiligt ist, bekommt "nicht gefunden" -- nicht "verboten". Ein Verbot
 * bestaetigte, dass es das Gespraech gibt.
 */
export function assertBeteiligt(
  gespraech: ConversationForCheck,
  userId: string,
): 'INITIATOR' | 'RECIPIENT' {
  if (gespraech.initiatorId === userId) return 'INITIATOR';
  if (gespraech.recipientId === userId) return 'RECIPIENT';
  throw errors.notFound();
}

/** Die jeweils andere Seite. */
export function gegenseite(gespraech: ConversationForCheck, userId: string): string {
  return gespraech.initiatorId === userId ? gespraech.recipientId : gespraech.initiatorId;
}

export function assertSchreibbar(gespraech: ConversationForCheck): void {
  if (gespraech.state === 'CLOSED') {
    throw errors.conflict(
      'Dieses Gespräch wurde geschlossen. Es lässt sich weiter lesen, aber nicht mehr ' +
        'fortsetzen.',
    );
  }
  if (gespraech.state === 'BLOCKED') {
    throw errors.forbidden('Dieses Gespräch wurde gesperrt.');
  }
}

/*
 * Zeichen, die in einer Nachricht nichts zu suchen haben.
 *
 * Steuerzeichen (ausser Zeilenumbruch und Tabulator) und die Zeichen zur
 * Steuerung der Leserichtung. Letztere lassen sich benutzen, um Text
 * verkehrt herum anzuzeigen -- etwa um eine Adresse anders aussehen zu
 * lassen, als sie ist. Sie werden entfernt, nicht maskiert: Sie erfuellen
 * hier keinen Zweck.
 */
const STEUERZEICHEN = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g;
const RICHTUNGSZEICHEN = /[\u200b-\u200f\u202a-\u202e\u2066-\u2069\ufeff]/g;

/** Prueft und bereinigt einen Nachrichtentext. */
export function pruefeNachricht(text: string): string {
  const bereinigt = text.replace(STEUERZEICHEN, '').replace(RICHTUNGSZEICHEN, '').trim();

  if (bereinigt.length < MIN_LAENGE) {
    throw errors.validation({ body: ['Die Nachricht ist leer.'] });
  }
  if (bereinigt.length > MAX_LAENGE) {
    throw errors.validation({
      body: [`Nachrichten sind auf ${MAX_LAENGE.toLocaleString('de-DE')} Zeichen begrenzt.`],
    });
  }

  return bereinigt;
}

/**
 * Merkmale, die auf einen Betrugsversuch hindeuten.
 *
 * Ausdruecklich KEINE Sperre: Was hier erkannt wird, fuehrt zu einem Hinweis
 * an die empfangende Person, nicht zum Verwerfen der Nachricht. Ein Filter,
 * der harmlose Nachrichten verschluckt, ist schlimmer als ein Hinweis, den
 * jemand ignoriert -- und die Muster hier sind Anhaltspunkte, keine Beweise.
 */
export interface Warnzeichen {
  id: string;
  hinweis: string;
}

const MUSTER: { id: string; regex: RegExp; hinweis: string }[] = [
  {
    id: 'zahlung-vorab',
    regex: /\b(vorkasse|anzahlung|western\s?union|moneygram|treuhand)\w*\b/i,
    hinweis:
      'In dieser Nachricht geht es um Vorauszahlung oder einen Treuhanddienst. Das ist ' +
      'das häufigste Muster bei Betrugsversuchen im Fahrzeughandel.',
  },
  {
    id: 'kontakt-auswaerts',
    regex: /\b(whats\s?app|telegram|signal)\b/i,
    hinweis:
      'Es wird vorgeschlagen, auf einen anderen Dienst zu wechseln. Dort gibt es keinen ' +
      'Gesprächsverlauf, auf den sich später jemand berufen könnte.',
  },
  {
    id: 'spedition',
    regex: /\b(spedition|verschiff\w*|transport(dienst|firma)|abhol(service|dienst))\b/i,
    hinweis:
      'Es geht um eine Spedition oder einen Abholdienst. Bei Fernkäufen ohne Besichtigung ' +
      'ist besondere Vorsicht angebracht.',
  },
  {
    id: 'dringlichkeit',
    regex: /\b(sofort|dringend|heute\s+noch|schnellstm\w*)\b/i,
    hinweis:
      'Die Nachricht drängt auf Eile. Zeitdruck ist ein gängiges Mittel, um Prüfung zu ' +
      'verhindern.',
  },
];

export function findeWarnzeichen(text: string): Warnzeichen[] {
  return MUSTER.filter((muster) => muster.regex.test(text)).map((muster) => ({
    id: muster.id,
    hinweis: muster.hinweis,
  }));
}
