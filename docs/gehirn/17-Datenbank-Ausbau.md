# Datenbank-Ausbau, Bildarchitektur und Qualitätskontrolle

Phase 16. Der Katalog aus den Phasen 2 bis 6 kannte die Kette Marke → Modell →
Generation → Motor. Was fehlte, war alles, was einen Gebrauchtwagen
tatsächlich unterscheidet — und vor allem die Frage, in **welcher Form** es
eine Ausstattung gab.

---

## Der teuerste Fehler, den wir korrigiert haben

`OptionAvailability.standard` war ein Wahrheitswert. Er kannte zwei Zustände:
Serie und nicht Serie. Damit fielen vier verschiedene Sachverhalte zusammen:

- Sonderausstattung gegen Aufpreis
- reine Paketbestandteile, einzeln gar nicht bestellbar
- Ausstattung, die es nur im Sondermodell gab
- Ausstattung, die je nach Auslieferungsland verschieden war

Genau diese Unterscheidung ist beim Gebrauchtkauf die entscheidende. „Xenon
war Serie" führt dazu, dass jemand ein Fahrzeug ungeprüft kauft. „Xenon gab
es nur im Lichtpaket, ab Modelljahr 2012, nicht in Nordamerika" führt dazu,
dass er nachsieht.

Der Wahrheitswert ist durch `AvailabilityKind` mit fünf Werten ersetzt. Die
Migration hat bestehende Zeilen übernommen, ohne die feineren Fälle zu
**raten**: Was ein Paket zugeordnet hatte, wurde `PACKAGE_ONLY`, alles Übrige
`OPTIONAL`, und die Güte blieb auf „nicht verifiziert", bis eine Redakteurin
den Fall geprüft hat.

`pruefeVerfuegbarkeitStimmig` erzwingt seither, dass jede Art die Angabe
mitbringt, die sie verwertbar macht: „nur im Paket" ohne Paketangabe ist
keine Auskunft, sondern eine offene Frage — und die fällt später niemandem
mehr auf.

---

## Gütekennzeichen: fünf Stufen statt „belegt oder nicht"

Das Belegmodell (`EvidenceType`) sagt, welcher **Art** eine Aussage ist:
Spezifikation, Einschätzung, Marktbeobachtung. Es sagte nicht, wie gut
geprüft der einzelne Datensatz gerade ist. Ein Datensatz kann eine
Spezifikation sein und trotzdem ungeprüft aus einer Sammlung stammen.

`DataQuality` schließt diese Lücke:

| | Stufe | Bedeutung |
|---|---|---|
| ✓ | `VERIFIED` | Jede tragende Angabe ist belegt |
| ◑ | `PARTIALLY_VERIFIED` | Ein Teil belegt, ein Teil nicht |
| ◐ | `EXPERIENCE` | Aus der Praxis, nicht aus einer Unterlage |
| ? | `UNVERIFIED` | Übernommen, nicht geprüft — die Voreinstellung |
| ⚠ | `NEEDS_REVIEW` | Widerspruch oder Befund der Qualitätskontrolle |

`PARTIALLY_VERIFIED` ist der wichtigste der fünf: Es ist der häufigste
ehrliche Zustand und der, den die meisten Kataloge verschweigen, indem sie
alles gleich sicher aussehen lassen.

Die Voreinstellung ist `UNVERIFIED`, nicht `VERIFIED`. Wer nichts angibt, hat
nichts belegt.

---

## Bildzuordnung: Widerspruch schließt aus

Der einfache Weg wäre „nimm irgendein Bild dieser Baureihe". Er funktioniert,
sieht gut aus und ist falsch: Ein Golf 7 vor dem Facelift und einer danach
sind zwei verschiedene Autos, ein A4 B9 ist kein B9.5.

`core/catalog/images.ts` macht den einfachen Weg unmöglich. Es unterscheidet
je Merkmal drei Zustände:

- **passt** — Bild und Datensatz nennen denselben Wert
- **unbekannt** — einer von beiden nennt keinen, prüfbar ist es nicht
- **widerspricht** — beide nennen einen Wert, und sie sind verschieden

Ein einziger Widerspruch schließt das Bild **vollständig** aus. Kein
Punkteabzug, kein „passt trotzdem am besten". Und wo etwas unbekannt bleibt,
steht es beim Bild, statt als Übereinstimmung durchzugehen.

Wo nichts passt: `Kein verifiziertes Bild verfügbar.` — und kein Bild.

**KI-Bilder** sind seit der Auftragserweiterung als letzter Ausweg
zugelassen. Sie stehen in der Rangfolge hinter jeder Aufnahme, tragen Modell
und Anweisung im Datensatz und werden sichtbar gekennzeichnet: „Zeigt kein
tatsächlich gebautes Fahrzeug."

Pflichtangaben je Herkunft: übernommene Bilder brauchen Fundstelle, Titel und
Urheber; erzeugte brauchen Modell und Anweisung; **immer** nötig sind Lizenz
und Bildunterschrift.

---

## Qualitätskontrolle: was sie kann und was nicht

