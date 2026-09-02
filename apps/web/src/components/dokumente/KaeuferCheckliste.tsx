'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/Button';

type PruefStatus = 'offen' | 'ok' | 'auffaellig' | 'nicht_geprueft';

interface PruefpunktState {
  status: PruefStatus;
  notiz: string;
}

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

function StatusBadge({
  status,
  onClick,
  label,
}: {
  status: PruefStatus;
  onClick: () => void;
  label: string;
}) {
  const klassen: Record<PruefStatus, string> = {
    offen: 'border-ink-subtle/30 text-ink-subtle',
    ok: 'border-positive/50 bg-positive/10 text-positive',
    auffaellig: 'border-caution/50 bg-caution/10 text-caution',
    nicht_geprueft: 'border-ink-subtle/30 bg-ink-subtle/5 text-ink-muted',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-2 py-0.5 text-[10px] font-medium transition-colors ${klassen[status]}`}
    >
      {label}
    </button>
  );
}

function InteraktiverPruefpunkt({
  text,
  zustand,
  onStatusWechsel,
  onNotizAendern,
}: {
  text: string;
  zustand: PruefpunktState;
  onStatusWechsel: (status: PruefStatus) => void;
  onNotizAendern: (notiz: string) => void;
}) {
  const naechsterStatus = (): PruefStatus => {
    switch (zustand.status) {
      case 'offen': return 'ok';
      case 'ok': return 'auffaellig';
      case 'auffaellig': return 'nicht_geprueft';
      case 'nicht_geprueft': return 'offen';
    }
  };

  const statusSymbol: Record<PruefStatus, string> = {
    offen: '☐',
    ok: '✓',
    auffaellig: '⚠',
    nicht_geprueft: '—',
  };

  const statusFarbe: Record<PruefStatus, string> = {
    offen: 'text-ink-subtle',
    ok: 'text-positive',
    auffaellig: 'text-caution',
    nicht_geprueft: 'text-ink-muted',
  };

  return (
    <li className="space-y-1">
      <div className="flex items-start gap-2 text-sm print:text-xs">
        <button
          type="button"
          onClick={() => onStatusWechsel(naechsterStatus())}
          className={`mt-0.5 shrink-0 font-bold ${statusFarbe[zustand.status]} print:hidden`}
          title="Status wechseln"
        >
          {statusSymbol[zustand.status]}
        </button>
        <span className={`hidden print:inline mt-0.5 shrink-0 font-bold ${statusFarbe[zustand.status]}`}>
          {statusSymbol[zustand.status]}
        </span>
        <span className="flex-1">{text}</span>
        <div className="flex shrink-0 gap-1 print:hidden">
          <StatusBadge
            status={zustand.status === 'ok' ? 'ok' : 'offen'}
            onClick={() => onStatusWechsel('ok')}
            label="OK"
          />
          <StatusBadge
            status={zustand.status === 'auffaellig' ? 'auffaellig' : 'offen'}
            onClick={() => onStatusWechsel('auffaellig')}
            label="Auffaellig"
          />
          <StatusBadge
            status={zustand.status === 'nicht_geprueft' ? 'nicht_geprueft' : 'offen'}
            onClick={() => onStatusWechsel('nicht_geprueft')}
            label="Nicht geprueft"
          />
        </div>
      </div>
      {zustand.status === 'auffaellig' && (
        <div className="ml-6">
          <textarea
            value={zustand.notiz}
            onChange={(e) => onNotizAendern(e.target.value)}
            placeholder="Was ist aufgefallen?"
            className="w-full resize-none border-b border-caution/30 bg-transparent pb-1 text-xs text-caution outline-none focus:border-caution print:pb-0 print:text-[10px]"
            rows={2}
          />
        </div>
      )}
    </li>
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

const KATEGORIEN = [
  {
    titel: 'Vor der Besichtigung',
    punkte: [
      'Fahrzeugdaten online pruefen (Modell, Baujahr, Motorisierung plausibel?)',
      'Marktpreise vergleichen — ist der Preis realistisch?',
      'Verkaeufer-Identitaet klaeren (privat oder gewerblich?)',
      'Besichtigungstermin bei Tageslicht vereinbaren',
      'An der Wohnadresse des Verkaeufers besichtigen, nicht auf Parkplatz',
    ],
  },
  {
    titel: 'Papiere / Unterlagen',
    punkte: [
      'Zulassungsbescheinigung Teil I (Fahrzeugschein) vorhanden',
      'Zulassungsbescheinigung Teil II (Fahrzeugbrief) vorhanden — Name stimmt mit Verkaeufer ueberein',
      'VIN im Brief stimmt mit VIN am Fahrzeug ueberein',
      'Letzte HU/AU: Datum und Ergebnis',
      'Serviceheft / Scheckheft vorhanden und lueckenlos',
      'Anzahl der Vorbesitzer plausibel',
      'Rechnungen und Belege vorhanden',
    ],
  },
  {
    titel: 'Aussen',
    punkte: [
      'Spaltmasse gleichmaessig (Tueren, Motorhaube, Kofferraum)',
      'Lack: Farbunterschiede, Orangenhaut, Nasen — Hinweise auf Nachlackierung',
      'Rost: Schweller, Radlaeufe, Tuerunterkanten, Heckklappenkante',
      'Scheiben: Steinschlaege, Risse, Baujahr der Scheiben passt zum Fahrzeug',
      'Beleuchtung: Alle Scheinwerfer, Blinker, Rueckleuchten funktionsfaehig',
      'Reifen: Profiltiefe, gleichmaessiger Abrieb, Reifenalter (DOT-Nummer)',
      'Felgen: Bordsteinschaeden, Risse',
      'Unterboden: Oel- oder Feuchtigkeitsspuren, Durchrostung',
    ],
  },
  {
    titel: 'Innenraum',
    punkte: [
      'Sitze: Verschleiss passt zum angegebenen Kilometerstand',
      'Lenkrad, Schaltknauf, Pedale: Abnutzung passt zum Kilometerstand',
      'Geruch: Feuchtigkeit, Schimmel, starker Raumduft (verdeckt Gerueche?)',
      'Alle elektrischen Fensterheber funktionieren',
      'Klimaanlage kuehlt / Heizung heizt',
      'Infotainment, Radio, Navigation funktionsfaehig',
      'Zentralverriegelung funktioniert',
      'Alle Kontrollleuchten gehen nach Motorstart aus',
      'Warnleuchten im Armaturenbrett pruefen',
    ],
  },
  {
    titel: 'Motor und Technik',
    punkte: [
      'Kaltstart: Motor springt sofort an, kein Nageln, kein Rasseln',
      'Motorraum: Oelspuren, Kuehlmittelverlust, poroese Schlaeuche',
      'Oelpeilstab: Fuellstand, Farbe (milchig = Kuehlmittel im Oel)',
      'Fluessigkeiten: Brems-, Kuehl-, Servo-, Scheibenwischerfluessigkeit',
      'Auspuff: kein blauer oder weisser Rauch bei warmem Motor',
      'Getriebe: saubere Schaltvorgaenge, kein Kratzen, kein Ruckeln',
      'Bremsen: Scheiben und Belaege sichtbar geprueft, kein Rubbeln',
      'Motorlauf: gleichmaessig im Leerlauf, keine Vibrationen',
    ],
  },
  {
    titel: 'Probefahrt',
    punkte: [
      'Mindestens 20 Minuten, verschiedene Geschwindigkeiten',
      'Geradeauslauf pruefen (Lenkrad gerade, Fahrzeug zieht nicht)',
      'Bremsprobe: kein Ziehen, kein Quietschen, ABS greift',
      'Kupplung: Schleifpunkt nicht zu hoch, kein Rupfen',
      'Federung: kein Poltern, kein Schaukeln',
      'Motor: gleichmaessiger Lauf, keine Leistungsloecher',
      'Beschleunigung: spontan und linear',
      'Lenkung: leichtgaengig, keine Geraeusche',
      'Geraeusche bei verschiedenen Geschwindigkeiten (Lager, Antriebswelle)',
    ],
  },
  {
    titel: 'Nach der Besichtigung',
    punkte: [
      'Kaufvertrag schriftlich — niemals ohne Vertrag kaufen',
      'Fahrzeugbrief bei Uebergabe mitnehmen',
      'Uebergabeprotokoll ausfuellen',
      'Fahrzeug sofort ummelden (§ 13 FZV)',
      'Versicherung vor Ueberfuehrung klaeren',
    ],
  },
];

const DEMO_ZUSTAENDE: Record<string, PruefpunktState> = {
  'Fahrzeugdaten online pruefen (Modell, Baujahr, Motorisierung plausibel?)': { status: 'ok', notiz: '' },
  'Marktpreise vergleichen — ist der Preis realistisch?': { status: 'ok', notiz: '' },
  'Verkaeufer-Identitaet klaeren (privat oder gewerblich?)': { status: 'ok', notiz: '' },
  'Besichtigungstermin bei Tageslicht vereinbaren': { status: 'ok', notiz: '' },
  'An der Wohnadresse des Verkaeufers besichtigen, nicht auf Parkplatz': { status: 'ok', notiz: '' },
  'Zulassungsbescheinigung Teil I (Fahrzeugschein) vorhanden': { status: 'ok', notiz: '' },
  'Zulassungsbescheinigung Teil II (Fahrzeugbrief) vorhanden — Name stimmt mit Verkaeufer ueberein': { status: 'ok', notiz: '' },
  'VIN im Brief stimmt mit VIN am Fahrzeug ueberein': { status: 'ok', notiz: '' },
  'Letzte HU/AU: Datum und Ergebnis': { status: 'ok', notiz: '' },
  'Serviceheft / Scheckheft vorhanden und lueckenlos': { status: 'ok', notiz: '' },
  'Anzahl der Vorbesitzer plausibel': { status: 'ok', notiz: '' },
  'Rechnungen und Belege vorhanden': { status: 'auffaellig', notiz: 'Nur Rechnungen ab 2022 vorhanden. Fruehe Werkstattrechnungen fehlen.' },
  'Spaltmasse gleichmaessig (Tueren, Motorhaube, Kofferraum)': { status: 'ok', notiz: '' },
  'Lack: Farbunterschiede, Orangenhaut, Nasen — Hinweise auf Nachlackierung': { status: 'ok', notiz: '' },
  'Rost: Schweller, Radlaeufe, Tuerunterkanten, Heckklappenkante': { status: 'ok', notiz: '' },
  'Scheiben: Steinschlaege, Risse, Baujahr der Scheiben passt zum Fahrzeug': { status: 'auffaellig', notiz: 'Kleiner Steinschlag Windschutzscheibe unten links (ca. 3 mm). Noch nicht gerissen.' },
  'Beleuchtung: Alle Scheinwerfer, Blinker, Rueckleuchten funktionsfaehig': { status: 'ok', notiz: '' },
  'Reifen: Profiltiefe, gleichmaessiger Abrieb, Reifenalter (DOT-Nummer)': { status: 'ok', notiz: '' },
  'Felgen: Bordsteinschaeden, Risse': { status: 'ok', notiz: '' },
  'Unterboden: Oel- oder Feuchtigkeitsspuren, Durchrostung': { status: 'nicht_geprueft', notiz: '' },
};

const DEMO_BEWERTUNGEN = {
  gesamteindruck: 4,
  fahrzeugzustand: 4,
  preisLeistung: 3,
  probefahrt: 5,
};

function erstelleInitialZustaende(istDemo: boolean): Record<string, PruefpunktState> {
  const zustaende: Record<string, PruefpunktState> = {};
  KATEGORIEN.forEach((k) => {
    k.punkte.forEach((p) => {
      zustaende[p] = (istDemo && DEMO_ZUSTAENDE[p]) || { status: 'offen', notiz: '' };
    });
  });
  return zustaende;
}

export function KaeuferCheckliste({ istDemo }: { istDemo?: boolean }) {
  const [zustaende, setZustaende] = useState(() => erstelleInitialZustaende(!!istDemo));

  const [bewertungen, setBewertungen] = useState(
    istDemo ? DEMO_BEWERTUNGEN : { gesamteindruck: 0, fahrzeugzustand: 0, preisLeistung: 0, probefahrt: 0 },
  );

  const statusAendern = (punkt: string, status: PruefStatus) => {
    setZustaende((prev) => {
      const bisherig = prev[punkt] ?? { status: 'offen', notiz: '' };
      return { ...prev, [punkt]: { status, notiz: bisherig.notiz } };
    });
  };

  const notizAendern = (punkt: string, notiz: string) => {
    setZustaende((prev) => {
      const bisherig = prev[punkt] ?? { status: 'offen', notiz: '' };
      return { ...prev, [punkt]: { status: bisherig.status, notiz } };
    });
  };

  const alleZuruecksetzen = () => {
    const zurueckgesetzt: Record<string, PruefpunktState> = {};
    KATEGORIEN.forEach((k) => {
      k.punkte.forEach((p) => {
        zurueckgesetzt[p] = { status: 'offen', notiz: '' };
      });
    });
    setZustaende(zurueckgesetzt);
    setBewertungen({ gesamteindruck: 0, fahrzeugzustand: 0, preisLeistung: 0, probefahrt: 0 });
  };

  const anzahlOk = Object.values(zustaende).filter((z) => z.status === 'ok').length;
  const anzahlAuffaellig = Object.values(zustaende).filter((z) => z.status === 'auffaellig').length;
  const anzahlGesamt = Object.keys(zustaende).length;

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center gap-3 print:hidden">
        <Button variant="primary" size="md" onClick={() => window.print()}>
          Drucken / Als PDF speichern
        </Button>
        <Button variant="ghost" size="md" onClick={alleZuruecksetzen}>
          Zuruecksetzen
        </Button>
      </div>

      {istDemo && <DemoBanner />}

      <div className="mb-4 flex flex-wrap gap-4 rounded-lg border border-line bg-surface-1 px-4 py-3 text-sm print:hidden">
        <span className="text-ink-muted">
          Geprueft: <strong className="text-positive">{anzahlOk}</strong> /{' '}
          {anzahlGesamt}
        </span>
        {anzahlAuffaellig > 0 && (
          <span className="text-caution">
            Auffaellig: <strong>{anzahlAuffaellig}</strong>
          </span>
        )}
      </div>

      <div className="rounded-lg border border-line bg-white p-8 text-ink print:border-none print:p-0 dark:bg-surface-1 print:dark:bg-white print:dark:text-black">
        <div className="mb-8 text-center">
          {istDemo && (
            <p className="mb-2 text-lg font-black uppercase tracking-[0.3em] text-caution/40 print:text-caution/60">
              DEMO
            </p>
          )}
          <h1 className="text-xl font-bold print:text-lg">
            Checkliste Gebrauchtwagenkauf
          </h1>
          <p className="mt-1 text-xs text-ink-muted print:text-[10px]">
            Vorlage von CARONEX — erhebt keinen Anspruch auf Vollstaendigkeit
          </p>
        </div>

        {KATEGORIEN.map((k) => (
          <section key={k.titel} className="mt-6 first:mt-0">
            <h2 className="mb-3 border-b border-accent/30 pb-2 text-sm font-semibold uppercase tracking-wider text-accent print:text-xs">
              {k.titel}
            </h2>
            <ul className="space-y-2">
              {k.punkte.map((p) => (
                <InteraktiverPruefpunkt
                  key={p}
                  text={p}
                  zustand={zustaende[p] ?? { status: 'offen', notiz: '' }}
                  onStatusWechsel={(s) => statusAendern(p, s)}
                  onNotizAendern={(n) => notizAendern(p, n)}
                />
              ))}
            </ul>
          </section>
        ))}

        <section className="mt-8">
          <h2 className="mb-3 border-b border-accent/30 pb-2 text-sm font-semibold uppercase tracking-wider text-accent print:text-xs">
            Persoenliche Einschaetzung
          </h2>
          <p className="mb-4 text-xs text-ink-muted print:text-[10px]">
            Persoenliche Einschaetzung des Nutzers — keine professionelle
            Fahrzeugbewertung.
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
              wert={bewertungen.fahrzeugzustand}
              onAendern={(w) =>
                setBewertungen((prev) => ({ ...prev, fahrzeugzustand: w }))
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
              label="Probefahrt"
              wert={bewertungen.probefahrt}
              onAendern={(w) =>
                setBewertungen((prev) => ({ ...prev, probefahrt: w }))
              }
            />
          </div>
        </section>

        <section className="mt-8">
          <h2 className="mb-3 border-b border-accent/30 pb-2 text-sm font-semibold uppercase tracking-wider text-accent print:text-xs">
            Notizen
          </h2>
          <textarea
            className="w-full resize-none border-b border-ink-subtle/30 bg-transparent pb-2 text-sm text-ink outline-none focus:border-accent print:pb-1 print:text-xs"
            rows={6}
            defaultValue={istDemo ? 'Fahrzeug insgesamt in gutem Zustand. Steinschlag in der Windschutzscheibe sollte vor Kauf repariert werden (Kosten pruefen). Fehlende Rechnungen vor 2022 sind kein Dealbreaker, aber Preis verhandeln.' : undefined}
            placeholder="Eigene Notizen zur Besichtigung..."
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
            Diese Checkliste ist eine Orientierungshilfe und ersetzt keine
            technische Untersuchung, Diagnose oder ein Sachverstaendigengutachten.
            Die Kaufentscheidung liegt beim Nutzer.
          </p>
        </div>
      </div>
    </>
  );
}
