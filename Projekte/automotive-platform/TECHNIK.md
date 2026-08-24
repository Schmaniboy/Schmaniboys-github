# Technik — Automotive Platform

Technische Details und Architekturentscheidungen.

> Vieles hier ist noch in Arbeit und nicht final.

## Grundprinzipien

1. **V1 ohne KI** — alles funktioniert mit Datenbanken, Suchsystemen, Filtern, Formularen, Textbausteinen, normaler Logik
2. **KI-ready Architektur** — spaetere KI-Integration soll problemlos moeglich sein
3. **Datenqualitaet** — keine Daten erfinden, unsicheres kennzeichnen
4. **Skalierbar** — mehr Hersteller, mehr Daten, mehr Funktionen spaeter moeglich

## Datenmodell (Konzept)

```
Hersteller
  └── Modell
       └── Generation
            └── Baujahr
                 └── Motor (Motorcode)
                      ├── Getriebe
                      ├── Leistung (PS, Nm)
                      ├── Kraftstoff
                      ├── Technische Daten
                      ├── Ausstattung
                      ├── Wartung
                      ├── Schwachstellen
                      └── Besonderheiten
```

## Identifikation

| Methode | Datenquelle | Herausforderung |
|---------|-------------|------------------|
| VIN/FIN | API oder eigene Datenbank | Herstellerspezifische Codes |
| HSN/TSN | KBA-Daten | Zugang und Nutzungsrechte |
| Manuell | Eigene Datenbank | Datenpflege |

## Offene technische Fragen

- Welches Framework/Stack? (siehe [[PROBLEMS]] P-005)
- Woher kommen die Fahrzeugdaten? (siehe [[PROBLEMS]] P-001)
- Wie wird VIN dekodiert? (siehe [[PROBLEMS]] P-002)
- HSN/TSN Datenzugang? (siehe [[PROBLEMS]] P-003)

## Bekannte Repo-Dateien

Im automotive-platform Repo existieren/existierten:
- CLAUDE.md — Claude-Konfiguration
- AGENTS.md — Agent-Definitionen
- MASTERPLAN.md — alter Masterplan
- PROGRESS.json — Fortschritt
- STATUS.md — Status

> Alle moeglicherweise veraltet. Aktuellen Stand im Repo pruefen.
