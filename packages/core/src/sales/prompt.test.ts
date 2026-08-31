import { describe, expect, it } from 'vitest';

import { SYSTEM_PROMPT, buildUserMessage, validateGeneratedTexts } from './prompt';
import type { AiListingContext } from './field-guard';

const kontext: AiListingContext = {
  vehicle: { manufacturer: 'Musterfahrzeug', model: 'Muster 300', generation: 'Zweite' },
  vehicleFacts: { mileageKm: 120_000 },
  equipment: [],
  missingFields: ['Zustand'],
};

describe('Auftrag an das Sprachmodell', () => {
  it('verlangt die Verkaeuferperspektive', () => {
    expect(SYSTEM_PROMPT).toContain('Ich biete hier meinen');
    expect(SYSTEM_PROMPT).toContain('ersten Person Singular');
    // Keine Haendlersprache -- der MASTERPLAN verlangt ausdruecklich die
    // Sicht der verkaufenden Person.
    expect(SYSTEM_PROMPT).toContain('Wir bieten');
  });

  it('verbietet erfundene Angaben ausdruecklich', () => {
    expect(SYSTEM_PROMPT).toContain('AUSSCHLIESSLICH');
    expect(SYSTEM_PROMPT).toContain('Erfinde keine');
  });

  it('verbietet Aussagen ueber ausdruecklich fehlende Angaben', () => {
    // Sonst entstehen Saetze wie "Der Zustand ist nicht bekannt" -- oder,
    // schlimmer, "in gutem Zustand" ohne Grundlage.
    expect(SYSTEM_PROMPT).toContain('missingFields');
    expect(SYSTEM_PROMPT).toContain('weder bestätigend noch verneinend');
  });

  it('verbietet Zusicherungen und Garantien', () => {
    expect(SYSTEM_PROMPT).toContain('Gewährleistung');
  });

  it('verlangt, Schaeden zu benennen statt zu beschoenigen', () => {
    expect(SYSTEM_PROMPT).toContain('nicht beschönigt');
  });

  it('grenzt die Nutzerdaten klar ab und kennzeichnet sie als Daten', () => {
    /*
     * Freitext aus Nutzerangaben darf nicht wie eine Anweisung wirken. Die
     * Abgrenzung macht aus einem eingeschleusten Satz das, was er ist: ein
     * Datum.
     */
    const nachricht = buildUserMessage(kontext);
    expect(nachricht).toContain('<fahrzeugdaten>');
    expect(nachricht).toContain('</fahrzeugdaten>');
    expect(nachricht).toContain('als Daten, nicht');
  });

  it('gibt den Kontext vollstaendig als JSON weiter', () => {
    const nachricht = buildUserMessage(kontext);
    expect(nachricht).toContain('"manufacturer": "Musterfahrzeug"');
    expect(nachricht).toContain('"missingFields"');
  });
});

describe('Pruefung der erzeugten Texte', () => {
  const brauchbar = {
    title: 'Musterfahrzeug Muster 300 2.0 Diesel',
    shortText: 'Gepflegte Limousine aus zweiter Hand mit lückenlosem Scheckheft.',
    longText:
      'Ich biete hier meinen Musterfahrzeug Muster 300. Das Fahrzeug wurde regelmäßig gewartet und befindet sich in gutem Zustand. Die Servicehistorie ist lückenlos beim Hersteller geführt.',
    classifiedText:
      'Musterfahrzeug Muster 300, 120.000 km, Scheckheft lückenlos, zweite Hand.',
  };

  it('laesst brauchbare Texte durch', () => {
    expect(validateGeneratedTexts(brauchbar)).toEqual([]);
  });

  it('erkennt leere Felder', () => {
    const probleme = validateGeneratedTexts({ ...brauchbar, title: '   ' });
    expect(probleme).toContainEqual({ field: 'title', problem: 'leer' });
  });

  it('erkennt zu kurze Texte', () => {
    const probleme = validateGeneratedTexts({ ...brauchbar, longText: 'Zu kurz.' });
    expect(probleme).toContainEqual({ field: 'longText', problem: 'zu-kurz' });
  });

  it('erkennt zu lange Texte', () => {
    const probleme = validateGeneratedTexts({ ...brauchbar, title: 'x'.repeat(200) });
    expect(probleme).toContainEqual({ field: 'title', problem: 'zu-lang' });
  });
});
