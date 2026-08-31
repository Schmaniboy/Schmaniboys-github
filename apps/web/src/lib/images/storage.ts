import 'server-only';

import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join, normalize, resolve, sep } from 'node:path';

import type { ImageStorage } from '@ap/core';

import { env, s3Eingerichtet } from '../env';
import { S3ImageStorage } from './s3-storage';

/**
 * Bildablage im Dateisystem.
 *
 * Der Schluessel wird gegen Pfadausbruch geprueft, obwohl er von uns selbst
 * erzeugt wird (`ablageSchluessel`). Grund: Diese Klasse weiss nicht, wer
 * sie aufruft, und eine Pfadpruefung an der Stelle, an der der Pfad
 * entsteht, ist billiger als die Frage, ob sie irgendwo weiter oben schon
 * stattgefunden hat.
 */

const WURZEL = resolve(env.IMAGE_STORAGE_DIR);

function sichererPfad(key: string): string {
  const bereinigt = normalize(key).replace(/^(\.\.(\/|\\|$))+/, '');
  const voll = resolve(join(WURZEL, bereinigt));
  if (voll !== WURZEL && !voll.startsWith(WURZEL + sep)) {
    throw new Error(`Ablageschluessel zeigt aus dem Ablageverzeichnis heraus: ${key}`);
  }
  return voll;
}

export class FileSystemImageStorage implements ImageStorage {
  async put(key: string, bytes: Uint8Array, contentType: string): Promise<void> {
    const pfad = sichererPfad(key);
    await mkdir(dirname(pfad), { recursive: true });
    await writeFile(pfad, bytes);
    await writeFile(`${pfad}.typ`, contentType, 'utf8');
  }

  async get(key: string): Promise<{ bytes: Uint8Array; contentType: string } | null> {
    const pfad = sichererPfad(key);
    try {
      const [bytes, typ] = await Promise.all([
        readFile(pfad),
        readFile(`${pfad}.typ`, 'utf8').catch(() => 'image/webp'),
      ]);
      return { bytes: new Uint8Array(bytes), contentType: typ.trim() };
    } catch {
      return null;
    }
  }

  async delete(key: string): Promise<void> {
    const pfad = sichererPfad(key);
    await rm(pfad, { force: true });
    await rm(`${pfad}.typ`, { force: true });
  }
}

/**
 * Ablage, die es nicht gibt.
 *
 * Auf serverlosen Umgebungen wie Vercel ist das Dateisystem schreibgeschuetzt
 * bis auf /tmp, und /tmp lebt nur so lange wie ein einzelner Aufruf. Ein
 * hochgeladenes Bild waere dort Sekunden spaeter verschwunden -- die Anzeige
 * bliebe mit einem toten Verweis zurueck.
 *
 * Statt Uploads anzunehmen, die verschwinden, lehnt diese Ablage sie ab und
 * sagt warum. Dasselbe Muster wie beim Zahlungsanbieter: Eine Funktion, die
 * nicht laufen kann, sieht nicht so aus, als liefe sie.
 */
export class UnavailableImageStorage implements ImageStorage {
  readonly grund =
    'Auf dieser Umgebung gibt es keinen dauerhaften Bildspeicher. Bilder lassen sich ' +
    'deshalb nicht hochladen. Richten Sie einen Objektspeicher ein (BLOB_STORAGE_URL) ' +
    'oder betreiben Sie die Anwendung auf einem Server mit beschreibbarem Dateisystem.';

  async put(): Promise<void> {
    throw new Error(this.grund);
  }
  async get(): Promise<null> {
    return null;
  }
  async delete(): Promise<void> {
    // Nichts zu loeschen. Kein Fehler -- ein Aufraeumweg soll nicht scheitern.
  }
}

/*
 * Welche Ablage gilt.
 *
 * Vercel setzt VERCEL=1 in jeder Ausfuehrungsumgebung. Das ist das
 * verlaesslichste Erkennungsmerkmal -- verlaesslicher als zu versuchen, eine
 * Datei zu schreiben und den Fehler abzufangen: Der Versuch koennte auf /tmp
 * gelingen und trotzdem nichts nuetzen.
 */
const serverlos = process.env.VERCEL === '1';

/*
 * Der Objektspeicher hat Vorrang, wenn er eingerichtet ist -- auch auf einem
 * eigenen Server. Wer ihn einrichtet, will ihn benutzen; ein Dateisystem,
 * das ihn stillschweigend uebergeht, waere eine Falle beim Umzug auf die
 * zweite Instanz.
 */
export const imageStorage: ImageStorage = s3Eingerichtet
  ? new S3ImageStorage()
  : serverlos
    ? new UnavailableImageStorage()
    : new FileSystemImageStorage();

/** Ob Bilder ueberhaupt hochgeladen werden koennen. Fuer die Oberflaeche. */
export const bildUploadMoeglich = s3Eingerichtet || !serverlos;

/**
 * Welche Ablage gilt gerade -- fuer den Adminbereich und die Startpruefung.
 * Ohne diese Auskunft laesst sich nach einem Umzug nicht feststellen, wohin
 * die Bilder tatsaechlich geschrieben werden.
 */
export const ablageBezeichnung = s3Eingerichtet
  ? `Objektspeicher (${env.S3_BUCKET})`
  : serverlos
    ? 'keine (serverlose Umgebung ohne Objektspeicher)'
    : `Dateisystem (${env.IMAGE_STORAGE_DIR})`;
