# Produktionsreife

**Stand:** 2026-08-24 · **Prüfer:** automatisierte Audits und Browserdurchläufe
dieser Phase · **Grundlage:** MASTERPLAN Phase 15 · **Go-Live-Plan:**
MASTERPLAN_GO_LIVE.md

---

## Das Ergebnis in einem Satz

Die Plattform ist **technisch lauffähig und in sich schlüssig**, aber **nicht
produktionsbereit** — es fehlen vier Dinge, die sich nicht mit Code lösen
lassen: Katalogdaten, ein Zahlungsanbieter, ein E-Mail-Versandweg und eine
Marktdatenquelle.

Was diese Anwendung ausdrücklich **nicht** behauptet: dass sie rechtlichen
oder steuerlichen Anforderungen genügt. Sie ist so gebaut, dass sie sich
daran anpassen lässt.

---

## Was fertig ist

| Bereich | Stand |
|---|---|
| Katalog mit Redaktionsablauf und Belegpflicht | vollständig |
| Wissensdatenbank mit drei Belegmodellen | vollständig |
| Fahrzeugsuche, Modell- und Motorseiten | vollständig |
| Verkaufsentwurf mit VIN-Auswertung | vollständig |
| KI-Verkaufstexte | Ablauf vollständig, **Zugang fehlt** |
| Fahrzeugbewertung | Faktoren vollständig, **Marktdaten fehlen** |
| Marktplatz mit Anzeigen und Bildern | vollständig |
| Händlerbereich | vollständig |
| Token-Guthaben | vollständig |
| Guthabenkauf und Rechnungen | Ablauf vollständig, **Anbieter fehlt** |
| Nachrichten und Benachrichtigungen | vollständig |
| Adminbereich und Moderation | vollständig |

**712 Tests**: 711 bestanden, 1 ausdrücklich übersprungen. 34.700 Zeilen TypeScript,
davon 9.200 Zeilen Tests.

---

## Was fehlt — und warum es nicht am Code liegt

### 1. Katalogdaten (B3) — blockierend

Die Plattform hat **keine Fahrzeugdaten**. Der Katalog ist gebaut, die
Belegpflicht greift, der Redaktionsablauf funktioniert — aber ohne Inhalt
sind Suche, Bewertung und Verkaufsentwurf leere Hüllen.

Das ist keine Programmierarbeit, sondern Redaktionsarbeit: Jeder technische
Wert braucht eine Quelle, und die Regel gilt ohne Ausnahme. Für einen
brauchbaren Start braucht es die verbreiteten Baureihen der letzten fünfzehn
Jahre.

**Ohne Katalogdaten ist die Plattform nicht startfähig.**

### 2. Zahlungsanbieter (B5) — blockierend für den Betrieb

Guthaben lässt sich nicht kaufen. Die Schnittstelle steht, der Kaufablauf ist
gebaut und getestet, die Rechnungen entstehen — es fehlt der Anbieter.

Der Anschluss ist ein Adapter, kein Umbau: `PaymentProvider` in
`packages/core/src/ports/payment-provider.ts`, eingesetzt in
`apps/web/src/lib/billing-deps.ts`. Kein Stripe (Vorgabe C1).

### 3. E-Mail-Versandweg (B8) — blockierend

Es gibt keinen Versandweg. Konkret fehlen dadurch:

* **Bestätigung der E-Mail-Adresse bei der Registrierung.** Konten lassen
  sich derzeit mit fremden Adressen anlegen.
* **Passwort zurücksetzen.** Wer sein Passwort vergisst, kommt nicht mehr
  hinein.
* **Benachrichtigung über neue Nachrichten**, wenn jemand nicht online ist.

Das erste davon ist vor einem öffentlichen Betrieb zu schließen.

### 4. Marktdatenquelle (B4) — einschränkend, nicht blockierend

Die Bewertung läuft, gibt aber **keinen Betrag in Euro** aus (ADR-006). Die
Faktorenanalyse ist vollständig und für sich brauchbar. Was eine Quelle
mitbringen muss, steht im Typ `MarketBasis`: Stichprobengröße,
Beobachtungszeitraum, Quelle, und ob es Angebots- oder erzielte Preise sind.

### 5. Markenname, Domain, Logo (B6) — einschränkend

