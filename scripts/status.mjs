#!/usr/bin/env node
/**
 * Erzeugt STATUS.md aus PROGRESS.json.
 *
 * Die Pflegeanleitung sagt: PROGRESS.json ist die Quelle, STATUS.md wird
 * daraus gespiegelt. Von Hand gespiegelt driftet das auseinander -- es war
 * bereits auseinandergedriftet (STATUS.md meldete "Git nicht initialisiert",
 * als das Repository laengst bestand). Deshalb ein Generator.
 *
 * Aufruf: npm run status
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const wurzel = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const progress = JSON.parse(readFileSync(resolve(wurzel, 'PROGRESS.json'), 'utf8'));

const BALKENBREITE = 20;

function balken(prozent) {
  const voll = Math.round((prozent / 100) * BALKENBREITE);
  return '█'.repeat(voll) + '░'.repeat(BALKENBREITE - voll);
}

const STATUSTEXT = {
  done: 'ABGESCHLOSSEN',
  in_progress: 'in Arbeit',
  blocked: 'BLOCKIERT',
  not_started: 'offen',
};

function phasenTabelle() {
  return progress.phases
    .map((phase) => {
      const nummer = String(phase.id.replace('phase-', '')).padStart(2, ' ');
      const prozent = phase.percentComplete ?? 0;
      const titel = (phase.name ?? phase.title ?? '').padEnd(40).slice(0, 39).padEnd(40);
      return `Phase ${nummer}  ${balken(prozent)} ${String(prozent).padStart(3)} %   ${titel}${STATUSTEXT[phase.status] ?? phase.status}`;
    })
    .join('\n');
}

function offeneBlocker() {
  const offen = progress.blockers.filter((b) => (b.status ?? 'offen') !== 'geloest');
  if (offen.length === 0) return '_Keine offenen Blocker._';

  const reihenfolge = { hoch: 0, mittel: 1, niedrig: 2 };
  offen.sort((a, b) => (reihenfolge[a.severity] ?? 3) - (reihenfolge[b.severity] ?? 3));

  return offen
    .map((b) => {
      const zeilen = [`### ${b.id} · ${b.title} \`${b.severity}\``, '', b.detail];
      if (b.workaround) zeilen.push('', `**Vorgehen ohne Klärung:** ${b.workaround}`);
      if (b.decisionNeeded) zeilen.push('', '**Entscheidung erforderlich.**');
      if (b.documentedIn) zeilen.push('', `Dokumentiert in \`${b.documentedIn}\``);
      return zeilen.join('\n');
    })
    .join('\n\n');
}

function geloesteBlocker() {
  const geloest = progress.blockers.filter((b) => b.status === 'geloest');
  if (geloest.length === 0) return '';
  return (
    '\n## Gelöste Blocker\n\n' +
    geloest.map((b) => `- **${b.id} ${b.title}** — ${b.resolution ?? 'erledigt'}`).join('\n') +
    '\n'
  );
}

function vorgaben() {
  return progress.constraints
    .map((c) => `| **${c.id}** | ${c.rule} | ${c.detail} |`)
    .join('\n');
}

function naechsteSchritte() {
  const naechste = progress.phases.find((p) => p.status !== 'done');
  if (!naechste) return '_Alle Phasen abgeschlossen._';
  const offen = naechste.tasks.filter((t) => t.status !== 'done').slice(0, 6);
  return [
    `Nächste Phase: **${naechste.id.replace('phase-', 'Phase ')} — ${naechste.name ?? naechste.title}**`,
    '',
    ...offen.map((t) => `${t.status === 'blocked' ? '⏸️' : '▫️'} \`${t.id}\` ${t.title}`),
  ].join('\n');
}

/*
 * Der Verlauf kennt zwei Formen: fruehe Eintraege tragen `event`/`detail`,
 * spaetere `phase`/`summary`. Der Erzeuger las nur die erste -- neun
 * Eintraege erschienen deshalb als "### 2026-08-22 · undefined". Beide
 * Formen werden gelesen, statt die Daten umzuschreiben: Ein Verlauf ist ein
 * Protokoll, und ein Protokoll wird nicht nachtraeglich umformuliert.
 */
function verlaufsUeberschrift(h) {
  if (h.event) return h.event;
  if (h.phase) {
    const phase = progress.phases?.find((p) => p.id === h.phase);
    return phase ? `${phase.name}` : h.phase;
  }
  return 'Eintrag ohne Bezeichnung';
}

function verlauf() {
  return progress.history
    .slice()
    .reverse()
    .map((h) => {
      const text = h.detail ?? h.summary ?? '_Kein Text hinterlegt._';
      return `### ${h.date} · ${verlaufsUeberschrift(h)}\n\n${text}`;
    })
    .join('\n\n');
}

