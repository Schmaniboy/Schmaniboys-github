'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { CheckboxField, InputField, TextareaField } from '@/components/ui/Field';
import { useToast } from '@/components/ui/Toast';

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
  const { zeigen } = useToast();

  useEffect(() => {
    setBereit(true);
  }, []);

  async function absenden(ereignis: React.FormEvent<HTMLFormElement>) {
    ereignis.preventDefault();
    const formular = new FormData(ereignis.currentTarget);
    setLaeuft(true);

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
        zeigen('Gespeichert.', { ton: 'positive' });
      } else {
        const inhalt = (await antwort.json()) as { error?: { message?: string } };
        zeigen(inhalt.error?.message ?? 'Das hat gerade nicht geklappt.', { ton: 'critical' });
      }
    } catch {
      zeigen('Das hat gerade nicht geklappt.', { ton: 'critical' });
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

      <Button type="submit" disabled={!bereit || laeuft}>
        {laeuft ? 'Wird gespeichert …' : 'Änderungen speichern'}
      </Button>
    </form>
  );
}
