# CARONEX – MASTERPLAN V2.5

**Status:** Verbindlicher aktueller Masterplan
**Version:** 2.5
**Projekt:** CARONEX
**Arbeitsmodus:** Autonomous Execution
**Technologie:** Bestehendes Next.js-/TypeScript-Projekt
**Grundsatz:** Bestehendes Projekt weiterentwickeln, nicht unnötig neu bauen.

---

# 0. VERBINDLICHE GRUNDREGEL

CARONEX soll **gebaut und kontinuierlich verbessert** werden.

Der Masterplan ist keine reine Dokumentation.

Claude Code soll aus diesem Dokument konkrete technische Aufgaben ableiten und diese tatsächlich umsetzen.

## Arbeitszyklus

```text
MASTERPLAN LESEN
↓
AKTUELLEN PROJEKTSTAND PRÜFEN
↓
NÄCHSTE PRIORITÄT BESTIMMEN
↓
IMPLEMENTIEREN
↓
TESTEN
↓
FEHLER BEHEBEN
↓
STATUS AKTUALISIEREN
↓
CHECKPOINT SPEICHERN
↓
NÄCHSTE AUFGABE
```

Nicht:

```text
PLANEN
↓
NOCHMAL PLANEN
↓
DOKUMENTIEREN
↓
WARTEN
```

## Absolute Regel

> Wenn eine Aufgabe technisch eindeutig ist, wird sie umgesetzt und nicht erst zur Bestätigung vorgelegt.

Nur bei echten Architektur-, Kosten-, Datenverlust- oder rechtlichen Entscheidungen ist eine Rückfrage erforderlich.

---

# 1. PROJEKTGEDÄCHTNIS

Das Projekt muss nach Context Resets und Session-Wechseln weiterarbeiten können.

Vor jeder neuen Session bzw. nach Context Reset sind die vorhandenen Projektdateien zu lesen.

Priorität:

1. `CLAUDE.md`
2. `docs/MASTERPLAN_V2.5.md`
3. `docs/STATUS.md`
4. `docs/TASK_QUEUE.md`
5. `docs/CARONEX_CHECKPOINT.md`
6. aktueller Git-Status
7. relevante Projektdateien

Der alte Masterplan ist nur Archiv und darf nicht als aktuelle Arbeitsgrundlage verwendet werden.

## Wichtig

Nicht bereits erledigte Aufgaben erneut bauen.

Nicht bei jedem Context Reset einen neuen Plan erfinden.

Nicht den bisherigen Fortschritt verlieren.

Immer beim letzten offenen Arbeitsschritt weitermachen.

---

# 2. EXECUTION MODE

CARONEX befindet sich im aktiven Entwicklungsmodus.

Claude soll:

* vorhandenen Code analysieren
* Entscheidungen selbstständig treffen
* Code tatsächlich verändern
* Funktionen implementieren
* UI verändern
* Fehler beheben
* Tests durchführen
* Status dokumentieren
* mit der nächsten Aufgabe fortfahren

## Real Change Rule

Eine Aufgabe gilt nur als erledigt, wenn eine tatsächliche technische Änderung erfolgt ist.

Dokumentation allein ist keine Implementierung.

Wenn eine UI-Aufgabe verlangt wird, muss die Website tatsächlich anders aussehen oder sich anders verhalten.

Keine Fake-Implementierungen.

Keine leeren Buttons.

Keine nicht funktionierenden Funktionen.

Keine reine TODO-Erstellung als Ersatz für Entwicklung.

---

# 3. AUTONOMES ARBEITEN

Wenn eine Aufgabe eindeutig ist:

**UMSETZEN.**

Nicht ständig fragen:

* Soll ich das machen?
* Soll ich diese Datei ändern?
* Soll ich weitermachen?
* Möchtest du diese Variante?

Selbstständig entscheiden, solange die Entscheidung keine erhebliche irreversible Konsequenz hat.

Nach Abschluss einer Aufgabe automatisch die nächste offene sinnvolle Aufgabe beginnen.

---

# 4. BESTEHENDES PROJEKT SCHÜTZEN

CARONEX wird auf Basis des bestehenden Projekts weiterentwickelt.

Vor jeder Neuimplementierung prüfen:

* vorhandene Komponenten
* vorhandene Routes
* vorhandene APIs
* vorhandene Datenmodelle
* vorhandene Styles
* vorhandene PDF-Funktionen
* vorhandene Authentifizierung
* vorhandene Dokumente
* bestehende Designstruktur

Bestehende funktionierende Lösungen bevorzugt erweitern.

Keine unnötige komplette Neuentwicklung.

Keine unnötigen Datenbankmigrationen.

Keine unnötige Änderung der Architektur.

---

# 5. TECHNOLOGIE

Bestehende Technologie weiterverwenden.

Aktuell bekannte Grundlage:

* Next.js
* App Router
* TypeScript
* Prisma
* PostgreSQL
* pnpm
* Node.js
* bestehende Projektstruktur
* bestehendes Frontend
* bestehende Komponenten

