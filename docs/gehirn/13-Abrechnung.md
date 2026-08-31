# Abrechnung und Rechnungen

Umsetzung: `packages/core/src/ports/payment-provider.ts`,
`packages/core/src/billing/`, `packages/core/src/usecases/billing.ts`,
`packages/db/src/repositories/invoices.ts`, `apps/web/src/app/konto/rechnungen/`.

## Kein Stripe — und auch kein Ersatz-Stripe

Vorgabe C1 des MASTERPLAN ist eindeutig: kein Stripe, Zahlungslogik
providerunabhängig. `PaymentProvider` hat genau die fünf Methoden, die der
Plan nennt: `createCheckout`, `verifyPayment`, `handleWebhook`,
`refundPayment`, `getPaymentStatus`. Mehr wäre geraten.

Es gibt **keinen Adapter für einen echten Anbieter**. Einen zu bauen, ohne
dass ein Anbieter feststeht, hieße dessen Schnittstelle zu erfinden — und
das Ergebnis sähe funktionierend aus. Eingerichtet ist
`UnavailablePaymentProvider`; er meldet sich als nicht verfügbar und nennt
den Grund.

`handleWebhook` bekommt den **Rohkörper** und die Kopfzeilen, nicht geparstes
JSON: Eine Signatur wird über die unveränderten Bytes gebildet, und geparstes
und wieder serialisiertes JSON sind nicht dieselben Bytes.

## Der Kaufablauf und seine drei Absicherungen

1. **Vorgang anlegen**, mit eigener Kennung, *bevor* jemand irgendwohin
   geschickt wird. Ohne sie ließe sich eine Rückmeldung des Anbieters keinem
   Kauf zuordnen — und eine doppelte nicht als solche erkennen.
2. **Zum Anbieter schicken.**
3. **Gutschreiben**, erst nach Rückfrage beim Anbieter.

Die Verfügbarkeitsprüfung steht **vor** dem Anlegen des Vorgangs — wie beim
Verkaufsassistenten und bei der Bewertung. Ein Vorgang, der nie zu einer
Zahlung führen kann, gehört nicht in die Datenbank. Ein Test prüft, dass bei
fehlendem Zahlungsweg die Zahl der Vorgänge unverändert bleibt.

Beim Bestätigen greifen drei Sperren, in dieser Reihenfolge:

* **Der Rückleitung wird nicht geglaubt.** Sie kommt vom Gerät der zahlenden
  Person und lässt sich dort verändern. Der Zustand kommt aus einer Nachfrage
  beim Anbieter.
* **Der Betrag wird geprüft.** Ein gezahlter Betrag unter dem erwarteten wird
  nicht gutgeschrieben — sonst ließe sich mit einem manipulierten
  Anbietervorgang billiger einkaufen.
* **Genau einmal auf bezahlt setzen.** Das bedingte `UPDATE ... WHERE state
  IN ('PENDING','AUTHORIZED')` gibt zurück, ob es der erste war. Erst danach
  wird gutgeschrieben; eine zweite Rückmeldung ändert nichts und sagt das
  auch.

Zusätzlich prüft die Route den Besitz des Vorgangs. Sie ist von außen
erreichbar, und ohne diese Prüfung ließe sich mit einer fremden
Vorgangskennung deren Zustand abfragen.

## Rechnungsnummern: der eigentlich heikle Teil

Eine Rechnungsnummer muss eindeutig und fortlaufend sein. Beides bricht unter
Last, wenn man liest, rechnet und dann schreibt — zwei gleichzeitige Aufrufe
bekämen dieselbe Nummer.

Umgesetzt als `upsert` mit `increment` auf einer Zählerzeile je Jahr,
innerhalb derselben Transaktion wie die Rechnung. Der Test dazu legt acht
Rechnungen gleichzeitig an und prüft, dass acht verschiedene, lückenlos
aufsteigende Nummern herauskommen.

Format: `AP-<Jahr>-<fünfstellig>`. Ein Überlauf über 99.999 im Jahr wird
gemeldet, statt still abzuschneiden — abgeschnitten ergäbe er doppelte
Nummern.

**Gelöscht wird nie.** Eine Rechnung wird storniert, mit Pflichtbegründung;
die Zeile bleibt. Löschen bekäme die Nummernfolge Lücken, und eine Rechnung,
die es nicht mehr gibt, lässt sich nicht mehr erklären.

## Beträge in Cent, Steuersatz als Konfiguration

Gerechnet wird in **ganzen Cent**. Gleitkommazahlen lügen bei Geld; bei einer
Rechnung fällt das irgendwann auf, und dann ist es ein Buchhaltungsfehler.
Gerundet wird vom Nullpunkt weg — `Math.round(-0.5)` ist `-0` und für Beträge
falsch.

Die Steuer wird **auf die Summe** gerechnet, nicht je Position und dann
addiert. Beides ist vertretbar, die Ergebnisse unterscheiden sich um
Cent-Beträge — wer beides mischt, bekommt Rechnungen, deren Summe nicht
aufgeht.

Der Steuersatz ist eine **Einstellung** (`TAX_RATE_BASIS_POINTS`, in
Basispunkten: 1900 = 19,00 %), keine Konstante des Codes. Er wird mit jeder
Rechnung gespeichert; eine spätere Änderung darf ausgestellte Rechnungen
nicht umschreiben. Ein Steuersatz von 0 mit Hinweistext ist vorgesehen — etwa
für die Steuerschuldnerschaft des Leistungsempfängers —, aber welcher Fall
vorliegt, entscheidet nicht dieser Code.

Auch die Preise stehen als **Netto**: Ein Bruttopreis ließe sich bei
geändertem Satz nicht sauber zerlegen. Aus 11,90 € brutto werden bei 7 %
nicht 10,00 € netto, sondern 11,12 €.

## Was hier nicht behauptet wird

Der Plan verlangt: „Rechnungslogik so bauen, dass sie später an die
tatsächlichen rechtlichen/steuerlichen Anforderungen angepasst werden kann.
Keine rechtlichen Garantien behaupten."

Die Rechnung enthält Nummer, Datum, Empfänger, Positionen, Netto, Steuer,
Brutto, Zahlungsstand und Zahlungsreferenz — die im Plan geforderten Angaben.
Ob sie damit allen Anforderungen genügt, sagt diese Anwendung nicht und steht
so auch auf der Rechnungsseite. Anpassbar ist sie an drei Stellen: Steuersatz
und Hinweistext je Rechnung, Nummernformat in `billing/numbering.ts`,
Rechnungsanschrift beim Erstellen.

Die Rechnungsanschrift wird **kopiert, nicht verwiesen** — wie bei den
Anzeigen (ADR-007). Ein Test ändert den Anzeigenamen der Person nach dem
Ausstellen; die Rechnung bleibt unverändert.

Gehört die kaufende Person zu einem Betrieb, wird dessen Anschrift genommen;
sonst reichen Name und E-Mail. Eine Privatanschrift wird nicht erhoben — und
eine zu erfinden wäre absurd.
