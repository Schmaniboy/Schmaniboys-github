'use client';

import { useRef } from 'react';

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
      <div className="grid grid-cols-2 gap-x-6 gap-y-4">{children}</div>
    </section>
  );
}

export function KaufvertragFormular() {
  const druckRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div className="mb-6 flex gap-3 print:hidden">
        <Button
          variant="primary"
          size="md"
          onClick={() => window.print()}
        >
          Drucken / Als PDF speichern
        </Button>
      </div>

      <div
        ref={druckRef}
        className="rounded-lg border border-line bg-white p-8 text-ink print:border-none print:p-0 print:shadow-none dark:bg-surface-1 print:dark:bg-white print:dark:text-black"
      >
        <div className="mb-8 text-center">
          <h1 className="text-xl font-bold print:text-lg">
            Kaufvertrag über ein gebrauchtes Kraftfahrzeug
          </h1>
          <p className="mt-1 text-xs text-ink-muted print:text-[10px]">
            Zwischen Privatpersonen — Vorlage von CARONEX (keine Rechtsberatung)
          </p>
        </div>

        <Abschnitt titel="1. Verkäufer">
          <Feld label="Vorname" />
          <Feld label="Nachname" />
          <Feld label="Straße, Hausnummer" breit />
          <Feld label="PLZ" />
          <Feld label="Ort" />
          <Feld label="Telefon" />
          <Feld label="E-Mail" />
          <Feld label="Personalausweisnummer" breit />
        </Abschnitt>

        <Abschnitt titel="2. Käufer">
          <Feld label="Vorname" />
          <Feld label="Nachname" />
          <Feld label="Straße, Hausnummer" breit />
          <Feld label="PLZ" />
          <Feld label="Ort" />
          <Feld label="Telefon" />
          <Feld label="E-Mail" />
          <Feld label="Personalausweisnummer" breit />
        </Abschnitt>

        <Abschnitt titel="3. Fahrzeug">
          <Feld label="Marke / Modell" breit />
          <Feld label="Fahrzeug-Identifizierungsnummer (VIN)" breit />
          <Feld label="Erstzulassung" />
          <Feld label="Kilometerstand" />
          <Feld label="Farbe" />
          <Feld label="Hubraum / Leistung" />
          <Feld label="Amtliches Kennzeichen" />
          <Feld label="Nächste HU" />
          <Feld label="Anzahl Schlüssel" />
          <Feld label="Anzahl Vorbesitzer lt. Brief" />
        </Abschnitt>

        <Abschnitt titel="4. Kaufpreis">
          <Feld label="Kaufpreis in Euro (Zahl)" />
          <Feld label="Kaufpreis in Worten" />
          <Feld label="Zahlungsart (bar / Überweisung)" breit />
        </Abschnitt>

        <section className="mt-8">
          <h2 className="mb-4 border-b border-accent/30 pb-2 text-sm font-semibold uppercase tracking-wider text-accent print:text-xs">
            5. Vereinbarungen
          </h2>
          <div className="space-y-3 text-sm leading-relaxed text-ink print:text-xs">
            <p>
              Der Verkäufer versichert, dass das Fahrzeug sein Eigentum ist und
              frei von Rechten Dritter veräußert wird.
            </p>
            <p>
              Das Fahrzeug wird verkauft wie besichtigt und Probe gefahren.
              Die Sachmängelhaftung ist — soweit gesetzlich zulässig — ausgeschlossen.
              Dieser Ausschluss gilt nicht für Ansprüche aus vorsätzlich oder
              grob fahrlässig verursachten Schäden sowie bei arglistigem
              Verschweigen von Mängeln.
            </p>
            <p>
              Dem Verkäufer sind folgende Mängel bekannt:
            </p>
            <div className="border-b border-ink-subtle/30 pb-8 print:pb-12" />
            <div className="border-b border-ink-subtle/30 pb-8 print:pb-12" />
            <p>
              Das Fahrzeug war / war nicht Unfallfrei.{' '}
              <span className="text-ink-subtle">(Zutreffendes unterstreichen)</span>
            </p>
            <p>
              Falls nicht unfallfrei — Art und Umfang der Unfallschäden:
            </p>
            <div className="border-b border-ink-subtle/30 pb-8 print:pb-12" />
          </div>
        </section>

        <section className="mt-8">
          <h2 className="mb-4 border-b border-accent/30 pb-2 text-sm font-semibold uppercase tracking-wider text-accent print:text-xs">
            6. Übergabe
          </h2>
          <div className="space-y-3 text-sm leading-relaxed text-ink print:text-xs">
            <p>
              Mit Unterzeichnung dieses Vertrags gehen Besitz und Gefahr auf den
              Käufer über. Die Übergabe folgender Unterlagen und Gegenstände
              wird bestätigt:
            </p>
            <ul className="ml-4 list-inside space-y-1">
              <li>☐ Fahrzeugbrief (Zulassungsbescheinigung Teil II)</li>
              <li>☐ Fahrzeugschein (Zulassungsbescheinigung Teil I)</li>
              <li>☐ Serviceheft / Scheckheft</li>
              <li>☐ Bedienungsanleitung</li>
              <li>☐ Schlüssel (Anzahl: ____)</li>
              <li>☐ HU-/AU-Bericht</li>
              <li>☐ Sonstiges: ________________________________</li>
            </ul>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-4 border-b border-accent/30 pb-2 text-sm font-semibold uppercase tracking-wider text-accent print:text-xs">
            7. Unterschriften
          </h2>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <Feld label="Ort, Datum" breit />
              <div className="mt-12 border-b border-ink print:mt-16" />
              <p className="mt-1 text-xs text-ink-muted">Unterschrift Verkäufer</p>
            </div>
            <div>
              <Feld label="Ort, Datum" breit />
              <div className="mt-12 border-b border-ink print:mt-16" />
              <p className="mt-1 text-xs text-ink-muted">Unterschrift Käufer</p>
            </div>
          </div>
        </section>

        <div className="mt-8 border-t border-line pt-4 text-center">
          <p className="text-[10px] text-ink-subtle">
            Vorlage erstellt mit CARONEX — keine Rechtsberatung, keine Gewähr
            für Vollständigkeit oder Richtigkeit.
          </p>
        </div>
      </div>
    </>
  );
}
