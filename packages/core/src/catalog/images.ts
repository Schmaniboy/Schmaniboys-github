import { DataQuality } from './data-quality';

/**
 * Bildzuordnung.
 *
 * Die Vorgabe ist unmissverstaendlich: Ein Golf 7 vor dem Facelift darf
 * nicht mit einem Facelift-Bild dastehen, ein A4 B9 nicht mit einem B9.5,
 * ein G20 nicht mit einem G20 LCI. Das klingt selbstverstaendlich und ist
 * es in der Umsetzung nicht -- denn der einfache Weg ist immer derselbe:
 * "nimm irgendein Bild dieser Baureihe". Der funktioniert, sieht gut aus
 * und ist falsch.
 *
 * Dieses Modul macht den einfachen Weg unmoeglich. Es unterscheidet drei
 * Zustaende je Merkmal:
 *
 *   passt         Bild und Datensatz nennen denselben Wert.
 *   unbekannt     Einer von beiden nennt keinen -- pruefbar ist es nicht.
 *   widerspricht  Beide nennen einen Wert, und die Werte sind verschieden.
 *
 * Ein einziger Widerspruch schliesst das Bild aus. Kein Punkteabzug, kein
 * "passt trotzdem am besten" -- Ausschluss. Und wo etwas unbekannt bleibt,
 * wird es dem Leser gesagt, statt es als Uebereinstimmung auszugeben.
 */

export const ImageOrigin = {
  MANUFACTURER: 'MANUFACTURER',
  PRESS: 'PRESS',
  WIKIMEDIA: 'WIKIMEDIA',
  ARCHIVE: 'ARCHIVE',
  OWN_PHOTO: 'OWN_PHOTO',
  AI_GENERATED: 'AI_GENERATED',
} as const;
export type ImageOrigin = (typeof ImageOrigin)[keyof typeof ImageOrigin];

export const IMAGE_ORIGIN_VALUES = [
  'MANUFACTURER',
  'PRESS',
  'WIKIMEDIA',
  'ARCHIVE',
  'OWN_PHOTO',
  'AI_GENERATED',
] as const;

/** Rangfolge laut Vorgabe. Kleiner ist besser. */
const HERKUNFT_RANG: Record<ImageOrigin, number> = {
  MANUFACTURER: 0,
  PRESS: 1,
  WIKIMEDIA: 2,
  ARCHIVE: 3,
  OWN_PHOTO: 4,
  AI_GENERATED: 5,
};

export const IMAGE_ORIGIN_LABELS: Record<ImageOrigin, string> = {
  MANUFACTURER: 'Herstellerbild',
  PRESS: 'Pressebild',
  WIKIMEDIA: 'Wikimedia',
  ARCHIVE: 'Archiv',
  OWN_PHOTO: 'Eigene Aufnahme',
  AI_GENERATED: 'KI-erzeugte Darstellung',
};

export const ImageBackground = {
  CUTOUT: 'CUTOUT',
  NEUTRAL: 'NEUTRAL',
  SCENE: 'SCENE',
  UNKNOWN: 'UNKNOWN',
} as const;
export type ImageBackground = (typeof ImageBackground)[keyof typeof ImageBackground];

export const IMAGE_BACKGROUND_VALUES = ['CUTOUT', 'NEUTRAL', 'SCENE', 'UNKNOWN'] as const;

/** Freigestellt schlaegt neutral schlaegt Umgebung. */
const HINTERGRUND_RANG: Record<ImageBackground, number> = {
  CUTOUT: 0,
  NEUTRAL: 1,
  UNKNOWN: 2,
  SCENE: 3,
};

export const ImageKind = {
  VEHICLE_EXTERIOR: 'VEHICLE_EXTERIOR',
  VEHICLE_INTERIOR: 'VEHICLE_INTERIOR',
  VEHICLE_DETAIL: 'VEHICLE_DETAIL',
  EQUIPMENT_PART: 'EQUIPMENT_PART',
  PAINT_SAMPLE: 'PAINT_SAMPLE',
  WHEEL: 'WHEEL',
} as const;
export type ImageKind = (typeof ImageKind)[keyof typeof ImageKind];

