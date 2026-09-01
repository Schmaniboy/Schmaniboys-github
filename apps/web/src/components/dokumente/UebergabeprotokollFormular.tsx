'use client';

import { Button } from '@/components/ui/Button';

function Feld({ label, breit }: { label: string; breit?: boolean }) {
  return (
    <div className={breit ? 'col-span-2' : ''}>
      <label className="block text-xs font-medium text-ink-muted print:text-[10px]">
        {label}
      </label>
      <div className="mt-1 border-b border-ink-subtle/30 pb-4 print:pb-6" />
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
            Übergabeprotokoll Kraftfahrzeug
          </h1>
          <p className="mt-1 text-xs text-ink-muted print:text-[10px]">
            Vorlage von CARONEX (keine Rechtsberatung)
          </p>
        </div>

        <section>
          <h2 className="mb-4 border-b border-accent/30 pb-2 text-sm font-semibold uppercase tracking-wider text-accent print:text-xs">
            Fahrzeugdaten
          </h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <Feld label="Marke / Modell" breit />
            <Feld label="Kennzeichen" />
            <Feld label="VIN" />
            <Feld label="Kilometerstand bei Übergabe" />
            <Feld label="Tankfüllung (ca. %)" />
            <Feld label="Datum der Übergabe" />
            <Feld label="Uhrzeit" />
          </div>
        </section>

        <section className="mt-8">
          <h2 className="mb-4 border-b border-accent/30 pb-2 text-sm font-semibold uppercase tracking-wider text-accent print:text-xs">
            Zustand Außen
          </h2>
          <ul className="space-y-2">
            <Pruefpunkt text="Lack: Kratzer, Dellen, Absplitterungen dokumentiert" />
            <Pruefpunkt text="Scheiben: Steinschläge, Risse geprüft" />
            <Pruefpunkt text="Scheinwerfer und Rückleuchten funktionsfähig" />
            <Pruefpunkt text="Reifen: Profiltiefe ausreichend, gleichmäßig abgefahren" />
            <Pruefpunkt text="Felgen: Beschädigungen, Bordsteinschäden" />
            <Pruefpunkt text="Unterboden: sichtbare Rostschäden" />
          </ul>
          <div className="mt-4">
            <p className="text-xs font-medium text-ink-muted">Anmerkungen:</p>
            <div className="mt-2 border-b border-ink-subtle/30 pb-8 print:pb-12" />
            <div className="mt-4 border-b border-ink-subtle/30 pb-8 print:pb-12" />
          </div>
        </section>

        <section className="mt-8">
          <h2 className="mb-4 border-b border-accent/30 pb-2 text-sm font-semibold uppercase tracking-wider text-accent print:text-xs">
            Zustand Innen
          </h2>
          <ul className="space-y-2">
            <Pruefpunkt text="Sitze: Verschleiß, Risse, Flecken" />
            <Pruefpunkt text="Lenkrad und Schaltknauf: Abnutzung" />
            <Pruefpunkt text="Armaturenbrett: Beschädigungen" />
            <Pruefpunkt text="Infotainment / Radio funktionsfähig" />
            <Pruefpunkt text="Klimaanlage / Heizung funktionsfähig" />
            <Pruefpunkt text="Elektrische Fensterheber funktionsfähig" />
          </ul>
          <div className="mt-4">
            <p className="text-xs font-medium text-ink-muted">Anmerkungen:</p>
            <div className="mt-2 border-b border-ink-subtle/30 pb-8 print:pb-12" />
          </div>
        </section>

        <section className="mt-8">
          <h2 className="mb-4 border-b border-accent/30 pb-2 text-sm font-semibold uppercase tracking-wider text-accent print:text-xs">
            Übergebene Gegenstände
          </h2>
          <ul className="space-y-2">
            <Pruefpunkt text="Schlüssel (Anzahl: ____)" />
            <Pruefpunkt text="Zulassungsbescheinigung Teil I (Fahrzeugschein)" />
            <Pruefpunkt text="Zulassungsbescheinigung Teil II (Fahrzeugbrief)" />
            <Pruefpunkt text="Serviceheft / Scheckheft" />
            <Pruefpunkt text="Bedienungsanleitung" />
            <Pruefpunkt text="Letzer HU-/AU-Bericht" />
            <Pruefpunkt text="Ersatzrad / Reifenreparaturset / Kompressor" />
            <Pruefpunkt text="Warndreieck und Verbandskasten" />
            <Pruefpunkt text="Winterreifen / Sommerreifen (Satz)" />
          </ul>
          <div className="mt-4">
            <p className="text-xs font-medium text-ink-muted">Sonstiges:</p>
            <div className="mt-2 border-b border-ink-subtle/30 pb-8 print:pb-12" />
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-4 border-b border-accent/30 pb-2 text-sm font-semibold uppercase tracking-wider text-accent print:text-xs">
            Unterschriften
          </h2>
          <p className="mb-6 text-sm text-ink print:text-xs">
            Beide Parteien bestätigen den oben dokumentierten Zustand des
            Fahrzeugs bei Übergabe.
          </p>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="mt-12 border-b border-ink print:mt-16" />
              <p className="mt-1 text-xs text-ink-muted">Verkäufer — Ort, Datum, Unterschrift</p>
            </div>
            <div>
              <div className="mt-12 border-b border-ink print:mt-16" />
              <p className="mt-1 text-xs text-ink-muted">Käufer — Ort, Datum, Unterschrift</p>
            </div>
          </div>
        </section>

        <div className="mt-8 border-t border-line pt-4 text-center">
          <p className="text-[10px] text-ink-subtle">
            Vorlage erstellt mit CARONEX — keine Rechtsberatung, keine Gewähr.
          </p>
        </div>
      </div>
    </>
  );
}
