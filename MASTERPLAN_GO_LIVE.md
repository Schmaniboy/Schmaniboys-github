# MASTERPLAN GO-LIVE

**Stand:** 2026-08-24 · **Grundlage:** PRODUCTION_READINESS.md, MASTERPLAN.md, STATUS.md

---

## Zweck

Dieser Plan listet alle verbleibenden Schritte zwischen dem jetzigen Stand
(177/177 Aufgaben erledigt, 712 Tests grün) und einem öffentlichen Betrieb.
Er trennt zwischen dem, was technisch selbständig erledigt werden kann, und
dem, was eine Entscheidung, Zugangsdaten oder eine externe Handlung des
Betreibers braucht.

---

## Legende

| Kürzel | Bedeutung |
|---|---|
| **SELBST** | Kann ohne Rücksprache erledigt werden |
| **BETREIBER** | Braucht eine Entscheidung, Zugangsdaten oder eine externe Handlung |
| **ERLEDIGT** | Bereits abgeschlossen |

---

## Abhängigkeiten

```
                    ┌─────────────┐
                    │  B6 Marke   │
                    │ Name/Domain │
                    │    /Logo    │
                    └──────┬──────┘
                           │ bestimmt APP_URL, Logo, Wortmarke
                           ▼
┌──────────┐    ┌──────────────────┐    ┌──────────────┐
│ B8 SMTP  │───▶│  Konfiguration   │◀───│ B5 Mollie    │
│Zugangs-  │    │  (alle Env-Vars) │    │ API-Schlüssel│
│daten     │    └────────┬─────────┘    └──────────────┘
└──────────┘             │
                         ▼
              ┌──────────────────┐
              │   Deployment     │
              │ (Vercel / Host)  │
              └────────┬─────────┘
                       │
                       ▼
              ┌──────────────────┐    ┌──────────────┐
              │  Erster Start    │    │ B3 Katalog-  │
              │  SUPER_ADMIN     │    │ daten        │
              └────────┬─────────┘    └──────┬───────┘
                       │                     │
                       ▼                     ▼
              ┌──────────────────────────────────────┐
              │     Öffentlicher Betrieb              │
              │  SUCHMASCHINEN_INDEXIEREN="true"      │
              └──────────────────────────────────────┘
                                ▲
                       ┌────────┴────────┐
                       │ B4 Marktdaten   │
                       │ (nicht blockie- │
                       │  rend)          │
                       └─────────────────┘
```

---

## Phase G1 — Technische Vorbereitung (SELBST)

> Alles, was ohne Zugangsdaten und ohne Betreiberentscheidung erledigt werden kann.

### G1.1 PRODUCTION_READINESS.md aktualisieren ← ERLEDIGT

- [x] Testanzahl von 548 auf 712 korrigieren
- [x] Befund 10 als vollständig behoben kennzeichnen (Formular-Migration abgeschlossen, 0 Befunde in drei Rundgängen)
- [x] Befund 4 (SEO) Klarstellung ergänzen

### G1.2 E-Mail-Konfiguration vorbereiten ← ERLEDIGT

- [x] SMTP-Umgebungsvariablen in `.env.example` mit Platzhaltern und Erklärung
- [x] `MAIL_TO_CONSOLE` für Entwicklung dokumentiert
- [x] Graceful Fallback: ohne `SMTP_HOST` meldet sich der Versand als nicht eingerichtet
- [x] Registrierung funktioniert ohne E-Mail (Bestätigung fehlt dann — vor dem Start zu schließen)

### G1.3 Mollie-Konfiguration vorbereiten ← ERLEDIGT

- [x] `MOLLIE_API_KEY` und `MOLLIE_WEBHOOK_URL` in `.env.example` mit Erklärung
- [x] Graceful Fallback: ohne Schlüssel tritt die Ersatzvariante an (501 bei Kaufversuch)
- [x] Webhook-Endpunkt steht unter `/api/zahlungen/mollie`

### G1.4 S3-Bildablage vorbereiten ← ERLEDIGT

- [x] Fünf S3-Variablen in `.env.example` dokumentiert
- [x] Adapter gebaut (`forcePathStyle: true`)
- [x] Ohne S3-Konfiguration fällt die Ablage aufs Dateisystem zurück

### G1.5 Deployment-Konfiguration prüfen ← ERLEDIGT

- [x] `vercel.json` validiert: Build = `npm run db:generate && npm run build`, Region `fra1`
- [x] Output-Verzeichnis: `apps/web/.next`
- [x] Prisma-Migration: `npm run db:deploy` vor dem ersten Start
- [x] Health-Endpoint `/api/health` liefert 503 bei DB-Ausfall

### G1.6 Sicherheitshärtung prüfen ← ERLEDIGT

- [x] `IP_HASH_SECRET` — Anwendung startet in Produktion ohne ihn nicht (env.ts, Zeile 137)
- [x] Mollie-Schlüsselformat wird geprüft, Echtschlüssel + localhost blockiert
- [x] CSP-Header: Nonce für dynamische, self+unsafe-inline für statische Seiten
- [x] Cookie `Secure` nur bei `https://` in `APP_URL`
- [x] Ratenbegrenzung aktiv
- [x] S3: alle fünf Werte oder keiner, Teilkonfiguration verhindert
- [x] Keine Geheimnisse im Quelltext

