'use client';

import { useState } from 'react';

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

function DatenquelleAbschnitt({
  titel,
  quelle,
  quelleLabel,
  children,
}: {
  titel: string;
  quelle: 'caronex' | 'nutzer' | 'bewertung';
  quelleLabel: string;
  children: React.ReactNode;
}) {
  const quelleKlassen: Record<string, string> = {
    caronex: 'border-accent/30 bg-accent/5 text-accent',
    nutzer: 'border-positive/30 bg-positive/5 text-positive',
    bewertung: 'border-caution/30 bg-caution/5 text-caution',
  };

  return (
    <section className="mt-8 first:mt-0">
      <div className="mb-4 flex items-center justify-between border-b border-accent/30 pb-2">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-accent print:text-xs">
          {titel}
        </h2>
        <span
          className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${quelleKlassen[quelle]}`}
        >
          {quelleLabel}
        </span>
      </div>
      {children}
    </section>
  );
}

function SterneBewertung({
  label,
  wert,
  onAendern,
}: {
  label: string;
  wert: number;
  onAendern: (wert: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm print:text-xs">
      <span className="text-ink">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((stern) => (
          <button
            key={stern}
            type="button"
            onClick={() => onAendern(stern === wert ? 0 : stern)}
            className={`text-lg transition-colors print:pointer-events-none ${
              stern <= wert ? 'text-accent' : 'text-ink-subtle/30'
            }`}
          >
            {stern <= wert ? '★' : '☆'}
          </button>
        ))}
      </div>
    </div>
  );
}

export function FahrzeugberichtFormular() {
  const [bewertungen, setBewertungen] = useState({
    gesamteindruck: 0,
    zustand: 0,
    preisLeistung: 0,
    alltagstauglichkeit: 0,
  });

  return (
    <>
      <div className="mb-6 print:hidden">
        <Button variant="primary" size="md" onClick={() => window.print()}>
          Drucken / Als PDF speichern
        </Button>
      </div>

      <div className="mb-4 flex flex-wrap gap-4 rounded-lg border border-line bg-surface-1 px-4 py-3 text-xs print:hidden">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-accent" />
          CARONEX-Daten — aus strukturierten Quellen
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-positive" />
          Nutzerangaben — vom Nutzer eingegeben
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-caution" />
          Persoenliche Bewertung — subjektive Einschaetzung
        </span>
      </div>

      <div className="rounded-lg border border-line bg-white p-8 text-ink print:border-none print:p-0 dark:bg-surface-1 print:dark:bg-white print:dark:text-black">
        <div className="mb-8 text-center">
          <h1 className="text-xl font-bold print:text-lg">Fahrzeugbericht</h1>
          <p className="mt-1 text-xs text-ink-muted print:text-[10px]">
            Vorlage von CARONEX — erhebt keinen Anspruch auf Vollstaendigkeit
          </p>
        </div>

        <DatenquelleAbschnitt
          titel="1. Fahrzeugidentifikation"
          quelle="caronex"
          quelleLabel="CARONEX-Daten"
        >
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <FeldInput label="Hersteller" />
            <FeldInput label="Modell" />
            <FeldInput label="Generation / Baureihe" />
            <FeldInput label="Baureihenkuerzel (z. B. F30, W205)" />
            <FeldInput label="Karosserieform" />
            <FeldInput label="Bauzeitraum" />
            <FeldInput label="Facelift-Phase (Vorfacelift / LCI / Mopf)" />
            <FeldInput label="Modelljahr" />
          </div>
        </DatenquelleAbschnitt>

        <DatenquelleAbschnitt
          titel="2. Motor und Antrieb"
          quelle="caronex"
          quelleLabel="CARONEX-Daten"
        >
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <FeldInput label="Motorbezeichnung (Handelsname)" />
            <FeldInput label="Motorcode" />
            <FeldInput label="Motorfamilie (z. B. EA888, N47)" />
            <FeldInput label="Kraftstoff" />
            <FeldInput label="Hubraum (ccm)" />
            <FeldInput label="Zylinder / Anordnung" />
            <FeldInput label="Aufladung (Turbo, Kompressor, Sauger)" />
            <FeldInput label="Einspritzsystem" />
            <FeldInput label="Leistung (kW / PS)" />
            <FeldInput label="Drehmoment (Nm)" />
            <FeldInput label="Getriebe" />
            <FeldInput label="Antriebsart (Front / Heck / Allrad)" />
            <FeldInput label="Abgasnorm" />
            <FeldInput label="Ventiltrieb / Steuerzeiten" />
          </div>
        </DatenquelleAbschnitt>

        <DatenquelleAbschnitt
          titel="3. Fahrleistungen und Verbrauch"
          quelle="caronex"
          quelleLabel="CARONEX-Daten"
        >
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <FeldInput label="0–100 km/h (s)" />
            <FeldInput label="Hoechstgeschwindigkeit (km/h)" />
            <FeldInput label="Verbrauch kombiniert (l/100 km oder kWh)" />
            <FeldInput label="CO2-Emission (g/km)" />
            <FeldInput label="Tankinhalt (l) / Batteriekapazitaet (kWh)" />
            <FeldInput label="Leergewicht (kg)" />
          </div>
        </DatenquelleAbschnitt>

        <DatenquelleAbschnitt
          titel="4. Bekannte Schwachstellen"
          quelle="caronex"
          quelleLabel="CARONEX-Daten"
        >
          <p className="mb-3 text-sm text-ink-muted print:text-xs">
            Haeufig gemeldete Probleme dieser Generation — Bauteil, Symptom,
            typische Laufleistung, Abhilfe.
          </p>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                className="rounded border border-ink-subtle/20 p-3 print:border-ink-subtle/30"
              >
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  <FeldInput label={`Schwachstelle ${n} — Bauteil / Baugruppe`} />
                  <FeldInput label="Schweregrad (gering / mittel / hoch / kritisch)" />
                  <FeldInput label="Symptome" breit />
                  <FeldInput label="Typische Laufleistung (km)" />
                  <FeldInput label="Betroffene Baujahre" />
                  <FeldInput label="Abhilfe / Reparaturmassnahme" breit />
                </div>
              </div>
            ))}
          </div>
        </DatenquelleAbschnitt>

        <DatenquelleAbschnitt
          titel="5. Wartung und Intervalle"
          quelle="caronex"
          quelleLabel="CARONEX-Daten"
        >
          <p className="mb-3 text-sm text-ink-muted print:text-xs">
            Wichtige Wartungspunkte und deren Intervalle fuer diesen
            Motor/Antrieb.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm print:text-xs">
              <thead>
                <tr className="border-b border-ink-subtle/30 text-left">
                  <th className="pb-2 pr-4 text-xs font-medium text-ink-muted">
                    Massnahme
                  </th>
                  <th className="pb-2 pr-4 text-xs font-medium text-ink-muted">
                    Intervall (km)
                  </th>
                  <th className="pb-2 text-xs font-medium text-ink-muted">
                    Intervall (Monate)
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  'Motoroel wechseln',
                  'Oelfilter wechseln',
                  'Luftfilter wechseln',
                  'Bremsfluessigkeit wechseln',
                  'Zahnriemen / Steuerkette pruefen',
                  'Kuehlmittel wechseln',
                  'Zuendkerzen wechseln',
                  'Getriebeoel wechseln',
                ].map((aufgabe) => (
                  <tr key={aufgabe} className="border-b border-ink-subtle/20">
                    <td className="py-2 pr-4">{aufgabe}</td>
                    <td className="py-2 pr-4">
                      <input
                        type="text"
                        className="w-full border-b border-ink-subtle/30 bg-transparent pb-1 text-sm outline-none focus:border-accent print:border-none print:text-xs"
                      />
                    </td>
                    <td className="py-2">
                      <input
                        type="text"
                        className="w-full border-b border-ink-subtle/30 bg-transparent pb-1 text-sm outline-none focus:border-accent print:border-none print:text-xs"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DatenquelleAbschnitt>

        <DatenquelleAbschnitt
          titel="6. Angaben zum konkreten Fahrzeug"
          quelle="nutzer"
          quelleLabel="Nutzerangaben"
        >
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <FeldInput label="Kilometerstand" />
            <FeldInput label="Erstzulassung" />
            <FeldInput label="Anzahl Vorbesitzer" />
            <FeldInput label="Letzte HU (Datum)" />
            <FeldInput label="Scheckheft gepflegt (ja / nein / teilweise)" />
            <FeldInput label="Unfallhistorie" />
            <FeldInput label="Bekannte Maengel" mehrzeilig breit />
            <FeldInput label="Durchgefuehrte Reparaturen" mehrzeilig breit />
            <FeldInput label="Zustand (Lack, Innenraum, Technik)" mehrzeilig breit />
            <FeldInput label="Sonstige Angaben" mehrzeilig breit />
          </div>
        </DatenquelleAbschnitt>

        <DatenquelleAbschnitt
          titel="7. Kosten und Unterhalt"
          quelle="caronex"
          quelleLabel="CARONEX-Daten"
        >
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <FeldInput label="Kfz-Steuer (Euro/Jahr)" />
            <FeldInput label="Versicherung Haftpflicht (Typklasse)" />
            <FeldInput label="Versicherung Teilkasko (Typklasse)" />
            <FeldInput label="Versicherung Vollkasko (Typklasse)" />
            <FeldInput label="Inspektion, kleine (ca. Euro)" />
            <FeldInput label="Inspektion, grosse (ca. Euro)" />
            <FeldInput label="Haeufige Verschleissteile und Kosten" breit />
          </div>
        </DatenquelleAbschnitt>

        <DatenquelleAbschnitt
          titel="8. Markteinschaetzung"
          quelle="nutzer"
          quelleLabel="Nutzerangaben"
        >
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <FeldInput label="Preisspanne gebraucht (Euro von – bis)" />
            <FeldInput label="Typische Laufleistung im Angebot (km)" />
            <FeldInput label="Marktangebot (viel / mittel / wenig)" />
            <FeldInput label="Wertentwicklung (stabil / fallend / steigend)" />
          </div>
          <div className="mt-4">
            <FeldInput label="Einschaetzung / Empfehlung" mehrzeilig breit />
          </div>
        </DatenquelleAbschnitt>

        <DatenquelleAbschnitt
          titel="9. Persoenliche Bewertung"
          quelle="bewertung"
          quelleLabel="Persoenliche Bewertung"
        >
          <p className="mb-4 text-xs text-ink-muted print:text-[10px]">
            Persoenliche Einschaetzung des Nutzers — keine professionelle
            Fahrzeugbewertung und kein Sachverstaendigengutachten.
          </p>
          <div className="space-y-3">
            <SterneBewertung
              label="Gesamteindruck"
              wert={bewertungen.gesamteindruck}
              onAendern={(w) =>
                setBewertungen((prev) => ({ ...prev, gesamteindruck: w }))
              }
            />
            <SterneBewertung
              label="Fahrzeugzustand"
              wert={bewertungen.zustand}
              onAendern={(w) =>
                setBewertungen((prev) => ({ ...prev, zustand: w }))
              }
            />
            <SterneBewertung
              label="Preis-Leistung"
              wert={bewertungen.preisLeistung}
              onAendern={(w) =>
                setBewertungen((prev) => ({ ...prev, preisLeistung: w }))
              }
            />
            <SterneBewertung
              label="Alltagstauglichkeit"
              wert={bewertungen.alltagstauglichkeit}
              onAendern={(w) =>
                setBewertungen((prev) => ({
                  ...prev,
                  alltagstauglichkeit: w,
                }))
              }
            />
          </div>
          <div className="mt-4">
            <FeldInput label="Fazit / Empfehlung" mehrzeilig breit />
          </div>
        </DatenquelleAbschnitt>

        <DatenquelleAbschnitt
          titel="10. Pruefpunkte vor dem Kauf"
          quelle="caronex"
          quelleLabel="CARONEX-Daten"
        >
          <ul className="space-y-2">
            <Pruefpunkt text="Motorcode und Leistungsstufe mit Fahrzeugschein abgleichen" />
            <Pruefpunkt text="Baujahr und Facelift-Phase bestimmen (Scheinwerfer, Rueckleuchten, Cockpit)" />
            <Pruefpunkt text="Bekannte Schwachstellen gezielt an diesem Fahrzeug pruefen" />
            <Pruefpunkt text="Wartungshistorie auf faellige Grosswartungen pruefen (Zahnriemen, DSG-Oelwechsel)" />
            <Pruefpunkt text="Rueckrufe beim KBA oder Hersteller abfragen (VIN)" />
            <Pruefpunkt text="Scheckheft auf lueckenlose Dokumentation pruefen" />
            <Pruefpunkt text="OBD-Diagnose: Fehlerspeicher auslesen" />
            <Pruefpunkt text="Probefahrt mit Fokus auf bekannte Schwachstellen" />
          </ul>
        </DatenquelleAbschnitt>

        <section className="mt-8">
          <h2 className="mb-3 border-b border-accent/30 pb-2 text-sm font-semibold uppercase tracking-wider text-accent print:text-xs">
            Notizen
          </h2>
          <textarea
            className="w-full resize-none border-b border-ink-subtle/30 bg-transparent pb-2 text-sm text-ink outline-none focus:border-accent print:pb-1 print:text-xs"
            rows={6}
            placeholder="Eigene Notizen zum Fahrzeug..."
          />
        </section>

        <div className="mt-8 border-t border-line pt-4 text-center">
          <p className="text-[10px] text-ink-subtle">
            Vorlage erstellt mit CARONEX — keine Gewaehr fuer Vollstaendigkeit.
            Technische Daten vor dem Kauf immer anhand der Fahrzeugpapiere
            verifizieren. Bereiche sind nach Datenquelle gekennzeichnet:
            CARONEX-Daten (strukturierte Quellen), Nutzerangaben (eigene
            Eingaben), Persoenliche Bewertung (subjektive Einschaetzung).
          </p>
        </div>
      </div>
    </>
  );
}
