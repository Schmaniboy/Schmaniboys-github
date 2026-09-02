'use client';

import { useState } from 'react';

import { CONDITION_OPTIONS, SERVICE_HISTORY_OPTIONS } from '@ap/core/sales/schemas';

import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import {
  CheckboxField,
  InputField,
  SelectField,
  TextareaField,
} from '@/components/ui/Field';
import { useToast } from '@/components/ui/Toast';

import { StepIndicator } from './StepIndicator';

const KRAFTSTOFF_OPTIONEN = [
  { value: 'BENZIN', label: 'Benzin' },
  { value: 'DIESEL', label: 'Diesel' },
  { value: 'ELEKTRO', label: 'Elektro' },
  { value: 'HYBRID_BENZIN', label: 'Hybrid (Benzin)' },
  { value: 'HYBRID_DIESEL', label: 'Hybrid (Diesel)' },
  { value: 'PLUGIN_HYBRID', label: 'Plug-in-Hybrid' },
  { value: 'LPG', label: 'Autogas (LPG)' },
  { value: 'CNG', label: 'Erdgas (CNG)' },
  { value: 'WASSERSTOFF', label: 'Wasserstoff' },
] as const;

const GETRIEBE_OPTIONEN = [
  { value: 'MANUELL', label: 'Schaltgetriebe' },
  { value: 'AUTOMATIK', label: 'Automatik' },
  { value: 'HALBAUTOMATIK', label: 'Halbautomatik' },
] as const;

const SCHAEDEN_OPTIONEN = [
  'Kratzer',
  'Dellen',
  'Rost',
  'Steinschlaege',
  'Felgenschaeden',
  'Glasschaeden',
  'Technische Probleme',
  'Warnleuchten',
] as const;

const BILD_CHECKLISTE = [
  'Front schraeg',
  'Heck schraeg',
  'Linke Seite',
  'Rechte Seite',
  'Front gerade',
  'Heck gerade',
  'Kompletter Innenraum',
  'Cockpit / Fahrersitz',
  'Armaturenbrett / Instrumente',
  'Infotainment',
  'Sitze',
  'Kofferraum',
  'Reifen',
  'Felgen',
  'Motorraum',
  'Vorhandene Schaeden',
  'Besondere Ausstattung',
] as const;

interface FahrzeugDaten {
  marke: string;
  modell: string;
  baujahr: string;
  erstzulassung: string;
  kilometerstand: string;
  motor: string;
  leistungPs: string;
  getriebe: string;
  kraftstoff: string;
  farbe: string;
  vorbesitzer: string;
  huBis: string;
  servicehistorie: string;
}

interface ZustandDaten {
  zustand: string;
  unfall: string;
  unfallDetails: string;
  schaeden: string[];
  schadensFreitext: string;
  reifen: string;
}

interface AusstattungDaten {
  sonderausstattung: string;
  zubehoer: string;
  anzahlSchluessel: string;
  wartungen: string;
  reparaturen: string;
}

interface BilderDaten {
  hochgeladeneFotos: string[];
  bilderCheckliste: string[];
}

interface PreisDaten {
  preisvorstellung: string;
  preisart: string;
}

