/**
 * Suchbegriffe verstehen, bevor die Datenbank gefragt wird.
 *
 * Ein Mensch tippt "BMW 320d G20", "DBKA" oder "Golf 7 Panorama". Das ist
 * dreimal eine voellig andere Frage:
 *
 *   BMW 320d G20    Marke + Modellvariante + Baureihenkuerzel
 *   DBKA            ein Motorcode -- vier Zeichen, sonst nichts
 *   Golf 7 Panorama Modell + Generationsnummer + eine Ausstattung
 *
 * Wer das alles in ein LIKE '%...%' ueber den Fahrzeugnamen kippt, findet
 * beim zweiten Fall nichts und beim dritten das Falsche. Dieses Modul
 * zerlegt die Eingabe in Bestandteile, DAMIT die Abfrage gezielt suchen
 * kann. Es raet nicht -- was es nicht erkennt, bleibt Volltext.
 */

export const TokenKind = {
  /** Baureihenkuerzel, etwa "G20", "E90", "B9", "MK7". */
  GENERATION_CODE: 'GENERATION_CODE',
  /** Motorcode, etwa "DBKA", "N47D20", "CJXC". */
  ENGINE_CODE: 'ENGINE_CODE',
  /** Ausstattungscode, etwa "S610A", "PR-7X2". */
  OPTION_CODE: 'OPTION_CODE',
  /** Generationsnummer, etwa die 7 in "Golf 7". */
  GENERATION_NUMBER: 'GENERATION_NUMBER',
  /** Baujahr, vierstellig. */
  YEAR: 'YEAR',
  /** Leistungsangabe, etwa "150 PS" oder "110 kW". */
  POWER: 'POWER',
  /** Alles Uebrige: Marke, Modell, Ausstattungswort. */
  WORD: 'WORD',
} as const;

export type TokenKind = (typeof TokenKind)[keyof typeof TokenKind];

export interface SearchToken {
  kind: TokenKind;
  /** Wie es dastand. */
  raw: string;
  /** Vereinheitlicht: Grossbuchstaben ohne Trennzeichen bzw. Zahl. */
  value: string;
}

export interface ParsedQuery {
  tokens: SearchToken[];
  /** Die Woerter, die als Volltext weitergegeben werden. */
  words: string[];
  generationCodes: string[];
  engineCodes: string[];
  optionCodes: string[];
  generationNumbers: number[];
  years: number[];
  powerPs: number[];
  powerKw: number[];
  /** Wurde ueberhaupt etwas Strukturiertes erkannt? */
  structured: boolean;
}

/** Aeltestes plausibles Baujahr. Davor gab es keine Baureihen im Katalogsinn. */
const JAHR_MIN = 1950;
const JAHR_MAX = 2100;

/*
 * Baureihenkuerzel.
 *
 * Ein Buchstabe und zwei bis drei Ziffern (G20, E90, W205, B9 mit einer
 * Ziffer), oder "MK" plus Ziffer. Die Muster sind bewusst eng: "A3" ist ein
 * Modellname, kein Baureihenkuerzel, und darf nicht als solches durchgehen.
 */
const GENERATION_CODE = /^(?:[A-Z]{1,2}\d{2,3}[A-Z]?|MK\d{1,2})$/;

/*
 * Motorcode.
 *
 * Zwei Familien: die reinen Vier- bis Fuenfzeichencodes des VW-Konzerns
 * (DBKA, CJXC) und die laengeren Kennungen anderer Hersteller (N47D20,
 * OM651). Beide bestehen ausschliesslich aus Grossbuchstaben und Ziffern
 * und enthalten mindestens zwei Buchstaben -- daran unterscheiden sie sich
 * von Baureihenkuerzeln.
 */
const ENGINE_CODE_KURZ = /^[A-Z]{3,4}[A-Z0-9]?$/;
const ENGINE_CODE_LANG = /^[A-Z]{1,3}\d{2,3}[A-Z]\d{2,3}$/;

