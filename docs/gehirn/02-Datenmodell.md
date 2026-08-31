# Datenmodell

Umsetzung in `packages/db/prisma/schema.prisma`. Diese Datei begründet die
Struktur; das Schema selbst trägt die Details.

## Zwei Hälften

**Identität und Zugriff** (Phase 1): `User`, `Session`, `Dealer`, `AuditLog`.

**Automotive-Katalog** (Phase 2):

```
Manufacturer ──┬── Model ── Generation ──┬── FaceliftPhase
               │                          ├── PowertrainCombination ── Engine
               │                          │                          └ Transmission
               │                          ├── TrimLine
               │                          ├── EquipmentPackage ── EquipmentPackageItem
               │                          └── OptionAvailability
               ├── Engine
               └── OptionalEquipment ─────┘
```

## Die drei Entscheidungen, die alles andere prägen

### 1. Fahrleistungen hängen an der Kombination, nicht am Motor

Derselbe Motor beschleunigt in einem Kombi mit Allrad und Automatik anders als
in einer Limousine mit Handschaltung und Heckantrieb. Wer 0–100 km/h am Motor
speichert, muss den Wert später an jeder betroffenen Stelle korrigieren — und
wird es nicht überall tun.

Deshalb trägt **`PowertrainCombination`** (Generation + Motor + Getriebe +
Antriebsart) die Fahrleistungen: Leistung, Drehmoment, Beschleunigung,
Höchstgeschwindigkeit, Verbrauch, CO₂, Gewicht, Tank- bzw. Batterieinhalt.

Am `Engine` steht nur, was dem Motor selbst gehört: Hubraum, Zylinderzahl,
Kraftstoff, Aufladung, Nennleistung.

### 2. Motoren hängen am Hersteller, nicht am Modell

Ein Motor läuft in mehreren Baureihen und oft in mehreren Marken eines
Konzerns. Am Modell aufgehängt wäre er dutzendfach doppelt erfasst — und
dutzendfach unterschiedlich falsch. Dasselbe gilt für `OptionalEquipment`:
Der Katalogeintrag hängt am Hersteller, **wo** die Ausstattung zu haben war,
steht in `OptionAvailability`.

### 3. Ohne Quelle keine Veröffentlichung

Jeder Katalogeintrag führt einen Redaktionsstand:

```
DRAFT ──> IN_REVIEW ──> PUBLISHED ──> ARCHIVED ──> DRAFT
   ^          │
   └──────────┘  (zurückweisen)
```

- **Es gibt keinen direkten Weg von `DRAFT` nach `PUBLISHED`.** Erfassen und
  Freigeben sind getrennte Rechte (`catalog:write` und `catalog:publish`) und
  getrennte Schritte. Das ist die technische Antwort auf Blocker B3.
- **`PUBLISHED` setzt mindestens eine Quelle voraus.** Erzwungen in
  `packages/core/src/catalog/publishing.ts`, nicht in der Oberfläche.
- **Gelöscht wird nicht, sondern zurückgezogen.** `ARCHIVED` erhält die Historie.
- Öffentlich sichtbar ist ausschließlich `PUBLISHED`. Der Filter sitzt in den
  Abfragen in `packages/db`, nicht in den Seiten — dort könnte er vergessen
  werden.

Die letzte Quelle eines veröffentlichten Eintrags lässt sich nicht entfernen.
Sonst stünde eine veröffentlichte Angabe ohne Herkunft da.

## Weitere Festlegungen

**Einheiten.** Jede Größe wird genau einmal gespeichert, in der gesetzlichen
Einheit. Leistung als **Kilowatt**; PS wird berechnet
(`kwToPs`, 1 PS = 735,49875 W). Zwei Spalten für dieselbe Größe laufen
auseinander, und dann ist nicht entscheidbar, welche stimmt.

**Verbrauch ohne Messzyklus ist wertlos.** Derselbe Wagen hat nach NEFZ und
nach WLTP verschiedene Werte. `measurementStandard` ist deshalb Pflichtfeld
mit Vorgabe `UNKNOWN` — nicht `WLTP`. Geraten wird nichts.

**`null` und „nicht erfasst" sind verschieden.** Bei `yearTo` heißt `null`
ausdrücklich „läuft noch", ein fehlendes Feld heißt „nicht erfasst". Die
Darstellung unterscheidet beides (`formatBuildPeriod`).

**Geldbeträge nie als Fließkommazahl.** Ab Phase 9 ganzzahlige Cent oder
`Decimal`.

**Quellen sind polymorph** (`subjectType` + `subjectId`). Der Preis ist eine
fehlende Fremdschlüsselbindung; die Alternative wären neun nahezu gleiche
Verknüpfungstabellen. Quellen werden ausschließlich über die Domänenschicht
geschrieben.

