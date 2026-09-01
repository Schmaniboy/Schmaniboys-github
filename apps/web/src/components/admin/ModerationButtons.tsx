'use client';

import { useEffect, useState } from 'react';

import { useDialog } from '@/components/ui/Dialog';
import { useToast } from '@/components/ui/Toast';

export function ModerationButtons({
  ziel,
  id,
  bezeichnung,
  verborgen,
  moeglich,
}: {
  ziel: 'LISTING' | 'MESSAGE';
  id: string;
  bezeichnung: string;
  verborgen: boolean;
  moeglich: boolean;
}) {
  const [bereit, setBereit] = useState(false);
  const [laeuft, setLaeuft] = useState(false);
  const [zustand, setZustand] = useState(verborgen);
  const { eingabe } = useDialog();
  const { zeigen } = useToast();

  useEffect(() => {
    setBereit(true);
  }, []);

  if (!moeglich) {
    return <span className="text-sm text-ink-subtle">—</span>;
  }

  async function handeln() {
    const aktion = zustand ? 'RESTORE' : 'HIDE';
    const grund = await eingabe(
      'Bitte einen Grund angeben. Er bleibt im Protokoll stehen.',
      { titel: `${aktion === 'HIDE' ? 'Ausblenden' : 'Wieder freigeben'}: „${bezeichnung}"` },
    );
    if (grund === null) return;

    setLaeuft(true);
    try {
      const antwort = await fetch('/api/admin/moderation', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ziel, id, aktion, reason: grund }),
      });
      if (antwort.ok) {
        setZustand(!zustand);
        zeigen(aktion === 'HIDE' ? 'Ausgeblendet.' : 'Wieder freigegeben.', { ton: 'positive' });
      } else {
        const inhalt = (await antwort.json()) as {
          error?: { message?: string; issues?: Record<string, string[]> };
        };
        const erstes = Object.values(inhalt.error?.issues ?? {})[0]?.[0];
        zeigen(erstes ?? inhalt.error?.message ?? 'Das hat gerade nicht geklappt.', {
          ton: 'critical',
        });
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
      onClick={handeln}
      disabled={!bereit || laeuft}
      className={`rounded-md border px-3 py-1 text-sm transition-colors disabled:opacity-50 ${
        zustand
          ? 'border-line text-ink-muted hover:text-ink'
          : 'border-caution/50 text-caution hover:bg-caution/10'
      }`}
    >
      {zustand ? 'Freigeben' : 'Ausblenden'}
    </button>
  );
}
