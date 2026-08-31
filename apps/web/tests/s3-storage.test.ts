import { describe, expect, it } from 'vitest';

import { istNichtGefunden } from '../src/lib/images/s3-fehler';

/**
 * Die eine Entscheidung im S3-Adapter, die falsch sein kann.
 *
 * Die Schnittstelle verlangt `null` fuer ein Objekt, das es nicht gibt --
 * und einen Fehler fuer alles andere. Wer beides zu `null` zusammenfasst,
 * macht aus einer kaputten Ablage stillschweigend eine leere: Die Anzeige
 * erscheint ohne Bilder, niemand merkt, dass die Zugangsdaten falsch sind.
 *
 * Verschiedene S3-Umsetzungen melden "gibt es nicht" verschieden. Deshalb
 * werden drei Formen erkannt -- und ausdruecklich nur diese drei.
 */
describe('S3-Adapter: was ist ein "gibt es nicht"', () => {
  it('erkennt die drei ueblichen Formen', () => {
    expect(istNichtGefunden({ name: 'NoSuchKey' })).toBe(true); // AWS
    expect(istNichtGefunden({ name: 'NotFound' })).toBe(true); // andere
    expect(istNichtGefunden({ $metadata: { httpStatusCode: 404 } })).toBe(true); // nur Code
  });

  it('haelt echte Stoerungen NICHT fuer ein fehlendes Objekt', () => {
    // Diese muessen durchschlagen, sonst sieht eine kaputte Ablage aus wie
    // eine leere.
    expect(istNichtGefunden({ name: 'AccessDenied' })).toBe(false);
    expect(istNichtGefunden({ name: 'InvalidAccessKeyId' })).toBe(false);
    expect(istNichtGefunden({ name: 'NoSuchBucket' })).toBe(false);
    expect(istNichtGefunden({ $metadata: { httpStatusCode: 403 } })).toBe(false);
    expect(istNichtGefunden({ $metadata: { httpStatusCode: 500 } })).toBe(false);
    expect(istNichtGefunden(new Error('ECONNREFUSED'))).toBe(false);
  });

  it('kommt mit allem zurecht, was kein Fehlerobjekt ist', () => {
    for (const nichts of [null, undefined, 'NoSuchKey', 404, [], {}]) {
      expect(istNichtGefunden(nichts), String(nichts)).toBe(false);
    }
  });
});
