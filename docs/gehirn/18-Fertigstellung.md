# Fertigstellung: Zahlung, Post, Bildrecht und Redaktionsarbeit

Phasen 17 und 18. Nach dem Datenbank-Ausbau stand das Datenmodell, aber vier
Dinge liefen noch gegen eine Wand: Es gab keinen Zahlungsanbieter, keinen
Postweg, keine Rechtsgrundlage für Bilder und keinen Ort, an dem jemand die
Datensätze tatsächlich freigibt. Alle vier sind jetzt vollständig gebaut —
nicht als Andeutung, sondern bis zu der Stelle, an der nur noch Zugangsdaten
fehlen.

Die vier offenen Entscheidungen aus Phase 16 sind entschieden und als
ADR-012 bis ADR-016 protokolliert.

---

## Mollie: der Fehler, den der Attrappenanbieter versteckt hat

Der Zahlungsanschluss aus Phase 11 hatte bewusst keinen Anbieter (ADR-010).
Mit Mollie (ADR-012) fiel sofort ein Fehler auf, den die Attrappe nie zeigen
konnte: `confirmTokenPurchase` hat dem Anbieter **unsere eigene** Vorgangs-
kennung übergeben und nach dem Status gefragt. Solange der Anbieter „nicht
verfügbar" meldete, kam es nie so weit. Beim ersten echten Kauf wäre jede
Bestätigung fehlgeschlagen.

Der Vorgang trägt jetzt `providerReference` — die Kennung, die Mollie selbst
vergeben hat — und die Bestätigung fragt damit nach.

Der Webhook liest aus dem Rumpf der Anfrage **nur die Kennung**. Alles
Weitere — Betrag, Status, Währung — wird beim Anbieter neu abgefragt. Ein
Webhook ist eine unbeglaubigte Nachricht von außen; wer ihr den Betrag
glaubt, lässt sich Guthaben schenken.

Beträge gehen als Zeichenkette mit zwei Nachkommastellen (`"10.00"`) an
Mollie und liegen intern in ganzen Cent. Zwischen beiden wird an genau einer
Stelle umgerechnet.

---

## Post: SMTP, weil es keine Anbieterentscheidung braucht

Für E-Mail war keine fünfte Entscheidung nötig. SMTP ist ein Standard, kein
Erzeugnis einer Firma: Derselbe Adapter arbeitet mit Postmark, Brevo,
Mailgun, SES oder einem eigenen Server, und der Wechsel ändert vier
Umgebungsvariablen statt Code (ADR-016).

Ist nichts eingerichtet, wirft der Versandweg mit Begründung, statt still zu
verschlucken. Ein verschluckter Versand wäre der schlimmere Zustand:
Registrierungen liefen scheinbar durch, und niemand bekäme je eine
Bestätigung.

### Die Auskunft, die eine Passwortmeldung nicht geben darf

„Passwort vergessen" antwortet **immer gleich** — ob die Adresse ein Konto
hat oder nicht. Eine unterscheidende Antwort ist ein Werkzeug, um
Adresslisten abzuklopfen: Wer „unbekannte Adresse" liest, hat gerade
erfahren, wer hier ein Konto hat.

Zwei weitere Regeln stehen im Kern und nicht in den Routen, damit sie überall
gleich gelten:

- **Gültigkeitsdauer nach Schadensfall bemessen.** Zurücksetzen 60 Minuten,
  Bestätigung 7 Tage. Ein abgefangener Zurücksetzlink übernimmt das Konto;
  ein abgefangener Bestätigungslink bestätigt eine Adresse, die dem
  Angreifer ohnehin gehört.
- **Höchstens drei offene Token je Person und Zweck.** Ohne Grenze ließe
  sich ein fremder Posteingang mit Zurücksetzmails fluten — und weil die
  Antwort nicht unterscheidet, merkt der Absender nicht einmal, ob die
  Adresse überhaupt zu einem Konto gehört.

---

## Bilder: Herkunft und Rechtsstand sind zwei Fragen

`origin` sagt, **woher** ein Bild kommt. `sourceType` sagt, **was** es ist:
`original | licensed | generated` (ADR-013). Die Reihenfolge bei der Auswahl
ist genau diese — Herstellerbild vor Lizenzbild vor erzeugtem Bild.

Der Rechtsstand ist davon unabhängig und entscheidet **zuerst**: Vor jeder
Bewertung nach Passgenauigkeit fällt heraus, was nicht veröffentlicht werden
darf. Ein perfekt passendes Bild ohne geklärte Rechte ist kein Bild.
`ATTRIBUTION_REQUIRED` wird veröffentlicht, aber nur mit Urhebernennung —
und die Nennung ist Pflichtfeld, nicht Empfehlung.

Ohne Lizenzangabe wird gar nicht erst gespeichert.

Für erzeugte Bilder gilt die Grenze aus ADR-014: Ein KI-Bild darf gezeigt
werden, es darf aber **kein Fahrzeugmerkmal behaupten**, das nicht belegt
ist. Deshalb liefert `baueBildAnweisung()` neben dem Text auch
`unverifiedAspects` und `sufficient` — reichen die belegten Merkmale nicht
für ein eindeutiges Bild, wird keines erzeugt. Es bleibt bei
„Kein verifiziertes Bild verfügbar." Ein falsches Bild ist schlechter als
kein Bild.

