'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { CheckboxField, InputField, TextareaField } from '@/components/ui/Field';

/**
 * Bearbeitung einer Anzeige.
 *
 * `method="post"` und die Hydrationssperre sind Pflicht, nicht Kosmetik:
 * Ohne beides sendet der Browser vor der Hydration nativ per GET und
 * schreibt alle Feldwerte in die Adresszeile.
 */

interface Werte {
  title: string;
  description: string;
  priceCents: number;
  negotiable: boolean;
  postalCode: string;
  city: string;
}

export function ListingEditForm({
  listingId,
  werte,
}: {
  listingId: string;
  werte: Werte;
}) {
  const [bereit, setBereit] = useState(false);
  const [laeuft, setLaeuft] = useState(false);
  const [meldung, setMeldung] = useState<{ art: 'gut' | 'schlecht'; text: string } | null>(null);

  useEffect(() => {
    setBereit(true);
  }, []);

  async function absenden(ereignis: React.FormEvent<HTMLFormElement>) {
    ereignis.preventDefault();
    const formular = new FormData(ereignis.currentTarget);
    setLaeuft(true);
    setMeldung(null);

    const preisEuro = Number(String(formular.get('preis') ?? '').replace(',', '.'));

    try {
      const antwort = await fetch(`/api/anzeigen/${listingId}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          title: String(formular.get('title') ?? ''),
          description: String(formular.get('description') ?? ''),
          priceCents: Number.isFinite(preisEuro) ? Math.round(preisEuro * 100) : 0,
          negotiable: formular.get('negotiable') === 'on',
          postalCode: String(formular.get('postalCode') ?? ''),
          city: String(formular.get('city') ?? ''),
        }),
      });

      if (antwort.ok) {
        setMeldung({ art: 'gut', text: 'Gespeichert.' });
      } else {
        const inhalt = (await antwort.json()) as { error?: { message?: string } };
        setMeldung({
          art: 'schlecht',
          text: inhalt.error?.message ?? 'Das hat gerade nicht geklappt.',
        });
      }
    } catch {
      setMeldung({ art: 'schlecht', text: 'Das hat gerade nicht geklappt.' });
    } finally {
      setLaeuft(false);
    }
  }

  return (
    <form onSubmit={absenden} method="post" className="space-y-4">
      <InputField
        label="Titel"
        name="title"
        defaultValue={werte.title}
        maxLength={120}
        required
      />

      <TextareaField
        label="Beschreibung"
        name="description"
        defaultValue={werte.description}
        rows={10}
        required
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <InputField
          label="Preis (€)"
          name="preis"
          inputMode="decimal"
          defaultValue={(werte.priceCents / 100).toFixed(0)}
          required
          className="tabular"
        />
        <div className="flex items-end pb-2.5">
          <CheckboxField
            label="Verhandlungsbasis"
            name="negotiable"
            defaultChecked={werte.negotiable}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-[8rem_1fr]">
        <InputField
          label="PLZ"
          name="postalCode"
          defaultValue={werte.postalCode}
          inputMode="numeric"
          maxLength={5}
          required
          className="tabular"
        />
        <InputField label="Ort" name="city" defaultValue={werte.city} maxLength={100} required />
      </div>

      <p className="text-xs leading-relaxed text-ink-subtle">
        Der Standort erscheint in der Anzeige als Postleitzahl und Ort. Eine Straße oder
        Hausnummer wird nicht erfasst — sie gehört nicht in ein öffentliches Inserat.
      </p>

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

      <Button type="submit" disabled={!bereit || laeuft}>
        {laeuft ? 'Wird gespeichert …' : 'Änderungen speichern'}
      </Button>
    </form>
  );
}
