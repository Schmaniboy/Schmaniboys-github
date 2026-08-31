# Architektur

Beschlossen in ADR-001. Diese Datei beschreibt den Ist-Zustand, nicht den Wunsch.

## Schichten

```
apps/web        Next.js: Seiten (React Server Components) + API-Route-Handler
apps/worker     Hintergrundprozesse (KI-Aufrufe, Rechnungen, Marktdaten)
packages/db     Prisma-Schema, Client, Repositories
packages/core   Domänenlogik: Regeln, Rechte, Validierung, Fehler, Ports
```

## Abhängigkeitsregel

```
core   →  (nichts)
db     →  core
web    →  core, db
worker →  core, db
```

Eine Abhängigkeit in die Gegenrichtung ist ein Fehler, kein Kompromiss.
`packages/core` importiert weder `next`, noch `react`, noch `@prisma/client`.

## Was ein Route Handler darf

Genau vier Dinge, in dieser Reihenfolge:

1. **Validieren** — jede Eingabe durch ein Zod-Schema, bevor sie weitergeht.
2. **Authentifizieren** — Session auflösen, Principal bestimmen.
3. **Autorisieren** — `requirePermission`, danach die Eigentums- bzw.
   Mandantenprüfung.
4. **Delegieren** — Aufruf einer Funktion aus `core` bzw. eines Repositories.

Fachliche Regeln — Guthabenprüfung, Statusübergänge, Preislogik — stehen
niemals im Handler. Diese Regel ist der einzige Grund, warum Variante B
gegenüber Variante A vertretbar ist; ohne sie wäre die Entscheidung falsch.

## Ports und Adapter

`packages/core/src/ports/` definiert Schnittstellen für alles, was von außen
kommt: `Clock`, `RateLimiter`, `JobQueue`, `AuditLogger`. Für jede gibt es
eine Implementierung ohne externe Abhängigkeit, damit die Entwicklung nicht an
fehlenden Diensten hängt.

**Bekannte Grenze:** `InMemoryRateLimiter` und `InMemoryJobQueue` gelten pro
Prozess. Ab der zweiten Instanz sind sie kein verlässlicher Schutz bzw. keine
verlässliche Warteschlange mehr. Der Austausch gegen eine geteilte
Implementierung ist vorgesehen und ändert nur die Verdrahtung, nicht die
Aufrufstellen.

## Fehlerbehandlung

Eine Taxonomie in `core/errors.ts`. Jede API-Antwort mit Fehler entsteht aus
einem `AppError`. Alles andere wird zu `INTERNAL` und antwortet ohne Details.
5xx-Nachrichten verlassen den Server nie im Klartext.

## Rendering und Katalogleistung

Astro lieferte den Katalog statisch aus; dieser Vorteil entfällt mit ADR-001.
Gegenmaßnahme: Katalogseiten werden statisch generiert und über Revalidierung
aktualisiert, nicht bei jedem Aufruf gerendert. Benutzer-, Händler- und
Adminbereiche sind dynamisch und dürfen es sein.
