import { describe, expect, it } from 'vitest';

import { AppError } from '../errors';

import {
  istGeoeffnet,
  minutenZuUhrzeit,
  nachWochentagen,
  pruefeZeitspannen,
  uhrzeitZuMinuten,
} from './opening-hours';
import { baueStatistik, formatiereKennzahl, tageZwischen } from './statistics';
import { dealerProfileInput } from './schemas';

function fehlerText(aktion: () => unknown): string {
  try {
    aktion();
    return 'kein Fehler';
  } catch (error) {
    return error instanceof AppError ? JSON.stringify(error.issues ?? {}) : 'falscher Fehlertyp';
  }
}

describe('Oeffnungszeiten', () => {
  it('rechnet zwischen Uhrzeit und Minuten hin und her', () => {
    expect(uhrzeitZuMinuten('08:30')).toBe(510);
    expect(uhrzeitZuMinuten('00:00')).toBe(0);
    expect(minutenZuUhrzeit(510)).toBe('08:30');
    expect(minutenZuUhrzeit(0)).toBe('00:00');
  });

  it('lehnt ab, was keine Uhrzeit ist', () => {
    for (const eingabe of ['24:00', '08:60', 'acht', '8', '', '08:3']) {
      expect(uhrzeitZuMinuten(eingabe)).toBeNull();
    }
  });

  it('nimmt eine Mittagspause an', () => {
    // Zwei Zeitfenster am selben Tag sind der Normalfall, kein Fehler.
    expect(
      fehlerText(() =>
        pruefeZeitspannen([
          { weekday: 2, opensMinute: 480, closesMinute: 720 },
          { weekday: 2, opensMinute: 780, closesMinute: 1080 },
        ]),
      ),
    ).toBe('kein Fehler');
  });

  it('erkennt Ueberschneidungen am selben Tag', () => {
    const text = fehlerText(() =>
      pruefeZeitspannen([
        { weekday: 2, opensMinute: 480, closesMinute: 1080 },
        { weekday: 2, opensMinute: 720, closesMinute: 840 },
      ]),
    );
    expect(text).toContain('überschneiden');
  });

  it('lehnt eine Schliesszeit vor der Oeffnungszeit ab', () => {
    const text = fehlerText(() =>
      pruefeZeitspannen([{ weekday: 3, opensMinute: 1080, closesMinute: 480 }]),
    );
    expect(text).toContain('nach der Öffnungszeit');
  });

  it('nennt geschlossene Tage ausdruecklich', () => {
    // Einen Tag wegzulassen liesse offen, ob geschlossen ist oder nur nichts
    // eingetragen wurde.
    const tage = nachWochentagen([{ weekday: 1, opensMinute: 480, closesMinute: 1080 }]);
    expect(tage).toHaveLength(7);
    expect(tage[0]?.geschlossen).toBe(false);
    expect(tage[0]?.spannen).toEqual([{ von: '08:00', bis: '18:00' }]);
    expect(tage[6]?.geschlossen).toBe(true);
  });

  it('beantwortet "jetzt geoeffnet" nach ISO-Wochentagen', () => {
    const spannen = [{ weekday: 1, opensMinute: 480, closesMinute: 1080 }];
    // 2026-08-24 ist ein Montag.
    expect(istGeoeffnet(spannen, new Date(2026, 7, 24, 10, 0))).toBe(true);
    expect(istGeoeffnet(spannen, new Date(2026, 7, 24, 7, 59))).toBe(false);
    expect(istGeoeffnet(spannen, new Date(2026, 7, 24, 18, 0))).toBe(false);
    // Sonntag ist 7, nicht 0 -- der haeufigste Rechenfehler an dieser Stelle.
    expect(istGeoeffnet([{ weekday: 7, opensMinute: 600, closesMinute: 720 }],
      new Date(2026, 7, 23, 11, 0))).toBe(true);
  });
});

