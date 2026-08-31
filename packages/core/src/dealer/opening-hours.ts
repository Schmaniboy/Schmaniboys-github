import { errors } from '../errors';

/**
 * Oeffnungszeiten.
 *
 * Gerechnet wird in Minuten seit Mitternacht, nicht in Zeitstempeln:
 * Oeffnungszeiten sind Ortszeit. "Dienstag 8 bis 18 Uhr" gilt im Sommer wie
 * im Winter, und ein Zeitstempel muesste dafuer jedes Mal umgerechnet werden.
 */

export const WOCHENTAGE = [
  { nummer: 1, kurz: 'Mo', lang: 'Montag' },
  { nummer: 2, kurz: 'Di', lang: 'Dienstag' },
  { nummer: 3, kurz: 'Mi', lang: 'Mittwoch' },
  { nummer: 4, kurz: 'Do', lang: 'Donnerstag' },
  { nummer: 5, kurz: 'Fr', lang: 'Freitag' },
  { nummer: 6, kurz: 'Sa', lang: 'Samstag' },
  { nummer: 7, kurz: 'So', lang: 'Sonntag' },
] as const;

export interface Zeitspanne {
  weekday: number;
  opensMinute: number;
  closesMinute: number;
}

const TAG_IN_MINUTEN = 24 * 60;

export function minutenZuUhrzeit(minuten: number): string {
  const stunde = Math.floor(minuten / 60);
  const minute = minuten % 60;
  return `${String(stunde).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

/** "08:30" zu 510. Gibt null zurueck, wenn die Eingabe keine Uhrzeit ist. */
export function uhrzeitZuMinuten(text: string): number | null {
  const treffer = /^(\d{1,2}):(\d{2})$/.exec(text.trim());
  if (!treffer) return null;

  const stunde = Number(treffer[1]);
  const minute = Number(treffer[2]);
  if (stunde > 23 || minute > 59) return null;
  return stunde * 60 + minute;
}

/**
 * Prueft einen ganzen Satz Zeitspannen.
 *
 * Der Punkt sind die Ueberschneidungen: "08:00-18:00" und "12:00-14:00" am
 * selben Tag ergibt keinen Sinn und wuerde in der Anzeige als zwei getrennte
 * Zeitfenster erscheinen. Solche Faelle entstehen beim Bearbeiten leicht.
 */
export function pruefeZeitspannen(spannen: Zeitspanne[]): void {
  const fehler: Record<string, string[]> = {};

  for (const spanne of spannen) {
    const tag = WOCHENTAGE.find((eintrag) => eintrag.nummer === spanne.weekday);
    if (!tag) {
      fehler.weekday = ['Wochentag muss zwischen 1 (Montag) und 7 (Sonntag) liegen.'];
      continue;
    }
    if (spanne.opensMinute < 0 || spanne.closesMinute > TAG_IN_MINUTEN) {
      fehler[tag.kurz] = ['Uhrzeiten müssen innerhalb eines Tages liegen.'];
      continue;
    }
    if (spanne.closesMinute <= spanne.opensMinute) {
      fehler[tag.kurz] = [
        `${tag.lang}: Die Schließzeit muss nach der Öffnungszeit liegen. ` +
          'Über Mitternacht hinaus lässt sich hier nicht eintragen.',
      ];
    }
  }

  for (const tag of WOCHENTAGE) {
    const desTages = spannen
      .filter((spanne) => spanne.weekday === tag.nummer)
      .sort((links, rechts) => links.opensMinute - rechts.opensMinute);

    for (let index = 1; index < desTages.length; index += 1) {
      const vorher = desTages[index - 1];
      const jetzt = desTages[index];
      if (!vorher || !jetzt) continue;
      if (jetzt.opensMinute < vorher.closesMinute) {
        fehler[tag.kurz] = [
          `${tag.lang}: Die Zeitfenster ${minutenZuUhrzeit(vorher.opensMinute)}–` +
            `${minutenZuUhrzeit(vorher.closesMinute)} und ` +
            `${minutenZuUhrzeit(jetzt.opensMinute)}–${minutenZuUhrzeit(jetzt.closesMinute)} ` +
            'überschneiden sich.',
        ];
      }
    }
  }

  if (Object.keys(fehler).length > 0) throw errors.validation(fehler);
}

export interface TagesZeiten {
  weekday: number;
  kurz: string;
  lang: string;
  spannen: { von: string; bis: string }[];
  geschlossen: boolean;
}

/**
 * Bringt die Zeitspannen in eine Form, die sich anzeigen laesst.
 *
 * Tage ohne Eintrag erscheinen ausdruecklich als "geschlossen" -- sie
 * einfach wegzulassen liesse offen, ob geschlossen ist oder nur nichts
 * eingetragen wurde.
 */
export function nachWochentagen(spannen: Zeitspanne[]): TagesZeiten[] {
  return WOCHENTAGE.map((tag) => {
    const desTages = spannen
      .filter((spanne) => spanne.weekday === tag.nummer)
      .sort((links, rechts) => links.opensMinute - rechts.opensMinute);

    return {
      weekday: tag.nummer,
      kurz: tag.kurz,
      lang: tag.lang,
      spannen: desTages.map((spanne) => ({
        von: minutenZuUhrzeit(spanne.opensMinute),
        bis: minutenZuUhrzeit(spanne.closesMinute),
      })),
      geschlossen: desTages.length === 0,
    };
  });
}

/**
 * Ob gerade geoeffnet ist.
 *
 * `jetzt` wird uebergeben, nicht hier erzeugt -- sonst waere die Funktion
 * nicht bestimmbar und damit nicht sinnvoll testbar. Gerechnet wird mit der
 * lokalen Zeit des uebergebenen Datums; die Zeitzone der Anwendung ist die
 * des Betriebs.
 */
export function istGeoeffnet(spannen: Zeitspanne[], jetzt: Date): boolean {
  // getDay() liefert 0 fuer Sonntag, wir zaehlen nach ISO 1..7.
  const wochentag = jetzt.getDay() === 0 ? 7 : jetzt.getDay();
  const minuten = jetzt.getHours() * 60 + jetzt.getMinutes();

  return spannen.some(
    (spanne) =>
      spanne.weekday === wochentag &&
      minuten >= spanne.opensMinute &&
      minuten < spanne.closesMinute,
  );
}
