# Changelog

Alle nennenswerten Änderungen an diesem Projekt. Neueste zuerst.

## [Unveröffentlicht]

### Bildablage im Objektspeicher, Fehlersuche beim Start

**Hinzugefügt — Bildablage (Startlisten-Punkt 5)**
- S3-Adapter für Bilder: `S3_ENDPOINT`, `S3_REGION`, `S3_BUCKET`,
  `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`. Alle fünf oder keiner — drei
  von fünf sind kein „fast fertig", sondern ein Speicher, der erst beim
  ersten Upload scheitert. Funktioniert mit AWS S3, Cloudflare R2, MinIO,
  Hetzner, Backblaze (`forcePathStyle`, weil die meisten Alternativen keine
  Adressen der Form `eimer.endpunkt` auflösen).
- Der Objektspeicher hat Vorrang, sobald er eingerichtet ist — auch auf
  einem eigenen Server. Ein Dateisystem, das ihn stillschweigend übergeht,
  wäre eine Falle beim Umzug auf die zweite Instanz.
- Ein fehlendes Objekt ergibt `null`, jede andere Störung schlägt durch.
  Wer beides zu `null` zusammenfasst, macht aus einer kaputten Ablage
  stillschweigend eine leere: Die Anzeige erscheint ohne Bilder, und
  niemand merkt, dass die Zugangsdaten falsch sind.
- Der Eimer darf nicht öffentlich lesbar sein — ausgeliefert wird über
  `/api/bilder/…`, wo Recht und Medientyp geprüft werden.

**Hinzugefügt — `npm run diagnose`**
- Sagt bei einem 404 oder einem nicht startenden Server, woran es liegt:
  Verzeichnis, `.env`, Baustand in `.next`, wer auf dem Port horcht
  (Prozess und PID), ob dort **diese** Anwendung antwortet, Datenbank,
  Startseite. Zu jedem Befund der nächste Schritt.
- Der häufigste Fall ist nicht, dass die Anwendung kaputt ist: Auf Port
  3000 antwortet eine andere. Das Skript erkennt das an der Antwort von
  `/api/health` und schlägt einen freien Port vor.
- Zweiter häufiger Fall: `.next` existiert, enthält aber keinen Baustand,
  weil `npm run dev` dorthin geschrieben hat. `npm start` bricht dann mit
  „Could not find a production build" ab. Geprüft wird deshalb
  `.next/BUILD_ID`, nicht nur das Verzeichnis.

### Erster Administrator, Betriebsbereitschaft, Entwicklungsserver

**Hinzugefügt**
- `npm run admin:erster -- <e-mail>` legt den ersten SUPER_ADMIN an oder
  ernennt ein vorhandenes Konto. Ohne ihn lassen sich nach der Installation
  keine Rollen vergeben — es gab bisher keinen Weg dorthin außer von Hand in
  Tabellen zu schreiben.
  - Das Passwort kommt **nie** als Aufrufparameter: Argumente stehen in
    `ps`, in der Shell-Historie und in Protokollen von
    Bereitstellungswerkzeugen. Es wird eingelesen oder erzeugt; ein
    erzeugtes geht als einziges auf die Standardausgabe und lässt sich so
    direkt in einen Passwortspeicher umleiten.
  - Existiert bereits ein SUPER_ADMIN, bricht das Skript ab. Ein Werkzeug,
    das jederzeit weiteren Vollzugriff schafft, wäre eine Hintertür an der
    Protokollierung vorbei — weitere Rollen gehören in den Adminbereich.
    `--zusaetzlich` hebt die Sperre auf.
  - Jede Ernennung landet im Prüfprotokoll.

**Behoben**
- `/api/health` antwortete mit **200**, auch wenn die Datenbank nicht
  erreichbar war — die Lage stand nur im Rumpf (`"database": "unavailable"`).
  Lastverteiler, Überwachungsdienste und die Gesundheitsprüfung des Hosters
  lesen den Statuscode: Eine Instanz ohne Datenbank wäre im Verkehr
  geblieben und hätte jede Anfrage mit einem Fehler beantwortet. Jetzt 503,
  im Betrieb geprüft (Datenbank angehalten → 503, wieder gestartet → 200).
- `pkill -f next-server` beendete die eigene Shell, weil deren
  Kommandozeile das Suchmuster enthält (Exit 144). Betrifft nur die
  Entwicklung; die Startanleitung nennt jetzt das Muster `[n]ext-server`.

### Erzeugte Texte kopieren

**Hinzugefügt**
- Jeder erzeugte Textbaustein (Titel, Kurzbeschreibung, ausführliche
  Beschreibung, Fassung für Kleinanzeigen) hat einen eigenen Kopierknopf.
  Der letzte Schritt des Verkaufsablaufs ist, den Text auf einem anderen
  Portal einzufügen; ohne Knopf hieß das, mit dem Finger über mehrere
  Absätze zu markieren. Genau dort brach der Ablauf ab.
- Drei Stufen, weil `navigator.clipboard` nur in einem sicheren Kontext
  existiert — https oder localhost. Wer die Anwendung im eigenen Netz über
  `http://192.168.x.x` aufruft (also der Weg vom Telefon), hat sie nicht.
  Dann greift `document.execCommand('copy')`; klappt auch das nicht, wird
  der Text markiert und der Grund genannt. Ein Knopf, der stumm nichts tut,
  wäre schlimmer als keiner: Man drückt, sieht nichts und fügt später eine
  alte Zwischenablage ein.
- Ein Baustein ohne Text zeigt weder Überschrift noch Knopf.

**Behoben**
- Der Kopierknopf war 30 px hoch — unter der Untergrenze, die für die
  Eingabefelder bereits gilt. Jetzt 40 px.

### Indexierung, Formularfelder, Browserprüfung

**Behoben — zwei Stellen, die sich widersprachen**
- `robots.txt` gab in Produktion frei, das Wurzel-Layout setzte fest
  `index: false`. Wer robots.txt geprüft und die Seite freigeschaltet hätte,
  wäre online gegangen mit einer Seite, die jede Unterseite per Meta-Angabe
  wieder aussperrt — ohne dass irgendwo ein Fehler erschienen wäre. Beide
  lesen jetzt `SUCHMASCHINEN_INDEXIEREN`, und ein Live-Test prüft, dass sie
  übereinstimmen.
- Die Freigabe hängt nicht mehr an `NODE_ENV`: Vorschau-Umgebungen laufen
  ebenfalls mit `NODE_ENV=production`, und was einmal im Index steht, steht
  dort noch, wenn die Adresse längst nicht mehr stimmt. Wirkungslos, solange
  `APP_URL` auf localhost zeigt.

**Behoben — Formularfelder auf dem Telefon**
- Sieben Felder im Marktplatzfilter hatten 14px Schrift. Safari auf dem
  iPhone zoomt beim Hineintippen in alles unter 16px; die Seite steht danach
  verschoben da. Alle Felder tragen jetzt auf dem Telefon 16px und ab der
  mittleren Breite die feinere Größe.
- Dieselben Felder waren 36 bis 38px hoch — unter der Größe, ab der ein Ziel
  mit dem Daumen zuverlässig zu treffen ist. Jetzt 44px.

**Geändert — ein Muster statt drei**
- `InputField`/`SelectField` um `TextareaField` und `CheckboxField` ergänzt.
  Vier Formulare (Anzeige veröffentlichen, Anzeige bearbeiten, Fahrzeug
  anlegen, Marktplatzfilter) bauten Beschriftung und Feld von Hand nach —
  mit eigenen Farben, eigenen Größen und eigenem Fokusrahmen. Sie benutzen
  jetzt dieselben Komponenten.
- Pflichtfelder werden aus `required` gekennzeichnet, nicht durch ein
  Sternchen im Beschriftungstext. Sonst liest ein Screenreader
  „Bezeichnung Stern" — und irgendwann steht der Stern an einem Feld, das
  keine Pflicht mehr ist.

**Hinzugefügt**
- `npm run pruefe:formulare`: Browserdurchlauf über die öffentlichen Seiten
  in Desktop- und Telefonbreite. Prüft Beschriftung, Schriftgröße,
  Feldhöhe, waagerechte Überbreite und Konsolenfehler. `CHROMIUM_PFAD`
  erlaubt einen bereits vorhandenen Browser.
- `npm run rundgang:verkaufen`: geht den angemeldeten Verkaufsablauf im
  Browser durch — `/verkaufen`, VIN eintippen, Entwurf anlegen,
  Entwurfsseite prüfen, in beiden Breiten. Dieselben Feldregeln greifen
  dort, weil das längste Formular der Anwendung hinter der Anmeldung steht
  und von der öffentlichen Prüfung nicht erfasst wird.
