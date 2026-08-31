#!/usr/bin/env node
/**
 * Erzeugt eine Prisma-Migration ohne Rueckfrage.
 *
 * `prisma migrate dev` ist ein interaktiver Befehl. Sobald eine Aenderung
 * eine Bestaetigung braucht -- etwa das Ersetzen einer Eindeutigkeits-
 * bedingung -- bricht es in einer Umgebung ohne Eingabe ab.
 *
 * Dieses Skript nimmt denselben Weg wie `migrate dev`, nur getrennt:
 * SQL aus dem Unterschied zwischen Datenbank und Schema erzeugen, in einen
 * Migrationsordner schreiben, anschliessend mit `migrate deploy` anwenden.
 *
 * Aufruf: npm run db:migrate:create -- <name>
 *
 * Die erzeugte SQL-Datei sollte vor dem Anwenden gelesen werden -- das
 * Skript ersetzt die Pruefung nicht, es ersetzt nur die Rueckfrage.
 */

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const wurzel = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const schema = resolve(wurzel, 'packages/db/prisma/schema.prisma');

const name = process.argv[2];
if (!name || !/^[a-z0-9_]+$/.test(name)) {
  console.error('Aufruf: npm run db:migrate:create -- <name_in_kleinbuchstaben>');
  process.exit(1);
}

const envDatei = resolve(wurzel, '.env');
if (existsSync(envDatei)) process.loadEnvFile(envDatei);

const datenbank = process.env.DATABASE_URL;
if (!datenbank) {
  console.error('DATABASE_URL fehlt.');
  process.exit(1);
}

const sql = execFileSync(
  'npx',
  [
    'prisma',
    'migrate',
    'diff',
    '--from-url',
    datenbank,
    '--to-schema-datamodel',
    schema,
    '--script',
  ],
  { cwd: wurzel, encoding: 'utf8' },
);

if (!sql.trim() || sql.includes('This is an empty migration')) {
  console.log('Keine Aenderung gegenueber der Datenbank. Nichts zu tun.');
  process.exit(0);
}

const zeitstempel = new Date()
  .toISOString()
  .replace(/[-:T]/g, '')
  .slice(0, 14);
const ordner = resolve(wurzel, `packages/db/prisma/migrations/${zeitstempel}_${name}`);
mkdirSync(ordner, { recursive: true });
writeFileSync(resolve(ordner, 'migration.sql'), sql);

console.log(`Migration geschrieben: ${zeitstempel}_${name}`);
console.log('--- SQL ---');
console.log(sql.trim());
console.log('--- Ende ---');
console.log('Anwenden mit: npm run db:deploy');