export const IMAGE_KIND_VALUES = [
  'VEHICLE_EXTERIOR',
  'VEHICLE_INTERIOR',
  'VEHICLE_DETAIL',
  'EQUIPMENT_PART',
  'PAINT_SAMPLE',
  'WHEEL',
] as const;

// ---------------------------------------------------------------------------

/** Die Bindungen, die ein Bild traegt. Alles offen, weil nicht jedes Bild
 *  alles hergibt -- aber was dasteht, gilt. */
export interface ImageBinding {
  id: string;
  kind: ImageKind;
  generationId?: string | null | undefined;
  faceliftPhaseId?: string | null | undefined;
  bodyTypeId?: string | null | undefined;
  trimLineId?: string | null | undefined;
  powertrainId?: string | null | undefined;
  specialEditionId?: string | null | undefined;
  optionId?: string | null | undefined;
  paintColorId?: string | null | undefined;
  wheelOptionId?: string | null | undefined;
  yearFrom?: number | null | undefined;
  yearTo?: number | null | undefined;
  origin: ImageOrigin;
  background: ImageBackground;
  dataQuality?: DataQuality | null | undefined;
  /** Original, lizenziert oder erzeugt. Bestimmt die Vorrangfolge. */
  sourceType?: ImageSourceType | null | undefined;
  /**
   * Rechtsstand. Fehlt er, gilt das Bild als ungeklaert und wird NICHT
   * ausgewaehlt -- die vorsichtige Voreinstellung ist hier die richtige.
   */
  licenceStatus?: ImageLicenceStatus | null | undefined;
}

/** Wofuer ein Bild gesucht wird. */
export interface ImageRequest {
  kind: ImageKind;
  generationId?: string | null | undefined;
  faceliftPhaseId?: string | null | undefined;
  bodyTypeId?: string | null | undefined;
  trimLineId?: string | null | undefined;
  powertrainId?: string | null | undefined;
  specialEditionId?: string | null | undefined;
  optionId?: string | null | undefined;
  paintColorId?: string | null | undefined;
  wheelOptionId?: string | null | undefined;
  year?: number | null | undefined;
}

/** Die Merkmale, ueber die abgeglichen wird -- in der Reihenfolge ihres
 *  Gewichts fuer das Aussehen des Fahrzeugs. */
const MERKMALE = [
  { schluessel: 'generationId', label: 'Generation', gewicht: 100 },
  { schluessel: 'faceliftPhaseId', label: 'Facelift-Phase', gewicht: 60 },
  { schluessel: 'bodyTypeId', label: 'Karosserie', gewicht: 50 },
  { schluessel: 'specialEditionId', label: 'Sondermodell', gewicht: 20 },
  { schluessel: 'trimLineId', label: 'Ausstattungslinie', gewicht: 12 },
  { schluessel: 'powertrainId', label: 'Motorvariante', gewicht: 8 },
  { schluessel: 'optionId', label: 'Ausstattung', gewicht: 100 },
  { schluessel: 'paintColorId', label: 'Lackfarbe', gewicht: 100 },
  { schluessel: 'wheelOptionId', label: 'Radvariante', gewicht: 100 },
] as const;

export type MatchLevel = 'EXACT' | 'PARTIAL' | 'GENERIC';

export interface ImageMatch<T extends ImageBinding> {
  image: T;
  level: MatchLevel;
  /** Merkmale, die beide Seiten nennen und die uebereinstimmen. */
  matched: string[];
  /** Merkmale, die sich nicht pruefen liessen -- eine Seite schweigt. */
  unchecked: string[];
  /** Was dem Leser ueber die Genauigkeit der Zuordnung gesagt wird. */
  statement: string;
  /** Muss das Bild als erzeugt gekennzeichnet werden? */
  generated: boolean;
}

export interface NoImage {
  image: null;
  /** Der Satz, den die Oberflaeche anzeigt. */
  statement: string;
  /** Wie viele Bilder es gab und woran sie gescheitert sind. */
  rejected: number;
}

export type ImageResult<T extends ImageBinding> = ImageMatch<T> | NoImage;

export function hatBild<T extends ImageBinding>(
  ergebnis: ImageResult<T>,
): ergebnis is ImageMatch<T> {
  return ergebnis.image !== null;
}

