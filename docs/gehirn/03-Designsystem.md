# Designsystem — Schwarz + Neon Rot

Umsetzung in `apps/web/src/app/globals.css`. Diese Datei begründet die Werte,
die dort stehen.

## Haltung

Premium CARONEX. Die Fläche ist ruhig und dunkel, das Neon Rot ist knapp
und trägt Bedeutung: **eine Akzentfarbe pro Ansicht, auf genau einer
Handlung.** Wo alles leuchtet, leuchtet nichts. Keine Gaming-Optik, keine
Verläufe als Selbstzweck, keine Animation ohne Funktion (Vorgabe C4).

## Farben und geprüfte Kontraste

Alle Werte nach WCAG 2.1 in sRGB nachgerechnet, nicht geschätzt. Wer eine
Farbe ändert, rechnet den Wert neu.

### Flächen

| Token | Wert | Verwendung |
|---|---|---|
| `surface-0` | `#08090A` | Seitengrund |
| `surface-1` | `#0F1113` | Grundfläche der Inhalte |
| `surface-2` | `#16191D` | Karten |
| `surface-3` | `#1F242A` | Erhoben: Tabellenkopf, Modal, sekundäre Schaltfläche |

### Text auf `surface-1`

| Token | Wert | Kontrast | Eignung |
|---|---|---|---|
| `ink` | `#F5F7FA` | 17,63:1 | alles |
| `ink-muted` | `#AEB6BF` | 9,23:1 | alles |
| `ink-subtle` | `#858E98` | 5,69:1 | Fließtext gerade noch AA |

### Akzent

| Token | Wert | auf 0 / 1 / 2 / 3 |
|---|---|---|
| `accent` | `#FF3355` | 5,56 / 5,28 / 4,92 / **4,36** |
| `accent-strong` | `#FF5C73` | — / — / — / 5,23 |
| `accent-deep` | `#CC1F3C` | gedrückter Zustand |
| `accent-ink` | `#08090A` | Text **auf** Akzentfläche: 5,56:1 |

**Regel:** `accent` als Textfarbe nur auf `surface-0` bis `surface-2`. Auf
`surface-3` fällt es unter 4,5:1 — dort `accent-strong`.

### Rahmen

| Token | Wert | Kontrast auf 1/2/3 | Verwendung |
|---|---|---|---|
| `line` | `#2B3138` | 1,44 / 1,34 / 1,19 | nur Trennlinien ohne Bedeutung |
| `line-interactive` | `#6B747D` | 3,98 / 3,71 / 3,29 | Umriss von Bedienelementen |

Bedienelemente brauchen ≥ 3:1 gegen ihren Untergrund. `line` erfüllt das
nicht und darf deshalb **nie** ein Eingabefeld oder eine Schaltfläche
umranden.

### Zustände

`positive #34D399` (9,84) · `caution #FBBF24` (11,33) · `critical #F87171`
(6,84) · `neutral-state #60A5FA` (7,44) — alle auf `surface-1`.

### Fokus

`focus #FF7A8C`, ≥ 6,26:1 auf jeder Fläche. **Eigene Farbe statt des
Akzents:** Der Fokusring muss auch auf einer Akzentfläche sichtbar bleiben —
mit `accent` wäre er dort unsichtbar.

## Typografie

Systemschriften (`ui-sans-serif, system-ui, …`). Bewusst kein Webfont:

- kein externer Abruf und damit kein Datenabfluss an einen Schriftdienst,
- kein Layoutsprung beim Nachladen,
- keine Abhängigkeit, die beim Bauen erreichbar sein muss.

Sobald eine Hausschrift feststeht (offener Punkt B6), wird sie an genau einer
Stelle eingehängt.

Überschriften: `letter-spacing: -0.02em`, Gewicht 600. Die Klasse `.eyebrow`
trägt die kleine Versalzeile über Abschnitten — sie erzeugt die technische
Anmutung, ohne Zierrat.

## Verbindliche Regeln

1. **Farbe trägt nie allein eine Aussage.** Jeder Statuspunkt hat einen Text
   daneben. Rot-Grün-Blindheit betrifft rund acht Prozent der Männer.
2. **Sichtbarer Fokus ist Pflicht.** `:focus-visible` mit 2 px Ring und
   Abstand. Ohne ihn ist die Plattform per Tastatur nicht bedienbar.
3. **Jedes Feld hat ein sichtbares Label.** Platzhaltertext ist kein Label —
   er verschwindet beim Tippen.
4. **`prefers-reduced-motion` wird respektiert.**
5. **Breite Inhalte scrollen in sich selbst.** Die Seite darf nie waagerecht
   scrollen (geprüft: 0 px Überlauf bei 390 px Breite).
6. **Ein Link ist ein Link, eine Schaltfläche eine Schaltfläche.** `<button>`
   in `<a>` ist ungültiges HTML — dafür gibt es `LinkButton`.

## Bestand an Komponenten (Phase 1)

`Button` / `LinkButton` · `Card` mit `CardHeader`/`CardBody` · `Badge` ·
`InputField` / `SelectField` · `Table` mit `Th`/`Td` · `Modal` (natives
`<dialog>`) · `StatusIndicator` · `VehicleCard` · `DataGap` / `SourceNote` ·
`SiteHeader` / `SiteFooter` / `DashboardShell` / `ComingSoon`.

`DataGap` und `SourceNote` sind die sichtbare Seite von Vorgabe C3: Eine
fehlende Angabe bekommt eine Darstellung, damit niemand in Versuchung gerät,
sie zu füllen.
