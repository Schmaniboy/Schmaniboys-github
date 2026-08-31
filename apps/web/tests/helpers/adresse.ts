/**
 * Eine eigene Aufruferadresse je Aufruf.
 *
 * Mehrere Endpunkte sind je IP-Adresse begrenzt -- "Passwort vergessen" auf
 * fuenf Anfragen je Stunde, "Registrieren" ebenso. Das ist richtig so: Ohne
 * diese Grenze liesse sich ein fremder Posteingang mit Zuruecksetzmails
 * fluten.
 *
 * Nur kommen alle Testlaeufe von derselben Adresse. Der dritte Lauf
 * innerhalb einer Stunde lief bisher in die Grenze, und der Test schlug
 * fehl, ohne dass sich etwas am Code geaendert haette. Ein Test, dessen
 * Ergebnis davon abhaengt, wann er zuletzt lief, ist kein Test.
 *
 * Dieselbe Ueberlegung steht schon in `helpers/session.ts`, dort fuer die
 * Anmeldung geloest, indem die Sitzung direkt erzeugt wird. Wo der Endpunkt
 * selbst geprueft werden soll, geht das nicht -- also bekommt jeder Aufruf
 * eine eigene Adresse.
 *
 * Die Adressen stammen aus 203.0.113.0/24 (RFC 5737, ausdruecklich fuer
 * Dokumentation reserviert und weltweit nicht routbar).
 *
 * WICHTIG: Das funktioniert nur, weil `x-forwarded-for` ohne
 * vertrauenswuerdigen Proxy faelschbar ist -- so steht es auch in
 * `lib/ip.ts`. Der Test nutzt diese Eigenschaft bewusst aus und beweist
 * damit ausdruecklich NICHTS ueber die Wirksamkeit der Begrenzung. Dafuer
 * gibt es einen eigenen Test ("greift die Ratenbegrenzung tatsaechlich").
 */
export function pruefAdresse(): string {
  return `203.0.113.${1 + Math.floor(Math.random() * 254)}`;
}

/** Kopfzeilen mit eigener Aufruferadresse, fuer `fetch`. */
export function eigeneAdresse(weitere: Record<string, string> = {}): Record<string, string> {
  return { ...weitere, 'x-forwarded-for': pruefAdresse() };
}
