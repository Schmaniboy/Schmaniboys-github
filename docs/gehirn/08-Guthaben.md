# Token-Guthaben

Umsetzung: `packages/core/src/wallet/`, `packages/core/src/usecases/wallet.ts`,
`packages/db/src/repositories/wallet.ts`.

## Warum vorgezogen

Das Guthabensystem steht im MASTERPLAN in Phase 11 — gebraucht wird es aber in
Phase 7. Dort heißt es: **„keine KI-Ausführung ohne ausreichendes Guthaben"**.
Ohne Wallet wäre diese Regel nicht umsetzbar gewesen; man hätte sie
nachträglich in jeden KI-Aufruf einziehen müssen.

Vorgezogen wurden 11.1 (Datenmodell), 11.2 (Transaktionstypen), 11.3
(Anzeige), 11.4 (Sicherheit) und 11.5 (Audit-Log). Billing und Rechnungen
(11.6–11.9) bleiben an ihrer Stelle — sie hängen an Blocker B5 und werden für
Phase 7 nicht gebraucht.

## Das Verfahren: reservieren, ausführen, buchen

Ein KI-Aufruf dauert Sekunden und kann scheitern.

- Wer **erst danach bucht**, verschenkt Leistung an Abbrecher.
- Wer **vorher bucht**, nimmt Geld für einen Aufruf, der nie ankam.

Deshalb: Betrag **reservieren**, Aufruf **ausführen**, bei Erfolg **buchen**,
bei Misserfolg **freigeben**.

Während der Ausführung ist der Betrag blockiert, aber nicht abgebucht — das
Guthaben bleibt sichtbar, das Verfügbare sinkt. Ein Test hält genau diesen
Zwischenzustand fest.

## Gleichzeitigkeit — der eigentliche schwierige Teil

Zwei Anfragen dürfen nicht beide reservieren, wenn das Guthaben nur für eine
reicht. Ein Lesen-Prüfen-Schreiben in der Anwendung genügt dafür **nicht**:
Zwischen Lesen und Schreiben passt eine zweite Anfrage.

Die kritischen Schritte sind deshalb **bedingte UPDATEs**, die die Prüfung
selbst enthalten:

```sql
UPDATE "Wallet"
SET "reservedTokens" = "reservedTokens" + $betrag
WHERE "userId" = $id
  AND "balanceTokens" - "reservedTokens" >= $betrag
```

Die Datenbank entscheidet, nicht die Anwendung — `rowCount` sagt, ob es
geklappt hat. Prisma kann in `where` keine Spalte mit einer anderen Spalte
vergleichen, deshalb laufen genau diese Stellen als SQL. Das ist kein
Notbehelf, sondern der Punkt: Die Bedingung gehört in dieselbe Anweisung wie
die Änderung.

**Getestet:** Bei Guthaben 75 und sieben gleichzeitigen Reservierungen über je
20 gelingen genau drei. Mit einem Lesen-Prüfen-Schreiben gingen alle sieben
durch.

## Keine Doppelbuchungen

Jede Buchung und jede Reservierung trägt eine eindeutige `reference`. Wird
derselbe Vorgang zweimal gemeldet — wiederholter Webhook, Doppelklick,
Netzwerkwiederholung — scheitert die zweite an der Eindeutigkeitsbedingung und
gibt die **erste Buchung zurück**, statt ein zweites Mal zu belasten.

## Prüfbedingungen in der Datenbank

Prisma kennt keine CHECK-Bedingungen im Schema, deshalb von Hand in einer
eigenen Migration:

- `balanceTokens >= 0`
- `reservedTokens >= 0`
- `reservedTokens <= balanceTokens`
- Reservierungsbetrag `> 0`, Buchungsbetrag `<> 0`, Stand danach `>= 0`

Sie sind die letzte Verteidigungslinie. Ohne sie wäre „keine negativen
Guthaben" eine Zusage der Anwendung; mit ihnen ist es eine Zusage der
Datenbank. Zwei Tests versuchen ausdrücklich, sie zu verletzen.

## Abgelaufene Reservierungen

Eine Reservierung ohne Ablauf blockiert Guthaben für immer, wenn ein Aufruf
hängenbleibt — das fällt der betroffenen Person sofort auf und ist schwer zu
erklären. Jede Reservierung läuft nach 15 Minuten ab; der Worker-Prozess gibt
abgelaufene frei und markiert sie als `EXPIRED`.

Vor dem Freigeben wird erneut geprüft: Zwischen Lesen und Buchen kann der
Vorgang doch noch erfolgreich abgeschlossen worden sein.

## Vorzeichen und Historie

Verbrauch wird **negativ** gebucht, Gutschriften positiv. Jede Buchung führt
zusätzlich den `balanceAfter` mit — das macht die Historie ohne Nachrechnen
lesbar und deckt Unstimmigkeiten auf.

## Preise an einer Stelle

`wallet/policy.ts` nennt jede kostenpflichtige Funktion mit ihrem Preis. Sonst
kostet dieselbe Funktion an zwei Orten Verschiedenes, und niemand merkt es.
Die Beträge sind eine erste Festlegung, keine kaufmännische Entscheidung — die
steht noch aus.

## Offen

- **Aufladen ist nicht möglich** (Blocker B5, kein Zahlungsweg). Die Abrechnung
  selbst funktioniert bereits; nur der Weg, Guthaben zu erwerben, fehlt.
  Gutschriften durch die Administration sind möglich und werden protokolliert.
- Rechnungen (11.7–11.9) folgen mit Phase 11.
