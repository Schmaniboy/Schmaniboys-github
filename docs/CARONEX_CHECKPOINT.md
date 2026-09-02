# CARONEX CHECKPOINT

> Letzter Arbeitsstand. Bei Context Reset zuerst lesen.

**Stand:** 2026-09-02
**Aktueller Bereich:** V2.5 Umsetzung — Prio 10 Dokumente (4/5 erledigt), weiter mit Demo-Dokumente + Prio 5
**Aktuelle Aufgabe:** Demo-Dokumente (V2.5 #44), dann Premium Dark Design (V2.5 #15)

## Erledigte Aufgaben (diese Session)

- [x] MASTERPLAN_V2.5.md ins Repository uebernommen
- [x] TASK_QUEUE.md erstellt
- [x] CARONEX_CHECKPOINT.md erstellt
- [x] Typecheck / Build laeuft sauber
- [x] Passwort-Feld hat Eye-Button
- [x] Navigation angepasst (Marktplatz aus Hauptnav entfernt)
- [x] Login-Seite Scroll-Problem geprueft (bereits behoben)
- [x] StepIndicator-Komponente fuer 7-Schritte-Wizard erstellt
- [x] VerkaufWizard-Komponente mit allen 7 Schritten erstellt
- [x] Verkaufen-Seite auf neuen 7-Schritte-Flow umgestellt
- [x] Deterministischer Verkaufstext (ohne KI)
- [x] PDF-Erstellung (Druckansicht im Browser)
- [x] Kaufvertrag V2.5-konform: online ausfuellbar, Privat/Gewerblich-Toggle, [RECHTLICH PRUEFEN] Marker, erweiterte Felder (Motor, Getriebe, Kraftstoff, Zustand-Sektion)
- [x] Uebergabeprotokoll V2.5-konform: online ausfuellbar, Kaeufer/Verkaeufer-Felder, sichtbare Schaeden, Zubehoer, Vereinbarungen
- [x] Kaeufer-Checkliste V2.5-konform: interaktiver OK/Auffaellig/Nicht-geprueft Status, Sterne-Bewertungen, Freitext bei Auffaellig, Zuruecksetzen-Funktion
- [x] Fahrzeugbericht V2.5-konform: Datenquellen-Trennung (CARONEX-Daten / Nutzerangaben / Persoenliche Bewertung), Sterne-Bewertungen

## Gerade bearbeitete Dateien

- `apps/web/src/components/dokumente/KaufvertragFormular.tsx` — Online-ausfuellbarer Kaufvertrag
- `apps/web/src/components/dokumente/UebergabeprotokollFormular.tsx` — Online-ausfuellbares Protokoll
- `apps/web/src/components/dokumente/KaeuferCheckliste.tsx` — Interaktive Checkliste mit Status
- `apps/web/src/components/dokumente/FahrzeugberichtFormular.tsx` — Bericht mit Datenquellen-Tags
- `apps/web/src/app/dokumente/kaufvertrag/page.tsx` — Seite aktualisiert
- `apps/web/src/app/dokumente/page.tsx` — Uebersicht aktualisiert

## Tests

- Typecheck: OK
- Build: Noch nicht geprueft

## Offene Blocker

- CARONEX-Logos fehlen im Repository (liegen nur lokal beim Betreiber)

## Naechste Aufgabe

1. Demo-Dokumente (V2.5 #44) — DEMO-Kennzeichnung
2. Premium Dark Design (V2.5 #15)
3. Login/Registrierung Design verbessern
4. Logo-Integration (wartet auf Logos im Repo)
