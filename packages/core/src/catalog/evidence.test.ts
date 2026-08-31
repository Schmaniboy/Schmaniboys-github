import { describe, expect, it } from 'vitest';

import { AppError } from '../errors';

import {
  ConfidenceLevel,
  EvidenceType,
  MARKET_SIGNAL_HIGH_CONFIDENCE_SAMPLE,
  assertEvidenceSufficient,
  cappedConfidence,
  isStale,
  type EvidenceClaim,
} from './evidence';

const JETZT = new Date('2026-06-01T00:00:00.000Z');

function meldung(claim: EvidenceClaim): string {
  try {
    assertEvidenceSufficient(claim);
    return 'kein Fehler';
  } catch (error) {
    return error instanceof AppError ? error.message : 'falscher Fehlertyp';
  }
}

const basis: EvidenceClaim = {
  evidenceType: EvidenceType.SPECIFICATION,
  confidence: ConfidenceLevel.HIGH,
  sourceKinds: [],
};

describe('Belegte Angabe', () => {
  it('braucht eine belastbare Quelle', () => {
    expect(meldung({ ...basis, sourceKinds: [] })).toContain('belastbare Quelle');
    expect(meldung({ ...basis, sourceKinds: ['OTHER'] })).toContain('belastbare Quelle');
  });

  it('laesst eine Pressemitteilung allein nicht als Beleg gelten', () => {
    // Eine Pressemitteilung ist eine Absichtserklaerung, kein Datenblatt.
    expect(meldung({ ...basis, sourceKinds: ['PRESS_RELEASE'] })).toContain(
      'Pressemitteilung',
    );
  });

  it('nimmt Herstellerunterlage, Typgenehmigung, Fachliteratur und Messung an', () => {
    for (const kind of [
      'MANUFACTURER_DOCUMENT',
      'TYPE_APPROVAL',
      'TECHNICAL_LITERATURE',
      'MEASUREMENT',
    ]) {
      expect(meldung({ ...basis, sourceKinds: [kind] })).toBe('kein Fehler');
    }
  });

  it('senkt die Guete ohne belastbare Quelle', () => {
    expect(cappedConfidence({ ...basis, sourceKinds: ['OTHER'] }, JETZT)).toBe(
      ConfidenceLevel.LOW,
    );
    expect(
      cappedConfidence({ ...basis, sourceKinds: ['TYPE_APPROVAL'] }, JETZT),
    ).toBe(ConfidenceLevel.HIGH);
  });
});

describe('Einschaetzung', () => {
  const einschaetzung: EvidenceClaim = {
    evidenceType: EvidenceType.ASSESSMENT,
    confidence: ConfidenceLevel.MEDIUM,
    sourceKinds: [],
  };

  it('braucht eine Begruendung', () => {
    expect(meldung(einschaetzung)).toContain('Begruendung');
    expect(meldung({ ...einschaetzung, reasoning: 'zu kurz' })).toContain('Begruendung');
  });

  it('nimmt eine ausreichende Begruendung an', () => {
    expect(
      meldung({
        ...einschaetzung,
        reasoning:
          'Werkstattberichte und Foreneintraege nennen wiederholt dieselbe Baugruppe.',
      }),
    ).toBe('kein Fehler');
  });

  it('ist niemals "gut belegt" -- das waere ein Widerspruch', () => {
    expect(
      cappedConfidence({ ...einschaetzung, confidence: ConfidenceLevel.HIGH }, JETZT),
    ).toBe(ConfidenceLevel.MEDIUM);
  });

  it('gilt nie als ueberholt, weil sie keinen Stichtag hat', () => {
    expect(isStale(einschaetzung, JETZT)).toBe(false);
  });
});

describe('Marktbeobachtung', () => {
  const beobachtung: EvidenceClaim = {
    evidenceType: EvidenceType.MARKET_SIGNAL,
    confidence: ConfidenceLevel.HIGH,
    dataBasis: 'Auswertung eigener Angebotsdaten aus dem Marktplatz',
    observedAt: new Date('2026-05-01T00:00:00.000Z'),
    sampleSize: 120,
    sourceKinds: [],
  };

  it('braucht eine Datengrundlage', () => {
    expect(meldung({ ...beobachtung, dataBasis: undefined })).toContain('Datengrundlage');
    expect(meldung({ ...beobachtung, dataBasis: 'wenig' })).toContain('Datengrundlage');
  });

  it('braucht einen Stichtag', () => {
    expect(meldung({ ...beobachtung, observedAt: undefined })).toContain('Stichtag');
  });

  it('senkt die Guete bei kleiner Stichprobe', () => {
    expect(
      cappedConfidence(
        { ...beobachtung, sampleSize: MARKET_SIGNAL_HIGH_CONFIDENCE_SAMPLE - 1 },
        JETZT,
      ),
    ).toBe(ConfidenceLevel.MEDIUM);
    expect(cappedConfidence(beobachtung, JETZT)).toBe(ConfidenceLevel.HIGH);
  });

  it('senkt die Guete bei fehlender Stichprobenangabe', () => {
    expect(cappedConfidence({ ...beobachtung, sampleSize: null }, JETZT)).toBe(
      ConfidenceLevel.MEDIUM,
    );
  });

  it('erkennt eine ueberholte Beobachtung und senkt sie auf schwach belegt', () => {
    const alt = { ...beobachtung, observedAt: new Date('2023-01-01T00:00:00.000Z') };
    expect(isStale(alt, JETZT)).toBe(true);
    expect(cappedConfidence(alt, JETZT)).toBe(ConfidenceLevel.LOW);
  });

  it('haelt eine frische Beobachtung fuer aktuell', () => {
    expect(isStale(beobachtung, JETZT)).toBe(false);
  });

  it('rechnet den Monatsabstand ueber Jahresgrenzen richtig', () => {
    const knappZweiJahre = {
      ...beobachtung,
      observedAt: new Date('2024-06-02T00:00:00.000Z'),
    };
    // 2024-06-02 bis 2026-06-01 sind 23 Monate und ein paar Tage.
    expect(isStale(knappZweiJahre, JETZT)).toBe(false);

    const geradeZweiJahre = {
      ...beobachtung,
      observedAt: new Date('2024-06-01T00:00:00.000Z'),
    };
    expect(isStale(geradeZweiJahre, JETZT)).toBe(true);
  });
});
