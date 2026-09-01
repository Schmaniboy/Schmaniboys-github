'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { SelectField } from '@/components/ui/Field';
import { useToast } from '@/components/ui/Toast';

/**
 * Gefuehrte Fahrzeugbestimmung.
 *
 * Vier Ebenen, jede aus dem Katalog geladen: Hersteller, Modell, Generation,
 * Motorvariante -- dazu wahlweise die Ausstattungslinie. Es gibt keine
 * Freitexteingabe: Was hier ausgewaehlt wird, existiert im Katalog.
 *
 * Die Vorauswahl beim Hersteller stammt aus der Herstellerkennung der VIN.
 * Sie ist ein Vorschlag, kein Ergebnis -- die Liste bleibt frei waehlbar.
 */

interface Option {
  id: string;
  name: string;
}

async function ladeOptionen(ebene: string, eltern: string): Promise<Option[]> {
  const antwort = await fetch(
    `/api/katalog/auswahl?ebene=${ebene}&eltern=${encodeURIComponent(eltern)}`,
  );
  if (!antwort.ok) return [];
  const inhalt = (await antwort.json()) as { data?: { options?: Option[] } };
  return inhalt.data?.options ?? [];
}

export function VehiclePicker({
  draftId,
  manufacturers,
  vorauswahl,
}: {
  draftId: string;
  manufacturers: readonly Option[];
  vorauswahl: {
    manufacturerId: string | null;
    modelId: string | null;
    generationId: string | null;
    powertrainId: string | null;
    trimLineId: string | null;
  };
}) {
  const [hersteller, setHersteller] = useState(vorauswahl.manufacturerId ?? '');
  const [modell, setModell] = useState(vorauswahl.modelId ?? '');
  const [generation, setGeneration] = useState(vorauswahl.generationId ?? '');
  const [antrieb, setAntrieb] = useState(vorauswahl.powertrainId ?? '');
  const [linie, setLinie] = useState(vorauswahl.trimLineId ?? '');

  const [modelle, setModelle] = useState<Option[]>([]);
  const [generationen, setGenerationen] = useState<Option[]>([]);
  const [antriebe, setAntriebe] = useState<Option[]>([]);
  const [linien, setLinien] = useState<Option[]>([]);

  const [busy, setBusy] = useState(false);
  const { zeigen } = useToast();

  useEffect(() => {
    if (!hersteller) {
      setModelle([]);
      return;
    }
    void ladeOptionen('modelle', hersteller).then(setModelle);
  }, [hersteller]);

  useEffect(() => {
    if (!modell) {
      setGenerationen([]);
      return;
    }
    void ladeOptionen('generationen', modell).then(setGenerationen);
  }, [modell]);

  useEffect(() => {
    if (!generation) {
      setAntriebe([]);
      setLinien([]);
      return;
    }
    void ladeOptionen('antriebe', generation).then(setAntriebe);
    void ladeOptionen('linien', generation).then(setLinien);
  }, [generation]);

  async function bestaetigen() {
    setBusy(true);

    try {
      const antwort = await fetch(`/api/verkaufen/entwuerfe/${draftId}/fahrzeug`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          manufacturerId: hersteller,
          modelId: modell,
          generationId: generation,
          powertrainId: antrieb || null,
          trimLineId: linie || null,
        }),
      });

      if (antwort.ok) {
        window.location.reload();
        return;
      }

      const inhalt = (await antwort.json()) as { error?: { message?: string } };
      zeigen(inhalt.error?.message ?? 'Die Zuordnung konnte nicht gespeichert werden.', {
        ton: 'critical',
      });
    } catch {
      zeigen('Der Server war nicht erreichbar.', { ton: 'critical' });
    } finally {
      setBusy(false);
    }
  }

  const vollstaendig = Boolean(hersteller && modell && generation);

  return (
    <div className="space-y-4">
      <SelectField
        label="Hersteller"
        value={hersteller}
        onChange={(event) => {
          setHersteller(event.target.value);
          setModell('');
          setGeneration('');
          setAntrieb('');
          setLinie('');
        }}
      >
        <option value="">Bitte wählen</option>
        {manufacturers.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </SelectField>

      <SelectField
        label="Modell"
        value={modell}
        disabled={modelle.length === 0}
        hint={
          hersteller && modelle.length === 0
            ? 'Für diesen Hersteller ist noch kein Modell veröffentlicht.'
            : undefined
        }
        onChange={(event) => {
          setModell(event.target.value);
          setGeneration('');
          setAntrieb('');
          setLinie('');
        }}
      >
        <option value="">Bitte wählen</option>
        {modelle.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </SelectField>

      <SelectField
        label="Generation"
        value={generation}
        disabled={generationen.length === 0}
        onChange={(event) => {
          setGeneration(event.target.value);
          setAntrieb('');
          setLinie('');
        }}
      >
        <option value="">Bitte wählen</option>
        {generationen.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </SelectField>

      <SelectField
        label="Motorvariante"
        value={antrieb}
        disabled={antriebe.length === 0}
        hint="Freiwillig, aber die Anzeige wird damit deutlich genauer."
        onChange={(event) => setAntrieb(event.target.value)}
      >
        <option value="">Nicht angeben</option>
        {antriebe.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </SelectField>

      <SelectField
        label="Ausstattungslinie"
        value={linie}
        disabled={linien.length === 0}
        onChange={(event) => setLinie(event.target.value)}
      >
        <option value="">Nicht angeben</option>
        {linien.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </SelectField>

      <Button variant="primary" busy={busy} disabled={!vollstaendig} onClick={bestaetigen}>
        Fahrzeug bestätigen
      </Button>
      <p className="text-xs leading-relaxed text-ink-subtle">
        Mit der Bestätigung erklären Sie, dass diese Zuordnung stimmt. Alle
        weiteren Angaben und der erzeugte Text bauen darauf auf.
      </p>
    </div>
  );
}
