import Link from 'next/link';

import { CheckboxField, InputField, SelectField } from '@/components/ui/Field';

/**
 * Filter des Marktplatzes.
 *
 * Bewusst ein gewoehnliches Formular mit GET: Die Filter stehen danach in
 * der Adresszeile, lassen sich verlinken, im Verlauf zurueckblaettern und
 * ohne JavaScript bedienen. Ein Zustand im Browser koennte nichts davon.
 *
 * GET ist hier ausserdem unbedenklich -- anders als bei Anmeldeformularen
 * geht kein Geheimnis in die URL.
 */
export function MarketplaceFilters({ werte }: { werte: Record<string, string | undefined> }) {
  return (
    <form method="get" action="/marktplatz" className="space-y-4">
      <fieldset className="space-y-3">
        <legend className="mb-2 text-sm font-semibold text-ink">Suchen und filtern</legend>

        <Feld name="q" label="Suchbegriff" wert={werte.q} placeholder="Modell, Titel" />

        <div className="grid grid-cols-2 gap-2">
          <Feld name="preisVon" label="Preis ab (€)" wert={werte.preisVon} inputMode="numeric" />
          <Feld name="preisBis" label="Preis bis (€)" wert={werte.preisBis} inputMode="numeric" />
        </div>

        <Feld
          name="kilometerBis"
          label="Kilometer bis"
          wert={werte.kilometerBis}
          inputMode="numeric"
        />

        <div className="grid grid-cols-2 gap-2">
          <Feld name="baujahrVon" label="Baujahr ab" wert={werte.baujahrVon} inputMode="numeric" />
          <Feld name="baujahrBis" label="Baujahr bis" wert={werte.baujahrBis} inputMode="numeric" />
        </div>

        <CheckboxField
          name="nurUnfallfrei"
          value="true"
          defaultChecked={werte.nurUnfallfrei === 'true'}
          label="Nur ausdrücklich unfallfreie Fahrzeuge"
          hint="Anzeigen ohne Angabe zum Unfallschaden werden dabei ausgeblendet — fehlende Angabe ist kein „unfallfrei“."
        />

        <SelectField
          label="Sortierung"
          name="sortierung"
          defaultValue={werte.sortierung ?? 'neueste'}
        >
          <option value="neueste">Neueste zuerst</option>
          <option value="preis-auf">Preis aufsteigend</option>
          <option value="preis-ab">Preis absteigend</option>
          <option value="kilometer-auf">Kilometerstand aufsteigend</option>
        </SelectField>
      </fieldset>

      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-ink transition-colors hover:bg-accent-strong"
        >
          Anwenden
        </button>
        <Link
          href="/marktplatz"
          className="rounded-md border border-line px-4 py-2 text-sm text-ink-muted transition-colors hover:text-ink"
        >
          Zurücksetzen
        </Link>
      </div>
    </form>
  );
}

/*
 * Duenne Huelle um InputField: Die Filter arbeiten mit Zeichenketten, die
 * auch undefined sein koennen (kein Filter gesetzt). Frueher stand hier ein
 * eigener Nachbau mit eigenem Aussehen -- auf dem Telefon 14px Schrift und
 * 38px hohe Felder, also Safari-Zoom beim Hineintippen und ein Ziel, das mit
 * dem Daumen kaum zu treffen war. Die gemeinsame Komponente loest beides.
 */
function Feld({
  name,
  label,
  wert,
  placeholder,
  inputMode,
}: {
  name: string;
  label: string;
  wert: string | undefined;
  placeholder?: string;
  inputMode?: 'numeric';
}) {
  return (
    <InputField
      label={label}
      name={name}
      type="text"
      defaultValue={wert ?? ''}
      placeholder={placeholder}
      inputMode={inputMode}
    />
  );
}
