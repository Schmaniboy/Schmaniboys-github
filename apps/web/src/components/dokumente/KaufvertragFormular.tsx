'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/Button';

type Vertragstyp = 'privat' | 'gewerblich';

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

function RechtlicherHinweis({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-2 rounded border border-caution/30 bg-caution/5 px-3 py-2 text-xs leading-relaxed text-caution print:border-caution/50 print:bg-transparent print:text-[9px]">
      <span className="font-semibold">[RECHTLICH PRUEFEN]</span> {children}
    </p>
  );
}

const DEMO_DATEN = {
  vkVorname: 'Max', vkNachname: 'Mustermann',
  vkStrasse: 'Musterstrasse 1', vkPlz: '12345', vkOrt: 'Musterstadt',
  vkTelefon: '0170 1234567', vkEmail: 'max@beispiel.de', vkAusweis: 'T220001293',
  kVorname: 'Erika', kNachname: 'Musterfrau',
  kStrasse: 'Beispielweg 42', kPlz: '54321', kOrt: 'Beispielstadt',
  kTelefon: '0171 7654321', kEmail: 'erika@beispiel.de', kAusweis: 'T220004871',
  hersteller: 'BMW', modell: '320i', vin: 'WBADEMO12345678901',
  erstzulassung: '03/2019', km: '87.500', farbe: 'Mineralgrau Metallic',
  motor: 'B48B20', leistung: '135 kW / 184 PS', hubraum: '1.998',
  kraftstoff: 'Benzin', getriebe: '8-Gang Automatik (ZF 8HP)',
  antrieb: 'Hinterradantrieb', kennzeichen: 'M-XX 1234',
  naechsteHu: '09/2026', schluessel: '2', vorbesitzer: '1',
  unfallstatus: 'Unfallfrei',
  schaeden: 'Leichte Steinschlaege an der Frontschueppe (ca. 3 Stueck)',
  maengel: 'Keine bekannt',
  wartungen: 'Inspektionen laut Scheckheft beim BMW-Haendler, zuletzt 07/2025 bei 82.000 km',
  preisZahl: '24.900', preisWorte: 'Vierundzwanzigtausendneunhundert',
  zahlungsart: 'Ueberweisung', zahlungsstatus: 'Bei Uebergabe faellig',
  uebergabeDatum: '15.09.2026', uebergabeUhrzeit: '14:00',
  uebergabeOrt: 'Musterstrasse 1, 12345 Musterstadt',
  uebergabeKm: '87.650', uebergabeSchluessel: '2',
};

