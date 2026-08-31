'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

/*
 * Gezielte Unterpfade statt des Sammelexports: `@ap/core` buendelt auch
 * Serverbausteine, die node:crypto brauchen -- die laufen im Browser nicht
 * und brechen den Build.
 */
import { AVAILABILITY_LABELS } from '@ap/core/catalog/availability';
import { EQUIPMENT_AREA_LABELS } from '@ap/core/catalog/equipment-areas';
import type { CheckOption } from '@ap/core/catalog/equipment-check';
import { pruefeAusstattung } from '@ap/core/catalog/equipment-check';
import { RARITY_LABELS } from '@ap/core/catalog/schemas';
import {
  bewerteAusstattungsgrad,
  bewerteSeltenheit,
  hatBewertung,
} from '@ap/core/catalog/scores';

import { Badge } from '@/components/ui/Badge';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';

/**
 * Der Checker als Formular.
 *
 * Drei Zustaende je Ausstattung, nicht zwei:
 *
 *   vorhanden        am Fahrzeug gesehen
 *   nicht vorhanden  am Fahrzeug gesucht und nicht gefunden
 *   ungeprueft       noch nicht nachgesehen
 *
 * Der dritte ist der wichtige. Ohne ihn zaehlt jede noch nicht gepruefte
 * Ausstattung als "fehlt", und der Ausstattungsgrad faellt mit jedem
 * ungeoeffneten Bereich -- was der Nutzer als Aussage ueber das Fahrzeug
 * liest, obwohl es eine Aussage ueber seinen Fortschritt ist.
 */

type Zustand = 'JA' | 'NEIN' | 'OFFEN';