---

## Der Redaktionsarbeitsplatz

Bis hierher gab es die Zustände `DRAFT → IN_REVIEW → PUBLISHED → ARCHIVED`
im Datenmodell, aber keine Oberfläche, in der sie jemand bewegt. Der
Arbeitsplatz unter `/admin/katalog` zeigt jetzt, was in welchem Zustand
liegt, zählt es und lässt es weiterschalten — Veröffentlichen weiterhin nur
mit mindestens einer Quelle.

Dazu kam die Dublettensuche über Ausstattungsnamen: Dieselbe Ausstattung
zweimal erfasst ist kein kosmetischer Fehler, sondern führt dazu, dass die
Verfügbarkeitsangaben auseinanderlaufen.

Sichtbar geworden sind in dieser Phase außerdem Sondermodelle, Lackfarben,
Räder, Modelljahre, Bewertungen und der Merkzettel — alles war im
Datenmodell vorhanden und in der Anwendung nicht erreichbar.

**Schwachstellen können jetzt enden.** `resolvedFromYear` und
`resolvedHowToIdentify` sagen, ab wann ein bekanntes Problem behoben war und
woran man das am Fahrzeug erkennt. Ohne das steht ein Mangel aus dem
Baujahr 2009 bis heute drohend beim Baujahr 2015 — und wird damit als Hinweis
wertlos.

---

## Fehler dieser Phase

**Die Blocker B5 und B8 waren erledigt und standen weiter offen.** Sie waren
mit `resolved` markiert, der Statusbericht liest aber `geloest`. Beides
nebeneinander bedeutete: erledigte Arbeit blieb als offene Baustelle
gemeldet.

**Der Statusbericht gab rohe Datenbanknamen aus** („18 UNVERIFIED"), und die
Güte-Auszählung kannte die in Phase 16 hinzugekommenen Tabellen nicht — sie
zählte also zu wenig und nannte es vollständig.

**Drei schreibende Endpunkte hatten keine Aufrufgrenze.** Sie sind
nachgezogen.

**Die Verfügbarkeitsrangfolge stand doppelt** — einmal im Kern, einmal in
der Datenbankschicht. Zwei Wahrheiten über dieselbe Frage sind eine zu viel;
`AVAILABILITY_RANK` kommt jetzt nur aus dem Kern.

**Die Aufräumroutine des Seeds kannte die neuen Tabellen nicht** und lief
beim `--entfernen` in einen Fremdschlüsselfehler.

**Ein dunkler Lackmusterkreis war auf dunklem Grund unsichtbar.** Er trägt
jetzt einen Innenring.

**Ein Test war von der Uhrzeit abhängig, nicht vom Code.** Der Live-Test von
„Passwort vergessen" fiel beim zweiten Lauf innerhalb einer Stunde durch —
der Endpunkt lässt fünf Anfragen je Stunde und IP zu, und alle Testläufe
kommen von derselben Adresse. Die Begrenzung ist richtig und bleibt; die
Tests bekommen je Aufruf eine eigene Aufruferadresse aus dem
Dokumentationsbereich 203.0.113.0/24.

Das geht nur, weil `x-forwarded-for` ohne vertrauenswürdigen Proxy fälschbar
ist — und genau deshalb steht in `helpers/adresse.ts` ausdrücklich, dass
diese Tests damit **nichts** über die Wirksamkeit der Begrenzung aussagen.
Dafür gibt es einen eigenen Test, der sie tatsächlich auslöst.

---

## Was geprüft wird, bevor etwas als fertig gilt

`scripts/pruefe-deployment.ts <adresse>` prüft von außen, was sich von außen
prüfen lässt: ob die wichtigen Seiten antworten, ob die geschützten
Endpunkte **ohne** Anmeldung tatsächlich abweisen, und ob die
Sicherheitskopfzeilen gesetzt sind. Das läuft gegen die lokale Instanz
genauso wie gegen Vercel.

Der Punkt dabei ist der mittlere: Eine Anwendung, die im angemeldeten
Zustand richtig aussieht, sagt nichts darüber, wie sie sich ohne Anmeldung
verhält.

---

## Was weiterhin fehlt — und warum

**Fahrzeugdaten.** Unverändert die Lage aus Phase 16: Diese Umgebung
erreicht keine Herstellerunterlagen und keine Fahrzeugdatenbank (ausgehende
Verbindungen dorthin werden vom Proxy abgewiesen). Gebaut ist die
Import-Pipeline mit Trockenlauf, Quellenpflicht und Prüfbericht. Gefüllt
wird sie mit echten Unterlagen, nicht aus dem Gedächtnis.

**Zugangsdaten.** Mollie-Schlüssel, SMTP-Zugang und die Datenbank-URL stehen
als Umgebungsvariablen in `.env.example` und `docs/DEPLOYMENT.md`. Kein
Schlüssel steht im Quelltext, und keiner ist erfunden.
