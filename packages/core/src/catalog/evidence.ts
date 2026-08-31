import { errors } from '../errors';

/**
 * Belegmodelle fuer Wissensaussagen.
 *
 * Das Problem, das diese Datei loest: Technische Daten stehen in Unterlagen.
 * "Der Motor gilt als haltbar" steht nirgends -- das ist eine Einschaetzung.
 * "Diese Generation ist gefragt" ist eine Marktbeobachtung mit Verfallsdatum.
 *
 * Alle drei gleich darzustellen waere die gefaehrlichste Form erfundener
 * Daten: eine, die wie ein Datenblatt aussieht. Vorgabe C3 verlangt deshalb,
 * dass jede Aussage ihr Belegmodell mitfuehrt -- und dass die Anforderungen
 * je Modell erzwungen werden, nicht empfohlen.
 */

export const EvidenceType = {
  /** Nachpruefbare Angabe aus einer Unterlage. */
  SPECIFICATION: 'SPECIFICATION',
  /** Redaktionelle Einschaetzung mit Begruendung. */
  ASSESSMENT: 'ASSESSMENT',
  /** Aus Marktbeobachtung abgeleitet, mit Stichtag. */
  MARKET_SIGNAL: 'MARKET_SIGNAL',
} as const;

export type EvidenceType = (typeof EvidenceType)[keyof typeof EvidenceType];

export const ConfidenceLevel = {
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW',
} as const;

export type ConfidenceLevel = (typeof ConfidenceLevel)[keyof typeof ConfidenceLevel];

/** Wie eine Aussage dem Leser angekuendigt wird. */
export const EVIDENCE_LABELS: Record<EvidenceType, string> = {
  SPECIFICATION: 'Belegte Angabe',
  ASSESSMENT: 'Einschätzung der Redaktion',
  MARKET_SIGNAL: 'Marktbeobachtung',
};

export const EVIDENCE_EXPLANATIONS: Record<EvidenceType, string> = {
  SPECIFICATION:
    'Diese Angabe stammt aus einer Unterlage und ist über die genannte Quelle nachprüfbar.',
  ASSESSMENT:
    'Das ist eine Einschätzung, keine Messung. Die Begründung steht dabei, damit Sie sie selbst beurteilen können.',
  MARKET_SIGNAL:
    'Aus Marktbeobachtungen abgeleitet. Solche Werte ändern sich — Stichtag und Datengrundlage stehen dabei.',
};

export const CONFIDENCE_LABELS: Record<ConfidenceLevel, string> = {
  HIGH: 'gut belegt',
  MEDIUM: 'eingeschränkt belegt',
  LOW: 'schwach belegt',
};

/**
 * Quellenarten, die eine nachpruefbare Angabe tragen koennen.
 *
 * Eine Pressemitteilung ist eine Absichtserklaerung des Herstellers und
 * taugt fuer Zahlen nur bedingt; sie zaehlt hier bewusst nicht als Beleg
 * fuer eine SPECIFICATION.
 */
const BELASTBARE_QUELLEN = new Set([
  'MANUFACTURER_DOCUMENT',
  'TYPE_APPROVAL',
  'TECHNICAL_LITERATURE',
  'MEASUREMENT',
]);

/** Ab dieser Stichprobe gilt eine Marktbeobachtung als gut belegt. */
export const MARKET_SIGNAL_HIGH_CONFIDENCE_SAMPLE = 30;

/** Aelter als das gilt eine Marktbeobachtung als ueberholt. */
export const MARKET_SIGNAL_STALE_MONTHS = 24;

/** Eine Einschaetzung ohne echte Begruendung ist eine Behauptung. */
export const MIN_REASONING_LENGTH = 40;
export const MIN_DATA_BASIS_LENGTH = 20;

export interface EvidenceClaim {
  evidenceType: EvidenceType;
  confidence: ConfidenceLevel;
  reasoning?: string | null | undefined;
  dataBasis?: string | null | undefined;
  observedAt?: Date | null | undefined;
  sampleSize?: number | null | undefined;
  /** Quellenarten, die zu dieser Aussage hinterlegt sind. */
  sourceKinds: readonly string[];
}

