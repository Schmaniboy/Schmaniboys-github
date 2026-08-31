'use client';

import { useEffect, useState } from 'react';

/**
 * Merken und wieder entfernen.
 *
 * Die Schaltflaeche ist bis zur Hydration gesperrt: Vorher gibt es keinen
 * Klick-Handler, und ein Klick auf eine Schaltflaeche, die nichts tut, ist
 * schlimmer als eine sichtbar gesperrte.
 */
export function FavoriteButton({ listingId }: { listingId: string }) {
  const [bereit, setBereit] = useState(false);
  const [gemerkt, setGemerkt] = useState(false);
  const [laeuft, setLaeuft] = useState(false);
  const [meldung, setMeldung] = useState<string | null>(null);

  useEffect(() => {
    setBereit(true);
  }, []);

  async function umschalten() {
    setLaeuft(true);
    setMeldung(null);
    try {
      const antwort = await fetch(`/api/anzeigen/${listingId}/merken`, {
        method: gemerkt ? 'DELETE' : 'PUT',
      });
      if (antwort.ok) {
        setGemerkt(!gemerkt);
      } else if (antwort.status === 401) {
        setMeldung('Zum Merken bitte anmelden.');
      } else {
        setMeldung('Das hat gerade nicht geklappt.');
      }
    } catch {
      setMeldung('Das hat gerade nicht geklappt.');
    } finally {
      setLaeuft(false);
    }
  }

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={umschalten}
        disabled={!bereit || laeuft}
        aria-pressed={gemerkt}
        className="rounded-md border border-line px-3 py-1.5 text-sm text-ink-muted transition-colors hover:border-accent/60 hover:text-ink disabled:opacity-50"
      >
        {gemerkt ? 'Gemerkt' : 'Merken'}
      </button>
      {meldung ? (
        <span role="status" className="text-xs text-caution">
          {meldung}
        </span>
      ) : null}
    </span>
  );
}
