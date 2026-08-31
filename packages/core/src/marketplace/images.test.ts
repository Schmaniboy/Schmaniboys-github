import { describe, expect, it } from 'vitest';

import { AppError, ErrorCode } from '../errors';

import {
  MAX_BILDER_JE_ANZEIGE,
  MAX_UPLOAD_BYTES,
  ablageSchluessel,
  erkenneFormat,
  pruefeMasse,
  pruefeUpload,
  zielMasse,
} from './images';

const JPEG = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0, 0, 0, 0, 0]);
const PNG = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]);
const WEBP = new Uint8Array([
  0x52, 0x49, 0x46, 0x46, 0x10, 0, 0, 0, 0x57, 0x45, 0x42, 0x50,
]);

function codeOf(action: () => unknown): string {
  try {
    action();
    return 'kein Fehler';
  } catch (error) {
    return error instanceof AppError ? error.code : 'falscher Fehlertyp';
  }
}

describe('Bilderkennung', () => {
  it('erkennt die drei erlaubten Formate am Dateianfang', () => {
    expect(erkenneFormat(JPEG)).toBe('jpeg');
    expect(erkenneFormat(PNG)).toBe('png');
    expect(erkenneFormat(WEBP)).toBe('webp');
  });

  it('laesst sich von einer Endung oder einem Medientyp nicht taeuschen', () => {
    /*
     * Der Kern der Pruefung: Eine Datei, die "bild.jpg" heisst und als
     * image/jpeg gemeldet wird, aber ein Skript enthaelt, faellt hier durch.
     * Der gemeldete Medientyp wird gar nicht erst entgegengenommen.
     */
    const skript = new TextEncoder().encode('#!/bin/sh\nrm -rf /\n');
    expect(erkenneFormat(skript)).toBeNull();
    expect(codeOf(() => pruefeUpload({ bytes: skript, vorhandeneBilder: 0 }))).toBe(
      ErrorCode.UNSUPPORTED_MEDIA_TYPE,
    );
  });

  it('erkennt ein PDF nicht als Bild', () => {
    const pdf = new TextEncoder().encode('%PDF-1.7\n');
    expect(erkenneFormat(pdf)).toBeNull();
  });

  it('faellt bei zu kurzen Dateien nicht um', () => {
    expect(erkenneFormat(new Uint8Array([0xff]))).toBeNull();
    expect(erkenneFormat(new Uint8Array([]))).toBeNull();
  });

  it('lehnt einen RIFF-Container ab, der kein WebP ist', () => {
    // Eine WAV-Datei ist auch RIFF -- aber an Stelle 8 steht "WAVE".
    const wav = new Uint8Array([
      0x52, 0x49, 0x46, 0x46, 0x10, 0, 0, 0, 0x57, 0x41, 0x56, 0x45,
    ]);
    expect(erkenneFormat(wav)).toBeNull();
  });
});

describe('Uploadpruefung', () => {
  it('nimmt ein gueltiges Bild an', () => {
    expect(pruefeUpload({ bytes: JPEG, vorhandeneBilder: 0 }).format).toBe('jpeg');
  });

  it('lehnt eine leere Datei ab', () => {
    expect(codeOf(() => pruefeUpload({ bytes: new Uint8Array([]), vorhandeneBilder: 0 }))).toBe(
      ErrorCode.VALIDATION_FAILED,
    );
  });

  it('lehnt zu grosse Dateien ab', () => {
    const zuGross = new Uint8Array(MAX_UPLOAD_BYTES + 1);
    zuGross.set(JPEG.slice(0, 3));
    expect(codeOf(() => pruefeUpload({ bytes: zuGross, vorhandeneBilder: 0 }))).toBe(
      ErrorCode.PAYLOAD_TOO_LARGE,
    );
  });

  it('begrenzt die Zahl der Bilder je Anzeige', () => {
    expect(
      codeOf(() => pruefeUpload({ bytes: JPEG, vorhandeneBilder: MAX_BILDER_JE_ANZEIGE })),
    ).toBe(ErrorCode.CONFLICT);
  });
});

describe('Masse', () => {
  it('lehnt Briefmarken ab', () => {
    expect(codeOf(() => pruefeMasse({ width: 100, height: 80 }))).toBe(
      ErrorCode.VALIDATION_FAILED,
    );
  });

  it('nimmt ein brauchbares Bild an', () => {
    expect(codeOf(() => pruefeMasse({ width: 1600, height: 900 }))).toBe('kein Fehler');
  });

  it('verkleinert unter Beibehaltung des Seitenverhaeltnisses', () => {
    const ziel = zielMasse({ width: 4000, height: 3000 }, 2000);
    expect(ziel).toEqual({ width: 2000, height: 1500 });
  });

  it('vergroessert nie', () => {
    // Aus einem kleinen Bild ein grosses zu rechnen bringt keine
    // Bildinformation dazu, nur Dateigroesse.
    const klein = { width: 800, height: 600 };
    expect(zielMasse(klein, 2000)).toEqual(klein);
  });
});

describe('Ablageschluessel', () => {
  it('nimmt keinen Dateinamen der hochladenden Person auf', () => {
    const schluessel = ablageSchluessel('listing-1', 'bild-1');
    expect(schluessel).toBe('listings/listing-1/bild-1.webp');
    expect(schluessel).not.toContain('..');
  });
});