Versionen nicht unnötig aktualisieren.

Stabilität vor „immer neueste Version“.

Vor Updates Kompatibilität prüfen.

---

# 6. SKILLS, PLUGINS UND TOOLS

Vor jeder größeren Aufgabe prüfen, welche vorhandenen Skills, Plugins oder Werkzeuge sinnvoll sind.

Vorhandene Werkzeuge/Skills umfassen unter anderem:

* Frontend Design
* Code Review
* Code Simplifier
* Feature Dev
* Security Guidance
* Commit Commands
* TypeScript LSP
* PR Review Toolkit
* Superpowers
* taste-skill / Design Taste
* Impeccable
* Emil Design
* Anthropic SDK
* Omni-Route

## Regel

Nicht jedes Tool blind verwenden.

Das passende Tool für die konkrete Aufgabe verwenden.

### Frontend

Geeignete Design-Skills verwenden für:

* Layout
* visuelle Hierarchie
* responsive Design
* Animationen
* Spacing
* Typografie
* Karten
* Navigation
* UX

### Code

Geeignete Entwicklungs-/Review-Skills verwenden für:

* Features
* Refactoring
* TypeScript
* Codequalität
* Tests
* Security

---

# 7. OMNI-ROUTE

Claude bleibt der Hauptagent.

Omni-Route kann genutzt werden, um geeignete Aufgaben an andere Modelle zu routen.

Ziel:

* Claude-Tokens sparen
* unnötige Kosten vermeiden
* trotzdem hohe Qualität erreichen

## Routing-Prinzip

Einfache Aufgaben:

→ günstigeres/geeignetes Modell möglich.

Komplexe Architektur-, Sicherheits- oder schwierige Entwicklungsaufgaben:

→ stärkeres Modell verwenden.

Second Opinion:

→ nur wenn tatsächlich sinnvoll.

Keine unnötigen Modellaufrufe.

Keine unnötigen Kosten.

Keine Umgehung von Nutzungsbedingungen.

---

# 8. HAUPTNAVIGATION

Die aktuelle Hauptstruktur soll auf folgende Bereiche ausgerichtet werden:

```text
Fahrzeuge
Motoren
Ausstattung
Verkaufen
Dokumente
[freier Bereich für spätere Erweiterung]
```

`Kaufberatung` nicht als aktueller Hauptbereich verwenden.

`Fahrzeugwissen` jetzt noch nicht vollständig bauen.

Fahrzeugwissen ist eine spätere Erweiterung.

---

# 9. FAHRZEUGE

CARONEX soll langfristig einen strukturierten Fahrzeugkatalog aufbauen.

Grundstruktur:

```text
Marke
↓
Modell
↓
Generation
↓
Facelift / Vor-Facelift
↓
Baujahr
↓
Karosserie
↓
Variante
```

Beispiel:

```text
Audi
→ A4
→ B9
→ Facelift
→ 2020
→ Limousine
→ 40 TDI quattro
```

## Wichtig

`quattro`, `xDrive`, `4MATIC` usw. sind Antriebssysteme.

Sie sind keine Motoren.

Der Motor muss separat behandelt werden.

---

# 10. TECHNISCHE GRUNDDATEN

Für Fahrzeugvarianten sollen relevante technische Grunddaten dargestellt werden.

Mindestens:

* Baujahr
* Karosserie
* Motor
* Motorcode, sofern zuverlässig bekannt
* Leistung PS
* Leistung kW
* Hubraum
* Kraftstoff
* Getriebe
* Antrieb
* Zylinder
* Drehmoment

Optional, sofern zuverlässig verfügbar:

* Verbrauch
* Maße
* Kofferraum
* Anhängelast
* Leergewicht
* Tankvolumen

Antrieb kann beispielsweise sein:

* Frontantrieb
* Hinterradantrieb
* quattro
* xDrive
* 4MATIC
* weitere herstellerspezifische Systeme

Keine erfundenen technischen Daten.

---

# 11. FAHRZEUGBILDER

Bei einer konkreten Fahrzeugvariante müssen passende Bilder verwendet werden.

Beispiel:

Audi A4 B9 Facelift

→ Bild eines Audi A4 B9 Facelift.

Nicht:

* B8
* B9 Vor-Facelift
* B10
* falsche Karosserie
* falsches Modell

Wenn Bilder rechtlich und technisch sauber verwendet werden können:

→ bevorzugt freigestellte / transparente Fahrzeugbilder.

Keine fremden Bilder ohne entsprechende Nutzungsrechte übernehmen.

Bildquelle bzw. Lizenzstatus nachvollziehbar halten.

---

# 12. AUSSTATTUNG

Die Ausstattung soll möglichst vollständig und strukturiert werden.

Relevante Kategorien unter anderem:

### Infotainment

* MMI
* Navigation
* Display
* Virtual Cockpit
* Head-Up Display
* Bluetooth
* Smartphone Integration

### Soundsystem

