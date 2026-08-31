'use client';

import { useState } from 'react';

import type { ValuationFactor } from '@ap/core/valuation/factors';
import type { Valuation } from '@ap/core/valuation/estimate';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

/**
 * Die Fahrzeugbewertung im Entwurf.
 *
 * Die Anzeige richtet sich danach, ob ein Marktwert vorliegt. Ohne
 * Vergleichsangebote steht hier bewusst KEINE Zahl -- statt dessen die
 * Faktorenanalyse und der Grund, warum der Eurobetrag fehlt. Eine Zahl mit
 * einem kleinen Sternchen daneben waere die schlechtere Loesung: Gelesen
 * wird die Zahl, nicht das Sternchen.
 */

interface Antwort {
  data?: { valuation: Valuation; charged: number };
  error?: { message?: string };
}

const GUETE_TEXT: Record<string, string> = {
  GOOD: 'belastbar',
  LIMITED: 'eingeschränkt',
  WEAK: 'schwach',
  NONE: 'kein Marktwert',
};

const GUETE_TON: Record<string, 'positive' | 'neutral' | 'caution'> = {
  GOOD: 'positive',
  LIMITED: 'neutral',
  WEAK: 'caution',
  NONE: 'caution',
};

function euro(cents: number): string {
  return (cents / 100).toLocaleString('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  });
}

function FaktorZeile({ faktor }: { faktor: ValuationFactor }) {
  const vorzeichen = faktor.adjustment > 0 ? '+' : '';
  const farbe =
    faktor.direction === 'RAISES'
      ? 'text-positive'
      : faktor.direction === 'LOWERS'
        ? 'text-accent'
        : 'text-ink-subtle';

  return (
    <li className="border-b border-line/40 py-3 last:border-0">
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-sm font-medium text-ink">{faktor.label}</span>
        <span className={`tabular text-sm ${farbe}`}>
          {vorzeichen}
          {(faktor.adjustment * 100).toFixed(1)} %
        </span>
      </div>
      <p className="mt-1 text-sm leading-relaxed text-ink-muted">{faktor.reasoning}</p>
    </li>
  );
}

export function ValuationPanel({
  draftId,
  preis,
  guthaben,
  bestaetigt,
  vorhandene,
}: {
  draftId: string;
  preis: number;
  guthaben: number;
  bestaetigt: boolean;
  vorhandene: Valuation | null;
}) {
  const [bewertung, setBewertung] = useState<Valuation | null>(vorhandene);
  const [laeuft, setLaeuft] = useState(false);
  const [meldung, setMeldung] = useState<string | null>(null);

  async function bewerten() {
    setLaeuft(true);
    setMeldung(null);
    try {
      const antwort = await fetch(`/api/verkaufen/entwuerfe/${draftId}/bewertung`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
      });
      const inhalt = (await antwort.json()) as Antwort;
      if (antwort.ok && inhalt.data) {
        setBewertung(inhalt.data.valuation);
      } else {
        setMeldung(inhalt.error?.message ?? 'Die Bewertung konnte nicht erstellt werden.');
      }
    } catch {
      setMeldung('Die Bewertung konnte nicht erstellt werden.');
    } finally {
      setLaeuft(false);
    }
  }

  if (!bestaetigt) {
    return (
      <p className="text-sm leading-relaxed text-ink-muted">
        Bitte zuerst das Fahrzeug bestätigen. Ohne bestätigte Zuordnung gäbe es keine
        Baureihe, mit der sich vergleichen ließe.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {meldung ? (
        <p
          role="status"
          className="rounded-md border border-caution/40 bg-caution/10 px-4 py-3 text-sm text-caution"
        >
          {meldung}
        </p>
      ) : null}

      {bewertung ? (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={GUETE_TON[bewertung.confidence] ?? 'neutral'}>
              {GUETE_TEXT[bewertung.confidence] ?? bewertung.confidence}
            </Badge>
            {bewertung.source ? (
              <span className="text-xs text-ink-subtle">
                {bewertung.source.sampleSize} Vergleichsangebote · {bewertung.source.label}
              </span>
            ) : null}
          </div>

          {bewertung.marketValueCents !== null ? (
            <dl className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-md border border-line/60 bg-surface-2 p-3">
                <dt className="text-xs uppercase tracking-wide text-ink-subtle">
                  Geschätzter Marktwert
                </dt>
                <dd className="tabular mt-1 text-lg font-semibold text-ink">
                  {euro(bewertung.marketValueCents)}
                </dd>
              </div>
              <div className="rounded-md border border-line/60 bg-surface-2 p-3">
                <dt className="text-xs uppercase tracking-wide text-ink-subtle">
                  Empfohlener Inseratspreis
                </dt>
                <dd className="tabular mt-1 text-lg font-semibold text-ink">
                  {bewertung.suggestedListingCents !== null
                    ? euro(bewertung.suggestedListingCents)
                    : '—'}
                </dd>
              </div>
              <div className="rounded-md border border-line/60 bg-surface-2 p-3">
                <dt className="text-xs uppercase tracking-wide text-ink-subtle">
                  Realistische Spanne
                </dt>
                <dd className="tabular mt-1 text-lg font-semibold text-ink">
                  {bewertung.realisticRange
                    ? `${euro(bewertung.realisticRange.lowCents)} – ${euro(bewertung.realisticRange.highCents)}`
                    : '—'}
                </dd>
              </div>
            </dl>
          ) : (
            <div className="rounded-md border border-caution/40 bg-caution/10 p-4">
              <p className="text-sm font-medium text-caution">Kein Marktwert in Euro</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                {bewertung.reasoning[0]}
              </p>
            </div>
          )}

          <div className="space-y-1">
            {bewertung.reasoning.slice(bewertung.marketValueCents === null ? 1 : 0).map((satz) => (
              <p key={satz} className="text-sm leading-relaxed text-ink-muted">
                {satz}
              </p>
            ))}
          </div>

          {bewertung.valueDrivers.length > 0 ? (
            <section>
              <h3 className="mb-1 text-sm font-semibold text-ink">Werttreiber</h3>
              <ul>
                {bewertung.valueDrivers.map((f) => (
                  <FaktorZeile key={f.id} faktor={f} />
                ))}
              </ul>
            </section>
          ) : null}

          {bewertung.valueReducers.length > 0 ? (
            <section>
              <h3 className="mb-1 text-sm font-semibold text-ink">Wertmindernde Faktoren</h3>
              <ul>
                {bewertung.valueReducers.map((f) => (
                  <FaktorZeile key={f.id} faktor={f} />
                ))}
              </ul>
            </section>
          ) : null}

          {bewertung.missingFields.length > 0 ? (
            <p className="text-sm leading-relaxed text-ink-muted">
              Noch offen: {bewertung.missingFields.join(', ')}. Jede dieser Angaben macht die
              Schätzung genauer.
            </p>
          ) : null}

          <details className="rounded-md border border-line/60 bg-surface-2 p-3">
            <summary className="cursor-pointer text-sm font-medium text-ink">
              Womit gerechnet wurde
            </summary>
            <ul className="mt-2 space-y-1">
              {bewertung.assumptionNotes.map((satz) => (
                <li key={satz} className="text-sm leading-relaxed text-ink-muted">
                  {satz}
                </li>
              ))}
            </ul>
          </details>

          <p className="text-xs leading-relaxed text-ink-subtle">{bewertung.disclaimer}</p>
        </>
      ) : (
        <>
          <p className="text-sm leading-relaxed text-ink-muted">
            Die Bewertung wertet Ihre Angaben aus: Kilometerstand gegen Alter, Zustand,
            Servicehistorie, Vorbesitzer, HU, Schäden. Ein Marktwert in Euro entsteht nur,
            wenn Vergleichsangebote vorliegen — sonst bleibt es bei der Faktorenanalyse,
            und es wird nichts abgebucht.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={bewerten} disabled={laeuft}>
              {laeuft ? 'Wird berechnet …' : `Fahrzeug bewerten (${preis} Tokens)`}
            </Button>
            <span className="tabular text-sm text-ink-subtle">
              {guthaben} Tokens verfügbar
            </span>
          </div>
        </>
      )}
    </div>
  );
}
