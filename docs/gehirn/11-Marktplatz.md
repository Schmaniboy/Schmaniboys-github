# Marktplatz und Fahrzeuganzeigen

Umsetzung: `packages/core/src/marketplace/`,
`packages/core/src/ports/image-storage.ts`,
`packages/db/src/repositories/listings.ts`, `listing-images.ts`, `favorites.ts`,
`apps/web/src/app/marktplatz/`, `apps/web/src/app/konto/anzeigen/`,
`apps/web/src/lib/images/`.

## Beim Veröffentlichen wird kopiert, nicht verwiesen

Die Anzeige ist eine eigene Tabelle, keine Sicht auf den Verkaufsentwurf. Der
Grund ist kein technischer: **Eine veröffentlichte Anzeige ist ein Angebot.**
Sie darf sich nicht ändern, nur weil jemand am Entwurf weiterarbeitet — sonst
steht am Montag ein anderer Kilometerstand da als am Freitag, und niemand kann
sagen, was zum Zeitpunkt der Anfrage galt.

`createListingFromDraft` kopiert deshalb Kilometerstand, Erstzulassung,
Vorbesitzer, HU, Zustand, Servicehistorie, Schäden und Unfallangabe in die
Anzeige. Ein Test hält das fest: Der Entwurf wird nach dem Anlegen auf 250.000
km geändert, die Anzeige steht weiterhin auf 88.000.

Auch `vehicleLabel` wird gespeichert statt nachgeschlagen — damit eine alte
Anzeige lesbar bleibt, wenn der Katalogeintrag später umbenannt wird.

Was verlangt wird, ist die **bestätigte Fahrzeugzuordnung**, nicht der erzeugte
Text. Wer seine Beschreibung selbst schreiben will, soll das dürfen; über ein
geratenes Fahrzeug soll niemand inserieren.

## Der Statusablauf ist eine Tabelle

`marketplace/status.ts`. Übergänge stehen als Tabelle da, nicht als Kette von
Bedingungen — eine Tabelle lässt sich lesen und prüfen.

```
DRAFT   → ACTIVE, DELETED
ACTIVE  → PAUSED, SOLD, EXPIRED, DELETED
PAUSED  → ACTIVE, SOLD, DELETED
EXPIRED → ACTIVE, DELETED
SOLD    → (Endzustand)
DELETED → (Endzustand)
```

**Verkauft und Gelöscht sind Endzustände.** Eine verkaufte Anzeige wieder
online zu stellen wäre ein zweites Angebot für dasselbe Fahrzeug; wer das will,
legt eine neue an. Und „gelöscht" muss verlässlich gelöscht bleiben, sonst ist
es keine Löschung.

Abgelehnt wird mit Begründung: nicht „Ungültiger Status", sondern welcher
Zustand gerade gilt und was von dort aus möglich wäre. Die Oberfläche bietet
nur Schaltflächen an, die dieselbe Tabelle zulässt — eine Schaltfläche, die der
Server danach ablehnt, wäre eine Falle.

**Sichtbarkeit hängt nicht am gespeicherten Status allein.** Zwischen dem
Ablauf der Laufzeit und dem Umstellen durch den Hintergrundlauf liegt Zeit; in
dieser Zeit darf ein abgelaufenes Angebot nicht in der Trefferliste stehen.
`istOeffentlichSichtbar()` prüft deshalb Status **und** Ablaufdatum, und jede
öffentliche Abfrage geht darüber.

## Bilder: was hereinkommt, wird nicht übernommen

Der wichtigste Satz zum Upload: **Ein `Content-Type` aus einem Upload ist eine
Behauptung, kein Befund.** Wer ihm glaubt, lässt beliebige Dateien als Bild
durch. Der gemeldete Medientyp wird deshalb gar nicht erst entgegengenommen.

Der Ablauf:

1. **Größe und Dateianfang prüfen.** JPEG (`FF D8 FF`), PNG (die feste
   Acht-Byte-Folge) oder WebP (RIFF-Container mit `WEBP` an Stelle 8) — sonst
   `415`. Ein Test lädt ein Shell-Skript als `harmlos.jpg` mit
   `Content-Type: image/jpeg` hoch und erwartet 415.
2. **Dekodieren und als WebP neu schreiben.** Nicht durchreichen. Damit
   verschwinden die EXIF-Daten — bei Fahrzeugbildern regelmäßig der
   Aufnahmeort, und der ist oft die Wohnadresse der verkaufenden Person. Ein
   Test erzeugt ein JPEG mit EXIF-Feldern, lädt es hoch, holt es wieder und
   prüft, dass weder EXIF-Block noch der Copyright-Text darin vorkommen.
   Gedreht wird **vor** dem Verwerfen der Ausrichtung, sonst läge jedes
   Hochkantbild quer.
