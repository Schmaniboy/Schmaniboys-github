'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { CheckboxField, InputField, TextareaField } from '@/components/ui/Field';
import { useToast } from '@/components/ui/Toast';

/**
 * Aus einem Entwurf eine Anzeige machen.
 *
 * Vorbelegt wird aus den erzeugten Texten, sofern es sie gibt -- aber sie
 * sind kein Muss. Wer seine Beschreibung selbst schreiben will, soll das
 * duerfen; erzwungen wird nur die bestaetigte Fahrzeugzuordnung.
 */
export function PublishForm({
  draftId,
  vorschlag,
  haendler,
}: {
  draftId: string;
  vorschlag: { title: string; description: string };
  /** Betrieb der angemeldeten Person, sofern sie einem angehoert. */
  haendler: { id: string; name: string } | null;
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
      const antwort = await fetch('/api/anzeigen', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          draftId,
          title: String(formular.get('title') ?? ''),
          description: String(formular.get('description') ?? ''),
          priceCents: Number.isFinite(preisEuro) ? Math.round(preisEuro * 100) : 0,
          negotiable: formular.get('negotiable') === 'on',
          postalCode: String(formular.get('postalCode') ?? ''),
          city: String(formular.get('city') ?? ''),
          ...(formular.get('alsHaendler') === 'on' && haendler
            ? { dealerId: haendler.id }
            : {}),
        }),
      });

      const inhalt = (await antwort.json()) as {
        data?: { listing: { id: string } };
        error?: { message?: string };
      };

      if (antwort.ok && inhalt.data) {
        window.location.assign(`/konto/anzeigen/${inhalt.data.listing.id}`);
        return;
      }
      zeigen(inhalt.error?.message ?? 'Die Anzeige konnte nicht angelegt werden.', {
        ton: 'critical',
      });
    } catch {
      zeigen('Die Anzeige konnte nicht angelegt werden.', { ton: 'critical' });
    } finally {
      setLaeuft(false);
    }
  }

  return (
    <form onSubmit={absenden} method="post" className="space-y-4" noValidate>
      <InputField
        label="Titel der Anzeige"
        name="title"
        defaultValue={vorschlag.title}
        maxLength={120}
        required
      />

      <TextareaField
        label="Beschreibung"
        name="description"
        defaultValue={vorschlag.description}
        rows={8}
        required
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <InputField label="Preis (€)" name="preis" inputMode="decimal" required className="tabular" />
        <div className="flex items-end pb-2.5">
          <CheckboxField label="Verhandlungsbasis" name="negotiable" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-[8rem_1fr]">
        <InputField
          label="PLZ"
          name="postalCode"
          inputMode="numeric"
          maxLength={5}
          required
          className="tabular"
        />
        <InputField label="Ort" name="city" maxLength={100} required />
      </div>

      {haendler ? (
        <CheckboxField
          name="alsHaendler"
          defaultChecked
          label={
            <>
              Im Namen von <span className="text-ink">{haendler.name}</span> inserieren. Die
              Anzeige erscheint dann als gewerbliches Angebot und verweist auf das
              Händlerprofil.
            </>
          }
        />
      ) : null}

      <p className="text-xs leading-relaxed text-ink-subtle">
        Die Anzeige entsteht zunächst als Entwurf. Bilder kommen im nächsten Schritt dazu;
        veröffentlicht wird erst, wenn Sie es auslösen.
      </p>

      <Button type="submit" disabled={!bereit || laeuft}>
        {laeuft ? 'Wird angelegt …' : 'Anzeige anlegen'}
      </Button>
    </form>
  );
}
