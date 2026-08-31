# Nachrichten und Benachrichtigungen

Umsetzung: `packages/core/src/messaging/`,
`packages/db/src/repositories/messaging.ts`,
`apps/web/src/app/konto/nachrichten/`, `apps/web/src/components/messaging/`.

Vorgabe C2: **kein Matrix Synapse.** Die Nachrichten liegen vollständig in
der Plattform — eigene Tabellen, eigene Rechteprüfung, kein zweiter Dienst,
der mitreden könnte.

## Zwei feste Seiten, keine Teilnehmertabelle

Ein Gespräch hat genau einen Initiator und einen Empfänger. Käufer und
Verkäufer — mehr braucht es hier nicht. Eine Gruppenfunktion, die niemand
verlangt hat, wäre zusätzliche Angriffsfläche bei jeder Rechteprüfung.

`@@unique([listingId, initiatorId])`: Zu einer Anzeige gibt es je anfragender
Person genau **ein** Gespräch. Ohne diese Bedingung ließe sich dieselbe
Anzeige beliebig oft anschreiben und damit der Posteingang fluten. Ein
erneutes Anschreiben gibt das vorhandene Gespräch zurück.

Der Fahrzeugbezug wird **kopiert** (`listingLabel`), nicht nur verwiesen —
wie bei den Anzeigen (ADR-007). Wird die Anzeige gelöscht, bleibt das
Gespräch lesbar und man weiß noch, worum es ging.

## IDOR: nicht gefunden, nicht verboten

`assertBeteiligt()` wirft `NOT_FOUND`, wenn jemand nicht beteiligt ist. Ein
403 bestätigte, dass es dieses Gespräch gibt — und damit ließe sich durch
Kennungen blättern.

Die Prüfung steht **doppelt**: in der Domänenschicht und zusätzlich in jeder
`WHERE`-Bedingung. Das ist keine doppelte Arbeit, sondern zwei Schichten:
Fällt eine beim Umbauen weg, greift die andere noch. Ein Test lässt eine
unbeteiligte Person lesen und schreiben — beides 404, und die Zahl der
Nachrichten bleibt unverändert.

Dasselbe bei Benachrichtigungen: Die Benutzerkennung steht in der Bedingung
von `markNotificationsRead`. Ein Test schickt fremde Kennungen mit und prüft,
dass drüben nichts abgehakt wurde.

## Was in einer Benachrichtigung nicht steht

**Der Nachrichtentext.** Eine Benachrichtigung erscheint an Stellen, an denen
sie jemand mitliest — ein Bildschirm im Büro, später vielleicht eine E-Mail.
Sie sagt, *dass* etwas da ist und von wem, nicht *was*. Ein Test prüft, dass
der Nachrichtentext nirgends in der Benachrichtigung auftaucht.

Benachrichtigungen sind eine eigene Tabelle, nicht „ungelesene Nachrichten
zählen": Später kommen Ereignisse dazu, die keine Nachricht sind — eine
ablaufende Anzeige, ein bestätigter Kauf.

Nachricht, Gesprächsstempel und Benachrichtigung entstehen in **einer
Transaktion**. Ohne sie gäbe es Nachrichten ohne Benachrichtigung — und
niemand erführe davon.

## Warnhinweise statt Filter

`findeWarnzeichen()` erkennt vier Muster: Vorkasse und Treuhanddienste, den
Wechsel auf einen anderen Messenger, Spedition und Abholdienste, Zeitdruck.
Das sind die gängigen Bausteine von Betrugsversuchen im Fahrzeughandel.

**Sie sperren nichts.** Die Nachricht kommt an; darüber steht ein Kasten mit
dem Hinweis, worauf zu achten ist, und dem Satz, dass es Anhaltspunkte sind
und keine Beweise. Begründung: Ein Filter, der harmlose Nachrichten
verschluckt, ist schlimmer als ein Hinweis, den jemand ignoriert — und wer
einmal grundlos angemeckert wurde, liest den Hinweis auch dann nicht mehr,
wenn er recht hat. Ein Test prüft ausdrücklich, dass gewöhnliche Fragen
(„Ist das Fahrzeug noch verfügbar?") nicht anschlagen.

Die Hinweise werden bei jedem Lesen frisch berechnet, nicht gespeichert: Die
Muster können sich ändern, und ein alter Befund wäre dann falsch.

## Unsichtbare Zeichen

`pruefeNachricht()` entfernt Steuerzeichen und die Zeichen zur Steuerung der
Leserichtung (`U+202A`–`U+202E`, `U+2066`–`U+2069`) sowie unsichtbare Trenner
(`U+200B`–`U+200F`, `U+FEFF`).

Zwei Gründe, beide getestet:

* Mit `U+202E` lässt sich Text **verkehrt herum** anzeigen — etwa um eine
  Adresse anders aussehen zu lassen, als sie ist.
* Ein unsichtbarer Trenner mitten im Wort (`vor<U+200B>kasse`) umgeht jede
  Wortsuche. Nach dem Entfernen greift die Warnung wieder.

Entfernt, nicht maskiert: Diese Zeichen erfüllen in einer Nachricht keinen
Zweck.

## Anhänge sind Bilder, und nur neu kodierte

„Sichere Anhänge" (Aufgabe 12.6) ist hier wörtlich gemeint: **nur Bilder**,
und jedes wird dekodiert und als WebP neu geschrieben — derselbe Weg wie bei
Anzeigenbildern (ADR-008).

Beliebige Dateien in einem Posteingang wären ein Verteilweg für
Schadsoftware, und ein Posteingang ist genau die Stelle, an der Leute
anklicken, was ihnen jemand schickt. Nach der Neukodierung trägt die Datei
nichts mehr mit sich — weder eingebettete Skripte noch den Aufnahmeort.

Zusätzlich: höchstens fünf Bilder je Nachricht, und anhängen geht nur
innerhalb von zehn Minuten nach dem Senden. Ohne die Frist ließe sich an eine
Monate alte Nachricht noch etwas anhängen, das dort niemand mehr erwartet.

## Zwei Zähler gegen Flut

Die allgemeine Ratenbegrenzung zählt *Aufrufe*. Zusätzlich zählen
`countRecentConversations` und `countRecentMessages` die tatsächlich
angelegten Gespräche und Nachrichten je Stunde — zehn neue Gespräche und
sechzig Nachrichten. Wer zehn Anzeigen anschreibt, hat etwas vor; wer hundert
anschreibt, etwas anderes.

## Entfernte Nachrichten bleiben sichtbar als entfernt

Von der Moderation entfernte Nachrichten werden als entfernt ausgeliefert,
nicht verschwiegen: Ein Loch im Gesprächsverlauf ist verwirrender als ein
Hinweis. Ihre Anhänge werden ebenfalls nicht mehr ausgeliefert — sonst wäre
die Entfernung nur halb.

## Ein Nebenbefund

Beim Schreiben dieses Moduls hat die Werkzeugkette mehrfach die Annahme
verweigert, weil der Quelltext **echte unsichtbare Steuerzeichen** enthielt.
Das ist genau das Problem, gegen das der Code sich richtet — und der
Quelltext schreibt sie jetzt als Escape-Folgen (`\\u202e`), nicht als
Literale. Eine Datei, in der man nicht sieht, was drinsteht, ist ein Risiko,
gleich ob es eine Nachricht oder ein Modul ist.
