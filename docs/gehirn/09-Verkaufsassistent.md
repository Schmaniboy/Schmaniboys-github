# KI-Verkaufsassistent und VIN-Analyse

Umsetzung: `packages/core/src/vin/`, `packages/core/src/sales/`,
`packages/core/src/usecases/sales-assistant.ts`,
`packages/db/src/repositories/listing-drafts.ts`,
`apps/web/src/app/verkaufen/`, `apps/web/src/lib/ai/anthropic.ts`.

## Der Kern: die VIN schlägt vor, der Mensch bestätigt

Blocker B7 aus der Analyse lautete: Eine VIN erlaubt keine vollständige
Fahrzeugauflösung. Das ist keine Frage des Aufwands, sondern der Norm.
Aus ISO 3779/3780 lassen sich nur drei Dinge herleiten:

| Stelle | Inhalt | Verlässlichkeit |
|---|---|---|
| 1–3 | WMI (Weltherstellercode) | belegt |
| 10 | Modelljahrhinweis | **nur in Nordamerika verbindlich**, 30-Jahre-Zyklus → immer zwei Kandidaten |
| 11 | Werkskennung | belegt, aber herstellerspezifisch codiert |
| 4–9 | Fahrzeugbeschreibung (VDS) | **herstellereigene Codierung, nicht öffentlich normiert** |

Modell, Generation, Motor und Ausstattung stehen damit **nicht** in der VIN.
Wer sie daraus „ableitet", rät — und zwar in ein Dokument hinein, aus dem
später ein rechtlich erheblicher Verkaufstext wird.

`decodeVin()` gibt deshalb zurück, was belegbar ist, und nichts sonst:
`{ vin, wmi, region, checkDigit, modelYearCandidates, modelYearReliability,
plantCode, serialNumber }`. Ein Test prüft, dass das Ergebnisobjekt **keine**
Schlüssel `model`, `engine` oder `generation` besitzt — die Lücke ist bewusst
und soll bewusst bleiben.

`modelYearCandidates` ist immer ein Array (etwa `[1983, 2013]`), nie ein Wert.
`describeDecoding()` formuliert das in gewöhnlichem Deutsch für die Oberfläche,
einschließlich des Hinweises, dass Stelle 10 außerhalb Nordamerikas üblich,
aber nicht garantiert ist.

Der Rest ist Ablauf: Schritt 2 des Entwurfs lässt den Verkäufer aus **real
veröffentlichten Katalogeinträgen** wählen (Hersteller → Modell → Generation →
Motorvariante). Gibt der Katalog zum WMI noch nichts her, sagt die Seite genau
das — sie bietet keine Auswahl an, die es nicht gibt. Erst die Bestätigung
setzt `catalogConfirmedAt`.

## Ohne bestätigtes Fahrzeug kein Text

`generateListingTexts` bricht mit `PRECONDITION_FAILED` ab, solange
`catalogConfirmedAt` fehlt. Das ist die strukturelle Absicherung von B7: Die
KI kann nicht über ein geratenes Fahrzeug schreiben, weil sie nie eines
geliefert bekommt.

## Der Feld-Guard ist ein Typ, keine Prompt-Bitte

Aufgabe 7.8 verlangt eine serverseitige Whitelist. Umgesetzt ist sie als
Datentyp: `AiListingContext` in `packages/core/src/sales/field-guard.ts`
**ist** die Whitelist. `buildAiListingContext(draft, catalog)` ist die einzige
Stelle, an der ein KI-Kontext entsteht, und sie kann nur Felder dieses Typs
füllen. Ein Feld, das nicht im Typ steht, erreicht das Modell nicht — auch
nicht durch ein Versehen beim Erweitern des Entwurfs.

Die Liste `NIEMALS_AN_DIE_KI` (`vin`, `vinHash`, `ownerId`, `owner`, `email`,
`displayName`, `id`, `userId`, `ipHash`) dient der Prüfung: Zwei Tests
serialisieren den fertigen Kontext und suchen darin nach der VIN und nach dem
Motorcode des Besitzers. Prompt-Disziplin wäre hier wertlos — ein Prompt ist
eine Bitte, ein Typ ist eine Zusage.

Fehlende Angaben werden **weitergegeben**, nicht verschwiegen: Der Kontext
enthält explizit, was der Verkäufer offengelassen hat. Sonst füllt das Modell
die Lücke selbst.

## Reihenfolge im Anwendungsfall

Die Reihenfolge in `generateListingTexts` ist nicht beliebig; jede Vertauschung
kostet Geld oder verrät etwas:

