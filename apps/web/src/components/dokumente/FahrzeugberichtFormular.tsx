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

export function FahrzeugberichtFormular() {
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
            Fahrzeugbericht
          </h1>
          <p className="mt-1 text-xs text-ink-muted print:text-[10px]">
            Vorlage von CARONEX — erhebt keinen Anspruch auf Vollständigkeit
          </p>
        </div>

        <Abschnitt titel="1. Fahrzeugidentifikation">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <Feld label="Hersteller" />
            <Feld label="Modell" />
            <Feld label="Generation / Baureihe" />
            <Feld label="Baureihenkürzel (z. B. F30, W205)" />
            <Feld label="Karosserieform" />
            <Feld label="Bauzeitraum" />
            <Feld label="Facelift-Phase (Vorfacelift / LCI / Mopf)" />
            <Feld label="Modelljahr" />
          </div>
        </Abschnitt>

        <Abschnitt titel="2. Motor und Antrieb">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <Feld label="Motorbezeichnung (Handelsname)" />
            <Feld label="Motorcode" />
            <Feld label="Motorfamilie (z. B. EA888, N47)" />
            <Feld label="Kraftstoff" />
            <Feld label="Hubraum (ccm)" />
            <Feld label="Zylinder / Anordnung" />
            <Feld label="Aufladung (Turbo, Kompressor, Sauger)" />
            <Feld label="Einspritzsystem" />
            <Feld label="Leistung (kW / PS)" />
            <Feld label="Drehmoment (Nm)" />
            <Feld label="Getriebe" />
            <Feld label="Antriebsart (Front / Heck / Allrad)" />
            <Feld label="Abgasnorm" />
            <Feld label="Ventiltrieb / Steuerzeiten" />
          </div>
        </Abschnitt>

        <Abschnitt titel="3. Fahrleistungen und Verbrauch">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <Feld label="0–100 km/h (s)" />
            <Feld label="Höchstgeschwindigkeit (km/h)" />
            <Feld label="Verbrauch kombiniert (l/100 km oder kWh)" />
            <Feld label="CO₂-Emission (g/km)" />
            <Feld label="Tankinhalt (l) / Batteriekapazität (kWh)" />
            <Feld label="Leergewicht (kg)" />
          </div>
        </Abschnitt>

        <Abschnitt titel="4. Ausstattungslinien">
          <p className="mb-3 text-sm text-ink-muted print:text-xs">
            Welche Ausstattungslinien waren für diese Generation verfügbar?
          </p>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="grid grid-cols-[1fr_2fr] gap-4">
                <div>
                  <label className="block text-xs font-medium text-ink-muted print:text-[10px]">
                    Linie {n}
                  </label>
                  <div className="mt-1 border-b border-ink-subtle/30 pb-4 print:pb-6" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-muted print:text-[10px]">
                    Besonderheiten
                  </label>
                  <div className="mt-1 border-b border-ink-subtle/30 pb-4 print:pb-6" />
                </div>
              </div>
            ))}
          </div>
        </Abschnitt>

        <Abschnitt titel="5. Bekannte Schwachstellen">
          <p className="mb-3 text-sm text-ink-muted print:text-xs">
            Häufig gemeldete Probleme dieser Generation — Bauteil, Symptom, typische
            Laufleistung, Abhilfe.
          </p>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="rounded border border-ink-subtle/20 p-3 print:border-ink-subtle/30">
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  <Feld label={`Schwachstelle ${n} — Bauteil / Baugruppe`} />
                  <Feld label="Schweregrad (gering / mittel / hoch / kritisch)" />
                  <Feld label="Symptome" breit />
                  <Feld label="Typische Laufleistung (km)" />
                  <Feld label="Betroffene Baujahre" />
                  <Feld label="Abhilfe / Reparaturmaßnahme" breit />
                </div>
              </div>
            ))}
          </div>
        </Abschnitt>

        <Abschnitt titel="6. Wartung und Intervalle">
          <p className="mb-3 text-sm text-ink-muted print:text-xs">
            Wichtige Wartungspunkte und deren Intervalle für diesen Motor/Antrieb.
          </p>
          <table className="w-full text-sm print:text-xs">
            <thead>
              <tr className="border-b border-ink-subtle/30 text-left">
                <th className="pb-2 pr-4 text-xs font-medium text-ink-muted">Maßnahme</th>
                <th className="pb-2 pr-4 text-xs font-medium text-ink-muted">Intervall (km)</th>
                <th className="pb-2 text-xs font-medium text-ink-muted">Intervall (Monate)</th>
              </tr>
            </thead>
            <tbody>
              {[
                'Motoröl wechseln',
                'Ölfilter wechseln',
                'Luftfilter wechseln',
                'Bremsflüssigkeit wechseln',
                'Zahnriemen / Steuerkette prüfen',
                'Kühlmittel wechseln',
                'Zündkerzen wechseln',
                'Getriebeöl wechseln',
              ].map((aufgabe) => (
                <tr key={aufgabe} className="border-b border-ink-subtle/20">
                  <td className="py-2 pr-4">{aufgabe}</td>
                  <td className="py-2 pr-4">
                    <div className="border-b border-ink-subtle/30 pb-3 print:pb-5" />
                  </td>
                  <td className="py-2">
                    <div className="border-b border-ink-subtle/30 pb-3 print:pb-5" />
                  </td>
                </tr>
              ))}
              <tr className="border-b border-ink-subtle/20">
                <td className="py-2 pr-4">
                  <div className="border-b border-ink-subtle/30 pb-3 print:pb-5" />
                </td>
                <td className="py-2 pr-4">
                  <div className="border-b border-ink-subtle/30 pb-3 print:pb-5" />
                </td>
                <td className="py-2">
                  <div className="border-b border-ink-subtle/30 pb-3 print:pb-5" />
                </td>
              </tr>
            </tbody>
          </table>
        </Abschnitt>

        <Abschnitt titel="7. Kosten und Unterhalt">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <Feld label="Kfz-Steuer (€/Jahr)" />
            <Feld label="Versicherung Haftpflicht (Typklasse)" />
            <Feld label="Versicherung Teilkasko (Typklasse)" />
            <Feld label="Versicherung Vollkasko (Typklasse)" />
            <Feld label="Inspektion, kleine (ca. €)" />
            <Feld label="Inspektion, große (ca. €)" />
            <Feld label="Häufige Verschleißteile und Kosten" breit />
          </div>
          <div className="mt-4">
            <p className="text-xs font-medium text-ink-muted">Anmerkungen:</p>
            <div className="mt-2 border-b border-ink-subtle/30 pb-8 print:pb-12" />
          </div>
        </Abschnitt>

        <Abschnitt titel="8. Markteinschätzung">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <Feld label="Preisspanne gebraucht (€ von – bis)" />
            <Feld label="Typische Laufleistung im Angebot (km)" />
            <Feld label="Marktangebot (viel / mittel / wenig)" />
            <Feld label="Wertentwicklung (stabil / fallend / steigend)" />
          </div>
          <div className="mt-4">
            <p className="text-xs font-medium text-ink-muted">Einschätzung / Empfehlung:</p>
            <div className="mt-2 border-b border-ink-subtle/30 pb-8 print:pb-12" />
            <div className="mt-4 border-b border-ink-subtle/30 pb-8 print:pb-12" />
          </div>
        </Abschnitt>

        <Abschnitt titel="9. Prüfpunkte vor dem Kauf">
          <ul className="space-y-2">
            <Pruefpunkt text="Motorcode und Leistungsstufe mit Fahrzeugschein abgleichen" />
            <Pruefpunkt text="Baujahr und Facelift-Phase bestimmen (Scheinwerfer, Rückleuchten, Cockpit)" />
            <Pruefpunkt text="Bekannte Schwachstellen gezielt an diesem Fahrzeug prüfen" />
            <Pruefpunkt text="Wartungshistorie auf fällige Großwartungen prüfen (Zahnriemen, DSG-Ölwechsel)" />
            <Pruefpunkt text="Rückrufe beim KBA oder Hersteller abfragen (VIN)" />
            <Pruefpunkt text="Scheckheft auf lückenlose Dokumentation prüfen" />
            <Pruefpunkt text="OBD-Diagnose: Fehlerspeicher auslesen" />
            <Pruefpunkt text="Probefahrt mit Fokus auf bekannte Schwachstellen" />
          </ul>
        </Abschnitt>

        <section className="mt-8">
          <h2 className="mb-3 border-b border-accent/30 pb-2 text-sm font-semibold uppercase tracking-wider text-accent print:text-xs">
            Notizen
          </h2>
          <div className="space-y-6">
            <div className="border-b border-ink-subtle/30 pb-8 print:pb-12" />
            <div className="border-b border-ink-subtle/30 pb-8 print:pb-12" />
            <div className="border-b border-ink-subtle/30 pb-8 print:pb-12" />
          </div>
        </section>

        <div className="mt-8 border-t border-line pt-4 text-center">
          <p className="text-[10px] text-ink-subtle">
            Vorlage erstellt mit CARONEX — keine Gewähr für Vollständigkeit.
            Technische Daten vor dem Kauf immer anhand der Fahrzeugpapiere verifizieren.
          </p>
        </div>
      </div>
    </>
  );
}
