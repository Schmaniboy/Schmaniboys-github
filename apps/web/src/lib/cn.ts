/**
 * Klassennamen zusammenfuegen. Bewusst zehn Zeilen statt einer Abhaengigkeit --
 * mehr als das Aussortieren von false/null/undefined wird hier nicht gebraucht.
 */
export type ClassValue = string | false | null | undefined;

export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(' ');
}
