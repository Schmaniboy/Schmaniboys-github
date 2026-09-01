'use client';

import { useEffect, useState } from 'react';

import { LISTING_STATUS_LABELS, type ListingStatus } from '@ap/core/marketplace/status';

import { useToast } from '@/components/ui/Toast';

/**
 * Statuswechsel einer eigenen Anzeige.
 *
 * Angeboten werden nur Wechsel, die die Domaenenschicht auch zulaesst --
 * dieselbe Tabelle, die der Server prueft. Eine Schaltflaeche anzubieten,
 * die der Server danach ablehnt, waere eine Falle.
 *
 * Loeschen fragt nach: Es ist ein Endzustand, und die Anzeige kommt nicht
 * zurueck.
 */

const ANGEBOTEN: ListingStatus[] = ['ACTIVE', 'PAUSED', 'SOLD', 'DELETED'];

const BESCHRIFTUNG: Partial<Record<ListingStatus, string>> = {
  ACTIVE: 'Veröffentlichen',
  PAUSED: 'Pausieren',
  SOLD: 'Als verkauft markieren',
  DELETED: 'Löschen',
};

export function ListingActions({
  listingId,
  moegliche,
}: {
  listingId: string;
  moegliche: ListingStatus[];
}) {
  const [bereit, setBereit] = useState(false);
  const [laeuft, setLaeuft] = useState<ListingStatus | null>(null);
  const { zeigen } = useToast();

  useEffect(() => {
    setBereit(true);
  }, []);

  async function wechseln(status: ListingStatus) {
    if (status === 'DELETED' || status === 'SOLD') {
      const frage =
        status === 'DELETED'
          ? 'Die Anzeige wird gelöscht und kommt nicht zurück. Fortfahren?'
          : 'Die Anzeige wird als verkauft markiert. Sie lässt sich danach nicht wieder online stellen. Fortfahren?';
      if (!window.confirm(frage)) return;
    }

    setLaeuft(status);
    try {
      const antwort = await fetch(`/api/anzeigen/${listingId}/status`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (antwort.ok) {
        zeigen('Status geändert.', { ton: 'positive' });
        window.location.reload();
        return;
      }
      const inhalt = (await antwort.json()) as { error?: { message?: string } };
      zeigen(inhalt.error?.message ?? 'Das hat gerade nicht geklappt.', { ton: 'critical' });
    } catch {
      zeigen('Das hat gerade nicht geklappt.', { ton: 'critical' });
    } finally {
      setLaeuft(null);
    }
  }

  const auswahl = ANGEBOTEN.filter((status) => moegliche.includes(status));
  if (auswahl.length === 0) {
    return <span className="text-sm text-ink-subtle">Kein weiterer Wechsel möglich.</span>;
  }

  return (
    <span className="flex flex-wrap items-center gap-2">
      {auswahl.map((status) => (
        <button
          key={status}
          type="button"
          onClick={() => wechseln(status)}
          disabled={!bereit || laeuft !== null}
          className={`rounded-md border px-3 py-1.5 text-sm transition-colors disabled:opacity-50 ${
            status === 'DELETED'
              ? 'border-caution/50 text-caution hover:bg-caution/10'
              : 'border-line text-ink-muted hover:border-accent/60 hover:text-ink'
          }`}
        >
          {laeuft === status ? '…' : (BESCHRIFTUNG[status] ?? LISTING_STATUS_LABELS[status])}
        </button>
      ))}
    </span>
  );
}
