# Offene Punkte

Führend für den Status ist `PROGRESS.json`. Hier steht, was die Punkte
fachlich bedeuten und wie ohne ihre Klärung weitergearbeitet wird.

## B3 · Redaktionskapazität für Katalogdaten — hoch

Offen ist, wer Katalogdaten erfasst und wer freigibt. Struktur, Oberfläche und
Werkzeuge der Phasen 2–6 sind unabhängig davon baubar; nur die Befüllung hängt
daran. Das Schema führt deshalb von Anfang an einen Redaktionsstatus
(`DRAFT` → `IN_REVIEW` → `PUBLISHED`) und ein Quellenfeld mit.

## B4 · Marktdatenquelle für die Bewertung — offen, aber nicht mehr blockierend

**Stand 2026-08-22:** Phase 8 ist gebaut und läuft ohne diese Quelle. Was
fehlt, ist ausschließlich der Betrag in Euro — die Faktorenanalyse,
die Begründungen, die Ausweisung fehlender Angaben und die Oberfläche stehen.
Ohne Quelle sind `marketValueCents`, `suggestedListingCents` und
`realisticRange` null und es wird nichts abgebucht (siehe ADR-006 und
`10-Bewertung.md`).

Was eine Quelle mitbringen muss, steht im Typ `MarketBasis`: Stichprobengröße,
Beobachtungszeitraum, Quellenbezeichnung und die Unterscheidung zwischen
Angebots- und erzielten Preisen. Ein Anbieter, der nur eine Zahl liefert,
reicht nicht.

Der Fallback aus der Ursprungsfassung — eigene Angebotsdaten auswerten — wird
ab Phase 9 möglich, sobald es Anzeigen gibt. Dann greift `priceKind: 'ASKING'`
samt Abschlag und ausgewiesener geringerer Güte.

### Ursprüngliche Fassung

*Heraufgestuft von „mittel".* Ohne Vergleichsangebote ist der Kernnutzen von
Phase 8 nicht lieferbar, nur die Rechenhülle. Vorgehen: Schnittstelle
`MarketDataSource` bauen, Bewertung mit ausgewiesener Güte und Datenbasis
ausgeben, Ergebnis ohne Quelle klar als „nicht belastbar" kennzeichnen.
Niemals eine Zahl ohne Herkunft ausgeben (C3).

## B7 · VIN-Auflösung über WMI hinaus — gelöst (Phase 7)

**Gelöst am 2026-08-22, nicht durch eine Datenquelle, sondern durch den
Ablauf.** Der Entwurf zeigt aus der VIN nur Belegbares (WMI, Modelljahr*hinweis*
mit zwei Kandidaten, Werkscode) und lässt den Verkäufer das Fahrzeug aus real
veröffentlichten Katalogeinträgen bestätigen. `generateListingTexts` verweigert
den Dienst ohne `catalogConfirmedAt` — die KI kann kein geratenes Fahrzeug
beschreiben, weil sie nie eines bekommt. Einzelheiten in
`09-Verkaufsassistent.md`.

Ein kostenpflichtiger Auflösungsdienst bleibt möglich, ist aber nicht nötig:
Er würde die Bestätigung durch den Verkäufer bequemer machen, nicht ersetzen —
verantwortlich für die Angabe bleibt ohnehin der Verkäufer.

### Ursprüngliche Fassung

Aus einer VIN sind nach ISO 3779/3780 zuverlässig nur Herstellerkennung (WMI),
Modelljahrcode und Werkscode ableitbar. **Modell, Generation und Motorcode
sind nicht aus der VIN berechenbar** — dafür braucht es herstellerspezifische
Datenbestände oder einen kostenpflichtigen Dienst. Phase 7 setzt das aber
voraus.

Konsequenz für den Bau: Der Ablauf heißt **„VIN schlägt vor → Nutzer
bestätigt"**, nicht „VIN erkennt Fahrzeug". Alles, was nicht belegbar ist,
wird als Vorschlag gekennzeichnet und muss bestätigt werden. Ein Rateergebnis
als Tatsache auszugeben verstößt gegen C3.

## B8 · E-Mail-Zustellung — mittel (neu)

Registrierungsbestätigung und Passwort-Zurücksetzen brauchen einen Versandweg.
Kein Anbieter festgelegt. Vorgehen: `MailSender`-Schnittstelle bauen, in der
Entwicklung protokollierender Adapter, Versand bis zur Anbieterwahl
abgeschaltet. Die Registrierung funktioniert dadurch ohne Verifikation —
das ist bewusst und muss vor Produktivbetrieb geschlossen werden.

## B5 · Zahlungsanbieter — niedrig

Kein Stripe (C1). Die Billing-Abstraktion (`createCheckout`, `verifyPayment`,
`handleWebhook`, `refundPayment`, `getPaymentStatus`) ist ohne Anbieter
vollständig baubar.

**Ergänzung zu Rechnungen:** In Deutschland besteht seit 2025 eine
B2B-Empfangspflicht für E-Rechnungen. Das Rechnungsmodell wird deshalb so
angelegt, dass ein strukturiertes Format (EN 16931) später ergänzt werden
kann. Es werden keine rechtlichen oder steuerlichen Garantien behauptet.

## B6 · Markenname, Domain, Logo — niedrig

Designsystem, Typografie und Komponenten sind unabhängig davon umsetzbar. Der
Arbeitstitel im Code ist neutral gehalten und an einer Stelle austauschbar.

## Erledigt

- **B1 Tech-Stack** — entschieden in ADR-001 (Variante B).
- **B2 Kein Git-Repository** — erledigt, das Projekt liegt in Git.
