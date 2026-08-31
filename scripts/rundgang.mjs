/**
 * Browserrundgang durch die angemeldeten Bereiche -- Desktop und Telefon.
 *
 *   npm run rundgang
 *
 * Der oeffentliche Teil steckt in `pruefe-formulare.mjs`. Hier geht es um
 * alles, was hinter der Anmeldung liegt und dort deshalb durchs Raster
 * faellt: Verkaufsablauf, Bewertung, Marktplatzfilter, Haendlerbereich,
 * Adminbereich.
 *
 * Jede Rolle bekommt ihre eigene Sitzung. Ohne die richtige Rolle laeuft
 * der Rundgang gegen eine Weiterleitung und meldete "nicht erreichbar",
 * obwohl alles in Ordnung ist -- ein Befund, der keiner waere.
 *
 * Geprueft wird ueberall dasselbe: Antwortet die Seite? Ist jedes sichtbare
 * Feld beschriftet? Taugen Schriftgroesse und Feldhoehe auf dem Telefon?
 * Wackelt die Seite seitlich? Bleibt die Konsole still?
 */
import { execFileSync } from 'node:child_process';

const BASIS = (process.env.PRUEF_BASIS ?? 'http://127.0.0.1:3000').replace(/\/$/, '');

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  console.log('\nPlaywright ist nicht installiert — Rundgang übersprungen.');
  console.log('Nachrüsten mit:  npm i -D playwright && npx playwright install chromium\n');
  process.exit(0);
}

/** Bereiche mit der Rolle, die sie sehen darf. */
const BEREICHE = [
  { name: 'Verkaufen', rolle: 'USER', pfade: ['/verkaufen', '/konto', '/konto/merkliste', '/konto/fahrzeuge', '/konto/guthaben', '/konto/nachrichten', '/konto/rechnungen'] },
  { name: 'Bewertung', rolle: 'USER', pfade: ['/bewertung'] },
  { name: 'Marktplatz', rolle: 'USER', pfade: ['/marktplatz', '/marktplatz?q=kombi&preisBis=20000'] },
  { name: 'Händler', rolle: 'DEALER_OWNER', pfade: ['/haendler', '/haendler/profil', '/haendler/bestand', '/haendler/mitarbeiter'] },
  { name: 'Verwaltung', rolle: 'SUPER_ADMIN', pfade: ['/admin', '/admin/katalog', '/admin/benutzer', '/admin/anzeigen', '/admin/protokoll', '/admin/datenqualitaet'] },
];

const ANSICHTEN = [
  { name: 'Desktop', viewport: { width: 1280, height: 900 }, telefon: false },
  { name: 'Handy', viewport: { width: 390, height: 844 }, telefon: true },
];

function sitzungFuer(rolle) {
  // stdout traegt nur das Cookie; alles Weitere geht nach stderr.
  return execFileSync('npx', ['tsx', 'scripts/pruefsitzung.ts', `--rolle=${rolle}`], {
    stdio: ['ignore', 'pipe', 'ignore'],
  })
    .toString()
    .trim();
}

const browser = await chromium.launch(
  process.env.CHROMIUM_PFAD ? { executablePath: process.env.CHROMIUM_PFAD } : {},
);
const befunde = [];

