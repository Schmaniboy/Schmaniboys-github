# Systemtest

Umsetzung: `apps/web/tests/systemtest-live.test.ts`,
`apps/web/tests/security-live.test.ts`.

## Warum ein eigener Test, wo jede Phase schon geprüft ist

Die Fachtests prüfen jeder ihren Ausschnitt. Was zwischen zwei Phasen bricht,
findet keiner von ihnen: Ein Feld, das die eine Phase schreibt und die andere
anders liest; eine Regel, die in der einen gilt und in der anderen umgangen
wird; eine Navigation, die auf eine Seite zeigt, die es nicht mehr gibt.

Der Systemtest geht deshalb **einmal quer durch**: Redaktion legt einen
Katalog an und veröffentlicht ihn; eine verkaufende Person macht daraus einen
Entwurf, bestätigt das Fahrzeug, macht Angaben, ruft eine Bewertung ab und
stellt eine Anzeige mit Bild online; eine kaufende Person findet sie, merkt
sie sich und schreibt an; die Verwaltung moderiert und stellt zurück; am Ende
werden die Zahlen nachgerechnet.

Dazwischen wird an den richtigen Stellen geprüft, dass etwas **nicht** geht:
Veröffentlichen ohne Quelle, Texte ohne bestätigtes Fahrzeug, „unfallfrei"
neben einer Unfallbeschreibung, Guthabenkauf ohne Zahlungsweg.

## Die Sammelprüfung auf Fremdzugriff

Ein Testfall geht alle Rollen durch und versucht jeweils, auf etwas Fremdes
zuzugreifen: fremder Entwurf, fremde Anzeige ändern, fremdes Gespräch lesen,
Händlerprofil ohne Betrieb, Benutzerliste ohne Recht, Moderation ohne Recht.
Jede Zeile muss 403 oder 404 ergeben — **niemals 200**. Dieselbe Prüfung noch
einmal für die Seiten des Adminbereichs.

Der Wert liegt in der Form: Eine neue Route, die diese Liste nicht besteht,
fällt beim nächsten Lauf auf, ohne dass jemand daran denken muss.

## Sicherheitsproben

`security-live.test.ts`. Kein Ersatz für eine Prüfung durch Menschen — aber
die Sorte Angriff, die sich automatisiert wiederholen lässt, gehört in die
Testreihe. Was dort steht, wurde **versucht**, nicht angenommen:

* **SQL-Fragmente** in Suchparametern (`'; DROP TABLE …`). Danach wird
  geprüft, dass die Tabellen noch da sind.
* **Skript in einer Nutzereingabe.** Der Suchbegriff wird auf der Seite
  zurückgegeben; geprüft wird, dass das rohe `<script>` nicht durchkommt. Ein
  Blick auf die Antwort bestätigt: Der Wert steht als
  `value="&lt;script&gt;…"` da — der Test prüft also wirklich etwas.
* **Sitzungscookie**: `HttpOnly`, `SameSite=lax`, und der Klartexttoken steht
  nicht in der Datenbank.
* **Massenzuweisung**: Beim Anlegen eines Entwurfs werden `ownerId` und
  `status` mitgeschickt. Der Entwurf gehört danach trotzdem der anfragenden
  Person und steht nicht auf „veröffentlicht".
* **Zu großer Körper**, **gefälschte Sitzungscookies**, **Fehlermeldungen
  ohne Interna** (kein Stapelspeicherauszug, kein Dateipfad, kein SQL).
* **Ratenbegrenzung**: nicht nur konfiguriert, sondern wirksam — der Test
  ruft so lange auf, bis 429 kommt, und schlägt fehl, wenn es ausbleibt.
* **Clickjacking**: `X-Frame-Options: DENY` und `frame-ancestors` in der CSP.

## Ergebnis

548 Tests, alle grün. Der Browserdurchlauf über sämtliche öffentlichen
Seiten, alle Kontobereiche, den Verkaufsentwurf und den Adminbereich ergab
keine Konsolenfehler und keine unerwarteten Statuscodes — die einzigen 404
sind die gewollten aus dem Adminbereich.

**In dieser Phase wurden keine neuen Fehler gefunden.** Das ist kein Beweis
für Fehlerfreiheit, sondern die Auskunft, dass die Prüfungen dieser Phase
nichts zutage gefördert haben. Die Fehler dieses Projekts kamen fast alle aus
Browserdurchläufen kurz nach dem Bauen — die Stelle, an der eine Annahme noch
frisch und deshalb noch ungeprüft ist.
