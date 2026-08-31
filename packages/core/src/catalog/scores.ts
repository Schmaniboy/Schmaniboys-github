import { ConfidenceLevel } from './evidence';

/**
 * Bewertungen von 0 bis 100.
 *
 * Vorgabe 31 verlangt Bewertungen und im selben Atemzug: "Nicht einfach
 * Werte erfinden." Das ist kein Widerspruch, sondern eine Bedingung. Eine
 * Bewertung darf nur dort stehen, wo sie aus erfassten Daten folgt -- und
 * wo sie das nicht tut, muss die Stelle leer bleiben und sagen, warum.
 *
 * Eine 72 von 100, hinter der nichts steht, ist schlimmer als gar keine
 * Zahl: Sie sieht aus wie ein Messergebnis.
 *
 * Deshalb liefert jede Funktion hier entweder eine Bewertung MIT
 * Herleitung -- welche Datensaetze eingegangen sind, welche Formel -- oder
 * `null` mit Begruendung.
 */

export interface Score {
  /** 0 bis 100. */
  value: number;
  /** Woraus die Zahl entstanden ist, in einem Satz. */
  basis: string;
  /** Die eingegangenen Groessen, damit die Zahl nachrechenbar bleibt. */
  inputs: { label: string; value: string }[];
  confidence: ConfidenceLevel;
}

export interface NoScore {
  value: null;
  /** Warum es hier keine Bewertung gibt. Wird angezeigt, nicht verschluckt. */
  reason: string;
}

export type ScoreResult = Score | NoScore;

export function hatBewertung(ergebnis: ScoreResult): ergebnis is Score {
  return ergebnis.value !== null;
}

/** Unterhalb dieser Menge an Datensaetzen gibt es keine Bewertung. */
export const MIN_DATENSAETZE_ZUVERLAESSIGKEIT = 3;
export const MIN_AUSSTATTUNGEN_FUER_GRAD = 5;

function begrenze(wert: number): number {
  return Math.max(0, Math.min(100, Math.round(wert)));
}

// ---------------------------------------------------------------------------
// Zuverlaessigkeit
// ---------------------------------------------------------------------------

export interface IssueSummary {
  /** Wertebereich wie in der Datenbank (IssueSeverity), nicht daneben. */
  severity: 'CRITICAL' | 'SIGNIFICANT' | 'MINOR';
  /** Ist der Fehler dauerhaft behoben (Massnahme des Herstellers)? */
  resolved: boolean;
}

/**
 * Gilt eine Schwachstelle fuer ein Fahrzeug dieses Baujahrs als behoben?
 *
 * Ausdruecklich nicht aus `yearTo` abgeleitet: Dass eine Schwachstelle nach
 * 2017 nicht mehr auftrat, kann daran liegen, dass der Hersteller sie behoben
 * hat -- oder daran, dass das Modell auslief. Nur die ausdrueckliche Angabe
 * "behoben ab" traegt die Aussage.
 *
 * Ohne Baujahr des Fahrzeugs gilt sie als NICHT behoben: Wer nicht weiss,
 * welches Baujahr vor ihm steht, darf nicht annehmen, es sei das reparierte.
 */
export function giltAlsBehoben(
  issue: { resolvedFromYear?: number | null | undefined },
  fahrzeugBaujahr?: number | null | undefined,
): boolean {
  if (!issue.resolvedFromYear) return false;
  if (!fahrzeugBaujahr) return false;
  return fahrzeugBaujahr >= issue.resolvedFromYear;
}

/*
 * Wie stark eine Schwachstelle die Note druckt.
 *
 * Die Abstaende sind bewusst gross: Eine Schwachstelle, bei der das Fahrzeug
 * liegenbleibt, ist nicht "etwas schlimmer" als eine, die Geld kostet.
 */
const SCHWERE_ABZUG: Record<IssueSummary['severity'], number> = {
  CRITICAL: 28,
  SIGNIFICANT: 14,
  MINOR: 5,
};

/**
 * Zuverlaessigkeit aus erfassten Schwachstellen.
 *
 * Ausdruecklich KEINE Pannenstatistik: Wir zaehlen, was jemand als
 * Schwachstelle erfasst hat, nicht was in der Werkstatt ankommt. Ein Motor
 * ohne erfasste Schwachstellen ist deshalb nicht zuverlaessig -- er ist
 * unerforscht. Genau darum gibt es unterhalb einer Mindestmenge keine Zahl.
 */
