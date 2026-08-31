# Sicherheit

Stand nach Phase 1. Diese Datei beschreibt getroffene Maßnahmen und
**bekannte offene Punkte** — beides ehrlich, damit die Prüfung in Phase 14
und 15 nicht bei null anfängt.

## Authentifizierung

- **Passwörter:** scrypt aus der Node-Standardbibliothek, N=32768, r=8, p=1,
  64-Byte-Schlüssel, 16-Byte-Zufallssalz. Parameter stehen im gespeicherten
  Hash (`scrypt$N$r$p$salt$hash`) und lassen sich später erhöhen, ohne
  bestehende Passwörter ungültig zu machen (`needsRehash`).
- **Kein natives Modul, keine externe Bibliothek** an der
  sicherheitskritischsten Stelle — bewusst kein Lieferkettenrisiko.
- **Vergleich in konstanter Zeit** (`timingSafeEqual`).
- **Passwortregeln:** Länge statt Zeichenklassen (mindestens 12 Zeichen).
  Erzwungene Sonderzeichen erzeugen erratbarere Passwörter, nicht sicherere.
  Zusätzlich abgelehnt: Passwörter, die die eigene E-Mail-Adresse enthalten.

## Sitzungen

- Serverseitige Sitzungen in der Datenbank, **kein JWT**. Grund: sofortige
  Widerrufbarkeit — bei einem Guthabensystem wesentlich.
- Im Cookie steht ein 256-Bit-Zufallstoken, in der Datenbank **nur dessen
  SHA-256-Hash**. Ein Datenbankleck gibt keine gültigen Sitzungen preis.
- Cookie: `httpOnly` (kein Zugriff aus JavaScript), `SameSite=Lax`
  (CSRF-Schutz für alle nicht-GET-Anfragen), `Secure` sobald `APP_URL` auf
  `https://` steht, `Path=/`.
- Gleitender Ablauf (7 Tage ohne Aktivität), gedeckelt durch eine absolute
  Laufzeit (30 Tage ab Erstellung). Eine gestohlene Sitzung ist damit nicht
  unbegrenzt gültig.
- Sperrung eines Kontos verwirft **alle** seine Sitzungen sofort.

## Schutz gegen Aufzählung und Raten

- **Gleiche Fehlermeldung** bei falschem Passwort und unbekannter Adresse.
- **Angeglichene Antwortzeit:** Bei unbekannter Adresse wird dieselbe teure
  scrypt-Rechnung ausgeführt. Ohne das wäre an der Antwortzeit ablesbar,
  welche Adressen registriert sind.
- **Kontobezogene Sperre** nach 8 Fehlversuchen für 15 Minuten. Kontobezogen,
  nicht IP-bezogen — eine reine IP-Begrenzung ist verteilt umgehbar.
- **Zusätzliche Ratenbegrenzung pro IP:** Anmeldung 10/5 min, Registrierung
  5/Stunde.
- **Fremde Datensätze antworten `404`, nicht `403`.** Sonst ließe sich über
  die Fehlerantwort aufzählen, welche IDs existieren.

## Autorisierung

- Eine einzige Rechtematrix in `packages/core/src/auth/roles.ts`, sechs
  Rollen. Es gibt **keine zweite Liste im Frontend** — das Frontend darf sie
  zum Ein- und Ausblenden lesen, nie zum Erlauben.
- Recht und Eigentum sind getrennt: `listing:manage:own` sagt nichts über den
  konkreten Datensatz aus. `requireOwnership` und `requireSameDealer` prüfen
  zusätzlich.
- Reihenfolge ist festgelegt: erst 401 (keine Sitzung), dann 403 (kein Recht).
- Die Rolle wird bei der Registrierung **nie** aus der Eingabe übernommen.
  Getestet.

## Transport und Browser

Kopfzeilen in `apps/web/src/lib/security-headers.ts`:
`X-Content-Type-Options: nosniff` · `X-Frame-Options: DENY` ·
`Referrer-Policy: strict-origin-when-cross-origin` · `Permissions-Policy`
(Kamera, Mikrofon, Zahlung, USB aus) · `Strict-Transport-Security`
(1 Jahr, inkl. Subdomains) · `Cross-Origin-Opener-Policy: same-origin`.
`X-Powered-By` ist abgeschaltet.

## Content-Security-Policy — und ihr Zielkonflikt

**Dies ist der wichtigste Fund aus Phase 1.**

Ein Nonce ist der wirksamste Schutz gegen eingeschleuste Skripte, muss aber
pro Anfrage neu entstehen. Eine statisch vorgerenderte Seite trägt jedoch
fest eingebackenes HTML — der Nonce in der Kopfzeile passt dann zu keinem
Skript-Tag im Dokument, und der Browser blockiert **alles**. Die Seite sieht
richtig aus und tut nichts.