`core/catalog/quality-control.ts` findet **innere Widersprüche**:

- Elektromotor mit Turbolader oder Hubraum
- Euro 6 im Baujahr 1998
- 900 Nm bei 85 kW
- Facelift-Phase, die vor ihrer Generation beginnt
- Handelsname („2.0 TDI") im Feld Motorcode
- 600 kW aus einem Liter Hubraum

Was sie **nicht** kann: prüfen, ob ein Motorcode existiert. Dazu bräuchte es
die Unterlagen des Herstellers. Ein Code, der durchkommt, ist damit nicht
bestätigt — er ist nur nicht offensichtlich unmöglich. Ein Test hält das
ausdrücklich fest, damit niemand die Prüfung für eine Bestätigung hält.

Befunde tragen eine Schwere. `BLOCKER` heißt: nicht übernehmen. `WARNING`
heißt: übernehmen, aber auf `NEEDS_REVIEW` setzen — auch dann, wenn der
Import den Datensatz als bestätigt mitbringt.

---

## Import-Pipeline

Zwei Entscheidungen tragen das Format:

1. **Quellenpflicht.** Jede Datei nennt ihre Quelle, jeder Datensatz darf
   eine eigene nennen. Ohne Quelle kein Import — als Abbruch, nicht als
   Warnung.
2. **Verweise über sprechende Schlüssel.** Die Datei kennt keine internen
   Kennungen, sondern nennt Hersteller, Modell und Generation beim Namen. Sie
   bleibt von Hand lesbar, und ein falscher Verweis fällt beim Lesen auf.

Der **Probelauf ist die Voreinstellung**. Ein Import, der beim Schreiben
merkt, dass die Hälfte der Verweise ins Leere zeigt, hat die andere Hälfte
schon geschrieben.

Beim Bauen fiel auf, dass die Zeitraumprüfung im Probelauf still aussetzte:
Die Generation stand ja noch nicht in der Datenbank, also gab es nichts,
wogegen sich eine Facelift-Phase prüfen ließ. Der Lauf merkt sich die
Zeiträume jetzt selbst. Eine Prüfung, die genau dann nicht greift, wenn man
sie braucht, ist keine.

---

## Keine Quote ohne belegten Nenner

`core/catalog/completeness.ts` rechnet einen Anteil **nur**, wenn eine
bekannte Gesamtzahl mit Quelle hinterlegt ist (`CatalogExpectation`). Sonst
steht die erfasste Anzahl und der Satz „Gesamtzahl nicht belegt".

Eine Zahl ohne Quelle zählt dabei nicht als belegte Zahl — sonst wäre die
Aussage über die Vollständigkeit selbst unbelegt.

Es gibt auch **keine Gesamtquote** über alle Bereiche: Aspekte verschiedener
Größenordnung zu einer Zahl zu mitteln ergäbe eine Zahl, die nichts bedeutet.

---

## Zwei Fehler, die erst beim Testen auffielen

**Die Suche hielt „kombi" für einen Motorcode.** `DBKA` und `KOMBI` haben
dieselbe Form — vier Großbuchstaben. Über den Treffern stand daraufhin
„Verstanden als: Motorcode KOMBI". Was die beiden unterscheidet, ist die
Schreibweise des Menschen: Wer einen Motorcode sucht, tippt ihn groß. Das ist
kein perfektes Signal, aber ein ehrliches — im Zweifel wird der Teil als
gewöhnliches Wort behandelt.

Ebenso zerfiel „190 PS" in die Zahl 190 und das Wort PS, beide einzeln
wertlos. Zahl und Einheit werden jetzt vor der Zerlegung zusammengezogen.

**Auf dem Handy gab es keine Navigation.** Sie war unterhalb der mittleren
Breite ausgeblendet, und es gab keinen Ersatz — außer dem Logo führte kein
Weg in den Katalog. Beim Nachbauen zeigte sich ein zweiter Fehler: Die
Schaltfläche „Konto erstellen" war breiter als der verbleibende Platz und
schob sich über den Menüknopf. Der Versuch, sie mit `hidden sm:inline-flex`
auszublenden, scheiterte daran, dass beides Anzeigeklassen sind und im
Stylesheet `inline-flex` gewinnt. Das Ausblenden trägt jetzt ein Wrapper.

---

## Was bewusst nicht gebaut wurde

**Fahrzeugdaten.** Es wäre einfach, den Katalog mit zehntausend Motorvarianten
zu füllen — die Bezeichnungen sind bekannt, die Muster auch. Das Ergebnis
sähe vollständig aus und wäre wertlos: Wer einen Motorcode nachschlägt, tut
das, weil er eine verlässliche Antwort braucht.

Diese Umgebung hat keinen Zugang zu Herstellerunterlagen oder
Fahrzeugdatenbanken (geprüft: ausgehende Verbindungen zu Datenquellen werden
vom Proxy abgewiesen). Daten aus dem Gedächtnis zu schreiben wäre genau das,
was Vorgabe C3 verbietet. Gebaut ist deshalb die Struktur, über die echte
Daten als Redaktionsarbeit hineinkommen — nicht als Ratespiel.
