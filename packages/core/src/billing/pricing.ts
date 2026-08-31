/**
 * Preise fuer Tokenpakete.
 *
 * Die Betraege stehen hier als NETTO in Cent. Ein Bruttopreis liesse sich
 * bei einem geaenderten Steuersatz nicht mehr sauber zerlegen -- aus 11,90 €
 * brutto wird bei 7 % nicht 10,00 € netto, sondern 11,12 €.
 *
 * Der Steuersatz ist ausdruecklich eine Konfiguration, keine Konstante des
 * Codes. Er wird mit jeder Rechnung gespeichert; eine spaetere Aenderung
 * darf alte Rechnungen nicht umschreiben.
 */

export interface TokenPackage {
  id: string;
  label: string;
  tokens: number;
  /** Nettopreis des Pakets in Cent. */
  netCents: number;
}

export const TOKEN_PACKAGES: readonly TokenPackage[] = [
  { id: 'klein', label: 'Kleines Paket', tokens: 50, netCents: 900 },
  { id: 'mittel', label: 'Mittleres Paket', tokens: 150, netCents: 2400 },
  { id: 'gross', label: 'Großes Paket', tokens: 500, netCents: 6900 },
];

export function findPackage(id: string): TokenPackage | null {
  return TOKEN_PACKAGES.find((paket) => paket.id === id) ?? null;
}

/** Preis je Token in Cent, netto. Nur zur Einordnung in der Anzeige. */
export function preisJeToken(paket: TokenPackage): number {
  return paket.netCents / paket.tokens;
}

/**
 * Voreingestellte Besteuerung.
 *
 * 1900 Basispunkte entsprechen dem deutschen Regelsteuersatz zum Zeitpunkt
 * der Umsetzung. Der Wert steht hier als Voreinstellung und ist ueber die
 * Umgebung veraenderbar -- er ist eine Konfiguration, keine Zusicherung.
 * Welche Besteuerung im Einzelfall richtig ist, entscheidet nicht dieser
 * Code.
 */
export const DEFAULT_TAX_RATE_BASIS_POINTS = 1900;
