# Betrieb auf Vercel

Diese Anleitung bringt die Plattform als öffentlich erreichbare Vorschau
online. Sie ist so geschrieben, dass sie ohne Rückfragen abzuarbeiten ist.

---

## Was Vercel kann und was nicht

Bevor Sie anfangen, zwei Dinge, die später sonst überraschen:

**Es braucht eine externe PostgreSQL-Datenbank.** Vercel liefert keine mit.
Neon, Supabase und Vercel Postgres funktionieren alle; Neon hat einen
kostenlosen Tarif, der für eine Vorschau reicht.

**Bilder lassen sich dort nicht hochladen.** Das Dateisystem einer
serverlosen Funktion ist schreibgeschützt bis auf `/tmp`, und `/tmp` lebt nur
so lange wie ein einzelner Aufruf. Die Anwendung erkennt das (`VERCEL=1`) und
lehnt Uploads mit einer Begründung ab, statt sie anzunehmen und verschwinden
zu lassen. Alles andere — Katalog, Suche, Vergleich, Ausstattungschecker,
HSN/TSN, Mein Fahrzeug — läuft vollständig.

Wer Bild-Uploads braucht, betreibt die Anwendung auf einem Server mit
beschreibbarem Dateisystem (ein kleiner Hetzner-Server genügt) oder ergänzt
einen Objektspeicher-Adapter. Der Anschlusspunkt dafür ist
`apps/web/src/lib/images/storage.ts`; die Schnittstelle hat drei Methoden.

---

## Schritt 1 — Datenbank anlegen

Bei Neon (oder einem Anbieter Ihrer Wahl) eine PostgreSQL-Datenbank
erstellen und die Verbindungszeichenfolge kopieren. Sie sieht so aus:

```
postgresql://benutzer:passwort@host/datenbank?sslmode=require
```

## Schritt 2 — Projekt in Vercel anlegen

1. Auf vercel.com das GitHub-Repository importieren.
2. Vercel erkennt Next.js selbst. Die Einstellungen kommen aus
   `vercel.json` — **Root Directory leer lassen**, nicht auf `apps/web`
   setzen. Der Build läuft aus der Wurzel, weil `prisma generate` das
   Schema aus `packages/db` braucht.

## Schritt 3 — Umgebungsvariablen setzen

In den Projekteinstellungen unter *Environment Variables*. Die mit ✱
markierten sind Pflicht.

| Variable | Wert | |
|---|---|---|
| `DATABASE_URL` | Verbindungszeichenfolge aus Schritt 1 | ✱ |
| `APP_URL` | `https://ihr-projekt.vercel.app` | ✱ |
| `IP_HASH_SECRET` | 32 zufällige Bytes, siehe unten | ✱ |
| `TAX_RATE_BASIS_POINTS` | `1900` für 19 % | |
| `ANTHROPIC_API_KEY` | für den Verkaufsassistenten | |
| `MOLLIE_API_KEY` | `test_…` oder `live_…` | |
| `MOLLIE_WEBHOOK_URL` | `https://ihr-projekt.vercel.app/api/zahlungen/mollie` | |
| `SMTP_HOST` | z. B. `smtp.postmarkapp.com` | |
| `SMTP_PORT` | `587` (oder `465` für TLS ab der ersten Zeile) | |
| `SMTP_USER` / `SMTP_PASSWORD` | Zugangsdaten des Versanddienstes | |
| `SMTP_FROM` | `CARONEX <noreply@ihre-domain.de>` | |

Das Geheimnis für `IP_HASH_SECRET` erzeugen:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"
```

Ohne dieses Geheimnis startet die Anwendung in Produktion nicht — das ist
Absicht: Der Hash einer IP-Adresse ohne Geheimnis lässt sich in Minuten
zurückrechnen, der Adressraum ist klein genug zum Durchprobieren.

**Kein Wert bekommt einen `NEXT_PUBLIC_`-Präfix.** Das schriebe ihn in das
Bundle des Browsers.

## Schritt 4 — Datenbankschema einspielen

Die Migrationen laufen **nicht** automatisch beim Deployment. Das ist
Absicht: Ein Schemawechsel, der bei jedem Push mitläuft, ist der schnellste
Weg zu einem Datenverlust, den niemand bemerkt hat.

Einmalig von Ihrem Rechner aus, mit der Produktions-Verbindung:

```bash
DATABASE_URL="postgresql://…" npm run db:deploy
```

Danach bei jedem Schemawechsel erneut, **vor** dem Deployment.

## Schritt 4b — Ersten Administrator anlegen

Nach dem Einspielen des Schemas gibt es kein Konto mit Adminrechten, und
ohne eines lassen sich keine Rollen vergeben.

```bash
npm run admin:erster -- ihre.adresse@beispiel.de
```

Das Skript fragt nach einem Passwort; bleibt die Eingabe leer, erzeugt es
eines und schreibt **nur dieses** auf die Standardausgabe — so lässt es sich
direkt in einen Passwortspeicher umleiten, ohne im Protokoll zu landen. Als
Aufrufparameter wird es nie entgegengenommen: Argumente stehen in `ps`, in
der Shell-Historie und in den Protokollen von Bereitstellungswerkzeugen.

Existiert das Konto schon, wird es ernannt und das Passwort nicht angefasst.
Gibt es bereits einen SUPER_ADMIN, bricht das Skript ab — weitere Rollen
gehören in den Adminbereich, wo protokolliert ist, wer sie vergeben hat.

---

## Schritt 5 — Prüfen

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://ihr-projekt.vercel.app/
curl -s https://ihr-projekt.vercel.app/api/health
```

