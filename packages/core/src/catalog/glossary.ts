/**
 * Fachbegriffe in Alltagssprache.
 *
 * Der MASTERPLAN verlangt, Informationen "fuer normale Menschen verstaendlich"
 * zu erklaeren. Das ist keine Frage des Tonfalls, sondern der Struktur: Wer
 * "Drehmoment 400 Nm" liest und den Begriff nicht kennt, kann mit der Zahl
 * nichts anfangen -- und trifft trotzdem eine Kaufentscheidung.
 *
 * Diese Erklaerungen sind allgemeine Begriffsklaerungen, keine fahrzeug-
 * bezogenen Angaben. Sie sagen, was eine Groesse bedeutet, nie welchen Wert
 * ein bestimmtes Fahrzeug hat -- das steht ausschliesslich in der Datenbank
 * und braucht dort seine Quelle.
 */

export interface GlossaryEntry {
  /** Der Begriff, wie er in der Oberflaeche steht. */
  term: string;
  /** Ein Satz, der ohne Vorwissen verstaendlich ist. */
  plain: string;
  /** Warum die Groesse beim Autokauf zaehlt. */
  whyItMatters?: string;
}

export const GLOSSARY = {
  power: {
    term: 'Leistung',
    plain:
      'Wie schnell der Motor Arbeit verrichten kann. Sie bestimmt vor allem, wie zügig ein Auto auf hohe Geschwindigkeiten kommt.',
    whyItMatters:
      'Die gesetzliche Einheit ist Kilowatt (kW). PS ist dieselbe Größe in einer älteren Einheit: 1 kW sind rund 1,36 PS.',
  },
  torque: {
    term: 'Drehmoment',
    plain:
      'Die Kraft, mit der der Motor die Räder dreht. Sie bestimmt, wie kräftig sich ein Auto beim Anfahren und Beschleunigen anfühlt.',
    whyItMatters:
      'Ein Diesel hat oft weniger Leistung, aber mehr Drehmoment als ein Benziner — deshalb wirkt er im Alltag kräftiger, ohne schneller zu sein.',
  },
  displacement: {
    term: 'Hubraum',
    plain:
      'Das Volumen, das die Kolben im Motor durchlaufen. Größerer Hubraum bedeutet meist mehr Kraft ohne Aufladung.',
    whyItMatters:
      'In Deutschland richtet sich ein Teil der Kfz-Steuer nach dem Hubraum.',
  },
  turbocharger: {
    term: 'Turbolader',
    plain:
      'Ein Verdichter, der mehr Luft in den Motor presst und ihn dadurch kräftiger macht, ohne dass er größer werden muss.',
    whyItMatters:
      'Aufgeladene Motoren holen aus wenig Hubraum viel Leistung. Der Lader selbst ist ein Verschleißteil.',
  },
  driveType: {
    term: 'Antriebsart',
    plain:
      'Welche Räder angetrieben werden: die vorderen, die hinteren oder alle vier.',
    whyItMatters:
      'Allradantrieb hilft bei Nässe und Schnee, kostet aber Verbrauch und Wartung. Heckantrieb gilt als fahraktiv, Frontantrieb als unkompliziert.',
  },
  transmission: {
    term: 'Getriebe',
    plain: 'Der Teil, der die Motorkraft an die Räder anpasst — von Hand oder automatisch.',
    whyItMatters:
      'Doppelkupplungs- und Wandlerautomatik fahren sich unterschiedlich und werden auch unterschiedlich gewartet.',
  },
  consumption: {
    term: 'Verbrauch',
    plain: 'Wie viel Kraftstoff oder Strom das Auto auf 100 Kilometern braucht.',
    whyItMatters:
      'Der Wert hängt vom Messverfahren ab. Ältere Angaben nach NEFZ fallen niedriger aus als neuere nach WLTP — beide Zahlen sind nicht vergleichbar.',
  },
  wltp: {
    term: 'WLTP',
    plain:
      'Ein seit 2017 vorgeschriebenes Messverfahren für Verbrauch und Abgase, das näher am Alltag liegt als das ältere NEFZ.',
    whyItMatters:
      'Dasselbe Auto hat nach WLTP einen höheren angegebenen Verbrauch als nach NEFZ, ohne dass es mehr verbraucht.',
  },
  kerbWeight: {
    term: 'Leergewicht',
    plain:
      'Was das Auto fahrbereit wiegt — mit Betriebsflüssigkeiten, vollem Tank und Fahrer, aber ohne Zuladung.',
    whyItMatters: 'Gewicht wirkt sich auf Verbrauch, Bremsweg und Reifenverschleiß aus.',
  },
  facelift: {
    term: 'Facelift',
    plain:
      'Eine Überarbeitung innerhalb derselben Modellgeneration, meist nach etwa drei bis vier Jahren.',
    whyItMatters:
      'Vor- und Nachfacelift unterscheiden sich oft in Technik und Ausstattung — beim Gebrauchtkauf ein wichtiger Unterschied.',
  },
  generation: {
    term: 'Generation',
    plain: 'Eine komplett neu entwickelte Ausgabe eines Modells, nicht nur eine Überarbeitung.',
    whyItMatters:
      'Zwischen zwei Generationen ändert sich fast alles: Technik, Ersatzteile, typische Schwachstellen.',
  },
  trimLine: {
    term: 'Ausstattungslinie',
    plain:
      'Ein vom Hersteller geschnürtes Paket aus Ausstattung und Optik, das über der Grundausstattung liegt.',
    whyItMatters:
      'Die Linie sagt nichts über den Motor aus. Sie beeinflusst den Wiederverkaufswert oft stärker als einzelne Extras.',
  },
  vin: {
    term: 'Fahrzeug-Identifizierungsnummer (VIN)',
    plain:
      'Die 17-stellige Nummer, die jedes Fahrzeug eindeutig kennzeichnet — vergleichbar mit einer Seriennummer.',
    whyItMatters:
      'Aus ihr lassen sich Hersteller, Modelljahr und Werk ablesen. Modell, Motor und Ausstattung stehen NICHT zuverlässig darin — dafür braucht es Herstellerdaten.',
  },
  engineCode: {
    term: 'Motorcode',
    plain:
      'Die interne Bezeichnung des Herstellers für einen bestimmten Motor, zum Beispiel für die Teilebestellung.',
    whyItMatters:
      'Zwei Motoren mit derselben Literangabe können verschiedene Motorcodes und völlig verschiedene Schwachstellen haben.',
  },
} as const satisfies Record<string, GlossaryEntry>;

export type GlossaryKey = keyof typeof GLOSSARY;

export function explain(key: GlossaryKey): GlossaryEntry {
  return GLOSSARY[key];
}

export const GLOSSARY_KEYS = Object.keys(GLOSSARY) as GlossaryKey[];
