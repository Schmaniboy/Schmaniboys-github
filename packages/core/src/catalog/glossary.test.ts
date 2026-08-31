import { describe, expect, it } from 'vitest';

import { GLOSSARY, GLOSSARY_KEYS, explain } from './glossary';

describe('Glossar', () => {
  it('erklaert jeden Begriff in einem verstaendlichen Satz', () => {
    for (const key of GLOSSARY_KEYS) {
      const eintrag = explain(key);
      expect(eintrag.term.length).toBeGreaterThan(2);
      expect(eintrag.plain.length).toBeGreaterThan(30);
      // Eine Erklaerung, die den Begriff nur wiederholt, erklaert nichts.
      expect(eintrag.plain.toLowerCase()).not.toBe(eintrag.term.toLowerCase());
    }
  });

  it('nennt bei der VIN ausdruecklich die Grenze der Aussagekraft', () => {
    // Das ist Blocker B7 in Lesersprache -- die Einschraenkung darf nicht
    // nur im Gehirn stehen, sondern muss beim Leser ankommen.
    expect(GLOSSARY.vin.whyItMatters).toContain('NICHT');
  });

  it('weist beim Verbrauch auf die Unvergleichbarkeit der Messverfahren hin', () => {
    expect(GLOSSARY.consumption.whyItMatters).toContain('WLTP');
    expect(GLOSSARY.consumption.whyItMatters).toContain('NEFZ');
  });

  it('nennt bei der Leistung beide Einheiten', () => {
    expect(GLOSSARY.power.whyItMatters).toContain('kW');
    expect(GLOSSARY.power.whyItMatters).toContain('PS');
  });
});