* Standard-Soundsystem
* Premium-Soundsystem
* Lautsprecheranzahl
* Subwoofer
* herstellerspezifische Soundsysteme

### Licht

* Halogen
* Xenon
* LED
* Matrix LED
* adaptive Beleuchtung
* Kurvenlicht

### Assistenzsysteme

* ACC
* Spurhalteassistent
* Totwinkelassistent
* Verkehrszeichenerkennung
* Notbremsassistent
* Parkassistent
* Einparkhilfe
* Rückfahrkamera
* 360° Kamera

### Komfort

* Sitzheizung
* Sitzbelüftung
* elektrische Sitze
* Memory
* Sportsitze
* Leder
* Alcantara
* Komfortsitze
* Klimaautomatik
* Standheizung
* Panorama-/Schiebedach

### Exterieur

* Anhängerkupplung
* Felgen
* Reifen
* Sportpakete
* S-Line / M / AMG / R-Line usw.
* Sonderausstattung

### Innenraum

* Lenkrad
* Multifunktionslenkrad
* Dekorleisten
* Ambientebeleuchtung
* Innenraumoptionen

### Farben

* Außenfarbe
* Metallic
* Sonderlackierung
* Innenraumfarbe

### Pakete

* Komfortpakete
* Technikpakete
* Assistenzpakete
* Sportpakete
* Lichtpakete
* weitere Herstellerpakete

---

# 13. HISTORISCHE AUSSTATTUNGSPREISE

Wenn historische Neupreise verfügbar sind, sollen diese möglichst korrekt angegeben werden.

Dabei immer berücksichtigen:

* Modelljahr
* Land/Markt
* Preisstand
* Ausstattung
* Paket
* Quelle

Nicht einfach heutige Preise als historische Preise verwenden.

Wenn der historische Preis nicht zuverlässig belegt werden kann:

```text
Preis nicht zuverlässig belegt.
```

Keine erfundenen Preise.

---

# 14. QUELLEN

CARONEX benötigt transparente Datenherkunft.

Geeignete Quellen:

* Hersteller
* offizielle Preislisten
* offizielle Prospekte
* technische Dokumentationen
* seriöse technische Quellen
* zuverlässige Fachquellen

Jede wichtige Information soll nachvollziehbar sein.

Wo sinnvoll:

```text
Quelle öffnen
```

## Quellentypen

Kennzeichnungen:

```text
HERSTELLERANGABE
TECHNISCHE QUELLE
CARONEX-ZUSAMMENFASSUNG
NUTZERANGABE
PERSÖNLICHE BEWERTUNG
ERFAHRUNGSWERT
```

Keine erfundenen Quellen.

Keine erfundenen URLs.

Keine erfundenen Preise.

---

# 15. DESIGN

CARONEX soll premium, modern und automotive wirken.

Grundrichtung:

* dunkles Interface
* hochwertig
* futuristisch
* dezente Neon-Akzente
* Tiefe
* Glas-/Glassmorphism-Effekte, wo sinnvoll
* dezente 3D-Effekte
* Glow
* moderne Karten
* hochwertige Hover-Effekte
* saubere Animationen
* klare Typografie
* professionelle Informationsarchitektur

Nicht wie ein billiges Gaming-Template.

Nicht überladen.

Performance bleibt wichtig.

Bestehendes Design weiterentwickeln statt blind komplett ersetzen.

---

# 16. LOGO

Das bestehende CARONEX-Logo verwenden.

Besonders prüfen:

* Header
* Navigation
* Mobile
* Desktop
* Größenverhältnis
* Position
* Abstand
* Schärfe
* Skalierung

Keine Verzerrung.

Logo darf nicht unnötig groß oder klein wirken.

---

# 17. LOGIN / REGISTRIERUNG

Login und Registrierung müssen zuverlässig funktionieren.

Bekanntes Problem:

Die Login-Oberfläche wurde teilweise erst nach Scrollen sichtbar.

Dieses Verhalten vollständig untersuchen und beheben.

Prüfen:

* Rendering
* Hydration
* State
* Modal
* CSS
* Animation
* Overflow
* Z-Index
* Mobile
* Desktop

Login/Registrierung müssen direkt sichtbar und benutzbar sein.

---

# 18. PASSWORT-FELDER

Passwortfelder:

Standard:

```text
versteckt
```

Eye-Button:

```text
Klick → sichtbar
Klick → wieder verborgen
```

Passwörter niemals im Klartext speichern.

---

# 19. VERKAUFEN – OHNE KI

Der Verkaufsbereich wird in dieser Version vollständig **ohne KI** umgesetzt.

Keine KI-generierten Verkaufstexte.

Keine KI-basierte Preisbewertung.

Keine erfundenen Fahrzeugangaben.

---

# 20. VERKAUFSFLOW

Der Ablauf:

```text
1 Fahrzeug
→
2 Zustand
→
3 Ausstattung
→
4 Bilder
→
5 Verkaufstext
→
6 Preis
→
7 PDF
```

Der Nutzer kann jederzeit zurückgehen.

Fortschrittsanzeige:

```text
1 Fahrzeug → 2 Zustand → 3 Ausstattung → 4 Bilder → 5 Verkaufstext → 6 Preis → 7 PDF
```

Status klar anzeigen.

---

# 21. FAHRZEUGDATEN IM VERKAUFSFLOW

Der Nutzer kann eingeben:

* Marke
* Modell
* Baujahr
* Erstzulassung
* Kilometerstand
* Motor
* Motorleistung
* Getriebe
* Kraftstoff
* Farbe
* Vorbesitzer
* HU
* Servicehistorie
* Wartungen
* Reparaturen
* bekannte Schäden
* Anzahl Schlüssel
* Zubehör

Unbekannte Informationen:

```text
Keine Angabe
```

Keine automatische Vermutung.

---

# 22. ZUSTAND

Abfragen:

### Unfall

```text
Unfallfrei?
Ja
Nein
Keine Angabe
```

### Schäden

* bekannte Schäden
* Kratzer
* Dellen
* Rost
* Steinschläge
* Felgenschäden
* Glasschäden
* technische Probleme
* Warnleuchten
* bekannte Reparaturen

Freitext:

```text
Was ist dir aufgefallen?
```

Der Nutzer kann seine Angaben jederzeit bearbeiten.

---

# 23. SCHÄDEN EHRLICH DARSTELLEN

CARONEX darf Schäden nicht automatisch schönreden.

Keine Formulierungen wie:

```text
kleine Gebrauchsspuren
```

wenn der Nutzer einen erheblichen Schaden angegeben hat.

Keine automatische Verharmlosung.

Keine erfundenen Aussagen.

Schäden sollen nachvollziehbar dargestellt werden.

---

# 24. BILDER – CHECKLISTE

Empfohlene Bilder:

* Front schräg
* Heck schräg
* linke Seite
* rechte Seite
* Front gerade
* Heck gerade
* kompletter Innenraum
* Cockpit / Fahrersitz
* Armaturenbrett / Instrumente
* Infotainment
* Sitze
* Kofferraum
* Reifen
* Felgen
* Motorraum
* vorhandene Schäden
* besondere Ausstattung

Nicht jedes Fahrzeug benötigt jeden Punkt.

### Wichtig

Ein separates Kilometerfoto ist nicht notwendig.

Ein Foto vom Armaturenbrett / Instrumentenbereich reicht, sofern der Kilometerstand darauf sichtbar ist.

---

# 25. FOTO-TIPPS

Empfehlungen:

* Tageslicht
* Fahrzeug sauber
* Innenraum sauber
* ruhiger Hintergrund
* Fahrzeug vollständig im Bild
* ausreichend Abstand
* Kamera möglichst gerade
* keine extremen Filter
* wichtige Bereiche nicht abschneiden
* aktuelle Bilder verwenden

---

# 26. DATENSCHUTZ BEI FOTOS

Hinweisen auf:

* persönliche Dokumente
* Adressen
* Telefonnummern
* private Briefe
* andere persönliche Informationen

Kennzeichen können auf Wunsch unkenntlich gemacht werden.

Keine unnötigen persönlichen Daten öffentlich zeigen.

---

# 27. UNTERLAGEN-CHECKLISTE

Mögliche Unterlagen:

* Fahrzeugschein
* Fahrzeugbrief
* HU-Unterlagen
* Serviceunterlagen
* Rechnungen
* Bedienungsanleitung
* alle Schlüssel
* Zubehör
* weitere relevante Unterlagen

---

# 28. PROBEFAHRT

Praktische Hinweise:

* Fahrzeug gemeinsam prüfen
* ungewöhnliche Geräusche beachten
* Bremsen prüfen
* Lenkung prüfen
* Kupplung / Getriebe beobachten
* Warnleuchten beachten
* Fahrverhalten beobachten
* ungewöhnliche Geräusche notieren

Die Checkliste ersetzt keine technische Diagnose.

---

# 29. PREIS-TIPPS

Preisvergleich anhand von:

* Modell
* Baujahr
* Kilometerstand
* Motor
* Leistung
* Ausstattung
* Zustand
* HU
* Vorbesitzern
* regionaler Marktsituation

Keine exakte automatische Fahrzeugbewertung versprechen, solange keine zuverlässige Bewertungsfunktion vorhanden ist.

---

# 30. TYPISCHE VERKAUFSFEHLER

Hinweise:

* schlechte Fotos
* dunkle Fotos
* zu wenige Fotos
* alte Fotos
* Schäden verschweigen
* falsche Ausstattung
* falscher Kilometerstand
* wichtige Informationen fehlen
* übertriebene Versprechen
* fehlende Unterlagen

---

# 31. VERKAUFSTEXT

Der Verkaufstext wird deterministisch aus den Angaben des Nutzers aufgebaut.

Keine KI.

Keine erfundenen Eigenschaften.

Keine erfundenen Schäden.

Keine erfundene Wartung.

Keine erfundene Historie.

Keine erfundenen Ausstattungsmerkmale.