/*
 * Der reine Buchstabencode laesst sich nicht von einem gewoehnlichen Wort
 * unterscheiden: "DBKA" und "KOMBI" haben dieselbe Form. Was sie
 * unterscheidet, ist die Schreibweise des Menschen -- wer einen Motorcode
 * sucht, tippt ihn gross, wer nach einem Kombi sucht, nicht.
 *
 * Das ist kein perfektes Signal, aber ein ehrliches: Im Zweifel wird der
 * Teil als gewoehnliches Wort behandelt. Ein zu Unrecht als Motorcode
 * gelesenes Wort waere schlimmer -- es erzeugt die Zeile "Verstanden als:
 * Motorcode KOMBI" und damit sichtbaren Unsinn.
 */
function wirktWieCode(roh: string): boolean {
  return roh === roh.toUpperCase() && /[A-Z]/.test(roh);
}

/*
 * Ausstattungscodes.
 *
 * BMW: S gefolgt von drei Ziffern und einem Buchstaben (S610A).
 * VW/Audi: PR-Nummern, drei Zeichen aus Ziffern und Buchstaben, in der
 * Praxis meist mit vorangestelltem "PR" geschrieben.
 */
const OPTION_CODE_BMW = /^S\d{3}[A-Z]$/;
const OPTION_CODE_PR = /^PR[- ]?([0-9A-Z]{3})$/;

const LEISTUNG = /^(\d{2,4})(PS|KW)$/;

/** Woerter, die nie als Suchbegriff taugen. */
const FUELLWOERTER = new Set(['der', 'die', 'das', 'mit', 'und', 'von', 'ein', 'eine']);

function normalisiere(rohteil: string): string {
  return rohteil.toUpperCase().replace(/[.,;:!?]+$/g, '');
}

/**
 * Zerlegt eine Eingabe.
 *
 * Die Reihenfolge der Pruefungen ist Absicht und nicht beliebig: Der engste
 * Test kommt zuerst. Waere die Motorcode-Pruefung vor der
 * Baureihenpruefung, ginge "G20" als Motorcode durch.
 */