/** Der Satz fuer den Fall, dass nichts passt. Woertlich aus der Vorgabe. */
export const KEIN_BILD = 'Kein verifiziertes Bild verfügbar.';

interface Bewertung {
  zulaessig: boolean;
  punkte: number;
  matched: string[];
  unchecked: string[];
  widerspruch: string | null;
}

function bewerte(bild: ImageBinding, gesucht: ImageRequest): Bewertung {
  const matched: string[] = [];
  const unchecked: string[] = [];
  let punkte = 0;

  if (bild.kind !== gesucht.kind) {
    return { zulaessig: false, punkte: 0, matched, unchecked, widerspruch: 'Bildart' };
  }

  for (const merkmal of MERKMALE) {
    const amBild = bild[merkmal.schluessel] ?? null;
    const gefragt = gesucht[merkmal.schluessel] ?? null;

    if (amBild !== null && gefragt !== null) {
      if (amBild !== gefragt) {
        /*
         * Der entscheidende Zweig. Hier faellt ein Facelift-Bild bei einem
         * Vor-Facelift-Fahrzeug heraus -- vollstaendig, nicht mit Abzug.
         * Ein Bild, das nachweislich etwas anderes zeigt, ist kein
         * schlechteres Bild. Es ist ein falsches.
         */
        return {
          zulaessig: false,
          punkte: 0,
          matched,
          unchecked,
          widerspruch: merkmal.label,
        };
      }
      matched.push(merkmal.label);
      punkte += merkmal.gewicht;
    } else if (amBild !== null || gefragt !== null) {
      unchecked.push(merkmal.label);
    }
    // Beide leer: das Merkmal spielt hier keine Rolle, kein Vermerk.
  }

  if (typeof gesucht.year === 'number') {
    const von = bild.yearFrom ?? null;
    const bis = bild.yearTo ?? null;
    if (von !== null && gesucht.year < von) {
      return { zulaessig: false, punkte: 0, matched, unchecked, widerspruch: 'Baujahr' };
    }
    if (bis !== null && gesucht.year > bis) {
      return { zulaessig: false, punkte: 0, matched, unchecked, widerspruch: 'Baujahr' };
    }
    if (von !== null || bis !== null) {
      matched.push('Baujahr');
      punkte += 30;
    } else {
      unchecked.push('Baujahr');
    }
  }

  return { zulaessig: true, punkte, matched, unchecked, widerspruch: null };
}

function satzZu(level: MatchLevel, unchecked: string[], herkunft: ImageOrigin): string {
  const herkunftssatz =
    herkunft === ImageOrigin.AI_GENERATED
      ? ' Das Bild ist erzeugt und zeigt kein tatsächlich gebautes Fahrzeug.'
      : '';

  if (level === 'EXACT') {
    return `Bild passt zu allen erfassten Merkmalen dieses Eintrags.${herkunftssatz}`;
  }
  if (level === 'GENERIC') {
    return (
      'Bild ist keinem der Merkmale dieses Eintrags eindeutig zugeordnet. Es kann eine ' +
      `andere Phase oder Karosserie zeigen.${herkunftssatz}`
    );
  }
  return (
    `Bild passt zu den geprüften Merkmalen. Nicht prüfbar war: ${unchecked.join(', ')}.` +
    herkunftssatz
  );
}

/**
 * Das beste zulaessige Bild -- oder keines.
 *
 * Sortierung bei Gleichstand: mehr uebereinstimmende Merkmale, dann bessere
 * Herkunft, dann besser freigestellt, dann bessere Datenguete. Erzeugte
 * Bilder stehen dadurch immer hinten und kommen nur zum Zug, wenn es sonst
 * nichts gibt.
 */