export function bewerteZuverlaessigkeit(issues: IssueSummary[]): ScoreResult {
  if (issues.length < MIN_DATENSAETZE_ZUVERLAESSIGKEIT) {
    return {
      value: null,
      reason:
        `Für eine Zuverlässigkeitsnote sind mindestens ${MIN_DATENSAETZE_ZUVERLAESSIGKEIT} ` +
        `erfasste Schwachstellen nötig; erfasst sind ${issues.length}. Wenige Einträge heißen ` +
        'nicht, dass es wenige Probleme gibt — sie heißen, dass wir es nicht wissen.',
    };
  }

  const abzug = issues.reduce((summe, issue) => {
    const basis = SCHWERE_ABZUG[issue.severity];
    // Ein vom Hersteller behobener Fehler betrifft nur einen Teil der
    // Baujahre. Er zaehlt, aber gedaempft.
    return summe + (issue.resolved ? basis * 0.35 : basis);
  }, 0);

  const offen = issues.filter((i) => !i.resolved).length;

  return {
    value: begrenze(100 - abzug),
    basis:
      `100 abzüglich der gewichteten Schwere der ${issues.length} erfassten Schwachstellen ` +
      '(behobene zählen zu 35 %).',
    inputs: [
      { label: 'Erfasste Schwachstellen', value: String(issues.length) },
      { label: 'davon offen', value: String(offen) },
      { label: 'Gewichteter Abzug', value: String(Math.round(abzug)) },
    ],
    confidence:
      issues.length >= 8
        ? ConfidenceLevel.MEDIUM
        : ConfidenceLevel.LOW,
  };
}

// ---------------------------------------------------------------------------
// Ausstattungsgrad
// ---------------------------------------------------------------------------

/**
 * Ausstattungsnote aus dem Ergebnis des Ausstattungscheckers.
 *
 * Der Prozentwert des Checkers ist bereits eine Note von 0 bis 100 -- diese
 * Funktion uebernimmt ihn und pruefte nur, ob die Datengrundlage traegt.
 * Umrechnen waere hier nur Verschleierung.
 */
export function bewerteAusstattungsgrad(
  percent: number | null,
  erfassteAufpreisausstattungen: number,
): ScoreResult {
  if (percent === null) {
    return {
      value: null,
      reason:
        'Für diese Auswahl ist keine Aufpreisausstattung erfasst. Ohne Angebot gibt es ' +
        'keinen Ausstattungsgrad.',
    };
  }
  if (erfassteAufpreisausstattungen < MIN_AUSSTATTUNGEN_FUER_GRAD) {
    return {
      value: null,
      reason:
        `Nur ${erfassteAufpreisausstattungen} ${
          erfassteAufpreisausstattungen === 1 ? 'Aufpreisausstattung' : 'Aufpreisausstattungen'
        } erfasst. Ein Grad daraus wäre eine Zufallszahl; nötig sind mindestens ` +
        `${MIN_AUSSTATTUNGEN_FUER_GRAD}.`,
    };
  }

  return {
    value: begrenze(percent),
    basis:
      'Gewichteter Anteil der vorhandenen an den für diese Auswahl erfassten ' +
      'Aufpreisausstattungen.',
    inputs: [
      { label: 'Erfasste Aufpreisausstattungen', value: String(erfassteAufpreisausstattungen) },
      { label: 'Anteil', value: `${percent} %` },
    ],
    confidence:
      erfassteAufpreisausstattungen >= 20 ? ConfidenceLevel.MEDIUM : ConfidenceLevel.LOW,
  };
}

// ---------------------------------------------------------------------------
// Seltenheit
// ---------------------------------------------------------------------------

const SELTENHEIT_WERT: Record<string, number> = {
  COMMON: 10,
  UNCOMMON: 40,
  RARE: 70,
  VERY_RARE: 95,
};

/**
 * Seltenheitsnote aus den erfassten Seltenheiten der vorhandenen Ausstattung.
 *
 * Es zaehlt nur, was eine erfasste Seltenheit HAT. Fehlende Angaben als
 * "haeufig" zu behandeln waere eine stille Annahme mit Wirkung auf die Note.
 */
