# Entscheidungsprotokoll

Jede Entscheidung, die den Code bindet, steht hier. Format: Kontext,
Entscheidung, Begründung, Konsequenzen. Eine getroffene Entscheidung wird
nicht gelöscht, sondern bei Bedarf durch eine spätere ersetzt (Status
„abgelöst durch ADR-xxx").

---

## ADR-001 — Tech-Stack: Next.js mit Route Handlers, Domänenlogik in `packages/core`

**Status:** angenommen · **Datum:** 2026-08-21 · **Löst Blocker B1**

### Kontext

Der Bestand war ein Astro-Starter mit Markdown-Content-Collections. Der
MASTERPLAN verlangt ab Phase 7 Authentifizierung, Token-Guthaben, Billing,
Rechnungen, Messaging und einen Adminbereich. Content-Collections sind Dateien
im Repository — sie tragen keine Benutzerkonten, keine Transaktionen und keine
Mandantentrennung. Vier Varianten standen zur Wahl (A: Next.js + NestJS +
Worker + PostgreSQL, B: Next.js mit Route Handlers + Worker, C: Astro für den
Katalog plus Next.js für die App, D: alles in Astro).

### Entscheidung

**Variante B**, mit einer bindenden Zusatzregel:

> Die gesamte Domänenlogik liegt in `packages/core` und kennt weder HTTP noch
> Next.js noch Prisma. Route Handler dürfen ausschließlich validieren,
> autorisieren und delegieren.

### Begründung

Die Empfehlung im Bestandsplan lautete Variante A. Ausschlaggebend für die
Abweichung ist die Projektrealität: Der MASTERPLAN hält ausdrücklich fest
„Ich bin Anfänger". NestJS bringt ein zweites Framework mit eigenem mentalen
Modell (Dependency Injection, Module, Decorators) und erheblichem Boilerplate.
Diese Struktur zahlt sich in einem Team aus; bei einer Einzelperson kostet sie
vor allem Tempo.

Die Garantien, um die es bei Variante A geht — erzwungene Trennung genau dort,
wo das Projekt empfindlich ist (Guthaben, Rechte, Mandanten) — entstehen auch
unter B, sobald die Zusatzregel gilt. Der Unterschied ist, wer sie erzwingt:
bei A das Framework, bei B die Projektstruktur plus Review. Dafür bleibt der
Weg nach A offen, weil die Fachlogik bereits außerhalb des Web-Frameworks
liegt: Ein späteres NestJS würde `packages/core` unverändert einbinden.

Variante C wurde verworfen: zwei Frontends und eine über zwei Anwendungen
geteilte Session sind für eine Einzelperson dauerhafte Zusatzlast. Variante D
scheidet aus, weil sie die Phasen 7–13 strukturell nicht trägt.

### Konsequenzen

- Astro wird abgelöst. `docs/referenz-astro/` bewahrt die alte
  `content.config.ts`, `package.json` und `tsconfig.json` zur Nachvollziehbarkeit.
  Das dort dokumentierte Pflichtfeld `sources` wird ins neue Datenmodell übernommen.
- Monorepo mit npm-Workspaces: `apps/web`, `apps/worker`, `packages/core`,
  `packages/db`.
- Abhängigkeitsregel: `core` → nichts. `db` → `core`. `web`/`worker` → `core`, `db`.
  Niemals umgekehrt.
- Der Katalog verliert gegenüber Astro etwas statische Auslieferungsleistung.
  Gegenmaßnahme: Katalogseiten als statisch generierte Segmente mit
  Revalidierung, nicht als dynamisches Rendering.

---

## ADR-002 — Projekt-Gehirn wandert ins Repository

**Status:** angenommen · **Datum:** 2026-08-21

### Kontext

Das Gehirn lag ausschließlich unter `D:\Zweites Gehirn\`. Der MASTERPLAN
verlangt, es bei jedem Kontextwechsel zu lesen. Aus dem Repository heraus ist
dieser Pfad nicht erreichbar; damit war die Regel praktisch nicht erfüllbar,
und ausgerechnet das Dokument, das Blocker B1 entscheidbar macht, fehlte.

### Entscheidung

Entscheidungs- und Architekturwissen wird in `docs/gehirn/` geführt und dort
gepflegt. Der Vault bleibt Rechercheraum, ist aber nicht mehr führend.

### Konsequenzen

- Kein Wissensverlust mehr bei Rechnerwechsel, und das Gehirn ist versioniert.
- Inhalte der bestehenden Vault-Dokumente werden **nicht** rekonstruiert oder
  geraten. Was nicht übernommen wurde, gilt als unbekannt (Vorgabe C3).

---

## ADR-003 — Eigene Session-Authentifizierung statt externem Anbieter

**Status:** angenommen · **Datum:** 2026-08-21

### Kontext

Phase 1 verlangt Authentifizierung. Üblich wären fertige Bibliotheken oder
gehostete Anbieter.

### Entscheidung

Eigene Implementierung: scrypt aus der Node-Standardbibliothek für Passwörter,
serverseitige Sitzungen in der Datenbank, `httpOnly`-Cookie mit `SameSite=Lax`
und `Secure`. Im Cookie steht ein Zufallstoken, in der Datenbank nur dessen
SHA-256-Hash.

### Begründung

Ein gehosteter Anbieter wäre eine externe Abhängigkeit mit Kosten und
Vertragsbindung — und der MASTERPLAN legt für Zahlungen (C1) und Messaging (C2)
bereits fest, dass keine solche Bindung entstehen soll. Serverseitige
Sitzungen sind gegenüber JWT im Vorteil, weil sie sofort widerrufbar sind; das
ist bei einem Guthabensystem wesentlich. scrypt ist speicherhart und in Node
enthalten, es entsteht also an der sicherheitskritischsten Stelle keine
Lieferketten-Abhängigkeit und kein natives Modul.

### Konsequenzen

- E-Mail-Zustellung (Verifikation, Passwort-Zurücksetzen) ist ein offener
  Punkt — siehe `05-Offene-Punkte.md`, B7. Die Schnittstelle wird gebaut, der
  Versand bleibt bis zur Anbieterwahl abgeschaltet.
- Die Hash-Parameter stehen im gespeicherten Hash. Sie lassen sich später
  erhöhen, ohne bestehende Passwörter ungültig zu machen (`needsRehash`).

---

## ADR-004 — Der Feld-Guard ist ein Datentyp, keine Prompt-Anweisung

**Datum:** 2026-08-22 · **Status:** angenommen · **Betrifft:** Phase 7,
alle künftigen KI-Aufrufe

### Entscheidung

Welche Daten ein Sprachmodell zu sehen bekommt, wird durch einen Typ
festgelegt, nicht durch eine Formulierung im Prompt. `AiListingContext`
(`packages/core/src/sales/field-guard.ts`) **ist** die Whitelist;
`buildAiListingContext()` ist die einzige Stelle, an der ein KI-Kontext
entsteht.

### Begründung

Aufgabe 7.8 verlangt ausdrücklich eine serverseitige Whitelist statt
Prompt-Disziplin. Der Unterschied ist nicht graduell: Ein Prompt ist eine
Bitte an ein Modell, ein Typ ist eine Zusage des Übersetzers. Ein Feld, das
im Typ fehlt, kann das Modell nicht erreichen — auch nicht, wenn jemand
später den Entwurf um ein Feld erweitert und den Prompt vergisst.

Konkret geht es um die VIN, die Kennung des Besitzers und dessen Kontaktdaten.
Eine VIN ist ein personenbeziehbares Merkmal; sie gehört in keinen Aufruf an
einen externen Dienst, der sie für die Aufgabe nicht braucht.

### Konsequenzen

- Jedes neue Feld im Verkaufsentwurf ist standardmäßig **nicht** für die KI
  sichtbar. Sichtbarkeit ist eine bewusste Ergänzung des Typs.
- Zwei Tests serialisieren den fertigen Kontext und suchen darin nach der VIN
  und nach dem Motorcode. Sie schlagen fehl, sobald jemand den Guard umgeht.
- Dieselbe Form gilt für künftige KI-Aufrufe (Bewertung in Phase 8,
  Nachrichtenvorschläge in Phase 12): eigener Kontexttyp, eigener Bauschritt.

---

## ADR-005 — VIN schlägt vor, der Verkäufer bestätigt

**Datum:** 2026-08-22 · **Status:** angenommen · **Betrifft:** Phase 7,
Blocker B7

### Entscheidung

Die Plattform löst eine VIN nicht zu einem Fahrzeug auf. Sie zeigt, was in der
VIN belegbar steht, und lässt den Verkäufer Modell, Generation und
Motorvariante aus veröffentlichten Katalogeinträgen bestätigen.
`generateListingTexts` bricht ohne `catalogConfirmedAt` ab.

### Begründung

Nach ISO 3779/3780 sind nur Herstellerkennung (Stellen 1–3), ein
Modelljahrhinweis (Stelle 10, 30-Jahre-Zyklus, nur in Nordamerika
verbindlich) und die Werkskennung (Stelle 11) allgemein auswertbar. Die
Stellen 4–9 codiert jeder Hersteller selbst; sie sind nicht öffentlich
normiert. Ein Dienst, der daraus ein Fahrzeug „erkennt", rät entweder oder
schlägt in einem herstellerspezifischen Datenbestand nach.

Aus diesem Rateergebnis entsteht bei uns ein Verkaufstext, und ein
Verkaufstext ist eine rechtlich erhebliche Aussage des Verkäufers. Vorgabe C3
verbietet, Geratenes als Tatsache auszugeben — hier wäre der Schaden nicht
theoretisch.

### Konsequenzen

- `decodeVin()` gibt bewusst kein Modell und keinen Motor zurück. Ein Test
  prüft, dass die entsprechenden Schlüssel im Ergebnis **fehlen**.
- Der Modelljahrhinweis ist immer ein Array von Kandidaten, nie ein Wert.
- Ein kostenpflichtiger Auflösungsdienst bleibt später möglich. Er würde die
  Bestätigung bequemer machen, nicht ersetzen: Verantwortlich für die Angabe
  ist ohnehin der Verkäufer.
- Der Katalog wird zur Voraussetzung des Verkaufens. Ist ein Hersteller dort
  noch nicht veröffentlicht, lässt sich für ihn kein Text erzeugen — das ist
  gewollt und wird auf der Seite auch so gesagt.

---

## ADR-006 — Ohne Marktdaten kein Marktwert

**Datum:** 2026-08-22 · **Status:** angenommen · **Betrifft:** Phase 8,
Blocker B4

### Entscheidung

Die Fahrzeugbewertung gibt einen Betrag in Euro nur aus, wenn ein Grundwert
aus tatsächlichen Vergleichsangeboten vorliegt. Fehlt er, sind
`marketValueCents`, `suggestedListingCents` und `realisticRange` **null** —
nicht 0, nicht geschätzt, nicht „ungefähr". Die Faktorenanalyse wird trotzdem
ausgegeben, und es wird kein Guthaben abgebucht.

### Begründung

Ein Fahrzeugwert besteht aus einem Grundwert und einer Korrektur. Die
Korrektur lässt sich aus den Angaben der verkaufenden Person rechnen; der
Grundwert nicht. Ihn zu schätzen hieße, die Hauptgröße zu erfinden und die
Nebengröße exakt zu rechnen — das Ergebnis sähe genau so präzise aus wie ein
belegtes und wäre wertlos.

Die naheliegende Alternative — eine Zahl mit Hinweis „grobe Schätzung" —
scheidet aus: Gelesen wird die Zahl, nicht der Hinweis. Wer danach sein
Fahrzeug zu billig inseriert, hat einen echten Schaden.

### Konsequenzen

- `MarketDataSource` ist eine Schnittstelle mit Pflichtangaben zur Herkunft:
  Stichprobe, Zeitraum, Quelle und ob es Angebots- oder erzielte Preise sind.
  Ein Marktwert ohne diese Angaben wäre eine Behauptung.
- Die Verfügbarkeitsprüfung steht **vor** der Guthabenreservierung — wie beim
  Verkaufsassistenten. Niemand zahlt für eine Abfrage, die nicht stattfindet.
- Alle Rechengrößen stehen als benannte Annahmen in `assumptions.ts`, tragen
  eine Kennung und werden bei jedem Ergebnis mit ausgegeben.
- Sobald eine Quelle feststeht, wird in `sales-deps.ts` eine Zeile
  ausgetauscht. Am Rest ändert sich nichts.

---

## ADR-007 — Eine Anzeige kopiert den Entwurf, statt ihn zu verwenden

**Datum:** 2026-08-22 · **Status:** angenommen · **Betrifft:** Phase 9

### Entscheidung

`Listing` ist eine eigene Tabelle mit eigenen Feldern. Beim Anlegen werden
Fahrzeugzuordnung, Kilometerstand, Erstzulassung, Vorbesitzer, HU, Zustand,
Servicehistorie, Schäden und Unfallangabe aus dem Verkaufsentwurf **kopiert**.
Die Anzeige liest danach nichts mehr aus dem Entwurf nach.

### Begründung

Eine veröffentlichte Anzeige ist ein Angebot. Änderte sie sich, weil jemand am
Entwurf weiterarbeitet, stünde am Montag ein anderer Kilometerstand da als am
Freitag — und niemand könnte sagen, was zum Zeitpunkt einer Anfrage galt. Bei
einem Kaufvertrag ist das keine Kleinigkeit.

Auch die Anzeigebezeichnung des Fahrzeugs wird gespeichert statt nachgeschlagen,
damit eine alte Anzeige lesbar bleibt, wenn der Katalogeintrag umbenannt wird.

### Konsequenzen

- Doppelte Daten. Das ist der Preis und hier der richtige: Die Kopie ist kein
  Cache, sondern der Stand, auf den sich das Angebot bezieht.
- Für ein anderes Fahrzeug wird eine neue Anzeige angelegt; die
  Fahrzeugzuordnung einer bestehenden ist festgeschrieben.
- Verlangt wird die bestätigte Zuordnung, nicht der erzeugte Text. Wer selbst
  schreiben will, darf das.

---

## ADR-008 — Hochgeladene Bilder werden neu geschrieben, nicht übernommen

**Datum:** 2026-08-22 · **Status:** angenommen · **Betrifft:** Phase 9 und
jeden künftigen Upload

### Entscheidung

Jedes hochgeladene Bild wird am Dateianfang geprüft, dann dekodiert und als
WebP **neu geschrieben**. Gespeichert wird ausschließlich das Ergebnis dieser
Neukodierung, unter einem selbst vergebenen Schlüssel. Der vom Browser
gemeldete Medientyp wird nicht entgegengenommen, der Dateiname nicht verwendet.

### Begründung

Zwei Dinge, die zusammenfallen:

**Sicherheit.** Ein `Content-Type` aus einem Upload ist eine Behauptung der
hochladenden Seite. Wer ihm glaubt, lässt beliebige Dateien als Bild durch. Die
Prüfung am Dateianfang fängt das Offensichtliche; die Neukodierung fängt den
Rest, weil sie nur Bildinformation überträgt und nichts sonst.

**Datenschutz.** Fahrzeugbilder werden meist dort aufgenommen, wo das Fahrzeug
steht — vor der Wohnung der verkaufenden Person. Der Aufnahmeort steht in den
EXIF-Daten, und das Bild geht anschließend an jeden, der die Anzeige aufruft.
Die verkaufende Person weiß davon in aller Regel nichts. EXIF beim Hochladen
zu entfernen ist deshalb keine Zusatzfunktion, sondern die Voreinstellung, die
sie erwarten darf.

### Konsequenzen

- Rechenzeit beim Hochladen. Dafür gibt es Pixel- und Größengrenzen und keine
  Animationen — sonst wäre der Upload selbst der günstigste Angriff.
- Gedreht wird vor dem Verwerfen der Ausrichtung, sonst läge jedes
  Hochkantbild quer.
- Ausgeliefert wird mit festgesetztem Medientyp und `nosniff`.
- Für künftige Uploads (Händlerlogos, Nachrichtenanhänge) gilt derselbe Weg.

---

## ADR-009 — Eine Kennzahl ohne Messung wird nicht als Null ausgegeben

**Datum:** 2026-08-22 · **Status:** angenommen · **Betrifft:** Phase 10 und
jede spätere Auswertung

### Entscheidung

Kennzahlen tragen einen Zustand mit: `GEMESSEN` oder `NICHT_VERFUEGBAR`. Eine
Kennzahl, die sich nicht erheben lässt, wird als nicht verfügbar ausgegeben —
mit Begründung — und nicht als 0.

### Begründung

„Anfragen: 0" liest sich als Messung: niemand hat sich gemeldet. Tatsächlich
gibt es die plattforminternen Nachrichten noch gar nicht. Der Betrieb zöge
daraus einen falschen Schluss über seine Anzeigen — womöglich senkt er Preise
wegen eines Interesses, das nie gemessen wurde.

Das ist derselbe Gedanke wie bei den Marktwerten (ADR-006) und beim
Belegmodell der Wissensdatenbank: Eine Lücke als Zahl auszugeben ist
schlimmer, als sie zu benennen.

### Konsequenzen

- Auswertungen zeigen fehlende Kennzahlen in einem eigenen Abschnitt samt
  Grund, statt sie zu verstecken oder mit Null zu füllen.
- Bei der Standzeit wird der Median genommen, nicht der Mittelwert — ein
  Ausreißer soll die Aussage nicht verschieben.
- Näherungen werden als solche benannt: Der Tokenverbrauch summiert die
  Konten der Mitarbeiter, nicht die des Betriebs, und die Seite sagt das.

---

## ADR-010 — Kein nachgebauter Zahlungsanbieter

**Datum:** 2026-08-22 · **Status:** angenommen · **Betrifft:** Phase 11,
Vorgabe C1, Blocker B5

### Entscheidung

`PaymentProvider` hat genau die fünf Methoden, die der MASTERPLAN nennt. Es
gibt keinen Adapter für einen echten Anbieter und keine Attrappe, die
Zahlungen „durchlaufen" lässt. Eingerichtet ist `UnavailablePaymentProvider`;
ein Kauf endet mit 501 und einer Meldung, die den Grund nennt — und ohne dass
ein Vorgang in der Datenbank entsteht.

### Begründung

Einen Anbieter nachzubauen, ohne dass einer feststeht, hieße dessen
Schnittstelle zu erfinden. Das Ergebnis wäre schlimmer als nichts: Es sähe
funktionierend aus. Eine Attrappe, die Zahlungen als erfolgreich meldet, wäre
noch schlimmer — sie schriebe Guthaben gut, für das niemand gezahlt hat.

Dieselbe Haltung wie bei der Texterzeugung (kein Zugang → nichts abbuchen)
und bei der Bewertung (keine Marktdaten → keine Zahl).

### Konsequenzen

- Vorhandenes Guthaben funktioniert unverändert; nur der Erwerb fehlt. Das
  steht auf der Guthabenseite, bevor jemand klickt, und die Schaltflächen
  sind gesperrt.
- Der Bestätigungsablauf ist vollständig gebaut und getestet — mit
  Attrappen-Anbieter in den Unit-Tests. Der Anschluss eines echten Anbieters
  ist ein Adapter, kein Umbau.
- Die drei Absicherungen (Anbieter fragen statt der Rückleitung glauben,
  Betrag prüfen, genau einmal buchen) stehen im Anwendungsfall, nicht im
  Adapter. Sie gelten damit für jeden künftigen Anbieter.

---

## ADR-011 — Betrugsmuster warnen, sie sperren nicht

**Datum:** 2026-08-22 · **Status:** angenommen · **Betrifft:** Phase 12

### Entscheidung

Erkannte Betrugsmuster in Nachrichten führen zu einem Hinweis an die
empfangende Person, **nicht** zum Verwerfen oder Zurückhalten der Nachricht.
Der Hinweis steht über dem Gesprächsverlauf, nicht neben einzelnen
Nachrichten, und sagt ausdrücklich, dass es Anhaltspunkte sind und keine
Beweise.

### Begründung

Ein Filter, der harmlose Nachrichten verschluckt, ist schlimmer als ein
Hinweis, den jemand ignoriert: Der Verlust ist unsichtbar. Der Käufer wartet
auf eine Antwort, die nie ankam, und niemand erfährt warum.

Und Vertrauen ist verbrauchbar: Wer einmal grundlos angemeckert wurde, liest
den Hinweis auch dann nicht mehr, wenn er recht hat. Ein Test prüft deshalb
ausdrücklich, dass gewöhnliche Fragen nicht anschlagen.

Einzelne Nachrichten anzumarkern liest sich außerdem wie eine Beschuldigung
gegen die schreibende Person — bei vier groben Wortmustern ist das nicht zu
rechtfertigen.

### Konsequenzen

- Die Muster werden bei jedem Lesen frisch berechnet, nicht gespeichert: Ein
  alter Befund wäre nach einer Änderung der Muster falsch.
- Was tatsächlich sperrt, sind Zählungen (Gespräche und Nachrichten je
  Stunde) und die Moderation — nicht die Worterkennung.
- Für Anhänge gilt das Gegenteil: Dort wird nicht gewarnt, sondern das
  Format erzwungen (nur Bilder, neu kodiert). Ein Anhang lässt sich nicht
  überfliegen, bevor man ihn öffnet.


---

## ADR-012 — Mollie als Zahlungsanbieter

**Stand:** entschieden · 23. August 2026

**Zusammenhang.** Vorgabe C1 schliesst Stripe aus. Der Zahlungsweg war
seit Phase 11 als Schnittstelle mit einer „nicht verfügbar"-Umsetzung
gebaut (Blocker B5). Die Entscheidung fiel auf Mollie.

**Entscheidung.** Der Adapter (`core/payments/mollie.ts`) wird gegen den
offiziellen Client `@mollie/api-client` gebaut, nicht gegen eine aus dem
Gedächtnis nachgebaute REST-Schnittstelle.

**Warum das der Punkt ist.** Eine erfundene Schnittstelle lässt sich
schreiben, übersetzen und testen — und fällt erst im Betrieb auf, wenn Geld
im Spiel ist. Der offizielle Client bringt die Typen mit; ein falscher
Feldname bricht den Typecheck statt eine Zahlung.

**Drei Festlegungen im Adapter:**

1. **Der Webhook wird nicht geglaubt.** Mollie signiert seine
   Benachrichtigung nicht — sie enthält nur eine Zahlungskennung im
   Formularkörper. Der Adapter fragt deshalb *immer* beim Anbieter nach.
   Wer dem Aufruf glaubte, hätte einen öffentlichen Endpunkt gebaut, an dem
   sich jeder Guthaben schenken kann.
2. **Der Betrag kommt vom Anbieter.** Gutgeschrieben wird, was Mollie als
   gezahlt meldet — nicht, was wir erwartet haben.
3. **Ein unbekannter Zustand ist nicht „bezahlt".** Führt Mollie einen
   neuen Zustand ein, bleibt der Vorgang offen.

**Dabei gefunden.** `confirmTokenPurchase` reichte unsere eigene
Vorgangskennung an `getPaymentStatus` durch. Mit der Ersatzvariante fiel das
nie auf — sie antwortete ohnehin nie. Mit einem echten Anbieter hätte jede
Bestätigung ins Leere gegriffen. Die Anbieterkennung wird jetzt mitgeführt,
und ein Vorgang ohne sie schreibt nichts gut.

**Verworfen:** eigene HTTP-Aufrufe gegen die Mollie-API. Sie wären kürzer
gewesen und hätten eine Schnittstelle festgeschrieben, die ich nicht prüfen
kann.

---

## ADR-013 — Herkunftsart und Rechtsstand von Bildern

**Stand:** entschieden · 23. August 2026

**Zusammenhang.** Bilder trugen bereits eine Herkunft (`origin`:
Hersteller, Presse, Wikimedia, Archiv, eigene Aufnahme, KI-Erzeugung). Die
Auftragserweiterung verlangt zusätzlich `source_type = original | licensed
| generated` und einen Lizenz-/Nutzungsstatus.

**Entscheidung.** Beide Felder werden geführt, nicht eines aus dem anderen
abgeleitet.

**Warum nicht ableiten.** `origin` sagt, **wo** das Bild gefunden wurde;
`sourceType` sagt, **was** es rechtlich ist. Ein Herstellerbild kann ein
aufgefundenes Original unter Pressefreigabe sein oder ein eingekauftes
lizenziertes — derselbe Fundort, ein anderer Rechtsstand. Das ist keine
Doppelung, sondern eine echte Unterscheidung.

**Gegen das Auseinanderlaufen** (das Problem, das `standard`/`kind`
verursacht hatte) steht `pruefeHerkunftsart`: `GENERATED` gibt es nur zu
`origin = AI_GENERATED` und umgekehrt. Der Import lehnt Widersprüche ab.

**Der Rechtsstand ist eine harte Sperre, keine Empfehlung.** `waehleBild`
prüft ihn **vor** der Zuordnung: Ein Bild mit ungeklärter Nutzung ist kein
schlechteres Bild, es ist eines, das nicht erscheinen darf. Die
Voreinstellung ist `UNCLEAR` — wer nichts angibt, hat nichts geprüft.

**Die Vorrangfolge** Original → lizenziert → erzeugt steht **vor** der
Fundort-Rangfolge. Ein Archivbild schlägt eine erzeugte Darstellung, auch
wenn der Fundort schlechter ist: Eine Aufnahme zeigt ein Auto, das gebaut
wurde.

---

## ADR-014 — KI-Bilder: erlaubt, aber ohne erfundene Merkmale

**Stand:** entschieden · 23. August 2026

**Zusammenhang.** Die frühere Vorgabe schloss erzeugte Bilder aus. Die
Auftragserweiterung lässt sie als Rückfallebene zu — mit der Auflage, dass
sie keine Fahrzeugdaten erfinden.

**Das Problem.** Diese Auflage lässt sich nicht vollständig einhalten. Ein
erzeugtes Bild hat immer Scheinwerfer, Rückleuchten und eine Karosserieform
— auch wenn niemand weiss, wie sie an dieser Phase aussahen. Das Modell malt
irgendwelche.

**Entscheidung.** Was sich einhalten lässt, wird erzwungen
(`baueBildAnweisung`):

- In die Anweisung kommt **ausschliesslich**, was belegt vorliegt. Nichts
  wird ergänzt, damit die Beschreibung vollständiger klingt.
- Was nicht belegt ist, wird als `unverifiedAspects` ausgewiesen und mit dem
  Bild gespeichert (`generatedFromFields`). Diese Liste sagt, worauf man sich
  an diesem Bild **nicht** verlassen darf.
- **Ohne Generation und Karosserieform gibt es gar keine Erzeugung.** Eine
  Beschreibung, die nur „BMW 3er" kennt, führt zwangsläufig zu einer
  Vermischung mehrerer Generationen — genau das, was die Vorgabe ausschliesst.
- Die Anweisung verbietet ausdrücklich Menschen, andere Fahrzeuge, Umgebung
  und Merkmale anderer Generationen.

**In der Darstellung** trägt jedes erzeugte Bild den sichtbaren Satz „Zeigt
kein tatsächlich gebautes Fahrzeug."

**Meine Einschätzung bleibt:** Für einen Katalog, der mit Belegbarkeit
wirbt, ist ein erzeugtes Fahrzeugbild ein Fremdkörper. Die Entscheidung ist
getroffen, die Architektur trägt sie und macht sie sichtbar.

---

## ADR-015 — Vercel als Host, ohne Bild-Uploads

**Stand:** entschieden · 23. August 2026

**Entscheidung.** Vercel, Region Frankfurt. Konfiguration in `vercel.json`,
Anleitung in `docs/DEPLOYMENT.md`.

**Zwei Dinge, die daraus folgen:**

**Die Migrationen laufen nicht automatisch beim Deployment.** Ein
Schemawechsel, der bei jedem Push mitläuft, ist der schnellste Weg zu einem
Datenverlust, den niemand bemerkt hat. `npm run db:deploy` wird bewusst von
Hand ausgeführt, vor dem Deployment.

**Bild-Uploads funktionieren dort nicht.** Das Dateisystem einer serverlosen
Funktion ist schreibgeschützt bis auf `/tmp`, und `/tmp` lebt nur so lange
wie ein einzelner Aufruf. Ein hochgeladenes Bild wäre Sekunden später
verschwunden, die Anzeige bliebe mit einem toten Verweis zurück.

Statt das hinzunehmen, erkennt `imageStorage` die Umgebung (`VERCEL=1`) und
tritt durch `UnavailableImageStorage` zurück: Uploads werden abgelehnt, mit
Begründung. Dasselbe Muster wie beim Zahlungsanbieter — eine Funktion, die
nicht laufen kann, sieht nicht so aus, als liefe sie.

Alles Übrige — Katalog, Suche, Vergleich, Ausstattungschecker, HSN/TSN, Mein
Fahrzeug, Zahlungen — läuft dort vollständig.

---

## ADR-016 — E-Mail über SMTP statt über einen Anbieter

**Stand:** entschieden · 23. August 2026

**Zusammenhang.** Blocker B8: Registrierungsbestätigung und
Passwort-Zurücksetzen brauchen einen Versandweg. Ein Anbieter war nicht
festgelegt.

**Entscheidung.** SMTP, über `nodemailer`. Keine Anbieterentscheidung nötig
— es gibt keine zu treffen.

**Warum.** SMTP ist ein Standard, kein Erzeugnis einer Firma. Derselbe
Adapter funktioniert mit Postmark, Brevo, Mailgun, Amazon SES oder einem
eigenen Server, und der Wechsel ist eine Änderung an vier
Umgebungsvariablen. Ein Anbieter-SDK hätte eine Festlegung erzwungen, die
sich später nur mit Code lösen ließe.

**Drei Festlegungen:**

1. **Die Antwort auf „Passwort vergessen" ist immer dieselbe** — ob es das
   Konto gibt oder nicht, ob es gesperrt ist, ob schon zu viele Links offen
   sind. Wer eine fremde Adresse absendet und „unbekannt" liest, hat gerade
   erfahren, wer hier ein Konto hat. Damit ließe sich eine Adressliste
   durchprobieren. Auch ein fehlgeschlagener Versand ändert die Antwort
   nicht.

2. **TLS wird erzwungen** (`requireTLS` außer auf Port 465). Ohne das fällt
   der Versand auf eine unverschlüsselte Verbindung zurück, wenn der Server
   sich als unfähig ausgibt — und dann gehen Zurücksetzlinks im Klartext
   über das Netz.

3. **Die Konsolenausgabe ist in Produktion gesperrt**, auch wenn sie
   ausdrücklich eingeschaltet wurde. Eine Anwendung, die Zurücksetzlinks in
   ein Serverprotokoll schreibt und sich dabei als versandfähig meldet, gibt
   Zugänge preis.

**Token.** Gespeichert wird nur der Hash — wie bei Sitzungen. Verbrauchte
Token bleiben stehen (`usedAt`), damit ein zweiter Klick „bereits verwendet"
statt „unbekannt" bekommt; E-Mail-Programme öffnen Links im Hintergrund.
Das Verbrauchen ist ein bedingtes UPDATE: Zwei gleichzeitige Aufrufe mit
demselben Link können nicht beide gewinnen.

Ein Zurücksetzen **beendet alle Sitzungen**. Wer sein Passwort zurücksetzt,
weil jemand anders Zugriff hatte, will genau das.

Gültigkeitsdauern: Zurücksetzen 60 Minuten, Bestätigung 7 Tage. Der
Unterschied folgt dem Schaden im Missbrauchsfall — ein abgefangener
Zurücksetzlink übernimmt das Konto, ein abgefangener Bestätigungslink
bestätigt eine Adresse, die dem Angreifer ohnehin gehört.