describe('Haendlerstatistik', () => {
  const leer = {
    bestand: { entwuerfe: 0, aktiv: 0, pausiert: 0, verkauft: 0, abgelaufen: 0 },
    standzeit: { abgeschlosseneTage: [], laufendeTage: [] },
    aufrufe: 0,
    verbrauchteTokens: 0,
    kiTexte: 0,
    bewertungen: 0,
  };

  it('gibt Anfragen NICHT als Null aus', () => {
    /*
     * Der wichtigste Test dieser Datei. Eine Null liest sich als "niemand hat
     * sich gemeldet" -- tatsaechlich gibt es die Nachrichten noch gar nicht.
     */
    const anfragen = baueStatistik(leer).find((k) => k.id === 'anfragen');
    expect(anfragen?.zustand).toBe('NICHT_VERFUEGBAR');
    expect(anfragen?.wert).toBeNull();
    expect(anfragen?.hinweis).toContain('keine Null');
    expect(formatiereKennzahl(anfragen!)).toBe('—');
  });

  it('meldet eine fehlende Standzeit als fehlend, nicht als Null', () => {
    const standzeit = baueStatistik(leer).find((k) => k.id === 'standzeit-verkauft');
    expect(standzeit?.zustand).toBe('NICHT_VERFUEGBAR');
    expect(standzeit?.hinweis).toContain('geschätzt wird sie nicht');
  });

  it('nimmt den Median, nicht den Mittelwert', () => {
    // Ein Fahrzeug, das zwei Jahre steht, verschoebe einen Mittelwert so
    // weit, dass die Zahl nichts mehr ueber den Normalfall sagt.
    const ergebnis = baueStatistik({
      ...leer,
      standzeit: { abgeschlosseneTage: [10, 12, 14, 700], laufendeTage: [] },
    });
    const standzeit = ergebnis.find((k) => k.id === 'standzeit-verkauft');
    expect(standzeit?.wert).toBe(13);
  });

  it('zaehlt den Bestand ueber alle Zustaende', () => {
    const ergebnis = baueStatistik({
      ...leer,
      bestand: { entwuerfe: 2, aktiv: 5, pausiert: 1, verkauft: 3, abgelaufen: 1 },
    });
    expect(ergebnis.find((k) => k.id === 'bestand')?.wert).toBe(12);
    expect(ergebnis.find((k) => k.id === 'aktiv')?.wert).toBe(5);
  });

  it('rechnet Tage zwischen zwei Zeitpunkten', () => {
    const von = new Date('2026-08-01T12:00:00Z');
    expect(tageZwischen(von, new Date('2026-08-11T12:00:00Z'))).toBe(10);
    // Rueckwaerts gibt es keine negativen Standzeiten.
    expect(tageZwischen(new Date('2026-08-11T12:00:00Z'), von)).toBe(0);
  });
});

describe('Haendlerprofil', () => {
  const gueltig = { name: 'Autohaus Muster' };

  it('nimmt ein Profil mit nur einem Namen an', () => {
    expect(dealerProfileInput.safeParse(gueltig).success).toBe(true);
  });

  it('behandelt leere Felder als nicht gesetzt', () => {
    // Ein Formular sendet leere Felder mit. Sie duerfen nicht an der
    // E-Mail- oder URL-Pruefung scheitern.
    const ergebnis = dealerProfileInput.safeParse({
      ...gueltig,
      contactEmail: '',
      websiteUrl: '',
      postalCode: '',
      vatId: '',
    });
    expect(ergebnis.success).toBe(true);
    if (ergebnis.success) {
      expect(ergebnis.data.contactEmail).toBeNull();
      expect(ergebnis.data.websiteUrl).toBeNull();
    }
  });

  it('lehnt eine unvollstaendige Adresse ab, wenn sie angegeben wird', () => {
    expect(dealerProfileInput.safeParse({ ...gueltig, postalCode: '101' }).success).toBe(false);
    expect(dealerProfileInput.safeParse({ ...gueltig, websiteUrl: 'autohaus.de' }).success).toBe(
      false,
    );
  });

  it('prueft die Form der USt-IdNr., nicht ihre Gueltigkeit', () => {
    expect(dealerProfileInput.safeParse({ ...gueltig, vatId: 'DE123456789' }).success).toBe(true);
    expect(dealerProfileInput.safeParse({ ...gueltig, vatId: '123456789' }).success).toBe(false);
  });
});
