# STATUS — CARONEX

> **Diese Datei wird erzeugt. Nicht von Hand bearbeiten.**
> Quelle: [`PROGRESS.json`](./PROGRESS.json) · Neu erzeugen mit `npm run status`
> Plan: [`MASTERPLAN.md`](./MASTERPLAN.md) · Gehirn: [`docs/gehirn/`](./docs/gehirn/)

**Stand:** 2026-08-24 · **Fortschritt:** 177 von 177 Aufgaben · **100 %**

```
Phase  0  ████████████████████ 100 %   Projekt-Gehirn & Bestandsanalyse        ABGESCHLOSSEN
Phase  1  ████████████████████ 100 %   Architektur & Projekt-Fundament         ABGESCHLOSSEN
Phase  2  ████████████████████ 100 %   Fahrzeug-Datenbank                     ABGESCHLOSSEN
Phase  3  ████████████████████ 100 %   Fahrzeug-Wissensdatenbank               ABGESCHLOSSEN
Phase  4  ████████████████████ 100 %   Fahrzeug-Suche & Fahrzeugseiten         ABGESCHLOSSEN
Phase  5  ████████████████████ 100 %   Motorvarianten & technische Daten       ABGESCHLOSSEN
Phase  6  ████████████████████ 100 %   Ausstattungsvarianten & Sonderausstattu ABGESCHLOSSEN
Phase  7  ████████████████████ 100 %   KI-Verkaufsassistent & VIN-Analyse      ABGESCHLOSSEN
Phase  8  ████████████████████ 100 %   Fahrzeugbewertung & Wiederverkaufswert  ABGESCHLOSSEN
Phase  9  ████████████████████ 100 %   Automarktplatz & Fahrzeuganzeigen       ABGESCHLOSSEN
Phase 10  ████████████████████ 100 %   Haendlerbereich & Haendlertools         ABGESCHLOSSEN
Phase 11  ████████████████████ 100 %   Token-System, Billing & Rechnungen      ABGESCHLOSSEN
Phase 12  ████████████████████ 100 %   Messaging & Benachrichtigungen          ABGESCHLOSSEN
Phase 13  ████████████████████ 100 %   Adminbereich & Moderation               ABGESCHLOSSEN
Phase 14  ████████████████████ 100 %   Kompletter Systemtest & Fehlerbehebung  ABGESCHLOSSEN
Phase 15  ████████████████████ 100 %   Finaler Produktions-Audit               ABGESCHLOSSEN
Phase 16  ████████████████████ 100 %   Datenbank-Ausbau, Bildarchitektur und Q ABGESCHLOSSEN
Phase 17  ████████████████████ 100 %   Zahlungsanbieter, Bildherkunft und Depl ABGESCHLOSSEN
Phase 18  ████████████████████ 100 %   Katalogansichten vervollstaendigen und  ABGESCHLOSSEN
```

> Der Fortschritt oben zählt **Aufgaben**, nicht Fahrzeugdaten. Was an Daten
> tatsächlich erfasst ist, steht im Abschnitt Datenbestand.

---

## Datenbestand

**Erhoben am:** 2026-08-23 · `npx tsx scripts/datenbestand.ts`

| Bereich | Erfasst |
|---|---:|
| Marken | 1 |
| Modelle | 1 |
| Generationen | 1 |
| Facelift-Phasen | 1 |
| Modelljahre | 3 |
| Motoren (Motorcodes) | 2 |
| Ausstattungscodes | 2 |
| Motor-Fahrzeug-Zuordnungen | 2 |
| Ausstattungen | 2 |
| Ausstattungspakete | 1 |
| Lackfarben | 3 |
| Radvarianten | 1 |
| Sondermodelle | 1 |
| Bilder mit belegter Herkunft | 0 |
| Quellenangaben | 14 |
| Motoren mit erfasstem Motorcode | 2 |

**Güte:** 18 nicht verifiziert · **ohne jede Quelle:** 7 · **zur Prüfung:** 0

> Der Bestand besteht ausschliesslich aus dem Demobestand (scripts/seed-demo.ts). Alle Werte darin sind ausdruecklich erfunden und als solche gekennzeichnet. Echte Fahrzeugdaten kommen ueber die Import-Pipeline mit Quellenpflicht.

