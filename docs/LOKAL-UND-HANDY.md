# Lokal starten und vom Handy aufrufen

Kurzfassung für den eigenen Rechner. Für den Betrieb im Netz siehe
[`DEPLOYMENT.md`](./DEPLOYMENT.md).

---

## 1. Voraussetzungen

- Node 22 oder neuer
- PostgreSQL 16 (lokal oder als Container)

## 2. Einrichten

```bash
npm install
cp .env.example .env          # DATABASE_URL und SESSION_SECRET eintragen
npm run db:deploy             # Schema einspielen
npm run db:seed:demo          # optional: Demobestand (erfundene Werte, gekennzeichnet)
```

## 2b. Wenn etwas nicht geht

```bash
npm run diagnose
```

Prüft der Reihe nach: richtiges Verzeichnis, `.env` mit `DATABASE_URL`,
`IP_HASH_SECRET`, ob `.next` einen Baustand enthält, wer auf dem Port horcht
(Prozess und PID), ob dort **diese** Anwendung antwortet, ob die Datenbank
erreichbar ist und ob die Startseite wirklich die Startseite liefert.

Zwei Befunde erklären die meisten Fälle:

**„Auf Port 3000 antwortet eine ANDERE Anwendung."** Der häufigste Grund für
404 auf der Startseite. Port 3000 ist die Voreinstellung von Next.js, Vite,
Rails, json-server und einem Dutzend weiterer Werkzeuge — wer zwei Projekte
offen hat, bekommt vom Browser das falsche. Entweder das andere beenden oder
`PORT=3010 npm run dev`.

**„.next enthält KEINEN Baustand."** `npm run dev` schreibt ebenfalls nach
`.next`. Danach ist das Verzeichnis da, `npm start` bricht aber mit
„Could not find a production build" ab. Vor `npm start` gehört `npm run build`.

---

## 3. Auf diesem Rechner

```bash
npm run dev
```

→ http://localhost:3000

## 4. Vom Handy im selben WLAN

**Zuerst die Adresse ermitteln:**

```bash
npm run netz
```

Das Skript liest die Netzwerkschnittstellen und nennt die Adresse, die vom
Handy aus funktioniert. Es rät nicht: Rückschleife, selbstvergebene Adressen
(169.254.x.x), Träger-NAT und die Dokumentationsbereiche aus RFC 5737 werden
ausdrücklich als „nicht erreichbar" ausgewiesen. Findet es keine brauchbare
Adresse — der Regelfall in Containern und Cloud-Umgebungen — sagt es das,
statt eine Zahl zu nennen, die dann nicht lädt.

**Dann APP_URL auf genau diese Adresse setzen**, in `.env`:

```
APP_URL="http://192.168.178.42:3000"
```

Das ist keine Kosmetik. An `APP_URL` hängen drei Dinge:

| | Wirkung |
|---|---|
| Links in E-Mails | Bestätigungs- und Zurücksetzlinks zeigen sonst auf `localhost` — auf dem Handy führt das ins Leere |
| Rückleitung nach der Zahlung | Mollie schickt den Käufer an diese Adresse zurück |
| Sitzungscookie | Beginnt `APP_URL` mit `https://`, wird das Cookie als `secure` gesetzt und über http **nicht** zurückgeschickt — die Anmeldung schlägt dann scheinbar grundlos fehl |

**Dann starten, mit Lauschen auf allen Schnittstellen:**

```bash
npm run dev:netz                          # Entwicklung
npm run build && npm run start:netz       # wie im Betrieb
```

Ohne `:netz` lauscht der Server nur auf `127.0.0.1` und ist vom Handy aus
nicht erreichbar — auch dann nicht, wenn die Adresse stimmt.

Am Handy dann `http://192.168.178.42:3000` aufrufen (die Adresse aus
`npm run netz`).

### Wenn die Seite auf dem Handy nackt aussieht

Ohne Stile, ohne Funktion, während sie auf demselben Rechner unter
`localhost` einwandfrei aussieht — dann greift `upgrade-insecure-requests`:
Der Browser stuft jede Unteranfrage auf `https` hoch, der Server spricht im
eigenen Netz aber nur `http`.

Die Richtlinie hängt deshalb daran, ob wirklich `https` gesprochen wird —
also an `APP_URL` und **nicht** an `NODE_ENV`. Tritt das trotzdem auf, steht
in `APP_URL` noch eine `https`-Adresse.

### Wenn die Firewall dazwischensteht

Windows fragt beim ersten Start, ob Node im Netzwerk erreichbar sein darf.
Wird das abgelehnt, ist die Adresse richtig und die Seite trotzdem nicht
erreichbar. Freigabe: Windows-Firewall → Eingehende Regel für Port 3000
(privates Netz genügt).

---

## 5. Prüfen

```bash
npm run verify                             # Typecheck, Lint, Tests, Build
npm run deploy:pruefen http://localhost:3000
```

`deploy:pruefen` prüft von außen: ob die wichtigen Seiten antworten, ob die
geschützten Endpunkte **ohne** Anmeldung tatsächlich mit 401 abweisen, und
ob die Sicherheitskopfzeilen gesetzt sind. Dieselbe Prüfung läuft gegen die
Adresse auf Vercel.

---

## 6. Browserdurchläufe

Zwei Prüfungen, die sich nur im echten Browser machen lassen. Beide brauchen
eine laufende Anwendung; Playwright ist eine Entwicklungsabhängigkeit
(`npx playwright install chromium` einmalig). `CHROMIUM_PFAD` nimmt
stattdessen einen bereits vorhandenen Browser.

```bash
npm run pruefe:formulare        # öffentliche Seiten, Desktop + 390 px
```

Prüft je Seite: Hat jedes sichtbare Feld eine Beschriftung? Ist die Schrift
auf dem Telefon mindestens 16 px (darunter zoomt Safari beim Hineintippen)?
Ist das Feld mindestens 40 px hoch? Wackelt die Seite seitlich? Bleibt die
Konsole still?

```bash
export PRUEF_COOKIE=$(npx tsx scripts/pruefsitzung.ts)
npm run rundgang:verkaufen      # angemeldeter Verkaufsablauf
```

Geht den Weg eines Verkäufers: `/verkaufen` öffnen, VIN eintippen, Entwurf
anlegen lassen, Entwurfsseite prüfen — inklusive derselben Feldregeln, denn
das längste Formular der Anwendung steht hinter der Anmeldung und fällt
sonst durch das Raster.

Die Prüfkonten hinterher entfernen:

```bash
npx tsx scripts/pruefsitzung.ts --entfernen
```
