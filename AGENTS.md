# AGENTS.md

Die Entwicklungsanweisungen für dieses Repository stehen in [`CLAUDE.md`](./CLAUDE.md).

Kurzfassung für den Einstieg:

1. `MASTERPLAN.md` lesen — der vollständige Plan, 16 Phasen.
2. `STATUS.md` und `PROGRESS.json` lesen — der aktuelle Stand.
3. `docs/gehirn/Entscheidungsprotokoll.md` lesen — warum die Dinge so sind.
4. `npm install && npm run verify` — prüfen, dass der Stand grün ist.

Bindende Vorgaben, die nicht ohne neue Entscheidung gebrochen werden:
kein Stripe, kein Matrix Synapse, keine erfundenen Daten, Design in Schwarz und
Neon Rot, Domänenlogik ausschließlich in `packages/core`.
