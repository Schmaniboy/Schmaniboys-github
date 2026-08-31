import { beforeAll, describe, expect, it } from 'vitest';

import { eigeneAdresse } from './helpers/adresse';
import { benutzerMitSitzung } from './helpers/session';

/**
 * Der Datenbank-Ausbau am laufenden Server.
 *
 * Geprueft wird nicht, ob die Seiten schoen aussehen, sondern ob sie die
 * Zusagen einhalten, die diese Plattform macht: keine Quote ohne belegte
 * Gesamtzahl, kein Bild ohne passende Zuordnung, kein fremdes Fahrzeug ueber
 * die Schnittstelle.
 */

const BASE_URL = process.env.SMOKE_BASE_URL ?? 'http://127.0.0.1:3000';

const reachable = await fetch(`${BASE_URL}/api/health`, { signal: AbortSignal.timeout(2000) })
  .then((r) => r.ok)
  .catch(() => false);

const suite = reachable ? describe : describe.skip;

const marker = `ab${Date.now().toString(36)}`;

async function html(pfad: string): Promise<string> {
  const antwort = await fetch(`${BASE_URL}${pfad}`);
  expect(antwort.status, `${pfad} sollte erreichbar sein`).toBe(200);
  return antwort.text();
}

suite('Datenbestand', () => {
  it('nennt die erfasste Anzahl und behauptet keine Vollstaendigkeit', async () => {
    const seite = await html('/katalog/datenbestand');

    expect(seite).toContain('Gesamtzahl nicht belegt');
    // Der Satz, der auf keiner Seite dieser Plattform stehen darf.
    expect(seite).not.toContain('alle Motoren');
    expect(seite).not.toContain('vollständige Datenbank');
  });

  it('weist Eintraege ohne Quelle aus, statt sie zu verschweigen', async () => {
    const seite = await html('/katalog/datenbestand');
    expect(seite).toContain('ohne jede Quelle');
  });
});

suite('Fahrzeugvergleich', () => {
  it('faellt bei erfundenen Kennungen nicht um', async () => {
    const seite = await html('/katalog/vergleich?v=gibtesnicht,auchnicht');
    expect(seite).toContain('gibt es nicht');
  });

  it('fuehrt ohne Auswahl zur Suche statt in eine Fehlerseite', async () => {
    const seite = await html('/katalog/vergleich');
    expect(seite).toContain('Noch nichts ausgewählt');
  });
});

suite('HSN/TSN', () => {
  it('lehnt unvollstaendige Nummern mit Erklaerung ab', async () => {
    const seite = await html('/katalog/hsn-tsn?hsn=12&tsn=A');
    expect(seite).toContain('vier Ziffern');
  });

  it('erfindet zu einer unbekannten Kombination nichts', async () => {
    const seite = await html('/katalog/hsn-tsn?hsn=9999&tsn=ZZZ');
    expect(seite).toContain('ist hier nichts erfasst');
    expect(seite).toContain('heißt nicht, dass es die Kombination nicht gibt');
  });

  it('bettet Eingaben nicht ungeprueft ein', async () => {
    const antwort = await fetch(
      `${BASE_URL}/katalog/hsn-tsn?hsn=${encodeURIComponent('<script>alert(1)</script>')}&tsn=AAA`,
    );
    const seite = await antwort.text();
    expect(seite).not.toContain('<script>alert(1)</script>');
  });
});

suite('Smart-Suche', () => {
  it('erklaert, wie sie einen Motorcode gelesen hat', async () => {
    const seite = await html('/suche?q=DBKA');
    expect(seite).toContain('Verstanden als');
    expect(seite).toContain('Motorcode');
  });

  it('haelt ein gewoehnliches Wort NICHT fuer einen Motorcode', async () => {
    /*
     * Der Fehler, der beim Testen auffiel: "kombi" erfuellt dieselbe Form
     * wie "DBKA" und wurde als Motorcode gelesen. Das Ergebnis war die
     * sichtbare Zeile "Verstanden als: Motorcode KOMBI".
     */
    const seite = await html('/suche?q=kombi+mit+anhaengerkupplung');
    expect(seite).not.toContain('Motorcode KOMBI');
  });

  it('liest Baureihe, Leistung und Baujahr auseinander', async () => {
    const seite = await html('/suche?q=BMW+320d+G20+190+PS+2019');
    expect(seite).toContain('Baureihe G20');
    expect(seite).toContain('190 PS');
    expect(seite).toContain('Baujahr 2019');
  });
});

