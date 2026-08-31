import { describe, expect, it } from 'vitest';

import { buildListingSlug, slugTeil } from './slug';

describe('Adresszeilen', () => {
  it('ersetzt Umlaute lesbar statt sie zu loeschen', () => {
    // "Anhngerkupplung" waere das Ergebnis eines bloßen Filters.
    expect(slugTeil('Anhängerkupplung')).toBe('anhaengerkupplung');
    expect(slugTeil('Weiß')).toBe('weiss');
    expect(slugTeil('Öldruck')).toBe('oeldruck');
  });

  it('entfernt alles, was in einer URL Aerger macht', () => {
    expect(slugTeil('BMW 320d / Touring (2016) — top!')).toBe('bmw-320d-touring-2016-top');
    expect(slugTeil('../../etc/passwd')).toBe('etc-passwd');
    expect(slugTeil('a%20b')).toBe('a-20b');
  });

  it('endet nie auf einem Trennstrich', () => {
    for (const eingabe of ['Auto ---', 'Auto!!!', 'A'.repeat(80) + ' !!!']) {
      expect(slugTeil(eingabe).endsWith('-')).toBe(false);
    }
  });

  it('haengt den Zufallsteil an, damit es keinen Wettlauf gibt', () => {
    const slug = buildListingSlug({
      title: 'BMW 320d Touring aus erster Hand',
      vehicleLabel: 'BMW 3er F31',
      zufall: 'a7f3k2',
    });
    expect(slug.endsWith('-a7f3k2')).toBe(true);
    expect(slug.startsWith('bmw-320d-touring-aus-erster-hand')).toBe(true);
  });

  it('faellt bei unbrauchbaren Eingaben auf etwas Gueltiges zurueck', () => {
    const slug = buildListingSlug({ title: '???', vehicleLabel: '###', zufall: 'x1y2z3' });
    expect(slug).toBe('anzeige-x1y2z3');
  });

  it('wiederholt einen Teil nicht, der schon im Titel steht', () => {
    const slug = buildListingSlug({
      title: 'BMW 3er',
      vehicleLabel: 'BMW 3er',
      zufall: 'q9',
    });
    expect(slug).toBe('bmw-3er-q9');
  });
});
