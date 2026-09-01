'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';

import { Button } from '@/components/ui/Button';
import { InputField } from '@/components/ui/Field';
import { PasswordField } from '@/components/ui/PasswordField';

/**
 * Die drei Formulare rund um E-Mail und Passwort.
 *
 * Eine Komponente fuer alle drei, weil sie sich in einem Punkt gleichen, der
 * ihr Verhalten bestimmt: Sie sprechen ueber Konten, ohne zu verraten,
 * welche es gibt. Die Antwort des Servers wird deshalb unveraendert
 * angezeigt und hier nicht ausgeschmueckt.
 */

type Modus = 'vergessen' | 'neu' | 'bestaetigen';

const ENDPUNKTE: Record<Modus, string> = {
  vergessen: '/api/auth/passwort-vergessen',
  neu: '/api/auth/passwort-neu',
  bestaetigen: '/api/auth/email-bestaetigen',
};

interface Antwort {
  data?: { message?: string };
  error?: { message?: string; details?: Record<string, string[]> };
}

export function TokenFormular({ modus, token }: { modus: Modus; token?: string }) {
  const [laeuft, setLaeuft] = useState(false);
  const [erfolg, setErfolg] = useState<string | null>(null);
  const [fehler, setFehler] = useState<string | null>(null);

  async function senden(nutzlast: Record<string, unknown>) {
    setLaeuft(true);
    setFehler(null);
    try {
      const antwort = await fetch(ENDPUNKTE[modus], {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(nutzlast),
      });
      const daten = (await antwort.json().catch(() => null)) as Antwort | null;

      if (!antwort.ok) {
        const erstes = daten?.error?.details
          ? Object.values(daten.error.details)[0]?.[0]
          : undefined;
        setFehler(erstes ?? daten?.error?.message ?? 'Das hat nicht funktioniert.');
        return;
      }

      setErfolg(daten?.data?.message ?? 'Erledigt.');
    } catch {
      setFehler('Keine Verbindung. Bitte prüfen Sie Ihre Internetverbindung.');
    } finally {
      setLaeuft(false);
    }
  }

  /*
   * Die Bestaetigung laeuft ohne Zutun: Wer den Link aus der E-Mail oeffnet,
   * hat damit schon alles getan, was noetig ist. Ein zusaetzlicher Knopf
   * waere eine Huerde ohne Zweck.
   */
  useEffect(() => {
    if (modus === 'bestaetigen' && token) void senden({ token });
    // Nur beim ersten Rendern.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (erfolg) {
    return (
      <div className="space-y-4">
        <p className="rounded-md border border-positive/40 bg-positive/5 px-4 py-3 text-sm leading-relaxed text-ink">
          {erfolg}
        </p>
        <p className="text-sm">
          <Link href="/anmelden" className="text-accent underline-offset-4 hover:underline">
            Zur Anmeldung
          </Link>
        </p>
      </div>
    );
  }

  if (modus === 'bestaetigen') {
    return (
      <div className="space-y-4">
        {!token ? (
          <p className="text-sm text-critical">
            In der Adresse fehlt der Bestätigungscode. Bitte öffnen Sie den Link aus der
            E-Mail unverändert.
          </p>
        ) : fehler ? (
          <p role="alert" className="text-sm text-critical">
            {fehler}
          </p>
        ) : (
          <p className="text-sm text-ink-muted">Adresse wird bestätigt …</p>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={(ereignis: FormEvent<HTMLFormElement>) => {
        ereignis.preventDefault();
        const formular = new FormData(ereignis.currentTarget);
        void senden(
          modus === 'vergessen'
            ? { email: String(formular.get('email') ?? '') }
            : { token: token ?? '', passwort: String(formular.get('passwort') ?? '') },
        );
      }}
      className="space-y-4"
    >
      {modus === 'vergessen' ? (
        <InputField
          label="E-Mail-Adresse"
          name="email"
          type="email"
          required
          autoComplete="email"
          error={fehler ?? undefined}
        />
      ) : (
        <PasswordField
          label="Neues Passwort"
          name="passwort"
          required
          autoComplete="new-password"
          minLength={12}
          hint="Mindestens 12 Zeichen. Alle bestehenden Anmeldungen werden danach beendet."
          error={fehler ?? undefined}
        />
      )}

      {modus === 'neu' && !token ? (
        <p className="text-sm text-critical">
          In der Adresse fehlt der Code. Bitte öffnen Sie den Link aus der E-Mail unverändert.
        </p>
      ) : null}

      <Button type="submit" disabled={laeuft || (modus === 'neu' && !token)}>
        {laeuft
          ? 'Einen Moment …'
          : modus === 'vergessen'
            ? 'Link anfordern'
            : 'Passwort ändern'}
      </Button>
    </form>
  );
}
