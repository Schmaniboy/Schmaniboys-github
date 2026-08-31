/**
 * Browserpruefung der Formulare -- Desktop und Telefon.
 *
 *   npm run pruefe:formulare [adresse]
 *
 * Prueft drei Dinge, die sich nur im echten Browser feststellen lassen und
 * die alle schon einmal falsch waren:
 *
 * 1. Hat jedes sichtbare Eingabefeld eine Beschriftung? (`<label for>`,
 *    umschliessendes `<label>` oder `aria-label` -- eines davon genuegt.)
 * 2. Ist die Schrift auf dem Telefon mindestens 16px? Safari auf dem iPhone
 *    zoomt sonst beim Hineintippen, und die Seite steht danach verschoben da.
 * 3. Ist das Feld hoch genug, um es mit dem Daumen zu treffen? Unter 40px
 *    wird das Zielen zur Geduldsprobe.
 *
 * Dazu die waagerechte Ueberbreite: Wenn eine Seite auf 390px breiter ist
 * als das Fenster, wackelt sie beim Wischen seitlich.
 *
 * Playwright ist keine Abhaengigkeit dieses Projekts -- die Pruefung ist
 * ergaenzend, nicht Teil von `npm test`. Fehlt Playwright, sagt das Skript
 * das und endet ohne Fehler.
 */

const BASIS = (process.argv[2] ?? 'http://127.0.0.1:3000').replace(/\/$/, '');

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  console.log('\nPlaywright ist nicht installiert — Browserprüfung übersprungen.');
  console.log('Nachrüsten mit:  npm i -D playwright && npx playwright install chromium\n');
  process.exit(0);
}

/** Oeffentliche Seiten mit Formularen. Angemeldete Bereiche deckt npm test ab. */
const SEITEN = [
  '/',
  '/katalog',
  '/suche',
  '/marktplatz',
  '/bewertung',
  '/anmelden',
  '/registrieren',
  '/passwort-vergessen',
];

const ANSICHTEN = [
  { name: 'Desktop', viewport: { width: 1280, height: 900 }, telefon: false },
  { name: 'Handy', viewport: { width: 390, height: 844 }, telefon: true },
];

/*
 * CHROMIUM_PFAD erlaubt es, einen bereits vorhandenen Browser zu benutzen --
 * in Bauumgebungen und Containern liegt oft schon einer, und dessen Version
 * passt selten zu der, die Playwright selbst herunterladen wuerde.
 * Ohne die Angabe nimmt Playwright seinen eigenen (npx playwright install).
 */
const chromiumPfad = process.env.CHROMIUM_PFAD;
const browser = await chromium.launch(chromiumPfad ? { executablePath: chromiumPfad } : {});
const befunde = [];

for (const ansicht of ANSICHTEN) {
  const kontext = await browser.newContext({ viewport: ansicht.viewport, deviceScaleFactor: 2 });
  const seite = await kontext.newPage();
  const konsolenfehler = [];
  seite.on('console', (m) => {
    if (m.type() === 'error') konsolenfehler.push(m.text());
  });

  console.log(`\n${ansicht.name} (${ansicht.viewport.width}px):`);

  for (const pfad of SEITEN) {
    let antwort;
    try {
      antwort = await seite.goto(`${BASIS}${pfad}`, { waitUntil: 'load', timeout: 20000 });
    } catch (fehler) {
      befunde.push(`${ansicht.name} ${pfad}: nicht erreichbar (${fehler.message.split('\n')[0]})`);
      continue;
    }
    if (antwort && antwort.status() >= 400) {
      befunde.push(`${ansicht.name} ${pfad}: Antwort ${antwort.status()}`);
      continue;
    }

    const ueberbreite = await seite.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );

    const felder = await seite.evaluate(() => {
      const raus = [];
      const auswahl = 'input:not([type=hidden]), select, textarea';
      for (const el of document.querySelectorAll(auswahl)) {
        const rechteck = el.getBoundingClientRect();
        if (rechteck.width === 0 && rechteck.height === 0) continue;
        const stil = getComputedStyle(el);
        const beschriftet =
          Boolean(el.getAttribute('aria-label')) ||
          Boolean(el.id && document.querySelector(`label[for="${CSS.escape(el.id)}"]`)) ||
          Boolean(el.closest('label'));
        raus.push({
          name: el.getAttribute('name') ?? el.id ?? el.tagName.toLowerCase(),
          typ: el.getAttribute('type') ?? el.tagName.toLowerCase(),
          beschriftet,
          schrift: parseFloat(stil.fontSize),
          hoehe: Math.round(rechteck.height),
        });
      }
      return raus;
    });

    for (const feld of felder) {
      if (!feld.beschriftet) {
        befunde.push(`${ansicht.name} ${pfad}: Feld „${feld.name}" ohne Beschriftung`);
      }
      // Ankreuz- und Auswahlkaestchen sind von Natur aus klein und loesen
      // keinen Zoom aus -- fuer sie gelten die beiden Groessenregeln nicht.
      if (!ansicht.telefon || feld.typ === 'checkbox' || feld.typ === 'radio') continue;
      if (feld.schrift < 16) {
        befunde.push(
          `${ansicht.name} ${pfad}: Feld „${feld.name}" hat ${feld.schrift}px — iOS zoomt beim Hineintippen`,
        );
      }
      if (feld.hoehe < 40) {
        befunde.push(`${ansicht.name} ${pfad}: Feld „${feld.name}" nur ${feld.hoehe}px hoch`);
      }
    }

    if (ueberbreite > 0) {
      befunde.push(`${ansicht.name} ${pfad}: waagerechte Überbreite ${ueberbreite}px`);
    }

    console.log(`  ${pfad.padEnd(24)} ${String(felder.length).padStart(2)} Felder`);
  }

  for (const fehler of konsolenfehler) {
    befunde.push(`${ansicht.name}: Konsolenfehler — ${fehler}`);
  }
  await kontext.close();
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
