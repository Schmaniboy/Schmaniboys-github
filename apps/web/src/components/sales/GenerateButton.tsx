'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/Button';

/**
 * Loest die kostenpflichtige Texterzeugung aus.
 *
 * Der Preis steht auf der Schaltflaeche, nicht im Kleingedruckten. Und die
 * Rueckmeldung nennt, was tatsaechlich abgebucht wurde -- bei einem
 * unveraenderten Entwurf sind das null Tokens.
 */
export function GenerateButton({ draftId, preis }: { draftId: string; preis: number }) {
  const [busy, setBusy] = useState(false);
  const [meldung, setMeldung] = useState<string | null>(null);

  async function erzeugen() {
    setBusy(true);
    setMeldung(null);

    try {
      const antwort = await fetch(`/api/verkaufen/entwuerfe/${draftId}/texte`, {
        method: 'POST',
      });
      const inhalt = (await antwort.json().catch(() => ({}))) as {
        data?: { charged?: number };
        error?: { message?: string };
      };

      if (antwort.ok) {
        window.location.reload();
        return;
      }

      setMeldung(inhalt.error?.message ?? 'Die Texte konnten nicht erzeugt werden.');
    } catch {
      setMeldung('Der Server war nicht erreichbar.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      {meldung ? (
        <p
          role="alert"
          className="rounded-md border border-caution/40 bg-caution/10 px-4 py-3 text-sm text-caution"
        >
          {meldung}
        </p>
      ) : null}
      <Button variant="primary" size="lg" busy={busy} onClick={erzeugen}>
        Verkaufstexte erstellen ({preis} Tokens)
      </Button>
    </div>
  );
}
