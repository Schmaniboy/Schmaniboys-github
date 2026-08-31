/**
 * Ein Deployment abklopfen.
 *
 *   npx tsx scripts/pruefe-deployment.ts https://beispiel.vercel.app
 *
 * Prueft, was sich von aussen pruefen laesst: Erreichbarkeit der wichtigen
 * Seiten, Sicherheitskopfzeilen, und dass geschuetzte Endpunkte ohne
 * Anmeldung nichts herausgeben.
 *
 * Ausdruecklich kein Ersatz fuer die Testsuite -- ein gruenes Ergebnis hier
 * heisst, dass die Anwendung laeuft, nicht dass sie richtig rechnet.
 */

const SEITEN = [
  '/',
  '/katalog',
  '/katalog/datenbestand',
  '/katalog/vergleich',
  '/katalog/hsn-tsn',
  '/suche',
  '/marktplatz',
  '/bewertung',
  '/verkaufen',
  '/anmelden',
  '/registrieren',
];

/** Diese muessen ohne Anmeldung mit 401 antworten. */
const GESCHUETZT = ['/api/konto/fahrzeuge', '/api/konto/merkzettel', '/api/guthaben'];

/** Diese Kopfzeilen muessen da sein. */
const KOPFZEILEN = [
  'content-security-policy',
  'x-content-type-options',
  'referrer-policy',
  'strict-transport-security',
];

async function main(): Promise<void> {
  const basis = process.argv[2]?.replace(/\/$/, '');
  if (!basis) {
    console.error('Aufruf: npx tsx scripts/pruefe-deployment.ts <adresse>');
    process.exit(1);
  }

  let fehler = 0;
  const melde = (ok: boolean, text: string) => {
    console.log(`${ok ? '  ok  ' : ' FEHL '} ${text}`);
    if (!ok) fehler += 1;
  };

  console.log(`\n=== ${basis} ===\n`);
  console.log('Seiten:');
  for (const pfad of SEITEN) {
    try {
      const antwort = await fetch(`${basis}${pfad}`, { redirect: 'manual' });
      // 307 ist in Ordnung: geschuetzte Seiten leiten zur Anmeldung.
      melde([200, 307].includes(antwort.status), `${pfad} → ${antwort.status}`);
    } catch (grund) {
      melde(false, `${pfad} → nicht erreichbar (${(grund as Error).message})`);
    }
  }

  console.log('\nGeschützte Endpunkte ohne Anmeldung:');
  for (const pfad of GESCHUETZT) {
    try {
      const antwort = await fetch(`${basis}${pfad}`);
      melde(antwort.status === 401, `${pfad} → ${antwort.status} (erwartet 401)`);
    } catch (grund) {
      melde(false, `${pfad} → nicht erreichbar (${(grund as Error).message})`);
    }
  }

  console.log('\nSicherheitskopfzeilen:');
  try {
    const antwort = await fetch(basis);
    for (const name of KOPFZEILEN) {
      const wert = antwort.headers.get(name);
      melde(Boolean(wert), `${name}${wert ? '' : ' fehlt'}`);
    }
  } catch (grund) {
    melde(false, `Kopfzeilen nicht lesbar (${(grund as Error).message})`);
  }

  console.log(
    fehler === 0
      ? '\nAlles in Ordnung.\n'
      : `\n${fehler} Prüfung(en) fehlgeschlagen.\n`,
  );
  process.exitCode = fehler === 0 ? 0 : 1;
}

void main();
