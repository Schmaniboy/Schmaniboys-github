'use client';

import { useEffect, useState, type FormEvent } from 'react';

import { Button } from '@/components/ui/Button';
import { InputField } from '@/components/ui/Field';

/**
 * Eingabe der Fahrzeug-Identifizierungsnummer.
 *
 * Der Hinweis darunter ist keine Zierde: Wer hier eine VIN eintippt,
 * erwartet oft, dass die Plattform daraus das Fahrzeug erkennt. Sie kann es
 * nicht, und das steht besser vor der Eingabe als danach.
 */
export function VinForm() {
  const [busy, setBusy] = useState(false);
  const [bereit, setBereit] = useState(false);
  const [fehler, setFehler] = useState<string | null>(null);
  const [feldFehler, setFeldFehler] = useState<string | undefined>(undefined);

  /* Siehe AuthForm: kein nativer Submit vor dem Einhaengen. */
  useEffect(() => {
    setBereit(true);
  }, []);

  async function absenden(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setFehler(null);
    setFeldFehler(undefined);

    const formular = new FormData(event.currentTarget);

    try {
      const antwort = await fetch('/api/verkaufen/entwuerfe', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ vin: formular.get('vin') }),
      });

      if (antwort.status === 401) {
        window.location.assign('/anmelden');
        return;
      }

      const inhalt = (await antwort.json()) as {
        data?: { draft?: { id: string } };
        error?: { message?: string; issues?: Record<string, string[]> };
      };

      if (antwort.ok && inhalt.data?.draft) {
        window.location.assign(`/verkaufen/entwurf/${inhalt.data.draft.id}`);
        return;
      }

      setFeldFehler(inhalt.error?.issues?.vin?.[0]);
      setFehler(inhalt.error?.message ?? 'Der Entwurf konnte nicht angelegt werden.');
    } catch {
      setFehler('Der Server war nicht erreichbar. Bitte erneut versuchen.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={absenden} method="post" className="space-y-4" noValidate>
      {fehler ? (
        <div
          role="alert"
          className="rounded-md border border-critical/40 bg-critical/10 px-4 py-3 text-sm text-critical"
        >
          {fehler}
        </div>
      ) : null}

      <InputField
        label="Fahrzeug-Identifizierungsnummer (VIN)"
        name="vin"
        required
        maxLength={17}
        autoComplete="off"
        spellCheck={false}
        className="font-mono uppercase"
        hint="17 Zeichen, im Fahrzeugschein unter Feld E."
        error={feldFehler}
      />

      <Button type="submit" variant="primary" size="lg" busy={busy} disabled={!bereit}>
        Weiter
      </Button>
    </form>
  );
}