3. **Erst dann ablegen**, unter einem selbst vergebenen Schlüssel
   (`listings/<anzeige>/<bild>.webp`). Der Dateiname der hochladenden Person
   geht nirgends ein — er kann Pfadanteile, Steuerzeichen oder eine zweite
   Endung enthalten.

Dazu die Grenzen, die kein Bild betreffen, aber einen Angriff: `failOn:
'error'`, eine Pixelgrenze beim Dekodieren (sonst füllt eine kleine Datei mit
riesigen angekündigten Maßen den Arbeitsspeicher) und `animated: false` (ein
animiertes WebP mit tausend Bildern wäre eine günstige Art, Rechenzeit zu
verbrauchen).

Die Ablage steckt hinter `ImageStorage`. Der mitgelieferte Adapter schreibt ins
Dateisystem und funktioniert hier und jetzt; ein Objektspeicher tritt später an
dieselbe Stelle. Der Pfad wird gegen Ausbruch geprüft, obwohl der Schlüssel von
uns selbst stammt — eine Prüfung dort, wo der Pfad entsteht, ist billiger als
die Frage, ob sie weiter oben schon stattgefunden hat.

## Adresszeilen mit Zufallsteil

`buildListingSlug` hängt acht Hexzeichen an. Ohne sie müsste beim Anlegen
gezählt und wiederholt werden, bis ein freier Name gefunden ist — ein Wettlauf,
der unter Last schiefgeht. Der Zufallsteil macht die Eindeutigkeit zur
Eigenschaft des Namens statt zur Frage an die Datenbank.

Umlaute werden ersetzt, nicht gelöscht: aus „Anhängerkupplung" wird
`anhaengerkupplung`, nicht `anhngerkupplung`.

## Eigentum steht in der WHERE-Bedingung

Jede schreibende Abfrage trägt `sellerId` in der Bedingung — nicht erst lesen
und dann vergleichen. Das ist kein Stil, sondern zweierlei: ein Wettlauf
weniger, und eine Zeile weniger, die man vergessen kann.

Eine fremde Anzeige antwortet mit **404, nicht 403**. Ein Verbot bestätigte,
dass es diese Kennung gibt.

Gemerkt werden können nur sichtbare Anzeigen — sonst ließe sich über das Merken
prüfen, ob eine bestimmte Kennung existiert. Das Entfernen geht dagegen immer:
Wer eine inzwischen verkaufte Anzeige aus seiner Liste nehmen will, soll das
können. Die Merkliste zeigt verkaufte und abgelaufene Anzeigen weiter an und
kennzeichnet sie, statt sie stillschweigend zu verschlucken.

## Suchmaschinen

Sprechende Adresse, eigener Titel und eigene Beschreibung je Anzeige,
`og:`-Angaben mit Vorschaubild und strukturierte Daten nach schema.org.

Die strukturierten Daten enthalten **nur, was auch auf der Seite steht**.
Bewertungen oder Verfügbarkeiten zu erfinden, die es nicht gibt, wäre schlicht
falsch. `<` wird im JSON ersetzt — ohne das ließe sich aus einem Anzeigentext
heraus das `script`-Element schließen.

Die Sitemap enthält nur tatsächlich sichtbare Anzeigen; eine Sitemap mit
Adressen, die 404 liefern, schadet mehr als sie nützt. `robots.txt` sperrt bis
zur Produktionsfreigabe alles — ein halbfertiger Marktplatz gehört nicht in
einen Index, denn die Adressen bleiben dort stehen, lange nachdem sie nicht
mehr stimmen.

## Der Fund aus dem Browserdurchlauf

**Ein leeres Filterfeld brach die ganze Suche.** Ein gewöhnliches
GET-Formular sendet alle Felder, auch die leeren:
`?q=&preisVon=5000&preisBis=`. Die Prüfung scheiterte an `preisBis: ""` — und
damit für die gesamte Anfrage. In der Oberfläche sah das aus wie „Filter
ignoriert", an der Schnittstelle war es ein Fehler 400. Der eine gesetzte
Filter ging mit unter.

Das ist derselbe Fehlertyp wie in der Fahrzeugsuche (`baujahrVon` als
`z.number()` auf einem Query-Parameter), nur eine Stufe später: dort scheiterte
die Wandlung, hier die Leere. Behoben durch `leerAlsFehlend()` um jedes
optionale Feld, abgesichert durch einen Test, der genau die Formulareingabe mit
leeren Feldern prüft.

Gefunden hat ihn nicht der Test, sondern der Blick auf die Adresszeile im
Browserdurchlauf. Das ist der Grund, warum die Durchläufe stattfinden.
