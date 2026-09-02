'use client';

import { Button } from '@/components/ui/Button';

function FeldInput({
  label,
  breit,
  mehrzeilig,
}: {
  label: string;
  breit?: boolean;
  mehrzeilig?: boolean;
}) {
  return (
    <div className={breit ? 'col-span-2' : ''}>
      <label className="block text-xs font-medium text-ink-muted print:text-[10px]">
        {label}
      </label>
      {mehrzeilig ? (
        <textarea
          className="mt-1 w-full resize-none border-b border-ink-subtle/30 bg-transparent pb-2 text-sm text-ink outline-none focus:border-accent print:pb-1 print:text-xs"
          rows={3}
        />
      ) : (
        <input
          type="text"
          className="mt-1 w-full border-b border-ink-subtle/30 bg-transparent pb-2 text-sm text-ink outline-none focus:border-accent print:pb-1 print:text-xs"
        />
      )}
    </div>
  );
}

function Pruefpunkt({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2 text-sm print:text-xs">
      <span className="mt-0.5 shrink-0">☐</span>
      <span>{text}</span>
    </li>
  );
}

function Abschnitt({
  titel,
  children,
}: {
  titel: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8 first:mt-0">
      <h2 className="mb-4 border-b border-accent/30 pb-2 text-sm font-semibold uppercase tracking-wider text-accent print:text-xs">
        {titel}
      </h2>
      {children}
    </section>
  );
}

export function UebergabeprotokollFormular() {
  return (
    <>
      <div className="mb-6 print:hidden">
        <Button variant="primary" size="md" onClick={() => window.print()}>
          Drucken / Als PDF speichern
        </Button>
      </div>

      <div className="rounded-lg border border-line bg-white p-8 text-ink print:border-none print:p-0 dark:bg-surface-1 print:dark:bg-white print:dark:text-black">
        <div className="mb-8 text-center">
          <h1 className="text-xl font-bold print:text-lg">
            Uebergabeprotokoll Kraftfahrzeug
          </h1>
          <p className="mt-1 text-xs text-ink-muted print:text-[10px]">
            Vorlage von CARONEX — keine Rechtsberatung
          </p>
        </div>

        <Abschnitt titel="Verkaeufer">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <FeldInput label="Vorname" />
            <FeldInput label="Nachname" />
            <FeldInput label="Strasse, Hausnummer" breit />
            <FeldInput label="PLZ" />
            <FeldInput label="Ort" />
          </div>
        </Abschnitt>

        <Abschnitt titel="Kaeufer">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <FeldInput label="Vorname" />
            <FeldInput label="Nachname" />
            <FeldInput label="Strasse, Hausnummer" breit />
            <FeldInput label="PLZ" />
            <FeldInput label="Ort" />
          </div>
        </Abschnitt>

        <Abschnitt titel="Fahrzeugdaten">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <FeldInput label="Hersteller / Modell" breit />
            <FeldInput label="Fahrzeug-Identifizierungsnummer (FIN/VIN)" breit />
            <FeldInput label="Amtliches Kennzeichen" />
            <FeldInput label="Farbe" />
          </div>
        </Abschnitt>

        <Abschnitt titel="Uebergabe">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <FeldInput label="Datum der Uebergabe" />
            <FeldInput label="Uhrzeit" />
            <FeldInput label="Ort der Uebergabe" breit />
            <FeldInput label="Kilometerstand bei Uebergabe" />
            <FeldInput label="Tankfuellung (ca. %)" />
          </div>
        </Abschnitt>

        <Abschnitt titel="Zustand Aussen">
          <ul className="space-y-2">
            <Pruefpunkt text="Lack: Kratzer, Dellen, Absplitterungen dokumentiert" />
            <Pruefpunkt text="Scheiben: Steinschlaege, Risse geprueft" />
            <Pruefpunkt text="Scheinwerfer und Rueckleuchten funktionsfaehig" />
            <Pruefpunkt text="Reifen: Profiltiefe ausreichend, gleichmaessig abgefahren" />
            <Pruefpunkt text="Felgen: Beschaedigungen, Bordsteinschaeden" />
            <Pruefpunkt text="Unterboden: sichtbare Rostschaeden" />
          </ul>
          <div className="mt-4">
            <FeldInput label="Sichtbare Schaeden aussen (Beschreibung)" mehrzeilig breit />
          </div>
        </Abschnitt>

        <Abschnitt titel="Zustand Innen">
          <ul className="space-y-2">
            <Pruefpunkt text="Sitze: Verschleiss, Risse, Flecken" />
            <Pruefpunkt text="Lenkrad und Schaltknauf: Abnutzung" />
            <Pruefpunkt text="Armaturenbrett: Beschaedigungen" />
            <Pruefpunkt text="Infotainment / Radio funktionsfaehig" />
            <Pruefpunkt text="Klimaanlage / Heizung funktionsfaehig" />
            <Pruefpunkt text="Elektrische Fensterheber funktionsfaehig" />
          </ul>
          <div className="mt-4">
            <FeldInput label="Sichtbare Schaeden innen (Beschreibung)" mehrzeilig breit />
          </div>
        </Abschnitt>

        <Abschnitt titel="Uebergebene Gegenstaende und Unterlagen">
          <ul className="space-y-2">
            <Pruefpunkt text="Zulassungsbescheinigung Teil II (Fahrzeugbrief)" />
            <Pruefpunkt text="Zulassungsbescheinigung Teil I (Fahrzeugschein)" />
            <Pruefpunkt text="Serviceheft / Scheckheft" />
            <Pruefpunkt text="Bedienungsanleitung" />
            <Pruefpunkt text="Letzter HU-/AU-Bericht" />
            <Pruefpunkt text="Ersatzrad / Reifenreparaturset / Kompressor" />
            <Pruefpunkt text="Warndreieck und Verbandskasten" />
            <Pruefpunkt text="Winterreifen / Sommerreifen (Satz)" />
          </ul>
          <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4">
            <FeldInput label="Anzahl uebergebener Schluessel" />
            <FeldInput label="Sonstiges Zubehoer" breit />
          </div>
        </Abschnitt>

        <Abschnitt titel="Weitere Vereinbarungen">
          <FeldInput label="Vereinbarungen zwischen Kaeufer und Verkaeufer" mehrzeilig breit />
        </Abschnitt>

        <section className="mt-10">
          <h2 className="mb-4 border-b border-accent/30 pb-2 text-sm font-semibold uppercase tracking-wider text-accent print:text-xs">
            Unterschriften
          </h2>
          <p className="mb-6 text-sm text-ink print:text-xs">
            Beide Parteien bestaetigen den oben dokumentierten Zustand des
            Fahrzeugs bei Uebergabe.
          </p>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <FeldInput label="Ort, Datum" breit />
              <div className="mt-12 border-b border-ink print:mt-16" />
              <p className="mt-1 text-xs text-ink-muted">Verkaeufer</p>
            </div>
            <div>
              <FeldInput label="Ort, Datum" breit />
              <div className="mt-12 border-b border-ink print:mt-16" />
              <p className="mt-1 text-xs text-ink-muted">Kaeufer</p>
            </div>
          </div>
        </section>

        <div className="mt-8 border-t border-line pt-4 text-center">
          <p className="text-[10px] text-ink-subtle">
            Vorlage erstellt mit CARONEX — keine Rechtsberatung, keine Gewaehr.
            CARONEX ist nicht Vertragspartei.
          </p>
        </div>
      </div>
    </>
  );
}
