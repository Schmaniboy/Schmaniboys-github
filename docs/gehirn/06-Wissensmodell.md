# Wissensmodell — die drei Belegmodelle

Umsetzung in `packages/core/src/catalog/evidence.ts` und den vier
Wissenstabellen in `packages/db/prisma/schema.prisma`.

## Das Problem

Der Katalog aus Phase 2 sagt, **was** ein Fahrzeug ist. Die Wissensdatenbank
sagt, **wie es sich im Leben schlägt**. Diese zweite Sorte Aussage ist
gefährlicher als die erste:

| Aussage | Woher? |
|---|---|
| „140 kW, 400 Nm" | steht in einer Unterlage |
| „Der Motor gilt als haltbar" | **steht nirgends** — das ist ein Urteil |
| „Diese Generation ist gefragt" | eine Beobachtung mit Verfallsdatum |

Alle drei gleich darzustellen wäre die gefährlichste Form erfundener Daten:
eine, die aussieht wie ein Datenblatt. Vorgabe C3 verlangt deshalb, dass jede
Aussage ihr Belegmodell mitführt — und dass die Anforderungen je Modell
**erzwungen** werden, nicht empfohlen.

## Die drei Modelle

### SPECIFICATION — belegte Angabe

Nachprüfbar, aus einer Unterlage. Wird als Tatsache dargestellt.

**Bedingung zum Veröffentlichen:** mindestens eine Quelle der Art
`MANUFACTURER_DOCUMENT`, `TYPE_APPROVAL`, `TECHNICAL_LITERATURE` oder
`MEASUREMENT`.

Eine **Pressemitteilung genügt ausdrücklich nicht.** Sie ist eine
Absichtserklärung des Herstellers, kein Datenblatt. Wer nur eine solche Quelle
hat, kennzeichnet die Aussage als Einschätzung — das ist immer möglich und
immer ehrlicher.

### ASSESSMENT — Einschätzung der Redaktion

Ein Urteil, kein Messwert.

**Bedingung:** eine Begründung von mindestens 40 Zeichen. Ohne Begründung ist
eine Einschätzung eine Behauptung.

**Eine Einschätzung ist nie „gut belegt".** Die Güte wird auf höchstens
„eingeschränkt belegt" gedeckelt — alles andere wäre ein Widerspruch in sich.

### MARKET_SIGNAL — Marktbeobachtung

Aus Marktdaten abgeleitet, mit Verfallsdatum.

**Bedingung:** Datengrundlage (mindestens 20 Zeichen) **und** ein Stichtag.

Zusätzliche Deckelung der Güte:

- Stichprobe unter 30 Beobachtungen → höchstens „eingeschränkt belegt"
- Stichtag älter als 24 Monate → „schwach belegt", zusätzlich sichtbar als
  **überholt**

## Warum die Deckelung in der Anzeigekomponente sitzt

Zuerst berechnete die Seite die Güte selbst und zeigte den rohen Wert an.
Ergebnis: An einer drei Jahre alten Marktbeobachtung stand „gut belegt" —
direkt neben dem Hinweis „überholt".

Die Regel war vorhanden und getestet, nur nicht angewandt. Deshalb rechnet
jetzt **`EvidenceBadge` selbst**: Die Komponente bekommt die Rohwerte und
deckelt sie. Vergessen kann man es damit nicht mehr.

Aus demselben Grund werden die Quellenarten eines Eintrags **geladen und nicht
angenommen**. Eine angenommene Quellenart wäre genau die Art erfundener
Angabe, die die ganze Belegpflicht verhindern soll.

## Die vier Wissenstabellen

| Tabelle | Inhalt | Besonderheit |
|---|---|---|
| `KnownIssue` | Schwachstellen | Laufleistung als **Spanne**, Schwere in drei Stufen, Symptome und Abhilfe getrennt |
| `MaintenanceItem` | Wartung | Intervall in km **und/oder** Monaten; fällig ist, was zuerst eintritt |
| `CostEstimate` | Kosten | Immer als **Spanne**, in ganzzahligen Cent, mit Geltungsbereich |
| `KnowledgeNote` | Fließtext | Elf Themen von Zuverlässigkeit bis Kaufhinweis |

Jede hängt an einer Generation, wahlweise enger an einer
Antriebskombination — „der Diesel rostet" und „die Baureihe rostet" sind
verschiedene Aussagen.

Alle vier durchlaufen denselben Redaktionsablauf wie die Stammdaten und
zusätzlich den Belegcheck.

## Verständlichkeit

`packages/core/src/catalog/glossary.ts` erklärt vierzehn Fachbegriffe in
Alltagssprache — was die Größe bedeutet und warum sie beim Kauf zählt. Die
Erklärungen sind allgemeine Begriffsklärungen, **nie** fahrzeugbezogene
Angaben; letztere stehen ausschließlich in der Datenbank und brauchen dort
ihre Quelle.

Zwei Einträge tragen dabei eine Warnung, die sonst nur im Gehirn stünde:

- **VIN:** Modell, Motor und Ausstattung stehen *nicht* zuverlässig in der
  VIN. Das ist Blocker B7 in Lesersprache.
- **Verbrauch:** NEFZ- und WLTP-Werte sind nicht vergleichbar.

In der Oberfläche erscheinen die Begriffe als `<abbr>` mit Erklärung — ohne
JavaScript und ohne Überlagerung, die auf dem Telefon im Weg steht.

## Demobestand

`npm run db:seed:demo` legt einen **frei erfundenen** Bestand an, damit sich
die Darstellung prüfen lässt. Der Hersteller heißt „Musterfahrzeug
(Demodaten)", jede Quelle trägt den Hinweis „keine reale Quelle, frei
erfunden". Ein gekennzeichneter Demobestand ist etwas anderes als eine
Behauptung über ein echtes Auto — aber nur, solange die Kennzeichnung
untrennbar dranhängt. `npm run db:seed:demo -- --entfernen` räumt ihn weg.