export function zerlegeSuche(eingabe: string): ParsedQuery {
  const tokens: SearchToken[] = [];

  const einzelteile = eingabe
    .split(/[\s/]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0)
    .slice(0, 12); // Eine Suche mit mehr Teilen ist keine Suche mehr.

  /*
   * "190 PS" schreibt jeder Mensch mit Leerzeichen. Ohne diesen Schritt
   * zerfaellt die Angabe in die Zahl 190 und das Wort PS -- und beide sind
   * einzeln wertlos.
   */
  const rohteile: string[] = [];
  for (let i = 0; i < einzelteile.length; i += 1) {
    const teil = einzelteile[i] as string;
    const naechster = einzelteile[i + 1];
    if (/^\d{2,4}$/.test(teil) && naechster && /^(ps|kw)$/i.test(naechster)) {
      rohteile.push(`${teil}${naechster}`);
      i += 1;
      continue;
    }
    rohteile.push(teil);
  }

  for (const roh of rohteile) {
    const wert = normalisiere(roh);
    if (wert.length === 0) continue;

    const leistung = LEISTUNG.exec(wert.replace(/\s+/g, ''));
    if (leistung) {
      tokens.push({ kind: TokenKind.POWER, raw: roh, value: wert.replace(/\s+/g, '') });
      continue;
    }

    if (/^\d{4}$/.test(wert)) {
      const jahr = Number(wert);
      if (jahr >= JAHR_MIN && jahr <= JAHR_MAX) {
        tokens.push({ kind: TokenKind.YEAR, raw: roh, value: wert });
        continue;
      }
    }

    if (/^\d{1,2}$/.test(wert)) {
      tokens.push({ kind: TokenKind.GENERATION_NUMBER, raw: roh, value: wert });
      continue;
    }

    if (OPTION_CODE_BMW.test(wert)) {
      tokens.push({ kind: TokenKind.OPTION_CODE, raw: roh, value: wert });
      continue;
    }
    const pr = OPTION_CODE_PR.exec(wert);
    if (pr) {
      tokens.push({ kind: TokenKind.OPTION_CODE, raw: roh, value: pr[1] as string });
      continue;
    }

    if (GENERATION_CODE.test(wert)) {
      tokens.push({ kind: TokenKind.GENERATION_CODE, raw: roh, value: wert });
      continue;
    }

    /*
     * Die lange Form (N47D20, OM651) ist eindeutig -- sie enthaelt Ziffern
     * mitten im Wort und kommt in keiner Sprache vor. Die kurze Form
     * (DBKA) nur dann, wenn sie gross geschrieben eingegeben wurde.
     *
     * In beiden Faellen bleibt der Teil ZUSAETZLICH ein Wort: Wer "DBKA"
     * sucht, soll auch etwas finden, wenn der Code so nicht erfasst ist,
     * aber im Motornamen steht.
     */
    if (ENGINE_CODE_LANG.test(wert) || (ENGINE_CODE_KURZ.test(wert) && wirktWieCode(roh))) {
      tokens.push({ kind: TokenKind.ENGINE_CODE, raw: roh, value: wert });
      tokens.push({ kind: TokenKind.WORD, raw: roh, value: wert });
      continue;
    }

    if (!FUELLWOERTER.has(wert.toLowerCase())) {
      tokens.push({ kind: TokenKind.WORD, raw: roh, value: wert });
    }
  }

  const nach = (kind: TokenKind) => tokens.filter((t) => t.kind === kind);

  const leistungen = nach(TokenKind.POWER).map((t) => LEISTUNG.exec(t.value));
  const powerPs: number[] = [];
  const powerKw: number[] = [];
  for (const treffer of leistungen) {
    if (!treffer) continue;
    const zahl = Number(treffer[1]);
    if (treffer[2] === 'PS') powerPs.push(zahl);
    else powerKw.push(zahl);
  }

  const generationCodes = nach(TokenKind.GENERATION_CODE).map((t) => t.value);
  const engineCodes = nach(TokenKind.ENGINE_CODE).map((t) => t.value);
  const optionCodes = nach(TokenKind.OPTION_CODE).map((t) => t.value);

  return {
    tokens,
    words: nach(TokenKind.WORD).map((t) => t.raw),
    generationCodes,
    engineCodes,
    optionCodes,
    generationNumbers: nach(TokenKind.GENERATION_NUMBER).map((t) => Number(t.value)),
    years: nach(TokenKind.YEAR).map((t) => Number(t.value)),
    powerPs,
    powerKw,
    structured:
      generationCodes.length > 0 ||
      engineCodes.length > 0 ||
      optionCodes.length > 0 ||
      powerPs.length > 0 ||
      powerKw.length > 0,
  };
}

/**
 * Was die Suche verstanden hat, in einem Satz fuer den Menschen.
 *
 * Wird ueber den Treffern angezeigt. Wer "DBKA" eingibt und eine Liste
 * Fahrzeuge bekommt, soll lesen koennen, dass wir das als Motorcode gelesen
 * haben -- und nicht raten muessen, warum diese Treffer.
 */
export function erklaereSuche(zerlegt: ParsedQuery): string | null {
  const teile: string[] = [];
  if (zerlegt.engineCodes.length > 0)
    teile.push(`Motorcode ${zerlegt.engineCodes.join(', ')}`);
  if (zerlegt.generationCodes.length > 0)
    teile.push(`Baureihe ${zerlegt.generationCodes.join(', ')}`);
  if (zerlegt.optionCodes.length > 0)
    teile.push(`Ausstattungscode ${zerlegt.optionCodes.join(', ')}`);
  if (zerlegt.years.length > 0) teile.push(`Baujahr ${zerlegt.years.join(', ')}`);
  if (zerlegt.powerPs.length > 0) teile.push(`${zerlegt.powerPs.join(', ')} PS`);
  if (zerlegt.powerKw.length > 0) teile.push(`${zerlegt.powerKw.join(', ')} kW`);
  if (zerlegt.generationNumbers.length > 0)
    teile.push(`Generation ${zerlegt.generationNumbers.join(', ')}`);

  if (teile.length === 0) return null;
  return `Verstanden als: ${teile.join(' · ')}.`;
}