Oder mit dem mitgelieferten Skript, das mehrere Seiten und die
Sicherheitskopfzeilen prüft:

```bash
npx tsx scripts/pruefe-deployment.ts https://ihr-projekt.vercel.app
```

---

## Automatische Deployments

Vercel baut ab dann bei jedem Push:

- Push auf den Standardzweig → Produktionsumgebung
- Push auf jeden anderen Zweig → eigene Vorschau-Adresse

Der Entwicklungszweig dieses Projekts ist
`claude/automotive-platform-7odt3q`. Er bekommt damit automatisch eine
eigene Vorschau, ohne die Produktionsadresse zu berühren.

---

## Zahlungen scharf schalten

1. Im Mollie-Dashboard einen **Testschlüssel** (`test_…`) holen und als
   `MOLLIE_API_KEY` setzen.
2. `MOLLIE_WEBHOOK_URL` auf `https://ihre-adresse/api/zahlungen/mollie`
   setzen.
3. Einen Kauf durchspielen. Mollie stellt im Testbetrieb eine Seite bereit,
   auf der sich jeder Ausgang auswählen lässt — bezahlt, abgebrochen,
   fehlgeschlagen.
4. Erst wenn das durchläuft, auf einen Echtschlüssel (`live_…`) wechseln.

Die Anwendung prüft die Form des Schlüssels beim Start und verweigert einen
Echtschlüssel gegen eine `localhost`-Adresse: Die Zahlungsbenachrichtigung
käme dort nie an, und bezahltes Guthaben würde nie gutgeschrieben.

**Ohne Schlüssel** meldet sich der Zahlungsweg als nicht eingerichtet. Es
wird dann nichts abgebucht und nichts gutgeschrieben — bereits vorhandenes
Guthaben funktioniert unverändert.

---

## E-Mail-Versand einrichten

Ohne Versandweg laufen Registrierungen durch, aber es gibt keine
Bestätigungsmail — und ein vergessenes Passwort lässt sich nicht
zurücksetzen. Die Seite sagt das, statt es zu verschweigen.

Der Adapter spricht **SMTP**, keinen Anbieter-Dialekt. Damit funktionieren
Postmark, Brevo, Mailgun, Amazon SES und ein eigener Server mit denselben
vier Werten; ein Wechsel ändert die Umgebungsvariablen, keinen Code.

1. Beim Dienst Ihrer Wahl einen Versand-Zugang anlegen und Host, Port,
   Benutzer und Passwort notieren.
2. Als `SMTP_*` in Vercel eintragen. `SMTP_FROM` muss eine Adresse Ihrer
   Domain sein — fremde Absenderadressen landen im Spam oder werden
   abgewiesen.
3. Beim Dienst die Domain freischalten (SPF und DKIM). Ohne das kommen die
   Mails nicht an; das ist keine Einstellung dieser Anwendung, sondern eine
   Ihres Domainanbieters.
4. Registrierung durchspielen und prüfen, ob die Bestätigungsmail ankommt.

Für die lokale Entwicklung genügt `MAIL_TO_CONSOLE="true"` — dann landen die
Nachrichten im Terminal statt im Postfach. **In Produktion wird der Wert
ignoriert:** Eine Anwendung, die Zurücksetzlinks in ein Serverprotokoll
schreibt und sich dabei als versandfähig meldet, gibt Zugänge preis.

Die Verbindung wird verschlüsselt erzwungen (`requireTLS` bei allen Ports
außer 465, die von der ersten Zeile an TLS sprechen). Ohne das fiele der
Versand auf eine unverschlüsselte Verbindung zurück, wenn der Server sich
als unfähig ausgibt — und dann gingen Zurücksetzlinks im Klartext über das
Netz.

---

## Was beim ersten Aufruf zu sehen ist

Eine leere Plattform. Der Katalog enthält keine Fahrzeugdaten; jede Seite
sagt das ausdrücklich, statt Beispiele vorzutäuschen.

Einen Demobestand einspielen — **ausdrücklich erfundene Werte**, nur zum
Ansehen der Darstellung:

```bash
DATABASE_URL="postgresql://…" npm run db:seed:demo
```

Echte Daten kommen über die Import-Pipeline mit Quellenpflicht:

```bash
npx tsx scripts/import-katalog.ts <datei.json>            # Probelauf
npx tsx scripts/import-katalog.ts <datei.json> --schreiben
```

Format und ein Prüfbeispiel liegen in `docs/import/`.