> Für keinen Bereich ist eine belegte Gesamtzahl hinterlegt. Wie viele Motoren,
> Ausstattungen oder Varianten es insgesamt gibt, steht hier nicht — deshalb gibt es
> auch keine Prozentangabe zur Abdeckung. Eine Quote ohne belegten Nenner wäre eine
> erfundene Zahl mit dem Aussehen einer gemessenen.

---

## Offene Blocker

### B3 · Redaktionskapazitaet fuer Katalogdaten `hoch`

Entschieden: eigene Redaktion mit KI-Vorstrukturierung, jede harte Zahl vor Freigabe an der Primaerquelle verifiziert. Wer erfasst und wer gibt frei, ist offen. Struktur und UI sind unabhaengig davon baubar; nur die Befuellung haengt daran.

**Entscheidung erforderlich.**

### B4 · Marktdatenquelle fuer die Fahrzeugbewertung `hoch`

Keine Quelle fuer Vergleichsangebote/Marktwerte festgelegt. Schnittstelle und Berechnungslogik sind vorbereitbar; belastbare Zahlen nicht. Fallback: eigene Angebotsdatenauswertung mit ausgewiesener geringerer Guete. Heraufgestuft von mittel: Ohne Vergleichsangebote ist der Kernnutzen von Phase 8 nicht lieferbar, nur die Rechenhuelle.

Dokumentiert in `docs/gehirn/10-Bewertung.md`

### B6 · Markenname, Domain, Logo `niedrig`

Nicht festgelegt. Design-Tokens, Typografie und Komponenten sind unabhaengig davon baubar; nur Logo und Wortmarke fehlen.

**Entscheidung erforderlich.**

## Gelöste Blocker

- **B1 Tech-Stack-Konflikt: Astro vs. geplante Architektur** — ADR-001 vom 2026-08-21: Variante B mit Domaenenlogik in packages/core.
- **B2 Kein Git-Repository** — Repository vorhanden, Commits laufen.
- **B5 Zahlungsanbieter offen** — erledigt
- **B7 VIN-Aufloesung ueber WMI hinaus nicht belegbar** — Phase 7 vom 2026-08-22: geloest durch den Ablauf, nicht durch eine Datenquelle. decodeVin liefert nur Belegbares; der Verkaeufer bestaetigt das Fahrzeug aus veroeffentlichten Katalogeintraegen; generateListingTexts verweigert den Dienst ohne catalogConfirmedAt.
- **B8 Kein Versandweg fuer E-Mail** — erledigt

---

## Verbindliche Vorgaben

| | Regel | Wirkung |
|---|---|---|
| **C1** | KEIN STRIPE | Zahlungslogik providerunabhaengig ueber eine Billing-Abstraktion (createCheckout, verifyPayment, handleWebhook, refundPayment, getPaymentStatus). Ueberschreibt die Stripe-Festlegung aus dem v1-Gehirn. |
| **C2** | KEIN MATRIX SYNAPSE | Messaging vollstaendig plattformintern. |
| **C3** | Keine erfundenen Daten | Technische Daten, Marktwerte und Zugangsdaten werden nie erfunden. Fehlende Informationen werden gekennzeichnet. |
| **C4** | Design Schwarz + Neon Rot | Premium CARONEX. Keine Gaming-Optik, keine unnoetigen Animationen, kein Standard-Template-Look. |
| **C5** | Autonomes Arbeiten | Normale technische Entscheidungen selbst treffen, nicht nach jeder Phase nachfragen. Wieder aktiv seit 2026-08-21 auf ausdrueckliche Anweisung des Nutzers. |
| **C6** | Plugins aktiv nutzen | In dieser Umgebung stehen die genannten Plugins nicht als Plugins zur Verfuegung. Gleichwertig eingesetzt werden: eigene Code- und Security-Reviews je Phase, TypeScript-Pruefung, ESLint, Vitest sowie Browserpruefung der Oberflaeche. |

---

## Nächste Schritte

_Alle Phasen abgeschlossen._

---

## Verlauf

### 2026-08-24 · MASTERPLAN_GO_LIVE.md erstellt, Phase G1 erledigt

Go-Live-Masterplan mit allen offenen Punkten, Abhaengigkeiten und Reihenfolge erstellt. Phase G1 (technische Vorbereitung) komplett erledigt: PRODUCTION_READINESS.md aktualisiert (712 Tests, Befund 10 vollstaendig behoben), Deployment und Sicherheit geprueft, Dokumentation vervollstaendigt. Alle verbleibenden Aufgaben (G2, G3) erfordern Betreiberentscheidungen oder Zugangsdaten.

