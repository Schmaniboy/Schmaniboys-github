# Fahrzeugidentifikation

Wie ein Nutzer sein Fahrzeug auf der Plattform identifizieren kann.

## Ziel

Der Benutzer soll moeglichst einfach herausfinden: **"Welches Fahrzeug habe ich genau?"**

Danach liefert die Plattform verstaendliche Informationen dazu.

## Identifikationswege

### 1. VIN / FIN (Fahrgestellnummer)

- **Was:** 17-stellige Vehicle Identification Number
- **Wo:** Fahrzeugschein, Tuerschweller, Windschutzscheibe
- **Vorteil:** Eindeutige Identifikation des Fahrzeugs
- **Herausforderung:** Dekodierung erfordert API oder Herstellerdatenbanken
- **Status:** Idee, technische Loesung noch offen (siehe [[PROBLEMS]] P-002)

### 2. HSN / TSN (Schluesselnummern)

- **Was:** Herstellerschluesselnummer (4-stellig) + Typschluesselnummer (3-stellig)
- **Wo:** Fahrzeugschein (Feld 2.1 und 2.2) bzw. Zulassungsbescheinigung Teil I
- **Vorteil:** In Deutschland weit verbreitet, leicht ablesbar
- **Herausforderung:** KBA-Daten benoetigt (siehe [[PROBLEMS]] P-003)
- **Status:** Idee, Datenzugang noch offen

### 3. Manuelle Auswahl

- **Was:** Schritt fuer Schritt auswaehlen: Hersteller → Modell → Generation → Baujahr → Motor
- **Vorteil:** Funktioniert ohne externe Datenquellen
- **Herausforderung:** Nutzer muss sein Fahrzeug kennen
- **Status:** Besprochen, umsetzbar mit eigener Datenbank

## UX-Prinzip

Der Nutzer soll nicht wissen muessen, was eine VIN oder HSN ist. Die Plattform soll erklaeren:
- Was ist das?
- Wo finde ich das?
- Warum hilft mir das?

Siehe auch:
- [[AUTOMOTIVE_VISION]] — Gesamtvision
- [[Projekte/automotive-platform/FUNKTIONEN]] — Funktionsuebersicht