export function waehleBild<T extends ImageBinding>(
  bilder: T[],
  gesucht: ImageRequest,
): ImageResult<T> {
  /*
   * Zuerst der Rechtsstand, dann alles Weitere.
   *
   * Ein Bild mit ungeklaerter Nutzung ist kein schlechteres Bild -- es ist
   * eines, das gar nicht erscheinen darf. Diese Pruefung steht deshalb VOR
   * der Zuordnung und nicht als Punktabzug darin.
   */
  const nutzbar = bilder.filter((bild) =>
    bild.licenceStatus ? darfVeroeffentlichtWerden({ licenceStatus: bild.licenceStatus }) : false,
  );
  const rechtlichGesperrt = bilder.length - nutzbar.length;

  const bewertet = nutzbar
    .map((bild) => ({ bild, bewertung: bewerte(bild, gesucht) }))
    .filter((eintrag) => eintrag.bewertung.zulaessig);

  const verworfen = nutzbar.length - bewertet.length;

  if (bewertet.length === 0) {
    const gruende: string[] = [];
    if (verworfen > 0) {
      gruende.push(
        `${verworfen} vorhandene ${
          verworfen === 1 ? 'Aufnahme zeigt' : 'Aufnahmen zeigen'
        } nachweislich eine andere Ausführung.`,
      );
    }
    if (rechtlichGesperrt > 0) {
      gruende.push(
        `${rechtlichGesperrt} weitere ${
          rechtlichGesperrt === 1 ? 'Aufnahme ist' : 'Aufnahmen sind'
        } rechtlich nicht geklärt.`,
      );
    }

    return {
      image: null,
      statement: gruende.length > 0 ? `${KEIN_BILD} ${gruende.join(' ')}` : KEIN_BILD,
      rejected: verworfen + rechtlichGesperrt,
    };
  }

  bewertet.sort((a, b) => {
    if (b.bewertung.punkte !== a.bewertung.punkte) {
      return b.bewertung.punkte - a.bewertung.punkte;
    }
    /*
     * Die Vorrangfolge der Vorgabe: Original vor lizenziert vor erzeugt.
     * Sie steht VOR der Fundort-Rangfolge -- ein aufgefundenes Archivbild
     * schlaegt eine erzeugte Darstellung, auch wenn der Fundort schlechter
     * ist.
     */
    const art =
      SOURCE_TYPE_RANG[a.bild.sourceType ?? ImageSourceType.ORIGINAL] -
      SOURCE_TYPE_RANG[b.bild.sourceType ?? ImageSourceType.ORIGINAL];
    if (art !== 0) return art;

    const herkunft = HERKUNFT_RANG[a.bild.origin] - HERKUNFT_RANG[b.bild.origin];
    if (herkunft !== 0) return herkunft;
    const hintergrund =
      HINTERGRUND_RANG[a.bild.background] - HINTERGRUND_RANG[b.bild.background];
    if (hintergrund !== 0) return hintergrund;
    return a.bewertung.unchecked.length - b.bewertung.unchecked.length;
  });

  const beste = bewertet[0] as { bild: T; bewertung: Bewertung };
  const { matched, unchecked } = beste.bewertung;

  const level: MatchLevel =
    matched.length === 0 ? 'GENERIC' : unchecked.length === 0 ? 'EXACT' : 'PARTIAL';

  return {
    image: beste.bild,
    level,
    matched,
    unchecked,
    statement: satzZu(level, unchecked, beste.bild.origin),
    generated: beste.bild.origin === ImageOrigin.AI_GENERATED,
  };
}

/**
 * Taugt das Bild fuer die Katalogansicht?
 *
 * Ein Fahrzeug vor fremden Autos auf einem Parkplatz ist ein Beleg, aber
 * kein Katalogbild. Die Trennung steht hier und nicht in der Komponente,
 * damit sie ueberall gleich ausfaellt.
 */
export function taugtFuerKatalog(bild: ImageBinding): boolean {
  return bild.background === ImageBackground.CUTOUT || bild.background === ImageBackground.NEUTRAL;
}

// ---------------------------------------------------------------------------
// Pflichtangaben je Herkunft
// ---------------------------------------------------------------------------

export interface ImageMetadataForCheck {
  origin: ImageOrigin;
  sourceUrl?: string | null | undefined;
  sourceTitle?: string | null | undefined;
  author?: string | null | undefined;
  licence?: string | null | undefined;
  description?: string | null | undefined;
  generatedByModel?: string | null | undefined;
  generatedPrompt?: string | null | undefined;
}