### 2026-08-24 · Formular-Migration abgeschlossen, Rundgang 0 Befunde

186 Befunde (iOS-Zoom, Feldhoehe, fehlende Labels) in 10 Dateien behoben. DealerProfileForm auf InputField/TextareaField migriert, alle Admin-Selects/Inputs vereinheitlicht. Logo-Upload mit aria-label. Browserrundgang bestaetigt 0 Befunde.

### 2026-08-23 · CSP-Nonce-Fix, Dashboard-Overflow, Rundgang aller Rollen

not-found.tsx dynamisch (21 blockierte Skripte behoben), DashboardShell min-w-0 (810px Overflow auf Mobil behoben), rundgang.mjs fuer USER/DEALER_OWNER/SUPER_ADMIN, routing-live.test.ts, pruefsitzung.ts mit --rolle= Parameter

### 2026-08-23 · Katalogansichten vervollstaendigen und Redaktionsarbeitsplatz

Startpunkt 5 erledigt: S3-Adapter fuer die Bildablage, alle fuenf Zugangsdaten oder keiner, Vorrang vor dem Dateisystem. Ein fehlendes Objekt ergibt null, jede andere Stoerung schlaegt durch -- sonst sieht eine kaputte Ablage aus wie eine leere. Dazu npm run diagnose: sagt bei 404 oder nicht startendem Server, woran es liegt (fremde Anwendung auf dem Port, .next ohne Baustand, Datenbank, .env).

### 2026-08-23 · Katalogansichten vervollstaendigen und Redaktionsarbeitsplatz

Startpunkt 6 der Startliste erledigt: npm run admin:erster legt den ersten SUPER_ADMIN an oder ernennt ihn -- Passwort nie als Aufrufparameter, Abbruch wenn schon einer existiert, Eintrag ins Pruefprotokoll. Behoben: /api/health antwortete mit 200, obwohl die Datenbank nicht erreichbar war; die Lage stand nur im Rumpf. Ein Lastverteiler liest den Code, nicht den Rumpf -- jetzt 503, im Betrieb geprueft.

### 2026-08-23 · Katalogansichten vervollstaendigen und Redaktionsarbeitsplatz

Verkaufsablauf zu Ende gebaut: Die erzeugten Texte lassen sich jetzt einzeln kopieren. Drei Stufen, weil navigator.clipboard nur in sicherem Kontext existiert -- im eigenen Netz ueber http gibt es sie nicht, und ein stummer Knopf waere schlimmer als keiner. Dazu zwei Browserrundgaenge (pruefe:formulare oeffentlich, rundgang:verkaufen angemeldet), die Beschriftung, Schriftgroesse, Feldhoehe und Ueberbreite dauerhaft absichern.

### 2026-08-23 · Katalogansichten vervollstaendigen und Redaktionsarbeitsplatz

Nacharbeit an den Audit-Befunden 4 und 10. Indexierung: robots.txt und Meta-Angabe widersprachen sich (robots gab in Produktion frei, das Layout sperrte fest) -- beide lesen jetzt SUCHMASCHINEN_INDEXIEREN, nicht NODE_ENV, damit keine Vorschau in den Index geraet. Formulare: vier Bausteine bauten Beschriftung und Feld von Hand nach; dabei fielen 14px-Schrift (iOS zoomt) und 36-38px hohe Felder auf. Neue Browserpruefung npm run pruefe:formulare deckt beides dauerhaft ab.

### 2026-08-23 · Katalogansichten vervollstaendigen und Redaktionsarbeitsplatz

Katalogansichten vervollstaendigt: Modelljahre, Sondermodelle, Lackfarben, Radvarianten, Bewertungen und Merkzettel waren im Datenmodell vorhanden und nicht erreichbar. Redaktionsarbeitsplatz unter /admin/katalog mit Statuswechsel und Dublettensuche. KnownIssue kann jetzt enden (resolvedFromYear). Behoben: zeitabhaengiger Live-Test durch eigene Aufruferadresse je Aufruf.

### 2026-08-23 · Zahlungsanbieter, Bildherkunft und Deployment

