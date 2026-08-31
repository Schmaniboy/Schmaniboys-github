/**
 * Warum laeuft es nicht?
 *
 *   npm run diagnose [adresse]
 *
 * Der haeufigste Fall bei einem 404 auf der Startseite ist NICHT, dass die
 * Anwendung kaputt ist: Auf Port 3000 antwortet eine andere Anwendung. Der
 * Port ist die Voreinstellung von Next.js, Vite, Rails, json-server und
 * einem Dutzend anderer Werkzeuge. Wer zwei Projekte offen hat, bekommt vom
 * Browser das falsche -- und das liefert fuer /katalog folgerichtig 404.
 *
 * Dieses Skript prueft der Reihe nach, was schiefgehen kann, und sagt bei
 * jedem Punkt, was zu tun ist. Es raet nicht: Was es nicht feststellen
 * kann, sagt es als "unbekannt".
 */
import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ADRESSE = (process.argv[2] ?? 'http://localhost:3000').replace(/\/$/, '');
const befunde = [];

function melde(zustand, text, hinweis) {
  const zeichen = { ok: '  ok  ', fehl: ' FEHL ', frage: '  ??  ' }[zustand];
  console.log(`${zeichen} ${text}`);
  if (hinweis) console.log(`        ${hinweis.replace(/\n/g, '\n        ')}`);
  if (zustand === 'fehl') befunde.push(text);
}

console.log(`\nDiagnose — ${ADRESSE}\n`);

// 1. Stehen wir im richtigen Verzeichnis?
const wurzel = resolve(process.cwd());
let paket = null;
try {
  paket = JSON.parse(readFileSync(resolve(wurzel, 'package.json'), 'utf8'));
} catch {
  /* gleich behandelt */
}
if (paket?.workspaces && existsSync(resolve(wurzel, 'apps/web'))) {
  melde('ok', `Verzeichnis: ${wurzel}`);
} else {
  melde(
    'fehl',
    `Verzeichnis passt nicht: ${wurzel}`,
    'npm run dev muss im Wurzelverzeichnis des Projekts laufen (dort, wo\n' +
      'package.json mit "workspaces" liegt). Aus einem Unterordner heraus\n' +
      'findet Next.js kein app-Verzeichnis.',
  );
}

// 2. Umgebung
if (existsSync(resolve(wurzel, '.env'))) {
  const inhalt = readFileSync(resolve(wurzel, '.env'), 'utf8');
  /*
   * Nur DATABASE_URL ist immer Pflicht -- so steht es im Schema in
   * apps/web/src/lib/env.ts. IP_HASH_SECRET verlangt die Anwendung erst in
   * Produktion, und zwar mit mindestens 16 Zeichen; sie startet sonst nicht.
   * Hier wird deshalb nur gemeldet, was die Anwendung selbst verlangt --
   * eine erfundene Pflichtvariable schickt jemanden auf die falsche Faehrte.
   */
  const gesetzt = (name) => new RegExp(`^${name}\\s*=\\s*\\S`, 'm').test(inhalt);
  if (!gesetzt('DATABASE_URL')) {
    melde('fehl', '.env: DATABASE_URL fehlt', 'Ohne sie startet die Anwendung nicht. Vorlage: .env.example');
  } else {
    melde('ok', '.env vorhanden, DATABASE_URL gesetzt');
  }
  const ipGeheimnis = /^IP_HASH_SECRET\s*=\s*"?([^"\n]*)"?/m.exec(inhalt)?.[1] ?? '';
  if (ipGeheimnis.length >= 16) {
    melde('ok', 'IP_HASH_SECRET gesetzt (in Produktion Pflicht)');
  } else {
    melde(
      'frage',
      'IP_HASH_SECRET fehlt oder ist kuerzer als 16 Zeichen',
      'Lokal in Ordnung. In Produktion startet die Anwendung damit nicht —\n' +
        'ohne Geheimnis waere der Hash einer IP-Adresse trivial zurueckzurechnen.',
    );
  }
} else {
  melde('fehl', '.env fehlt', 'cp .env.example .env — dann DATABASE_URL und SESSION_SECRET setzen.');
}

// 3. Gebauter Stand (nur fuer npm start noetig, fuer npm run dev nicht)
/*
 * Nicht "gibt es .next" fragen, sondern "gibt es darin einen Baustand".
 * npm run dev schreibt ebenfalls nach .next -- danach ist das Verzeichnis
 * da, npm start scheitert aber mit "Could not find a production build".
 * Genau diese Verwechslung kostet sonst eine halbe Stunde.
 */
