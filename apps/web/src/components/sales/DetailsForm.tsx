'use client';

import { useEffect, useState, type FormEvent } from 'react';

/*
 * Gezielter Unterpfad statt des Sammelexports: `@ap/core` buendelt auch
 * serverseitige Teile -- Passwort-Hashing zieht `node:crypto` nach sich.
 * Ueber den Sammelexport landet das im Browser-Bundle und der Build bricht ab.
 * In Client-Komponenten wird deshalb immer der konkrete Pfad importiert.
 */
import { CONDITION_OPTIONS, SERVICE_HISTORY_OPTIONS } from '@ap/core/sales/schemas';

import { Button } from '@/components/ui/Button';
import { InputField, SelectField } from '@/components/ui/Field';

/**
 * Angaben zum konkreten Fahrzeug.
 *
 * Fast alles ist freiwillig. Der Hinweis dazu steht sichtbar auf der Seite:
 * Wer eine Angabe nicht sicher weiss, laesst sie leer. Weggelassene Angaben
 * erreichen die Texterzeugung gar nicht -- statt einer erfundenen Aussage
 * entsteht schlicht keine.
 */

interface Werte {
  mileageKm: number | null;
  firstRegistration: string | null;
  previousOwners: number | null;
  huValidUntil: string | null;
  serviceHistory: string | null;
  condition: string | null;
  tyreCondition: string | null;
  damages: string | null;
  hadAccident: boolean | null;
  accidentDetails: string | null;
  additionalNotes: string | null;
}

export function DetailsForm({ draftId, werte }: { draftId: string; werte: Werte }) {
  const [busy, setBusy] = useState(false);
  const [meldung, setMeldung] = useState<string | null>(null);
  const [gespeichert, setGespeichert] = useState(false);
  /* Siehe AuthForm: kein nativer Submit vor dem Einhaengen. */
  const [bereit, setBereit] = useState(false);

  useEffect(() => {
    setBereit(true);
  }, []);
  const [unfall, setUnfall] = useState<string>(
    werte.hadAccident === null ? '' : werte.hadAccident ? 'ja' : 'nein',
  );

  async function absenden(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMeldung(null);
    setGespeichert(false);

    const formular = new FormData(event.currentTarget);
    const zahl = (name: string): number | undefined => {
      const roh = formular.get(name);
      if (typeof roh !== 'string' || roh.trim() === '') return undefined;
      const wert = Number(roh);
      return Number.isFinite(wert) ? wert : undefined;
    };
    const text = (name: string): string | undefined => {
      const roh = formular.get(name);
      return typeof roh === 'string' && roh.trim() !== '' ? roh.trim() : undefined;
    };

    const unfallWert = formular.get('hadAccident');
    const koerper: Record<string, unknown> = {
      mileageKm: zahl('mileageKm'),
      previousOwners: zahl('previousOwners'),
      firstRegistration: text('firstRegistration'),
      huValidUntil: text('huValidUntil'),
      serviceHistory: text('serviceHistory'),
      condition: text('condition'),
      tyreCondition: text('tyreCondition'),
      damages: text('damages'),
      accidentDetails: text('accidentDetails'),
      additionalNotes: text('additionalNotes'),
      ...(unfallWert === 'ja' ? { hadAccident: true } : {}),
      ...(unfallWert === 'nein' ? { hadAccident: false } : {}),
    };

    for (const schluessel of Object.keys(koerper)) {
      if (koerper[schluessel] === undefined) delete koerper[schluessel];
    }

    try {
      const antwort = await fetch(`/api/verkaufen/entwuerfe/${draftId}/angaben`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(koerper),
      });

      if (antwort.ok) {
        setGespeichert(true);
        return;
      }

      const inhalt = (await antwort.json()) as { error?: { message?: string } };
      setMeldung(inhalt.error?.message ?? 'Die Angaben konnten nicht gespeichert werden.');
    } catch {
      setMeldung('Der Server war nicht erreichbar.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={absenden} method="post" className="space-y-4" noValidate>
      {meldung ? (
        <p
          role="alert"
          className="rounded-md border border-critical/40 bg-critical/10 px-4 py-3 text-sm text-critical"
        >
          {meldung}
        </p>
      ) : null}
      {gespeichert ? (
        <p role="status" className="text-sm text-positive">
          Angaben gespeichert.
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <InputField
          label="Kilometerstand"
          name="mileageKm"
          type="number"
          min={0}
          defaultValue={werte.mileageKm ?? ''}
          hint="Wie im Tacho abgelesen."
        />
        <InputField
          label="Vorbesitzer"
          name="previousOwners"
          type="number"
          min={0}
          defaultValue={werte.previousOwners ?? ''}
          hint="0 bedeutet Erstbesitz."
        />
        <InputField
          label="Erstzulassung"
          name="firstRegistration"
          type="date"
          defaultValue={werte.firstRegistration ?? ''}
        />
        <InputField
          label="HU gültig bis"
          name="huValidUntil"
          type="date"
          defaultValue={werte.huValidUntil ?? ''}
        />

        <SelectField label="Zustand" name="condition" defaultValue={werte.condition ?? ''}>
          <option value="">Keine Angabe</option>
          {CONDITION_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </SelectField>

        <SelectField
          label="Servicehistorie"
          name="serviceHistory"
          defaultValue={werte.serviceHistory ?? ''}
        >
          <option value="">Keine Angabe</option>
          {SERVICE_HISTORY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </SelectField>
      </div>

      <InputField
        label="Reifen"
        name="tyreCondition"
        defaultValue={werte.tyreCondition ?? ''}
        hint="Art und Profiltiefe, etwa „Sommerreifen, 5 mm“."
      />

      <InputField
        label="Schäden"
        name="damages"
        defaultValue={werte.damages ?? ''}
        hint="Kratzer, Diverses. Was Sie hier nicht nennen, steht auch nicht in der Anzeige."
      />

      <SelectField
        label="Unfallschaden"
        name="hadAccident"
        value={unfall}
        onChange={(event) => setUnfall(event.target.value)}
        hint="„Unfallfrei“ ist eine rechtlich erhebliche Aussage. Im Zweifel keine Angabe."
      >
        <option value="">Keine Angabe</option>
        <option value="nein">Unfallfrei</option>
        <option value="ja">Unfallschaden vorhanden</option>
      </SelectField>

      {unfall === 'ja' ? (
        <InputField
          label="Beschreibung des Unfallschadens"
          name="accidentDetails"
          defaultValue={werte.accidentDetails ?? ''}
          hint="Art, Zeitpunkt und ob fachgerecht instand gesetzt."
        />
      ) : null}

      <InputField
        label="Weitere Hinweise"
        name="additionalNotes"
        defaultValue={werte.additionalNotes ?? ''}
      />

      <Button type="submit" variant="secondary" busy={busy} disabled={!bereit}>
        Angaben speichern
      </Button>
    </form>
  );
}
