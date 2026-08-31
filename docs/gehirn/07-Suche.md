# Fahrzeugsuche

Umsetzung: `packages/core/src/catalog/search.ts` (Anfrage und Adressen),
`packages/db/src/repositories/search.ts` (Abfrage), `apps/web/src/app/suche/`
(Oberfläche).

## Entscheidung: gesucht wird nach Motorvariante

Ein Treffer ist **„Muster 300 (MB2) 2.0 Diesel, Automatik, Heck"** — nicht
„Muster 300".

Grund: Die geforderten Filter — Motor, Leistung, Kraftstoff, Getriebe,
Antrieb — unterscheiden genau auf dieser Ebene. Auf Generationsebene wäre
„Diesel mit mehr als 140 kW" nicht beantwortbar, weil eine Generation beides
enthält: den passenden und den unpassenden Motor.

Nebeneffekt, der die Entscheidung stützt: Das Sortieren nach Leistung,
Verbrauch oder Beschleunigung wird damit zu einer gewöhnlichen
Spaltensortierung. Eine Sortierung über verknüpfte Aggregate wäre weder in
der Datenbank sauber noch seitenweise korrekt.

## Was die Suche nicht filtert

**Preis, Kilometerstand und Standort** stehen im MASTERPLAN unter Phase 4,
sind hier aber bewusst nicht umgesetzt. Diese Angaben gehören zu einer
**Anzeige**, nicht zu einem Katalogeintrag — es gibt sie erst mit dem
Marktplatz in Phase 9.

Sie jetzt einzubauen hieße, eine Filterung anzubieten, die nichts filtern
kann. Die Filter werden in Phase 9 ergänzt, wenn es Anzeigen gibt, auf die
sie sich beziehen können.

Ebenfalls offen: Filter nach Ausstattungslinie und Sonderausstattung. Das
Schema trägt beides bereits; die Filter kommen mit den Ausstattungsseiten in
Phase 6.

## Sichtbarkeit

Jede Bedingung filtert auf `PUBLISHED`, und zwar auf **allen vier Ebenen**:
Antriebskombination, Generation, Modell und Hersteller. Ein Entwurf darf auch
dann nicht auftauchen, wenn nur eine der Ebenen darüber noch unveröffentlicht
ist. Ein Test hält das fest, indem er einen unveröffentlichten Eintrag mit
999 kW anlegt — unter jeder Sortierung stünde er ganz oben, wenn der Filter
fiele.

## Zwei Feinheiten, die leicht falsch werden

**Baujahr als Überschneidung, nicht als Enthaltensein.** Wer „2016 bis 2018"
sucht, meint Fahrzeuge, die in dieser Zeit gebaut wurden — auch wenn die
Baureihe schon 2014 begann. `yearTo = null` heißt „läuft noch" und
überschneidet sich mit jedem späteren Jahr.

**`nulls: 'last'` in jeder Sortierung.** Ein fehlender Wert darf nicht als
bester Wert erscheinen. Ohne das stünde ein Fahrzeug ohne erfassten Verbrauch
bei „sparsamste zuerst" ganz oben — die schlechteste Art, eine Lücke zu
präsentieren. Jede Sortierung endet zusätzlich auf `id`, damit Seite 2 nicht
dieselben Treffer zeigt wie Seite 1.

## Ein Fehler, der still war

Die Baujahrfilter benutzten zunächst `buildYear` aus `schemas.ts`. Das
erwartet eine **Zahl**, wie sie in einem JSON-Body steht — aus der Adresszeile
kommt jedoch immer eine **Zeichenkette**.

Folge: Die Prüfung scheiterte, die Suche fiel auf „ungefiltert" zurück und
zeigte Treffer, die niemand gesucht hatte. An der Trefferliste war das nicht
zu erkennen; zwei Tests waren aus dem falschen Grund grün.

Die Suche hat deshalb ein eigenes, umwandelndes Jahresschema (`suchJahr`), und
ein Test prüft ausdrücklich, dass Zeichenketten aus der Adresszeile zu Zahlen
werden — einschließlich des Falls, dass `"2020"` bis `"2010"` als Spanne
abgelehnt wird (als Zeichenketten verglichen wäre sie gültig).

## Filter ohne JavaScript

Jeder Filter ist ein Link, jede Auswahl eine eigene Adresse. Damit ist ein
Suchergebnis teilbar, im Verlauf auffindbar und funktioniert auch dann, wenn
ein Skript nicht lädt.

Weil ein Link — anders als ein Formular — einen Parameter nicht mehrfach
setzen kann, schreibt die Filterleiste Mehrfachauswahlen kommagetrennt
(`?kraftstoff=DIESEL,ELECTRIC`). Das Schema nimmt beide Formen an.

Ein Filterwechsel führt immer auf Seite 1 zurück — sonst landet man auf
Seite 7 einer Liste mit drei Seiten.

## Auswahl mit Trefferzahl

Neben jeder Kraftstoffart steht, wie viele Fahrzeuge dahinterstehen — gezählt
**unter den übrigen gesetzten Filtern, aber ohne den eigenen**. Sonst zeigte
„Diesel (12)" immer nur die Treffer, die man ohnehin schon sieht. Ein Filter,
der zu null Treffern führt, ist eine Sackgasse.

## Ähnliche Fahrzeuge

Vergleichbare Leistung (±25 %), gleiche Karosserieform, **anderes Modell**.
Ein anderer Motor derselben Baureihe ist keine Alternative, sondern eine
Variante — die steht ohnehin schon weiter oben auf derselben Seite.

## Leistung

- Fünf Indizes auf `PowertrainCombination`, jeweils mit `status` an erster
  Stelle, weil jede Abfrage zuerst darauf filtert.
- Treffer und Gesamtzahl laufen in einer Runde, nicht in zwei.
- Feste Seitengröße von 24. Größere Seiten kosten Antwortzeit ohne Nutzen.
- Katalogseiten werden statisch ausgeliefert und alle fünf Minuten erneuert;
  die Suchseite ist dynamisch, weil ihr Ergebnis von der Adresse abhängt.
