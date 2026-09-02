'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/Button';

type Vertragstyp = 'privat' | 'gewerblich';

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

export function KaufvertragFormular() {
  const [vertragstyp, setVertragstyp] = useState<Vertragstyp>('privat');

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

      <div className="rounded-lg border border-line bg-white p-8 text-ink print:border-none print:p-0 print:shadow-none dark:bg-surface-1 print:dark:bg-white print:dark:text-black">
        <div className="mb-8 text-center">
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
            <FeldInput label="Vorname" />
            <FeldInput label="Nachname" />
            <FeldInput label="Strasse, Hausnummer" breit />
            <FeldInput label="PLZ" />
            <FeldInput label="Ort" />
            <FeldInput label="Telefon" />
            <FeldInput label="E-Mail" />
            <FeldInput label="Personalausweisnummer" breit />
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
            <FeldInput label="Vorname" />
            <FeldInput label="Nachname" />
            <FeldInput label="Strasse, Hausnummer" breit />
            <FeldInput label="PLZ" />
            <FeldInput label="Ort" />
            <FeldInput label="Telefon" />
            <FeldInput label="E-Mail" />
            <FeldInput label="Personalausweisnummer" breit />
          </div>
        </Abschnitt>

        <Abschnitt titel="3. Fahrzeug">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <FeldInput label="Hersteller" />
            <FeldInput label="Modell" />
            <FeldInput label="Fahrzeug-Identifizierungsnummer (FIN/VIN)" breit />
            <FeldInput label="Erstzulassung" />
            <FeldInput label="Kilometerstand (km)" />
            <FeldInput label="Farbe" />
            <FeldInput label="Motor (Bezeichnung)" />
            <FeldInput label="Leistung (kW / PS)" />
            <FeldInput label="Hubraum (ccm)" />
            <FeldInput label="Kraftstoff" />
            <FeldInput label="Getriebe" />
            <FeldInput label="Antriebsart" />
            <FeldInput label="Amtliches Kennzeichen" />
            <FeldInput label="Naechste HU" />
            <FeldInput label="Anzahl Schluessel" />
            <FeldInput label="Anzahl Vorbesitzer lt. Brief" />
          </div>
        </Abschnitt>

        <Abschnitt titel="4. Zustand des Fahrzeugs">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <FeldInput label="Unfallstatus (unfallfrei / Unfallfahrzeug)" breit />
            </div>
            <FeldInput label="Bekannte Schaeden" mehrzeilig breit />
            <FeldInput label="Bekannte Maengel" mehrzeilig breit />
            <FeldInput label="Durchgefuehrte Wartungen und Reparaturen" mehrzeilig breit />
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
            <FeldInput label="Kaufpreis in Euro (Zahl)" />
            <FeldInput label="Kaufpreis in Worten" />
            <FeldInput label="Zahlungsart (bar / Ueberweisung / Finanzierung)" breit />
            <FeldInput label="Zahlungsstatus (bezahlt / Teilzahlung / offen)" breit />
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
            <FeldInput label="" mehrzeilig breit />

            <p>
              Zusaetzliche Vereinbarungen zwischen den Parteien:
            </p>
            <FeldInput label="" mehrzeilig breit />
          </div>
        </section>

        <Abschnitt titel="7. Uebergabe">
          <div className="space-y-3 text-sm leading-relaxed text-ink print:text-xs">
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <FeldInput label="Datum der Uebergabe" />
              <FeldInput label="Uhrzeit" />
              <FeldInput label="Ort der Uebergabe" breit />
              <FeldInput label="Kilometerstand bei Uebergabe" />
              <FeldInput label="Anzahl uebergebener Schluessel" />
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
            <FeldInput label="Sonstiges Zubehoer" mehrzeilig breit />
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
              <FeldInput label="Ort, Datum" breit />
              <div className="mt-12 border-b border-ink print:mt-16" />
              <p className="mt-1 text-xs text-ink-muted">
                Unterschrift Verkaeufer
              </p>
            </div>
            <div>
              <FeldInput label="Ort, Datum" breit />
              <div className="mt-12 border-b border-ink print:mt-16" />
              <p className="mt-1 text-xs text-ink-muted">
                Unterschrift Kaeufer
              </p>
            </div>
          </div>
        </section>

        <div className="mt-8 border-t border-line pt-4 text-center">
          <p className="text-[10px] text-ink-subtle">
            Vorlage erstellt mit CARONEX — keine Rechtsberatung, keine Gewaehr
            fuer Vollstaendigkeit oder Richtigkeit. CARONEX ist nicht
            Vertragspartei und uebernimmt keine Haftung.
          </p>
        </div>
      </div>
    </>
  );
}
