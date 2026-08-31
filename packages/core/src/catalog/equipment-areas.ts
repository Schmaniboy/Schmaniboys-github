/**
 * Bereiche, in die Ausstattung faellt.
 *
 * Bewusst eine kleine, feste Liste und keine freie Zeichenkette: Der
 * Ausstattungschecker und die Filter gruppieren danach, und eine Liste, in
 * der "Infotainment", "Infotainment " und "Multimedia" nebeneinander stehen,
 * gruppiert nichts mehr.
 *
 * `category` an OptionalEquipment bleibt daneben bestehen und bleibt frei --
 * dort steht das Feinere ("Sitzheizung", "Scheinwerfer").
 */

export const EquipmentArea = {
  EXTERIOR: 'EXTERIOR',
  INTERIOR: 'INTERIOR',
  INFOTAINMENT: 'INFOTAINMENT',
  SOUND: 'SOUND',
  ASSISTANCE: 'ASSISTANCE',
  DRIVETRAIN: 'DRIVETRAIN',
  SAFETY: 'SAFETY',
  OTHER: 'OTHER',
} as const;

export type EquipmentArea = (typeof EquipmentArea)[keyof typeof EquipmentArea];

export const EQUIPMENT_AREAS: EquipmentArea[] = [
  'EXTERIOR',
  'INTERIOR',
  'INFOTAINMENT',
  'SOUND',
  'ASSISTANCE',
  'DRIVETRAIN',
  'SAFETY',
  'OTHER',
];

export const EQUIPMENT_AREA_LABELS: Record<EquipmentArea, string> = {
  EXTERIOR: 'Außen',
  INTERIOR: 'Innenraum',
  INFOTAINMENT: 'Infotainment',
  SOUND: 'Sound',
  ASSISTANCE: 'Assistenz',
  DRIVETRAIN: 'Fahrwerk und Antrieb',
  SAFETY: 'Sicherheit',
  OTHER: 'Sonstiges',
};

export function istBereich(wert: string): wert is EquipmentArea {
  return (EQUIPMENT_AREAS as string[]).includes(wert);
}
