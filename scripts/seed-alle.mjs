#!/usr/bin/env node
/**
 * Spielt alle SQL-Seed-Dateien in der richtigen Reihenfolge ein.
 *
 * Verwendung:  pnpm db:seed
 *
 * Nutzt psql (PostgreSQL-Client) zum Einspielen. Falls psql nicht vorhanden
 * ist, wird npx prisma db execute verwendet.
 *
 * Alle Seed-Dateien verwenden ON CONFLICT DO NOTHING und sind idempotent.
 */

import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const prismaDir = resolve(root, 'packages', 'db', 'prisma');
const schemaPath = resolve(prismaDir, 'schema.prisma');

// .env laden (fuer DATABASE_URL)
const envPath = resolve(root, '.env');
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*"?([^"]*)"?\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error('DATABASE_URL fehlt. Bitte in .env setzen.');
  process.exit(1);
}

const SEED_FILES = [
  'seed-katalog.sql',
  'seed-motoren.sql',
  'seed-motoren-fix.sql',
  'seed-ausstattung.sql',
  'seed-ausstattung-2.sql',
  'seed-ausstattung-3.sql',
  'seed-sonderlack.sql',
  'seed-radfelgen-pakete.sql',
  'seed-facelift-modelyear.sql',
  'seed-schwachstellen.sql',
  'seed-wissennotizen.sql',
  'seed-schwachstellen2.sql',
  'seed-wissennotizen2.sql',
  'seed-facelift2.sql',
  'seed-schwachstellen3.sql',
  'seed-wissennotizen3.sql',
  'seed-facelift3.sql',
  'seed-schwachstellen4.sql',
  'seed-wissennotizen4.sql',
  'seed-facelift4.sql',
  'seed-schwachstellen5.sql',
  'seed-wissennotizen5.sql',
  'seed-facelift5.sql',
  'seed-schwachstellen6.sql',
  'seed-wissennotizen6.sql',
  'seed-facelift6.sql',
  'seed-schwachstellen7.sql',
  'seed-wissennotizen7.sql',
  'seed-facelift7.sql',
];

// Pruefen ob psql verfuegbar ist
let hasPsql = false;
try {
  execSync('psql --version', { stdio: 'pipe' });
  hasPsql = true;
} catch { /* psql nicht installiert */ }

// psql versteht Prisma-Parameter wie ?schema=public nicht
const psqlUrl = dbUrl.replace(/\?.*$/, '');

function runWithPsql(filePath) {
  execSync(`psql "${psqlUrl}" -f "${filePath}"`, {
    stdio: ['pipe', 'pipe', 'pipe'],
    timeout: 60_000,
  });
}

function runWithPrisma(filePath) {
  execSync(
    `npx prisma db execute --file "${filePath}" --schema "${schemaPath}"`,
    { stdio: ['pipe', 'pipe', 'pipe'], timeout: 60_000, cwd: root }
  );
}

const runSql = hasPsql ? runWithPsql : runWithPrisma;
const methode = hasPsql ? 'psql' : 'prisma db execute';
console.log(`Seed-Methode: ${methode}\n`);

let ok = 0;
let fehler = 0;

for (const datei of SEED_FILES) {
  const pfad = resolve(prismaDir, datei);
  if (!existsSync(pfad)) {
    console.log(`  UEBERSPRUNGEN  ${datei} (nicht vorhanden)`);
    continue;
  }
  try {
    runSql(pfad);
    ok++;
    console.log(`  OK  ${datei}`);
  } catch (e) {
    fehler++;
    const stderr = e.stderr?.toString().trim() ?? e.message ?? '';
    console.error(`  FEHLER  ${datei}`);
    if (stderr) console.error(`          ${stderr.split('\n')[0]}`);
  }
}

console.log(`\n${ok} Dateien eingespielt, ${fehler} Fehler.`);
if (fehler > 0) process.exit(1);