export function VerkaufWizard() {
  const [schritt, setSchritt] = useState(1);
  const { zeigen } = useToast();

  const [fahrzeug, setFahrzeug] = useState<FahrzeugDaten>({
    marke: '',
    modell: '',
    baujahr: '',
    erstzulassung: '',
    kilometerstand: '',
    motor: '',
    leistungPs: '',
    getriebe: '',
    kraftstoff: '',
    farbe: '',
    vorbesitzer: '',
    huBis: '',
    servicehistorie: '',
  });

  const [zustand, setZustand] = useState<ZustandDaten>({
    zustand: '',
    unfall: '',
    unfallDetails: '',
    schaeden: [],
    schadensFreitext: '',
    reifen: '',
  });

  const [ausstattung, setAusstattung] = useState<AusstattungDaten>({
    sonderausstattung: '',
    zubehoer: '',
    anzahlSchluessel: '',
    wartungen: '',
    reparaturen: '',
  });

  const [bilder, setBilder] = useState<BilderDaten>({
    hochgeladeneFotos: [],
    bilderCheckliste: [],
  });

  const [preis, setPreis] = useState<PreisDaten>({
    preisvorstellung: '',
    preisart: '',
  });

  function weiter() {
    if (schritt < 7) setSchritt(schritt + 1);
  }

  function zurueck() {
    if (schritt > 1) setSchritt(schritt - 1);
  }

  function verkaufstextErzeugen(): { titel: string; kurztext: string; langtext: string } {
    const teile: string[] = [];
    const f = fahrzeug;

    const titel = [f.marke, f.modell, f.baujahr, f.leistungPs ? `${f.leistungPs} PS` : '']
      .filter(Boolean)
      .join(' ');

    if (f.marke || f.modell) {
      teile.push(
        `${f.marke} ${f.modell}${f.baujahr ? `, Baujahr ${f.baujahr}` : ''}${f.erstzulassung ? `, Erstzulassung ${f.erstzulassung}` : ''}.`,
      );
    }

    if (f.kilometerstand) teile.push(`Kilometerstand: ${Number(f.kilometerstand).toLocaleString('de-DE')} km.`);
    if (f.motor) teile.push(`Motor: ${f.motor}.`);
    if (f.leistungPs) teile.push(`Leistung: ${f.leistungPs} PS.`);
    if (f.kraftstoff) {
      const label = KRAFTSTOFF_OPTIONEN.find((o) => o.value === f.kraftstoff)?.label;
      if (label) teile.push(`Kraftstoff: ${label}.`);
    }
    if (f.getriebe) {
      const label = GETRIEBE_OPTIONEN.find((o) => o.value === f.getriebe)?.label;
      if (label) teile.push(`Getriebe: ${label}.`);
    }
    if (f.farbe) teile.push(`Farbe: ${f.farbe}.`);
    if (f.vorbesitzer) teile.push(`Vorbesitzer: ${f.vorbesitzer}.`);
    if (f.huBis) teile.push(`HU gueltig bis: ${f.huBis}.`);
    if (f.servicehistorie) {
      const label = SERVICE_HISTORY_OPTIONS.find((o) => o.value === f.servicehistorie)?.label;
      if (label) teile.push(`Servicehistorie: ${label}.`);
    }

    if (zustand.zustand) {
      const label = CONDITION_OPTIONS.find((o) => o.value === zustand.zustand)?.label;
      if (label) teile.push(`Zustand: ${label}.`);
    }
    if (zustand.unfall === 'nein') {
      teile.push('Das Fahrzeug ist unfallfrei.');
    } else if (zustand.unfall === 'ja') {
      teile.push(`Unfallschaden vorhanden${zustand.unfallDetails ? `: ${zustand.unfallDetails}` : ''}.`);
    }
    if (zustand.schaeden.length > 0) {
      teile.push(`Bekannte Schaeden: ${zustand.schaeden.join(', ')}.`);
    }
    if (zustand.schadensFreitext) teile.push(zustand.schadensFreitext);
    if (zustand.reifen) teile.push(`Reifen: ${zustand.reifen}.`);

    if (ausstattung.sonderausstattung) teile.push(`Ausstattung: ${ausstattung.sonderausstattung}.`);
    if (ausstattung.zubehoer) teile.push(`Zubehoer: ${ausstattung.zubehoer}.`);
    if (ausstattung.anzahlSchluessel) teile.push(`Schluessel: ${ausstattung.anzahlSchluessel}.`);
    if (ausstattung.wartungen) teile.push(`Wartungen: ${ausstattung.wartungen}.`);
    if (ausstattung.reparaturen) teile.push(`Reparaturen: ${ausstattung.reparaturen}.`);

    const kurztext = teile.slice(0, 3).join(' ');
    const langtext = teile.join('\n');

    return { titel: titel || 'Fahrzeug', kurztext, langtext };
  }

  function pdfErstellen() {
    const texte = verkaufstextErzeugen();
    const datum = new Date().toLocaleDateString('de-DE');
    const preisAnzeige = preis.preisvorstellung
      ? `${Number(preis.preisvorstellung).toLocaleString('de-DE')} EUR`
      : '';
    const preisartLabel =
      preis.preisart === 'FESTPREIS'
        ? 'Festpreis'
        : preis.preisart === 'VB'
          ? 'Verhandlungsbasis'
          : preis.preisart === 'HOECHSTGEBOT'
            ? 'Hoechstgebot'
            : '';

    const zeilen: { bezeichnung: string; wert: string }[] = [];
    if (fahrzeug.marke) zeilen.push({ bezeichnung: 'Marke', wert: fahrzeug.marke });
    if (fahrzeug.modell) zeilen.push({ bezeichnung: 'Modell', wert: fahrzeug.modell });
    if (fahrzeug.baujahr) zeilen.push({ bezeichnung: 'Baujahr', wert: fahrzeug.baujahr });
    if (fahrzeug.erstzulassung) zeilen.push({ bezeichnung: 'Erstzulassung', wert: fahrzeug.erstzulassung });
    if (fahrzeug.kilometerstand) zeilen.push({ bezeichnung: 'Kilometerstand', wert: `${Number(fahrzeug.kilometerstand).toLocaleString('de-DE')} km` });
    if (fahrzeug.motor) zeilen.push({ bezeichnung: 'Motor', wert: fahrzeug.motor });
    if (fahrzeug.leistungPs) zeilen.push({ bezeichnung: 'Leistung', wert: `${fahrzeug.leistungPs} PS` });
    if (fahrzeug.kraftstoff) {
      const l = KRAFTSTOFF_OPTIONEN.find((o) => o.value === fahrzeug.kraftstoff)?.label;
      if (l) zeilen.push({ bezeichnung: 'Kraftstoff', wert: l });
    }
    if (fahrzeug.getriebe) {
      const l = GETRIEBE_OPTIONEN.find((o) => o.value === fahrzeug.getriebe)?.label;
      if (l) zeilen.push({ bezeichnung: 'Getriebe', wert: l });
    }
    if (fahrzeug.farbe) zeilen.push({ bezeichnung: 'Farbe', wert: fahrzeug.farbe });
    if (fahrzeug.vorbesitzer) zeilen.push({ bezeichnung: 'Vorbesitzer', wert: fahrzeug.vorbesitzer });
    if (fahrzeug.huBis) zeilen.push({ bezeichnung: 'HU gueltig bis', wert: fahrzeug.huBis });
    if (fahrzeug.servicehistorie) {
      const l = SERVICE_HISTORY_OPTIONS.find((o) => o.value === fahrzeug.servicehistorie)?.label;
      if (l) zeilen.push({ bezeichnung: 'Servicehistorie', wert: l });
    }
    if (zustand.zustand) {
      const l = CONDITION_OPTIONS.find((o) => o.value === zustand.zustand)?.label;
      if (l) zeilen.push({ bezeichnung: 'Zustand', wert: l });
    }
    if (zustand.unfall === 'nein') zeilen.push({ bezeichnung: 'Unfall', wert: 'Unfallfrei' });
    if (zustand.unfall === 'ja') zeilen.push({ bezeichnung: 'Unfall', wert: `Unfallschaden: ${zustand.unfallDetails || 'Ja'}` });
    if (zustand.schaeden.length > 0) zeilen.push({ bezeichnung: 'Bekannte Schaeden', wert: zustand.schaeden.join(', ') });
    if (zustand.reifen) zeilen.push({ bezeichnung: 'Reifen', wert: zustand.reifen });
    if (ausstattung.sonderausstattung) zeilen.push({ bezeichnung: 'Ausstattung', wert: ausstattung.sonderausstattung });
    if (ausstattung.zubehoer) zeilen.push({ bezeichnung: 'Zubehoer', wert: ausstattung.zubehoer });
    if (ausstattung.anzahlSchluessel) zeilen.push({ bezeichnung: 'Schluessel', wert: ausstattung.anzahlSchluessel });
    if (preisAnzeige) zeilen.push({ bezeichnung: 'Preis', wert: `${preisAnzeige}${preisartLabel ? ` (${preisartLabel})` : ''}` });

    const tabelleHtml = zeilen
      .map(
        (z) =>
          `<tr><td style="padding:6px 12px;border-bottom:1px solid #333;color:#aaa;white-space:nowrap">${z.bezeichnung}</td><td style="padding:6px 12px;border-bottom:1px solid #333;color:#fff;font-weight:500">${z.wert}</td></tr>`,
      )
      .join('');

    const html = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<title>CARONEX Verkauf – ${texte.titel}</title>
<style>
@media print{@page{margin:20mm 15mm}body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#111;color:#fff;margin:0;padding:40px}
.header{display:flex;align-items:center;gap:16px;margin-bottom:32px;border-bottom:2px solid #ff3355;padding-bottom:16px}
.logo{font-size:24px;font-weight:700;letter-spacing:0.15em;color:#ff3355}
h1{font-size:22px;margin:0 0 24px}
table{width:100%;border-collapse:collapse;margin-bottom:24px}
.section-title{font-size:14px;text-transform:uppercase;letter-spacing:0.1em;color:#ff3355;margin:24px 0 12px;font-weight:600}
.text-block{white-space:pre-line;line-height:1.6;color:#ccc;margin-bottom:24px;font-size:14px}
.footer{margin-top:40px;padding-top:16px;border-top:1px solid #333;font-size:11px;color:#666;line-height:1.5}
</style>
</head>
<body>
<div class="header">
<div class="logo">CARONEX</div>
<div style="color:#888;font-size:12px">Erstellt am ${datum}</div>
</div>
<h1>${texte.titel}</h1>
<div class="section-title">Fahrzeugdaten</div>
<table>${tabelleHtml}</table>
${texte.langtext ? `<div class="section-title">Beschreibung</div><div class="text-block">${texte.langtext.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>` : ''}
<div class="footer">
Die Angaben basieren auf den vom Nutzer bereitgestellten Informationen sowie den im Dokument angegebenen Fahrzeugdaten und Quellen.<br>
Dieses Dokument stellt keine technische Untersuchung, Begutachtung oder Sachverstaendigenbewertung dar.
</div>
<script>window.onload=function(){window.print()}<\/script>
</body>
</html>`;

    const fenster = window.open('', '_blank');
    if (fenster) {
      fenster.document.write(html);
      fenster.document.close();
      zeigen('PDF-Druckansicht geoeffnet.', { ton: 'positive' });
    } else {
      zeigen('Pop-up wurde blockiert. Bitte erlauben Sie Pop-ups fuer diese Seite.', { ton: 'caution' });
    }
  }

  return (
    <div>
      <StepIndicator aktuellerSchritt={schritt} />

      {schritt === 1 && (
        <SchrittFahrzeug daten={fahrzeug} setzen={setFahrzeug} weiter={weiter} />
      )}
      {schritt === 2 && (
        <SchrittZustand daten={zustand} setzen={setZustand} weiter={weiter} zurueck={zurueck} />
      )}
      {schritt === 3 && (
        <SchrittAusstattung daten={ausstattung} setzen={setAusstattung} weiter={weiter} zurueck={zurueck} />
      )}
      {schritt === 4 && (
        <SchrittBilder daten={bilder} setzen={setBilder} weiter={weiter} zurueck={zurueck} />
      )}
      {schritt === 5 && (
        <SchrittVerkaufstext
          fahrzeug={fahrzeug}
          zustand={zustand}
          ausstattung={ausstattung}
          textErzeugen={verkaufstextErzeugen}
          weiter={weiter}
          zurueck={zurueck}
        />
      )}
      {schritt === 6 && (
        <SchrittPreis daten={preis} setzen={setPreis} weiter={weiter} zurueck={zurueck} />
      )}
      {schritt === 7 && (
        <SchrittPdf
          fahrzeug={fahrzeug}
          zustand={zustand}
          ausstattung={ausstattung}
          preis={preis}
          textErzeugen={verkaufstextErzeugen}
          pdfErstellen={pdfErstellen}
          zurueck={zurueck}
        />
      )}
    </div>
  );
}

function NavigationsLeiste({
  weiter,
  zurueck,
  weiterLabel = 'Weiter',
  weiterDisabled = false,
}: {
  weiter?: () => void;
  zurueck?: () => void;
  weiterLabel?: string;
  weiterDisabled?: boolean;
}) {
  return (
    <div className="mt-6 flex items-center justify-between gap-3">
      {zurueck ? (
        <Button type="button" variant="ghost" onClick={zurueck}>
          Zurueck
        </Button>
      ) : (
        <span />
      )}
      {weiter ? (
        <Button type="button" variant="primary" onClick={weiter} disabled={weiterDisabled}>
          {weiterLabel}
        </Button>
      ) : null}
    </div>
  );
}

function SchrittFahrzeug({
  daten,
  setzen,
  weiter,
}: {
  daten: FahrzeugDaten;
  setzen: (d: FahrzeugDaten) => void;
  weiter: () => void;
}) {
  function aendern(feld: keyof FahrzeugDaten, wert: string) {
    setzen({ ...daten, [feld]: wert });
  }

  return (
    <Card>
      <CardBody className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-ink">Fahrzeugdaten</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Geben Sie die Daten Ihres Fahrzeugs ein. Unbekannte Felder koennen Sie leer lassen.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            label="Marke"
            value={daten.marke}
            onChange={(e) => aendern('marke', e.currentTarget.value)}
            placeholder="z.B. BMW, Mercedes, VW"
          />
          <InputField
            label="Modell"
            value={daten.modell}
            onChange={(e) => aendern('modell', e.currentTarget.value)}
            placeholder="z.B. 3er, C-Klasse, Golf"
          />
          <InputField
            label="Baujahr"
            type="number"
            min={1900}
            max={2030}
            value={daten.baujahr}
            onChange={(e) => aendern('baujahr', e.currentTarget.value)}
            placeholder="z.B. 2019"
          />
          <InputField
            label="Erstzulassung"
            type="date"
            value={daten.erstzulassung}
            onChange={(e) => aendern('erstzulassung', e.currentTarget.value)}
          />
          <InputField
            label="Kilometerstand"
            type="number"
            min={0}
            value={daten.kilometerstand}
            onChange={(e) => aendern('kilometerstand', e.currentTarget.value)}
            hint="Aktueller Stand laut Tacho"
          />
          <InputField
            label="Motor"
            value={daten.motor}
            onChange={(e) => aendern('motor', e.currentTarget.value)}
            placeholder="z.B. 2.0 TDI, 320d"
          />
          <InputField
            label="Leistung (PS)"
            type="number"
            min={0}
            value={daten.leistungPs}
            onChange={(e) => aendern('leistungPs', e.currentTarget.value)}
          />
          <SelectField
            label="Kraftstoff"
            value={daten.kraftstoff}
            onChange={(e) => aendern('kraftstoff', e.currentTarget.value)}
          >
            <option value="">Keine Angabe</option>
            {KRAFTSTOFF_OPTIONEN.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </SelectField>
          <SelectField
            label="Getriebe"
            value={daten.getriebe}
            onChange={(e) => aendern('getriebe', e.currentTarget.value)}
          >
            <option value="">Keine Angabe</option>
            {GETRIEBE_OPTIONEN.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </SelectField>
          <InputField
            label="Farbe"
            value={daten.farbe}
            onChange={(e) => aendern('farbe', e.currentTarget.value)}
            placeholder="z.B. Schwarz Metallic"
          />
          <InputField
            label="Vorbesitzer"
            type="number"
            min={0}
            value={daten.vorbesitzer}
            onChange={(e) => aendern('vorbesitzer', e.currentTarget.value)}
            hint="0 = Erstbesitz"
          />
          <InputField
            label="HU gueltig bis"
            type="date"
            value={daten.huBis}
            onChange={(e) => aendern('huBis', e.currentTarget.value)}
          />
        </div>

        <SelectField
          label="Servicehistorie"
          value={daten.servicehistorie}
          onChange={(e) => aendern('servicehistorie', e.currentTarget.value)}
        >
          <option value="">Keine Angabe</option>
          {SERVICE_HISTORY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </SelectField>

        <NavigationsLeiste weiter={weiter} />
      </CardBody>
    </Card>
  );
}

function SchrittZustand({
  daten,
  setzen,
  weiter,
  zurueck,
}: {
  daten: ZustandDaten;
  setzen: (d: ZustandDaten) => void;
  weiter: () => void;
  zurueck: () => void;
}) {
  function schadensToggle(schaden: string) {
    const aktuell = daten.schaeden.includes(schaden)
      ? daten.schaeden.filter((s) => s !== schaden)
      : [...daten.schaeden, schaden];
    setzen({ ...daten, schaeden: aktuell });
  }

  return (
    <Card>
      <CardBody className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-ink">Zustand</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Beschreiben Sie den Zustand Ihres Fahrzeugs ehrlich. CARONEX zeigt alle Angaben
            so an, wie Sie sie machen — ohne Beschoenigung.
          </p>
        </div>

        <SelectField
          label="Allgemeiner Zustand"
          value={daten.zustand}
          onChange={(e) => setzen({ ...daten, zustand: e.currentTarget.value })}
        >
          <option value="">Keine Angabe</option>
          {CONDITION_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </SelectField>

        <SelectField
          label="Unfall"
          value={daten.unfall}
          onChange={(e) => setzen({ ...daten, unfall: e.currentTarget.value })}
          hint="Unfallfrei ist eine rechtlich erhebliche Aussage. Im Zweifel keine Angabe."
        >
          <option value="">Keine Angabe</option>
          <option value="nein">Unfallfrei</option>
          <option value="ja">Unfallschaden vorhanden</option>
        </SelectField>

        {daten.unfall === 'ja' && (
          <TextareaField
            label="Unfallbeschreibung"
            value={daten.unfallDetails}
            onChange={(e) => setzen({ ...daten, unfallDetails: e.currentTarget.value })}
            rows={3}
            hint="Art, Zeitpunkt und ob fachgerecht instand gesetzt."
          />
        )}

        <div>
          <p className="mb-3 text-sm font-medium text-ink">Bekannte Schaeden</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {SCHAEDEN_OPTIONEN.map((schaden) => (
              <CheckboxField
                key={schaden}
                label={schaden}
                checked={daten.schaeden.includes(schaden)}
                onChange={() => schadensToggle(schaden)}
              />
            ))}
          </div>
        </div>

        <TextareaField
          label="Was ist Ihnen noch aufgefallen?"
          value={daten.schadensFreitext}
          onChange={(e) => setzen({ ...daten, schadensFreitext: e.currentTarget.value })}
          rows={3}
          hint="Freitext fuer weitere Anmerkungen zum Zustand."
        />

        <InputField
          label="Reifen"
          value={daten.reifen}
          onChange={(e) => setzen({ ...daten, reifen: e.currentTarget.value })}
          hint="Art und Profiltiefe, z.B. Sommerreifen, 5 mm"
        />

        <NavigationsLeiste weiter={weiter} zurueck={zurueck} />
      </CardBody>
    </Card>
  );
}

function SchrittAusstattung({
  daten,
  setzen,
  weiter,
  zurueck,
}: {
  daten: AusstattungDaten;
  setzen: (d: AusstattungDaten) => void;
  weiter: () => void;
  zurueck: () => void;
}) {
  return (
    <Card>
      <CardBody className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-ink">Ausstattung</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Listen Sie die Sonderausstattung und mitgegebenes Zubehoer auf.
          </p>
        </div>

        <TextareaField
          label="Sonderausstattung"
          value={daten.sonderausstattung}
          onChange={(e) => setzen({ ...daten, sonderausstattung: e.currentTarget.value })}
          rows={4}
          placeholder="z.B. Navigationssystem, Lederausstattung, Panoramadach, Standheizung, LED-Scheinwerfer"
        />

        <TextareaField
          label="Zubehoer"
          value={daten.zubehoer}
          onChange={(e) => setzen({ ...daten, zubehoer: e.currentTarget.value })}
          rows={3}
          placeholder="z.B. Winterraeder, Dachbox, Anhaengerkupplung"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            label="Anzahl Schluessel"
            type="number"
            min={0}
            value={daten.anzahlSchluessel}
            onChange={(e) => setzen({ ...daten, anzahlSchluessel: e.currentTarget.value })}
          />
        </div>

        <TextareaField
          label="Durchgefuehrte Wartungen"
          value={daten.wartungen}
          onChange={(e) => setzen({ ...daten, wartungen: e.currentTarget.value })}
          rows={3}
          placeholder="z.B. Oelwechsel 01/2024, Inspektion 06/2023"
        />

        <TextareaField
          label="Durchgefuehrte Reparaturen"
          value={daten.reparaturen}
          onChange={(e) => setzen({ ...daten, reparaturen: e.currentTarget.value })}
          rows={3}
          placeholder="z.B. Bremsen erneuert 03/2024, Kupplung getauscht 2023"
        />

        <NavigationsLeiste weiter={weiter} zurueck={zurueck} />
      </CardBody>
    </Card>
  );
}

function SchrittBilder({
  daten,
  setzen,
  weiter,
  zurueck,
}: {
  daten: BilderDaten;
  setzen: (d: BilderDaten) => void;
  weiter: () => void;
  zurueck: () => void;
}) {
  return (
    <Card>
      <CardBody className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-ink">Bilder</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Gute Fotos sind der wichtigste Faktor fuer eine erfolgreiche Anzeige.
            Nutzen Sie die Checkliste als Orientierung — nicht jeder Punkt ist fuer
            jedes Fahrzeug noetig.
          </p>
        </div>

        <div>
          <p className="mb-3 text-sm font-medium text-ink">Foto-Checkliste</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {BILD_CHECKLISTE.map((punkt) => (
              <CheckboxField
                key={punkt}
                label={punkt}
                checked={daten.bilderCheckliste.includes(punkt)}
                onChange={() => {
                  const aktuell = daten.bilderCheckliste.includes(punkt)
                    ? daten.bilderCheckliste.filter((p) => p !== punkt)
                    : [...daten.bilderCheckliste, punkt];
                  setzen({ ...daten, bilderCheckliste: aktuell });
                }}
              />
            ))}
          </div>
        </div>

        <Card className="border-accent/20 bg-accent/5">
          <CardBody className="space-y-2">
            <p className="text-sm font-semibold text-ink">Foto-Tipps</p>
            <ul className="space-y-1 text-sm text-ink-muted">
              <li>Tageslicht nutzen</li>
              <li>Fahrzeug vorher reinigen</li>
              <li>Ruhiger Hintergrund</li>
              <li>Fahrzeug vollstaendig im Bild</li>
              <li>Kamera moeglichst gerade halten</li>
              <li>Aktuelle Bilder verwenden</li>
            </ul>
          </CardBody>
        </Card>

        <Card className="border-caution/20 bg-caution/5">
          <CardBody className="space-y-2">
            <p className="text-sm font-semibold text-ink">Datenschutz</p>
            <p className="text-sm text-ink-muted">
              Achten Sie darauf, dass auf Ihren Fotos keine persoenlichen Dokumente,
              Adressen oder Telefonnummern sichtbar sind. Kennzeichen koennen Sie auf
              Wunsch unkenntlich machen.
            </p>
          </CardBody>
        </Card>

        <p className="text-xs text-ink-subtle">
          Ein separates Kilometerfoto ist nicht noetig. Ein Foto vom Armaturenbrett
          reicht, sofern der Kilometerstand darauf sichtbar ist.
        </p>

        <NavigationsLeiste weiter={weiter} zurueck={zurueck} />
      </CardBody>
    </Card>
  );
}

function SchrittVerkaufstext({
  fahrzeug,
  zustand: _zustand,
  ausstattung: _ausstattung,
  textErzeugen,
  weiter,
  zurueck,
}: {
  fahrzeug: FahrzeugDaten;
  zustand: ZustandDaten;
  ausstattung: AusstattungDaten;
  textErzeugen: () => { titel: string; kurztext: string; langtext: string };
  weiter: () => void;
  zurueck: () => void;
}) {
  const texte = textErzeugen();
  const [bearbeiteterText, setBearbeiteterText] = useState(texte.langtext);

  return (
    <Card>
      <CardBody className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-ink">Verkaufstext</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Dieser Text wurde aus Ihren Angaben zusammengestellt — ohne KI, ohne
            Vermutungen. Sie koennen ihn frei bearbeiten.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <p className="mb-1 text-sm font-medium text-ink">Titel</p>
            <p className="rounded-md border border-line bg-surface-1 px-3 py-2 text-sm text-ink">
              {texte.titel}
            </p>
          </div>

          <div>
            <p className="mb-1 text-sm font-medium text-ink">Kurzbeschreibung</p>
            <p className="rounded-md border border-line bg-surface-1 px-3 py-2 text-sm text-ink-muted">
              {texte.kurztext || 'Noch keine Angaben vorhanden.'}
            </p>
          </div>

          <TextareaField
            label="Ausfuehrliche Beschreibung"
            value={bearbeiteterText}
            onChange={(e) => setBearbeiteterText(e.currentTarget.value)}
            rows={12}
            hint="Sie koennen den Text frei anpassen. Sie verantworten die Angaben in Ihrer Anzeige."
          />
        </div>

        <NavigationsLeiste weiter={weiter} zurueck={zurueck} />
      </CardBody>
    </Card>
  );
}

function SchrittPreis({
  daten,
  setzen,
  weiter,
  zurueck,
}: {
  daten: PreisDaten;
  setzen: (d: PreisDaten) => void;
  weiter: () => void;
  zurueck: () => void;
}) {
  return (
    <Card>
      <CardBody className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-ink">Preis</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Setzen Sie Ihren Preis. Orientieren Sie sich an vergleichbaren Angeboten
            fuer Modell, Baujahr, Kilometerstand und Ausstattung.
          </p>
        </div>

        <InputField
          label="Preisvorstellung"
          type="number"
          min={0}
          value={daten.preisvorstellung}
          onChange={(e) => setzen({ ...daten, preisvorstellung: e.currentTarget.value })}
          hint="Ihr Wunschpreis in Euro"
        />

        <SelectField
          label="Preisart"
          value={daten.preisart}
          onChange={(e) => setzen({ ...daten, preisart: e.currentTarget.value })}
        >
          <option value="">Keine Angabe</option>
          <option value="FESTPREIS">Festpreis</option>
          <option value="VB">Verhandlungsbasis</option>
          <option value="HOECHSTGEBOT">Hoechstgebot</option>
        </SelectField>

        <Card className="border-accent/20 bg-accent/5">
          <CardBody className="space-y-2">
            <p className="text-sm font-semibold text-ink">Preis-Tipps</p>
            <ul className="space-y-1 text-sm text-ink-muted">
              <li>Vergleichen Sie aehnliche Angebote auf gaengigen Portalen</li>
              <li>Beruecksichtigen Sie: Modell, Baujahr, Kilometerstand, Zustand</li>
              <li>Sonderausstattung kann den Preis erhoehen</li>
              <li>Schaeden und hoher Kilometerstand senken den Preis</li>
              <li>Regionale Unterschiede beachten</li>
            </ul>
          </CardBody>
        </Card>

        <NavigationsLeiste weiter={weiter} zurueck={zurueck} />
      </CardBody>
    </Card>
  );
}

function SchrittPdf({
  fahrzeug,
  zustand,
  ausstattung,
  preis,
  textErzeugen,
  pdfErstellen,
  zurueck,
}: {
  fahrzeug: FahrzeugDaten;
  zustand: ZustandDaten;
  ausstattung: AusstattungDaten;
  preis: PreisDaten;
  textErzeugen: () => { titel: string; kurztext: string; langtext: string };
  pdfErstellen: () => void;
  zurueck: () => void;
}) {
  const texte = textErzeugen();

  return (
    <Card>
      <CardBody className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-ink">Verkaufs-PDF</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Erstellen Sie kostenlos ein professionelles PDF mit allen Angaben zu
            Ihrem Fahrzeug.
          </p>
        </div>

        <div className="space-y-4">
          <ZusammenfassungsZeile bezeichnung="Fahrzeug" wert={`${fahrzeug.marke} ${fahrzeug.modell} ${fahrzeug.baujahr}`.trim()} />
          <ZusammenfassungsZeile bezeichnung="Kilometerstand" wert={fahrzeug.kilometerstand ? `${Number(fahrzeug.kilometerstand).toLocaleString('de-DE')} km` : ''} />
          <ZusammenfassungsZeile bezeichnung="Motor" wert={[fahrzeug.motor, fahrzeug.leistungPs ? `${fahrzeug.leistungPs} PS` : ''].filter(Boolean).join(', ')} />
          <ZusammenfassungsZeile bezeichnung="Zustand" wert={CONDITION_OPTIONS.find((o) => o.value === zustand.zustand)?.label ?? ''} />
          <ZusammenfassungsZeile bezeichnung="Unfall" wert={zustand.unfall === 'nein' ? 'Unfallfrei' : zustand.unfall === 'ja' ? 'Unfallschaden vorhanden' : ''} />
          <ZusammenfassungsZeile bezeichnung="Preis" wert={preis.preisvorstellung ? `${Number(preis.preisvorstellung).toLocaleString('de-DE')} EUR` : ''} />
        </div>

        <div className="rounded-md border border-line bg-surface-1 p-4">
          <p className="mb-2 text-sm font-medium text-ink">Vorschau: Verkaufstext</p>
          <p className="whitespace-pre-line text-sm text-ink-muted">{texte.langtext || 'Noch keine Angaben vorhanden.'}</p>
        </div>

        <Card className="border-ink-subtle/20 bg-surface-1">
          <CardBody>
            <p className="text-xs text-ink-subtle">
              Die Angaben basieren auf den von Ihnen bereitgestellten Informationen.
              Dieses Dokument stellt keine technische Untersuchung, Begutachtung oder
              Sachverstaendigenbewertung dar.
            </p>
          </CardBody>
        </Card>

        <div className="flex items-center justify-between gap-3">
          <Button type="button" variant="ghost" onClick={zurueck}>
            Zurueck
          </Button>
          <Button type="button" variant="primary" onClick={pdfErstellen}>
            PDF erstellen
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}

function ZusammenfassungsZeile({ bezeichnung, wert }: { bezeichnung: string; wert: string }) {
  if (!wert) return null;
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line/50 pb-2">
      <span className="text-sm text-ink-muted">{bezeichnung}</span>
      <span className="text-sm font-medium text-ink">{wert}</span>
    </div>
  );
}
