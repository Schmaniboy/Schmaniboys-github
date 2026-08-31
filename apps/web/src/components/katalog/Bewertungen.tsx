import { type Score, type ScoreResult, hatBewertung } from '@ap/core';

import { Card, CardBody, CardHeader } from '@/components/ui/Card';

/**
 * Bewertungen von 0 bis 100 -- oder die Begruendung, warum es keine gibt.
 *
 * Der zweite Fall ist der haeufigere und der wichtigere. Eine 72, hinter der
 * nichts steht, sieht aus wie ein Messergebnis; ein Satz, der sagt "dafuer
 * sind zu wenige Schwachstellen erfasst, und wenige Eintraege heissen nicht
 * wenige Probleme", ist die ehrlichere Auskunft.
 *
 * Deshalb wird der leere Fall hier nicht ausgeblendet, sondern angezeigt.
 */

function Balken({ wert }: { wert: number }) {
  const ton =
    wert >= 70 ? 'bg-positive' : wert >= 40 ? 'bg-accent' : 'bg-caution';
  return (
    <div
      className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2"
      role="img"
      aria-label={`${wert} von 100`}
    >
      <div className={`h-full rounded-full ${ton}`} style={{ width: `${wert}%` }} />
    </div>
  );
}

function Eintrag({ titel, ergebnis }: { titel: string; ergebnis: ScoreResult }) {
  if (!hatBewertung(ergebnis)) {
    return (
      <div className="space-y-1.5 px-5 py-4">
        <p className="text-sm font-medium text-ink">{titel}</p>
        <p className="text-sm leading-relaxed text-ink-subtle">{ergebnis.reason}</p>
      </div>
    );
  }

  const note = ergebnis as Score;

  return (
    <div className="space-y-2 px-5 py-4">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm font-medium text-ink">{titel}</p>
        <p className="font-mono text-lg tabular-nums text-ink">
          {note.value}
          <span className="text-sm text-ink-subtle">/100</span>
        </p>
      </div>
      <Balken wert={note.value} />
      <p className="text-sm leading-relaxed text-ink-muted">{note.basis}</p>
      {note.inputs.length > 0 ? (
        <dl className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-ink-subtle">
          {note.inputs.map((eingang) => (
            <div key={eingang.label} className="flex gap-1.5">
              <dt>{eingang.label}:</dt>
              <dd className="font-mono tabular-nums text-ink-muted">{eingang.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </div>
  );
}

export function Bewertungen({
  eintraege,
}: {
  eintraege: { titel: string; ergebnis: ScoreResult }[];
}) {
  return (
    <Card className="mt-10">
      <CardHeader
        title="Bewertung"
        description="Jede Zahl steht mit ihrer Herleitung da. Wo die Datengrundlage nicht trägt, gibt es keine Zahl — und der Grund steht dabei."
      />
      <CardBody className="divide-y divide-line p-0">
        {eintraege.map((eintrag) => (
          <Eintrag key={eintrag.titel} titel={eintrag.titel} ergebnis={eintrag.ergebnis} />
        ))}
      </CardBody>
    </Card>
  );
}
