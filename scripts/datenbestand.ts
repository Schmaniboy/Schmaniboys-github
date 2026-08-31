/**
 * Datenbestand in Zahlen -- fuer STATUS.md und die Konsole.
 *
 *   npx tsx scripts/datenbestand.ts          Lesbar
 *   npx tsx scripts/datenbestand.ts --json   Als JSON
 *
 * Gibt bewusst nur Anzahlen aus. Eine Quote gaebe es nur dort, wo eine
 * bekannte Gesamtzahl mit Quelle hinterlegt ist; ohne sie waere sie eine
 * erfundene Zahl mit dem Aussehen einer gemessenen.
 */

import { DATA_QUALITY_LABELS, type DataQuality } from '@ap/core';
import { ladeDatenbestand, prisma } from '@ap/db';

async function main(): Promise<void> {
  const bestand = await ladeDatenbestand();

  if (process.argv.includes('--json')) {
    console.log(
      JSON.stringify(
        {
          erhobenAm: new Date().toISOString().slice(0, 10),
          zeilen: bestand.zeilen.map((zeile) => ({
            bereich: zeile.label,
            erfasst: zeile.recorded,
            gesamtzahlBelegt: zeile.knownTotal !== null,
          })),
          guete: bestand.guete,
          zurPruefung: bestand.zurPruefung,
          ohneQuelle: bestand.ohneQuelle,
        },
        null,
        2,
      ),
    );
    return;
  }

  console.log('\n=== DATENBESTAND ===\n');
  for (const zeile of bestand.zeilen) {
    const anzahl = String(zeile.recorded).padStart(7, ' ');
    const nachsatz =
      zeile.percent === null ? '(Gesamtzahl nicht belegt)' : `(${zeile.percent} % des Bekannten)`;
    console.log(`${anzahl}  ${zeile.label.padEnd(36)} ${nachsatz}`);
  }

  console.log('\n=== GUETE ===\n');
  if (bestand.guete.length === 0) {
    console.log('  Keine Datensaetze erfasst.');
  }
  for (const zeile of bestand.guete) {
    const beschreibung = DATA_QUALITY_LABELS[zeile.quality as DataQuality];
    console.log(
      `${String(zeile.anzahl).padStart(7, ' ')}  ${beschreibung?.label ?? zeile.quality}`,
    );
  }

  console.log('');
  console.log(`${String(bestand.ohneQuelle).padStart(7, ' ')}  Eintraege ohne jede Quelle`);
  console.log(`${String(bestand.zurPruefung).padStart(7, ' ')}  Eintraege zur Pruefung`);
  console.log('');
}

main()
  .catch((fehler) => {
    console.error(fehler);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
