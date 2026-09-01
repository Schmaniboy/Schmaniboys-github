'use client';

import { useEffect, useState } from 'react';

import { useToast } from '@/components/ui/Toast';

export function FavoriteButton({ listingId }: { listingId: string }) {
  const [bereit, setBereit] = useState(false);
  const [gemerkt, setGemerkt] = useState(false);
  const [laeuft, setLaeuft] = useState(false);
  const { zeigen } = useToast();

  useEffect(() => {
    setBereit(true);
  }, []);

  async function umschalten() {
    setLaeuft(true);
    try {
      const antwort = await fetch(`/api/anzeigen/${listingId}/merken`, {
        method: gemerkt ? 'DELETE' : 'PUT',
      });
      if (antwort.ok) {
        const neuerZustand = !gemerkt;
        setGemerkt(neuerZustand);
        zeigen(neuerZustand ? 'Anzeige gemerkt.' : 'Anzeige nicht mehr gemerkt.', {
          ton: 'positive',
        });
      } else if (antwort.status === 401) {
        zeigen('Zum Merken bitte anmelden.', { ton: 'caution' });
      } else {
        zeigen('Das hat gerade nicht geklappt.', { ton: 'critical' });
      }
    } catch {
      zeigen('Das hat gerade nicht geklappt.', { ton: 'critical' });
    } finally {
      setLaeuft(false);
    }
  }

  return (
    <button
      type="button"
      onClick={umschalten}
      disabled={!bereit || laeuft}
      aria-pressed={gemerkt}
      className="rounded-md border border-line px-3 py-1.5 text-sm text-ink-muted transition-colors hover:border-accent/60 hover:text-ink disabled:opacity-50"
    >
      {gemerkt ? 'Gemerkt' : 'Merken'}
    </button>
  );
}
