import { AvailabilityKind, istSerie } from './availability';
import { EQUIPMENT_AREA_LABELS, EquipmentArea } from './equipment-areas';

/**
 * Ausstattungschecker.
 *
 * Die Frage, die ein Gebrauchtwagenkaeufer wirklich hat, ist nicht "was hat
 * das Auto", sondern "was hat es von dem, was es haben KONNTE". Ein Golf mit
 * fuenf Extras ist gut ausgestattet; ein 7er mit fuenf Extras ist nackt.
 * Ohne den Bezug auf das damalige Angebot ist jede Zahl bedeutungslos.
 *
 * Deshalb rechnet der Checker gegen die erfasste Verfuegbarkeit dieser
 * Generation -- und sagt ausdruecklich dazu, dass er nur das kennt, was
 * erfasst ist (Vorgabe 24).
 */

export interface CheckOption {
  optionId: string;
  name: string;
  optionCode?: string | null | undefined;
  area?: EquipmentArea | null | undefined;
  kind: AvailabilityKind;
  /** HIGH | MEDIUM | LOW -- oder nicht erfasst. */
  purchaseRelevance?: 'HIGH' | 'MEDIUM' | 'LOW' | null | undefined;
  resaleRelevance?: 'HIGH' | 'MEDIUM' | 'LOW' | null | undefined;
  rarity?: 'COMMON' | 'UNCOMMON' | 'RARE' | 'VERY_RARE' | null | undefined;
  packageName?: string | null | undefined;
  specialEditionName?: string | null | undefined;
}

export interface CheckInput {
  /** Alles, was fuer diese Auswahl erfasst ist. */
  available: CheckOption[];
  /** Was am Fahrzeug festgestellt wurde. */
  presentOptionIds: string[];
}

/**
 * Gewichtung nach Kaufrelevanz.
 *
 * Eine Sitzheizung und ein Head-up-Display gleich zu zaehlen waere eine
 * Scheingenauigkeit. Fehlt die Relevanz, gilt das mittlere Gewicht -- nicht
 * null, denn "nicht erfasst" heisst nicht "unwichtig". Dass gewichtet wurde,
 * ohne alle Werte zu kennen, steht im Ergebnis.
 */
const GEWICHT: Record<'HIGH' | 'MEDIUM' | 'LOW', number> = {
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};
const GEWICHT_UNBEKANNT = 2;

function gewichtVon(option: CheckOption): number {
  return option.purchaseRelevance ? GEWICHT[option.purchaseRelevance] : GEWICHT_UNBEKANNT;
}

export interface CheckAreaResult {
  area: EquipmentArea;
  label: string;
  present: number;
  optionalTotal: number;
  percent: number | null;
}

export interface CheckResult {
  /**
   * Ausstattungsgrad in Prozent, gewichtet nach Kaufrelevanz.
   *
   * Bezugsgroesse sind ausschliesslich Aufpreis-, Paket-, Sondermodell- und
   * marktabhaengige Ausstattungen. Serie zaehlt NICHT mit: Sie hat jedes
   * Fahrzeug, und sie mitzurechnen wuerde jeden Wagen gleich gut aussehen
   * lassen.
   */
  percent: number | null;
  /** Wie viele Aufpreisausstattungen erfasst sind. Der Nenner der Quote. */
  optionalTotal: number;
  presentOptional: number;
  /** Serienausstattung getrennt ausgewiesen, nicht eingerechnet. */
  standardTotal: number;
  /** Vorhandene Ausstattung, die selten und kaufrelevant ist. */
  highlights: CheckOption[];
  /** Fehlende Ausstattung, die beim Kauf ins Gewicht faellt. */
  notableGaps: CheckOption[];
  present: CheckOption[];
  missing: CheckOption[];
  byArea: CheckAreaResult[];
  /** Angehakte Kennungen, die es fuer diese Auswahl gar nicht gab. */
  unknownIds: string[];
  /** Hinweise, die zwingend mit dem Ergebnis angezeigt werden. */
  caveats: string[];
}

const SELTEN = new Set(['RARE', 'VERY_RARE']);

