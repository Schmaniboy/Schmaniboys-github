/**
 * Adresszeilen fuer Anzeigen.
 *
 * Warum ueberhaupt: Eine URL wie `/marktplatz/bmw-320d-touring-2016-a7f3k2`
 * ist verlinkbar, lesbar und suchmaschinentauglich. Eine URL aus einer
 * blossen Kennung ist keins davon.
 *
 * Warum trotzdem mit Zufallsteil am Ende: Ohne ihn muesste beim Anlegen
 * gezaehlt und wiederholt werden, bis ein freier Name gefunden ist -- ein
 * Wettlauf, der unter Last schiefgeht. Der Zufallsteil macht die Eindeutig-
 * keit zur Eigenschaft des Namens statt zur Frage an die Datenbank.
 */

const UMLAUTE: Record<string, string> = {
  ä: 'ae',
  ö: 'oe',
  ü: 'ue',
  Ä: 'ae',
  Ö: 'oe',
  Ü: 'ue',
  ß: 'ss',
};

/** Macht aus beliebigem Text einen URL-tauglichen Teil. */
export function slugTeil(text: string, maxLaenge = 70): string {
  const ersetzt = text.replace(/[äöüÄÖÜß]/g, (zeichen) => UMLAUTE[zeichen] ?? zeichen);

  return ersetzt
    .normalize('NFKD')
    // Alles, was nach dem Zerlegen als Akzent uebrig bleibt.
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, maxLaenge)
    .replace(/-+$/g, '');
}

/**
 * Vollstaendige Adresszeile.
 *
 * `zufall` wird uebergeben statt hier erzeugt -- sonst waere die Funktion
 * nicht bestimmbar und damit nicht sinnvoll testbar.
 */
export function buildListingSlug(input: {
  title: string;
  vehicleLabel: string;
  zufall: string;
}): string {
  const teile = [slugTeil(input.title, 60), slugTeil(input.vehicleLabel, 40)]
    .filter((teil) => teil.length > 0);

  const basis = teile.length > 0 ? [...new Set(teile)].join('-').slice(0, 90) : 'anzeige';
  return `${basis.replace(/-+$/g, '')}-${input.zufall}`;
}