/**
 * Was ein Bild mitbringen muss, um gespeichert werden zu duerfen.
 *
 * Bei uebernommenen Bildern: Fundstelle, Titel, Urheber. Bei erzeugten:
 * Modell und Anweisung -- sonst liesse sich spaeter nicht mehr sagen, wie
 * das Bild entstanden ist, und es waere von einer Aufnahme nicht mehr zu
 * unterscheiden. Immer: Lizenz und Bildunterschrift.
 */
export function pruefeBildangaben(bild: ImageMetadataForCheck): Record<string, string[]> {
  const fehler: Record<string, string[]> = {};
  const leer = (wert: string | null | undefined) => !wert || wert.trim().length === 0;

  if (leer(bild.licence)) {
    fehler.licence = ['Ohne Lizenzangabe wird kein Bild gespeichert.'];
  }
  if (leer(bild.description)) {
    fehler.description = [
      'Eine Bildunterschrift ist Pflicht. Ein Bild ohne Beschreibung ist beliebig deutbar und taugt als Beleg nicht.',
    ];
  }

  if (bild.origin === ImageOrigin.AI_GENERATED) {
    if (leer(bild.generatedByModel)) {
      fehler.generatedByModel = [
        'Bei einem erzeugten Bild muss das verwendete Modell festgehalten werden.',
      ];
    }
    if (leer(bild.generatedPrompt)) {
      fehler.generatedPrompt = [
        'Bei einem erzeugten Bild muss die Anweisung festgehalten werden — sonst lässt sich später nicht mehr nachvollziehen, was das Bild zeigen sollte.',
      ];
    }
    return fehler;
  }

  if (leer(bild.sourceUrl)) {
    fehler.sourceUrl = ['Ohne Fundstelle ist die Herkunft nicht nachprüfbar.'];
  }
  if (leer(bild.sourceTitle)) {
    fehler.sourceTitle = ['Bitte die Unterlage oder Seite benennen, aus der das Bild stammt.'];
  }
  if (leer(bild.author)) {
    fehler.author = ['Urheber bzw. Rechteinhaber ist Pflicht.'];
  }

  return fehler;
}

// ---------------------------------------------------------------------------
// Herkunftsart und Lizenzstand
// ---------------------------------------------------------------------------

/**
 * Was das Bild rechtlich und inhaltlich ist.
 *
 * Groeber als ImageOrigin und aus einem anderen Grund da: `origin` sagt, WO
 * das Bild gefunden wurde, `sourceType` sagt, WAS es ist. Die Reihenfolge ist
 * die Vorrangfolge der Vorgabe: Original vor lizenziert vor erzeugt.
 */
export const ImageSourceType = {
  ORIGINAL: 'ORIGINAL',
  LICENSED: 'LICENSED',
  GENERATED: 'GENERATED',
} as const;
export type ImageSourceType = (typeof ImageSourceType)[keyof typeof ImageSourceType];

export const IMAGE_SOURCE_TYPE_VALUES = ['ORIGINAL', 'LICENSED', 'GENERATED'] as const;

export const IMAGE_SOURCE_TYPE_LABELS: Record<ImageSourceType, string> = {
  ORIGINAL: 'Originalaufnahme',
  LICENSED: 'Lizenziertes Bild',
  GENERATED: 'KI-erzeugte Darstellung',
};

const SOURCE_TYPE_RANG: Record<ImageSourceType, number> = {
  ORIGINAL: 0,
  LICENSED: 1,
  GENERATED: 2,
};

export const ImageLicenceStatus = {
  CLEARED: 'CLEARED',
  ATTRIBUTION_REQUIRED: 'ATTRIBUTION_REQUIRED',
  EDITORIAL_ONLY: 'EDITORIAL_ONLY',
  UNCLEAR: 'UNCLEAR',
  NOT_CLEARED: 'NOT_CLEARED',
} as const;
export type ImageLicenceStatus =
  (typeof ImageLicenceStatus)[keyof typeof ImageLicenceStatus];

export const IMAGE_LICENCE_STATUS_VALUES = [
  'CLEARED',
  'ATTRIBUTION_REQUIRED',
  'EDITORIAL_ONLY',
  'UNCLEAR',
  'NOT_CLEARED',
] as const;

