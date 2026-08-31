import { describe, expect, it } from 'vitest';

import { createListingInput, listingSearchInput } from './schemas';

/**
 * Der Schwerpunkt liegt auf den Suchfiltern.
 *
 * Ein gewoehnliches GET-Formular sendet alle Felder, auch die leeren. Faellt
 * die Pruefung darueber, geht der eine gesetzte Filter mit unter -- und die
 * Suche liefert scheinbar richtig, aber ungefiltert. Genau dieser Fehler ist
 * in der Fahrzeugsuche schon einmal passiert.
 */

describe('Suchfilter', () => {
  it('ignoriert leere Felder, statt an ihnen zu scheitern', () => {
    const ergebnis = listingSearchInput.safeParse({
      q: '',
      preisVon: '5000',
      preisBis: '',
      kilometerBis: '',
      baujahrVon: '',
      baujahrBis: '',
      sortierung: 'neueste',
    });

    expect(ergebnis.success).toBe(true);
    if (!ergebnis.success) return;
    expect(ergebnis.data.preisVon).toBe(5000);
    expect(ergebnis.data.preisBis).toBeUndefined();
    expect(ergebnis.data.q).toBeUndefined();
  });

  it('wandelt Zeichenketten in Zahlen', () => {
    // Query-Parameter sind IMMER Zeichenketten. Ein z.number() darauf
    // schlaegt still fehl und die Suche liefert ungefiltert alles.
    const ergebnis = listingSearchInput.parse({ preisBis: '12000', seite: '2' });
    expect(ergebnis.preisBis).toBe(12_000);
    expect(ergebnis.seite).toBe(2);
  });

  it('setzt sinnvolle Voreinstellungen', () => {
    const ergebnis = listingSearchInput.parse({});
    expect(ergebnis.sortierung).toBe('neueste');
    expect(ergebnis.seite).toBe(0);
  });

  it('nimmt "nurUnfallfrei" nur bei ausdruecklichem true an', () => {
    expect(listingSearchInput.parse({ nurUnfallfrei: 'true' }).nurUnfallfrei).toBe(true);
    expect(listingSearchInput.parse({}).nurUnfallfrei).toBeUndefined();
  });

  it('lehnt eine leere Sortierung nicht ab, sondern nimmt die Voreinstellung', () => {
    expect(listingSearchInput.parse({ sortierung: '' }).sortierung).toBe('neueste');
  });
});

describe('Anzeige anlegen', () => {
  const gueltig = {
    draftId: 'draft-1',
    title: 'BMW 320d Touring, erste Hand',
    description:
      'Eine ausreichend lange Beschreibung, die das Fahrzeug in ganzen Sätzen darstellt.',
    priceCents: 1_450_000,
    postalCode: '10115',
    city: 'Berlin',
  };

  it('nimmt eine vollstaendige Eingabe an', () => {
    expect(createListingInput.safeParse(gueltig).success).toBe(true);
  });

  it('lehnt eine zu kurze Beschreibung ab', () => {
    const ergebnis = createListingInput.safeParse({ ...gueltig, description: 'Zu kurz.' });
    expect(ergebnis.success).toBe(false);
  });

  it('lehnt einen Preis von null ab', () => {
    // Verschenkt wird hier nicht -- ein Preis von 0 ist ein Versehen.
    expect(createListingInput.safeParse({ ...gueltig, priceCents: 0 }).success).toBe(false);
  });

  it('lehnt eine Postleitzahl ab, die keine ist', () => {
    for (const plz of ['1011', '101150', 'ABCDE', '']) {
      expect(createListingInput.safeParse({ ...gueltig, postalCode: plz }).success).toBe(false);
    }
  });

  it('setzt Verhandlungsbasis auf false, wenn nichts gesagt wird', () => {
    const ergebnis = createListingInput.parse(gueltig);
    expect(ergebnis.negotiable).toBe(false);
  });
});