Der Nutzer kann den erzeugten Text vollständig bearbeiten.

---

# 32. VERKAUFS-PDF

Der Nutzer soll kostenlos ein professionelles Verkaufs-PDF erzeugen können.

PDF enthält:

* CARONEX Logo oben links
* Fahrzeugdaten
* technische Daten
* Ausstattung
* Zustand
* Nutzerangaben
* Verkaufstext
* Preis
* Kontaktdaten
* Erstellungsdatum

Hinweis:

```text
Die Angaben basieren auf den vom Nutzer bereitgestellten
Informationen sowie den im Dokument angegebenen Fahrzeugdaten
und Quellen.

Dieses Dokument stellt keine technische Untersuchung,
Begutachtung oder Sachverständigenbewertung dar.
```

Professionelles Layout:

* klare Überschriften
* ausreichend Weißraum
* Tabellen
* Seitenzahlen
* Datum
* gegebenenfalls Unterschriftenbereiche

---

# 33. DOKUMENTE

Bereiche:

```text
Kaufvertrag
Übergabeprotokoll
Käufer-Checkliste
Fahrzeugbericht
Verkaufsunterlagen
```

Alle CARONEX-Dokumente:

* CARONEX-Logo
* professionelles Layout
* druckbar
* online ausfüllbar, soweit technisch sinnvoll
* keine fremden Markenlogos

---

# 34. KAUFVERTRAG

Der CARONEX-Kaufvertrag soll professionell aufgebaut sein.

Mögliche Bereiche:

### Verkäufer

* Name
* Anschrift
* Kontaktdaten

### Käufer

* Name
* Anschrift
* Kontaktdaten

### Fahrzeug

* Hersteller
* Modell
* FIN/VIN
* Erstzulassung
* Kilometerstand
* Kennzeichen
* Motor
* Leistung
* Getriebe
* Kraftstoff

### Zustand

* Unfallstatus
* bekannte Schäden
* bekannte Mängel
* Wartungen
* Reparaturen
* sonstige Vereinbarungen

### Zahlung

* Kaufpreis
* Zahlungsart
* Zahlungsstatus

### Übergabe

* Datum
* Uhrzeit
* Ort
* Kilometerstand
* Schlüssel
* Unterlagen
* Zubehör

### Unterschriften

* Verkäufer
* Käufer

---

# 35. RECHTLICHE ROLLE VON CARONEX

CARONEX ist:

* nicht Verkäufer
* nicht Käufer
* nicht Händler
* nicht Vermittler
* nicht Eigentümer
* nicht Sachverständiger
* nicht Gutachter
* nicht Garantiegeber
* nicht Vertragspartei

CARONEX stellt lediglich:

* Vorlagen
* digitale Werkzeuge
* Dokumentengeneratoren
* Checklisten
* Informationsinhalte

bereit.

Keine Formulierung darf den Eindruck erwecken, CARONEX sei Vertragspartei.

---

# 36. RECHTLICHE SICHERHEIT

Keine Aussage:

```text
100 % rechtssicher
```

Keine Garantie:

```text
100 % rechtlich geschützt
```

Stattdessen:

Rechtliche Inhalte müssen vor dem Live-Betrieb fachlich bzw. anwaltlich geprüft werden.

Gesetzliche zwingende Rechte dürfen nicht durch einen Hinweis ausgeschlossen werden.

Besonders unterscheiden:

### Privat → Privat

Andere Möglichkeiten beim Ausschluss der Sachmängelhaftung als bei:

### Unternehmer → Verbraucher

Bekannte Mängel dürfen nicht verschwiegen werden.

Arglist und ausdrücklich übernommene Garantien sind gesondert zu berücksichtigen.

---

# 37. KAUFVERTRAG – WICHTIG

Nicht nur:

```text
gekauft wie gesehen
```

verwenden.

Dieser Satz ersetzt keine vollständige Dokumentation bekannter Schäden/Mängel.

Bekannte relevante Informationen müssen sauber erfasst werden.

Rechtlich kritische Klauseln mit:

```text
[RECHTLICH PRÜFEN]
```

kennzeichnen, bis eine fachliche Prüfung erfolgt ist.

---

# 38. ÜBERGABEPROTOKOLL

Das Übergabeprotokoll soll enthalten:

* Datum
* Uhrzeit
* Ort
* Käufer
* Verkäufer
* Fahrzeug
* Kilometerstand
* Tankfüllstand
* Schlüssel
* Fahrzeugdokumente
* Zubehör
* sichtbare Schäden
* weitere Vereinbarungen
* Unterschriften

---

# 39. KÄUFER-CHECKLISTE

Die Checkliste muss auch für Personen verständlich sein, die wenig technisches Fahrzeugwissen haben.

Bereiche:

## Außen

* Lack
* Dellen
* Kratzer
* Spaltmaße
* Scheiben
* Beleuchtung
* Reifen
* Felgen

## Innenraum

* Sitze
* Lenkrad
* Klima
* elektrische Funktionen
* Infotainment
* Fensterheber
* Zentralverriegelung
* Warnleuchten