export const IMAGE_LICENCE_STATUS_LABELS: Record<ImageLicenceStatus, string> = {
  CLEARED: 'Nutzung geklärt',
  ATTRIBUTION_REQUIRED: 'Nutzung geklärt, Urhebernennung Pflicht',
  EDITORIAL_ONLY: 'nur redaktionell',
  UNCLEAR: 'Rechtsstand unklar',
  NOT_CLEARED: 'nicht nutzbar',
};

/**
 * Darf dieses Bild oeffentlich gezeigt werden?
 *
 * Ausdruecklich eine harte Sperre und keine Empfehlung. Ein Bild mit
 * unklarem Rechtsstand anzuzeigen ist kein Schoenheitsfehler -- es ist eine
 * Rechtsverletzung mit Namen und Anschrift des Betreibers dran.
 */
export function darfVeroeffentlichtWerden(bild: {
  licenceStatus: ImageLicenceStatus;
}): boolean {
  return (
    bild.licenceStatus === ImageLicenceStatus.CLEARED ||
    bild.licenceStatus === ImageLicenceStatus.ATTRIBUTION_REQUIRED
  );
}

/** Muss der Urheber sichtbar genannt werden? */
export function urhebernennungPflicht(bild: { licenceStatus: ImageLicenceStatus }): boolean {
  return bild.licenceStatus === ImageLicenceStatus.ATTRIBUTION_REQUIRED;
}

/**
 * Passen Herkunft und Herkunftsart zusammen?
 *
 * Zwei Felder, die dasselbe teilweise beschreiben, laufen sonst auseinander
 * -- und ein Bild, das als Originalaufnahme gilt und in Wahrheit erzeugt
 * ist, waere die schlimmste Form dieses Fehlers.
 */
export function pruefeHerkunftsart(bild: {
  origin: ImageOrigin;
  sourceType: ImageSourceType;
}): Record<string, string[]> {
  const fehler: Record<string, string[]> = {};

  const istErzeugt = bild.origin === ImageOrigin.AI_GENERATED;
  const alsErzeugt = bild.sourceType === ImageSourceType.GENERATED;

  if (istErzeugt && !alsErzeugt) {
    fehler.sourceType = [
      'Ein Bild mit der Herkunft „KI-Erzeugung" muss als erzeugt eingeordnet sein. Alles andere würde eine Darstellung als Aufnahme ausgeben.',
    ];
  }
  if (alsErzeugt && !istErzeugt) {
    fehler.origin = [
      'Als erzeugt eingeordnete Bilder brauchen die Herkunft „KI-Erzeugung" — sonst fehlen Modell und Anweisung.',
    ];
  }

  return fehler;
}

// ---------------------------------------------------------------------------
// Anweisung fuer ein erzeugtes Bild
// ---------------------------------------------------------------------------

/** Was ein erzeugtes Bild zeigen soll -- nur aus belegten Angaben. */
export interface GenerationSubject {
  manufacturer: string;
  model: string;
  generation?: string | null | undefined;
  generationCode?: string | null | undefined;
  faceliftPhase?: string | null | undefined;
  bodyType?: string | null | undefined;
  yearFrom?: number | null | undefined;
  yearTo?: number | null | undefined;
  paintColor?: string | null | undefined;
  /** Ausstattung, die am Fahrzeug sichtbar ist und belegt vorliegt. */
  visibleEquipment?: string[] | undefined;
}

export interface GenerationPrompt {
  /** Die Anweisung selbst. */
  prompt: string;
  /** Welche Merkmale darin belegt sind. Wird am Bild gespeichert. */
  coveredFields: string[];
  /**
   * Merkmale, die das Bild zwangslaeufig zeigt, ohne dass sie belegt sind.
   *
   * Ein erzeugtes Bild hat immer Scheinwerfer, Rueckleuchten und eine
   * Karosserieform -- auch wenn wir nicht wissen, wie sie an dieser Phase
   * aussahen. Diese Liste ist der ehrliche Teil: Sie sagt, worauf man sich
   * an diesem Bild NICHT verlassen darf.
   */
  unverifiedAspects: string[];
  /** Ob sich eine Erzeugung ueberhaupt lohnt. */
  sufficient: boolean;
  /** Warum nicht, wenn nicht. */
  reason: string | null;
}

