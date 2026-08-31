'use client';

import { useEffect, useState } from 'react';

import { formatiereCent, formatiereSteuersatz } from '@ap/core/billing/invoice';

import { Button } from '@/components/ui/Button';

/**
 * Guthaben kaufen.
 *
 * Ist kein Zahlungsweg eingerichtet, sagt die Seite das VOR dem Klick und
 * sperrt die Schaltflaechen. Eine Schaltflaeche anzubieten, die danach mit
 * einer Fehlermeldung antwortet, waere eine Falle.
 */

interface Paket {
  id: string;
  label: string;
  tokens: number;
  netCents: number;
  grossCents: number;
}

export function TokenPurchase({
  pakete,
  steuersatz,
  verfuegbar,
}: {
  pakete: Paket[];
  steuersatz: number;
  verfuegbar: boolean;
}) {
  const [bereit, setBereit] = useState(false);
  const [laeuft, setLaeuft] = useState<string | null>(null);
  const [meldung, setMeldung] = useState<string | null>(null);

  useEffect(() => {
    setBereit(true);
  }, []);

  async function kaufen(paketId: string) {
    setLaeuft(paketId);
    setMeldung(null);
    try {
      const antwort = await fetch('/api/guthaben/kaufen', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ paket: paketId }),
      });
      const inhalt = (await antwort.json()) as {
        data?: { redirectUrl: string };
        error?: { message?: string };
      };
      if (antwort.ok && inhalt.data) {
        window.location.assign(inhalt.data.redirectUrl);
        return;
      }
      setMeldung(inhalt.error?.message ?? 'Der Kauf konnte nicht begonnen werden.');
    } catch {
      setMeldung('Der Kauf konnte nicht begonnen werden.');
    } finally {
      setLaeuft(null);
    }
  }

  return (
    <div className="space-y-4">
      {!verfuegbar ? (
        <p className="rounded-md border border-caution/40 bg-caution/10 px-4 py-3 text-sm leading-relaxed text-caution">
          Es ist kein Zahlungsweg eingerichtet — Guthaben lässt sich derzeit nicht kaufen.
          Vorhandenes Guthaben funktioniert unverändert: Es wird vor einem Aufruf reserviert
          und erst bei Erfolg gebucht.
        </p>
      ) : null}

      <ul className="grid gap-3 sm:grid-cols-3">
        {pakete.map((paket) => (
          <li key={paket.id} className="rounded-md border border-line/60 bg-surface-2 p-4">
            <p className="text-sm font-medium text-ink">{paket.label}</p>
            <p className="tabular mt-1 text-2xl font-semibold text-accent">
              {paket.tokens.toLocaleString('de-DE')}
              <span className="ml-1 text-sm font-normal text-ink-subtle">Tokens</span>
            </p>
            <p className="tabular mt-2 text-sm text-ink">
              {formatiereCent(paket.grossCents)}
              <span className="ml-1 text-xs text-ink-subtle">brutto</span>
            </p>
            <p className="tabular text-xs text-ink-subtle">
              {formatiereCent(paket.netCents)} netto zzgl. {formatiereSteuersatz(steuersatz)} USt.
            </p>
            <Button
              className="mt-3 w-full"
              onClick={() => kaufen(paket.id)}
              disabled={!verfuegbar || !bereit || laeuft !== null}
            >
              {laeuft === paket.id ? 'Wird vorbereitet …' : 'Kaufen'}
            </Button>
          </li>
        ))}
      </ul>

      {meldung ? (
        <p
          role="status"
          className="rounded-md border border-caution/40 bg-caution/10 px-4 py-3 text-sm text-caution"
        >
          {meldung}
        </p>
      ) : null}

      <p className="text-xs leading-relaxed text-ink-subtle">
        Der Steuersatz ist eine Einstellung dieser Anwendung und wird mit jeder Rechnung
        gespeichert — eine spätere Änderung verändert ausgestellte Rechnungen nicht. Welche
        Besteuerung im Einzelfall richtig ist, entscheidet diese Anwendung nicht.
      </p>
    </div>
  );
}