export function bewerteSeltenheit(
  raritaeten: (string | null | undefined)[],
): ScoreResult {
  const bekannt = raritaeten.filter(
    (r): r is string => typeof r === 'string' && r in SELTENHEIT_WERT,
  );

  if (bekannt.length === 0) {
    return {
      value: null,
      reason:
        'Zu keiner der vorhandenen Ausstattungen ist eine Seltenheit belegt. ' +
        'Seltenheit steht in keinem Datenblatt — sie muss beobachtet werden.',
    };
  }

  // Die drei seltensten Merkmale bestimmen den Eindruck; ein Auto mit einem
  // sehr seltenen Extra ist selten, auch wenn zwanzig gewoehnliche dabei sind.
  const werte = bekannt
    .map((r) => SELTENHEIT_WERT[r] as number)
    .sort((a, b) => b - a)
    .slice(0, 3);
  const wert = werte.reduce((a, b) => a + b, 0) / werte.length;

  return {
    value: begrenze(wert),
    basis:
      'Mittel der drei seltensten vorhandenen Ausstattungen, für die eine Seltenheit ' +
      'belegt ist.',
    inputs: [
      { label: 'Ausstattungen mit belegter Seltenheit', value: String(bekannt.length) },
      { label: 'Ohne Angabe', value: String(raritaeten.length - bekannt.length) },
    ],
    confidence: bekannt.length >= 5 ? ConfidenceLevel.MEDIUM : ConfidenceLevel.LOW,
  };
}

// ---------------------------------------------------------------------------
// Wiederverkaufswirkung
// ---------------------------------------------------------------------------

/**
 * Wirkung auf den Wiederverkauf als Skala, nicht als Betrag.
 *
 * Vorgabe 15: keine festen Eurobetraege erfinden. Was eine Ausstattung beim
 * Wiederverkauf ausmacht, haengt an Markt, Laufleistung, Zustand und
 * Zeitpunkt -- eine Zahl daraus waere eine Erfindung mit Nachkommastelle.
 * Es gibt deshalb eine Richtung und einen Grund, sonst nichts.
 */
export const RESALE_IMPACT = ['--', '-', '0', '+', '++', '+++'] as const;
export type ResaleImpact = (typeof RESALE_IMPACT)[number];

export const RESALE_IMPACT_LABELS: Record<ResaleImpact, string> = {
  '--': 'deutlich wertmindernd',
  '-': 'leicht wertmindernd',
  '0': 'ohne erkennbare Wirkung',
  '+': 'leicht werterhaltend',
  '++': 'werterhaltend',
  '+++': 'deutlich werterhaltend',
};

export function istWiederverkaufsstufe(wert: string): wert is ResaleImpact {
  return (RESALE_IMPACT as readonly string[]).includes(wert);
}

export interface ResaleAssessment {
  impact: ResaleImpact;
  /** Warum? Pflicht -- ein Zeichen ohne Begruendung ist ein Orakel. */
  reasoning: string;
}

/**
 * Wie stark die vorhandene Ausstattung insgesamt auf den Wiederverkauf
 * wirkt -- als Note ueber die erfassten Relevanzen, ohne Geldbetrag.
 */
export function fasseWiederverkaufZusammen(
  bewertungen: { resaleRelevance: 'HIGH' | 'MEDIUM' | 'LOW' | null | undefined }[],
): ScoreResult {
  const bekannt = bewertungen.filter((b) => b.resaleRelevance);
  if (bekannt.length === 0) {
    return {
      value: null,
      reason:
        'Zu keiner der vorhandenen Ausstattungen ist eine Wiederverkaufsrelevanz erfasst. ' +
        'Ohne Marktdaten wird hier nichts geschätzt.',
    };
  }

  const punkte = bekannt.reduce(
    (summe, b) =>
      summe + (b.resaleRelevance === 'HIGH' ? 3 : b.resaleRelevance === 'MEDIUM' ? 2 : 1),
    0,
  );
  const maximum = bekannt.length * 3;

  return {
    value: begrenze((punkte / maximum) * 100),
    basis:
      'Anteil der vorhandenen Ausstattungen mit hoher Wiederverkaufsrelevanz an den ' +
      'Ausstattungen, für die eine Relevanz erfasst ist. Ausdrücklich keine Aussage über ' +
      'einen Geldbetrag.',
    inputs: [
      { label: 'Mit erfasster Relevanz', value: String(bekannt.length) },
      { label: 'Ohne Angabe', value: String(bewertungen.length - bekannt.length) },
    ],
    confidence: ConfidenceLevel.LOW,
  };
}
