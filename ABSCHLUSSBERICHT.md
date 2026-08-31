# Abschlussbericht

**Stand:** 23. August 2026 · Branch `claude/automotive-platform-7odt3q`

---

## Zuerst: was hier nicht geht

Sie haben nach `D:\Auto-Website`, nach `localhost:PORT` und nach einer
IP-Adresse für Ihr iPhone gefragt.

**Diese Entwicklungsumgebung läuft nicht auf Ihrem PC.** Sie ist ein
abgeschotteter Container in der Cloud; das Repository wurde beim Start frisch
von GitHub geklont. Es gibt hier kein Laufwerk `D:`, keinen Windows-Rechner
und keine Firewall, die sich freigeben ließe.

Die Adresse, die dieser Container hat, ist `192.0.2.2` — das ist ein Bereich
aus RFC 5737, ausdrücklich für Dokumentationsbeispiele reserviert und
weltweit nicht routbar. Eine IP-Adresse, die Sie auf dem iPhone öffnen
könnten, kann ich Ihnen deshalb nicht nennen, und ich erfinde keine.

**Zwei Wege zu einer Vorschau, die Sie wirklich öffnen können:**

1. **Vercel** — vorbereitet, Anleitung in `docs/DEPLOYMENT.md`. Nach dem
   Import des Repositories haben Sie eine öffentliche Adresse, die auf jedem
   Gerät funktioniert. Bild-Uploads gehen dort nicht (siehe unten).
2. **Auf Ihrem eigenen Rechner**, wenn Sie das Repository dort klonen:
   ```
   npm ci && npm run db:deploy && npm run dev -- --hostname 0.0.0.0
   ```
   Next.js gibt dann selbst die Netzwerkadresse Ihres PCs aus. Für das
   iPhone braucht es einmalig eine Windows-Firewall-Freigabe für Node.js auf
   Port 3000, privates Netzwerk.

Der **Bildstand als Artifact** ist der Ersatz, den ich von hier aus liefern
kann: echte Aufnahmen aus dem laufenden Build, auf dem Handy aufrufbar.

---

## Datenabdeckung

```

=== DATENBESTAND ===

      1  Marken                               (Gesamtzahl nicht belegt)
      1  Modelle                              (Gesamtzahl nicht belegt)
      1  Generationen                         (Gesamtzahl nicht belegt)
      1  Facelift-Phasen                      (Gesamtzahl nicht belegt)
      3  Modelljahre                          (Gesamtzahl nicht belegt)
      2  Motoren (Motorcodes)                 (Gesamtzahl nicht belegt)
      2  Ausstattungscodes                    (Gesamtzahl nicht belegt)
      2  Motor-Fahrzeug-Zuordnungen           (Gesamtzahl nicht belegt)
      2  Ausstattungen                        (Gesamtzahl nicht belegt)
      1  Ausstattungspakete                   (Gesamtzahl nicht belegt)
      3  Lackfarben                           (Gesamtzahl nicht belegt)
      1  Radvarianten                         (Gesamtzahl nicht belegt)
      1  Sondermodelle                        (Gesamtzahl nicht belegt)
      0  Bilder mit belegter Herkunft         (Gesamtzahl nicht belegt)
     14  Quellenangaben                       (Gesamtzahl nicht belegt)
      2  Motoren mit erfasstem Motorcode      (100 % des Bekannten)
```

**Verifizierte Datensätze: 0. Nicht verifiziert: 18. Bilder: 0.**

Das ist der Demobestand, jeder Wert darin ausdrücklich als erfunden
gekennzeichnet. Diese Umgebung erreicht keine Herstellerunterlagen oder
Fahrzeugdatenbanken — geprüft, der Proxy weist die Verbindungen ab. Das
Befüllen ist Redaktionsarbeit über die Import-Pipeline, keine
Programmieraufgabe mehr.

---

## Was fertig ist

### Fahrzeugdatenbank

Die vollständige Kette: Marke → Modell → Generation → Facelift-Phase →
Modelljahr → Motorfamilie → Motorcode → Antriebskombination → Getriebe →
Ausstattung → Ausstattungscode → Paket → Sondermodell → Lackfarbe →
Radvariante → technische Daten → Schwachstellen → Wartung → Kosten.

Fünf Verfügbarkeitsarten statt eines Ja/Nein: Serie, Sonderausstattung, nur
im Paket, nur im Sondermodell, marktabhängig. Fünf Gütestufen an jedem
Datensatz: bestätigt, teilweise bestätigt, Erfahrungswert, nicht verifiziert,
zur Prüfung — mit Prüfdatum.

Schwachstellen tragen „behoben ab Baujahr" und woran die reparierte
Ausführung zu erkennen ist. Die Frage, nach der ein Gebrauchtwagenkäufer
sucht: Ist meins das reparierte?

### Funktionen

Smart-Suche (liest Motorcodes, Baureihenkürzel, Bestellnummern, Leistung und
Baujahr auseinander und erklärt, was sie verstanden hat), Filter nach Marke,
Modell, Karosserie, Baujahr, Kraftstoff, Getriebe, Antrieb, Leistung,
Abgasnorm und Baureihe, Fahrzeugvergleich bis vier Varianten,
Ausstattungschecker mit drei Zuständen und gewichtetem Prozentwert,
HSN/TSN-Suche, „Meine Fahrzeuge", Merkzettel, Datenbestandsseite,
Verkaufsassistent mit VIN-Vorschlag und Bestätigung durch die verkaufende
Person, Marktplatz, Händlerbereich, Nachrichten, Guthaben und Rechnungen.