/**
 * Baut die Anweisung fuer ein erzeugtes Fahrzeugbild.
 *
 * Der springende Punkt von Vorgabe 4: Ein erzeugtes Bild darf keine
 * Fahrzeugdaten erfinden. Es kann das nicht vollstaendig einhalten -- ein
 * Bild zeigt immer Scheinwerfer, auch wenn niemand weiss, welche. Was es
 * einhalten kann, ist:
 *
 * - In die Anweisung kommt AUSSCHLIESSLICH, was belegt vorliegt. Nichts
 *   wird ergaenzt, damit die Beschreibung vollstaendiger klingt.
 * - Was nicht belegt ist, wird als nicht verifiziert ausgewiesen und mit
 *   dem Bild gespeichert.
 * - Ohne Generation und Karosserie gibt es gar keine Erzeugung. Ein Bild,
 *   das nur "BMW 3er" kennt, waere eine Vermischung mehrerer Generationen --
 *   genau das, was die Vorgabe ausschliesst.
 */
export function baueBildAnweisung(subjekt: GenerationSubject): GenerationPrompt {
  const belegt: string[] = [];
  const offen: string[] = [];
  const teile: string[] = [];

  teile.push(`${subjekt.manufacturer} ${subjekt.model}`);
  belegt.push('manufacturer', 'model');

  if (subjekt.generationCode || subjekt.generation) {
    const bezeichnung = subjekt.generationCode
      ? `Baureihe ${subjekt.generationCode}`
      : (subjekt.generation as string);
    teile.push(bezeichnung);
    belegt.push('generation');
  } else {
    offen.push('Generation');
  }

  if (subjekt.faceliftPhase) {
    teile.push(subjekt.faceliftPhase);
    belegt.push('faceliftPhase');
  } else {
    offen.push('Facelift-Phase (Scheinwerfer, Rückleuchten, Stoßfänger)');
  }

  if (subjekt.bodyType) {
    teile.push(subjekt.bodyType);
    belegt.push('bodyType');
  } else {
    offen.push('Karosserieform');
  }

  if (subjekt.yearFrom) {
    teile.push(
      subjekt.yearTo && subjekt.yearTo !== subjekt.yearFrom
        ? `Baujahre ${subjekt.yearFrom} bis ${subjekt.yearTo}`
        : `Baujahr ${subjekt.yearFrom}`,
    );
    belegt.push('year');
  } else {
    offen.push('Baujahr');
  }

  if (subjekt.paintColor) {
    teile.push(`Lackfarbe ${subjekt.paintColor}`);
    belegt.push('paintColor');
  } else {
    offen.push('Lackfarbe');
  }

  const ausstattung = (subjekt.visibleEquipment ?? []).filter((eintrag) => eintrag.trim());
  if (ausstattung.length > 0) {
    teile.push(`sichtbare Ausstattung: ${ausstattung.join(', ')}`);
    belegt.push('visibleEquipment');
  } else {
    offen.push('Ausstattungsdetails (Felgen, Leuchten, Anbauteile)');
  }

  /*
   * Ohne Generation UND Karosserie ist die Beschreibung so unbestimmt, dass
   * das Modell zwangslaeufig Merkmale mehrerer Generationen mischt. Dann
   * lieber kein Bild.
   */
  const ausreichend = belegt.includes('generation') && belegt.includes('bodyType');

  const anweisung = [
    'Fotorealistische Katalogaufnahme eines Fahrzeugs, Dreiviertelansicht von vorn links.',
    `Fahrzeug: ${teile.join(', ')}.`,
    'Freigestellt vor neutralem, einfarbigem Hintergrund. Vollständig im Bild, korrekte Proportionen.',
    'Keine Menschen, keine anderen Fahrzeuge, keine Straße, keine Gebäude, keine Beschriftung.',
    'Keine Merkmale anderer Generationen oder Modellpflegen hinzufügen.',
  ].join(' ');

  return {
    prompt: anweisung,
    coveredFields: belegt,
    unverifiedAspects: offen,
    sufficient: ausreichend,
    reason: ausreichend
      ? null
      : 'Für eine Erzeugung fehlen Generation oder Karosserieform. Ohne sie mischt die ' +
        'Darstellung zwangsläufig Merkmale mehrerer Generationen — dann lieber kein Bild.',
  };
}