1. **Besitz prüfen** — ein fremder Entwurf ist `NOT_FOUND`, nicht `FORBIDDEN`.
   Ein 403 würde bestätigen, dass die Kennung existiert.
2. **`catalogConfirmedAt` verlangen** — siehe oben.
3. **`generator.isAvailable()`** — *vor* der Reservierung. Ist keine KI
   eingerichtet, bekommt der Nutzer `NOT_IMPLEMENTED` mit dem Satz „Es wurde
   kein Guthaben verbraucht" — und es stimmt.
4. **`spendTokens` reservieren** mit
   `reference = listing-text:${draftId}:${updatedAt.getTime()}`.
5. **Erzeugen und validieren** — die Prüfung läuft *innerhalb* der Buchung.
   Unbrauchbare Ausgabe gibt die Reservierung frei, statt sie abzubuchen.
6. **Speichern**.

Die Referenz enthält den Änderungsstempel des Entwurfs. Daraus folgt beides,
was man erwartet: Ein unveränderter Entwurf wird nur einmal berechnet
(erneutes Aufrufen liefert die gespeicherten Texte mit `charged: 0`), eine
Änderung am Entwurf führt zu einer neuen Referenz und damit zu einer neuen
Berechnung.

## Die KI-Anbindung

`apps/web/src/lib/ai/anthropic.ts`, `import 'server-only'`. Modell
`claude-opus-5`, `thinking: { type: 'adaptive' }`, strukturierte Ausgabe über
`messages.parse()` mit `zodOutputFormat` (verlangt `zod/v4`), Zeitlimit 120
Sekunden. `uebersetzeFehler()` übersetzt die typisierten SDK-Fehler
(RateLimit, Authentication, BadRequest, Connection) in unsere Fehlerklassen;
niemand bekommt eine SDK-Meldung zu sehen.

Ohne `ANTHROPIC_API_KEY` greift `UnavailableTextGenerator`: `isAvailable()`
ist `false`, die gesamte übrige Plattform bleibt lauffähig, und Schritt 4 des
Entwurfs erklärt, was fehlt. Das ist die Umsetzung der Vorgabe, eine fehlende
externe Abhängigkeit nicht die Entwicklung blockieren zu lassen.

## Was die KI schreibt — und was nicht

Die KI liefert vier Texte: Verkaufstitel, Kurzbeschreibung, ausführlicher
Verkäufertext (erste Person Singular) und eine gekürzte Kleinanzeigen-Fassung.
Alle vier entstehen ausschließlich aus dem Feld-Guard-Kontext.

**Technische Daten und Ausstattung schreibt sie nicht.** Der MASTERPLAN nennt
sie in Aufgabe 7.7 in einem Atemzug mit den Verkaufstexten; umgesetzt sind sie
trotzdem als zwei feste Blöcke (`components/sales/VehicleFacts.tsx`), die den
bestätigten Katalogeintrag ausgeben — Motorname, Motorcode, Kraftstoff,
Hubraum, Leistung in kW *und* PS, Getriebe, Antrieb, Bauzeit, Karosserie,
Ausstattungslinie und die erfasste Ausstattung.

Der Grund ist derselbe, aus dem die Wissensdatenbank Belege verlangt: Ein
Sprachmodell, das technische Daten formuliert, kann sie auch erfinden. Eine
erfundene Anhängelast oder ein erfundener Verbrauchswert stünde danach in
einer Verkaufsanzeige — also in einer rechtlich erheblichen Aussage des
Verkäufers. Was der Katalog nicht führt, steht deshalb nicht da; ohne gewählte
Ausstattungslinie sagt der Block ausdrücklich, dass sich die Serienausstattung
nicht zuordnen lässt, statt etwas zu vermuten.

Der Prompt macht dieselbe Grenze noch einmal explizit: Er verbietet erfundene
Zahlen, verlangt, über `missingFields` zu schweigen (weder bestätigend noch
verneinend), untersagt Superlative ohne Grundlage und Zusicherungen jeder Art.
Der Nutzerkontext geht als JSON in einem `<fahrzeugdaten>`-Block hinein, mit
dem ausdrücklichen Hinweis, den gesamten Block als Daten zu behandeln — ein
eingeschleuster Satz im Freitextfeld „Weitere Hinweise" bleibt damit ein
Datum, kein Auftrag.

## Datensparsamkeit (7.10)

Die VIN steht im Entwurf, weil der Verkäufer sie später in die Anzeige
aufnehmen können soll. Sie verlässt den Server aber nirgends unnötig:

