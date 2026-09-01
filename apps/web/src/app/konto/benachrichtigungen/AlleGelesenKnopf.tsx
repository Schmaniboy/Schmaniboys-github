'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

export function AlleGelesenKnopf() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const { zeigen } = useToast();

  async function alleGelesen() {
    setBusy(true);
    try {
      const antwort = await fetch('/api/benachrichtigungen', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: null }),
      });
      if (antwort.ok) {
        router.refresh();
      } else {
        zeigen('Das hat gerade nicht geklappt.', { ton: 'critical' });
      }
    } catch {
      zeigen('Der Server war nicht erreichbar.', { ton: 'critical' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={alleGelesen}
      busy={busy}
    >
      Alle als gelesen markieren
    </Button>
  );
}
