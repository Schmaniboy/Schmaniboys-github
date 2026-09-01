'use client';

import { Button } from '@/components/ui/Button';

function Kategorie({
  titel,
  punkte,
}: {
  titel: string;
  punkte: string[];
}) {
  return (
    <section className="mt-6 first:mt-0">
      <h2 className="mb-3 border-b border-accent/30 pb-2 text-sm font-semibold uppercase tracking-wider text-accent print:text-xs">
        {titel}
      </h2>
      <ul className="space-y-2">
        {punkte.map((p) => (
          <li key={p} className="flex items-start gap-2 text-sm print:text-xs">
            <span className="mt-0.5 shrink-0">☐</span>
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

const KATEGORIEN = [
  {
    titel: 'Vor der Besichtigung',
    punkte: [
      'Fahrzeugdaten online prüfen (Modell, Baujahr, Motorisierung plausibel?)',
      'Marktpreise vergleichen — ist der Preis realistisch?',
      'Verkäufer-Identität klären (privat oder gewerblich?)',
      'Besichtigungstermin bei Tageslicht vereinbaren',
      'An der Wohnadresse des Verkäufers besichtigen, nicht auf Parkplatz',
    ],
  },
  {
    titel: 'Papiere',
    punkte: [
      'Zulassungsbescheinigung Teil I (Fahrzeugschein) vorhanden',
      'Zulassungsbescheinigung Teil II (Fahrzeugbrief) vorhanden — Name stimmt mit Verkäufer überein',
      'VIN im Brief stimmt mit VIN am Fahrzeug überein',
      'Letzte HU/AU: Datum und Ergebnis',
      'Serviceheft / Scheckheft vorhanden und lückenlos',
      'Anzahl der Vorbesitzer plausibel',
    ],
  },
  {
    titel: 'Außen',
    punkte: [
      'Spaltmaße gleichmäßig (Türen, Motorhaube, Kofferraum)',
      'Lack: Farbunterschiede, Orangenhaut, Nasen — Hinweise auf Nachlackierung',
      'Rost: Schweller, Radläufe, Türunterkanten, Heckklappenkante',
      'Scheiben: Steinschläge, Risse, Baujahr der Scheiben passt zum Fahrzeug',
      'Reifen: Profiltiefe, gleichmäßiger Abrieb, Reifenalter (DOT-Nummer)',
      'Felgen: Bordsteinschäden, Risse',
      'Unterboden: Öl- oder Feuchtigkeitsspuren, Durchrostung',
    ],
  },
  {
    titel: 'Innen',
    punkte: [
      'Sitze: Verschleiß passt zum angegebenen Kilometerstand',
      'Lenkrad, Schaltknauf, Pedale: Abnutzung passt zum Kilometerstand',
      'Geruch: Feuchtigkeit, Schimmel, starker Raumduft (verdeckt Gerüche?)',
      'Alle elektrischen Fensterheber funktionieren',
      'Klimaanlage kühlt / Heizung heizt',
      'Infotainment, Radio, Navigation funktionsfähig',
      'Alle Kontrollleuchten gehen nach Motorstart aus',
    ],
  },
  {
    titel: 'Motor und Technik',
    punkte: [
      'Kaltstart: Motor springt sofort an, kein Nageln, kein Rasseln',
      'Motorraum: Ölspuren, Kühlmittelverlust, poröse Schläuche',
      'Ölpeilstab: Füllstand, Farbe (milchig = Kühlmittel im Öl)',
      'Auspuff: kein blauer oder weißer Rauch bei warmem Motor',
      'Getriebe: saubere Schaltvorgänge, kein Kratzen, kein Ruckeln',
      'Bremsen: Scheiben und Beläge sichtbar geprüft, kein Rubbeln',
    ],
  },
  {
    titel: 'Probefahrt',
    punkte: [
      'Mindestens 20 Minuten, verschiedene Geschwindigkeiten',
      'Geradeauslauf prüfen (Lenkrad gerade, Fahrzeug zieht nicht)',
      'Bremsprobe: kein Ziehen, kein Quietschen, ABS greift',
      'Kupplung: Schleifpunkt nicht zu hoch, kein Rupfen',
      'Federung: kein Poltern, kein Schaukeln',
      'Motor: gleichmäßiger Lauf, keine Leistungslöcher',
      'Geräusche bei verschiedenen Geschwindigkeiten (Lager, Antriebswelle)',
    ],
  },
  {
    titel: 'Nach der Besichtigung',
    punkte: [
      'Kaufvertrag schriftlich — niemals ohne Vertrag kaufen',
      'Fahrzeugbrief bei Übergabe mitnehmen',
      'Übergabeprotokoll ausfüllen',
      'Fahrzeug sofort ummelden (§ 13 FZV)',
      'Versicherung vor Überführung klären',
    ],
  },
];

export function KaeuferCheckliste() {
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
            Checkliste Gebrauchtwagenkauf
          </h1>
          <p className="mt-1 text-xs text-ink-muted print:text-[10px]">
            Vorlage von CARONEX — erhebt keinen Anspruch auf Vollständigkeit
          </p>
        </div>

        {KATEGORIEN.map((k) => (
          <Kategorie key={k.titel} titel={k.titel} punkte={k.punkte} />
        ))}

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
          </p>
        </div>
      </div>
    </>
  );
}