export function pruefeAusstattung(eingabe: CheckInput): CheckResult {
  const vorhandenIds = new Set(eingabe.presentOptionIds);
  const bekannteIds = new Set(eingabe.available.map((o) => o.optionId));
  const unknownIds = [...vorhandenIds].filter((id) => !bekannteIds.has(id));

  const serie = eingabe.available.filter((o) => istSerie(o.kind));
  const aufpreis = eingabe.available.filter((o) => !istSerie(o.kind));

  const vorhanden = eingabe.available.filter((o) => vorhandenIds.has(o.optionId));
  const fehlend = aufpreis.filter((o) => !vorhandenIds.has(o.optionId));

  const vorhandenAufpreis = aufpreis.filter((o) => vorhandenIds.has(o.optionId));

  const nenner = aufpreis.reduce((summe, o) => summe + gewichtVon(o), 0);
  const zaehler = vorhandenAufpreis.reduce((summe, o) => summe + gewichtVon(o), 0);
  const percent = nenner > 0 ? Math.round((zaehler / nenner) * 100) : null;

  const highlights = vorhandenAufpreis
    .filter((o) => (o.rarity && SELTEN.has(o.rarity)) || o.purchaseRelevance === 'HIGH')
    .sort((a, b) => gewichtVon(b) - gewichtVon(a));

  const notableGaps = fehlend
    .filter((o) => o.purchaseRelevance === 'HIGH')
    .sort((a, b) => a.name.localeCompare(b.name, 'de'));

  const bereiche = new Map<EquipmentArea, { present: number; total: number }>();
  for (const option of aufpreis) {
    const bereich = option.area ?? 'OTHER';
    const eintrag = bereiche.get(bereich) ?? { present: 0, total: 0 };
    eintrag.total += 1;
    if (vorhandenIds.has(option.optionId)) eintrag.present += 1;
    bereiche.set(bereich, eintrag);
  }

  const byArea: CheckAreaResult[] = [...bereiche.entries()]
    .map(([area, wert]) => ({
      area,
      label: EQUIPMENT_AREA_LABELS[area],
      present: wert.present,
      optionalTotal: wert.total,
      percent: wert.total > 0 ? Math.round((wert.present / wert.total) * 100) : null,
    }))
    .sort((a, b) => a.label.localeCompare(b.label, 'de'));

  const caveats: string[] = [];
  caveats.push(
    `Bezugsgröße sind die ${aufpreis.length} Aufpreis-, Paket- und Sondermodell-Ausstattungen, ` +
      'die für diese Auswahl hier erfasst sind — nicht alles, was es je gab.',
  );
  if (aufpreis.length < 10) {
    caveats.push(
      'Für diese Auswahl sind bisher wenige Ausstattungen erfasst. Der Prozentwert ist ' +
        'entsprechend grob und kann sich mit weiteren Daten deutlich verschieben.',
    );
  }
  const ohneRelevanz = aufpreis.filter((o) => !o.purchaseRelevance).length;
  if (ohneRelevanz > 0) {
    caveats.push(
      `Bei ${ohneRelevanz} von ${aufpreis.length} Ausstattungen ist die Kaufrelevanz nicht ` +
        'erfasst; sie gehen mit mittlerem Gewicht ein.',
    );
  }
  if (unknownIds.length > 0) {
    caveats.push(
      `${unknownIds.length} angegebene Ausstattung(en) sind für diese Auswahl nicht erfasst. ` +
        'Das kann Nachrüstung sein, eine andere Baureihe — oder eine Lücke in unseren Daten.',
    );
  }
  if (percent === null) {
    caveats.push(
      'Für diese Auswahl ist keine Aufpreisausstattung erfasst. Ein Ausstattungsgrad lässt ' +
        'sich daraus nicht berechnen.',
    );
  }

  return {
    percent,
    optionalTotal: aufpreis.length,
    presentOptional: vorhandenAufpreis.length,
    standardTotal: serie.length,
    highlights,
    notableGaps,
    present: vorhanden,
    missing: fehlend,
    byArea,
    unknownIds,
    caveats,
  };
}
