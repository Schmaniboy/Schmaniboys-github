'use client';

import { useEffect, useState, type FormEvent } from 'react';

import { Button } from '@/components/ui/Button';
import { InputField } from '@/components/ui/Field';

/**
 * Formular fuer Anmeldung und Registrierung.
 *
 * Die Feldfehler kommen aus der Antwort des Servers (`issues`) -- es gibt
 * bewusst keine zweite Regelmenge im Browser. Eine Pruefung im Browser waere
 * Bequemlichkeit; entschieden wird auf dem Server.
 */

type Mode = 'anmelden' | 'registrieren';

interface ApiError {
  error?: { message?: string; issues?: Record<string, string[]> };
}

export function AuthForm({ mode }: { mode: Mode }) {
  const [busy, setBusy] = useState(false);
  /*
   * Erst nach dem Einhaengen ist der Absende-Handler aktiv. Vorher wuerde ein
   * Klick die native Formularuebermittlung ausloesen.
   *
   * Das ist nicht theoretisch: Genau das ist beim Testen passiert -- und weil
   * ein Formular ohne `method` als GET abschickt, standen E-Mail UND PASSWORT
   * anschliessend in der Adresszeile. Von dort landen sie im Verlauf, in
   * Zugriffsprotokollen und im Referrer.
   *
   * Zwei Massnahmen dagegen: `method="post"` als Netz, falls doch einmal
   * nativ abgeschickt wird, und diese Sperre, damit es gar nicht dazu kommt.
   */
  const [bereit, setBereit] = useState(false);

  useEffect(() => {
    setBereit(true);
  }, []);
  const [formError, setFormError] = useState<string | null>(null);
  const [issues, setIssues] = useState<Record<string, string[]>>({});

  const isRegistration = mode === 'registrieren';

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setFormError(null);
    setIssues({});

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(
        isRegistration ? '/api/auth/register' : '/api/auth/login',
        {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(payload),
        },
      );

      if (response.ok) {
        /*
         * Bewusst ein vollstaendiger Seitenwechsel statt einer
         * clientseitigen Navigation: Beim Anmelden aendert sich der Zustand
         * der gesamten Anwendung. Eine clientseitige Navigation laesst
         * bereits eingehaengte Komponenten -- etwa die Kopfzeile -- im alten
         * Zustand stehen. Dieser Fehler war da und ist so nicht wiederholbar.
         */
        window.location.assign('/konto');
        return;
      }

      const body = (await response.json().catch(() => ({}))) as ApiError;
      setIssues(body.error?.issues ?? {});
      setFormError(body.error?.message ?? 'Der Vorgang konnte nicht abgeschlossen werden.');
    } catch {
      setFormError('Der Server war nicht erreichbar. Bitte erneut versuchen.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} method="post" className="space-y-5" noValidate>
      {formError ? (
        <div
          role="alert"
          className="rounded-md border border-critical/40 bg-critical/10 px-4 py-3 text-sm text-critical"
        >
          {formError}
        </div>
      ) : null}

      {isRegistration ? (
        <InputField
          label="Name"
          name="displayName"
          autoComplete="name"
          required
          error={issues.displayName?.[0]}
        />
      ) : null}

      <InputField
        label="E-Mail-Adresse"
        name="email"
        type="email"
        autoComplete="email"
        required
        error={issues.email?.[0]}
      />

      <InputField
        label="Passwort"
        name="password"
        type="password"
        autoComplete={isRegistration ? 'new-password' : 'current-password'}
        required
        hint={isRegistration ? 'Mindestens 12 Zeichen. Länge zählt mehr als Sonderzeichen.' : undefined}
        error={issues.password?.[0]}
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        busy={busy}
        disabled={!bereit}
        className="w-full"
      >
        {isRegistration ? 'Konto erstellen' : 'Anmelden'}
      </Button>
    </form>
  );
}
