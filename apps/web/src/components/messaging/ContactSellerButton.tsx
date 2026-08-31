'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/Button';

/**
 * Anbietende Person anschreiben.
 *
 * Legt das Gespraech an und springt hinein. Gibt es zu dieser Anzeige schon
 * eines, wird es wiederverwendet -- der Server hat dafuer eine
 * Eindeutigkeitsbedingung, damit sich derselbe Posteingang nicht fluten
 * laesst.
 */
export function ContactSellerButton({
  listingId,
  angemeldet,
}: {
  listingId: string;
  angemeldet: boolean;
}) {
  const [bereit, setBereit] = useState(false);
  const [laeuft, setLaeuft] = useState(false);
  const [meldung, setMeldung] = useState<string | null>(null);

  useEffect(() => {
    setBereit(true);
  }, []);

  async function anschreiben() {
    if (!angemeldet) {
      window.location.assign('/anmelden');
      return;
    }

    setLaeuft(true);
    setMeldung(null);
    try {
      const antwort = await fetch('/api/nachrichten', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ listingId }),
      });
      const inhalt = (await antwort.json()) as {
        data?: { conversation: { id: string } };
        error?: { message?: string };
      };
      if (antwort.ok && inhalt.data) {
        window.location.assign(`/konto/nachrichten/${inhalt.data.conversation.id}`);
        return;
      }
      setMeldung(inhalt.error?.message ?? 'Das Gespräch konnte nicht begonnen werden.');
    } catch {
      setMeldung('Das Gespräch konnte nicht begonnen werden.');
    } finally {
      setLaeuft(false);
    }
  }

  return (
    <div className="space-y-2">
      <Button onClick={anschreiben} disabled={!bereit || laeuft} className="w-full">
        {laeuft ? 'Wird geöffnet …' : 'Anbieter anschreiben'}
      </Button>
      {meldung ? (
        <p role="status" className="text-sm text-caution">
          {meldung}
        </p>
      ) : null}
    </div>
  );
}