## Motor

* Kaltstart
* ungewöhnliche Geräusche
* Flüssigkeiten
* Rauch
* Motorlauf

## Probefahrt

* Kupplung
* Getriebe
* Bremsen
* Lenkung
* Fahrwerk
* Beschleunigung
* Geräusche

## Unterlagen

* Fahrzeugschein
* Fahrzeugbrief
* HU
* Serviceunterlagen
* Rechnungen
* Schlüssel

---

# 40. CHECKLISTEN-BEWERTUNGEN

Klickbare Sterne:

```text
☆ ☆ ☆ ☆ ☆
```

Bewertungen:

* Gesamteindruck
* Fahrzeugzustand
* Preis-Leistung
* Probefahrt

Kennzeichnung:

```text
Persönliche Einschätzung des Nutzers
```

Diese Bewertung ist keine professionelle Fahrzeugbewertung.

---

# 41. CHECKLISTEN-STATUS

Für relevante Punkte:

```text
OK
Auffällig
Nicht geprüft
```

Wenn:

```text
Auffällig
```

→ Freitext ermöglichen.

Wichtig:

`Auffällig` darf nicht automatisch zu `Defekt` umgewandelt werden.

---

# 42. RECHTLICHER HINWEIS CHECKLISTE

Die Checkliste ist:

* Orientierungshilfe
* keine technische Untersuchung
* keine Diagnose
* kein Gutachten
* kein Sachverständigenbericht
* keine Garantie für das Auffinden sämtlicher Mängel

Die Kaufentscheidung bleibt beim Nutzer.

---

# 43. FAHRZEUGBERICHT

Der Fahrzeugbericht soll Daten sauber trennen.

## CARONEX-Daten

Informationen aus strukturierten Quellen.

## Nutzerangaben

Informationen, die der Nutzer selbst eingegeben hat.

## Persönliche Bewertung

Bewertungen des Nutzers.

Diese Bereiche dürfen nicht vermischt werden.

---

# 44. DEMO-DOKUMENTE

Demo-Berichte und Vorschauen ermöglichen.

Alle Demo-Dokumente müssen deutlich als:

```text
DEMO
```

gekennzeichnet sein.

Keine echten persönlichen Daten verwenden.

Keine Demo-Daten als echte Fahrzeugdaten darstellen.

---

# 45. ADMIN-BEREICH

Der Admin-Bereich soll einfach und übersichtlich bleiben.

Mögliche Bereiche:

* Dokumente
* Quellen
* Fahrzeugdaten
* Inhalte
* rechtliche Hinweise
* Versionen
* Benutzer
* Funktionen
* Token
* Coupons
* Einstellungen

Nicht unnötig kompliziert machen.

---

# 46. FREE / TOKEN-SYSTEM

Aktuell kostenlos:

* Käufer-Checkliste
* Kaufvertrag
* Verkaufs-PDF

Weitere Funktionen können später über ein Token-System geregelt werden.

Admin soll später konfigurieren können:

```text
Funktion
→ kostenlos / Token
→ Token-Anzahl
```

Dafür jetzt keine unnötige Datenbankarchitektur bauen.

Bestehende Infrastruktur wiederverwenden, sofern vorhanden.

---

# 47. SICHERHEIT

Besonders beachten:

* Authentifizierung
* Autorisierung
* Passwortsicherheit
* Eingabevalidierung
* XSS
* CSRF, soweit relevant
* Injection
* API-Sicherheit
* Dateiuploads
* PDF-Erzeugung
* persönliche Daten
* Admin-Zugriff

Security Guidance verwenden, wenn sinnvoll.

---

# 48. DATENBANK

Keine unnötigen Migrationen.

Vor einer Schemaänderung prüfen:

1. Ist sie wirklich erforderlich?
2. Gibt es bereits ein passendes Feld?
3. Kann bestehende Struktur verwendet werden?
4. Ist eine Migration sicher?
5. Welche Auswirkungen hat sie?

Bestehende Daten niemals leichtfertig verändern oder löschen.

---

# 49. PERFORMANCE

CARONEX soll schnell bleiben.

Beachten:

* unnötige Client Components vermeiden
* Bilder optimieren
* Lazy Loading
* unnötige JavaScript-Bundles vermeiden
* Animationen performant gestalten
* keine unnötigen Abhängigkeiten installieren

3D-/Glow-/Animationseffekte dürfen Performance nicht zerstören.

---

# 50. TESTING

Nach relevanten Änderungen:

* TypeScript
* Lint, sofern vorhanden
* Build
* betroffene Funktion
* Navigation
* Formulare
* Fehlerzustände

Frontend:

* Desktop
* Mobile

Bei wichtigen Funktionen:

* Normalfall
* Fehlerfall
* leere Eingaben
* ungültige Eingaben

---

# 51. ONE-CLICK START

Das Projekt soll möglichst einfach gestartet werden können.

Ziel:

```text
CARONEX-START.bat
```

Doppelklick:

