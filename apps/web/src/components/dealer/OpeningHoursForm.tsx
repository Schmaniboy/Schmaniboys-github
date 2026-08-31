'use client';

import { useEffect, useState } from 'react';

import { WOCHENTAGE, minutenZuUhrzeit } from '@ap/core/dealer/opening-hours';

import { Button } from '@/components/ui/Button';

/**
 * Oeffnungszeiten bearbeiten.
 *
 * Je Tag bis zu zwei Zeitfenster -- das deckt den Normalfall samt
 * Mittagspause ab, ohne dass daraus eine Tabellenverwaltung wird. Ein leeres
 * Feldpaar heisst geschlossen; das ist die einfachste Art, einen Tag zu
 * streichen.
 */

interface Spanne {
  weekday: number;
  opensMinute: number;
  closesMinute: number;
}

interface Zeile {
  von: string;
  bis: string;
}

function ausSpannen(spannen: Spanne[]): Record<number, Zeile[]> {
  const nachTag: Record<number, Zeile[]> = {};
  for (const tag of WOCHENTAGE) {
    const desTages = spannen
      .filter((spanne) => spanne.weekday === tag.nummer)
      .sort((links, rechts) => links.opensMinute - rechts.opensMinute)
      .slice(0, 2)
      .map((spanne) => ({
        von: minutenZuUhrzeit(spanne.opensMinute),
        bis: minutenZuUhrzeit(spanne.closesMinute),
      }));

    nachTag[tag.nummer] = [desTages[0] ?? { von: '', bis: '' }, desTages[1] ?? { von: '', bis: '' }];
  }
  return nachTag;
}

export function OpeningHoursForm({
  spannen,
  schreibgeschuetzt,
}: {
  spannen: Spanne[];
  schreibgeschuetzt: boolean;
}) {
  const [zeiten, setZeiten] = useState(() => ausSpannen(spannen));
  const [bereit, setBereit] = useState(false);
  const [laeuft, setLaeuft] = useState(false);
  const [meldung, setMeldung] = useState<{ art: 'gut' | 'schlecht'; text: string } | null>(null);

  useEffect(() => {
    setBereit(true);
  }, []);

  function setze(weekday: number, index: number, feld: 'von' | 'bis', wert: string) {
    setZeiten((bisher) => {
      const desTages = [...(bisher[weekday] ?? [])];
      const zeile = desTages[index] ?? { von: '', bis: '' };
      desTages[index] = { ...zeile, [feld]: wert };
      return { ...bisher, [weekday]: desTages };
    });
  }

  async function speichern(ereignis: React.FormEvent<HTMLFormElement>) {
    ereignis.preventDefault();
    setLaeuft(true);
    setMeldung(null);

    const gesammelt: { weekday: number; von: string; bis: string }[] = [];
    for (const tag of WOCHENTAGE) {
      for (const zeile of zeiten[tag.nummer] ?? []) {
        // Ein leeres Feldpaar heisst geschlossen und wird uebergangen.
        if (!zeile.von.trim() && !zeile.bis.trim()) continue;
        gesammelt.push({ weekday: tag.nummer, von: zeile.von.trim(), bis: zeile.bis.trim() });
      }
    }

    try {
      const antwort = await fetch('/api/haendler/oeffnungszeiten', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ spannen: gesammelt }),
      });
      if (antwort.ok) {
        setMeldung({ art: 'gut', text: 'Öffnungszeiten gespeichert.' });
      } else {
        const inhalt = (await antwort.json()) as {
          error?: { message?: string; issues?: Record<string, string[]> };
        };
        const erstes = Object.values(inhalt.error?.issues ?? {})[0]?.[0];
        setMeldung({
          art: 'schlecht',
          text: erstes ?? inhalt.error?.message ?? 'Das hat gerade nicht geklappt.',
        });
      }
    } catch {
      setMeldung({ art: 'schlecht', text: 'Das hat gerade nicht geklappt.' });
    } finally {
      setLaeuft(false);
    }
  }

  return (
    <form onSubmit={speichern} method="post" className="space-y-4">
      <p className="text-sm leading-relaxed text-ink-muted">
        Zwei Zeitfenster je Tag, für Betriebe mit Mittagspause. Ein leeres Feldpaar
        bedeutet geschlossen.
      </p>

      <div className="space-y-2">
        {WOCHENTAGE.map((tag) => (
          <div key={tag.nummer} className="flex flex-wrap items-center gap-2">
            <span className="w-24 text-sm text-ink">{tag.lang}</span>
            {[0, 1].map((index) => (
              <span key={index} className="flex items-center gap-1">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="08:00"
                  aria-label={`${tag.lang}, Zeitfenster ${index + 1}, von`}
                  value={zeiten[tag.nummer]?.[index]?.von ?? ''}
                  disabled={schreibgeschuetzt}
                  onChange={(e) => setze(tag.nummer, index, 'von', e.currentTarget.value)}
                  className="tabular h-11 w-20 rounded-md border border-line-interactive bg-surface-1 px-2 text-base sm:text-sm text-ink placeholder:text-ink-subtle disabled:cursor-not-allowed disabled:opacity-50"
                />
                <span className="text-ink-subtle">–</span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="18:00"
                  aria-label={`${tag.lang}, Zeitfenster ${index + 1}, bis`}
                  value={zeiten[tag.nummer]?.[index]?.bis ?? ''}
                  disabled={schreibgeschuetzt}
                  onChange={(e) => setze(tag.nummer, index, 'bis', e.currentTarget.value)}
                  className="tabular h-11 w-20 rounded-md border border-line-interactive bg-surface-1 px-2 text-base sm:text-sm text-ink placeholder:text-ink-subtle disabled:cursor-not-allowed disabled:opacity-50"
                />
              </span>
            ))}
          </div>
        ))}
      </div>

      {meldung ? (
        <p
          role="status"
          className={`rounded-md border px-4 py-3 text-sm ${
            meldung.art === 'gut'
              ? 'border-positive/40 bg-positive/10 text-positive'
              : 'border-caution/40 bg-caution/10 text-caution'
          }`}
        >
          {meldung.text}
        </p>
      ) : null}

      {!schreibgeschuetzt ? (
        <Button type="submit" disabled={!bereit || laeuft}>
          {laeuft ? 'Wird gespeichert …' : 'Öffnungszeiten speichern'}
        </Button>
      ) : null}
    </form>
  );
}