Mollie angebunden (ADR-012); dabei fiel auf, dass confirmTokenPurchase dem Anbieter die eigene Vorgangskennung uebergab -- mit dem Attrappenanbieter unsichtbar, im Echtbetrieb waere jede Bestaetigung fehlgeschlagen. Bildherkunft mit Rechtsstand (ADR-013, ADR-014): Lizenz entscheidet vor Passgenauigkeit. Vercel als Host (ADR-015). E-Mail ueber SMTP (ADR-016), loest B8.

### 2026-08-23 · Datenbank-Ausbau, Bildarchitektur und Qualitaetskontrolle

Datenbank-Ausbau abgeschlossen. OptionAvailability.standard war ein Wahrheitswert und liess vier Sachverhalte zusammenfallen -- ersetzt durch AvailabilityKind mit fuenf Werten. Guetekennzeichen (DataQuality) getrennt vom Belegmodell. Bildzuordnung disqualifiziert bei Widerspruch statt abzuwerten. Vollstaendigkeit nur mit belegtem Nenner. Import-Pipeline mit Trockenlauf und Quellenpflicht.

### 2026-08-22 · Finaler Produktions-Audit

Produktions-Audit abgeschlossen, PRODUCTION_READINESS.md erstellt. Elf Befunde, drei davon in dieser Phase behoben. Ergebnis: technisch lauffaehig und in sich schluessig, aber nicht produktionsbereit -- es fehlen Katalogdaten, ein Zahlungsanbieter, ein E-Mail-Versandweg und eine Marktdatenquelle. Keins davon laesst sich mit Code loesen.

### 2026-08-22 · Kompletter Systemtest & Fehlerbehebung

Systemtest abgeschlossen. Ein Ende-zu-Ende-Test quer durch alle Rollen, eine Sammelpruefung auf Fremdzugriff (nie 200) und zehn Sicherheitsproben. Keine neuen Fehler gefunden -- was nicht Fehlerfreiheit heisst, sondern dass diese Pruefungen nichts zutage gefoerdert haben.

### 2026-08-22 · Adminbereich & Moderation

Adminbereich abgeschlossen. Vier Sperren bei der Rollenvergabe (nur SUPER_ADMIN, nicht die eigene Rolle, nicht die letzte, keine Haendlerrollen), Sperren beendet Sitzungen, jede Massnahme mit Pflichtbegruendung im Protokoll. Moderation entzieht Sichtbarkeit statt zu loeschen; das Protokoll wird gezeigt, nicht bearbeitet.

### 2026-08-22 · Messaging & Benachrichtigungen

Nachrichten abgeschlossen, vollstaendig plattformintern (C2, kein Matrix Synapse). IDOR-Schutz ueber NOT_FOUND statt FORBIDDEN, doppelt geprueft. Betrugsmuster warnen, sperren nicht (ADR-011). Anhaenge nur als neu kodierte Bilder. Unsichtbare Steuerzeichen werden aus Nachrichten entfernt -- und aus dem eigenen Quelltext.

### 2026-08-22 · Token-System, Billing & Rechnungen

Billing und Rechnungen abgeschlossen. Zahlungsschnittstelle ohne nachgebauten Anbieter (ADR-010); Kauf endet ohne Zahlungsweg mit 501 und ohne Vorgang in der Datenbank. Rechnungsnummern atomar und lueckenlos, mit Test auf gleichzeitige Aufrufe. Betraege in ganzen Cent, Steuersatz als Einstellung, mit jeder Rechnung eingefroren.

### 2026-08-22 · Haendlerbereich & Haendlertools

Haendlerbereich abgeschlossen. Mandantentrennung ueber die Sitzung statt ueber die Anfrage; Rollen sind Rechte, keine Anzeige. Kennzahlen tragen ihren Zustand mit (ADR-009) -- Anfragen erscheinen nicht als 0, weil es die Nachrichten noch nicht gibt.

### 2026-08-22 · Automarktplatz & Fahrzeuganzeigen

Marktplatz abgeschlossen. Anzeigen kopieren den Entwurf statt ihn zu verwenden (ADR-007); Bilder werden neu geschrieben statt uebernommen, damit der Aufnahmeort aus den EXIF-Daten verschwindet (ADR-008). Browserdurchlauf deckte auf, dass ein leeres Filterfeld die ganze Suche brach -- behoben und mit Test abgesichert.

### 2026-08-22 · Fahrzeugbewertung & Wiederverkaufswert

Fahrzeugbewertung abgeschlossen. Kern: ohne Marktdaten kein Eurobetrag (ADR-006). Faktorenmodell mit begruendeten Einzelfaktoren, benannte und versionierte Annahmen, bezahlte Bewertungen werden gespeichert. B4 ist nicht mehr blockierend -- es fehlt nur noch die Quelle selbst.