1. Projektverzeichnis finden
2. Node prüfen
3. pnpm prüfen
4. Abhängigkeiten prüfen
5. Prisma prüfen
6. notwendige Konfiguration prüfen
7. Entwicklungsserver starten
8. lokale URL anzeigen

Ziel:

```text
http://localhost:3000
```

Keine unnötigen manuellen Schritte.

---

# 52. ONE-CLICK UPDATE

Optional:

```text
CARONEX-UPDATE.bat
```

Soll:

* Git-Status prüfen
* vorhandene Änderungen berücksichtigen
* Dependencies prüfen
* kompatible Updates prüfen
* pnpm install ausführen, wenn erforderlich
* Prisma prüfen
* TypeScript prüfen
* Build prüfen

Nicht blind alle Dependencies auf die neuesten Versionen aktualisieren.

Stabilität vor Aktualität.

Keine fremden Änderungen überschreiben.

---

# 53. GIT

Nach stabilen größeren Arbeitspaketen:

* Git Status prüfen
* sinnvollen Commit erstellen
* falls vorgesehen pushen

Beispiele:

```text
fix: repair login rendering
feat: improve vehicle catalog
feat: add buyer checklist
feat: add sales pdf
feat: add purchase contract
fix: improve responsive navigation
```

---

# 54. STATUS-PFLEGE

`STATUS.md` muss den tatsächlichen Stand widerspiegeln.

Nach größeren Aufgaben aktualisieren:

* Bereich
* Aufgabe
* Status
* geänderte Dateien
* Tests
* Fehler
* nächster Schritt

Keine Aufgabe als DONE markieren, wenn sie nicht tatsächlich fertig ist.

---

# 55. TASK QUEUE

`TASK_QUEUE.md` enthält die konkrete Reihenfolge der Umsetzung.

Nach Abschluss:

```text
[ ] → [x]
```

Danach nächste sinnvolle offene Aufgabe.

Wenn eine Aufgabe nicht mehr relevant ist:

Begründung dokumentieren.

---

# 56. CHECKPOINT

`CARONEX_CHECKPOINT.md` speichert den letzten Arbeitsstand.

Enthalten:

* aktueller Bereich
* aktuelle Aufgabe
* erledigte Aufgaben
* gerade bearbeitete Dateien
* Tests
* Fehler
* nächste Aufgabe

Bei Context Reset zuerst lesen.

---

# 57. CONTEXT RESET

Bei:

* Context Limit
* Session Limit
* Neustart
* Claude-Code-Neustart
* neuem Chat

nicht von vorne anfangen.

Ablauf:

```text
CLAUDE.md
↓
MASTERPLAN_V2.5.md
↓
STATUS.md
↓
TASK_QUEUE.md
↓
CARONEX_CHECKPOINT.md
↓
GIT STATUS
↓
PROJEKT PRÜFEN
↓
WEITERARBEITEN
```

---

# 58. KEINE ENDLOSEN ANALYSEN

Eine kurze Bestandsaufnahme ist sinnvoll.

Eine stundenlange Analyse ohne Umsetzung ist nicht akzeptabel.

Wenn die nächste Aufgabe eindeutig ist:

→ implementieren.

---

# 59. KEINE FAKE-FORTSCHRITTE

Nicht schreiben:

```text
Feature erfolgreich umgesetzt.
```

wenn lediglich:

* eine Datei erstellt
* ein Button angelegt
* eine TODO geschrieben
* ein Konzept beschrieben

wurde.

„Umgesetzt“ bedeutet funktionierende Implementierung.

---

# 60. SICHTBARER FORTSCHRITT

Bei Frontend-Aufgaben muss sich die Website tatsächlich verändern.

Beispiele:

* Navigation verbessert
* Login sichtbar repariert
* Karten überarbeitet
* Formulare funktionierend
* Animationen eingebaut
* Seiten fertiggestellt
* PDF-Generator verbessert
* Dokumente integriert

Der Nutzer muss den Fortschritt in der Website erkennen können.

---

# 61. PRIORITÄTEN

Bei mehreren offenen Aufgaben:

## Priorität 1

Kaputte Funktionen reparieren.

## Priorität 2

Start / Build / Runtime stabilisieren.

## Priorität 3

Login / Registrierung.

## Priorität 4

Navigation.

## Priorität 5

Design / UX.

## Priorität 6

Fahrzeugkatalog.

## Priorität 7

Motoren / technische Daten.

## Priorität 8

Ausstattung / Quellen.

## Priorität 9

Verkaufsbereich.

## Priorität 10

Dokumente / PDFs.

## Priorität 11

Admin.

## Priorität 12

Performance / Feinschliff.

Spätere Features erst danach.

---

# 62. FAHRZEUGWISSEN

Der Bereich `Fahrzeugwissen` wird bewusst noch nicht vollständig umgesetzt.

Er bleibt für eine spätere Phase vorgesehen.

---

# 63. KI IM VERKAUFSBEREICH

In V2.5 ausdrücklich:

