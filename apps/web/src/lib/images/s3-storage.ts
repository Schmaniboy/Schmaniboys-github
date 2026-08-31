import 'server-only';

import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

import type { ImageStorage } from '@ap/core';

import { env } from '../env';
import { istNichtGefunden } from './s3-fehler';

/**
 * Bildablage in einem S3-kompatiblen Objektspeicher.
 *
 * Warum ueberhaupt: Der Dateisystem-Adapter taugt fuer genau eine Instanz
 * auf einem eigenen Server. Laufen zwei, sieht jede nur ihre eigenen Bilder
 * -- ein Nutzer laedt hoch, ein anderer bekommt beim naechsten Aufruf eine
 * leere Anzeige. Auf serverlosen Umgebungen verschwindet das Bild ohnehin
 * mit dem Aufruf.
 *
 * `forcePathStyle` ist gesetzt, weil die meisten Alternativen zu AWS
 * (MinIO, viele Selbstbetriebene) keine Adressen der Form
 * `eimer.endpunkt` aufloesen. AWS und R2 vertragen den Pfadstil ebenfalls;
 * er ist damit die Einstellung, die ueberall funktioniert.
 *
 * Die Bilder liegen NICHT oeffentlich: Ausgeliefert werden sie ueber
 * `/api/bilder/...`, wo Zugriffsrecht und Medientyp geprueft werden. Ein
 * oeffentlich lesbarer Eimer waere eine zweite Tuer an dieser Pruefung
 * vorbei -- und Adressen von Objektspeichern sind erratbar.
 */
export class S3ImageStorage implements ImageStorage {
  private readonly client: S3Client;
  private readonly bucket: string;

  constructor() {
    if (
      !env.S3_ENDPOINT ||
      !env.S3_REGION ||
      !env.S3_BUCKET ||
      !env.S3_ACCESS_KEY_ID ||
      !env.S3_SECRET_ACCESS_KEY
    ) {
      throw new Error('S3ImageStorage ohne vollstaendige Zugangsdaten erzeugt.');
    }

    this.bucket = env.S3_BUCKET;
    this.client = new S3Client({
      endpoint: env.S3_ENDPOINT,
      region: env.S3_REGION,
      forcePathStyle: true,
      credentials: {
        accessKeyId: env.S3_ACCESS_KEY_ID,
        secretAccessKey: env.S3_SECRET_ACCESS_KEY,
      },
    });
  }

  async put(key: string, bytes: Uint8Array, contentType: string): Promise<void> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: bytes,
        ContentType: contentType,
        /*
         * Bilder sind unveraenderlich: Der Schluessel enthaelt eine Kennung,
         * eine Aenderung erzeugt einen neuen Schluessel. Damit darf jeder
         * Zwischenspeicher sie behalten.
         */
        CacheControl: 'public, max-age=31536000, immutable',
      }),
    );
  }

  async get(key: string): Promise<{ bytes: Uint8Array; contentType: string } | null> {
    try {
      const antwort = await this.client.send(
        new GetObjectCommand({ Bucket: this.bucket, Key: key }),
      );
      if (!antwort.Body) return null;

      const bytes = await antwort.Body.transformToByteArray();
      return {
        bytes,
        /*
         * Der gespeicherte Medientyp wird uebernommen, aber nicht blind
         * weitergereicht: Die Auslieferung setzt ihn ohnehin fest. Fehlt er,
         * gilt WebP -- dasselbe wie im Dateisystem-Adapter, weil die
         * Verarbeitung alles nach WebP kodiert.
         */
        contentType: antwort.ContentType ?? 'image/webp',
      };
    } catch (fehler) {
      /*
       * Ein fehlendes Objekt ist kein Fehler, sondern `null` -- so steht es
       * in der Schnittstelle. Alles andere (Netz weg, Zugangsdaten falsch,
       * Eimer gibt es nicht) muss durchschlagen: Wer dafuer ebenfalls `null`
       * liefert, macht aus einer kaputten Ablage stillschweigend eine leere.
       */
      if (istNichtGefunden(fehler)) return null;
      throw fehler;
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
    } catch (fehler) {
      // Ein nicht vorhandener Schluessel ist kein Fehler (Schnittstelle).
      if (istNichtGefunden(fehler)) return;
      throw fehler;
    }
  }
}