### Bilder

Ein Bild bindet an jedes einzelne Merkmal. Nennen Bild und Datensatz beide
einen Wert und sind die Werte verschieden, fällt das Bild **vollständig**
heraus. Damit kann kein Facelift-Bild an einem Vor-Facelift-Fahrzeug landen.
Wo nichts passt: „Kein verifiziertes Bild verfügbar."

`sourceType` original / lizenziert / erzeugt mit erzwungener Stimmigkeit,
Lizenzstatus als harte Sperre vor der Zuordnung, Vorrangfolge Original →
lizenziert → erzeugt. KI-Bilder als letzter Ausweg, mit Modell, Anweisung und
sichtbarer Kennzeichnung; die Anweisung entsteht ausschließlich aus belegten
Angaben, und was das Bild zwangsläufig zeigt, ohne belegt zu sein, wird
ausgewiesen.

### Datenqualität

Import-Pipeline mit Quellenpflicht je Datei und je Datensatz, Probelauf als
Voreinstellung, Dublettenerkennung, Bericht. Automatische Qualitätskontrolle
gegen innere Widersprüche — Elektromotor mit Turbolader, Euro 6 im Baujahr
1998, 900 Nm bei 85 kW, Facelift vor seiner Generation, Handelsname im
Motorcodefeld. Ein Datensatz mit Befund geht auf „zur Prüfung", auch wenn der
Import ihn als bestätigt mitbringt.

### Verwaltung

Redaktionsarbeitsplatz unter `/admin/katalog`: Entwürfe prüfen, freigeben,
zurückziehen — quer über alle Arten, mit der Quellenzahl bei jedem Eintrag.
Zurückziehen löscht nichts, es nimmt die Sichtbarkeit. Dazu Datenqualität
mit Review-Liste, Dubletten und überfälligen Prüfungen; Benutzer-, Anzeigen-
und Guthabenverwaltung; Protokoll.

### Betrieb

Zahlungen über Mollie (der Webhook wird nicht geglaubt — Mollie signiert
nicht, also fragt der Adapter immer nach). E-Mail über SMTP, nicht über einen
Anbieter-Dialekt. Vercel-Konfiguration, Betriebsanleitung, Prüfskript, CI bei
jedem Push.

---

## Prüfergebnisse

| | Ergebnis |
|---|---|
| **Tests** | 686 grün, 1 übersprungen (61 Dateien) |
| **Typecheck** | sauber über alle vier Pakete |
| **Build** | erfolgreich |
| **ESLint** | ohne Warnung (`--max-warnings 0`) |
| **Alle Seiten** | HTTP 200, Desktop und Handy, keine Konsolenfehler |
| **Mobil 390 px** | keine waagerechte Überbreite |
| **Antwortzeiten** | Katalogseiten 5–65 ms |
| **Geschützte Endpunkte** | ohne Anmeldung 401, fremde Datensätze 404 |
| **Sicherheitskopfzeilen** | alle vier gesetzt |

---

## Bekannte Einschränkungen

1. **Keine Fahrzeugdaten.** Blocker B3 — Redaktionsarbeit, kein Code.
2. **Keine Bilder.** Die Architektur steht, der Bestand ist leer. Bilder
   brauchen eine Rechtsgrundlage je Bild.
3. **Keine Marktdaten** (B4). Die Bewertung liefert deshalb keinen
   Eurobetrag und berechnet nichts.
4. **Bild-Uploads gehen auf Vercel nicht.** Das Dateisystem einer serverlosen
   Funktion lebt nur so lange wie ein einzelner Aufruf. Die Anwendung
   erkennt das und lehnt Uploads mit Begründung ab, statt sie zu verlieren.
   Für Uploads braucht es einen Server mit beschreibbarem Dateisystem.
5. **Markenname, Domain und Logo stehen aus** (B6). Die Kopfzeile trägt an
   genau einer Stelle einen Platzhalter.
6. **Die Motorcode-Prüfung prüft Form, nicht Existenz.** „ABCD" kommt durch.
7. **Der Fortschritt „177 von 177 Aufgaben" zählt Aufgaben, nicht Daten.**
   Beide Zahlen stehen in `STATUS.md` getrennt.

---

## Nächste sinnvolle Schritte

**Ohne neue Voraussetzungen:**

1. Eine erste echte Baureihe über die Import-Pipeline einpflegen. Damit wird
   sichtbar, wo das Format in der Praxis klemmt.
2. Bilder-Verwaltungsoberfläche — Bilder kommen derzeit nur über den Import.
3. Wartungs-, Kosten- und Ausstattungsangaben ebenfalls als Bewertung
   ausweisen; die Rechenlogik dafür steht.

**Braucht eine Entscheidung:**

4. Deployment tatsächlich anlegen (Vercel-Projekt, Datenbank, Variablen).
5. Bildquelle und Lizenzweg — Wikimedia Commons ist der einfachste Einstieg.
6. Markenname, Domain, Logo.
