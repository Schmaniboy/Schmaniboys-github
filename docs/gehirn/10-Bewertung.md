# Fahrzeugbewertung

Umsetzung: `packages/core/src/valuation/`,
`packages/core/src/ports/market-data.ts`,
`packages/core/src/usecases/valuation.ts`,
`apps/web/src/components/sales/ValuationPanel.tsx`, `apps/web/src/app/bewertung/`.

## Der Satz, um den sich alles dreht

Im MASTERPLAN steht unter Phase 8: **„Keine erfundenen Marktwerte."** Das ist
hier wörtlich umgesetzt und nicht als Vorsatz, sondern als Verzweigung im Code.

Ein Fahrzeugwert besteht aus zwei Teilen: einem **Grundwert** (was
vergleichbare Fahrzeuge kosten) und einer **Korrektur** (wie dieses Fahrzeug
gegenüber dem Durchschnitt dasteht). Den zweiten Teil können wir aus den
Angaben der verkaufenden Person rechnen. Den ersten nicht — er braucht
Marktdaten, und die gibt es noch nicht (Blocker B4).

Daraus folgt die Aufteilung:

| | ohne Marktdaten | mit Marktdaten |
|---|---|---|
| Faktorenanalyse | ja | ja |
| Marktwert in Euro | **nein** | ja |
| Inseratspreis, Spanne | **nein** | ja |
| Guthaben | **0** | Preis der Bewertung |

Ohne Grundwert sind `marketValueCents`, `suggestedListingCents` und
`realisticRange` **null**, nicht 0 und nicht geschätzt. Die Oberfläche zeigt
an dieser Stelle keinen Betrag mit Sternchen, sondern einen Kasten mit dem
Grund — gelesen wird sonst die Zahl, nicht das Sternchen.

## Die Faktoren

`packages/core/src/valuation/factors.ts`. Jeder Faktor liefert eine Richtung,
ein Gewicht und **eine Begründung in ganzen Sätzen**. Eine Prozentzahl ohne
Satz daneben ist für die verkaufende Person wertlos.

* **Kilometerstand** — nur zusammen mit der Erstzulassung auswertbar. 90.000 km
  sind bei drei Jahren viel und bei fünfzehn Jahren wenig; fehlt eines von
  beidem, entsteht kein Faktor und die Lücke wird gemeldet.
* **Zustand**, **Servicehistorie** — direkt aus den Angaben.
* **Vorbesitzer** — bis zwei neutral, darüber abnehmend, begrenzt.
* **Hauptuntersuchung** — abgelaufen ist ein Abschlag, denn die Kosten trägt
  sonst der Käufer; über zwölf Monate Restlaufzeit ein kleiner Zuschlag.
* **Unfallschaden**, **Schäden** — nur wenn angegeben.

**Keine Angabe ist kein „unfallfrei".** Wer nichts sagt, bekommt weder Zu-
noch Abschlag; ein Test hält das fest. Umgekehrt gibt es für angegebene
Unfallfreiheit auch keinen Zuschlag — sie ist der Normalfall, nicht die
Besonderheit.

Die Summe ist **begrenzt** (`totalUpperBound`, `totalLowerBound`). Ohne
Begrenzung ergäbe jeder zusätzliche Mangel einen weiteren Abschlag, bis am
Ende ein negativer Wert stünde. Dass die Grenze gegriffen hat, steht in der
Begründung.

## Annahmen sind benannt, nicht versteckt

`assumptions.ts` enthält jede Zahl, mit der gerechnet wird — erwartete
Jahresfahrleistung, Zu- und Abschläge je Merkmal, Obergrenzen. Sie sind
**Annahmen der Plattform, keine gemessenen Marktwerte**, und genau dieser Satz
steht in `describeAssumptions()` und damit in jeder Ausgabe.