Die Anwendung heißt jetzt „CARONEX". Logo und Branding sind umgesetzt.

---

## Vor dem ersten öffentlichen Start zu erledigen

Diese Punkte stehen in der Anwendung und sind bewusst noch nicht umgestellt:

1. **`SUCHMASCHINEN_INDEXIEREN="true"` setzen.** Solange die Freigabe fehlt,
   sperren `robots.txt` und die Meta-Angabe gemeinsam alles. Das ist Absicht:
   Ein halbfertiger Marktplatz gehört nicht in einen Suchindex, denn die
   Adressen bleiben dort stehen, lange nachdem sie nicht mehr stimmen. Die
   Freigabe hängt bewusst nicht an `NODE_ENV` — Vorschau-Umgebungen laufen
   ebenfalls damit.
2. **`IP_HASH_SECRET` setzen.** In Produktion Pflicht, mindestens 16 Zeichen
   — die Anwendung startet sonst nicht. Ohne Geheimnis wäre der Hash einer
   IP-Adresse trivial zurückzurechnen.
3. **`APP_URL` auf die echte Adresse setzen.** Sie bestimmt die
   Cookie-Sicherheit (`Secure` nur bei `https://`), die Rückleitungen der
   Zahlung und die Adressen in Sitemap und strukturierten Daten.
4. **`TAX_RATE_BASIS_POINTS` prüfen.** Voreingestellt sind 1900 (19,00 %).
   Der Wert ist eine Einstellung, keine Zusicherung.
5. **Bildablage umstellen.** **Erledigt** — der S3-Adapter ist gebaut.
   `S3_ENDPOINT`, `S3_REGION`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`,
   `S3_SECRET_ACCESS_KEY` setzen; alle fünf oder keinen. Ohne sie bleibt es
   beim Dateisystem (eine Instanz, eigener Server) beziehungsweise bei der
   Ablehnung auf serverlosen Umgebungen. Der Eimer darf nicht öffentlich
   lesbar sein — ausgeliefert wird über `/api/bilder/…`, wo Recht und
   Medientyp geprüft werden.
6. **Ersten SUPER_ADMIN anlegen.** `npm run admin:erster -- <e-mail>`.
   Das Skript ernennt ein vorhandenes Konto oder legt eines an; das Passwort
   wird eingelesen oder erzeugt, nie als Aufrufparameter übergeben
   (Argumente stehen in `ps`, in der Shell-Historie und in Protokollen von
   Bereitstellungswerkzeugen). Existiert bereits ein SUPER_ADMIN, bricht es
   ab: Ein Werkzeug, das jederzeit weiteren Vollzugriff schafft, wäre eine
   Hintertür an der Protokollierung vorbei.

---

## Audit-Befunde

### Design (15.1)

Farbtokens an einer Stelle, Kontraste dokumentiert und gemessen: Fließtext
17,6:1, gedämpfter Text 9,2:1, feiner Text 5,7:1 — alle über den
AA-Anforderungen. Akzentfarbe Neon-Rot (`#ff3355`) auf schwarzem Grund
(Vorgabe C4); Text auf Akzentfläche 5,6:1.

**Kein Befund.**

### UX (15.2)

Alle Formulare mit Absende-Handler haben eine Hydrationssperre — geprüft
durch einen Durchlauf über sämtliche Komponenten. Das war einmal ein echter
Fehler: Vor der Hydration sandte der Browser nativ per `GET` und schrieb das
Passwort in die Adresszeile.

Filterformulare senden bewusst per `GET`: Die Filter stehen danach in der
Adresszeile, lassen sich verlinken und ohne JavaScript bedienen. Dort geht
kein Geheimnis in die URL.

**Befund (klein):** 23 Eingabefelder, davon 15 in einem `<label>` und 16 mit
`aria-label`. Die Deckung ist damit vollständig, aber uneinheitlich —
lesbarer wäre ein einheitliches Muster.

### Performance (15.3)

Gemessene Antwortzeiten (fünf Aufrufe, lokal, Produktions-Build):

| Seite | Mittel |
|---|---|
| Startseite | 5 ms |
| Katalog | 6 ms |
| Marktplatz | 21 ms |
| Suche | 25 ms |

