# Adminbereich und Moderation

Umsetzung: `packages/core/src/admin/moderation.ts`,
`packages/db/src/repositories/admin.ts`, `apps/web/src/app/admin/`.

## Der Grundsatz

**Ein Administrator ist nicht allmächtig, sondern zuständig.** Was er darf,
steht in der Rechtematrix; was er tut, steht im Protokoll; und einiges darf
auch er nicht — nicht aus Misstrauen, sondern weil es sonst niemand mehr
rückgängig machen könnte.

## Wer nichts darf, sieht nichts

Der Adminbereich antwortet Unbefugten mit **404**, nicht mit 403 und nicht
mit einer Anmeldeaufforderung. Dass es ihn gibt, muss niemand erfahren, der
ihn nicht betreten darf. Die Schnittstellen antworten mit 403 — dort ist die
Existenz ohnehin bekannt, sobald jemand den Pfad kennt.

## Vier Sperren bei der Rollenvergabe

1. **Nur SUPER_ADMIN.** `ADMIN_ROLE_ASSIGN` ist die einzige Erweiterung
   gegenüber ADMIN — und der Grund, dass es die Rolle überhaupt gibt.
2. **Niemand ändert die eigene Rolle.** Sich selbst zu erhöhen wäre die
   naheliegendste Rechteausweitung überhaupt.
3. **Die letzte SUPER_ADMIN-Rolle bleibt.** Danach könnte niemand mehr Rollen
   vergeben, auch nicht zurück.
4. **Keine Händlerrollen.** Sie hängen an einem Betrieb und werden dort
   vergeben; eine Händlerrolle ohne Betrieb wäre ein Zustand, den keine
   Prüfung erwartet.

Beim Wechsel *weg* von einer Händlerrolle wird die Betriebszugehörigkeit
gelöst: Eine Person mit Rolle EDITOR und einer Händlerkennung wäre ein
Zustand, den die Mandantentrennung nicht vorsieht.

Beim Sperren gilt entsprechend: nicht das eigene Konto, und eine gewöhnliche
Administration sperrt keine oberste. Sonst wäre die Sperrfunktion ein Weg,
die Aufsicht loszuwerden.

## Sperren beendet Sitzungen

`setUserStatus('BLOCKED')` löscht die Sitzungen der betroffenen Person. Ohne
das bliebe die Sperre wirkungslos, bis die Sitzung von selbst abläuft — bei
einer Woche Laufzeit also lange. Ein Test prüft, dass die Sitzungszahl danach
null ist.

## Jede Maßnahme braucht eine Begründung

`pruefeBegruendung()` verlangt mindestens zehn Zeichen und lehnt „Spam" ab.
Die Begründung geht ins Protokoll und ist später **die einzige Erklärung**
für diese Maßnahme. Die Oberfläche fragt sie vor der Maßnahme ab, nicht
danach: Der Server verlangt sie ohnehin, und vorher zu fragen ist ehrlicher,
als hinterher eine Fehlermeldung zu zeigen.

## Moderation entzieht Sichtbarkeit, sie löscht nicht

Eine moderierte Anzeige geht auf `PAUSED` und gehört weiterhin der
einstellenden Person. Eine moderierte Nachricht wird als entfernt markiert;
der Text bleibt für die Moderation lesbar, wird aber nicht mehr ausgeliefert
— samt ihrer Anhänge, sonst wäre die Entfernung nur halb.

Im Gesprächsverlauf steht an ihrer Stelle ein Hinweis, kein Loch: Eine Lücke
ist verwirrender als eine Erklärung.

Wird der Verdacht ausgeräumt, stellt dieselbe Maßnahme sie zurück.

## Das Protokoll wird gezeigt, nicht bearbeitet

Es gibt keine Schaltfläche, die einen Eintrag ändert oder löscht. Ein
Protokoll, das sich ändern lässt, ist keins. Das steht auch so auf der Seite.

Die Übersicht zeigt nicht alles, sondern **ausgewählte** Ereignisse:
fehlgeschlagene Anmeldungen, Rollenvergaben, Sperrungen, gescheiterte
Zahlungen, Guthabenkorrekturen und Moderationsmaßnahmen. Begründung: Eine
Liste, in der jeder Katalogeintrag steht, liest niemand — und dann fällt auch
das Wesentliche nicht auf. Das vollständige Protokoll bleibt über die
Protokollseite erreichbar.
