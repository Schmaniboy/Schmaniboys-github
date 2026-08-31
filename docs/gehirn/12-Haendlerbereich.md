# Händlerbereich

Umsetzung: `packages/core/src/dealer/`,
`packages/db/src/repositories/dealers.ts`, `apps/web/src/app/haendler/`,
`apps/web/src/app/autohaus/[slug]/`.

## Mandantentrennung heißt: die Kennung kommt aus der Sitzung

Der wichtigste Satz dieser Phase: **Welcher Betrieb gemeint ist, steht in der
Sitzung — nicht in der Anfrage.** Keine Route nimmt eine Händlerkennung
entgegen. Eine entgegenzunehmen wäre die Einladung, eine fremde einzusetzen,
und dann hinge alles an einer Prüfung, die man vergessen kann.

Die Kennung geht in jede Bedingung, nicht in einen Vergleich davor. Ein Test
prüft genau das: Der Inhaber von Betrieb B schickt die Benutzerkennung eines
Mitarbeiters aus Betrieb A und bekommt 404 — die Händlerkennung aus seiner
eigenen Sitzung lässt die Bedingung ins Leere greifen.

## Rollen sind Rechte, keine Anzeige

`DEALER_OWNER` darf Profil und Mitarbeiter ändern, `DEALER_STAFF` darf lesen
und im Namen des Betriebs inserieren. Das ist keine Frage ausgegrauter
Schaltflächen: Ein Mitarbeiter bekommt die Mitarbeiterliste **gar nicht erst
geliefert**, weder über die Seite noch über die Schnittstelle.

Zwei Sperren verhindern, dass sich ein Betrieb selbst aussperrt:

* **Der letzte Inhaber lässt sich nicht herabstufen oder entfernen.** Sonst
  entstünde ein Zustand, aus dem nur die Administration befreit: Mitarbeiter
  ohne Rechte, Profil unveränderlich, niemand kann jemanden aufnehmen.
* **Die eigene Rolle lässt sich hier nicht herabstufen**, und aus dem Betrieb
  entfernen kann man sich auch nicht selbst — das ist der schnellste Weg, sich
  auszusperren.

## Aufnehmen statt anlegen

Ein Betrieb kann nur Personen aufnehmen, **die sich selbst registriert
haben**. Konten für andere anzulegen ist ausdrücklich nicht vorgesehen: Sonst
entstünden Konten mit fremden E-Mail-Adressen, von denen die Betroffenen
nichts wüssten — und an denen Rechte hängen.

Personen mit Administrations- oder Redaktionsrolle werden nicht angetastet:
Ein Administrator, der einem Betrieb beitritt, würde sonst zum Mitarbeiter
herabgestuft.

## Öffnungszeiten in Minuten

Gerechnet wird in Minuten seit Mitternacht, nicht in Zeitstempeln:
Öffnungszeiten sind Ortszeit. „Dienstag 8 bis 18 Uhr" gilt im Sommer wie im
Winter, und ein Zeitstempel müsste dafür jedes Mal umgerechnet werden.

Eine Zeile je Zeitspanne, nicht je Tag — Mittagspausen sind der Normalfall,
und „08:00–12:00, 13:00–18:00" lässt sich mit einer Zeile je Tag nicht
abbilden, ohne in ein Textfeld auszuweichen. Überschneidungen am selben Tag
werden abgelehnt und benannt; sie entstehen beim Bearbeiten leicht.

Wochentage zählen nach ISO (1 = Montag … 7 = Sonntag), nicht ab 0. Bei
0 = Sonntag verrechnet sich früher oder später jemand — ein Test prüft
ausdrücklich den Sonntag.

Tage ohne Eintrag erscheinen als **„geschlossen"**, nicht als Lücke: Sie
wegzulassen ließe offen, ob geschlossen ist oder nur nichts eingetragen wurde.

## Kennzahlen tragen ihren Zustand mit

`dealer/statistics.ts`. Jede Kennzahl hat einen Zustand: `GEMESSEN` oder
`NICHT_VERFUEGBAR`. Der Grund steht im wichtigsten Testfall dieser Phase:

**„Anfragen" wird nicht als 0 ausgegeben.** Anfragen laufen über die
plattforminternen Nachrichten, und die gibt es noch nicht (Phase 12). Eine
Null liest sich als „niemand hat sich gemeldet" — das wäre eine Messung, die
nie stattgefunden hat. Stattdessen steht dort ein Strich und der Satz, warum.

Bei der Standzeit wird der **Median** genommen, nicht der Mittelwert: Ein
einzelnes Fahrzeug, das zwei Jahre steht, verschöbe einen Mittelwert so weit,
dass die Zahl nichts mehr über den Normalfall sagt.

Der Tokenverbrauch ist als Näherung gekennzeichnet und auf der Seite erklärt:
Guthaben hängt am Konto der Person, nicht am Betrieb — wer privat etwas
erzeugt, taucht ebenfalls auf.

## Anbieterkennzeichnung

Anders als bei privaten Anzeigen wird für Betriebe die vollständige Anschrift
erhoben: Ein gewerblicher Anbieter ist dazu verpflichtet, und ein Autohaus
ohne Adresse wäre für Kaufinteressenten wertlos.

Die USt-IdNr. wird **nur auf ihre Form geprüft, nicht auf Gültigkeit**. Dafür
bräuchte es eine Abfrage beim Bundeszentralamt für Steuern; eine selbst
gebaute Prüfung gäbe eine Sicherheit vor, die es nicht gibt. Das steht auch so
auf der Seite.

## Das öffentliche Profil liegt woanders

`/autohaus/<slug>`, nicht `/haendler/<slug>`. Unter `/haendler/` liegt der
angemeldete Bereich, und der steht in `NONCE_PREFIXES` — eine öffentliche
Seite unter demselben Präfix würde unnötig dynamisch. Gezeigt werden nur
freigeschaltete Betriebe (`status: ACTIVE`); ein Test prüft, dass ein Betrieb
im Zustand `PENDING` öffentlich 404 liefert.

## Ein Fund beim Bauen

**Das Logo hatte einen festen Ablageschlüssel.** Bilder werden mit
`immutable` und einem Jahr Gültigkeit ausgeliefert — unter demselben
Schlüssel wäre ein ausgetauschtes Logo in Browser-Zwischenspeichern stehen
geblieben, möglicherweise für immer. Jeder Upload bekommt jetzt einen eigenen
Schlüssel, das alte Bild wird danach gelöscht.
