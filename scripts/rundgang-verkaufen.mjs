/**
 * Browserdurchlauf durch den Verkaufsablauf -- Desktop und Telefon.
 *
 *   npm run rundgang:verkaufen
 *
 * Geht den Weg, den ein Verkaeufer tatsaechlich geht: anmelden, VIN
 * eingeben, Entwurf oeffnen, Fahrzeugangaben erfassen, Vorschau ansehen.
 * Die Fachlogik dahinter pruefen die Live-Tests; hier geht es um das, was
 * nur im Browser auffaellt -- ob die Schaltflaechen erreichbar sind, ob die
 * Seite auf 390px nicht seitlich wackelt, ob die Konsole still bleibt.
 *
 * Braucht eine laufende Anwendung und eine Sitzung. Die Sitzung wird
 * vorher mit `scripts/pruefsitzung.ts` erzeugt und als PRUEF_COOKIE
 * uebergeben -- ueber die Anmeldemaske zu gehen wuerde nur die
 * Ratenbegrenzung belasten, die dafuer nicht gedacht ist.
 */

const BASIS = (process.env.PRUEF_BASIS ?? 'http://127.0.0.1:3000').replace(/\/$/, '');
const COOKIE = process.env.PRUEF_COOKIE;

if (!COOKIE) {
  console.error('\nPRUEF_COOKIE fehlt. Erzeugen mit:');
  console.error('  export PRUEF_COOKIE=$(npx tsx scripts/pruefsitzung.ts)\n');
  process.exit(1);
}

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  console.log('\nPlaywright ist nicht installiert — Durchlauf übersprungen.\n');
  process.exit(0);
}

const chromiumPfad = process.env.CHROMIUM_PFAD;
const browser = await chromium.launch(chromiumPfad ? { executablePath: chromiumPfad } : {});
const befunde = [];

const [name, wert] = COOKIE.split('=');