suite('Bildzuordnung', () => {
  it('schreibt bei fehlendem Bild den vorgeschriebenen Satz', async () => {
    const seite = await html(
      '/katalog/musterfahrzeug-demodaten/muster-300/zweite-generation',
    );
    expect(seite).toContain('Kein verifiziertes Bild verfügbar.');
  });
});

suite('Mobile Navigation', () => {
  it('liefert die Hauptnavigation auch fuer schmale Geraete aus', async () => {
    /*
     * Anlass: Die Navigation war unterhalb der mittleren Breite ausgeblendet
     * und es gab keinen Ersatz -- auf dem Telefon war ausser dem Logo kein
     * Weg in den Katalog.
     */
    const seite = await html('/');
    expect(seite).toContain('aria-controls="mobile-navigation"');
    expect(seite).toContain('Menü öffnen');
  });
});

suite('Eigene Fahrzeuge', () => {
  const ids: { cookie?: string; fahrzeug?: string } = {};

  beforeAll(async () => {
    const sitzung = await benutzerMitSitzung({
      email: `${marker}@example.test`,
      displayName: `Ausbau ${marker}`,
      role: 'USER',
    });
    ids.cookie = sitzung.cookie;
  });

  it('verlangt eine Anmeldung', async () => {
    for (const pfad of ['/api/konto/fahrzeuge', '/api/konto/merkzettel']) {
      const antwort = await fetch(`${BASE_URL}${pfad}`);
      expect(antwort.status, pfad).toBe(401);
    }
  });

  it('legt ein Fahrzeug mit nur einer Bezeichnung an', async () => {
    const antwort = await fetch(`${BASE_URL}/api/konto/fahrzeuge`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', cookie: ids.cookie as string },
      body: JSON.stringify({ label: `Testwagen ${marker}` }),
    });
    expect(antwort.status).toBe(201);

    const daten = (await antwort.json()) as { data: { fahrzeug: { id: string } } };
    ids.fahrzeug = daten.data.fahrzeug.id;
    expect(ids.fahrzeug).toBeTruthy();
  });

  it('lehnt eine unsinnige Fahrgestellnummer ab', async () => {
    const antwort = await fetch(`${BASE_URL}/api/konto/fahrzeuge`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', cookie: ids.cookie as string },
      body: JSON.stringify({ label: 'Mit VIN', vin: 'IOQ123' }),
    });
    expect(antwort.status).toBe(400);
  });

  it('nimmt ein leeres VIN-Feld als "nicht angegeben"', async () => {
    // Ein Pflichtfeld, das keines ist, darf am leeren Wert nicht scheitern.
    const antwort = await fetch(`${BASE_URL}/api/konto/fahrzeuge`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', cookie: ids.cookie as string },
      body: JSON.stringify({ label: `Ohne VIN ${marker}`, vin: '' }),
    });
    expect(antwort.status).toBe(201);
  });

  it('meldet ein fremdes Fahrzeug als NICHT GEFUNDEN, nicht als verboten', async () => {
    const fremd = await benutzerMitSitzung({
      email: `${marker}b@example.test`,
      displayName: `Fremd ${marker}`,
      role: 'USER',
    });

    const antwort = await fetch(`${BASE_URL}/api/konto/fahrzeuge/${ids.fahrzeug}`, {
      headers: { cookie: fremd.cookie },
    });
    // 403 bestaetigte, dass es das Fahrzeug gibt -- und liesse sich durch
    // Kennungen blaettern.
    expect(antwort.status).toBe(404);
  });

  it('loescht nur das eigene Fahrzeug', async () => {
    const antwort = await fetch(`${BASE_URL}/api/konto/fahrzeuge/${ids.fahrzeug}`, {
      method: 'DELETE',
      headers: { cookie: ids.cookie as string },
    });
    expect(antwort.status).toBe(204);
  });
});