**Karosserieform als Tabelle, Kraftstoff als Aufzählung.** Die Liste der
Karosserieformen ist offen und soll ohne Migration wachsen; die Liste der
Kraftstoffarten ist geschlossen genug für eine Aufzählung.

## Duplikatvermeidung

| Tabelle | Eindeutig über |
|---|---|
| `Manufacturer` | `slug` |
| `Model` | `manufacturerId` + `slug` |
| `Generation` | `modelId` + `slug` |
| `FaceliftPhase` | `generationId` + `slug` |
| `Engine` | `manufacturerId` + `code` |
| `Transmission` | `name` + `type` + `gears` |
| `PowertrainCombination` | `generationId` + `engineId` + `transmissionId` + `driveType` |
| `TrimLine` | `generationId` + `slug` |
| `OptionalEquipment` | `manufacturerId` + `slug` |
| `OptionAvailability` | `optionId` + `generationId` + `trimLineId` |

Slugs entstehen aus dem Namen über `toSlug`, das Umlaute ausschreibt statt sie
zu verschlucken — „Größe" und „Grosse" bleiben unterscheidbar.

Verletzungen der Eindeutigkeit werden in verständliche Konfliktmeldungen
übersetzt („Diesen Motorcode gibt es bei diesem Hersteller bereits"), nicht in
einen Serverfehler.

## Löschverhalten

`onDelete: Restrict` überall dort, wo ein Löschen Katalogwissen vernichten
würde (Hersteller mit Modellen, Motor mit Antriebskombinationen).
`Cascade` nur bei echten Bestandteilen (Facelift-Phase zur Generation,
Paketposition zum Paket). `SetNull` bei loser Zuordnung (Karosserieform).

## Erweiterbarkeit

Fast jedes Feld außer Namen, Zuordnung und Kraftstoffart ist optional. Das ist
kein Nachlassen der Ansprüche, sondern Vorgabe C3: Ein unvollständig erfasstes
Fahrzeug muss erfassbar bleiben, sonst entsteht der Druck, Lücken zu füllen.

---

## Nachtrag Phase 6: die Verfügbarkeitsmatrix

Eine Sonderausstattung ist selten einfach „da" oder „nicht da". Sie kann
serienmäßig, gegen Aufpreis oder nur im Paket zu haben sein — und das je nach
**Baujahr, Ausstattungslinie und Motorvariante** verschieden. Genau das macht
sie beim Gebrauchtkauf schwer nachvollziehbar.

`OptionAvailability` trägt deshalb vier optionale Einschränkungen:
`trimLineId`, `powertrainId`, `packageId` und den Zeitraum. Jede Kombination
ist eine eigene Zeile. Die Oberfläche gruppiert danach **nach Ausstattung**,
nicht nach Zeile — der Leser sucht die Ausstattung, nicht den Datensatz.

### Eine Grenze der Datenbank, die man kennen muss

Die Eindeutigkeitsbedingung
`(optionId, generationId, trimLineId, powertrainId)` greift nur teilweise:
**PostgreSQL behandelt NULL-Werte als voneinander verschieden.** Zwei Zeilen
mit derselben Option, derselben Generation und überall sonst NULL verletzen
sie also nicht.

Der vollständige Schutz steht deshalb zusätzlich in der Anwendung
(`assertKeineDoppelteVerfuegbarkeit`). Das ist kein Ersatz für die Bedingung,
sondern ihre Ergänzung: Zwischen Prüfung und Einfügen kann theoretisch eine
zweite Anfrage dazwischenkommen. Für redaktionelle Stammdaten mit wenigen
Bearbeitenden ist dieses Restrisiko vertretbar; die Bedingung fängt alle Fälle
ab, in denen tatsächlich Werte gesetzt sind. Ein Test hält beides fest.

### Seltenheit ist nie eine Spezifikation

`rarity`, `purchaseRelevance` und `resaleRelevance` tragen ein **eigenes
Belegmodell** — und `SPECIFICATION` ist dabei gar nicht wählbar. Bestellquoten
und Wiederverkaufswirkung stehen in keinem Datenblatt. Wer eine dieser Angaben
macht, muss `ASSESSMENT` oder `MARKET_SIGNAL` wählen und die Begründung bzw.
Datengrundlage mitliefern.

### Ein Widerspruch, der beim Abtippen entsteht

Serienmäßig **und** nur über ein Aufpreispaket erhältlich schließen sich aus.
Der Fehler entsteht leicht beim Übertragen einer Preisliste und wird deshalb
schon bei der Eingabe abgelehnt.