/**
 * Prueft, ob eine Aussage veroeffentlicht werden darf.
 *
 * Wirft mit einer Begruendung, die der Redaktion sagt, was fehlt. Diese
 * Pruefung laeuft zusaetzlich zur allgemeinen Quellenpflicht aus
 * `publishing.ts` -- sie ist strenger, nicht anders.
 */
export function assertEvidenceSufficient(claim: EvidenceClaim): void {
  switch (claim.evidenceType) {
    case EvidenceType.SPECIFICATION: {
      const belastbar = claim.sourceKinds.some((kind) => BELASTBARE_QUELLEN.has(kind));
      if (!belastbar) {
        throw errors.conflict(
          'Eine belegte Angabe braucht mindestens eine belastbare Quelle: ' +
            'Herstellerunterlage, Typgenehmigung, Fachliteratur oder eigene Messung. ' +
            'Eine Pressemitteilung genuegt dafuer nicht. ' +
            'Alternativ die Aussage als Einschaetzung kennzeichnen.',
        );
      }
      return;
    }

    case EvidenceType.ASSESSMENT: {
      const begruendung = (claim.reasoning ?? '').trim();
      if (begruendung.length < MIN_REASONING_LENGTH) {
        throw errors.conflict(
          `Eine Einschaetzung braucht eine Begruendung von mindestens ${MIN_REASONING_LENGTH} Zeichen. ` +
            'Ohne Begruendung ist sie eine Behauptung.',
        );
      }
      return;
    }

    case EvidenceType.MARKET_SIGNAL: {
      const grundlage = (claim.dataBasis ?? '').trim();
      if (grundlage.length < MIN_DATA_BASIS_LENGTH) {
        throw errors.conflict(
          'Eine Marktbeobachtung braucht eine Angabe zur Datengrundlage: ' +
            'woher stammen die Beobachtungen?',
        );
      }
      if (!claim.observedAt) {
        throw errors.conflict(
          'Eine Marktbeobachtung braucht einen Stichtag. Marktwerte altern.',
        );
      }
      return;
    }
  }
}

/**
 * Begrenzt die angegebene Guete auf das, was die Belege hergeben.
 *
 * Die Redaktion darf sich nicht besser einschaetzen, als die Grundlage ist.
 * Deshalb wird der Wert hier gedeckelt statt abgelehnt -- die Aussage bleibt
 * nutzbar, nur ihr Anspruch sinkt.
 */
export function cappedConfidence(claim: EvidenceClaim, now: Date): ConfidenceLevel {
  const angegeben = claim.confidence;

  if (claim.evidenceType === EvidenceType.SPECIFICATION) {
    const belastbar = claim.sourceKinds.some((kind) => BELASTBARE_QUELLEN.has(kind));
    return belastbar ? angegeben : ConfidenceLevel.LOW;
  }

  if (claim.evidenceType === EvidenceType.ASSESSMENT) {
    // Eine Einschaetzung ist nie "gut belegt" -- das waere ein Widerspruch.
    return angegeben === ConfidenceLevel.HIGH ? ConfidenceLevel.MEDIUM : angegeben;
  }

  // MARKET_SIGNAL
  if (!claim.observedAt) return ConfidenceLevel.LOW;

  const monate = monthsBetween(claim.observedAt, now);
  if (monate >= MARKET_SIGNAL_STALE_MONTHS) return ConfidenceLevel.LOW;

  const stichprobe = claim.sampleSize ?? 0;
  if (angegeben === ConfidenceLevel.HIGH && stichprobe < MARKET_SIGNAL_HIGH_CONFIDENCE_SAMPLE) {
    return ConfidenceLevel.MEDIUM;
  }
  return angegeben;
}

/** Ist eine Marktbeobachtung ueberholt? Wird dem Leser angezeigt. */
export function isStale(claim: EvidenceClaim, now: Date): boolean {
  if (claim.evidenceType !== EvidenceType.MARKET_SIGNAL) return false;
  if (!claim.observedAt) return true;
  return monthsBetween(claim.observedAt, now) >= MARKET_SIGNAL_STALE_MONTHS;
}

function monthsBetween(from: Date, to: Date): number {
  const jahre = to.getUTCFullYear() - from.getUTCFullYear();
  const monate = to.getUTCMonth() - from.getUTCMonth();
  const tage = to.getUTCDate() - from.getUTCDate();
  return jahre * 12 + monate - (tage < 0 ? 1 : 0);
}