Das ist beim Aufbau zweimal passiert (gemessen: 0 von 20 Skripten mit
passendem Nonce) und war von außen unsichtbar.

**Auflösung:** zwei Richtlinien nach Seitenart, in `apps/web/src/lib/csp.ts`.

1. `/anmelden`, `/registrieren`, `/konto`, `/haendler`, `/admin`, `/api`
   werden dynamisch gerendert → Nonce mit `'strict-dynamic'`. Dort, wo
   Sitzungen und Geld im Spiel sind, gilt die strenge Richtlinie.
2. Alles andere → Richtlinie ohne Nonce, mit `'unsafe-inline'` für Skripte.

Die Liste nennt die **dynamischen** Bereiche, nicht die statischen. Dadurch
funktioniert eine neue öffentliche Seite von allein, und eine neue geschützte
Seite fällt im Test auf.

**Absicherung:** `apps/web/tests/csp-routes.test.ts` liest das Build-Manifest
und prüft, dass keine statisch erzeugte Seite eine Nonce-Richtlinie bekommt.
Der Test wurde gegen einen absichtlich eingebauten Fehler geprüft und schlägt
mit klarer Meldung fehl. Zusätzlich prüft `csp-live.test.ts` an der laufenden
Anwendung, dass jedes ausgelieferte Skript-Tag den Nonce der Antwort trägt.

**Offener Punkt für Phase 9:** Sobald öffentliche Seiten von Nutzern oder der
KI erzeugten Text anzeigen, wiegt die schwächere Richtlinie dort schwerer.
Gegenmaßnahme ist dann nicht die Richtlinie, sondern die Darstellung: solcher
Text wird ausschließlich als Text gerendert, nie als HTML. Kein
`dangerouslySetInnerHTML` auf fremdem Inhalt — ausnahmslos.

## Eingaben und Fehler

- Jede Eingabe von außen geht durch ein Zod-Schema, bevor sie die
  Domänenschicht erreicht (`parseOrThrow`).
- JSON-Bodies sind auf 256 KB begrenzt; falscher `content-type` und
  ungültiges JSON werden als 400 abgewiesen, nicht als 500.
- Fehlerantworten entstehen ausschließlich aus `AppError`. Alles Unbekannte
  wird zu `INTERNAL` — **5xx-Nachrichten verlassen den Server nie im
  Klartext**, Ursache und Stacktrace gehen nur ins Log.

## Datenschutz

- **IP-Adressen werden nie im Klartext gespeichert.** Im Audit-Log steht ein
  HMAC-SHA-256 mit serverseitigem Geheimnis (`IP_HASH_SECRET`). Ein einfacher
  Hash würde nicht genügen: der IPv4-Adressraum ist in Minuten durchprobiert.
- In Produktion erzwingt die Konfigurationsprüfung ein gesetztes
  `IP_HASH_SECRET` von mindestens 16 Zeichen — sonst startet die Anwendung nicht.
- Audit-Einträge enthalten nie Passwörter, Tokens, vollständige VIN oder
  Zahlungsdaten. Getestet.
- Vom User-Agent wird nur eine gekürzte Form gespeichert.

## Bekannte offene Punkte

| | Punkt | Auswirkung |
|---|---|---|
| **S1** | **Ratenbegrenzung gilt pro Prozess.** `InMemoryRateLimiter` schützt ab der zweiten Instanz nicht mehr verlässlich. | Vor dem Mehrinstanzbetrieb durch eine geteilte Implementierung ersetzen. Die Schnittstelle bleibt gleich. |
| **S2** | **`x-forwarded-for` ist fälschbar,** solange kein vertrauenswürdiger Proxy die Kopfzeile überschreibt. | Der Wert taugt für Statistik und grobe Begrenzung, nicht als Sicherheitsmerkmal. |
| **S3** | **Keine E-Mail-Verifikation** (offener Punkt B8: kein Versandweg festgelegt). | Konten sind sofort nutzbar. Vor Produktivbetrieb zu schließen. |
| **S4** | **Kein Passwort-Zurücksetzen** — hängt am selben Punkt. | Wer sein Passwort vergisst, kommt nicht ins Konto. |
| **S5** | **Audit-Log ist fehlertolerant:** Ein fehlgeschlagener Eintrag bricht den fachlichen Vorgang nicht ab. | Für Guthabenbuchungen ab Phase 11 muss der Eintrag stattdessen in derselben Transaktion geschrieben werden. |
| **S6** | **`'unsafe-inline'` für Stile** in beiden Richtlinien — Next erzeugt eingebettete Stile. | Deutlich geringeres Risiko als bei Skripten, aber nicht null. |
| **S7** | **Keine Zwei-Faktor-Anmeldung.** | Für Administrations- und Händlerkonten vor Produktivbetrieb erwägen. |