const baustand = existsSync(resolve(wurzel, 'apps/web/.next/BUILD_ID'));
const nextDa = existsSync(resolve(wurzel, 'apps/web/.next'));
melde(
  baustand ? 'ok' : 'frage',
  baustand
    ? 'apps/web/.next enthaelt einen Baustand (npm start moeglich)'
    : nextDa
      ? 'apps/web/.next enthaelt KEINEN Baustand — nur npm run dev moeglich'
      : 'apps/web/.next fehlt — fuer npm start erst npm run build',
  baustand
    ? undefined
    : 'npm run dev laeuft ohne Bau. Fuer npm start:  npm run build',
);

// 4. Wer horcht auf dem Port?
const port = Number(new URL(ADRESSE).port || '3000');
let horcher = null;
for (const befehl of [
  `ss -lptnH 'sport = :${port}'`,
  `lsof -nP -iTCP:${port} -sTCP:LISTEN`,
  `netstat -ano | findstr :${port}`,
]) {
  try {
    const aus = execSync(befehl, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    if (aus) {
      // lsof gibt eine Kopfzeile aus (COMMAND PID USER ...) -- gesucht ist
      // die erste Zeile mit Inhalt, nicht die Ueberschrift.
      const zeilen = aus.split('\n').filter((z) => !/^COMMAND\s+PID/.test(z));
      horcher = zeilen[0]?.trim() ?? null;
      if (horcher) break;
    }
  } catch {
    /* Werkzeug gibt es hier nicht — naechstes probieren */
  }
}
melde(
  horcher ? 'ok' : 'frage',
  horcher ? `Auf Port ${port} horcht: ${horcher.slice(0, 160)}` : `Wer auf Port ${port} horcht, liess sich nicht feststellen`,
);

// 5. Antwortet dort UNSERE Anwendung?
let erreichbar = false;
let istUnsere = false;
try {
  const gesundheit = await fetch(`${ADRESSE}/api/health`, { signal: AbortSignal.timeout(8000) });
  erreichbar = true;
  const inhalt = await gesundheit.json().catch(() => null);
  istUnsere = Boolean(inhalt?.data && 'database' in inhalt.data);
  if (istUnsere) {
    melde(
      inhalt.data.database === 'ok' ? 'ok' : 'fehl',
      `Anwendung antwortet, Datenbank: ${inhalt.data.database}`,
      inhalt.data.database === 'ok'
        ? undefined
        : 'Die Anwendung laeuft, erreicht aber die Datenbank nicht.\n' +
          'PostgreSQL starten und DATABASE_URL pruefen.',
    );
  } else {
    melde(
      'fehl',
      `Auf Port ${port} antwortet eine ANDERE Anwendung`,
      'Das ist die haeufigste Ursache fuer 404 auf der Startseite: Port 3000\n' +
        'ist die Voreinstellung vieler Werkzeuge. Entweder das andere Projekt\n' +
        `beenden, oder diese Anwendung auf einem anderen Port starten:\n` +
        `  PORT=${port + 10} npm run dev\n` +
        `Dann im Browser http://localhost:${port + 10} aufrufen.`,
    );
  }
} catch {
  melde(
    'fehl',
    `${ADRESSE} antwortet nicht`,
    'Server starten:  npm run dev\n' +
      'Startet er auf einem anderen Port, sagt er das in der Ausgabe —\n' +
      'Next.js weicht aus, wenn 3000 belegt ist.',
  );
}

// 6. Liefert die Startseite wirklich die Startseite?
if (erreichbar && istUnsere) {
  try {
    const antwort = await fetch(`${ADRESSE}/`, { signal: AbortSignal.timeout(15000) });
    const html = await antwort.text();
    const titel = /<title>([^<]*)<\/title>/.exec(html)?.[1] ?? '(kein Titel)';
    if (antwort.status === 200 && /CARONEX/i.test(titel)) {
      melde('ok', `Startseite: 200, Titel „${titel}"`);
    } else {
      melde(
        'fehl',
        `Startseite: ${antwort.status}, Titel „${titel}"`,
        'Gebauten Stand verwerfen und neu bauen:\n' +
          '  rm -rf apps/web/.next && npm run build',
      );
    }
  } catch {
    melde('fehl', 'Startseite nicht abrufbar');
  }
}

console.log('');
if (befunde.length === 0) {
  console.log('Kein Befund — die Anwendung laeuft unter dieser Adresse.\n');
} else {
  console.log(`${befunde.length} Befund(e). Der oberste ist meist die Ursache.\n`);
  process.exit(1);
}
