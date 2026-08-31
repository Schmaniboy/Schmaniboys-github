/**
 * Ablage fuer Bilddateien.
 *
 * Bilder gehoeren nicht in die Datenbank: Sie blaehen Sicherungen auf und
 * verstopfen den Verbindungspool, wenn sie ueber ihn ausgeliefert werden.
 * Sie gehoeren aber auch nicht in den Anwendungscode -- deshalb diese
 * Schnittstelle.
 *
 * Der mitgelieferte Adapter schreibt ins Dateisystem und funktioniert damit
 * hier und jetzt. Ein Objektspeicher tritt spaeter an dieselbe Stelle; die
 * Anwendung merkt davon nichts.
 */

export interface ImageStorage {
  /** Legt Daten unter einem Schluessel ab. Ueberschreibt vorhandene. */
  put(key: string, bytes: Uint8Array, contentType: string): Promise<void>;
  /** Liest Daten. `null`, wenn es den Schluessel nicht gibt. */
  get(key: string): Promise<{ bytes: Uint8Array; contentType: string } | null>;
  /** Loescht. Ein nicht vorhandener Schluessel ist kein Fehler. */
  delete(key: string): Promise<void>;
}

/**
 * Bildverarbeitung.
 *
 * Getrennt von der Ablage, weil es zwei verschiedene Dinge sind -- und weil
 * sich die Verarbeitung im Test durch eine Attrappe ersetzen laesst, ohne
 * dass dafuer eine Bildbibliothek geladen werden muss.
 */
export interface ImageProcessor {
  /**
   * Dekodiert, verkleinert und kodiert neu.
   *
   * Der Rueckweg ueber eine vollstaendige Neukodierung ist der Punkt: Damit
   * verschwinden EXIF-Daten -- bei Fahrzeugbildern regelmaessig der
   * Aufnahmeort, oft die Wohnadresse -- und alles, was sich sonst in einer
   * Bilddatei mitschleppen laesst.
   */
  normalise(
    bytes: Uint8Array,
    maxKante: number,
  ): Promise<{ bytes: Uint8Array; width: number; height: number; contentType: string }>;
}
