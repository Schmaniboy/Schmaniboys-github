/**
 * Katalogdaten einlesen.
 *
 *   npx tsx scripts/import-katalog.ts <datei.json>            Probelauf
 *   npx tsx scripts/import-katalog.ts <datei.json> --schreiben Uebernehmen
 *
 * Der Probelauf ist die Voreinstellung, und das ist Absicht. Ein Import,
 * der beim Schreiben merkt, dass die Haelfte der Verweise ins Leere zeigt,
 * hat die andere Haelfte schon geschrieben.
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { importDatei } from '@ap/core';
import { importiere, prisma } from '@ap/db';

const [, , pfad, ...rest] = process.argv;
const schreiben = rest.includes('--schreiben');
const ausfuehrlich = rest.includes('--details');

if (!pfad) {
  console.error('Aufruf: npx tsx scripts/import-katalog.ts <datei.json> [--schreiben] [--details]');
  process.exit(1);
}

async function main(): Promise<void> {
  const roh = readFileSync(resolve(pfad as string), 'utf8');

  let json: unknown;
  try {
    json = JSON.parse(roh);
  } catch (fehler) {
    console.error(`Die Datei ist kein gueltiges JSON: ${(fehler as Error).message}`);
    process.exit(1);
  }

  const geprueft = importDatei.safeParse(json);
  if (!geprueft.success) {
    console.error('Die Datei entspricht nicht dem Importformat:\n');
    for (const problem of geprueft.error.issues.slice(0, 40)) {
      console.error(`  ${problem.path.join('.') || '(Wurzel)'}: ${problem.message}`);
    }
    if (geprueft.error.issues.length > 40) {
      console.error(`  ... und ${geprueft.error.issues.length - 40} weitere.`);
    }
    process.exit(1);
  }

  const bericht = await importiere(geprueft.data, { probelauf: !schreiben });

  console.log('');
  console.log(schreiben ? '=== IMPORT ===' : '=== PROBELAUF (nichts geschrieben) ===');
  console.log(`Quelle:        ${bericht.quelle}`);
  console.log(`Angelegt:      ${bericht.angelegt}`);
  console.log(`Aktualisiert:  ${bericht.aktualisiert}`);
  console.log(`Abgelehnt:     ${bericht.abgelehnt}`);
  console.log(
    `Befunde:       ${bericht.befundeGesamt.BLOCKER} blockierend, ` +
      `${bericht.befundeGesamt.WARNING} Warnungen, ${bericht.befundeGesamt.HINT} Hinweise`,
  );
  console.log(`Dauer:         ${bericht.dauerMs} ms`);

  if (bericht.offeneVerweise.length > 0) {
    console.log('\n--- Verweise ins Leere ---');
    for (const verweis of bericht.offeneVerweise.slice(0, 30)) console.log(`  ${verweis}`);
  }

  const auffaellig = bericht.eintraege.filter(
    (eintrag) => eintrag.aktion === 'ABGELEHNT' || eintrag.befunde.length > 0,
  );

  if (auffaellig.length > 0) {
    console.log('\n--- Datensaetze mit Befund ---');
    for (const eintrag of ausfuehrlich ? auffaellig : auffaellig.slice(0, 25)) {
      console.log(`\n  [${eintrag.aktion}] ${eintrag.bereich}: ${eintrag.schluessel}`);
      for (const befund of eintrag.befunde) {
        console.log(`      ${befund.severity.padEnd(7)} ${befund.message}`);
      }
    }
    if (!ausfuehrlich && auffaellig.length > 25) {
      console.log(`\n  ... und ${auffaellig.length - 25} weitere. Mit --details vollstaendig.`);
    }
  }

  if (!schreiben) {
    console.log(
      '\nNichts geschrieben. Zum Uebernehmen denselben Aufruf mit --schreiben wiederholen.',
    );
  }

  // Ein Import mit blockierenden Befunden ist kein Erfolg, auch wenn der
  // Rest durchlief -- der Rueckgabewert sagt das den Werkzeugen drumherum.
  process.exitCode = bericht.befundeGesamt.BLOCKER > 0 ? 2 : 0;
}

main()
  .catch((fehler) => {
    console.error(fehler);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
