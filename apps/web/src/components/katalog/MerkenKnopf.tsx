'use client';

import { useEffect, useState } from 'react';

/**
 * Merken -- an Motor, Fahrzeug, Ausstattung, Farbe.
 *
 * Der Zustand kommt beim ersten Rendern aus der Schnittstelle und nicht vom
 * Server: Die Katalogseiten werden statisch ausgeliefert und regelmaessig
 * erneuert. Wuerden sie den Merkzettel lesen, waere jede von ihnen dynamisch
 * -- fuer einen Knopf ein zu hoher Preis.
 *
 * Solange der Zustand unbekannt ist, steht der Knopf da, ist aber nicht
 * bedienbar. Ein Knopf, der beim Antippen erst nachschlaegt und dann das
 * Gegenteil tut, ist schlimmer als einer, der kurz wartet.
 */

type Zustand = 'unbekannt' | 'anonym' | 'gemerkt' | 'nicht-gemerkt';

export function MerkenKnopf({
  subjectType,
  subjectId,
  label = 'Merken',
}: {
  subjectType:
    | 'Engine'
    | 'PowertrainCombination'
    | 'OptionalEquipment'
    | 'Generation'
    | 'PaintColor'
    | 'WheelOption'
    | 'SpecialEdition';
  subjectId: string;
  label?: string;
}) {
  const [zustand, setZustand] = useState<Zustand>('unbekannt');
  const [laeuft, setLaeuft] = useState(false);

  useEffect(() => {
    const abbruch = new AbortController();

    fetch('/api/konto/merkzettel', { signal: abbruch.signal })
      .then((antwort) => (antwort.ok ? antwort.json() : null))
      .then((nutzlast: { data?: { eintraege?: { subjectType: string; subjectId: string }[] } } | null) => {
        if (!nutzlast) {
          setZustand('anonym');
          return;
        }
        const drin = (nutzlast.data?.eintraege ?? []).some(
          (eintrag) => eintrag.subjectType === subjectType && eintrag.subjectId === subjectId,
        );
        setZustand(drin ? 'gemerkt' : 'nicht-gemerkt');
      })
      .catch(() => setZustand('anonym'));

    return () => abbruch.abort();
  }, [subjectType, subjectId]);

  if (zustand === 'anonym') {
    return (
      <a
        href="/anmelden"
        className="inline-flex h-9 items-center rounded-md border border-line px-3 text-sm text-ink-muted transition-colors hover:border-line-interactive hover:text-ink"
      >
        Zum Merken anmelden
      </a>
    );
  }

  const gemerkt = zustand === 'gemerkt';

  return (
    <button
      type="button"
      disabled={zustand === 'unbekannt' || laeuft}
      aria-pressed={gemerkt}
      onClick={async () => {
        setLaeuft(true);
        try {
          const antwort = await fetch('/api/konto/merkzettel', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ subjectType, subjectId }),
          });
          if (antwort.ok) {
            const nutzlast = (await antwort.json()) as { data?: { gemerkt?: boolean } };
            setZustand(nutzlast.data?.gemerkt ? 'gemerkt' : 'nicht-gemerkt');
          }
        } finally {
          setLaeuft(false);
        }
      }}
      className={`inline-flex h-9 items-center gap-1.5 rounded-md border px-3 text-sm transition-colors disabled:opacity-50 ${
        gemerkt
          ? 'border-accent bg-accent/10 text-accent-strong'
          : 'border-line text-ink-muted hover:border-line-interactive hover:text-ink'
      }`}
    >
      <span aria-hidden="true">{gemerkt ? '★' : '☆'}</span>
      {gemerkt ? 'Gemerkt' : label}
    </button>
  );
}
