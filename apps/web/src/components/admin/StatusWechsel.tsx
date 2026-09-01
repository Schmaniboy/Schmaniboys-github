'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useToast } from '@/components/ui/Toast';

const ZIELE: Record<string, { ziel: string; label: string; ton: string }[]> = {
  DRAFT: [{ ziel: 'IN_REVIEW', label: 'Zur Prüfung', ton: 'neutral' }],
  IN_REVIEW: [
    { ziel: 'PUBLISHED', label: 'Veröffentlichen', ton: 'positive' },
    { ziel: 'DRAFT', label: 'Zurück in den Entwurf', ton: 'neutral' },
  ],
  PUBLISHED: [{ ziel: 'ARCHIVED', label: 'Zurückziehen', ton: 'critical' }],
  ARCHIVED: [{ ziel: 'DRAFT', label: 'Wieder bearbeiten', ton: 'neutral' }],
};

export function StatusWechsel({
  subject,
  id,
  status,
  quellen,
}: {
  subject: string;
  id: string;
  status: string;
  quellen: number;
}) {
  const router = useRouter();
  const [laeuft, setLaeuft] = useState(false);
  const { zeigen } = useToast();

  const moeglich = ZIELE[status] ?? [];

  async function wechsle(ziel: string) {
    setLaeuft(true);
    try {
      const antwort = await fetch(`/api/katalog/eintraege/${subject}/${id}/status`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ status: ziel }),
      });

      if (!antwort.ok) {
        const daten = (await antwort.json().catch(() => null)) as
          | { error?: { message?: string; details?: Record<string, string[]> } }
          | null;
        const erstes = daten?.error?.details
          ? Object.values(daten.error.details)[0]?.[0]
          : undefined;
        zeigen(erstes ?? daten?.error?.message ?? 'Der Wechsel war nicht möglich.', {
          ton: 'critical',
        });
        return;
      }

      zeigen('Status geändert.', { ton: 'positive' });
      router.refresh();
    } catch {
      zeigen('Keine Verbindung.', { ton: 'critical' });
    } finally {
      setLaeuft(false);
    }
  }

  return (
    <div className="flex flex-wrap justify-end gap-1.5">
      {moeglich.map((eintrag) => {
        const gesperrt = eintrag.ziel === 'PUBLISHED' && quellen === 0;
        return (
          <button
            key={eintrag.ziel}
            type="button"
            disabled={laeuft || gesperrt}
            title={
              gesperrt
                ? 'Ohne mindestens eine Quelle lässt sich nichts veröffentlichen.'
                : undefined
            }
            onClick={() => void wechsle(eintrag.ziel)}
            className={`h-8 rounded-md border px-2.5 text-xs transition-colors disabled:opacity-40 ${
              eintrag.ton === 'positive'
                ? 'border-positive/50 text-positive hover:bg-positive/10'
                : eintrag.ton === 'critical'
                  ? 'border-critical/50 text-critical hover:bg-critical/10'
                  : 'border-line text-ink-muted hover:border-line-interactive hover:text-ink'
            }`}
          >
            {eintrag.label}
          </button>
        );
      })}
    </div>
  );
}