```text
KEINE KI
```

für:

* Verkaufstext
* Preisermittlung
* Zustandsbewertung

Der Verkaufsbereich basiert auf Nutzereingaben und deterministischen Funktionen.

---

# 64. DATENTRENNUNG

CARONEX muss unterscheiden zwischen:

```text
HERSTELLERANGABE
TECHNISCHE QUELLE
CARONEX-ZUSAMMENFASSUNG
NUTZERANGABE
PERSÖNLICHE BEWERTUNG
ERFAHRUNGSWERT
```

Eine persönliche Meinung darf nicht wie eine Herstellerangabe aussehen.

Eine Nutzerangabe darf nicht automatisch als bestätigte technische Tatsache dargestellt werden.

---

# 65. RECHTLICHE INHALTE

Rechtlich relevante Texte niemals als garantiert korrekt darstellen, solange keine fachliche Prüfung erfolgt ist.

Keine:

```text
100 % rechtssicher
100 % geschützt
garantiert wirksam
```

Stattdessen transparente Hinweise und gegebenenfalls:

```text
[RECHTLICH PRÜFEN]
```

---

# 66. ABSOLUTE REGELN

## Regel 1

Bestehenden Code zuerst verstehen.

## Regel 2

Keine unnötigen Neuimplementierungen.

## Regel 3

Keine unnötigen Datenbankänderungen.

## Regel 4

Keine erfundenen Daten.

## Regel 5

Keine erfundenen Quellen.

## Regel 6

Keine erfundenen Preise.

## Regel 7

Keine erfundenen Fahrzeugausstattungen.

## Regel 8

Keine KI im Verkaufsbereich V2.5.

## Regel 9

CARONEX ist keine Vertragspartei.

## Regel 10

Keine 100-%-Rechtssicherheitsversprechen.

## Regel 11

Eine erledigte Aufgabe muss tatsächlich implementiert und getestet sein.

## Regel 12

Bei eindeutigen Aufgaben nicht unnötig nachfragen.

## Regel 13

Nach einer fertigen Aufgabe nicht einfach aufhören.

## Regel 14

Nächste sinnvolle Aufgabe aus `TASK_QUEUE.md` nehmen.

## Regel 15

Bei Context Reset nicht von vorne anfangen.

---

# 67. MASTERPLAN-ÄNDERUNGEN

`MASTERPLAN_V2.5.md` ist die aktuelle verbindliche Grundlage.

Der Plan darf nicht eigenmächtig entfernt oder ersetzt werden.

Wenn eine neue wichtige Projektentscheidung getroffen wird:

* bestehende Anforderung nicht einfach löschen
* Änderung nachvollziehbar dokumentieren
* Versionierung berücksichtigen
* STATUS/TASK_QUEUE entsprechend aktualisieren

---

# 68. DEFINITION OF DONE

Eine Aufgabe ist erst DONE, wenn:

```text
[✓] verstanden
[✓] implementiert
[✓] tatsächliche Dateien geändert
[✓] Funktion getestet
[✓] offensichtliche Fehler behoben
[✓] STATUS aktualisiert
[✓] TASK_QUEUE aktualisiert
[✓] CHECKPOINT aktualisiert
```

Bei größeren Änderungen zusätzlich:

```text
[✓] Git geprüft
[✓] Commit erstellt
```

---

# 69. AUTONOMER BUILD LOOP

Claude soll diesen Loop wiederholen:

```text
1. STATUS LESEN
2. TASK QUEUE LESEN
3. PROJEKT PRÜFEN
4. NÄCHSTE AUFGABE AUSWÄHLEN
5. IMPLEMENTIEREN
6. TESTEN
7. FEHLER BEHEBEN
8. STATUS AKTUALISIEREN
9. CHECKPOINT AKTUALISIEREN
10. TASK QUEUE AKTUALISIEREN
11. COMMIT WENN SINNVOLL
12. NÄCHSTE AUFGABE
13. WEITER
```

Nicht nach einer einzelnen kleinen Aufgabe automatisch stoppen, wenn weitere klare Aufgaben vorhanden sind.

---

# 70. STARTBEFEHL

Wenn Claude diesen Masterplan erstmals nach einer Aktualisierung liest:

1. vorhandene Projektstruktur prüfen
2. vorhandene Projektgedächtnis-Dateien prüfen
3. aktuellen Status ermitteln
4. bestehende Fehler feststellen
5. TASK_QUEUE mit Realität abgleichen
6. höchste offene Priorität auswählen
7. direkt implementieren
8. testen
9. dokumentieren
10. weiterarbeiten

## Wichtig

Nicht nur berichten, was gemacht werden könnte.

**Es soll tatsächlich gemacht werden.**

---

# 71. CARONEX LEITPRINZIP

> **CARONEX wird Schritt für Schritt gebaut.**
>
> **Weniger reden. Mehr umsetzen.**
>
> **Bestehendes verstehen. Verbessern. Testen. Speichern. Weiterbauen.**

**MASTERPLAN V2.5 ENDE**