for (const bereich of BEREICHE) {
  const cookie = sitzungFuer(bereich.rolle);
  const [cookieName, cookieWert] = cookie.split('=');

  for (const ansicht of ANSICHTEN) {
    const kontext = await browser.newContext({
      viewport: ansicht.viewport,
      deviceScaleFactor: 2,
    });
    await kontext.addCookies([
      {
        name: cookieName,
        value: cookieWert,
        domain: new URL(BASIS).hostname,
        path: '/',
        httpOnly: true,
        sameSite: 'Lax',
      },
    ]);
    const seite = await kontext.newPage();
    const konsole = [];
    seite.on('console', (m) => {
      if (m.type() === 'error') konsole.push(m.text());
    });

    console.log(`\n${bereich.name} · ${ansicht.name} (${bereich.rolle}):`);

    for (const pfad of bereich.pfade) {
      const kennung = `${bereich.name} ${ansicht.name} ${pfad}`;
      let antwort;
      try {
        /*
         * `load` und nicht `networkidle`: Letzteres wartet auf 500 ms ohne
         * offene Verbindung. Manche Seiten erreichen das nie, obwohl sie
         * vollstaendig geladen sind und keine Anfrage wiederholen -- der
         * Rundgang meldete dann einen Zeitablauf, wo nichts kaputt war.
         * Ein Befund, der keiner ist, ist schlimmer als kein Befund.
         */
        antwort = await seite.goto(`${BASIS}${pfad}`, {
          waitUntil: 'load',
          timeout: 25000,
        });
        // Kurz nachlaufen lassen, damit React fertig einhaengt.
        await seite.waitForTimeout(300);
      } catch (fehler) {
        befunde.push(`${kennung}: nicht erreichbar (${fehler.message.split('\n')[0]})`);
        console.log(`  FEHL  ${pfad}`);
        continue;
      }

      const status = antwort?.status() ?? 0;
      /*
       * Eine Weiterleitung zur Anmeldung heisst: Die Rolle reicht nicht.
       * Das ist ein Befund und keine Nebensache -- der Bereich waere fuer
       * den echten Nutzer genauso zu.
       */
      if (seite.url().includes('/anmelden')) {
        befunde.push(`${kennung}: zur Anmeldung weitergeleitet (Rolle ${bereich.rolle} reicht nicht)`);
        console.log(`  FEHL  ${pfad} → /anmelden`);
        continue;
      }
      if (status >= 400) {
        befunde.push(`${kennung}: Antwort ${status}`);
        console.log(`  FEHL  ${pfad} → ${status}`);
        continue;
      }

      const messwerte = await seite.evaluate(() => {
        const felder = [];
        for (const el of document.querySelectorAll(
          'input:not([type=hidden]), select, textarea',
        )) {
          const rechteck = el.getBoundingClientRect();
          if (rechteck.width === 0 && rechteck.height === 0) continue;
          felder.push({
            name: el.getAttribute('name') ?? el.id ?? el.tagName.toLowerCase(),
            typ: el.getAttribute('type') ?? el.tagName.toLowerCase(),
            beschriftet:
              Boolean(el.getAttribute('aria-label')) ||
              Boolean(el.id && document.querySelector(`label[for="${CSS.escape(el.id)}"]`)) ||
              Boolean(el.closest('label')),
            schrift: parseFloat(getComputedStyle(el).fontSize),
            hoehe: Math.round(rechteck.height),
          });
        }
        return {
          felder,
          ueberbreite:
            document.documentElement.scrollWidth - document.documentElement.clientWidth,
        };
      });

      for (const feld of messwerte.felder) {
        if (!feld.beschriftet) befunde.push(`${kennung}: Feld „${feld.name}" ohne Beschriftung`);
        if (!ansicht.telefon || feld.typ === 'checkbox' || feld.typ === 'radio') continue;
        if (feld.schrift < 16)
          befunde.push(`${kennung}: Feld „${feld.name}" hat ${feld.schrift}px — iOS zoomt`);
        if (feld.hoehe < 40)
          befunde.push(`${kennung}: Feld „${feld.name}" nur ${feld.hoehe}px hoch`);
      }
      if (messwerte.ueberbreite > 0)
        befunde.push(`${kennung}: waagerechte Überbreite ${messwerte.ueberbreite}px`);

      console.log(`   ok   ${pfad.padEnd(34)} ${String(messwerte.felder.length).padStart(2)} Felder`);
    }

    for (const fehler of konsole) befunde.push(`${bereich.name} ${ansicht.name}: Konsolenfehler — ${fehler}`);
    await kontext.close();
  }
}

await browser.close();

console.log('');
if (befunde.length === 0) {
  console.log('Alles in Ordnung.\n');
} else {
  for (const befund of befunde) console.log(`  FEHL  ${befund}`);
  console.log(`\n${befunde.length} Befunde.\n`);
  process.exit(1);
}
