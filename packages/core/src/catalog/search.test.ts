import { describe, expect, it } from 'vitest';

import { SEARCH_PAGE_SIZE, buildSearchQuery, hasActiveFilters, pageCount, vehicleSearchInput } from './search';

const leer = vehicleSearchInput.parse({});

describe('Suchanfrage', () => {
  it('nimmt eine leere Anfrage an und setzt Vorgaben', () => {
    expect(leer.seite).toBe(1);
    expect(leer.sortierung).toBe('relevanz');
    expect(leer.kraftstoff).toEqual([]);
  });

  it('nimmt einen einzelnen Wert genauso an wie eine Liste', () => {
    // Aus der Adresszeile kommt bei einer Auswahl ein Wert, bei mehreren ein Feld.
    expect(vehicleSearchInput.parse({ kraftstoff: 'DIESEL' }).kraftstoff).toEqual(['DIESEL']);
    expect(
      vehicleSearchInput.parse({ kraftstoff: ['DIESEL', 'PETROL'] }).kraftstoff,
    ).toEqual(['DIESEL', 'PETROL']);
  });

  it('nimmt auch eine kommagetrennte Liste an', () => {
    // So schreibt die Filterleiste sie in die Adresse -- ein Link kann keinen
    // Parameter mehrfach setzen.
    expect(vehicleSearchInput.parse({ kraftstoff: 'DIESEL,ELECTRIC' }).kraftstoff).toEqual([
      'DIESEL',
      'ELECTRIC',
    ]);
  });

  it('lehnt unbekannte Kraftstoffarten ab', () => {
    expect(vehicleSearchInput.safeParse({ kraftstoff: 'HOLZVERGASER' }).success).toBe(false);
    expect(vehicleSearchInput.safeParse({ kraftstoff: 'DIESEL,HOLZVERGASER' }).success).toBe(
      false,
    );
  });

  it('lehnt umgekehrte Spannen ab', () => {
    expect(
      vehicleSearchInput.safeParse({ baujahrVon: 2020, baujahrBis: 2010 }).success,
    ).toBe(false);
    expect(
      vehicleSearchInput.safeParse({ leistungVonKw: 200, leistungBisKw: 100 }).success,
    ).toBe(false);
  });

  it('wandelt Zahlen aus der Adresszeile um', () => {
    /*
     * Aus einer Adresszeile kommt immer eine Zeichenkette. Wird sie nicht
     * umgewandelt, scheitert die Pruefung still, die Suche faellt auf
     * "ungefiltert" zurueck und zeigt Treffer, die niemand gesucht hat --
     * an der Trefferliste ist das nicht zu erkennen. Genau das war der Fall.
     */
    const ergebnis = vehicleSearchInput.parse({
      leistungVonKw: '100',
      leistungBisKw: '200',
      baujahrVon: '2016',
      baujahrBis: '2022',
      seite: '3',
    });
    expect(ergebnis.leistungVonKw).toBe(100);
    expect(ergebnis.leistungBisKw).toBe(200);
    expect(ergebnis.baujahrVon).toBe(2016);
    expect(ergebnis.baujahrBis).toBe(2022);
    expect(ergebnis.seite).toBe(3);
  });

  it('lehnt unsinnige Jahresangaben aus der Adresszeile weiterhin ab', () => {
    expect(vehicleSearchInput.safeParse({ baujahrVon: '1700' }).success).toBe(false);
    expect(vehicleSearchInput.safeParse({ baujahrVon: 'zweitausend' }).success).toBe(false);
    // Als Zeichenketten verglichen waere "2010" groesser als "2009" -- als
    // Zahlen ist die Spanne umgekehrt und muss abgelehnt werden.
    expect(
      vehicleSearchInput.safeParse({ baujahrVon: '2020', baujahrBis: '2010' }).success,
    ).toBe(false);
  });

  it('erkennt, ob ueberhaupt gefiltert wird', () => {
    expect(hasActiveFilters(leer)).toBe(false);
    expect(hasActiveFilters(vehicleSearchInput.parse({ q: 'diesel' }))).toBe(true);
    expect(hasActiveFilters(vehicleSearchInput.parse({ antrieb: 'ALL' }))).toBe(true);
    // Sortierung und Seite allein sind kein Filter.
    expect(
      hasActiveFilters(vehicleSearchInput.parse({ sortierung: 'leistung-ab', seite: 4 })),
    ).toBe(false);
  });

  it('rechnet die Seitenzahl', () => {
    expect(pageCount(0)).toBe(1);
    expect(pageCount(1)).toBe(1);
    expect(pageCount(SEARCH_PAGE_SIZE)).toBe(1);
    expect(pageCount(SEARCH_PAGE_SIZE + 1)).toBe(2);
  });
});

describe('Adressen der Suche', () => {
  it('behaelt gesetzte Filter beim Sortierwechsel', () => {
    const eingabe = vehicleSearchInput.parse({ q: 'diesel', antrieb: 'ALL', seite: 3 });
    const adresse = buildSearchQuery(eingabe, { sortierung: 'leistung-ab' });
    expect(adresse).toContain('q=diesel');
    expect(adresse).toContain('antrieb=ALL');
    expect(adresse).toContain('sortierung=leistung-ab');
  });

  it('springt bei einem Filterwechsel auf die erste Seite zurueck', () => {
    // Sonst landet man auf Seite 7 einer Liste mit drei Seiten.
    const eingabe = vehicleSearchInput.parse({ q: 'diesel', seite: 7 });
    expect(buildSearchQuery(eingabe, { kraftstoff: 'DIESEL' })).not.toContain('seite=');
  });

  it('behaelt die Seite beim reinen Blaettern', () => {
    const eingabe = vehicleSearchInput.parse({ q: 'diesel' });
    expect(buildSearchQuery(eingabe, { seite: 2 })).toContain('seite=2');
  });

  it('nimmt einen entfernten Filter wieder heraus', () => {
    const eingabe = vehicleSearchInput.parse({ q: 'diesel', hersteller: 'muster' });
    expect(buildSearchQuery(eingabe, { hersteller: undefined })).not.toContain('hersteller');
  });

  it('haengt mehrere Werte desselben Filters an', () => {
    const eingabe = vehicleSearchInput.parse({ kraftstoff: ['DIESEL', 'ELECTRIC'] });
    const adresse = buildSearchQuery(eingabe);
    expect(adresse).toContain('kraftstoff=DIESEL');
    expect(adresse).toContain('kraftstoff=ELECTRIC');
  });

  it('laesst Vorgabewerte weg, damit die Adresse lesbar bleibt', () => {
    expect(buildSearchQuery(leer)).toBe('');
  });
});