- `scripts/pruefsitzung.ts` erzeugt dafür eine Sitzung auf demselben Weg wie
  die Anwendung (Zufallstoken ins Cookie, nur der Hash in die Datenbank) und
  räumt mit `--entfernen` wieder auf. Über die Anmeldemaske zu gehen würde
  nur die Ratenbegrenzung belasten, die dafür nicht gedacht ist.

### Lokaler Betrieb und Zugriff vom Handy

**Behoben — ein Fehler, der nur außerhalb von localhost auftrat**
- Die Sicherheitsrichtlinie enthielt `upgrade-insecure-requests`, sobald
  `NODE_ENV` nicht auf Entwicklung stand. Wer den gebauten Stand im eigenen
  Netz startete und ihn vom Handy über `http://192.168.x.x:3000` aufrief,
  bekam eine Seite ohne Stile und ohne Funktion: Der Browser stufte jede
  Unteranfrage auf `https` hoch, der Server spricht dort aber nur `http`.
  Auf demselben Rechner unter `localhost` sah alles richtig aus — der Fehler
  war also genau dort unsichtbar, wo man ihn gesucht hätte. Die Richtlinie
  hängt jetzt an `APP_URL`, also daran, ob wirklich `https` gesprochen wird.
  Auf Vercel unverändert.
- `STATUS.md` gab neun Verlaufseinträge als „undefined" aus: Der Verlauf
  kennt zwei Formen (`event`/`detail` und `phase`/`summary`), der Erzeuger
  las nur die erste. Beide werden jetzt gelesen — ein Protokoll wird nicht
  nachträglich umgeschrieben. Die Einträge für die Phasen 16 bis 18 fehlten
  und sind ergänzt.

**Hinzugefügt**
- `npm run netz`: nennt die Adresse, unter der die Anwendung im eigenen Netz
  erreichbar ist. Rückschleife, selbstvergebene Adressen, Träger-NAT und die
  Dokumentationsbereiche aus RFC 5737 werden als nicht erreichbar
  ausgewiesen; findet sich keine brauchbare Adresse, sagt das Skript das,
  statt eine zu nennen, die dann nicht lädt. Prüft zusätzlich, ob `APP_URL`
  dazu passt.
- `npm run dev:netz` und `npm run start:netz`: lauschen auf allen
  Schnittstellen (`--hostname 0.0.0.0`) statt nur auf `127.0.0.1`.
- `docs/LOKAL-UND-HANDY.md`: Einrichten, Start, Zugriff vom Handy, und was
  an `APP_URL` hängt (E-Mail-Links, Rückleitung nach der Zahlung, das
  `secure`-Kennzeichen des Sitzungscookies).

### Phase 18 — Katalogansichten vervollständigen, Redaktionsarbeitsplatz

**Hinzugefügt — Katalog**
- Modelljahre, Sondermodelle, Lackfarben und Radvarianten an der
  Generationsseite. Datenmodell und Import standen seit Phase 16 — ein
  Import in einen Bereich, den niemand sieht, ist kein fertiger Bereich.
  Alle vier erscheinen nur, wo etwas erfasst ist.
- Sondermodelle ohne geratene Stückzahl: Wo sie nicht belegt ist, steht
  „nicht belegt" statt einer Schätzung.
- Lackfarben mit Farbcode, Art, Seltenheit und historischem Listenaufpreis
  — ausdrücklich nicht dem heutigen Wert.
- Zuverlässigkeitsnote mit ihrer Herleitung auf der Motorseite. Wo die
  Datengrundlage nicht trägt, steht der Grund statt einer Zahl.
- Merken für Motor, Fahrzeug und Katalogeinträge, mit Ansicht im Konto.
  Einträge, deren Ziel nicht mehr veröffentlicht ist, bleiben stehen und
  sagen es.

**Hinzugefügt — Datenmodell**
- `KnownIssue.resolvedFromYear` und `resolvedHowToIdentify`: ab welchem
  Baujahr der Hersteller die Ursache behoben hat und woran die reparierte
  Ausführung zu erkennen ist. Ausdrücklich **nicht** aus `yearTo`
  abgeleitet — dass eine Schwachstelle nach 2017 nicht mehr auftrat, kann
  auch heißen, dass das Modell auslief. Es ist die Frage, nach der ein
  Gebrauchtwagenkäufer sucht.

**Hinzugefügt — Verwaltung**
- Redaktionsarbeitsplatz unter `/admin/katalog`: Entwürfe prüfen, freigeben,
  zurückziehen — quer über Marken, Modelle, Generationen, Motoren,
  Antriebskombinationen und Ausstattungen. Die Quellenzahl steht bei jedem
  Eintrag, weil sie darüber entscheidet, ob er sich veröffentlichen lässt.
- Zurückziehen löscht nichts, es nimmt die Sichtbarkeit.

**Behoben**
- Die Schweregrade in `scores.ts` hießen `CRITICAL/HIGH/MEDIUM/LOW`, die
  Datenbank kennt `CRITICAL/SIGNIFICANT/MINOR`. Die Zuverlässigkeitsnote
  hätte auf echten Daten nie gerechnet.
- Das Entfernen des Demobestands kannte die in Phase 16 hinzugekommenen
  Tabellen nicht und scheiterte an einem Fremdschlüssel.
- Die Rangfolge der Verfügbarkeitsarten stand zweimal im Code — einmal in
  `core`, einmal in der Datenschicht. Wären sie auseinandergelaufen, hätte
  der Ausstattungschecker eine andere Zeile gewählt als die Anzeige.
- Drei Schreib-Endpunkte (`/api/konto/fahrzeuge`, `.../[id]`,
  `/api/konto/merkzettel`) hatten keine Aufrufbegrenzung.