### 2026-08-22 · KI-Verkaufsassistent & VIN-Analyse

KI-Verkaufsassistent und VIN-Analyse abgeschlossen. B7 durch den Ablauf geloest: VIN schlaegt vor, Verkaeufer bestaetigt aus dem Katalog. Feld-Guard als Typ; technische Daten und Ausstattung bewusst nicht von der KI, sondern aus dem Katalog. Browserdurchlauf und Durchsicht deckten drei Fehler auf (Passwort in der Adresszeile, Verweise ins Leere, stille Ersatzwerte), alle behoben und mit Tests abgesichert. Live-Tests legen ihre Sitzung jetzt direkt an, damit sie sich nicht an der Anmelde-Ratenbegrenzung gegenseitig aussperren.

### 2026-08-22 · Phase 11a vorgezogen - Token-Guthaben

Aus Phase 11 vorgezogen, weil Phase 7 verlangt: keine KI-Ausfuehrung ohne ausreichendes Guthaben. Verfahren: reservieren, ausfuehren, buchen -- ein gescheiterter Aufruf kostet nichts, ein erfolgreicher wird genau einmal berechnet. Gleichzeitigkeit ueber bedingte UPDATEs geloest statt ueber Lesen-Pruefen-Schreiben; getestet mit sieben gleichzeitigen Reservierungen, von denen genau drei gelingen duerfen. Doppelbuchungen durch eindeutige Vorgangskennung ausgeschlossen. CHECK-Bedingungen in der Datenbank als letzte Verteidigungslinie. Billing und Rechnungen bleiben in Phase 11.

### 2026-08-22 · Phase 6 abgeschlossen - Ausstattungsvarianten

Verfuegbarkeitsmatrix ueber Baujahr, Ausstattungslinie, Motorvariante und Paket. Duplikatschutz zusaetzlich in der Anwendung, weil die Eindeutigkeitsbedingung in PostgreSQL bei NULL-Werten nicht greift. Seltenheit und Relevanz tragen ein eigenes Belegmodell, bei dem SPECIFICATION gar nicht waehlbar ist - Bestellquoten stehen in keinem Datenblatt. Serienmaessig und nur-im-Paket zugleich wird als Widerspruch abgelehnt. Ausstattungsseite je Generation mit Erkennungsmerkmalen. Ausserdem: nicht-interaktives Migrationsskript, weil prisma migrate dev in dieser Umgebung bei rueckfragepflichtigen Aenderungen abbricht.

### 2026-08-22 · Phase 5 abgeschlossen - Motorvarianten und technische Daten

Technische Felder ergaenzt: Abgasnorm, Sitzplaetze, Tueren, Zuladung, Anhaengelast gebremst und ungebremst, elektrische Reichweite. Quellen koennen jetzt benennen, welche Werte sie decken - Belegpflicht je Wert statt je Eintrag, denn ein Datenblatt belegt die Leistung, sagt aber nichts ueber die Anhaengelast. Eigene Seite je Motorvariante mit erklaerten Fachbegriffen. Vertauschte Anhaengelasten werden abgelehnt, weil die Verwechslung im Betrieb gefaehrlich ist. Die Variantenseite prueft den vollstaendigen Pfad, damit es nicht beliebig viele Adressen fuer denselben Inhalt gibt.

### 2026-08-22 · Phase 4 abgeschlossen - Fahrzeugsuche

Gesucht wird nach Motorvariante statt nach Generation, weil die geforderten Filter genau dort unterscheiden. Filter ohne JavaScript als Links, Auswahl mit Trefferzahl, sieben Sortierungen mit nulls last, seitenweise Navigation, aehnliche Fahrzeuge. Preis-, Kilometer- und Standortfilter bewusst nicht umgesetzt: sie gehoeren zu einer Anzeige und gibt es erst mit Phase 9. Ein stiller Fehler gefunden und behoben: die Baujahrfilter erwarteten Zahlen, aus der Adresszeile kommen Zeichenketten - die Suche fiel unbemerkt auf ungefiltert zurueck, und zwei Tests waren aus dem falschen Grund gruen.

### 2026-08-21 · Phase 3 abgeschlossen - Fahrzeug-Wissensdatenbank