* Sie steht nie in einer URL. Die Formulare senden `POST`; ein Fund während
  des Browsertests war genau das Gegenteil — siehe unten.
* Sie erreicht die KI nicht (Feld-Guard).
* Zusätzlich liegt ein `vinHash` für Duplikaterkennung vor, damit spätere
  Phasen ohne die Klar-VIN vergleichen können.

## Drei Funde aus Test und Durchsicht

**Passwort in der Adresszeile.** Der Durchlauf mit Playwright landete auf
`/registrieren?displayName=…&email=…&password=ein-sehr-langes-passwort`. Grund:
Vor der Hydration war der `onSubmit`-Handler noch nicht aktiv, das Formular
hatte keine `method` — der Browser sendete also nativ per `GET` und schrieb
alle Felder in die URL, damit in Verlauf, Zugriffsprotokolle und `Referer`.
Behoben in `AuthForm`, `VinForm` und `DetailsForm`: `method="post"` plus eine
`bereit`-Sperre, die die Schaltfläche bis zum ersten `useEffect` deaktiviert.
Der Browsertest prüft seither, dass in keiner besuchten URL ein Passwort oder
eine VIN auftaucht.

**Verweise ins Leere.** Die Kontonavigation verlinkte „Meine Anzeigen" und
„Nachrichten" — beides Bereiche der Phasen 9 und 12. Next.js lädt verlinkte
Routen im Hintergrund vor, die 404 entstand also schon beim Betreten der
Kontoseite. `DashboardNavItem.upcoming` stellt solche Punkte jetzt ausgegraut
und ohne Link dar; `apps/web/tests/verweise-live.test.ts` läuft alle festen
Verweise der Hauptseiten ab und schlägt fehl, sobald einer 404 liefert.
Bei Phase 9 und 12 entfällt jeweils nur das `upcoming: true`.

Nebenbei beantwortet `/api/auth/me` jetzt auch ohne Sitzung mit 200 und
`user: null` statt mit 401. „Wer bin ich" ist für Gäste eine beantwortbare
Frage, und die Kopfzeile stellt sie auf jeder öffentlichen Seite — der 401
war kein Schutz, sondern ein Dauerfehler in der Browserkonsole, in dem echte
Fehler untergingen. Der Schutztest zeigt jetzt auf `/api/guthaben`.

**Ersatzwerte, die zu Datenfehlern werden.** Die Verkaufsrouten schrieben
`context.principal?.userId ?? ''`. Bei `auth: 'required'` ist der Wert
garantiert vorhanden, der Ersatzwert also totes Holz — bis jemand den
`auth`-Modus ändert; dann gehört der Entwurf niemandem, und
`listOwnDrafts('')` fragt nach den Entwürfen des Besitzers „". Ersetzt durch
`context.userId()`, das wirft statt zu raten. Ebenso `hashVin(vin) ?? ''`:
Ohne Hash-Geheimnis hätten alle Entwürfe denselben Hash bekommen und die
spätere Duplikaterkennung lauter Treffer gemeldet. Die Spalte ist nullbar —
also geht jetzt `null` hinein.

## Ein Testlauf, der von der Reihenfolge abhing

Mit jeder neuen Live-Testdatei wuchs die Zahl der Anmeldungen pro Lauf. Die
Anmeldung ist auf zehn Versuche je fünf Minuten und IP-Adresse begrenzt — was
richtig ist —, und alle Tests kommen von derselben Adresse. Ab einer gewissen
Zahl bekamen die zuletzt laufenden Dateien kein Cookie mehr und schlugen mit
Fehlern fehl, die nach Fachfehlern aussahen („expected 401 to be 404").

Die Begrenzung zu lockern wäre die falsche Reaktion gewesen: Sie schützt genau
das, was sie schützen soll. Die Tests legen ihre Sitzung deshalb direkt an
(`apps/web/tests/helpers/session.ts`) — auf demselben Weg wie die Anwendung,
Zufallstoken ins Cookie, nur dessen Hash in die Datenbank. Die Anmeldung selbst
prüft `anmeldung-live.test.ts` mit zwei Aufrufen: dass ein richtiges Passwort
ein `HttpOnly`-Cookie setzt, dessen Klartext nicht in der Datenbank steht, und
dass ein falsches Passwort keinen Grund nennt.

Zur Kontrolle läuft die Testreihe zweimal hintereinander grün — vorher war der
zweite Lauf der, der scheiterte.
