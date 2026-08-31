# Projekt-Gehirn (Repo-Spiegel)

Dies ist das Projekt-Gehirn der CARONEX-Plattform, geführt **im
Repository**.

## Warum hier und nicht nur im Obsidian-Vault

Das ursprüngliche Gehirn liegt unter `D:\Zweites Gehirn\Projekte\Automotive-Plattform\`.
Der MASTERPLAN verlangt bei jedem Kontextwechsel: „Lies erneut MASTERPLAN,
Projekt-Gehirn, relevante Dokumentation." Aus dem Repository heraus ist ein
lokaler Windows-Pfad nicht lesbar — für jede Cloud-Sitzung, jede zweite
Maschine und jede weitere Person ist das Gehirn damit nicht vorhanden.

Deshalb gilt ab ADR-001:

- **Architektur- und Entscheidungswissen lebt hier im Repo.** Es ist versioniert,
  liegt neben dem Code, den es begründet, und geht bei einem Rechnerwechsel
  nicht verloren.
- Der Obsidian-Vault bleibt als Arbeits- und Rechercheraum bestehen. Er ist
  ergänzend, nicht führend.
- Wo eine Vault-Datei eine Entscheidung enthält, die den Code betrifft, wird
  sie hierher übernommen — nicht verlinkt.

**Nicht übernommene Vault-Inhalte werden nicht rekonstruiert.** Was in diesem
Verzeichnis steht, ist entweder aus dem MASTERPLAN, aus `PROGRESS.json` oder
aus der Arbeit am Code abgeleitet. Inhalte der 15 Vault-Dokumente, die hier
nicht auftauchen, sind schlicht nicht bekannt und wurden bewusst nicht
erfunden (Vorgabe C3).

## Aufbau

| Datei | Inhalt |
|---|---|
| `Entscheidungsprotokoll.md` | Alle Architekturentscheidungen als ADR, chronologisch |
| `01-Architektur.md` | Zielarchitektur, Schichten, Abhängigkeitsregeln |
| `02-Datenmodell.md` | Fachliches Datenmodell des Katalogs und der Plattform |
| `03-Designsystem.md` | Farben, Kontraste, Typografie, Komponentenregeln |
| `04-Sicherheit.md` | Sicherheitsentscheidungen, Bedrohungen, Maßnahmen |
| `05-Offene-Punkte.md` | Blocker und offene Fragen mit Auswirkung |
| `06-Wissensmodell.md` | Belegmodelle der Wissensdatenbank und ihre Pflichten |
| `07-Suche.md` | Suchmodell, Filter und ihre Fallstricke |
| `08-Guthaben.md` | Token-Guthaben: reservieren, ausführen, buchen |
| `09-Verkaufsassistent.md` | VIN-Grenzen, Feld-Guard und der KI-Verkaufstext |
| `10-Bewertung.md` | Faktorenmodell, benannte Annahmen, keine erfundenen Marktwerte |
| `11-Marktplatz.md` | Anzeigen, Statusablauf, Bilduploads und Suchmaschinen |
| `12-Haendlerbereich.md` | Mandantentrennung, Rollen, Öffnungszeiten, Kennzahlen |
| `13-Abrechnung.md` | Zahlungsschnittstelle ohne Anbieter, Rechnungsnummern, Cent-Rechnung |
| `14-Nachrichten.md` | Plattforminternes Messaging, IDOR-Schutz, Warnhinweise statt Filter |
| `15-Verwaltung.md` | Adminrechte, Rollenvergabe, Moderation, Protokoll |
| `16-Systemtest.md` | Ende-zu-Ende quer durch alle Rollen, Sicherheitsproben |
| `17-Datenbank-Ausbau.md` | Verfügbarkeitsarten, Gütekennzeichen, Bildzuordnung, Import-Pipeline |
| `18-Fertigstellung.md` | Mollie, SMTP und Einmal-Token, Bildrecht, Redaktionsarbeitsplatz |

## Pflege

Nach jeder abgeschlossenen Phase: ADR ergänzen, betroffene Datei
aktualisieren, `CHANGELOG.md` fortschreiben, `PROGRESS.json` setzen,
`STATUS.md` daraus spiegeln.
