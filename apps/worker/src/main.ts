import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

import { InMemoryJobQueue, systemClock } from '@ap/core';
import { deleteExpiredSessions, prisma, walletRepository } from '@ap/db';

/**
 * Hintergrundprozesse.
 *
 * Hier laeuft alles, was nicht im Request-Zyklus laufen darf: Aufraeumen,
 * spaeter KI-Aufrufe, Bildverarbeitung, Rechnungserzeugung und der Abgleich
 * von Marktdaten.
 *
 * Warum es diesen Prozess schon jetzt gibt, obwohl er wenig tut: Die Trennung
 * nachtraeglich einzuziehen ist teuer. Ein KI-Aufruf in Phase 7 dauert
 * Sekunden -- den im Request zu halten waere ein Fehler, den man dann an
 * vielen Stellen zurueckbauen muesste.
 */

const rootEnv = resolve(process.cwd(), '../../.env');
if (existsSync(rootEnv)) process.loadEnvFile(rootEnv);

/**
 * Warteschlange im Prozessspeicher.
 *
 * BEKANNTE GRENZE: Bei einem Neustart gehen anstehende Auftraege verloren,
 * und mehrere Instanzen teilen sie nicht. Sobald ein Auftrag verlaesslich
 * ausgefuehrt werden muss (Zahlungen, Rechnungen), gehoert eine dauerhafte
 * Warteschlange dahinter. Die Schnittstelle bleibt dieselbe.
 */
export const queue = new InMemoryJobQueue();

const AUFRAEUM_INTERVALL_MS = 15 * 60 * 1000;

async function sitzungenAufraeumen(): Promise<void> {
  const entfernt = await deleteExpiredSessions(systemClock.now());
  if (entfernt > 0) {
    console.log(`[worker] ${entfernt} abgelaufene Sitzungen entfernt`);
  }
}

/**
 * Gibt abgelaufene Guthabenreservierungen frei.
 *
 * Ohne diesen Lauf blockiert ein haengengebliebener Vorgang das Guthaben
 * dauerhaft: Der Betrag ist reserviert, aber niemand bucht ihn je ab. Das
 * faellt der betroffenen Person sofort auf und ist schwer zu erklaeren.
 */
async function reservierungenAufraeumen(): Promise<void> {
  const freigegeben = await walletRepository.releaseExpiredHolds(systemClock.now());
  if (freigegeben > 0) {
    console.log(`[worker] ${freigegeben} abgelaufene Guthabenreservierungen freigegeben`);
  }
}

async function main(): Promise<void> {
  console.log('[worker] gestartet');

  const aufraeumen = async (): Promise<void> => {
    await sitzungenAufraeumen();
    await reservierungenAufraeumen();
  };

  await aufraeumen();
  const timer = setInterval(() => {
    void aufraeumen().catch((error: unknown) => {
      // Ein fehlgeschlagener Aufraeumlauf darf den Prozess nicht beenden --
      // beim naechsten Durchlauf wird es erneut versucht.
      console.error('[worker] Aufraeumen fehlgeschlagen', error);
    });
  }, AUFRAEUM_INTERVALL_MS);

  const beenden = async (signal: string): Promise<void> => {
    console.log(`[worker] ${signal} empfangen, fahre herunter`);
    clearInterval(timer);
    await prisma.$disconnect();
    process.exit(0);
  };

  process.on('SIGINT', () => void beenden('SIGINT'));
  process.on('SIGTERM', () => void beenden('SIGTERM'));
}

void main().catch((error: unknown) => {
  console.error('[worker] Start fehlgeschlagen', error);
  process.exit(1);
});
