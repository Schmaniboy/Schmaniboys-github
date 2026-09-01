'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { useDialog } from '@/components/ui/Dialog';
import { useToast } from '@/components/ui/Toast';

/**
 * Mitarbeiter aufnehmen, umstufen, entfernen.
 *
 * Aufgenommen werden nur Personen, die sich selbst registriert haben. Konten
 * fuer andere anzulegen ist nicht vorgesehen -- sonst legte ein Betrieb
 * Konten mit fremden E-Mail-Adressen an, und die betroffene Person erfuehre
 * davon nichts.
 */

interface Mitglied {
  id: string;
  email: string;
  displayName: string;
  role: string;
}

const ROLLEN_TEXT: Record<string, string> = {
  DEALER_OWNER: 'Inhaber',
  DEALER_STAFF: 'Mitarbeiter',
};

export function DealerMembers({
  mitglieder: anfaenglich,
  eigeneKennung,
}: {
  mitglieder: Mitglied[];
  eigeneKennung: string;
}) {
  const [mitglieder, setMitglieder] = useState(anfaenglich);
  const [bereit, setBereit] = useState(false);
  const [laeuft, setLaeuft] = useState(false);
  const { bestaetigen } = useDialog();
  const { zeigen } = useToast();

  useEffect(() => {
    setBereit(true);
  }, []);

  function melde(antwortInhalt: { error?: { message?: string; issues?: Record<string, string[]> } }) {
    const erstes = Object.values(antwortInhalt.error?.issues ?? {})[0]?.[0];
    zeigen(erstes ?? antwortInhalt.error?.message ?? 'Das hat gerade nicht geklappt.', {
      ton: 'critical',
    });
  }

  async function aufnehmen(ereignis: React.FormEvent<HTMLFormElement>) {
    ereignis.preventDefault();
    const formular = new FormData(ereignis.currentTarget);
    setLaeuft(true);

    try {
      const antwort = await fetch('/api/haendler/mitarbeiter', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email: String(formular.get('email') ?? ''),
          role: String(formular.get('role') ?? 'DEALER_STAFF'),
        }),
      });
      const inhalt = (await antwort.json()) as {
        data?: { member: Mitglied };
        error?: { message?: string; issues?: Record<string, string[]> };
      };
      if (antwort.ok && inhalt.data) {
        setMitglieder((bisher) => [...bisher, inhalt.data!.member]);
        zeigen('Person aufgenommen.', { ton: 'positive' });
        ereignis.currentTarget.reset();
      } else {
        melde(inhalt);
      }
    } catch {
      zeigen('Das hat gerade nicht geklappt.', { ton: 'critical' });
    } finally {
      setLaeuft(false);
    }
  }

  async function rolleAendern(userId: string, role: string) {
    setLaeuft(true);
    try {
      const antwort = await fetch('/api/haendler/mitarbeiter', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ userId, role }),
      });
      if (antwort.ok) {
        setMitglieder((bisher) =>
          bisher.map((person) => (person.id === userId ? { ...person, role } : person)),
        );
      } else {
        melde((await antwort.json()) as { error?: { message?: string } });
      }
    } catch {
      zeigen('Das hat gerade nicht geklappt.', { ton: 'critical' });
    } finally {
      setLaeuft(false);
    }
  }

  async function entfernen(userId: string, name: string) {
    const ok = await bestaetigen(
      `„${name}" verliert damit den Zugang zu diesem Betrieb. Fortfahren?`,
      { gefahr: true },
    );
    if (!ok) return;
    setLaeuft(true);
    try {
      const antwort = await fetch(
        `/api/haendler/mitarbeiter?userId=${encodeURIComponent(userId)}`,
        { method: 'DELETE' },
      );
      if (antwort.ok) {
        setMitglieder((bisher) => bisher.filter((person) => person.id !== userId));
        zeigen('Person entfernt.', { ton: 'positive' });
      } else {
        melde((await antwort.json()) as { error?: { message?: string } });
      }
    } catch {
      zeigen('Das hat gerade nicht geklappt.', { ton: 'critical' });
    } finally {
      setLaeuft(false);
    }
  }

  return (
    <div className="space-y-6">
      <ul className="divide-y divide-line/40">
        {mitglieder.map((person) => {
          const binIch = person.id === eigeneKennung;
          return (
            <li key={person.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink">
                  {person.displayName}
                  {binIch ? <span className="ml-2 text-xs text-ink-subtle">(Sie)</span> : null}
                </p>
                <p className="text-xs text-ink-subtle">{person.email}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={person.role}
                  disabled={!bereit || laeuft || binIch}
                  onChange={(e) => rolleAendern(person.id, e.currentTarget.value)}
                  aria-label={`Rolle von ${person.displayName}`}
                  className="h-11 rounded-md border border-line-interactive bg-surface-1 px-2 text-base sm:text-sm text-ink disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="DEALER_OWNER">{ROLLEN_TEXT.DEALER_OWNER}</option>
                  <option value="DEALER_STAFF">{ROLLEN_TEXT.DEALER_STAFF}</option>
                </select>
                <button
                  type="button"
                  onClick={() => entfernen(person.id, person.displayName)}
                  disabled={!bereit || laeuft || binIch}
                  aria-label={`${person.displayName} entfernen`}
                  className="rounded-md border border-caution/50 px-3 py-1.5 text-sm text-caution transition-colors hover:bg-caution/10 disabled:opacity-40"
                >
                  Entfernen
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <form onSubmit={aufnehmen} method="post" className="space-y-3 border-t border-line/40 pt-4" noValidate>
        <h3 className="text-sm font-semibold text-ink">Person aufnehmen</h3>
        <p className="text-sm leading-relaxed text-ink-muted">
          Die Person muss bereits ein Konto haben. Konten für andere anzulegen ist nicht
          vorgesehen — sonst entstünden Konten mit fremden E-Mail-Adressen, von denen die
          Betroffenen nichts wüssten.
        </p>
        <div className="flex flex-wrap gap-2">
          <input
            name="email"
            type="email"
            required
            placeholder="adresse@beispiel.de"
            aria-label="E-Mail-Adresse"
            disabled={!bereit || laeuft}
            className="h-11 min-w-[16rem] flex-1 rounded-md border border-line-interactive bg-surface-1 px-3 text-base sm:text-sm text-ink placeholder:text-ink-subtle"
          />
          <select
            name="role"
            defaultValue="DEALER_STAFF"
            aria-label="Rolle"
            disabled={!bereit || laeuft}
            className="h-11 rounded-md border border-line-interactive bg-surface-1 px-3 text-base sm:text-sm text-ink"
          >
            <option value="DEALER_STAFF">{ROLLEN_TEXT.DEALER_STAFF}</option>
            <option value="DEALER_OWNER">{ROLLEN_TEXT.DEALER_OWNER}</option>
          </select>
          <Button type="submit" disabled={!bereit || laeuft}>
            Aufnehmen
          </Button>
        </div>
      </form>
    </div>
  );
}
