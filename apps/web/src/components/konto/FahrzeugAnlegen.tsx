'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { FormEvent } from 'react';

import { Button } from '@/components/ui/Button';
import { InputField, TextareaField } from '@/components/ui/Field';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';

/**
 * Fahrzeug eintragen.
 *
 * Nur die Bezeichnung ist Pflicht. Ein Formular, das vollstaendige Angaben
 * erzwingt, fuehrt dazu, dass geraten wird -- und geratene Angaben sind
 * genau das, wogegen diese Plattform gebaut ist. Die Zuordnung zur Baureihe
 * kommt spaeter ueber den Katalog dazu.
 */
export function FahrzeugAnlegen({
  hersteller,
}: {
  hersteller: { slug: string; name: string }[];
}) {
  const router = useRouter();
  const [offen, setOffen] = useState(false);
  const [laeuft, setLaeuft] = useState(false);
  const [fehler, setFehler] = useState<string | null>(null);

  async function absenden(ereignis: FormEvent<HTMLFormElement>) {
    ereignis.preventDefault();
    setFehler(null);
    setLaeuft(true);

    const formular = new FormData(ereignis.currentTarget);
    const zahl = (feld: string) => {
      const roh = String(formular.get(feld) ?? '').trim();
      if (roh.length === 0) return undefined;
      const wert = Number(roh);
      return Number.isFinite(wert) ? wert : undefined;
    };
    const text = (feld: string) => {
      const roh = String(formular.get(feld) ?? '').trim();
      return roh.length === 0 ? undefined : roh;
    };

    try {
      const antwort = await fetch('/api/konto/fahrzeuge', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          label: text('label') ?? '',
          vin: text('vin'),
          modelYear: zahl('modelYear'),
          mileageKm: zahl('mileageKm'),
          note: text('note'),
        }),
      });

      if (!antwort.ok) {
        const daten = (await antwort.json().catch(() => null)) as
          | { error?: { message?: string; details?: Record<string, string[]> } }
          | null;
        const erstesDetail = daten?.error?.details
          ? Object.values(daten.error.details)[0]?.[0]
          : undefined;
        setFehler(
          erstesDetail ??
            daten?.error?.message ??
            'Das Fahrzeug ließ sich nicht speichern. Bitte versuchen Sie es erneut.',
        );
        return;
      }

      setOffen(false);
      router.refresh();
    } catch {
      setFehler('Keine Verbindung. Bitte prüfen Sie Ihre Internetverbindung.');
    } finally {
      setLaeuft(false);
    }
  }

  if (!offen) {
    return (
      <Button type="button" onClick={() => setOffen(true)}>
        Fahrzeug eintragen
      </Button>
    );
  }

  return (
    <Card>
      <CardHeader
        title="Fahrzeug eintragen"
        description="Nur die Bezeichnung ist nötig. Baureihe, Motor und Ausstattung lassen sich danach über den Katalog zuordnen."
      />
      <CardBody>
        <form onSubmit={absenden} className="space-y-4" noValidate>
          <InputField
            label="Bezeichnung"
            name="label"
            required
            maxLength={80}
            placeholder="Der Kombi"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <InputField
              label="Modelljahr"
              name="modelYear"
              inputMode="numeric"
              maxLength={4}
              placeholder="2017"
            />
            <InputField
              label="Kilometerstand"
              name="mileageKm"
              inputMode="numeric"
              placeholder="128000"
            />
          </div>

          <InputField
            label="Fahrgestellnummer"
            name="vin"
            maxLength={17}
            autoComplete="off"
            spellCheck={false}
            className="font-mono uppercase"
            hint="Freiwillig. Aus der Nummer selbst lässt sich ohne Herstellerdaten nur der Hersteller ablesen — wir leiten daraus nichts ab, was wir nicht belegen können."
          />

          <TextareaField label="Notiz" name="note" rows={3} maxLength={2000} />

          {fehler ? (
            <p role="alert" className="text-sm text-critical">
              {fehler}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={laeuft}>
              {laeuft ? 'Wird gespeichert …' : 'Speichern'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => setOffen(false)}>
              Abbrechen
            </Button>
          </div>

          {hersteller.length === 0 ? (
            <p className="text-xs text-ink-subtle">
              Der Katalog enthält noch keine veröffentlichten Marken — die Zuordnung zu einer
              Baureihe ist deshalb erst später möglich.
            </p>
          ) : null}
        </form>
      </CardBody>
    </Card>
  );
}