- `STATUS.md` gab die Gütestufe als Datenbankbezeichner aus
  („18 UNVERIFIED"), und die Zählung ließ die neueren Tabellen aus.
- Ein dunkler Lack war als Farbfläche auf dunklem Grund unsichtbar und sah
  aus wie ein Ladefehler.
- Der Live-Test von „Passwort vergessen" schlug beim zweiten Lauf innerhalb
  einer Stunde fehl: Der Endpunkt ist auf fünf Anfragen je Stunde und
  IP-Adresse begrenzt, und alle Läufe kommen von derselben Adresse. Die
  Begrenzung bleibt unverändert — die Tests, die solche Endpunkte selbst
  prüfen, verwenden jetzt je Aufruf eine eigene Aufruferadresse
  (`tests/helpers/adresse.ts`). Ein Test, dessen Ergebnis davon abhängt,
  wann er zuletzt lief, sagt nichts über den Code aus.

**Dokumentation**
- `docs/gehirn/18-Fertigstellung.md`: Zahlung, Postweg, Bildrecht und
  Redaktionsarbeit als Gehirn-Eintrag, mit den Fehlern dieser Phasen.
- `ABSCHLUSSBERICHT.md` neu geschrieben: Stand, Zugangsdaten, die zwei
  Wege zu einer erreichbaren Adresse — und ausdrücklich, was diese
  Umgebung nicht leisten kann.

**Geprüft**
- 686 Tests grün (5 neu), Typecheck sauber, Build erfolgreich, ESLint ohne
  Warnung.
- Keine waagerechte Überbreite auf 390 px, keine Konsolenfehler.
- Antwortzeiten der Katalogseiten zwischen 5 und 65 ms.

---

### Phase 17 — Zahlungsanbieter, Bildherkunft, E-Mail, Deployment

**Hinzugefügt — Zahlungen (ADR-012)**
- Mollie als Zahlungsanbieter, gebaut gegen den offiziellen Client
  `@mollie/api-client` statt gegen eine nachgebaute REST-Schnittstelle.
- Webhook-Endpunkt `/api/zahlungen/mollie`. Mollie signiert seine
  Benachrichtigung nicht — der Adapter fragt deshalb **immer** beim Anbieter
  nach, statt dem Aufruf zu glauben.
- Konfiguration über `MOLLIE_API_KEY` und `MOLLIE_WEBHOOK_URL`. Die Form des
  Schlüssels wird beim Start geprüft; ein Echtschlüssel gegen eine
  `localhost`-Adresse wird abgelehnt.
- Ohne Schlüssel tritt weiterhin die Ersatzvariante an: nichts abgebucht,
  nichts gutgeschrieben.

**Behoben — ein Fehler, der erst mit einem echten Anbieter auffiel**
- `confirmTokenPurchase` reichte unsere eigene Vorgangskennung an
  `getPaymentStatus` durch. Der Anbieter kennt sie nicht. Mit der
  Ersatzvariante fiel das nie auf — sie antwortete ohnehin nie. Die
  Anbieterkennung wird jetzt mitgeführt, und ein Vorgang ohne sie schreibt
  nichts gut.

**Hinzugefügt — Bilder (ADR-013, ADR-014)**
- `sourceType`: Original, lizenziert oder erzeugt — mit erzwungener
  Stimmigkeit gegen die Herkunft.
- `licenceStatus` als **harte Sperre**: Nur geklärte Bilder werden
  ausgewählt, geprüft **vor** der Zuordnung. Voreinstellung ist „ungeklärt".
- Vorrangfolge Original → lizenziert → erzeugt, **vor** der
  Fundort-Rangfolge. Ein Archivbild schlägt eine erzeugte Darstellung.
- Urhebernennung wird eingefordert, wo die Lizenz sie verlangt — fehlt sie,
  steht das sichtbar am Bild.
- `baueBildAnweisung`: Anweisung für erzeugte Bilder aus **ausschliesslich
  belegten** Angaben, mit ausgewiesener Liste dessen, was das Bild
  zwangsläufig zeigt, ohne belegt zu sein. Ohne Generation und Karosserie
  gibt es keine Erzeugung.

**Hinzugefügt — Betrieb (ADR-015)**
- `vercel.json`, `docs/DEPLOYMENT.md`, `scripts/pruefe-deployment.ts`.
- CI unter `.github/workflows/pruefung.yml`: Typecheck, Lint, Tests und Build
  bei jedem Push, mit echter PostgreSQL-Instanz.
- `UnavailableImageStorage`: Auf serverlosen Umgebungen werden Bild-Uploads
  abgelehnt statt angenommen und verloren.

**Hinzugefügt — E-Mail (ADR-016, löst Blocker B8)**
- Versand über SMTP statt über ein Anbieter-SDK. Dieselben vier Werte
  funktionieren mit Postmark, Brevo, Mailgun, SES oder einem eigenen Server.
- Einmal-Token für E-Mail-Bestätigung und Passwort-Zurücksetzung. Gespeichert
  wird nur der Hash; das Verbrauchen ist ein bedingtes UPDATE, damit zwei
  gleichzeitige Klicks nicht beide gewinnen.
- Seiten `/passwort-vergessen`, `/passwort-neu`, `/email-bestaetigen`, von der
  Anmeldung aus verlinkt.
- Bestätigungsmail bei der Registrierung — außerhalb des kritischen Pfads:
  Eine fehlgeschlagene Zustellung dreht keine Registrierung zurück.
- **Die Antwort auf „Passwort vergessen" ist immer dieselbe**, ob es das
  Konto gibt oder nicht. Ein Unterschied wäre eine Auskunft darüber, wer hier
  ein Konto hat.
- TLS wird erzwungen; die Konsolenausgabe ist in Produktion gesperrt, auch
  wenn sie eingeschaltet wurde.
- Ein Zurücksetzen beendet alle bestehenden Sitzungen.

**Geprüft**
- 681 Tests grün (42 neu), Typecheck sauber, Build erfolgreich, ESLint ohne
  Warnung.
- `npm run deploy:pruefen` gegen den laufenden Build: alle Seiten erreichbar,
  geschützte Endpunkte 401, alle vier Sicherheitskopfzeilen gesetzt.

---

### Phase 16 — Datenbank-Ausbau, Bildarchitektur und Qualitätskontrolle

**Geändert (mit Datenmigration)**
- `OptionAvailability.standard` (Wahrheitswert) ersetzt durch
  `AvailabilityKind` mit fünf Werten: Serie, Sonderausstattung, nur im Paket,
  nur im Sondermodell, marktabhängig. Der Wahrheitswert kannte zwei Zustände
  und warf damit vier verschiedene Sachverhalte zusammen — genau die
  Unterscheidung, auf die es beim Gebrauchtkauf ankommt. Die Migration
  übernimmt bestehende Zeilen, ohne die feineren Fälle zu raten.
- `DataQuality` trägt jetzt die fünf Verifizierungsstufen: bestätigt,
  teilweise bestätigt, Erfahrungswert, nicht verifiziert, zur Prüfung.
  Voreinstellung ist „nicht verifiziert" — wer nichts angibt, hat nichts
  belegt.

**Hinzugefügt — Datenmodell**
- Motorfamilie (`EngineFamily`) und Motordetails je Motorcode:
  Leistungsstufe, Zylinderanordnung, Einspritzung, Ventiltrieb, Abgasnorm,
  Bauzeitraum.
- Modelljahr, Lackfarbe mit Verfügbarkeit und historischem Aufpreis,
  Radvariante, Sondermodell.
- `CatalogImage` mit Pflichtangaben zu Herkunft und merkmalsgenauer Bindung
  an Generation, Facelift-Phase, Karosserie, Ausstattungslinie, Motorvariante
  und Baujahr.
- HSN/TSN, „Mein Fahrzeug", Merkzettel für Katalogeinträge.
- `CatalogExpectation`: bekannte Gesamtzahlen mit Quellenpflicht — die
  Voraussetzung dafür, dass irgendwo überhaupt ein Prozentwert stehen darf.

**Hinzugefügt — Domänenlogik**
- Bildzuordnung: Nennen Bild und Datensatz beide einen Wert und sind die
  Werte verschieden, fällt das Bild vollständig heraus. Damit kann kein
  Facelift-Bild an einem Vor-Facelift-Fahrzeug landen. Wo nichts passt, steht
  „Kein verifiziertes Bild verfügbar."
- KI-erzeugte Bilder als letzter Ausweg zugelassen: hinter jeder Aufnahme in
  der Rangfolge, mit Modell und Anweisung im Datensatz und sichtbarer
  Kennzeichnung.
- Automatische Qualitätskontrolle gegen innere Widersprüche — Elektromotor
  mit Turbolader, Euro 6 im Baujahr 1998, Drehmoment das nicht zur Leistung
  passt, Facelift vor seiner Generation, Handelsname im Motorcodefeld. Sie
  prüft ausdrücklich **nicht**, ob ein Motorcode existiert.
- Ausstattungschecker mit drei Zuständen (vorhanden, nicht vorhanden,
  ungeprüft) und gewichtetem Prozentwert über die Aufpreisausstattung.
- Fahrzeugvergleich, der ein Merkmal nur bewertet, wenn es bei allen
  Fahrzeugen vorliegt — eine Lücke ist kein schlechterer Wert. Verbrauch wird
  bei unterschiedlichen Messzyklen gar nicht gegenübergestellt.
- Bewertungen 0–100, die `null` mit Begründung liefern, wenn die
  Datengrundlage nicht trägt.
- Vollständigkeitsrechnung, die ohne belegte Gesamtzahl **keine** Quote
  ausgibt und keine Gesamtquote über Bereiche verschiedener Größenordnung
  bildet.
- Smart-Suche, die „BMW 320d G20 190 PS 2019", „DBKA" und „S610A"
  auseinanderhält und über den Treffern erklärt, was sie verstanden hat.
- Filter nach Abgasnorm (als Präfix, damit „Euro 6" auch „Euro 6d-TEMP"
  findet) und nach Baureihenkürzel (exakt, damit „B9" nicht „B90" trifft).
- Vergleichsauswahl direkt aus der Trefferliste. Die Auswahl steht in der
  Adresse, nicht im Browserspeicher — damit funktioniert sie ohne
  JavaScript, überlebt ein Neuladen und lässt sich teilen.

**Hinzugefügt — Import**
- Import-Pipeline mit Quellenpflicht je Datei und je Datensatz,
  Dublettenerkennung, Qualitätskontrolle und Bericht. Der Probelauf ist die
  Voreinstellung. Ein Datensatz mit Befund wird abgelehnt oder auf „zur
  Prüfung" gesetzt, nie stillschweigend übernommen.
- `scripts/import-katalog.ts`, `scripts/datenbestand.ts`, Format und
  Prüfbeispiel in `docs/import/`.

**Hinzugefügt — Oberfläche**
- Datenbestandsseite: erfasste Anzahlen, Güteverteilung, Einträge ohne Quelle
  — ohne beschönigende Fortschrittsbalken.
- Fahrzeugvergleich, Ausstattungschecker, HSN/TSN-Suche, „Meine Fahrzeuge".
- Verwaltung: Datenqualität mit Review-Liste, Dubletten und überfälligen
  Prüfungen.
- Gütekennzeichen an einzelnen Angaben statt in einer Fußnote.

**Behoben**
- **Auf dem Handy gab es keine Hauptnavigation.** Sie war unterhalb der
  mittleren Breite ausgeblendet, ohne Ersatz — außer dem Logo führte kein Weg
  in den Katalog.
- Die Schaltfläche „Konto erstellen" schob sich auf schmalen Geräten über den
  Menüknopf und machte ihn unerreichbar. Das Ausblenden per
  `hidden sm:inline-flex` griff nicht, weil beides Anzeigeklassen sind und im
  Stylesheet `inline-flex` gewinnt.
- Die Suche hielt gewöhnliche Wörter wie „kombi" für Motorcodes und schrieb
  „Verstanden als: Motorcode KOMBI" über die Treffer.
- „190 PS" zerfiel in die Zahl und das Wort, beide einzeln wertlos.
- Die Zeitraumprüfung setzte im Import-Probelauf still aus, weil die
  übergeordnete Generation noch nicht in der Datenbank stand.
- Die Startseite zeigte weiterhin einen Bauplan („Phase 2–6", „Phase 10"),
  obwohl alles davon steht.

**Geprüft**
- 639 Tests grün (63 neu), Typecheck und Build sauber, ESLint ohne Warnung.
- Neue Endpunkte ohne Anmeldung: durchgehend 401. Fremdes Fahrzeug: 404, nicht
  403.
- Alle Seiten auf 1440 × 900 und 390 × 844 aufgenommen, keine Konsolenfehler.

---

### Phase 15 — Finaler Produktions-Audit (abgeschlossen)

**Hinzugefügt**
- `PRODUCTION_READINESS.md`: acht Audits (Design, UX, Performance, Security,
  Automotive, Plattform, SEO, Testing), elf Befunde, eine empfohlene
  Reihenfolge und eine Abgrenzung, was diese Bewertung nicht ist.

**Das Ergebnis**
- Die Plattform ist **technisch lauffähig und in sich schlüssig**, aber
  **nicht produktionsbereit**. Es fehlen vier Dinge, die sich nicht mit Code
  lösen lassen: Katalogdaten, ein Zahlungsanbieter, ein E-Mail-Versandweg und
  eine Marktdatenquelle.
- Ausdrücklich nicht behauptet wird, dass die Anwendung rechtlichen oder
  steuerlichen Anforderungen genügt. Sie ist so gebaut, dass sie sich daran
  anpassen lässt.

**In dieser Phase behoben**
- **Obergrenzen** für die dreizehn Abfragen, die mit dem Katalog wachsen.
  Heute wäre das kein Fehler gewesen — bei zehntausend Einträgen wäre es
  einer.
- **Der Moderationsgrund wird angezeigt**, nicht nur gespeichert. Eine
  entfernte Nachricht ohne Erklärung lässt beide Seiten raten.
- **Stille Überspringzweige in Tests.** Vier ältere Live-Tests meldeten sich
  als bestanden, ohne etwas geprüft zu haben, wenn Daten fehlten. Zwei legen
  ihre Daten jetzt selbst an und laufen wirklich; zwei melden sich ehrlich
  als übersprungen. Übersprungen ist ehrlich, grün ohne Prüfung ist es nicht.

**Messwerte**
- Antwortzeiten lokal 5–25 ms, gemeinsames JavaScript 103 kB, 71 Indizes,
  34.700 Zeilen TypeScript davon 9.200 Zeilen Tests.
- Kontraste: Fließtext 17,6:1, gedämpfter Text 9,2:1, feiner Text 5,7:1.
- 548 Tests: 546 bestanden, 2 ausdrücklich übersprungen.

### Phase 14 — Kompletter Systemtest (abgeschlossen)

**Hinzugefügt**
- Ein Ende-zu-Ende-Test quer durch alle Rollen: Redaktion legt einen Katalog
  an, eine verkaufende Person macht daraus eine Anzeige mit Bild, eine
  kaufende Person findet sie, merkt sie sich und schreibt an, die Verwaltung
  moderiert und stellt zurück, am Ende werden die Zahlen nachgerechnet.
  Dazwischen wird geprüft, was **nicht** geht.
- Eine Sammelprüfung auf Fremdzugriff über alle Rollen: fremder Entwurf,
  fremde Anzeige, fremdes Gespräch, Händlerprofil ohne Betrieb,
  Benutzerliste und Moderation ohne Recht. Jede Zeile muss 403 oder 404
  ergeben — niemals 200.
- Zehn Sicherheitsproben: SQL-Fragmente in Suchparametern, Skript in einer
  Nutzereingabe, Cookie-Merkmale, Massenzuweisung, zu großer Körper,
  gefälschte Sitzungscookies, Fehlermeldungen ohne Interna, wirksame
  Ratenbegrenzung, festgesetzter Medientyp, Clickjacking.
- 20 neue Tests (548 insgesamt).

**Ergebnis**
- Alle Tests grün. Der Browserdurchlauf über sämtliche öffentlichen Seiten,
  alle Kontobereiche, den Verkaufsentwurf und den Adminbereich ergab keine
  Konsolenfehler und keine unerwarteten Statuscodes.
- **In dieser Phase wurden keine neuen Fehler gefunden.** Das ist kein Beweis
  für Fehlerfreiheit, sondern die Auskunft, dass diese Prüfungen nichts
  zutage gefördert haben.

### Phase 13 — Adminbereich und Moderation (abgeschlossen)

**Hinzugefügt**
- Übersicht mit Plattformzahlen und sicherheitsrelevanten Ereignissen der
  letzten sieben Tage.
- Benutzerverwaltung mit Suche, Rollenfilter, Rollenvergabe und Kontosperre.
- Anzeigenmoderation und Nachrichtenmoderation.
- Protokollseite mit Filter nach Ereignisart.
- 26 neue Tests (528 insgesamt).

**Was ein Administrator nicht darf**
- **Nicht die eigene Rolle ändern.** Sich selbst zu erhöhen wäre die
  naheliegendste Rechteausweitung überhaupt.
- **Nicht die letzte oberste Administration abgeben.** Danach könnte niemand
  mehr Rollen vergeben, auch nicht zurück.
- **Keine Händlerrollen vergeben.** Sie hängen an einem Betrieb und werden
  dort verwaltet; ohne Betrieb wären sie ein Zustand, den keine Prüfung
  erwartet.
- **Nicht das eigene Konto sperren**, und eine gewöhnliche Administration
  sperrt keine oberste — sonst wäre die Sperrfunktion ein Weg, die Aufsicht
  loszuwerden.

**Sicherheit**
- Der Adminbereich antwortet Unbefugten mit **404**, nicht mit 403. Dass es
  ihn gibt, muss niemand erfahren, der ihn nicht betreten darf.
- Eine Kontosperre **beendet die Sitzungen** der Person. Ohne das bliebe sie
  wirkungslos, bis die Sitzung von selbst abläuft — bei einer Woche Laufzeit
  also lange.
- Jede Maßnahme verlangt eine Begründung von mindestens zehn Zeichen. Sie
  geht ins Protokoll und ist später die einzige Erklärung dafür. Die
  Oberfläche fragt sie vor der Maßnahme ab, nicht danach.

**Moderation**
- Eine Maßnahme entzieht die Sichtbarkeit, sie löscht nicht: Die Anzeige geht
  auf „Pausiert" und gehört weiterhin der einstellenden Person; eine
  Nachricht wird als entfernt markiert und bleibt für die Moderation lesbar.
  Dieselbe Maßnahme stellt zurück.
- Im Gesprächsverlauf steht an ihrer Stelle ein Hinweis, kein Loch.

**Protokoll**
- Es wird gezeigt, nicht bearbeitet — keine Schaltfläche ändert oder löscht
  einen Eintrag. Ein Protokoll, das sich ändern lässt, ist keins.
- Die Übersicht zeigt ausgewählte Ereignisse statt aller: Eine Liste, in der
  jeder Katalogeintrag steht, liest niemand — und dann fällt auch das
  Wesentliche nicht auf.

### Phase 12 — Nachrichten und Benachrichtigungen (abgeschlossen)

Vollständig plattformintern — kein Matrix Synapse (Vorgabe C2).

**Hinzugefügt**
- Gespräche zu Anzeigen: „Anbieter anschreiben" auf jeder Anzeige, Übersicht
  und Verlauf unter `/konto/nachrichten`.
- Gelesen/ungelesen mit Zeitpunkt, Fahrzeugbezug, Schließen und Wiederöffnen.
- Benachrichtigungen als eigene Tabelle, mit Zähler.
- Bildanhänge, höchstens fünf je Nachricht.
- 31 neue Tests (502 insgesamt).

**Sicherheit**
- **Wer nicht beteiligt ist, bekommt „nicht gefunden", nicht „verboten".** Ein
  403 bestätigte, dass es dieses Gespräch gibt. Geprüft wird doppelt: in der
  Domänenschicht und in jeder `WHERE`-Bedingung. Ein Test lässt eine
  unbeteiligte Person lesen und schreiben — beides 404.
- **Der Nachrichtentext steht nicht in der Benachrichtigung.** Sie erscheint
  an Stellen, an denen jemand mitliest, und sagt, *dass* etwas da ist, nicht
  *was*.
- Zeichen zur Steuerung der Leserichtung und unsichtbare Trenner werden
  entfernt. Mit ihnen lässt sich Text verkehrt herum anzeigen oder ein Wort
  mitten im Wort trennen, um Wortsuchen zu umgehen — beides getestet.
- Je Anzeige und anfragender Person genau ein Gespräch. Ohne diese Bedingung
  ließe sich derselbe Posteingang fluten.
- Zwei Zähler zusätzlich zur Ratenbegrenzung: zehn neue Gespräche und sechzig
  Nachrichten je Stunde.
- **Anhänge sind Bilder, und nur neu kodierte** — derselbe Weg wie bei
  Anzeigenbildern. Beliebige Dateien in einem Posteingang wären ein
  Verteilweg für Schadsoftware, und ein Posteingang ist genau die Stelle, an
  der Leute anklicken, was ihnen jemand schickt.

**Betrugsmuster warnen, sie sperren nicht (ADR-011)**
- Erkannt werden vier Muster: Vorkasse und Treuhanddienste, Wechsel auf einen
  anderen Messenger, Spedition und Abholdienste, Zeitdruck.
- Die Nachricht kommt trotzdem an. Darüber steht ein Hinweis mit dem Satz,
  dass es Anhaltspunkte sind und keine Beweise. Ein Filter, der harmlose
  Nachrichten verschluckt, ist schlimmer als ein Hinweis, den jemand
  ignoriert — der Verlust wäre unsichtbar.
- Ein Test prüft ausdrücklich, dass gewöhnliche Fragen nicht anschlagen.

### Phase 11 — Billing und Rechnungen (abgeschlossen)

**Hinzugefügt**
- Providerunabhängige Zahlungsschnittstelle mit genau den fünf Methoden aus
  dem Plan: `createCheckout`, `verifyPayment`, `handleWebhook`,
  `refundPayment`, `getPaymentStatus`.
- Tokenpakete auf der Guthabenseite, mit Netto, Steuer und Brutto.
- Rechnungen unter `/konto/rechnungen` mit Nummer, Datum, Empfänger,
  Positionen, Netto, Steuer, Brutto, Zahlungsstand und Zahlungsreferenz.
- 36 neue Tests (471 insgesamt).

**Kein nachgebauter Zahlungsanbieter (ADR-010)**
- Es gibt keinen Adapter für einen echten Anbieter und keine Attrappe, die
  Zahlungen durchlaufen lässt. Einen Anbieter nachzubauen, ohne dass einer
  feststeht, hieße dessen Schnittstelle zu erfinden; eine Attrappe schriebe
  Guthaben gut, für das niemand gezahlt hat.
- Ein Kauf endet mit 501, einer Meldung, die den Grund nennt — und **ohne
  Vorgang in der Datenbank**. Ein Test prüft, dass die Zahl der Vorgänge
  unverändert bleibt.
- Vorhandenes Guthaben funktioniert unverändert; das steht auf der Seite,
  bevor jemand klickt, und die Schaltflächen sind gesperrt.

**Sicherheit**
- **Der Rückleitung vom Anbieter wird nicht geglaubt.** Sie kommt vom Gerät
  der zahlenden Person; der Zustand kommt aus einer Nachfrage beim Anbieter.
- Ein gezahlter Betrag unter dem erwarteten wird nicht gutgeschrieben — sonst
  ließe sich mit einem manipulierten Anbietervorgang billiger einkaufen.
- Gutgeschrieben wird genau einmal: Das bedingte `UPDATE` gibt zurück, ob es
  der erste war. Eine zweite Rückmeldung ändert nichts und sagt das auch.
- Die Bestätigungsroute prüft den Besitz des Vorgangs — sonst ließe sich mit
  einer fremden Kennung deren Zustand abfragen.
- Eine fremde Rechnung ist „nicht gefunden", nicht „verboten". Bei
  fortlaufenden Nummern wäre ein 403 besonders bequem zum Aufzählen.

**Rechnungsnummern**
- Atomar vergeben (`upsert` + `increment` in derselben Transaktion). Ein
  Lesen-Rechnen-Schreiben vergäbe unter Last dieselbe Nummer zweimal. Ein
  Test legt acht Rechnungen gleichzeitig an und prüft acht lückenlos
  aufsteigende Nummern.
- Ein Überlauf über 99.999 im Jahr wird gemeldet, statt still abzuschneiden —
  abgeschnitten ergäbe er doppelte Nummern.
- Gelöscht wird nie: Eine Rechnung wird storniert, mit Pflichtbegründung. Die
  Zeile bleibt, sonst bekäme die Nummernfolge Lücken.

**Beträge und Steuer**
- Gerechnet wird in ganzen Cent, gerundet vom Nullpunkt weg. Die Steuer geht
  auf die Summe, nicht je Position — wer beides mischt, bekommt Rechnungen,
  deren Summe nicht aufgeht.
- Der Steuersatz ist eine Einstellung, keine Konstante, und wird mit jeder
  Rechnung gespeichert: Eine spätere Änderung verändert ausgestellte
  Rechnungen nicht. Auch die Preise stehen als Netto — ein Bruttopreis ließe
  sich bei geändertem Satz nicht sauber zerlegen.
- Ob eine Rechnung allen steuerlichen Anforderungen genügt, sagt diese
  Anwendung nicht. Das steht so auch auf der Rechnungsseite.

### Phase 10 — Händlerbereich und Händlertools (abgeschlossen)

**Hinzugefügt**
- Händlerbereich unter `/haendler` mit Übersicht, Fahrzeugbestand, Profil und
  Mitarbeiterverwaltung.
- Händlerprofil: Logo, Kurzbeschreibung, Kontakt, vollständige Anschrift,
  USt-IdNr. und Öffnungszeiten.
- Öffentliches Händlerprofil unter `/autohaus/<name>` mit Öffnungszeiten,
  Anbieterkennzeichnung und den eigenen Angeboten.
- Beim Anlegen einer Anzeige lässt sich wählen, ob im Namen des Betriebs
  inseriert wird; die Anzeige verweist dann auf das Händlerprofil.
- Auswertungen zu Bestand, Standzeit, Aufrufen, erzeugten Texten,
  Bewertungen und Tokenverbrauch.
- 32 neue Tests (435 insgesamt).

**Kennzahlen ohne Messung erscheinen nicht als Null (ADR-009)**
- „Anfragen: 0" läse sich als Messung — tatsächlich gibt es die
  plattforminternen Nachrichten noch gar nicht. Stattdessen steht dort ein
  Strich und der Grund. Ein Test hält das fest.
- Die Standzeit wird als Median ausgewiesen, nicht als Mittelwert: Ein
  Fahrzeug, das zwei Jahre steht, verschöbe einen Mittelwert so weit, dass die
  Zahl nichts mehr über den Normalfall sagt.
- Der Tokenverbrauch ist als Näherung gekennzeichnet und erklärt: Guthaben
  hängt am Konto der Person, nicht am Betrieb.

**Sicherheit**
- **Die Händlerkennung kommt aus der Sitzung, nie aus der Anfrage.** Keine
  Route nimmt sie entgegen. Ein Test lässt den Inhaber von Betrieb B die
  Rolle eines Mitarbeiters aus Betrieb A ändern — Antwort 404, Rolle
  unverändert.
- Ein Mitarbeiter bekommt die Mitarbeiterliste gar nicht erst geliefert, weder
  über die Seite noch über die Schnittstelle.
- Der letzte Inhaber lässt sich nicht herabstufen oder entfernen; die eigene
  Rolle auch nicht. Beides sperrte einen Betrieb sonst dauerhaft aus.
- Aufgenommen werden nur Personen, die sich selbst registriert haben. Konten
  für andere anzulegen ist nicht vorgesehen — sonst entstünden Konten mit
  fremden E-Mail-Adressen, von denen die Betroffenen nichts wüssten.
- Öffentlich sichtbar sind nur freigeschaltete Betriebe.

**Behoben**
- Das Händlerlogo hatte einen festen Ablageschlüssel. Bilder werden mit
  `immutable` und einem Jahr Gültigkeit ausgeliefert — ein ausgetauschtes Logo
  wäre in Browser-Zwischenspeichern stehen geblieben. Jeder Upload bekommt
  jetzt einen eigenen Schlüssel.

### Phase 9 — Automarktplatz und Fahrzeuganzeigen (abgeschlossen)

**Hinzugefügt**
- Öffentlicher Marktplatz mit Filtern (Preis, Kilometer, Baujahr,
  Unfallfreiheit), Sortierung und Seitenweise.
- Anzeigenseite mit Galerie, allen Angaben und Merken-Schaltfläche.
- Anzeige aufgeben als Schritt 6 im Verkaufsentwurf.
- „Meine Anzeigen" im Konto: veröffentlichen, pausieren, als verkauft
  markieren, löschen — mit Aufrufzahl und Laufzeit.
- Bilder hochladen, sortieren und entfernen; das erste ist das Vorschaubild.
- Merkliste, die verkaufte und abgelaufene Anzeigen weiter anzeigt und
  kennzeichnet, statt sie stillschweigend zu verschlucken.
- Sitemap und `robots.txt`; strukturierte Daten nach schema.org auf jeder
  Anzeige.
- 53 neue Tests (403 insgesamt).

**Die beiden Entscheidungen**
- **Eine Anzeige kopiert den Entwurf (ADR-007).** Sie liest nichts nach. Eine
  veröffentlichte Anzeige ist ein Angebot; sie darf sich nicht ändern, nur
  weil jemand am Entwurf weiterarbeitet. Ein Test ändert den Entwurf nach dem
  Anlegen auf 250.000 km — die Anzeige steht weiterhin auf 88.000.
- **Bilder werden neu geschrieben, nicht übernommen (ADR-008).** Fahrzeugfotos
  entstehen meist dort, wo das Fahrzeug steht: vor der Wohnung. Der
  Aufnahmeort steht in den EXIF-Daten, und das Bild geht an jeden, der die
  Anzeige aufruft. Jedes hochgeladene Bild wird deshalb dekodiert und als WebP
  neu geschrieben.

**Sicherheit**
- Der gemeldete Medientyp wird nicht entgegengenommen. Geprüft wird der
  Dateianfang: JPEG, PNG oder WebP — sonst 415. Ein Test lädt ein Shell-Skript
  als `harmlos.jpg` mit `Content-Type: image/jpeg` hoch und erwartet 415.
- Pixelgrenze und Größengrenze beim Dekodieren, keine Animationen: Sonst wäre
  eine kleine Datei mit riesigen angekündigten Maßen der günstigste Angriff.
- Der Ablageschlüssel wird selbst vergeben; der Dateiname der hochladenden
  Person geht nirgends ein.
- `sellerId` steht in jeder schreibenden WHERE-Bedingung. Fremde Anzeigen
  antworten mit 404, nicht 403.
- Gemerkt werden können nur sichtbare Anzeigen — sonst ließe sich über das
  Merken prüfen, ob eine Kennung existiert.
- Der Standort einer Anzeige ist Postleitzahl und Ort. Straße und Hausnummer
  werden nicht erfasst.

**Behoben**
- **Ein leeres Filterfeld brach die ganze Suche.** Ein GET-Formular sendet alle
  Felder, auch die leeren (`?q=&preisVon=5000&preisBis=`). Die Prüfung
  scheiterte an `preisBis: ""` — und damit für die gesamte Anfrage; der eine
  gesetzte Filter ging mit unter. In der Oberfläche sah das aus wie „Filter
  ignoriert", an der Schnittstelle war es ein Fehler 400. Gefunden hat es der
  Blick auf die Adresszeile im Browserdurchlauf, nicht ein Test.

### Phase 8 — Fahrzeugbewertung und Wiederverkaufswert (abgeschlossen)

**Hinzugefügt**
- Bewertung als Schritt 4 im Verkaufsentwurf, dazu eine öffentliche
  Einstiegsseite unter `/bewertung`, die vor dem ersten Klick sagt, was
  herauskommt und was nicht.
- **Faktorenanalyse** aus den eigenen Angaben: Kilometerstand gegen Alter,
  Zustand, Servicehistorie, Vorbesitzer, HU, Schäden, Unfallschaden. Jeder
  Faktor mit Richtung, Gewicht und einer Begründung in ganzen Sätzen.
- Werttreiber und wertmindernde Faktoren getrennt ausgewiesen, absteigend
  nach Gewicht.
- Marktwert, empfohlener Inseratspreis und realistische Spanne — sobald
  Vergleichsangebote vorliegen.
- Bezahlte Bewertungen werden gespeichert und lassen sich wiedersehen, ohne
  erneut zu zahlen.
- 35 neue Tests (350 insgesamt).

**Die zentrale Entscheidung (ADR-006)**
- **Ohne Marktdaten kein Marktwert.** Liegt kein Grundwert aus tatsächlichen
  Vergleichsangeboten vor, sind Marktwert, Inseratspreis und Spanne `null` —
  nicht 0, nicht geschätzt, nicht „ungefähr". Ein Betrag mit dem Zusatz „grobe
  Schätzung" wäre die schlechtere Lösung: Gelesen wird die Zahl, nicht der
  Zusatz.
- **Es wird dann auch nichts abgebucht.** Die Verfügbarkeitsprüfung steht vor
  der Guthabenreservierung.
- Die Faktorenanalyse gibt es trotzdem — sie rechnet nur mit den Angaben der
  verkaufenden Person und ist auch ohne Bezugspunkt brauchbar.

**Ehrlichkeit als Bauteil**
- Alle Rechengrößen stehen als **benannte Annahmen** an einer Stelle, tragen
  eine Versionskennung und werden bei jedem Ergebnis mit ausgegeben, samt dem
  Satz, dass es Annahmen sind und keine gemessenen Marktwerte.
- Angebotspreise und erzielte Preise werden unterschieden. Bei Angebotspreisen
  wird ein Abschlag gerechnet — und gesagt, dass es ihn gibt.
- „Keine Angabe" ist kein „unfallfrei": Eine fehlende Unfallangabe ergibt
  weder Zu- noch Abschlag. Fehlende Angaben werden benannt statt geschätzt.
- Die Summe der Faktoren ist begrenzt; dass die Grenze gegriffen hat, steht in
  der Begründung.

**Blocker**
- B4 (Marktdatenquelle) ist nicht mehr blockierend. Was eine Quelle mitbringen
  muss, steht im Typ `MarketBasis`: Stichprobengröße, Beobachtungszeitraum,
  Quellenbezeichnung und die Unterscheidung Angebots- / erzielter Preis. Zum
  Anschluss wird eine Zeile in der Verdrahtung ausgetauscht.

### Phase 7 — KI-Verkaufsassistent und VIN-Analyse (abgeschlossen)

**Hinzugefügt**
- Verkaufsentwurf in vier Schritten: VIN prüfen → Fahrzeug bestätigen →
  Angaben machen → Texte erzeugen.
- VIN-Auswertung nach ISO 3779/3780. Ausgegeben wird nur, was in der VIN
  wirklich steht: Herstellerkennung, Modelljahr**hinweis** (immer zwei
  Kandidaten, außerhalb Nordamerikas nicht verbindlich) und Werkscode.
- Fahrzeugbestätigung aus **real veröffentlichten** Katalogeinträgen. Gibt
  der Katalog zum Hersteller noch nichts her, sagt die Seite genau das.
- Angabenformular: Kilometer, Vorbesitzer, Erstzulassung, HU, Zustand,
  Servicehistorie, Reifen, Schäden, Unfallschaden, Hinweise — alles
  freiwillig. Was leer bleibt, taucht in der Anzeige nicht auf.
- Vier von der KI geschriebene Texte: Verkaufstitel, Kurzbeschreibung,
  ausführlicher Verkäufertext, Kleinanzeigen-Fassung.
- **Technische Daten und Ausstattung schreibt die KI nicht.** Beide Blöcke
  kommen unverändert aus dem bestätigten Katalogeintrag. Ein Sprachmodell,
  das technische Daten formuliert, kann sie auch erfinden — und eine
  erfundene Anhängelast stünde danach in einer Verkaufsanzeige.
- Anbindung an Claude (`claude-opus-5`, strukturierte Ausgabe). Ohne
  eingerichteten Zugang bleibt die Plattform vollständig nutzbar; Schritt 4
  erklärt dann, was fehlt.
- 48 neue Tests (315 insgesamt), darunter ein Browserdurchlauf des gesamten
  Verkaufswegs und ein Test, der sich seinen Katalog selbst anlegt statt
  vorhandene Daten vorauszusetzen.

**Gelöst**
- **Blocker B7** (VIN-Auflösung über WMI hinaus nicht belegbar) — nicht durch
  eine Datenquelle, sondern durch den Ablauf: Die VIN schlägt vor, der
  Verkäufer bestätigt. `generateListingTexts` verweigert den Dienst ohne
  bestätigte Zuordnung; die KI kann kein geratenes Fahrzeug beschreiben,
  weil sie nie eines bekommt.

**Sicherheit**
- **Feld-Guard als Typ, nicht als Prompt-Bitte.** `AiListingContext` *ist* die
  Whitelist; sie ist die einzige Form, in der Daten das Modell erreichen. Zwei
  Tests serialisieren den fertigen Kontext und suchen darin nach der VIN und
  nach dem Motorcode.
- Fremde Entwürfe werden als *nicht gefunden* gemeldet, nicht als *verboten* —
  sonst bestätigte die Antwort, dass die Kennung existiert.
- Guthabenprüfung und Verfügbarkeitsprüfung laufen **vor** der Reservierung,
  die Ausgabeprüfung **innerhalb** der Buchung: Ein gescheiterter oder
  unbrauchbarer Aufruf kostet nichts.

**Behoben**
- **Passwort in der Adresszeile.** Vor der Hydration war der Absende-Handler
  noch nicht aktiv und die Formulare hatten keine `method` — der Browser
  sendete nativ per `GET` und schrieb E-Mail *und Passwort* in die URL, damit
  in Verlauf, Zugriffsprotokolle und `Referer`. Behoben in allen drei
  Formularen durch `method="post"` und eine Sperre bis zur Hydration. Der
  Browsertest prüft seither jede besuchte URL auf Passwort und VIN.
- **Verweise ins Leere.** Die Kontonavigation verlinkte „Meine Anzeigen" und
  „Nachrichten"; beide Bereiche kommen erst in Phase 9 und 12. Next.js lädt
  verlinkte Routen vor, die 404 entstand also schon beim Betreten der Seite.
  Solche Punkte werden jetzt ausgegraut und ohne Link dargestellt, und ein
  neuer Test läuft alle festen Verweise der Hauptseiten ab.
- Ersatzwerte entfernt, die stille Datenfehler geworden wären: Die
  Verkaufsrouten nehmen die Benutzerkennung jetzt über `context.userId()`,
  das wirft, statt auf `''` auszuweichen; ohne Hash-Geheimnis wird `null` als
  VIN-Hash gespeichert statt eines für alle Entwürfe gleichen Leerstrings.
- Die Live-Tests sperrten sich gegenseitig aus: Die Anmeldung ist bewusst auf
  zehn Versuche je fünf Minuten und IP begrenzt, und alle Tests kommen von
  derselben Adresse. Sie legen ihre Sitzung jetzt direkt an
  (`tests/helpers/session.ts`); die Anmeldung selbst prüft eine eigene, kleine
  Testdatei. Die Begrenzung in der Anwendung bleibt unverändert.
- `/api/auth/me` antwortet ohne Sitzung mit `user: null` statt mit 401. Die
  Kopfzeile stellt diese Frage auf jeder öffentlichen Seite; der 401 war kein
  Schutz, sondern ein Dauerfehler in der Browserkonsole, in dem echte Fehler
  untergingen. Der Schutztest zeigt jetzt auf `/api/guthaben`.

### Phase 11a vorgezogen — Token-Guthaben

Aus Phase 11 vorgezogen, weil Phase 7 verlangt: „keine KI-Ausführung ohne
ausreichendes Guthaben". Ohne Wallet wäre diese Regel nicht umsetzbar gewesen.

**Hinzugefügt**
- Guthabenkonto mit Stand und reserviertem Anteil, sechs Transaktionsarten,
  Buchungshistorie mit Stand nach jeder Buchung.
- **Verfahren: reservieren, ausführen, buchen.** Ein gescheiterter Aufruf
  kostet nichts, ein erfolgreicher wird genau einmal berechnet.
- Reservierungen laufen nach 15 Minuten ab; der Worker gibt sie frei.
- Guthabenseite unter `/konto/guthaben` mit Stand, Preisliste und Historie.
- Guthabenkorrektur durch die Administration — mit Pflichtbegründung im
  Audit-Log.
- 30 neue Tests, darunter 15 gegen eine echte Datenbank.

**Sicherheit**
- Gleichzeitigkeit über **bedingte UPDATEs** gelöst statt über
  Lesen-Prüfen-Schreiben. Getestet: Bei Guthaben 75 und sieben gleichzeitigen
  Reservierungen über je 20 gelingen genau drei. Mit einem
  Lesen-Prüfen-Schreiben gingen alle sieben durch.
- Doppelbuchungen durch eindeutige Vorgangskennung ausgeschlossen — ein
  wiederholter Aufruf gibt die erste Buchung zurück, statt erneut zu belasten.
- **CHECK-Bedingungen in der Datenbank** als letzte Verteidigungslinie:
  kein negatives Guthaben, nie mehr reserviert als vorhanden. Zwei Tests
  versuchen ausdrücklich, sie zu verletzen.

**Offen**
- Aufladen ist nicht möglich (Blocker B5, kein Zahlungsweg festgelegt). Die
  Abrechnung funktioniert bereits; nur der Weg, Guthaben zu erwerben, fehlt.

### Phase 6 — Ausstattungsvarianten und Sonderausstattung (abgeschlossen)

**Hinzugefügt**
- **Verfügbarkeitsmatrix** über Baujahr, Ausstattungslinie, Motorvariante und
  Paket. Eine Sonderausstattung kann serienmäßig, gegen Aufpreis oder nur im
  Paket zu haben sein — je nach Kombination verschieden.
- Ausstattungspakete mit Positionen, wahlweise Bestandteile inbegriffen.
- Seltenheit, Kaufrelevanz und Wiederverkaufsrelevanz — jeweils mit eigenem
  Belegmodell, bei dem `SPECIFICATION` **nicht wählbar** ist. Bestellquoten
  stehen in keinem Datenblatt.
- Ausstattungsseite je Generation: Linien, Pakete und Sonderausstattung nach
  Kategorie, jeweils mit Verfügbarkeit und Erkennungsmerkmal.
- `npm run db:migrate:create` — erzeugt Migrationen ohne Rückfrage.
  `prisma migrate dev` bricht in einer Umgebung ohne Eingabe ab, sobald eine
  Änderung bestätigt werden müsste.
- 13 neue Tests.

**Geändert**
- Serienmäßig **und** nur über ein Aufpreispaket erhältlich wird als
  Widerspruch abgelehnt. Der Fehler entsteht leicht beim Abtippen einer
  Preisliste.

**Bekannte Grenze, bewusst abgesichert**
- Die Eindeutigkeitsbedingung der Verfügbarkeit greift in PostgreSQL nicht,
  wenn die unterscheidenden Spalten `NULL` sind — dort gilt `NULL` als von
  allem verschieden. Der Duplikatschutz steht deshalb zusätzlich in der
  Anwendung. Ein Test hält genau diesen Fall fest.

### Phase 5 — Motorvarianten und technische Daten (abgeschlossen)

**Hinzugefügt**
- Technische Felder: Abgasnorm, Sitzplätze, Türen, Zuladung, Anhängelast
  (gebremst und ungebremst getrennt), elektrische Reichweite.
- **Belegpflicht je Wert.** Eine Quelle kann benennen, welche Werte sie deckt.
  Ein Datenblatt belegt die Leistung, sagt aber nichts über die Anhängelast.
  Ohne Angabe deckt eine Quelle weiterhin den ganzen Eintrag.
- Eigene Seite je Motorvariante: Antrieb, Fahrleistungen, Verbrauch und Abgas,
  Alltag und Zuladung — mit erklärten Fachbegriffen, ausgewiesenen Lücken und
  Abrufdatum je Quelle.
- Suchtreffer und die Motortabelle der Generationsseite führen jetzt auf die
  Variantenseite.
- 11 neue Tests.

**Geändert**
- Vertauschte Anhängelasten werden abgelehnt: Die gebremste ist nie kleiner
  als die ungebremste. Ist sie es doch, wurden die Felder vertauscht — und das
  ist im Betrieb gefährlich, nicht nur unschön.

### Phase 4 — Fahrzeugsuche (abgeschlossen)

**Hinzugefügt**
- Suche auf Ebene der **Motorvariante** statt der Generation — die geforderten
  Filter (Motor, Leistung, Kraftstoff, Getriebe, Antrieb) unterscheiden genau
  dort.
- Filter ohne JavaScript: Jeder Filter ist ein Link, jedes Ergebnis eine
  teilbare Adresse. Mehrfachauswahl kommagetrennt, weil ein Link einen
  Parameter nicht mehrfach setzen kann.
- Auswahl mit Trefferzahl je Kraftstoffart, gezählt ohne den eigenen Filter.
- Sieben Sortierungen, jeweils mit `nulls last` — ein fehlender Wert darf
  nicht als bester Wert erscheinen.
- Seitenweise Navigation; ein Filterwechsel führt immer auf Seite 1 zurück.
- Ähnliche Fahrzeuge auf der Generationsseite: vergleichbare Leistung, gleiche
  Karosserieform, anderes Modell.
- Fünf Indizes auf der Antriebskombination, jeweils mit `status` an erster
  Stelle.
- 25 neue Tests.

**Behoben**
- **Die Baujahrfilter verwarfen jede Eingabe.** Sie erwarteten eine Zahl, aus
  der Adresszeile kommt aber immer eine Zeichenkette — die Prüfung scheiterte
  still, und die Suche fiel unbemerkt auf „ungefiltert" zurück. An der
  Trefferliste war das nicht zu erkennen; zwei Tests waren aus dem falschen
  Grund grün.

**Bewusst nicht umgesetzt**
- Filter nach **Preis, Kilometerstand und Standort**. Diese Angaben gehören zu
  einer Anzeige, nicht zu einem Katalogeintrag — es gibt sie erst mit dem
  Marktplatz in Phase 9. Sie jetzt anzubieten hieße, eine Filterung
  vorzutäuschen, die nichts filtern kann.
- Filter nach Ausstattungslinie und Sonderausstattung — folgen mit Phase 6.

### Phase 3 — Fahrzeug-Wissensdatenbank (abgeschlossen)

**Hinzugefügt**
- Vier Wissenstabellen: Schwachstellen, Wartung, Kosten, Fließtext-Notizen zu
  elf Themen. Jede hängt an einer Generation, wahlweise enger an einer
  Antriebskombination.
- **Drei erzwungene Belegmodelle.** Eine belegte Angabe braucht eine
  belastbare Quellenart — eine Pressemitteilung genügt ausdrücklich nicht.
  Eine Einschätzung braucht eine Begründung und gilt nie als „gut belegt".
  Eine Marktbeobachtung braucht Datengrundlage und Stichtag und veraltet nach
  zwei Jahren sichtbar.
- Katalogseiten: Hersteller, Modelle, Generationen und eine ausführliche
  Generationsseite mit technischen Daten, Motorvarianten, Ausstattungslinien,
  Schwachstellen, Wartung, Kosten, Einordnung und Quellen.
- Glossar mit 14 Fachbegriffen in Alltagssprache, in der Oberfläche direkt an
  den Begriffen eingebunden.
- `npm run db:seed:demo` legt einen ausdrücklich als frei erfunden
  gekennzeichneten Demobestand an.
- 28 neue Tests, darunter neun, die die Belegpflicht über die
  HTTP-Schnittstelle durchspielen.

**Behoben**
- **Die Gütedeckelung war implementiert, aber nicht angewandt.** An einer drei
  Jahre alten Marktbeobachtung stand „gut belegt" — direkt neben „überholt".
  Die Rechnung sitzt jetzt in der Anzeigekomponente, wo sie nicht mehr
  vergessen werden kann.
- **Quellenarten waren in der Anzeige fest verdrahtet** statt geladen. Das
  wäre genau die Art erfundener Angabe gewesen, die die Belegpflicht
  verhindern soll.
- „1 Gänge" — fehlende Einzahlform bei Getrieben mit einem Gang.

### Phase 2 — Automotive-Datenbank (abgeschlossen)

**Hinzugefügt**
- Katalogschema mit 13 Tabellen: Hersteller, Modell, Generation, Facelift-Phase,
  Motor, Getriebe, Antriebskombination, Ausstattungslinie, Sonderausstattung,
  Verfügbarkeit, Paket, Paketposition, Karosserieform — dazu Quellenangaben.
- Redaktionsablauf `DRAFT → IN_REVIEW → PUBLISHED → ARCHIVED` mit getrennten
  Rechten für Erfassen und Freigeben.
- Elf Endpunkte unter `/api/katalog`, davon zwei öffentlich lesend.
- Einheitenrechnung (kW ↔ PS), Formatierung von Leistung, Hubraum, Bauzeitraum
  und Verbrauch.
- 36 neue Tests, darunter zwölf, die den gesamten Redaktionsablauf über die
  HTTP-Schnittstelle durchspielen.

**Entschieden**
- Fahrleistungen hängen an der Antriebskombination, nicht am Motor. Derselbe
  Motor beschleunigt in verschiedenen Fahrzeugen verschieden.
- Motoren und Sonderausstattung hängen am Hersteller, nicht am Modell — sonst
  wären sie dutzendfach doppelt und dutzendfach unterschiedlich falsch erfasst.
- **Ohne mindestens eine Quelle wird nicht veröffentlicht.** Erzwungen in der
  Domänenschicht. Die letzte Quelle eines veröffentlichten Eintrags lässt sich
  nicht entfernen.
- Verbrauchswerte tragen immer ihren Messzyklus; Vorgabe ist `UNKNOWN`, nicht
  `WLTP`.
- Leistung wird ausschließlich in Kilowatt gespeichert, PS wird berechnet.

**Geändert**
- Der Route-Handler-Wrapper unterstützt Pfadparameter dynamischer Routen.
- Der CSP-Test gegen das Build-Manifest prüft jetzt die zutreffende Aussage:
  keine geschützte Seite wird statisch erzeugt. Die frühere Umkehrung hätte
  öffentliche dynamische Seiten fälschlich beanstandet.

### Phase 1 — Architektur & Fundament (abgeschlossen)

**Entschieden**
- Blocker B1 aufgelöst: Next.js mit Route Handlers, Domänenlogik in
  `packages/core` (ADR-001). Astro wird abgelöst. Abweichung von der
  ursprünglichen Empfehlung (NestJS) samt Begründung im Entscheidungsprotokoll.
- Projekt-Gehirn wandert ins Repository nach `docs/gehirn/` (ADR-002).
- Eigene Session-Authentifizierung statt externem Anbieter (ADR-003).

**Hinzugefügt**
- Monorepo mit npm-Workspaces: `apps/web`, `apps/worker`, `packages/core`,
  `packages/db`.
- Domänenschicht `packages/core`: Fehlertaxonomie, Rechtematrix mit sechs
  Rollen, Zugriffsprüfungen, Passwort-Hashing (scrypt), Sitzungstoken,
  Sitzungsregeln, Anmelde-Anwendungsfälle, Eingabevalidierung, VIN-Prüfung
  nach ISO 3779/3780, Ports für Zeit, Ratenbegrenzung, Warteschlange und
  Audit-Log.
- Persistenz `packages/db`: Prisma-Schema für Benutzer, Sitzungen, Händler und
  Audit-Log, erste Migration, Repositories, Audit-Logger.
- Web-Anwendung `apps/web`: Next.js 15 App Router, typisierter
  Route-Handler-Wrapper, Registrierung, Anmeldung, Abmeldung, Sitzungsauskunft,
  Betriebsbereitschaft, Kontoseite, ehrliche Platzhalterseiten für noch nicht
  gebaute Bereiche.
- Designsystem Schwarz + Neon Rot mit nachgerechneten WCAG-Kontrastwerten und
  vierzehn Basiskomponenten, darunter `DataGap` und `SourceNote` als sichtbare
  Umsetzung von Vorgabe C3.
- Hintergrundprozess `apps/worker` mit Aufräumlauf für abgelaufene Sitzungen.
- Sicherheit: Security-Header, Content-Security-Policy mit Nonce für die
  geschützten Bereiche, Env-Validierung beim Start, Ratenbegrenzung,
  Body-Größenbegrenzung, IP-Hashing per HMAC.
- 97 Tests: Unit-Tests der Domänenschicht, Integrationstests gegen echtes
  PostgreSQL, CSP-Prüfung gegen das Build-Manifest und gegen die laufende
  Anwendung.
- `npm run status` erzeugt `STATUS.md` aus `PROGRESS.json`.

**Behoben**
- **Content-Security-Policy legte statisch vorgerenderte Seiten still.** Der
  Nonce entsteht pro Anfrage, das vorgerenderte HTML trägt ihn nicht — der
  Browser blockierte sämtliche Skripte (gemessen: 0 von 20 Skripten mit
  passendem Nonce). Zwei Seiten waren betroffen und sahen dabei völlig normal
  aus. Behoben durch zwei Richtlinien nach Seitenart und abgesichert durch
  einen Test gegen das Build-Manifest.
- **Kopfzeile zeigte nach der Anmeldung den abgemeldeten Zustand.** Der
  Anmeldezustand wurde nur beim Einhängen geladen, clientseitige Navigation
  hängt die Komponente nicht neu ein. Anmelden und Abmelden lösen jetzt einen
  vollständigen Seitenwechsel aus.
- **`<button>` innerhalb von `<a>`** an fünf Stellen — ungültiges HTML und für
  Hilfstechnik mehrdeutig. Ersetzt durch `LinkButton`.

**Geändert**
- `CLAUDE.md` und `AGENTS.md` ersetzt: vorher Astro-Boilerplate ohne
  Projektbezug, jetzt tatsächliche Projektanweisungen.
- `STATUS.md` wird erzeugt statt von Hand gepflegt. Sie war bereits
  abgedriftet und meldete „Git nicht initialisiert", als das Repository längst
  bestand.
- Blocker B4 (Marktdatenquelle) von „mittel" auf „hoch" heraufgestuft.

**Neu erkannt**
- **B7:** Aus einer VIN sind nur Herstellerkennung, Modelljahr und Werk
  belegbar — Modell, Generation und Motorcode nicht. Phase 7 setzt das aber
  voraus. Der Ablauf muss „VIN schlägt vor, Nutzer bestätigt" heißen.
- **B8:** Kein Versandweg für E-Mail. Folge: keine Verifikation der Adresse,
  kein Passwort-Zurücksetzen.

**Bewahrt**
- `docs/referenz-astro/` enthält die abgelöste Astro-Konfiguration samt
  `content.config.ts`. Das Pflichtfeld `sources` daraus wird ins neue
  Datenmodell übernommen.
