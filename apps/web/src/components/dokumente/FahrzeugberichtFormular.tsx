'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/Button';

function DemoBanner() {
  return (
    <div className="mb-6 rounded-lg border-2 border-dashed border-caution bg-caution/10 px-4 py-3 text-center print:mb-4 print:border-caution/50">
      <p className="text-sm font-bold uppercase tracking-widest text-caution">
        DEMO — Beispieldokument mit fiktiven Daten
      </p>
      <p className="mt-1 text-xs text-caution/80">
        Keine echten Personen- oder Fahrzeugdaten. Nicht fuer den
        Rechtsverkehr bestimmt.
      </p>
    </div>
  );
}

function FeldInput({
  label,
  breit,
  mehrzeilig,
  vorgabe,
}: {
  label: string;
  breit?: boolean;
  mehrzeilig?: boolean;
  vorgabe?: string;
}) {
  return (
    <div className={breit ? 'col-span-2' : ''}>
      <label className="block text-xs font-medium text-ink-muted print:text-[10px]">
        {label}
      </label>
      {mehrzeilig ? (
        <textarea
          defaultValue={vorgabe}
          className="mt-1 w-full resize-none border-b border-ink-subtle/30 bg-transparent pb-2 text-sm text-ink outline-none focus:border-accent print:pb-1 print:text-xs"
          rows={3}
        />
      ) : (
        <input
          type="text"
          defaultValue={vorgabe}
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

function TabelleInput({ vorgabe }: { vorgabe?: string }) {
  return (
    <input
      type="text"
      defaultValue={vorgabe}
      className="w-full border-b border-ink-subtle/30 bg-transparent pb-1 text-sm outline-none focus:border-accent print:border-none print:text-xs"
    />
  );
}

const DEMO_DATEN = {
  hersteller: 'BMW', modell: '320i', generation: '3er (F30)',
  baureihenkuerzel: 'F30', karosserie: 'Limousine',
  bauzeitraum: '2011 – 2019', facelift: 'LCI (ab 2015)',
  modelljahr: '2019',
  motorHandelsname: '320i', motorcode: 'B48B20',
  motorfamilie: 'B48', kraftstoff: 'Benzin',
  hubraum: '1.998', zylinder: '4 / Reihe',
  aufladung: 'Turbo (Twin-Scroll)', einspritzung: 'Direkteinspritzung',
  leistung: '135 kW / 184 PS', drehmoment: '270 Nm bei 1.350 U/min',
  getriebe: '8-Gang Automatik (ZF 8HP)', antrieb: 'Hinterradantrieb',
  abgasnorm: 'Euro 6d-TEMP', ventiltrieb: 'DOHC, Valvetronic + Doppel-VANOS',
  beschleunigung: '7,1', hoechstgeschwindigkeit: '235',
  verbrauch: '5,7', co2: '130',
  tankinhalt: '60', leergewicht: '1.465',
  km: '87.500', erstzulassung: '03/2019', vorbesitzer: '1',
  letzteHu: '03/2025', scheckheft: 'Ja, lueckenlos',
  unfallhistorie: 'Unfallfrei laut Verkaeufer',
  maengel: 'Keine bekannt',
  reparaturen: 'Bremsbelaege vorne erneuert bei 72.000 km (12/2024)',
  zustandText: 'Lack gut, leichte Steinschlaege an der Front. Innenraum gepflegt, leichter Verschleiss am Fahrersitz. Technik ohne Auffaelligkeiten.',
  sonstiges: 'Nichtraucher-Fahrzeug. Immer in Garage gestanden.',
  steuer: '142', typklasseHp: '15', typklasseTk: '19', typklasseVk: '21',
  inspektionKlein: '250 – 350', inspektionGross: '450 – 600',
  verschleiss: 'Bremsbelaege vorne ca. 180 Euro, hinten ca. 150 Euro. Oelwechsel ca. 120 Euro.',
  preisSpanne: '18.000 – 28.000',
  laufleistungAngebot: '60.000 – 120.000',
  marktangebot: 'Viel',
  wertentwicklung: 'Leicht fallend',
  empfehlung: 'Solides Alltagsfahrzeug mit gutem Motor. Der B48 ist ausgereift und zuverlaessig. Bei regelmaessiger Wartung wenig Probleme zu erwarten. Preis im mittleren Marktsegment.',
  fazit: 'Guter Gesamteindruck. Motor und Getriebe ueberzeugen, Wartungskosten moderat. Steinschlag pruefen lassen. Kaufempfehlung bei Preisverhandlung.',
  schwachstelle1Bauteil: 'Steuerkette (N20-Motor, nicht B48)',
  schwachstelle1Schwere: 'Hoch (nur N20)',
  schwachstelle1Symptome: 'Rasseln beim Kaltstart, Motorkontrollleuchte. Betrifft Vorgaengermotor N20, nicht den B48.',
  schwachstelle1Km: 'Ab 80.000 km (N20)',
  schwachstelle1Baujahre: '2011 – 2015 (N20)',
  schwachstelle1Abhilfe: 'Steuerkette und Spanner erneuern. Beim B48 (ab 2015/16) kein bekanntes Problem.',
  schwachstelle2Bauteil: 'Kuehlsystem (Thermostat, Wasserpumpe)',
  schwachstelle2Schwere: 'Mittel',
  schwachstelle2Symptome: 'Schwankende Temperaturanzeige, Kuehlmittelverlust, Warnmeldung im Display',
  schwachstelle2Km: 'Ab 60.000 km',
  schwachstelle2Baujahre: '2012 – 2019',
  schwachstelle2Abhilfe: 'Thermostat und/oder Wasserpumpe tauschen (ca. 300 – 500 Euro)',
  wartungOelKm: '15.000', wartungOelMonate: '24',
  wartungOelfilterKm: '15.000', wartungOelfilterMonate: '24',
  wartungLuftfilterKm: '40.000', wartungLuftfilterMonate: '48',
  wartungBremsfluessigkeitKm: '-', wartungBremsfluessigkeitMonate: '24',
  wartungSteuerketteKm: 'Wartungsfrei (B48)', wartungSteuerketteMonate: '-',
  wartungKuehlmittelKm: '60.000', wartungKuehlmittelMonate: '48',
  wartungZuendkerzenKm: '60.000', wartungZuendkerzenMonate: '48',
  wartungGetriebeKm: '100.000', wartungGetriebeMonate: '-',
};

const DEMO_BEWERTUNGEN = {
  gesamteindruck: 4,
  zustand: 4,
  preisLeistung: 3,
  alltagstauglichkeit: 5,
};

export function FahrzeugberichtFormular({ istDemo }: { istDemo?: boolean }) {
  const d = istDemo ? DEMO_DATEN : undefined;

  const [bewertungen, setBewertungen] = useState(
    istDemo ? DEMO_BEWERTUNGEN : { gesamteindruck: 0, zustand: 0, preisLeistung: 0, alltagstauglichkeit: 0 },
  );

  const wartungsDaten = [
    { aufgabe: 'Motoroel wechseln', km: d?.wartungOelKm, monate: d?.wartungOelMonate },
    { aufgabe: 'Oelfilter wechseln', km: d?.wartungOelfilterKm, monate: d?.wartungOelfilterMonate },
    { aufgabe: 'Luftfilter wechseln', km: d?.wartungLuftfilterKm, monate: d?.wartungLuftfilterMonate },
    { aufgabe: 'Bremsfluessigkeit wechseln', km: d?.wartungBremsfluessigkeitKm, monate: d?.wartungBremsfluessigkeitMonate },
    { aufgabe: 'Zahnriemen / Steuerkette pruefen', km: d?.wartungSteuerketteKm, monate: d?.wartungSteuerketteMonate },
    { aufgabe: 'Kuehlmittel wechseln', km: d?.wartungKuehlmittelKm, monate: d?.wartungKuehlmittelMonate },
    { aufgabe: 'Zuendkerzen wechseln', km: d?.wartungZuendkerzenKm, monate: d?.wartungZuendkerzenMonate },
    { aufgabe: 'Getriebeoel wechseln', km: d?.wartungGetriebeKm, monate: d?.wartungGetriebeMonate },
  ];

  return (
    <>
      <div className="mb-6 print:hidden">
        <Button variant="primary" size="md" onClick={() => window.print()}>
          Drucken / Als PDF speichern
        </Button>
      </div>

      {istDemo && <DemoBanner />}

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
          {istDemo && (
            <p className="mb-2 text-lg font-black uppercase tracking-[0.3em] text-caution/40 print:text-caution/60">
              DEMO
            </p>
          )}
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
            <FeldInput label="Hersteller" vorgabe={d?.hersteller} />
            <FeldInput label="Modell" vorgabe={d?.modell} />
            <FeldInput label="Generation / Baureihe" vorgabe={d?.generation} />
            <FeldInput label="Baureihenkuerzel (z. B. F30, W205)" vorgabe={d?.baureihenkuerzel} />
            <FeldInput label="Karosserieform" vorgabe={d?.karosserie} />
            <FeldInput label="Bauzeitraum" vorgabe={d?.bauzeitraum} />
            <FeldInput label="Facelift-Phase (Vorfacelift / LCI / Mopf)" vorgabe={d?.facelift} />
            <FeldInput label="Modelljahr" vorgabe={d?.modelljahr} />
          </div>
        </DatenquelleAbschnitt>

        <DatenquelleAbschnitt
          titel="2. Motor und Antrieb"
          quelle="caronex"
          quelleLabel="CARONEX-Daten"
        >
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <FeldInput label="Motorbezeichnung (Handelsname)" vorgabe={d?.motorHandelsname} />
            <FeldInput label="Motorcode" vorgabe={d?.motorcode} />
            <FeldInput label="Motorfamilie (z. B. EA888, N47)" vorgabe={d?.motorfamilie} />
            <FeldInput label="Kraftstoff" vorgabe={d?.kraftstoff} />
            <FeldInput label="Hubraum (ccm)" vorgabe={d?.hubraum} />
            <FeldInput label="Zylinder / Anordnung" vorgabe={d?.zylinder} />
            <FeldInput label="Aufladung (Turbo, Kompressor, Sauger)" vorgabe={d?.aufladung} />
            <FeldInput label="Einspritzsystem" vorgabe={d?.einspritzung} />
            <FeldInput label="Leistung (kW / PS)" vorgabe={d?.leistung} />
            <FeldInput label="Drehmoment (Nm)" vorgabe={d?.drehmoment} />
            <FeldInput label="Getriebe" vorgabe={d?.getriebe} />
            <FeldInput label="Antriebsart (Front / Heck / Allrad)" vorgabe={d?.antrieb} />
            <FeldInput label="Abgasnorm" vorgabe={d?.abgasnorm} />
            <FeldInput label="Ventiltrieb / Steuerzeiten" vorgabe={d?.ventiltrieb} />
          </div>
        </DatenquelleAbschnitt>

        <DatenquelleAbschnitt
          titel="3. Fahrleistungen und Verbrauch"
          quelle="caronex"
          quelleLabel="CARONEX-Daten"
        >
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <FeldInput label="0–100 km/h (s)" vorgabe={d?.beschleunigung} />
            <FeldInput label="Hoechstgeschwindigkeit (km/h)" vorgabe={d?.hoechstgeschwindigkeit} />
            <FeldInput label="Verbrauch kombiniert (l/100 km oder kWh)" vorgabe={d?.verbrauch} />
            <FeldInput label="CO2-Emission (g/km)" vorgabe={d?.co2} />
            <FeldInput label="Tankinhalt (l) / Batteriekapazitaet (kWh)" vorgabe={d?.tankinhalt} />
            <FeldInput label="Leergewicht (kg)" vorgabe={d?.leergewicht} />
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
            <div className="rounded border border-ink-subtle/20 p-3 print:border-ink-subtle/30">
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                <FeldInput label="Schwachstelle 1 — Bauteil / Baugruppe" vorgabe={d?.schwachstelle1Bauteil} />
                <FeldInput label="Schweregrad (gering / mittel / hoch / kritisch)" vorgabe={d?.schwachstelle1Schwere} />
                <FeldInput label="Symptome" breit vorgabe={d?.schwachstelle1Symptome} />
                <FeldInput label="Typische Laufleistung (km)" vorgabe={d?.schwachstelle1Km} />
                <FeldInput label="Betroffene Baujahre" vorgabe={d?.schwachstelle1Baujahre} />
                <FeldInput label="Abhilfe / Reparaturmassnahme" breit vorgabe={d?.schwachstelle1Abhilfe} />
              </div>
            </div>
            <div className="rounded border border-ink-subtle/20 p-3 print:border-ink-subtle/30">
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                <FeldInput label="Schwachstelle 2 — Bauteil / Baugruppe" vorgabe={d?.schwachstelle2Bauteil} />
                <FeldInput label="Schweregrad (gering / mittel / hoch / kritisch)" vorgabe={d?.schwachstelle2Schwere} />
                <FeldInput label="Symptome" breit vorgabe={d?.schwachstelle2Symptome} />
                <FeldInput label="Typische Laufleistung (km)" vorgabe={d?.schwachstelle2Km} />
                <FeldInput label="Betroffene Baujahre" vorgabe={d?.schwachstelle2Baujahre} />
                <FeldInput label="Abhilfe / Reparaturmassnahme" breit vorgabe={d?.schwachstelle2Abhilfe} />
              </div>
            </div>
            {[3, 4, 5].map((n) => (
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
                {wartungsDaten.map((w) => (
                  <tr key={w.aufgabe} className="border-b border-ink-subtle/20">
                    <td className="py-2 pr-4">{w.aufgabe}</td>
                    <td className="py-2 pr-4">
                      <TabelleInput vorgabe={w.km} />
                    </td>
                    <td className="py-2">
                      <TabelleInput vorgabe={w.monate} />
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
            <FeldInput label="Kilometerstand" vorgabe={d?.km} />
            <FeldInput label="Erstzulassung" vorgabe={d?.erstzulassung} />
            <FeldInput label="Anzahl Vorbesitzer" vorgabe={d?.vorbesitzer} />
            <FeldInput label="Letzte HU (Datum)" vorgabe={d?.letzteHu} />
            <FeldInput label="Scheckheft gepflegt (ja / nein / teilweise)" vorgabe={d?.scheckheft} />
            <FeldInput label="Unfallhistorie" vorgabe={d?.unfallhistorie} />
            <FeldInput label="Bekannte Maengel" mehrzeilig breit vorgabe={d?.maengel} />
            <FeldInput label="Durchgefuehrte Reparaturen" mehrzeilig breit vorgabe={d?.reparaturen} />
            <FeldInput label="Zustand (Lack, Innenraum, Technik)" mehrzeilig breit vorgabe={d?.zustandText} />
            <FeldInput label="Sonstige Angaben" mehrzeilig breit vorgabe={d?.sonstiges} />
          </div>
        </DatenquelleAbschnitt>

        <DatenquelleAbschnitt
          titel="7. Kosten und Unterhalt"
          quelle="caronex"
          quelleLabel="CARONEX-Daten"
        >
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <FeldInput label="Kfz-Steuer (Euro/Jahr)" vorgabe={d?.steuer} />
            <FeldInput label="Versicherung Haftpflicht (Typklasse)" vorgabe={d?.typklasseHp} />
            <FeldInput label="Versicherung Teilkasko (Typklasse)" vorgabe={d?.typklasseTk} />
            <FeldInput label="Versicherung Vollkasko (Typklasse)" vorgabe={d?.typklasseVk} />
            <FeldInput label="Inspektion, kleine (ca. Euro)" vorgabe={d?.inspektionKlein} />
            <FeldInput label="Inspektion, grosse (ca. Euro)" vorgabe={d?.inspektionGross} />
            <FeldInput label="Haeufige Verschleissteile und Kosten" breit vorgabe={d?.verschleiss} />
          </div>
        </DatenquelleAbschnitt>

        <DatenquelleAbschnitt
          titel="8. Markteinschaetzung"
          quelle="nutzer"
          quelleLabel="Nutzerangaben"
        >
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <FeldInput label="Preisspanne gebraucht (Euro von – bis)" vorgabe={d?.preisSpanne} />
            <FeldInput label="Typische Laufleistung im Angebot (km)" vorgabe={d?.laufleistungAngebot} />
            <FeldInput label="Marktangebot (viel / mittel / wenig)" vorgabe={d?.marktangebot} />
            <FeldInput label="Wertentwicklung (stabil / fallend / steigend)" vorgabe={d?.wertentwicklung} />
          </div>
          <div className="mt-4">
            <FeldInput label="Einschaetzung / Empfehlung" mehrzeilig breit vorgabe={d?.empfehlung} />
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
            <FeldInput label="Fazit / Empfehlung" mehrzeilig breit vorgabe={d?.fazit} />
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
            defaultValue={istDemo ? 'BMW 320i F30 LCI mit B48-Motor: zuverlaessige Wahl. Vorgaengermotor N20 hatte Steuerkettenprobleme — beim B48 behoben. Kuehlsystem als einzige nennenswerte Schwachstelle beobachten.' : undefined}
            placeholder="Eigene Notizen zum Fahrzeug..."
          />
        </section>

        <div className="mt-8 border-t border-line pt-4 text-center">
          <p className="text-[10px] text-ink-subtle">
            {istDemo && (
              <span className="font-bold text-caution">
                DEMO — Beispieldokument mit fiktiven Daten.{' '}
              </span>
            )}
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
