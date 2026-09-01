'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

/**
 * Loest die kostenpflichtige Texterzeugung aus.
 *
 * Der Preis steht auf der Schaltflaeche, nicht im Kleingedruckten. Und die
 * Rueckmeldung nennt, was tatsaechlich abgebucht wurde -- bei einem
 * unveraenderten Entwurf sind das null Tokens.
 */
export function GenerateButton({ draftId, preis }: { draftId: string; preis: number }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const { zeigen } = useToast();

  async function erzeugen() {
    setBusy(true);

    try {
      const antwort = await fetch(`/api/verkaufen/entwuerfe/${draftId}/texte`, {
        method: 'POST',
      });
      const inhalt = (await antwort.json().catch(() => ({}))) as {
        data?: { charged?: number };
        error?: { message?: string };
      };

      if (antwort.ok) {
        const abgebucht = inhalt.data?.charged ?? 0;
        zeigen(
          abgebucht > 0
            ? `Texte erstellt — ${abgebucht} Token${abgebucht === 1 ? '' : 's'} abgebucht.`
            : 'Texte erstellt — keine Tokens abgebucht.',
          { ton: 'positive' },
        );
        router.refresh();
        return;
      }

      zeigen(inhalt.error?.message ?? 'Die Texte konnten nicht erzeugt werden.', {
        ton: 'critical',
      });
    } catch {
      zeigen('Der Server war nicht erreichbar.', { ton: 'critical' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      <Button variant="primary" size="lg" busy={busy} onClick={erzeugen}>
        Verkaufstexte erstellen ({preis} Tokens)
      </Button>
    </div>
  );
}
