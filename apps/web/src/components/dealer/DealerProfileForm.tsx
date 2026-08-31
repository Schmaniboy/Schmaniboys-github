'use client';

import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { InputField, TextareaField } from '@/components/ui/Field';

interface Werte {
  name: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  websiteUrl: string;
  street: string;
  postalCode: string;
  city: string;
  vatId: string;
}

export function DealerProfileForm({
  werte,
  logoStorageKey,
  schreibgeschuetzt,
}: {
  werte: Werte;
  logoStorageKey: string | null;
  schreibgeschuetzt: boolean;
}) {
  const [bereit, setBereit] = useState(false);
  const [laeuft, setLaeuft] = useState(false);
  const [logo, setLogo] = useState(logoStorageKey);
  const [meldung, setMeldung] = useState<{ art: 'gut' | 'schlecht'; text: string } | null>(null);
  const dateiFeld = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setBereit(true);
  }, []);

  async function absenden(ereignis: React.FormEvent<HTMLFormElement>) {
    ereignis.preventDefault();
    const formular = new FormData(ereignis.currentTarget);
    setLaeuft(true);
    setMeldung(null);

    try {
      const antwort = await fetch('/api/haendler/profil', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formular)),
      });
      if (antwort.ok) {
        setMeldung({ art: 'gut', text: 'Gespeichert.' });
      } else {
        const inhalt = (await antwort.json()) as {
          error?: { message?: string; issues?: Record<string, string[]> };
        };
        const erstesFeld = Object.values(inhalt.error?.issues ?? {})[0]?.[0];
        setMeldung({
          art: 'schlecht',
          text: erstesFeld ?? inhalt.error?.message ?? 'Das hat gerade nicht geklappt.',
        });
      }
    } catch {
      setMeldung({ art: 'schlecht', text: 'Das hat gerade nicht geklappt.' });
    } finally {
      setLaeuft(false);
    }
  }

  async function logoHochladen(dateien: FileList | null) {
    const datei = dateien?.[0];
    if (!datei) return;

    setLaeuft(true);
    setMeldung(null);
    const formular = new FormData();
    formular.append('datei', datei);

    try {
      const antwort = await fetch('/api/haendler/logo', { method: 'PUT', body: formular });
      const inhalt = (await antwort.json()) as {
        data?: { logoStorageKey: string };
        error?: { message?: string };
      };
      if (antwort.ok && inhalt.data) {
        setLogo(inhalt.data.logoStorageKey);
        setMeldung({ art: 'gut', text: 'Logo gespeichert.' });
      } else {
        setMeldung({
          art: 'schlecht',
          text: inhalt.error?.message ?? 'Das Logo wurde nicht angenommen.',
        });
      }
    } catch {
      setMeldung({ art: 'schlecht', text: 'Das Logo wurde nicht angenommen.' });
    } finally {
      if (dateiFeld.current) dateiFeld.current.value = '';
      setLaeuft(false);
    }
  }

  const gesperrt = schreibgeschuetzt || !bereit || laeuft;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-md border border-line/60 bg-surface-2">
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={`/api/bilder/${logo}`} alt="Logo des Betriebs" className="h-full w-full object-contain" />
          ) : (
            <span className="text-xs text-ink-subtle">kein Logo</span>
          )}
        </div>
        {!schreibgeschuetzt ? (
          <input
            ref={dateiFeld}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            aria-label="Logo hochladen"
            disabled={gesperrt}
            onChange={(ereignis) => logoHochladen(ereignis.currentTarget.files)}
            className="block text-base sm:text-sm text-ink-muted file:mr-3 file:h-11 file:rounded-md file:border file:border-line file:bg-surface-2 file:px-3 file:text-base sm:file:text-sm file:text-ink"
          />
        ) : null}
      </div>

      <form onSubmit={absenden} method="post" className="space-y-4">
        <InputField name="name" label="Name des Betriebs" defaultValue={werte.name} required disabled={schreibgeschuetzt} />

        <TextareaField
          name="description"
          label="Kurzbeschreibung"
          defaultValue={werte.description}
          rows={5}
          maxLength={4000}
          disabled={schreibgeschuetzt}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <InputField name="contactEmail" label="E-Mail" defaultValue={werte.contactEmail} disabled={schreibgeschuetzt} />
          <InputField name="contactPhone" label="Telefon" defaultValue={werte.contactPhone} disabled={schreibgeschuetzt} />
        </div>

        <InputField name="websiteUrl" label="Website" defaultValue={werte.websiteUrl} placeholder="https://…" disabled={schreibgeschuetzt} />

        <InputField name="street" label="Straße und Hausnummer" defaultValue={werte.street} disabled={schreibgeschuetzt} />

        <div className="grid gap-4 sm:grid-cols-[8rem_1fr]">
          <InputField name="postalCode" label="PLZ" defaultValue={werte.postalCode} disabled={schreibgeschuetzt} />
          <InputField name="city" label="Ort" defaultValue={werte.city} disabled={schreibgeschuetzt} />
        </div>

        <InputField name="vatId" label="USt-IdNr." defaultValue={werte.vatId} placeholder="DE123456789" disabled={schreibgeschuetzt} />

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

        {!schreibgeschuetzt ? (
          <Button type="submit" disabled={gesperrt}>
            {laeuft ? 'Wird gespeichert …' : 'Profil speichern'}
          </Button>
        ) : null}
      </form>
    </div>
  );
}