Gemeinsames JavaScript: **103 kB**. Die größte Seite ist der Verkaufsentwurf
mit 17,4 kB eigenem Anteil. 71 Indizes und Eindeutigkeitsbedingungen im
Schema.

**Befund (mittel) — behoben.** 20 von 41 `findMany`-Abfragen hatten keine
Obergrenze. Die meisten sind fachlich begrenzt (Bilder einer Anzeige,
Mitarbeiter eines Betriebs, Quellen eines Eintrags); dreizehn Abfragen in
`repositories/catalog.ts` und `repositories/knowledge-write.ts` wachsen aber
mit dem Katalog und haben jetzt eine Obergrenze von 500. Heute wäre das kein
Fehler gewesen — bei zehntausend Einträgen wäre es einer.

### Security (15.4)

Zehn automatisierte Sicherheitsproben, alle bestanden: SQL-Fragmente in
Suchparametern, Skript in einer Nutzereingabe, Cookie-Merkmale
(`HttpOnly`, `SameSite=lax`, Klartexttoken nicht in der Datenbank),
Massenzuweisung, Körpergröße, gefälschte Sitzungen, Fehlermeldungen ohne
Interna, wirksame Ratenbegrenzung, festgesetzter Medientyp, Clickjacking.

Dazu eine Sammelprüfung auf Fremdzugriff über alle Rollen — jede Zeile 403
oder 404, niemals 200.

Durchgehende Muster:

* **404 statt 403** bei fremden Datensätzen. Ein Verbot bestätigte die
  Existenz.
* **Besitzerkennung in der `WHERE`-Bedingung**, nicht in einem Vergleich
  davor.
* **Hochgeladene Bilder werden neu geschrieben**, nie übernommen (ADR-008).
* **Keine Geheimnisse im Quelltext** — geprüft.

**Befund (klein) — behoben.** `hiddenReason` einer moderierten Nachricht
wurde gespeichert, aber nirgends angezeigt. Der Grund steht jetzt im
Gesprächsverlauf: Eine entfernte Nachricht ohne Erklärung lässt beide Seiten
raten — die eine, warum ihre Nachricht weg ist, die andere, was darin stand.

### Fahrzeugdaten (15.5)

Die inhaltliche Kernentscheidung des Projekts: **Was nicht belegt ist, wird
nicht behauptet.**

* Technische Werte brauchen eine Quelle; die Belegpflicht kennt drei Modelle
  mit unterschiedlichen Anforderungen.
* Aus einer VIN wird nur ausgegeben, was nach ISO 3779/3780 darin steht — ein
  Test prüft, dass das Ergebnis **keine** Schlüssel `model`, `engine`,
  `generation` hat.
* Die Bewertung nennt ohne Marktdaten keinen Betrag.
* Fehlende Angaben werden benannt, nicht geschätzt.
* „Keine Angabe" ist nirgends ein „unfallfrei".

**Kein Befund.**

### Plattform (15.6)

Abhängigkeitsrichtung strikt: `core → nichts`, `db → core`, `web/worker →
core, db`. Die Fachlogik liegt in `packages/core` und ist ohne Datenbank und
ohne Next.js testbar — 300 der 548 Tests laufen ohne beides.

Externe Abhängigkeiten stecken hinter Schnittstellen: `TextGenerator`,
`MarketDataSource`, `PaymentProvider`, `ImageStorage`, `ImageProcessor`,
`Clock`, `RateLimiter`, `JobQueue`, `AuditLogger`. Jede hat eine
Ersatzvariante, die sich als nicht verfügbar meldet, statt ins Leere zu
laufen.

**Kein Befund.**

### SEO (15.7)

Sprechende Adressen, eigene Metadaten je Anzeige, `og:`-Angaben,
strukturierte Daten nach schema.org — nur mit dem, was auch auf der Seite
steht. Sitemap enthält ausschließlich sichtbare Anzeigen.

**Befund (blockierend für den Start, aber gewollt):** `robots.txt` und die
Metadaten sperren derzeit alles. Vor dem Start umzustellen (siehe oben).

### Testing (15.8)

712 Tests in 55+ Dateien. Aufteilung: rund 300 Fachtests ohne Infrastruktur,
rund 400 Live-Tests gegen laufende Anwendung und echte Datenbank, dazu
Browserdurchläufe.