export function AusstattungsChecker({
  optionen,
  generationLabel,
  ausstattungHref,
}: {
  optionen: CheckOption[];
  generationLabel: string;
  ausstattungHref: string;
}) {
  const [zustaende, setZustaende] = useState<Record<string, Zustand>>({});

  const setze = (optionId: string, wert: Zustand) => {
    setZustaende((vorher) => ({ ...vorher, [optionId]: wert }));
  };

  const vorhandenIds = useMemo(
    () => optionen.filter((o) => zustaende[o.optionId] === 'JA').map((o) => o.optionId),
    [optionen, zustaende],
  );

  const geprueft = optionen.filter((o) => (zustaende[o.optionId] ?? 'OFFEN') !== 'OFFEN');

  /*
   * Gerechnet wird nur ueber das GEPRUEFTE. Was noch offen ist, geht gar
   * nicht ein -- weder als vorhanden noch als fehlend.
   */
  const ergebnis = useMemo(
    () =>
      pruefeAusstattung({
        available: geprueft,
        presentOptionIds: vorhandenIds,
      }),
    [geprueft, vorhandenIds],
  );

  const aufpreisGesamt = optionen.filter((o) => o.kind !== 'STANDARD').length;
  const aufpreisGeprueft = geprueft.filter((o) => o.kind !== 'STANDARD').length;

  const note = bewerteAusstattungsgrad(ergebnis.percent, aufpreisGeprueft);
  const seltenheit = bewerteSeltenheit(
    optionen.filter((o) => vorhandenIds.includes(o.optionId)).map((o) => o.rarity),
  );

  const nachBereich = useMemo(() => {
    const gruppen = new Map<string, CheckOption[]>();
    for (const option of optionen) {
      const bereich = option.area ?? 'OTHER';
      gruppen.set(bereich, [...(gruppen.get(bereich) ?? []), option]);
    }
    return [...gruppen.entries()].sort((a, b) =>
      (EQUIPMENT_AREA_LABELS[a[0] as keyof typeof EQUIPMENT_AREA_LABELS] ?? a[0]).localeCompare(
        EQUIPMENT_AREA_LABELS[b[0] as keyof typeof EQUIPMENT_AREA_LABELS] ?? b[0],
        'de',
      ),
    );
  }, [optionen]);

  return (
    <div className="mt-8 space-y-6">
      {/* Ergebnis oben und beim Blaettern sichtbar: Wer abhakt, will die
          Wirkung sehen, ohne jedes Mal nach unten zu springen. */}
      <div className="sticky top-16 z-20 -mx-4 border-y border-line bg-surface-0/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-lg sm:border">
        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
          <div>
            <p className="eyebrow">Ausstattungsgrad</p>
            {hatBewertung(note) ? (
              <p className="font-mono text-3xl tabular-nums text-ink">
                {note.value}
                <span className="ml-1 text-lg text-ink-subtle">%</span>
              </p>
            ) : (
              <p className="max-w-md text-sm leading-relaxed text-ink-muted">{note.reason}</p>
            )}
          </div>
          <div className="text-sm text-ink-muted">
            <p>
              {aufpreisGeprueft} von {aufpreisGesamt} Aufpreisausstattungen geprüft
            </p>
            <p className="text-ink-subtle">
              {vorhandenIds.length} als vorhanden markiert
            </p>
          </div>
          {hatBewertung(seltenheit) ? (
            <div className="text-sm text-ink-muted">
              <p className="eyebrow">Seltenheit</p>
              <p className="font-mono tabular-nums text-ink">{seltenheit.value}/100</p>
            </div>
          ) : null}
        </div>
      </div>

      {aufpreisGeprueft > 0 ? (
        <Card>
          <CardHeader
            title="Was das Ergebnis bedeutet"
            description={`Gerechnet für ${generationLabel}.`}
          />
          <CardBody className="space-y-3">
            {hatBewertung(note) ? (
              <p className="text-sm leading-relaxed text-ink-muted">{note.basis}</p>
            ) : null}
            <ul className="space-y-1.5">
              {ergebnis.caveats.map((hinweis) => (
                <li key={hinweis} className="text-sm leading-relaxed text-ink-subtle">
                  {hinweis}
                </li>
              ))}
            </ul>
            {ergebnis.highlights.length > 0 ? (
              <div className="border-t border-line pt-3">
                <p className="text-sm font-medium text-ink">Bemerkenswert an diesem Fahrzeug</p>
                <ul className="mt-1.5 flex flex-wrap gap-1.5">
                  {ergebnis.highlights.map((option) => (
                    <li key={option.optionId}>
                      <Badge tone="positive">{option.name}</Badge>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {ergebnis.notableGaps.length > 0 ? (
              <div className="border-t border-line pt-3">
                <p className="text-sm font-medium text-ink">
                  Fehlt, fällt beim Wiederverkauf ins Gewicht
                </p>
                <ul className="mt-1.5 flex flex-wrap gap-1.5">
                  {ergebnis.notableGaps.map((option) => (
                    <li key={option.optionId}>
                      <Badge tone="caution">{option.name}</Badge>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </CardBody>
        </Card>
      ) : null}

      {nachBereich.map(([bereich, liste]) => (
        <Card key={bereich}>
          <CardHeader
            title={
              EQUIPMENT_AREA_LABELS[bereich as keyof typeof EQUIPMENT_AREA_LABELS] ?? bereich
            }
          />
          <CardBody className="p-0">
            <ul className="divide-y divide-line">
              {liste.map((option) => {
                const zustand = zustaende[option.optionId] ?? 'OFFEN';
                const art = AVAILABILITY_LABELS[option.kind];
                return (
                  <li key={option.optionId} className="px-5 py-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-ink">
                          {option.name}
                          {option.optionCode ? (
                            <span className="ml-2 font-mono text-xs text-ink-subtle">
                              {option.optionCode}
                            </span>
                          ) : null}
                        </p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                          <Badge tone={art.tone} title={art.explanation}>
                            {art.label}
                          </Badge>
                          {option.packageName ? (
                            <span className="text-xs text-ink-subtle">
                              Paket &bdquo;{option.packageName}&ldquo;
                            </span>
                          ) : null}
                          {option.specialEditionName ? (
                            <span className="text-xs text-ink-subtle">
                              Sondermodell &bdquo;{option.specialEditionName}&ldquo;
                            </span>
                          ) : null}
                          {option.rarity ? (
                            <span className="text-xs text-ink-subtle">
                              {RARITY_LABELS[option.rarity]}
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <fieldset className="flex shrink-0 gap-1">
                        <legend className="sr-only">Status von {option.name}</legend>
                        {(
                          [
                            ['JA', '✓', 'vorhanden', 'positive'],
                            ['NEIN', '✕', 'nicht vorhanden', 'critical'],
                            ['OFFEN', '?', 'noch nicht geprüft', 'neutral'],
                          ] as const
                        ).map(([wert, zeichen, beschriftung, ton]) => {
                          const aktiv = zustand === wert;
                          return (
                            <button
                              key={wert}
                              type="button"
                              aria-pressed={aktiv}
                              onClick={() => setze(option.optionId, wert)}
                              title={beschriftung}
                              className={`flex h-11 w-11 items-center justify-center rounded-md border text-base transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ${
                                aktiv
                                  ? ton === 'positive'
                                    ? 'border-positive bg-positive/10 text-positive'
                                    : ton === 'critical'
                                      ? 'border-critical bg-critical/10 text-critical'
                                      : 'border-line-interactive bg-surface-2 text-ink'
                                  : 'border-line text-ink-subtle hover:border-line-interactive hover:text-ink'
                              }`}
                            >
                              <span aria-hidden="true">{zeichen}</span>
                              <span className="sr-only">{beschriftung}</span>
                            </button>
                          );
                        })}
                      </fieldset>
                    </div>
                  </li>
                );
              })}
            </ul>
          </CardBody>
        </Card>
      ))}

      <p className="text-sm text-ink-subtle">
        Was hier steht, ist das für diese Baureihe Erfasste.{' '}
        <Link href={ausstattungHref} className="text-accent underline-offset-4 hover:underline">
          Zur vollständigen Ausstattungsübersicht mit Quellen
        </Link>
        .
      </p>
    </div>
  );
}