suite('Filter und Vergleichsauswahl', () => {
  it('nimmt Abgasnorm und Baureihe als eigene Filter an', async () => {
    for (const pfad of ['/suche?abgasnorm=Euro+6', '/suche?baureihe=G20']) {
      const antwort = await fetch(`${BASE_URL}${pfad}`);
      expect(antwort.status, pfad).toBe(200);
      const seite = await antwort.text();
      expect(seite, pfad).toContain('Filter zurücksetzen');
    }
  });

  it('fuehrt aus der Suche in den Vergleich', async () => {
    /*
     * Die Vergleichsseite verspricht "Fahrzeuge werden aus der Suche
     * uebernommen". Ohne diesen Weg waere das eine Sackgasse.
     */
    const suche = await html('/suche');
    const treffer = /href="\/suche\?v=([a-z0-9]+)"/.exec(suche);
    if (!treffer) {
      // Ohne veroeffentlichte Motorvarianten gibt es nichts auszuwaehlen.
      expect(suche).toContain('Der Katalog ist noch leer');
      return;
    }

    const id = treffer[1] as string;
    const mitAuswahl = await html(`/suche?v=${id}`);
    expect(mitAuswahl).toContain('für den Vergleich ausgewählt');
    expect(mitAuswahl).toContain(`/katalog/vergleich?v=${id}`);

    const vergleich = await html(`/katalog/vergleich?v=${id}`);
    expect(vergleich).toContain('Technische Daten');
  });
});

suite('Passwort zuruecksetzen und E-Mail bestaetigen', () => {
  it('antwortet auf eine unbekannte Adresse genauso wie auf eine bekannte', async () => {
    /*
     * Der Kern des Schutzes. Ein Unterschied -- im Statuscode, im Text oder
     * in der Antwortzeit -- waere eine Auskunft darueber, wer hier ein Konto
     * hat. Damit liesse sich eine Adressliste durchprobieren.
     */
    const bekannteAdresse = `${marker}pw@example.test`;
    await benutzerMitSitzung({
      email: bekannteAdresse,
      displayName: `Passwort ${marker}`,
      role: 'USER',
    });

    const antworten = await Promise.all(
      [bekannteAdresse, `gibtesnicht-${marker}@example.test`].map(
        async (adresse) => {
          const antwort = await fetch(`${BASE_URL}/api/auth/passwort-vergessen`, {
            method: 'POST',
            headers: eigeneAdresse({ 'content-type': 'application/json' }),
            body: JSON.stringify({ email: adresse }),
          });
          const daten = (await antwort.json()) as { data?: { message?: string } };
          return { status: antwort.status, message: daten.data?.message };
        },
      ),
    );

    expect(antworten[0]?.status).toBe(antworten[1]?.status);
    expect(antworten[0]?.message).toBe(antworten[1]?.message);
    expect(antworten[0]?.message).toContain('Wenn zu dieser Adresse ein Konto besteht');
  });

  it('lehnt einen erfundenen Zuruecksetzcode ab', async () => {
    const antwort = await fetch(`${BASE_URL}/api/auth/passwort-neu`, {
      method: 'POST',
      headers: eigeneAdresse({ 'content-type': 'application/json' }),
      body: JSON.stringify({ token: 'ausgedacht', passwort: 'einLangesPasswort123' }),
    });
    expect(antwort.status).toBe(400);
  });

  it('lehnt einen erfundenen Bestaetigungscode ab', async () => {
    const antwort = await fetch(`${BASE_URL}/api/auth/email-bestaetigen`, {
      method: 'POST',
      headers: eigeneAdresse({ 'content-type': 'application/json' }),
      body: JSON.stringify({ token: 'ausgedacht' }),
    });
    expect(antwort.status).toBe(400);
  });

  it('liefert die Seiten aus und verlinkt sie von der Anmeldung', async () => {
    for (const pfad of ['/passwort-vergessen', '/passwort-neu', '/email-bestaetigen']) {
      const antwort = await fetch(`${BASE_URL}${pfad}`);
      expect(antwort.status, pfad).toBe(200);
    }

    const anmeldung = await html('/anmelden');
    expect(anmeldung).toContain('/passwort-vergessen');
  });
});

