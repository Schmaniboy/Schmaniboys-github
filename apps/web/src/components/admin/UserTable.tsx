'use client';

import { useEffect, useState } from 'react';

/**
 * Konten verwalten.
 *
 * Jede Massnahme fragt nach einer Begruendung -- der Server verlangt sie
 * ohnehin, aber danach zu fragen ist ehrlicher, als hinterher eine
 * Fehlermeldung zu zeigen.
 */

interface Zeile {
  id: string;
  email: string;
  displayName: string;
  role: string;
  status: string;
  dealerName: string | null;
  listings: number;
  balanceTokens: number;
}

const ROLLEN = ['USER', 'EDITOR', 'ADMIN', 'SUPER_ADMIN'];

export function UserTable({
  zeilen: anfaenglich,
  eigeneKennung,
  darfRollenVergeben,
}: {
  zeilen: Zeile[];
  eigeneKennung: string;
  darfRollenVergeben: boolean;
}) {
  const [zeilen, setZeilen] = useState(anfaenglich);
  const [bereit, setBereit] = useState(false);
  const [laeuft, setLaeuft] = useState(false);
  const [meldung, setMeldung] = useState<{ art: 'gut' | 'schlecht'; text: string } | null>(null);

  useEffect(() => {
    setBereit(true);
  }, []);

  async function massnahme(
    userId: string,
    daten: { role?: string; status?: string },
    frage: string,
  ) {
    const grund = window.prompt(
      `${frage}\n\nBitte einen Grund angeben. Er bleibt im Protokoll stehen.`,
    );
    if (grund === null) return;

    setLaeuft(true);
    setMeldung(null);
    try {
      const antwort = await fetch('/api/admin/benutzer', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ userId, ...daten, reason: grund }),
      });
      const inhalt = (await antwort.json()) as {
        error?: { message?: string; issues?: Record<string, string[]> };
      };

      if (antwort.ok) {
        setZeilen((bisher) =>
          bisher.map((zeile) => (zeile.id === userId ? { ...zeile, ...daten } : zeile)),
        );
        setMeldung({ art: 'gut', text: 'Gespeichert.' });
      } else {
        const erstes = Object.values(inhalt.error?.issues ?? {})[0]?.[0];
        setMeldung({
          art: 'schlecht',
          text: erstes ?? inhalt.error?.message ?? 'Das hat gerade nicht geklappt.',
        });
      }
    } catch {
      setMeldung({ art: 'schlecht', text: 'Das hat gerade nicht geklappt.' });
    } finally {
      setLaeuft(false);
    }
  }

  return (
    <div className="space-y-4">
      {meldung ? (
        <p
          role="status"
          className={`rounded-md border px-4 py-3 text-sm ${
            meldung.art === 'gut'
              ? 'border-positive/40 bg-positive/10 text-positive'
              : 'border-caution/40 bg-caution/10 text-caution'
          }`}
        >
          {meldung.text}
        </p>
      ) : null}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[56rem] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-subtle">
              <th className="py-2 pr-4">Person</th>
              <th className="py-2 pr-4">Betrieb</th>
              <th className="py-2 pr-4 text-right">Anzeigen</th>
              <th className="py-2 pr-4 text-right">Guthaben</th>
              <th className="py-2 pr-4">Rolle</th>
              <th className="py-2 pr-4">Konto</th>
            </tr>
          </thead>
          <tbody>
            {zeilen.map((zeile) => {
              const binIch = zeile.id === eigeneKennung;
              return (
                <tr key={zeile.id} className="border-b border-line/40">
                  <td className="py-3 pr-4">
                    <p className="text-ink">
                      {zeile.displayName}
                      {binIch ? <span className="ml-2 text-xs text-ink-subtle">(Sie)</span> : null}
                    </p>
                    <p className="text-xs text-ink-subtle">{zeile.email}</p>
                  </td>
                  <td className="py-3 pr-4 text-ink-muted">{zeile.dealerName ?? '—'}</td>
                  <td className="tabular py-3 pr-4 text-right text-ink-muted">{zeile.listings}</td>
                  <td className="tabular py-3 pr-4 text-right text-ink-muted">
                    {zeile.balanceTokens}
                  </td>
                  <td className="py-3 pr-4">
                    {darfRollenVergeben && !binIch && !zeile.dealerName ? (
                      <select
                        value={ROLLEN.includes(zeile.role) ? zeile.role : ''}
                        disabled={!bereit || laeuft}
                        onChange={(e) =>
                          massnahme(
                            zeile.id,
                            { role: e.currentTarget.value },
                            `Rolle von „${zeile.displayName}" auf ${e.currentTarget.value} ändern?`,
                          )
                        }
                        aria-label={`Rolle von ${zeile.displayName}`}
                        className="h-11 rounded-md border border-line-interactive bg-surface-1 px-2 text-base sm:text-sm text-ink disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {!ROLLEN.includes(zeile.role) ? (
                          <option value="">{zeile.role}</option>
                        ) : null}
                        {ROLLEN.map((rolle) => (
                          <option key={rolle} value={rolle}>
                            {rolle}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-ink-muted">
                        {zeile.role}
                        {zeile.dealerName ? (
                          <span className="ml-1 text-xs text-ink-subtle">(Betrieb)</span>
                        ) : null}
                      </span>
                    )}
                  </td>
                  <td className="py-3 pr-4">
                    {binIch ? (
                      <span className="text-ink-subtle">—</span>
                    ) : (
                      <button
                        type="button"
                        disabled={!bereit || laeuft}
                        onClick={() =>
                          massnahme(
                            zeile.id,
                            { status: zeile.status === 'BLOCKED' ? 'ACTIVE' : 'BLOCKED' },
                            zeile.status === 'BLOCKED'
                              ? `Konto von „${zeile.displayName}" wieder freigeben?`
                              : `Konto von „${zeile.displayName}" sperren? Alle Sitzungen werden beendet.`,
                          )
                        }
                        className={`rounded-md border px-3 py-1 text-sm transition-colors disabled:opacity-50 ${
                          zeile.status === 'BLOCKED'
                            ? 'border-line text-ink-muted hover:text-ink'
                            : 'border-caution/50 text-caution hover:bg-caution/10'
                        }`}
                      >
                        {zeile.status === 'BLOCKED' ? 'Freigeben' : 'Sperren'}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