Die Annahmen tragen eine Kennung (`plattform-annahmen-v1`). Sie geht in die
gespeicherte Bewertung ein und in die Vorgangskennung der Buchung. Ändern sich
die Annahmen, ist das eine neue Berechnung — sonst stünde neben einem alten
Ergebnis eine Annahmenliste, mit der es nicht zustande gekommen ist.

Was hier ausdrücklich **nicht** steht: ein Fahrzeugwert in Euro. Ein Grundwert
lässt sich nicht annehmen.

## Die Marktdatenschnittstelle

`ports/market-data.ts`. Ein Grundwert kommt immer mit seiner Herkunft:
Stichprobengröße, Beobachtungszeitraum, Quellenbezeichnung und — wichtig —
`priceKind: 'ASKING' | 'ACHIEVED'`.

**Angebotspreise sind keine erzielten Preise.** Wer aus Angeboten rechnet,
rechnet aus Wunschvorstellungen. Bei `ASKING` zieht `buildValuation` deshalb
einen Abschlag ab und sagt in der Begründung, dass es ihn gibt und dass auch
er eine Annahme ist.

Die Güte (`GOOD` / `LIMITED` / `WEAK` / `NONE`) hängt an Stichprobengröße,
Alter der Beobachtung und Zahl der fehlenden Angaben — nicht am Wunsch, eine
belastbare Zahl zu liefern.

Eingerichtet ist derzeit `UnavailableMarketData`. Sobald eine Quelle feststeht,
wird in `apps/web/src/lib/sales-deps.ts` eine Zeile ausgetauscht; alles andere
bleibt.

## Reihenfolge im Anwendungsfall

Wie beim Verkaufsassistenten ist die Reihenfolge die Fachlogik:

1. **Besitz** — ein fremder Entwurf ist `NOT_FOUND`, nicht `FORBIDDEN`.
2. **`catalogConfirmedAt`** — ohne bestätigte Zuordnung gäbe es keine
   Baureihe, mit der sich vergleichen ließe.
3. **Gespeicherte Bewertung** — liegt eine vor, die noch zum Stand des
   Entwurfs und zu den aktuellen Annahmen passt, wird sie herausgegeben.
   `charged: 0`.
4. **`market.isAvailable()`** — *vor* der Reservierung. Keine Quelle heißt:
   Faktorenanalyse zurück, nichts abgebucht.
5. **Reservieren, abfragen, buchen** — reicht die Stichprobe nicht, gibt die
   Buchung die Reservierung frei.

Die Bewertung wird gespeichert (`valuationJson`, `valuedAt`,
`valuationAssumptionsId`), weil sie Guthaben gekostet hat: Wer dafür bezahlt
hat, muss sie wiedersehen können, ohne erneut zu zahlen. Beim Lesen werden die
Datumsangaben wiederbelebt — JSON kennt kein Datum, und ohne diesen Schritt
käme eine Zeichenkette dort zurück, wo der Typ ein `Date` verspricht.

## Zwei Funde beim Bauen

**Die Buchung verweigerte die zweite Anfrage.** Die Vorgangskennung enthielt
zunächst nur Entwurfskennung und Änderungsstempel. Beim zweiten Aufruf fand
die Buchung sie als bereits abgerechnet vor und brach ab — der Nutzer hätte
seine bezahlte Bewertung nicht wiedersehen können. Behoben durch beides: die
Bewertung wird gespeichert und vorrangig zurückgegeben, und die
Annahmenkennung gehört in die Vorgangskennung.

**Katalogkennungen im Entwurfsdatensatz.** Die Marktabfrage braucht
`generationId` und `powertrainId`, also stehen sie jetzt in
`ListingDraftRecord`. Damit sie nicht auf demselben Weg in den KI-Kontext
geraten, stehen sie zusätzlich in `NIEMALS_AN_DIE_KI` — die KI schreibt über
ein Fahrzeug, nicht über Datenbankzeilen. In `CatalogForContext` haben sie
nichts zu suchen; das ist die KI-Whitelist.