Vier Wissenstabellen und drei erzwungene Belegmodelle. Eine belegte Angabe braucht eine belastbare Quellenart; eine Pressemitteilung genuegt dafuer ausdruecklich nicht. Eine Einschaetzung braucht eine Begruendung und gilt nie als gut belegt. Eine Marktbeobachtung braucht Datengrundlage und Stichtag und veraltet nach zwei Jahren sichtbar. Katalogseiten von Hersteller bis Generation, Glossar mit 14 Begriffen. Zwei Anzeigefehler gefunden und behoben: die Guetedeckelung war implementiert, aber nicht angewandt, und die Quellenarten waren fest verdrahtet statt geladen. Beides ist jetzt in der Anzeigekomponente gebuendelt, wo es nicht mehr vergessen werden kann. Demobestand ist ausdruecklich als frei erfunden gekennzeichnet.

### 2026-08-21 · Phase 2 abgeschlossen - Automotive-Datenbank

Katalogschema mit 13 Tabellen erzeugt und migriert. Drei praegende Entscheidungen: Fahrleistungen haengen an der Antriebskombination statt am Motor, Motoren und Sonderausstattung haengen am Hersteller statt am Modell, und jeder Eintrag durchlaeuft DRAFT - IN_REVIEW - PUBLISHED, wobei ohne mindestens eine Quelle nicht veroeffentlicht wird. Erfassen und Freigeben sind getrennte Rechte, was Blocker B3 technisch vorbereitet. Verbrauchswerte tragen immer ihren Messzyklus. Leistung wird nur in Kilowatt gespeichert, PS wird berechnet. Elf Endpunkte, davon zwei oeffentlich lesend. 36 neue Tests.

### 2026-08-21 · Phase 1 abgeschlossen - Architektur und Fundament

Blocker B1 durch ADR-001 geloest (Next.js + Route Handlers, Domaenenlogik in packages/core). Monorepo mit vier Paketen aufgesetzt, Astro abgeloest. Prisma-Schema fuer Identitaet und Zugriff erzeugt und migriert. Eigene Sitzungsauthentifizierung, Rechtematrix mit sechs Rollen, zentrale Fehlertaxonomie, Security-Header und CSP. Designsystem Schwarz + Neon Rot mit nachgerechneten Kontrastwerten samt Basiskomponenten. 97 Tests gruen. Wichtigster Fund: Eine Nonce-CSP legt statisch vorgerenderte Seiten still - zwei Seiten waren ohne JavaScript. Behoben und durch einen Test gegen das Build-Manifest abgesichert. Neue Blocker B7 (VIN nicht ueber WMI hinaus aufloesbar) und B8 (kein E-Mail-Versandweg) aufgenommen, B4 auf hoch heraufgestuft.

### 2026-08-21 · Phase 0 abgeschlossen - Architektur-Blocker dokumentiert

Blocker B1 ausfuehrlich im Gehirn dokumentiert (09-Architekturentscheidung-Frontend-Backend.md) mit 4 Varianten, Zielarchitektur, Sicherheits- und Skalierungskonzept. Vorgaben C1 (kein Stripe) und C2 (kein Matrix) sowie PostgreSQL-Bestaetigung ins Entscheidungsprotokoll uebernommen. Aufgaben 0.8 und 0.9 ergaenzt, Gesamtzahl auf 139 erhoeht. Keine Aenderung an der bestehenden Architektur, kein Produktcode - auf ausdrueckliche Anweisung.

### 2026-08-21 · Fortschrittssystem eingerichtet

MASTERPLAN.md.txt gelesen (1597 Zeilen, 16 Phasen). Projektordner analysiert. Gehirn im Obsidian-Vault gefunden. 137 Aufgaben abgeleitet. STATUS.md und PROGRESS.json angelegt.

---

## Pflegeanleitung

`PROGRESS.json` ist die Quelle der Wahrheit. Bei jedem Arbeitsschritt:

1. Status der betroffenen Aufgabe setzen: `not_started` → `in_progress` → `done` (oder `blocked`)
2. `note` bei Bedarf ergänzen
3. `percentComplete` der Phase setzen
4. `meta.lastUpdated` setzen
5. Bei abgeschlossener Phase: Eintrag in `history`
6. `npm run status` ausführen — `STATUS.md` und `totals` entstehen daraus
7. Gehirn aktualisieren (`docs/gehirn/`) und `CHANGELOG.md` fortschreiben
