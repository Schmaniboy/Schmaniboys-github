# CARONEX

Anweisungen für Entwicklung an diesem Repository. Bei Kontextverlust in dieser
Reihenfolge lesen: `MASTERPLAN.md` → `STATUS.md` → `PROGRESS.json` →
`docs/gehirn/`.

## Was das ist

Eine Plattform für Autokauf und Autoverkauf: Fahrzeug-Wissensdatenbank,
Suche, Marktplatz, Händlerbereich, KI-Verkaufsassistent, Fahrzeugbewertung,
Token-Guthaben, Messaging, Adminbereich. Der vollständige Plan steht in
`MASTERPLAN.md` (16 Phasen, 139 Aufgaben).

## Stack

Next.js (App Router) · TypeScript · Prisma + PostgreSQL · Tailwind CSS v4 ·
Vitest. Monorepo mit npm-Workspaces.

```
apps/web        Seiten + API-Route-Handler
apps/worker     Hintergrundprozesse
packages/core   Domänenlogik (framework-frei)
packages/db     Prisma-Schema, Client, Repositories
```

## Bindende Regeln

| | Regel |
|---|---|
| **C1** | **Kein Stripe.** Zahlungen laufen über eine providerunabhängige Abstraktion. |
| **C2** | **Kein Matrix Synapse.** Messaging vollständig plattformintern. |
| **C3** | **Keine erfundenen Daten.** Technische Daten, Marktwerte, Zugangsdaten werden nie geraten. Fehlendes wird als fehlend gekennzeichnet. |
| **C4** | **Design: Schwarz + Neon Rot.** Premium CARONEX. Keine Gaming-Optik, keine unnötigen Animationen, kein Template-Look. |
| **ADR-001** | **Domänenlogik gehört in `packages/core`.** Route Handler dürfen nur validieren, autorisieren, delegieren. |

Abhängigkeitsrichtung: `core` → nichts. `db` → `core`. `web`/`worker` →
`core`, `db`. Niemals umgekehrt.

**In Client-Komponenten (`'use client'`) niemals aus `@ap/core` sammeln,
sondern den Unterpfad importieren** (`@ap/core/sales/schemas`). Der
Sammelexport enthält serverseitige Teile — Passwort-Hashing zieht
`node:crypto` nach sich, und über den Sammelexport landet das im
Browser-Bundle. Der Build bricht dann mit `UnhandledSchemeError` ab.

## Sicherheitsgrundsätze

- Rechte werden **serverseitig** geprüft. Die Rechtematrix in
  `packages/core/src/auth/roles.ts` ist die einzige Quelle.
- Fremde Datensätze antworten mit `NOT_FOUND`, nicht mit `FORBIDDEN` — sonst
  sind IDs aufzählbar.
- Jede Eingabe von außen geht durch ein Zod-Schema.
- Fehlerantworten sind `AppError`. 5xx-Nachrichten verlassen den Server nie.
- KI-Aufrufe laufen ausschließlich serverseitig, hinter Anmeldung und
  Guthabenprüfung. Kein API-Schlüssel gelangt in ein Client-Bundle.

## Befehle

```bash
npm install
npm run dev          # Next.js unter :3000
npm run typecheck    # tsc über alle Workspaces
npm run lint
npm run test         # Vitest
npm run build
npm run verify       # typecheck + lint + test + build
npm run db:generate  # Prisma-Client erzeugen
npm run db:migrate   # Migration im Entwicklungsmodus
```

## Arbeitszyklus je Phase

Testen → Code Review → Security Review → Fehler beheben → `docs/gehirn/`
aktualisieren → `CHANGELOG.md` → `PROGRESS.json` setzen → `STATUS.md` daraus
spiegeln → Commit.

`PROGRESS.json` ist die Quelle der Wahrheit für den Fortschritt. `STATUS.md`
ist die menschenlesbare Spiegelung davon und wird nie unabhängig gepflegt.
