'use client';

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

const DEMO_DATEN = {
  vkVorname: 'Max', vkNachname: 'Mustermann',
  vkStrasse: 'Musterstrasse 1', vkPlz: '12345', vkOrt: 'Musterstadt',
  kVorname: 'Erika', kNachname: 'Musterfrau',
  kStrasse: 'Beispielweg 42', kPlz: '54321', kOrt: 'Beispielstadt',
  herstellerModell: 'BMW 320i (F30)', vin: 'WBADEMO12345678901',
  kennzeichen: 'M-XX 1234', farbe: 'Mineralgrau Metallic',
  datum: '15.09.2026', uhrzeit: '14:00',
  ort: 'Musterstrasse 1, 12345 Musterstadt',
  km: '87.650', tank: '75',
  schaedenAussen: 'Leichte Steinschlaege an der Frontschueppe (ca. 3 Stueck). Kleiner Parkrempler am hinteren Stossfaenger rechts (ca. 2 cm Lackkratzer).',
  schaedenInnen: 'Leichter Verschleiss am Fahrersitz (Seitenpolster). Sonst einwandfreier Zustand.',
  schluessel: '2',
  zubehoer: '1 Satz Winterraeder auf Stahlfelgen, Ladekabel fuer Smartphone',
  vereinbarungen: 'Verkaeufer stellt aktuellen HU-Bericht bereit. Kein Rueckgaberecht vereinbart.',
  ortDatum: 'Musterstadt, 15.09.2026',
};

export function UebergabeprotokollFormular({ istDemo }: { istDemo?: boolean }) {
  const d = istDemo ? DEMO_DATEN : undefined;

  return (
    <>
      <div className="mb-6 print:hidden">
        <Button variant="primary" size="md" onClick={() => window.print()}>
          Drucken / Als PDF speichern
        </Button>
      </div>

      {istDemo && <DemoBanner />}

      <div className="rounded-lg border border-line bg-white p-8 text-ink print:border-none print:p-0 dark:bg-surface-1 print:dark:bg-white print:dark:text-black">
        <div className="mb-8 text-center">
          {istDemo && (
            <p className="mb-2 text-lg font-black uppercase tracking-[0.3em] text-caution/40 print:text-caution/60">
              DEMO
            </p>
          )}
          <h1 className="text-xl font-bold print:text-lg">
            Uebergabeprotokoll Kraftfahrzeug
          </h1>
          <p className="mt-1 text-xs text-ink-muted print:text-[10px]">
            Vorlage von CARONEX — keine Rechtsberatung
          </p>
          <p className="mt-1 text-[10px] text-ink-subtle print:text-[8px]">
            CARONEX ist nicht Vertragspartei. Diese Vorlage ist eine
            Arbeitshilfe und keine Rechtsberatung.
          </p>
        </div>

        <Abschnitt titel="Verkaeufer">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <FeldInput label="Vorname" vorgabe={d?.vkVorname} />
            <FeldInput label="Nachname" vorgabe={d?.vkNachname} />
            <FeldInput label="Strasse, Hausnummer" breit vorgabe={d?.vkStrasse} />
            <FeldInput label="PLZ" vorgabe={d?.vkPlz} />
            <FeldInput label="Ort" vorgabe={d?.vkOrt} />
          </div>
        </Abschnitt>

        <Abschnitt titel="Kaeufer">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <FeldInput label="Vorname" vorgabe={d?.kVorname} />
            <FeldInput label="Nachname" vorgabe={d?.kNachname} />
            <FeldInput label="Strasse, Hausnummer" breit vorgabe={d?.kStrasse} />
            <FeldInput label="PLZ" vorgabe={d?.kPlz} />
            <FeldInput label="Ort" vorgabe={d?.kOrt} />
          </div>
        </Abschnitt>

        <Abschnitt titel="Fahrzeugdaten">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <FeldInput label="Hersteller / Modell" breit vorgabe={d?.herstellerModell} />
            <FeldInput label="Fahrzeug-Identifizierungsnummer (FIN/VIN)" breit vorgabe={d?.vin} />
            <FeldInput label="Amtliches Kennzeichen" vorgabe={d?.kennzeichen} />
            <FeldInput label="Farbe" vorgabe={d?.farbe} />
          </div>
        </Abschnitt>

        <Abschnitt titel="Uebergabe">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <FeldInput label="Datum der Uebergabe" vorgabe={d?.datum} />
            <FeldInput label="Uhrzeit" vorgabe={d?.uhrzeit} />
            <FeldInput label="Ort der Uebergabe" breit vorgabe={d?.ort} />
            <FeldInput label="Kilometerstand bei Uebergabe" vorgabe={d?.km} />
            <FeldInput label="Tankfuellung (ca. %)" vorgabe={d?.tank} />
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
            <FeldInput label="Sichtbare Schaeden aussen (Beschreibung)" mehrzeilig breit vorgabe={d?.schaedenAussen} />
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
            <FeldInput label="Sichtbare Schaeden innen (Beschreibung)" mehrzeilig breit vorgabe={d?.schaedenInnen} />
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
            <FeldInput label="Anzahl uebergebener Schluessel" vorgabe={d?.schluessel} />
            <FeldInput label="Sonstiges Zubehoer" breit vorgabe={d?.zubehoer} />
          </div>
        </Abschnitt>

        <Abschnitt titel="Weitere Vereinbarungen">
          <FeldInput label="Vereinbarungen zwischen Kaeufer und Verkaeufer" mehrzeilig breit vorgabe={d?.vereinbarungen} />
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
              <FeldInput label="Ort, Datum" breit vorgabe={d?.ortDatum} />
              <div className="mt-12 border-b border-ink print:mt-16" />
              <p className="mt-1 text-xs text-ink-muted">Verkaeufer</p>
            </div>
            <div>
              <FeldInput label="Ort, Datum" breit vorgabe={d?.ortDatum} />
              <div className="mt-12 border-b border-ink print:mt-16" />
              <p className="mt-1 text-xs text-ink-muted">Kaeufer</p>
            </div>
          </div>
        </section>

        <div className="mt-8 border-t border-line pt-4 text-center">
          <p className="text-[10px] text-ink-subtle">
            {istDemo && (
              <span className="font-bold text-caution">
                DEMO — Beispieldokument mit fiktiven Daten.{' '}
              </span>
            )}
            Vorlage erstellt mit CARONEX — keine Rechtsberatung, keine Gewaehr.
            CARONEX ist nicht Vertragspartei.
          </p>
        </div>
      </div>
    </>
  );
}