async function durchlauf(ansicht, viewport) {
  const kontext = await browser.newContext({ viewport, deviceScaleFactor: 2 });
  await kontext.addCookies([
    { name, value: wert, domain: '127.0.0.1', path: '/', httpOnly: true, sameSite: 'Lax' },
  ]);
  const seite = await kontext.newPage();
  const konsole = [];
  seite.on('console', (m) => {
    if (m.type() === 'error') konsole.push(m.text());
  });

  const melde = (ok, text) => {
    console.log(`  ${ok ? ' ok ' : 'FEHL'}  ${text}`);
    if (!ok) befunde.push(`${ansicht}: ${text}`);
  };

  async function ueberbreite(pfad) {
    const wert = await seite.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    if (wert > 0) befunde.push(`${ansicht} ${pfad}: waagerechte Überbreite ${wert}px`);
    return wert;
  }

  console.log(`\n${ansicht} (${viewport.width}px):`);

  // 1. Verkaufsuebersicht -- erreichbar nur angemeldet.
  const uebersicht = await seite.goto(`${BASIS}/verkaufen`, { waitUntil: 'load' });
  melde(uebersicht?.status() === 200, `/verkaufen antwortet (${uebersicht?.status()})`);
  melde(
    !seite.url().includes('/anmelden'),
    'Sitzung wird angenommen (keine Weiterleitung zur Anmeldung)',
  );
  await ueberbreite('/verkaufen');

  // 2. VIN eingeben. Eine VIN mit gueltiger Pruefziffer, sonst weist das
  //    Formular zu Recht ab -- geprueft wird der Weg, nicht die Ablehnung.
  const vinFeld = seite.locator('input[name="vin"]').first();
  melde(await vinFeld.isVisible(), 'VIN-Feld ist sichtbar');
  await vinFeld.fill('WBA3A5C55DF123456');

  const absenden = seite.locator('form button[type="submit"]').first();
  melde(await absenden.isEnabled(), 'Schaltfläche zum Anlegen ist bedienbar');

  const kasten = await absenden.boundingBox();
  if (viewport.width < 500 && kasten) {
    melde(kasten.height >= 40, `Schaltfläche ist ${Math.round(kasten.height)}px hoch (Daumen)`);
  }

  /*
   * Das Formular sendet ueber fetch und leitet danach selbst weiter. Auf die
   * Zieladresse warten, nicht auf irgendeine Navigation -- ein Muster, das
   * auch die Ausgangsseite trifft, ist sofort erfuellt und prueft nichts.
   */
  await absenden.click();
  await seite
    .waitForURL(/\/verkaufen\/entwurf\/[^/]+$/, { timeout: 15000 })
    .catch(() => null);
  await seite.waitForLoadState('networkidle');

  const aufEntwurf = /\/verkaufen\/entwurf\//.test(seite.url());
  melde(aufEntwurf, `Entwurf angelegt und geöffnet (${seite.url().replace(BASIS, '')})`);

  if (aufEntwurf) {
    await ueberbreite('/verkaufen/entwurf');

    const text = await seite.locator('body').innerText();
    // Aus einer VIN laesst sich ohne Herstellerdaten nur der Hersteller
    // ablesen. Steht dort ein Modell, hat jemand geraten.
    melde(
      /nicht (belegbar|bekannt)|nur der Hersteller|Kandidat/i.test(text),
      'Entwurf sagt, was aus der VIN NICHT ableitbar ist',
    );

    /*
     * Dieselben Feldregeln wie in pruefe-formulare.mjs -- die Entwurfsseite
     * ist nur angemeldet erreichbar und faellt dort deshalb durch das
     * Raster. Sie traegt aber das laengste Formular der ganzen Anwendung.
     */
    const felder = await seite.evaluate(() => {
      const raus = [];
      for (const el of document.querySelectorAll(
        'input:not([type=hidden]), select, textarea',
      )) {
        const rechteck = el.getBoundingClientRect();
        if (rechteck.width === 0 && rechteck.height === 0) continue;
        const stil = getComputedStyle(el);
        raus.push({
          name: el.getAttribute('name') ?? el.id ?? el.tagName.toLowerCase(),
          typ: el.getAttribute('type') ?? el.tagName.toLowerCase(),
          beschriftet:
            Boolean(el.getAttribute('aria-label')) ||
            Boolean(el.id && document.querySelector(`label[for="${CSS.escape(el.id)}"]`)) ||
            Boolean(el.closest('label')),
          schrift: parseFloat(stil.fontSize),
          hoehe: Math.round(rechteck.height),
        });
      }
      return raus;
    });

    melde(felder.length > 0, `${felder.length} Eingabefelder für die Fahrzeugangaben`);

    const ohneBeschriftung = felder.filter((f) => !f.beschriftet).map((f) => f.name);
    melde(ohneBeschriftung.length === 0, `alle Felder beschriftet${
      ohneBeschriftung.length ? ` (ohne: ${ohneBeschriftung.join(', ')})` : ''
    }`);

    if (viewport.width < 500) {
      const zuKlein = felder.filter(
        (f) => f.typ !== 'checkbox' && f.typ !== 'radio' && (f.schrift < 16 || f.hoehe < 40),
      );
      melde(
        zuKlein.length === 0,
        `Feldgrößen taugen für den Daumen${
          zuKlein.length
            ? ` (zu klein: ${zuKlein.map((f) => `${f.name} ${f.schrift}px/${f.hoehe}px`).join(', ')})`
            : ''
        }`,
      );
    }
  }

  for (const fehler of konsole) befunde.push(`${ansicht}: Konsolenfehler — ${fehler}`);
  await kontext.close();
}

console.log('\nRundgang: Fahrzeug verkaufen');
await durchlauf('Desktop', { width: 1280, height: 900 });
await durchlauf('Handy', { width: 390, height: 844 });
await browser.close();

console.log('');
if (befunde.length === 0) {
  console.log('Alles in Ordnung.\n');
} else {
  for (const befund of befunde) console.log(`  FEHL  ${befund}`);
  console.log(`\n${befunde.length} Befunde.\n`);
  process.exit(1);
}