/**
 * Der Datenbestand.
 *
 * Bewusst getrennt vom Aufgabenfortschritt und direkt daneben: "156 von 156
 * Aufgaben" sagt, dass die Plattform gebaut ist. Es sagt NICHTS darueber,
 * wie viele Fahrzeuge darin stehen. Diese beiden Zahlen zu vermischen waere
 * genau die vorgetaeuschte Vollstaendigkeit, gegen die das Ganze gebaut ist.
 */
function datenbestand() {
  const d = progress.datenbestand;
  if (!d) {
    return 'Noch nicht erhoben. Ermitteln mit `npx tsx scripts/datenbestand.ts`.';
  }

  const tabelle = [
    '| Bereich | Erfasst |',
    '|---|---:|',
    ...d.zeilen.map((z) => `| ${z.bereich} | ${z.erfasst.toLocaleString('de-DE')} |`),
  ].join('\n');

  /*
   * Der Bericht zeigte hier den rohen Aufzaehlungsnamen ("UNVERIFIED").
   * Eine Statusdatei, die Datenbankbezeichner ausgibt, liest sich wie ein
   * Fehler -- und ist fuer den Adressaten unbrauchbar.
   */
  const GUETE_LABEL = {
    VERIFIED: 'bestätigt',
    PARTIALLY_VERIFIED: 'teilweise bestätigt',
    EXPERIENCE: 'Erfahrungswert',
    UNVERIFIED: 'nicht verifiziert',
    NEEDS_REVIEW: 'zur Prüfung',
  };

  const guete = (d.guete ?? [])
    .map((g) => `${g.anzahl.toLocaleString('de-DE')} ${GUETE_LABEL[g.stufe] ?? g.stufe}`)
    .join(', ');

  return [
    `**Erhoben am:** ${d.erhobenAm} · \`${d.erhobenMit}\``,
    '',
    tabelle,
    '',
    `**Güte:** ${guete || 'keine Datensätze'} · **ohne jede Quelle:** ${d.ohneQuelle} · **zur Prüfung:** ${d.zurPruefung}`,
    '',
    `> ${d.hinweis}`,
    '',
    '> Für keinen Bereich ist eine belegte Gesamtzahl hinterlegt. Wie viele Motoren,',
    '> Ausstattungen oder Varianten es insgesamt gibt, steht hier nicht — deshalb gibt es',
    '> auch keine Prozentangabe zur Abdeckung. Eine Quote ohne belegten Nenner wäre eine',
    '> erfundene Zahl mit dem Aussehen einer gemessenen.',
  ].join('\n');
}

const t = progress.totals;

const inhalt = `# STATUS — CARONEX

> **Diese Datei wird erzeugt. Nicht von Hand bearbeiten.**
> Quelle: [\`PROGRESS.json\`](./PROGRESS.json) · Neu erzeugen mit \`npm run status\`
> Plan: [\`MASTERPLAN.md\`](./MASTERPLAN.md) · Gehirn: [\`docs/gehirn/\`](./docs/gehirn/)

**Stand:** ${progress.meta.lastUpdated} · **Fortschritt:** ${t.done} von ${t.tasks} Aufgaben · **${t.percentComplete} %**

\`\`\`
${phasenTabelle()}
\`\`\`

> Der Fortschritt oben zählt **Aufgaben**, nicht Fahrzeugdaten. Was an Daten
> tatsächlich erfasst ist, steht im Abschnitt Datenbestand.

---

## Datenbestand

${datenbestand()}

---

## Offene Blocker

${offeneBlocker()}
${geloesteBlocker()}
---

## Verbindliche Vorgaben

| | Regel | Wirkung |
|---|---|---|
${vorgaben()}

---

## Nächste Schritte

${naechsteSchritte()}

---

## Verlauf

${verlauf()}

---

## Pflegeanleitung

\`PROGRESS.json\` ist die Quelle der Wahrheit. Bei jedem Arbeitsschritt:

1. Status der betroffenen Aufgabe setzen: \`not_started\` → \`in_progress\` → \`done\` (oder \`blocked\`)
2. \`note\` bei Bedarf ergänzen
3. \`percentComplete\` der Phase setzen
4. \`meta.lastUpdated\` setzen
5. Bei abgeschlossener Phase: Eintrag in \`history\`
6. \`npm run status\` ausführen — \`STATUS.md\` und \`totals\` entstehen daraus
7. Gehirn aktualisieren (\`docs/gehirn/\`) und \`CHANGELOG.md\` fortschreiben
`;

writeFileSync(resolve(wurzel, 'STATUS.md'), inhalt);
console.log(`STATUS.md erzeugt — ${t.done}/${t.tasks} Aufgaben (${t.percentComplete} %)`);