Die Live-Tests legen ihre Sitzung direkt an, statt sich anzumelden — sonst
sperrten sie sich an der Anmelde-Ratenbegrenzung gegenseitig aus. Die
Anmeldung selbst prüft eine eigene, kleine Datei.

**Befund (klein) — größtenteils behoben.** Vier ältere Live-Tests hatten
Zweige der Form `if (!daten) { expect(true).toBe(true); return; }`. Sie
meldeten sich als bestanden, ohne etwas geprüft zu haben.

`verkaufen-live.test.ts` legt seinen Katalog jetzt selbst an — beide Tests
laufen wirklich. In `variante-live.test.ts` bleiben zwei Fälle, die eine
vollständige Motorvarianten-Kette bräuchten; sie melden sich jetzt als
**übersprungen** statt als bestanden. Übersprungen ist ehrlich; grün ohne
Prüfung ist es nicht.

Aktueller Stand: **711 bestanden, 1 übersprungen**.

---

## Zusammenfassung der Befunde

| Nr. | Bereich | Gewicht | Befund |
|---|---|---|---|
| 1 | Inhalt | **blockierend** | Keine Katalogdaten (B3) |
| 2 | Betrieb | **blockierend** | Kein Zahlungsanbieter (B5) |
| 3 | Betrieb | **blockierend** | Kein E-Mail-Versandweg (B8) — keine Adressbestätigung, kein Passwort-Zurücksetzen |
| 4 | SEO | **vor Start** | **behoben** — eine Freigabe (`SUCHMASCHINEN_INDEXIEREN`) steuert robots.txt und Meta-Angabe gemeinsam; vorher widersprachen sie sich |
| 5 | Betrieb | **vor Start** | `IP_HASH_SECRET`, `APP_URL`, erster SUPER_ADMIN |
| 6 | Performance | mittel | **behoben** — Obergrenzen für die dreizehn mit dem Katalog wachsenden Abfragen |
| 7 | Funktion | einschränkend | Keine Marktdaten (B4) — Bewertung ohne Eurobetrag |
| 8 | Marke | einschränkend | Kein Name, keine Domain, kein Logo (B6) |
| 9 | Security | klein | **behoben** — Moderationsgrund wird im Gespräch angezeigt |
| 10 | UX | klein | **vollständig behoben** — alle Formulare (zehn Dateien, 186 Einzelbefunde) auf einheitliche Feldkomponenten umgestellt; drei Browserdurchläufe (öffentlich, alle Rollen, Verkaufsablauf) bestätigen 0 Befunde |
| 11 | Testing | klein | **größtenteils behoben** — zwei Tests laufen jetzt echt, zwei melden sich ehrlich als übersprungen |

---

## Empfohlene Reihenfolge

1. E-Mail-Versandweg anschließen (B8) — ohne Adressbestätigung kein
   öffentlicher Betrieb.
2. Katalogdaten aufbauen (B3) — die längste Arbeit, und ohne sie ist alles
   andere leer.
3. Zahlungsanbieter anschließen (B5).
4. Befunde 4 und 5 abarbeiten (Umstellungen, keine Programmierarbeit).
5. Marktdatenquelle (B4), sobald es genug eigene Anzeigen gibt — dann trägt
   die eigene Angebotsauswertung, mit ausgewiesener geringerer Güte.
6. Befund 10 (einheitliche Beschriftung) und der Rest von Befund 11 im
   laufenden Betrieb.

Die Befunde 6, 9 und 11 wurden in Phase 15 behoben, die Befunde 4 und 10 danach.

---

## Was diese Bewertung nicht ist

Sie beruht auf automatisierten Prüfungen, Browserdurchläufen und der
Durchsicht des eigenen Codes. Sie ersetzt **keine** Prüfung durch Menschen:
keinen Penetrationstest, keine Rechtsberatung, keine steuerliche Prüfung,
keine Prüfung auf Barrierefreiheit nach Norm.

Dass 711 Tests grün sind, heißt, dass 711 geprüfte Annahmen stimmen — nicht,
dass die Anwendung fehlerfrei ist. Die Fehler dieses Projekts kamen fast alle
aus Browserdurchläufen kurz nach dem Bauen, nicht aus Tests.