export function KaufvertragFormular({ istDemo }: { istDemo?: boolean }) {
  const [vertragstyp, setVertragstyp] = useState<Vertragstyp>('privat');
  const d = istDemo ? DEMO_DATEN : undefined;

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center gap-3 print:hidden">
        <Button variant="primary" size="md" onClick={() => window.print()}>
          Drucken / Als PDF speichern
        </Button>
        <div className="flex rounded-lg border border-line bg-surface-1 p-1 text-sm">
          <button
            type="button"
            onClick={() => setVertragstyp('privat')}
            className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
              vertragstyp === 'privat'
                ? 'bg-accent text-white'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            Privat an Privat
          </button>
          <button
            type="button"
            onClick={() => setVertragstyp('gewerblich')}
            className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
              vertragstyp === 'gewerblich'
                ? 'bg-accent text-white'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            Unternehmer an Verbraucher
          </button>
        </div>
      </div>

      {istDemo && <DemoBanner />}

      <div className="rounded-lg border border-line bg-white p-8 text-ink print:border-none print:p-0 print:shadow-none dark:bg-surface-1 print:dark:bg-white print:dark:text-black">
        <div className="mb-8 text-center">
          {istDemo && (
            <p className="mb-2 text-lg font-black uppercase tracking-[0.3em] text-caution/40 print:text-caution/60">
              DEMO
            </p>
          )}
          <h1 className="text-xl font-bold print:text-lg">
            Kaufvertrag ueber ein gebrauchtes Kraftfahrzeug
          </h1>
          <p className="mt-1 text-xs text-ink-muted print:text-[10px]">
            {vertragstyp === 'privat'
              ? 'Zwischen Privatpersonen'
              : 'Zwischen Unternehmer (Verkaeufer) und Verbraucher (Kaeufer)'}
            {' — '}Vorlage von CARONEX
          </p>
          <p className="mt-1 text-[10px] text-ink-subtle print:text-[8px]">
            CARONEX ist nicht Vertragspartei. Diese Vorlage ist eine
            Arbeitshilfe und keine Rechtsberatung.
          </p>
        </div>

        <Abschnitt titel="1. Verkaeufer">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <FeldInput label="Vorname" vorgabe={d?.vkVorname} />
            <FeldInput label="Nachname" vorgabe={d?.vkNachname} />
            <FeldInput label="Strasse, Hausnummer" breit vorgabe={d?.vkStrasse} />
            <FeldInput label="PLZ" vorgabe={d?.vkPlz} />
            <FeldInput label="Ort" vorgabe={d?.vkOrt} />
            <FeldInput label="Telefon" vorgabe={d?.vkTelefon} />
            <FeldInput label="E-Mail" vorgabe={d?.vkEmail} />
            <FeldInput label="Personalausweisnummer" breit vorgabe={d?.vkAusweis} />
            {vertragstyp === 'gewerblich' && (
              <>
                <FeldInput label="Firma / Handelsname" breit />
                <FeldInput label="USt-IdNr. / Steuernummer" breit />
              </>
            )}
          </div>
        </Abschnitt>

        <Abschnitt titel="2. Kaeufer">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <FeldInput label="Vorname" vorgabe={d?.kVorname} />
            <FeldInput label="Nachname" vorgabe={d?.kNachname} />
            <FeldInput label="Strasse, Hausnummer" breit vorgabe={d?.kStrasse} />
            <FeldInput label="PLZ" vorgabe={d?.kPlz} />
            <FeldInput label="Ort" vorgabe={d?.kOrt} />
            <FeldInput label="Telefon" vorgabe={d?.kTelefon} />
            <FeldInput label="E-Mail" vorgabe={d?.kEmail} />
            <FeldInput label="Personalausweisnummer" breit vorgabe={d?.kAusweis} />
          </div>
        </Abschnitt>

        <Abschnitt titel="3. Fahrzeug">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <FeldInput label="Hersteller" vorgabe={d?.hersteller} />
            <FeldInput label="Modell" vorgabe={d?.modell} />
            <FeldInput label="Fahrzeug-Identifizierungsnummer (FIN/VIN)" breit vorgabe={d?.vin} />
            <FeldInput label="Erstzulassung" vorgabe={d?.erstzulassung} />
            <FeldInput label="Kilometerstand (km)" vorgabe={d?.km} />
            <FeldInput label="Farbe" vorgabe={d?.farbe} />
            <FeldInput label="Motor (Bezeichnung)" vorgabe={d?.motor} />
            <FeldInput label="Leistung (kW / PS)" vorgabe={d?.leistung} />
            <FeldInput label="Hubraum (ccm)" vorgabe={d?.hubraum} />
            <FeldInput label="Kraftstoff" vorgabe={d?.kraftstoff} />
            <FeldInput label="Getriebe" vorgabe={d?.getriebe} />
            <FeldInput label="Antriebsart" vorgabe={d?.antrieb} />
            <FeldInput label="Amtliches Kennzeichen" vorgabe={d?.kennzeichen} />
            <FeldInput label="Naechste HU" vorgabe={d?.naechsteHu} />
            <FeldInput label="Anzahl Schluessel" vorgabe={d?.schluessel} />
            <FeldInput label="Anzahl Vorbesitzer lt. Brief" vorgabe={d?.vorbesitzer} />
          </div>
        </Abschnitt>

        <Abschnitt titel="4. Zustand des Fahrzeugs">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <FeldInput label="Unfallstatus (unfallfrei / Unfallfahrzeug)" breit vorgabe={d?.unfallstatus} />
            </div>
            <FeldInput label="Bekannte Schaeden" mehrzeilig breit vorgabe={d?.schaeden} />
            <FeldInput label="Bekannte Maengel" mehrzeilig breit vorgabe={d?.maengel} />
            <FeldInput label="Durchgefuehrte Wartungen und Reparaturen" mehrzeilig breit vorgabe={d?.wartungen} />
            <FeldInput label="Sonstige Angaben zum Zustand" mehrzeilig breit />
            <RechtlicherHinweis>
              Der Verkaeufer ist verpflichtet, alle ihm bekannten Maengel
              und Schaeden wahrheitsgemaess anzugeben. Das Verschweigen
              bekannter Maengel kann als Arglist gewertet werden.
            </RechtlicherHinweis>
          </div>
        </Abschnitt>

        <Abschnitt titel="5. Kaufpreis und Zahlung">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <FeldInput label="Kaufpreis in Euro (Zahl)" vorgabe={d?.preisZahl} />
            <FeldInput label="Kaufpreis in Worten" vorgabe={d?.preisWorte} />
            <FeldInput label="Zahlungsart (bar / Ueberweisung / Finanzierung)" breit vorgabe={d?.zahlungsart} />
            <FeldInput label="Zahlungsstatus (bezahlt / Teilzahlung / offen)" breit vorgabe={d?.zahlungsstatus} />
          </div>
          {vertragstyp === 'gewerblich' && (
            <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4">
              <FeldInput label="Nettobetrag (Euro)" />
              <FeldInput label="USt (19 % / Differenzbesteuerung)" />
            </div>
          )}
        </Abschnitt>

        <section className="mt-8">
          <h2 className="mb-4 border-b border-accent/30 pb-2 text-sm font-semibold uppercase tracking-wider text-accent print:text-xs">
            6. Vereinbarungen
          </h2>
          <div className="space-y-3 text-sm leading-relaxed text-ink print:text-xs">
            <p>
              Der Verkaeufer versichert, dass das Fahrzeug sein Eigentum ist und
              frei von Rechten Dritter veraeussert wird.
            </p>
            <p>
              Der Verkaeufer versichert, dass der angegebene Kilometerstand nach
              seinem besten Wissen korrekt ist und das Fahrzeug nicht manipuliert
              wurde.
            </p>

            {vertragstyp === 'privat' ? (
              <>
                <p>
                  Das Fahrzeug wird verkauft wie besichtigt und Probe gefahren.
                  Die Sachmaengelhaftung ist — soweit gesetzlich zulaessig —
                  ausgeschlossen. Dieser Ausschluss gilt nicht fuer Ansprueche aus
                  vorsaetzlich oder grob fahrlaessig verursachten Schaeden sowie
                  bei arglistigem Verschweigen von Maengeln.
                </p>
                <RechtlicherHinweis>
                  Der Ausschluss der Sachmaengelhaftung zwischen Privatpersonen ist
                  grundsaetzlich zulaessig, sofern keine Arglist vorliegt. Die
                  Formulierung vor Verwendung fachlich pruefen lassen.
                </RechtlicherHinweis>
              </>
            ) : (
              <>
                <p>
                  Es gelten die gesetzlichen Gewaehrleistungsrechte. Die
                  Verjaehrungsfrist fuer Sachmaengelansprueche betraegt
                  ein Jahr ab Uebergabe, soweit gesetzlich zulaessig.
                </p>
                <RechtlicherHinweis>
                  Bei Verkaeufen von Unternehmern an Verbraucher ist ein
                  vollstaendiger Ausschluss der Sachmaengelhaftung unzulaessig.
                  Die Verkuerzung der Verjaehrungsfrist auf ein Jahr ist nur unter
                  bestimmten Voraussetzungen zulaessig. Fachlich pruefen lassen.
                </RechtlicherHinweis>
              </>
            )}

            <p>
              Dem Verkaeufer sind folgende Maengel bekannt (siehe auch
              Abschnitt 4):
            </p>
            <FeldInput label="" mehrzeilig breit vorgabe={d ? 'Siehe Abschnitt 4 — keine weiteren Maengel bekannt.' : undefined} />

            <p>
              Zusaetzliche Vereinbarungen zwischen den Parteien:
            </p>
            <FeldInput label="" mehrzeilig breit vorgabe={d ? 'Keine weiteren Vereinbarungen.' : undefined} />
          </div>
        </section>

        <Abschnitt titel="7. Uebergabe">
          <div className="space-y-3 text-sm leading-relaxed text-ink print:text-xs">
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <FeldInput label="Datum der Uebergabe" vorgabe={d?.uebergabeDatum} />
              <FeldInput label="Uhrzeit" vorgabe={d?.uebergabeUhrzeit} />
              <FeldInput label="Ort der Uebergabe" breit vorgabe={d?.uebergabeOrt} />
              <FeldInput label="Kilometerstand bei Uebergabe" vorgabe={d?.uebergabeKm} />
              <FeldInput label="Anzahl uebergebener Schluessel" vorgabe={d?.uebergabeSchluessel} />
            </div>
            <p className="mt-4">
              Mit Unterzeichnung dieses Vertrags gehen Besitz und Gefahr auf den
              Kaeufer ueber. Die Uebergabe folgender Unterlagen und Gegenstaende
              wird bestaetigt:
            </p>
            <ul className="ml-4 list-inside space-y-1">
              <li>☐ Zulassungsbescheinigung Teil II (Fahrzeugbrief)</li>
              <li>☐ Zulassungsbescheinigung Teil I (Fahrzeugschein)</li>
              <li>☐ Serviceheft / Scheckheft</li>
              <li>☐ Bedienungsanleitung</li>
              <li>☐ HU-/AU-Bericht</li>
              <li>☐ Ersatzrad / Reifenreparaturset / Kompressor</li>
              <li>☐ Warndreieck und Verbandskasten</li>
              <li>☐ Winterreifen / Sommerreifen (Satz)</li>
            </ul>
            <FeldInput label="Sonstiges Zubehoer" mehrzeilig breit vorgabe={d ? '1 Satz Winterraeder auf Stahlfelgen' : undefined} />
          </div>
        </Abschnitt>

        <section className="mt-10">
          <h2 className="mb-4 border-b border-accent/30 pb-2 text-sm font-semibold uppercase tracking-wider text-accent print:text-xs">
            8. Unterschriften
          </h2>
          <p className="mb-6 text-sm text-ink print:text-xs">
            Beide Parteien erklaeren, diesen Vertrag gelesen und verstanden zu
            haben. Jede Partei erhaelt eine Ausfertigung.
          </p>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <FeldInput label="Ort, Datum" breit vorgabe={d ? 'Musterstadt, 15.09.2026' : undefined} />
              <div className="mt-12 border-b border-ink print:mt-16" />
              <p className="mt-1 text-xs text-ink-muted">
                Unterschrift Verkaeufer
              </p>
            </div>
            <div>
              <FeldInput label="Ort, Datum" breit vorgabe={d ? 'Musterstadt, 15.09.2026' : undefined} />
              <div className="mt-12 border-b border-ink print:mt-16" />
              <p className="mt-1 text-xs text-ink-muted">
                Unterschrift Kaeufer
              </p>
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
            Vorlage erstellt mit CARONEX — keine Rechtsberatung, keine Gewaehr
            fuer Vollstaendigkeit oder Richtigkeit. CARONEX ist nicht
            Vertragspartei und uebernimmt keine Haftung.
          </p>
        </div>
      </div>
    </>
  );
}
