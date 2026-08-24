# MASTERPLAN

Strategischer Plan fuer die Automotive-Plattform.

## Vision

Eine Automotive-Wissens- und Informationsplattform, die jedem Menschen — unabhaengig von Vorwissen — hilft, Autos zu verstehen und bessere Entscheidungen zu treffen.

## Phasen

### Phase 1: Grundlagen (AKTUELL)
- Fahrzeugdatenbank aufbauen
- Grundlegende Fahrzeugidentifikation
- Basisinformationen pro Fahrzeug
- Einfache, verstaendliche UI
- Keine KI-Abhaengigkeit

### Phase 2: Wissensbasis erweitern
- Umfangreiche Automotive-Wissensbasis
- Hersteller → Modell → Generation → Motor → Details
- Technische Daten verstaendlich erklaert
- Wartungsinformationen
- Schwachstellen & Haltbarkeit

### Phase 3: Interaktive Funktionen
- Fahrzeugvergleich
- Smart Search
- Filter
- "Mein Fahrzeug" (persoenliche Verwaltung)
- Verkaufshilfe und andere Assistenz-Funktionen

### Phase 4: KI-Integration (Zukunft)
- Intelligente Suche
- Fahrzeuganalyse
- Automatische Zusammenfassungen
- Persoenliche Empfehlungen

## Datenarchitektur

```
Hersteller
  └── Modell
       └── Generation
            └── Baujahr
                 └── Motor (Motorcode)
                      ├── Getriebe
                      ├── Leistung
                      ├── Kraftstoff
                      ├── Technische Daten
                      ├── Ausstattung
                      ├── Wartung
                      ├── Schwachstellen
                      └── Besonderheiten
```

## Identifikationswege

| Methode | Beschreibung |
|---------|-------------|
| VIN/FIN | Fahrgestellnummer dekodieren |
| HSN/TSN | Schluesselnummern aus Fahrzeugschein |
| Manuell | Hersteller → Modell → Generation → Motor auswaehlen |

## Bisheriger Fokus

Bisher lag der Fokus auf Volkswagen, Audi und BMW — aber die Plattform soll langfristig nicht auf diese Marken beschraenkt bleiben.

## Leitprinzipien

1. Einfach fuer den Menschen, komplex im Hintergrund
2. Keine Daten erfinden — lieber "unbekannt" anzeigen
3. Informationen erklaeren, nicht nur anzeigen
4. Architektur KI-ready, aber V1 ohne KI
5. Produkt darf sich weiterentwickeln