### G1.7 Dokumentation vervollständigen ← ERLEDIGT

- [x] Go-Live-Checkliste als MASTERPLAN_GO_LIVE.md erstellt
- [x] Verweis in PRODUCTION_READINESS.md ergänzt
- [x] Deployment-Konfiguration in vercel.json und .env.example dokumentiert

---

## Phase G2 — Betreiberentscheidungen (BETREIBER)

> Diese Punkte können nicht mit Code gelöst werden. Jeder braucht eine
> Entscheidung oder Zugangsdaten vom Betreiber.

### G2.1 Markenname, Domain und Logo (B6) ← BETREIBER

**Was gebraucht wird:**
- Markenname (ersetzt „Automotive" überall in der Anwendung)
- Domain (bestimmt `APP_URL`, Cookie-Sicherheit, Rückleitungen)
- Logo als SVG oder PNG (mind. 512×512)

**Was danach passiert (SELBST):**
- Name in `<title>`, Metadaten, E-Mail-Vorlagen, Fußzeile einsetzen
- Logo in `/public` und als Favicon einbinden
- `APP_URL` festlegen

### G2.2 SMTP-Zugangsdaten (B8) ← BETREIBER

**Was gebraucht wird:**
```
SMTP_HOST="smtp.example.de"
SMTP_PORT="587"
SMTP_USER="noreply@example.de"
SMTP_PASSWORD="••••••••"
SMTP_FROM="Markenname <noreply@example.de>"
```

Funktioniert mit jedem SMTP-Anbieter: Postmark, Brevo, Mailgun, Amazon SES,
eigener Server. Der Wechsel ändert diese Werte, keinen Code.

**Was danach passiert (SELBST):**
- Testmail versenden
- Registrierungsbestätigung und Passwort-Zurücksetzen durchspielen

### G2.3 Mollie-API-Schlüssel (B5) ← BETREIBER

**Was gebraucht wird:**
```
MOLLIE_API_KEY="test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

Aus dem Mollie-Dashboard: `test_...` für den Testbetrieb, `live_...` für
echtes Geld.

**Was danach passiert (SELBST):**
- Testkauf durchspielen (Checkout → Webhook → Gutschrift → Rechnung)
- `MOLLIE_WEBHOOK_URL` setzen (muss öffentlich erreichbar sein)

### G2.4 S3-Bildablage (optional für Start) ← BETREIBER

**Was gebraucht wird:**
```
S3_ENDPOINT="https://s3.eu-central-1.amazonaws.com"
S3_REGION="eu-central-1"
S3_BUCKET="automotive-bilder"
S3_ACCESS_KEY_ID="AKIA..."
S3_SECRET_ACCESS_KEY="••••••••"
```

Funktioniert mit AWS S3, Cloudflare R2, MinIO, Hetzner, Backblaze.
Der Eimer darf NICHT öffentlich lesbar sein.

**Ohne S3:** Dateisystem (taugt für eine Instanz auf einem eigenen Server).
Auf Vercel oder bei mehreren Instanzen ist S3 Pflicht.

### G2.5 Katalogdaten (B3) ← BETREIBER

**Was gebraucht wird:**
- Entscheidung: Wer erfasst und wer gibt frei?
- Redaktionskapazität für die verbreiteten Baureihen der letzten 15 Jahre
- Jede harte Zahl an der Primärquelle verifiziert

**Was bereits steht (ERLEDIGT):**
- Datenmodell, Redaktionsablauf, Belegpflicht
- Import-Pipeline mit Trockenlauf und Quellenpflicht
- Admin-Katalogverwaltung mit Statuswechsel und Dublettensuche
- Demobestand als Beispiel (ausdrücklich als erfunden gekennzeichnet)

**Ohne Katalogdaten:** Suche, Bewertung und Verkaufsentwurf sind leere Hüllen.
Die Plattform ist technisch lauffähig, aber inhaltlich nicht startfähig.

### G2.6 Marktdatenquelle (B4) ← BETREIBER (nicht blockierend)

**Was gebraucht wird:**
- Quelle für Vergleichsangebote oder erzielte Preise
- Muss liefern: Stichprobengröße, Beobachtungszeitraum, Quellenangabe,
  ob Angebots- oder erzielte Preise

**Ohne Marktdaten:** Bewertung läuft, gibt aber keinen Eurobetrag aus.
Die Faktorenanalyse ist für sich brauchbar. Fallback: eigene Angebots-
datenauswertung, sobald genug eigene Anzeigen vorhanden sind.

---

## Phase G3 — Konfiguration und Deployment (SELBST + BETREIBER)

> Erst möglich, wenn G2.1 (Name/Domain), G2.2 (SMTP) und G2.3 (Mollie)
> erledigt sind.

### G3.1 Umgebungsvariablen setzen ← BETREIBER (Werte) + SELBST (Prüfung)

```env
# Pflicht
APP_URL="https://www.example.de"
DATABASE_URL="postgresql://..."
IP_HASH_SECRET="<mindestens 16 Zeichen, zufällig>"
SMTP_HOST="..."
SMTP_PORT="587"
SMTP_USER="..."
SMTP_PASSWORD="..."
SMTP_FROM="Markenname <noreply@example.de>"
MOLLIE_API_KEY="live_..."

# Empfohlen
S3_ENDPOINT="..."
S3_REGION="..."
S3_BUCKET="..."
S3_ACCESS_KEY_ID="..."
S3_SECRET_ACCESS_KEY="..."
ANTHROPIC_API_KEY="..."

# Prüfen
TAX_RATE_BASIS_POINTS="1900"  # 19,00 % — Wert prüfen
SUCHMASCHINEN_INDEXIEREN="false"  # Erst bei Freigabe auf "true"
```

### G3.2 Datenbank in Produktion einrichten ← BETREIBER

- PostgreSQL 16 bereitstellen
- `DATABASE_URL` setzen
- Migration: `npx prisma migrate deploy --schema packages/db/prisma/schema.prisma`

### G3.3 Ersten SUPER_ADMIN anlegen ← BETREIBER

```bash
npm run admin:erster -- <e-mail-adresse>
```

Passwort wird eingelesen oder erzeugt, nie als Parameter übergeben.
Existiert bereits ein SUPER_ADMIN, bricht das Skript ab.

### G3.4 Erster Testlauf ← SELBST + BETREIBER

- [ ] Anwendung starten
- [ ] `/api/health` → 200 mit DB-Verbindung
- [ ] Registrierung → Bestätigungsmail kommt an
- [ ] Passwort zurücksetzen → Mail kommt an
- [ ] Anmelden → Sitzung funktioniert
- [ ] Testkauf → Mollie-Checkout → Webhook → Guthaben gutgeschrieben
- [ ] Bild hochladen → S3 oder Dateisystem

### G3.5 Suchmaschinen freigeben ← BETREIBER

```env
SUCHMASCHINEN_INDEXIEREN="true"
```

Erst setzen, wenn der Marktplatz Inhalte hat. Vorher bleibt alles gesperrt
(robots.txt und Meta-Angabe gemeinsam).

---

## Empfohlene Reihenfolge

| Schritt | Phase | Wer | Abhängigkeit |
|---|---|---|---|
| 1 | G1.5–G1.7 Technische Vorbereitung | SELBST | — |
| 2 | G2.1 Name/Domain/Logo | BETREIBER | — |
| 3 | G2.2 SMTP-Zugangsdaten | BETREIBER | — |
| 4 | G2.3 Mollie-Schlüssel | BETREIBER | — |
| 5 | G2.4 S3-Zugangsdaten | BETREIBER | Bei Vercel Pflicht |
| 6 | G3.1 Env-Vars setzen | BEIDE | G2.1 + G2.2 + G2.3 |
| 7 | G3.2 Datenbank einrichten | BETREIBER | — |
| 8 | G3.3 Erster SUPER_ADMIN | BETREIBER | G3.2 |
| 9 | G3.4 Testlauf | BEIDE | G3.1 + G3.2 + G3.3 |
| 10 | G2.5 Katalogdaten erfassen | BETREIBER | G3.3 (braucht Admin) |
| 11 | G3.5 Suchmaschinen freigeben | BETREIBER | Katalog hat Inhalte |
| 12 | G2.6 Marktdatenquelle | BETREIBER | Nicht blockierend |

Schritte 2–5 können parallel bearbeitet werden. Schritt 10 ist die längste
Arbeit und kann jederzeit nach Schritt 8 beginnen.

---

## Aktueller Stand

| Aufgabe | Status |
|---|---|
| G1.1 PRODUCTION_READINESS.md aktualisieren | ERLEDIGT |
| G1.2 E-Mail-Konfiguration vorbereiten | ERLEDIGT |
| G1.3 Mollie-Konfiguration vorbereiten | ERLEDIGT |
| G1.4 S3-Bildablage vorbereiten | ERLEDIGT |
| G1.5 Deployment-Konfiguration prüfen | ERLEDIGT |
| G1.6 Sicherheitshärtung prüfen | ERLEDIGT |
| G1.7 Dokumentation vervollständigen | ERLEDIGT |
| G2.1 Name/Domain/Logo | OFFEN — Entscheidung des Betreibers |
| G2.2 SMTP-Zugangsdaten | OFFEN — Zugangsdaten vom Betreiber |
| G2.3 Mollie-Schlüssel | OFFEN — Schlüssel vom Betreiber |
| G2.4 S3-Zugangsdaten | OFFEN — Zugangsdaten vom Betreiber |
| G2.5 Katalogdaten | OFFEN — Redaktionskapazität |
| G2.6 Marktdatenquelle | OFFEN — nicht blockierend |
| G3.1–G3.5 Deployment | WARTET auf G2 |
