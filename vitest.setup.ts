import { existsSync } from 'node:fs';

/**
 * Laedt .env fuer Tests, die eine echte Datenbank brauchen.
 * process.loadEnvFile ist in Node enthalten -- keine zusaetzliche Abhaengigkeit.
 */
if (existsSync('.env')) {
  process.loadEnvFile('.env');
}