suite('Merkzettel', () => {
  it('merkt einen Katalogeintrag, zeigt ihn an und nimmt ihn wieder heraus', async () => {
    const sitzung = await benutzerMitSitzung({
      email: `${marker}mz@example.test`,
      displayName: `Merk ${marker}`,
      role: 'USER',
    });

    // Ein veroeffentlichter Eintrag aus dem Demobestand.
    const suche = await html('/suche');
    const treffer = /href="\/suche\?v=([a-z0-9]+)"/.exec(suche);
    if (!treffer) {
      expect(suche).toContain('Der Katalog ist noch leer');
      return;
    }
    const id = treffer[1] as string;

    const merken = async () =>
      fetch(`${BASE_URL}/api/konto/merkzettel`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', cookie: sitzung.cookie },
        body: JSON.stringify({ subjectType: 'PowertrainCombination', subjectId: id }),
      }).then((antwort) => antwort.json() as Promise<{ data?: { gemerkt?: boolean } }>);

    expect((await merken()).data?.gemerkt).toBe(true);

    const liste = await fetch(`${BASE_URL}/api/konto/merkzettel`, {
      headers: { cookie: sitzung.cookie },
    }).then((antwort) => antwort.json() as Promise<{ data?: { eintraege?: unknown[] } }>);
    expect(liste.data?.eintraege).toHaveLength(1);

    // Derselbe Aufruf schaltet wieder ab -- ein Knopf, ein Endpunkt.
    expect((await merken()).data?.gemerkt).toBe(false);
  });

  it('lehnt eine erfundene Art ab', async () => {
    const sitzung = await benutzerMitSitzung({
      email: `${marker}mz2@example.test`,
      displayName: `Merk2 ${marker}`,
      role: 'USER',
    });

    const antwort = await fetch(`${BASE_URL}/api/konto/merkzettel`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', cookie: sitzung.cookie },
      body: JSON.stringify({ subjectType: 'Rechnung', subjectId: 'x' }),
    });
    expect(antwort.status).toBe(400);
  });
});

suite('Redaktionsarbeitsplatz', () => {
  it('bleibt fuer Unberechtigte unsichtbar -- 404, nicht 403', async () => {
    /*
     * Dass es einen Verwaltungsbereich gibt, muss niemand erfahren, der ihn
     * nicht betreten darf. Ein 403 bestaetigte seine Existenz.
     */
    const ohneRechte = await benutzerMitSitzung({
      email: `${marker}ohne@example.test`,
      displayName: `Ohne ${marker}`,
      role: 'USER',
    });

    for (const pfad of ['/admin/katalog', '/admin/datenqualitaet']) {
      const antwort = await fetch(`${BASE_URL}${pfad}`, {
        headers: { cookie: ohneRechte.cookie },
      });
      expect(antwort.status, pfad).toBe(404);
    }
  });

  it('zeigt der Redaktion die Arbeitsliste mit Quellenzahl', async () => {
    const redaktion = await benutzerMitSitzung({
      email: `${marker}red@example.test`,
      displayName: `Redaktion ${marker}`,
      role: 'EDITOR',
    });

    const antwort = await fetch(`${BASE_URL}/admin/katalog?status=PUBLISHED`, {
      headers: { cookie: redaktion.cookie },
    });
    expect(antwort.status).toBe(200);

    const seite = await antwort.text();
    expect(seite).toContain('Katalog verwalten');
    expect(seite).toContain('Veröffentlicht');
  });

  it('faellt bei einem erfundenen Status auf die Pruefliste zurueck', async () => {
    const redaktion = await benutzerMitSitzung({
      email: `${marker}red2@example.test`,
      displayName: `Redaktion2 ${marker}`,
      role: 'EDITOR',
    });

    // Eine unsinnige Adresse fuehrt nicht zu einem Fehler -- Adressen werden
    // geteilt und veraendert.
    const antwort = await fetch(`${BASE_URL}/admin/katalog?status=ausgedacht`, {
      headers: { cookie: redaktion.cookie },
    });
    expect(antwort.status).toBe(200);
  });
});
