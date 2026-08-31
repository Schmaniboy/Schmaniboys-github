import {
  type Finding,
  type ImportDatei,
  gueteNachPruefung,
  istBlockiert,
  pruefeAntrieb,
  pruefeAusstattungscode,
  pruefeBildangaben,
  pruefeHerkunftsart,
  pruefeMotor,
  pruefeVerfuegbarkeitStimmig,
  pruefeZeitraum,
  toSlug,
  type PeriodForCheck,
} from '@ap/core';

import { prisma } from '../client';

/**
 * Import von Katalogdaten.
 *
 * Die Regel, die alles andere bestimmt: Ein fehlerhafter Datensatz wird
 * NICHT stillschweigend uebernommen. Er wird entweder abgelehnt oder mit
 * der Guete "zur Pruefung" gespeichert, und in beiden Faellen steht im
 * Bericht, warum.
 *
 * Der zweite Grundsatz ist der Probelauf. Ein Import, der erst beim
 * Schreiben merkt, dass die Haelfte der Verweise ins Leere zeigt, hat schon
 * die andere Haelfte geschrieben. Deshalb laeuft jeder Import zuerst
 * vollstaendig ohne Schreibzugriff durch -- dieselbe Pruefung, dieselben
 * Befunde, nur ohne Wirkung.
 */

export type ImportSeverity = 'BLOCKER' | 'WARNING' | 'HINT';

export interface ImportEintrag {
  bereich: string;
  /** Wie der Datensatz in der Datei zu finden ist. */
  schluessel: string;
  aktion: 'ANGELEGT' | 'AKTUALISIERT' | 'UNVERAENDERT' | 'ABGELEHNT';
  befunde: Finding[];
}

export interface ImportBericht {
  probelauf: boolean;
  quelle: string;
  angelegt: number;
  aktualisiert: number;
  unveraendert: number;
  abgelehnt: number;
  befundeGesamt: { BLOCKER: number; WARNING: number; HINT: number };
  eintraege: ImportEintrag[];
  /** Verweise, die ins Leere zeigen. Immer ein Abbruchgrund fuer den Datensatz. */
  offeneVerweise: string[];
  dauerMs: number;
}

interface Lauf {
  probelauf: boolean;
  eintraege: ImportEintrag[];
  offeneVerweise: string[];
  /** slug -> id, je Bereich. Fuellt sich waehrend des Laufs. */
  hersteller: Map<string, string>;
  motorfamilien: Map<string, string>;
  motoren: Map<string, string>;
  modelle: Map<string, string>;
  generationen: Map<string, string>;
  facelifts: Map<string, string>;
  ausstattungen: Map<string, string>;
  linien: Map<string, string>;
  pakete: Map<string, string>;
  sondermodelle: Map<string, string>;
  lackfarben: Map<string, string>;
  raeder: Map<string, string>;
  /*
   * Zeitraeume der Generationen dieses Laufs.
   *
   * Ohne sie setzte die Zeitraumpruefung im Probelauf still aus: Die
   * Generation steht ja noch nicht in der Datenbank, also gibt es nichts,
   * wogegen sich eine Facelift-Phase pruefen liesse. Eine Pruefung, die
   * genau dann nicht greift, wenn man sie braucht, ist keine.
   */
  zeitraeume: Map<string, PeriodForCheck>;
}

function neuerLauf(probelauf: boolean): Lauf {
  return {
    probelauf,
    eintraege: [],
    offeneVerweise: [],
    hersteller: new Map(),
    motorfamilien: new Map(),
    motoren: new Map(),
    modelle: new Map(),
    generationen: new Map(),
    facelifts: new Map(),
    ausstattungen: new Map(),
    linien: new Map(),
    pakete: new Map(),
    sondermodelle: new Map(),
    lackfarben: new Map(),
    raeder: new Map(),
    zeitraeume: new Map(),
  };
}

/** Beim Probelauf gibt es keine Kennung -- ein Platzhalter haelt die Kette zusammen. */
const PROBE_ID = '(probelauf)';

function melde(
  lauf: Lauf,
  bereich: string,
  schluessel: string,
  aktion: ImportEintrag['aktion'],
  befunde: Finding[],
): void {
  lauf.eintraege.push({ bereich, schluessel, aktion, befunde });
}

function fehlenderVerweis(lauf: Lauf, was: string): null {
  lauf.offeneVerweise.push(was);
  return null;
}

function datumOderNull(wert: string | undefined): Date | null {
  if (!wert) return null;
  const datum = new Date(wert);
  return Number.isNaN(datum.getTime()) ? null : datum;
}

/** Quellen eines Datensatzes schreiben -- Dateiquelle plus eigene. */
async function schreibeQuellen(
  lauf: Lauf,
  datei: ImportDatei,
  subjectType: string,
  subjectId: string,
  eigene: ImportDatei['hersteller'][number]['quellen'],
): Promise<void> {
  if (lauf.probelauf || subjectId === PROBE_ID) return;

  const alle = [datei.quelle, ...eigene];
  for (const quelle of alle) {
    /*
     * Zweimal dieselbe Quelle am selben Eintrag waere Rauschen. Der
     * Vergleich laeuft ueber Titel und Adresse -- dieselbe Unterlage kann
     * verschiedene Felder decken, das bleibt zulaessig.
     */
    const vorhanden = await prisma.source.findFirst({
      where: {
        subjectType,
        subjectId,
        title: quelle.title,
        url: quelle.url ?? null,
        coversFields: { equals: quelle.coversFields },
      },
      select: { id: true },
    });
    if (vorhanden) continue;

    await prisma.source.create({
      data: {
        subjectType,
        subjectId,
        kind: quelle.kind,
        title: quelle.title,
        url: quelle.url ?? null,
        publishedOn: datumOderNull(quelle.publishedOn),
        checkedAt: datumOderNull(quelle.checkedAt) ?? new Date(),
        note: quelle.note ?? null,
        coversFields: quelle.coversFields,
      },
    });
  }
}

// ---------------------------------------------------------------------------

export async function importiere(
  datei: ImportDatei,
  optionen: { probelauf: boolean },
): Promise<ImportBericht> {
  const beginn = Date.now();
  const lauf = neuerLauf(optionen.probelauf);

  await importiereHersteller(lauf, datei);
  await importiereMotorfamilien(lauf, datei);
  await importiereMotoren(lauf, datei);
  await importiereModelle(lauf, datei);
  await importiereGenerationen(lauf, datei);
  await importiereFacelifts(lauf, datei);
  await importiereAntriebe(lauf, datei);
  await importiereAusstattungen(lauf, datei);
  await importiereVerfuegbarkeiten(lauf, datei);
  await importiereBilder(lauf, datei);
  await importiereHsnTsn(lauf, datei);

  const zaehler = { BLOCKER: 0, WARNING: 0, HINT: 0 };
  for (const eintrag of lauf.eintraege) {
    for (const befund of eintrag.befunde) zaehler[befund.severity] += 1;
  }

  return {
    probelauf: lauf.probelauf,
    quelle: datei.quelle.title,
    angelegt: lauf.eintraege.filter((e) => e.aktion === 'ANGELEGT').length,
    aktualisiert: lauf.eintraege.filter((e) => e.aktion === 'AKTUALISIERT').length,
    unveraendert: lauf.eintraege.filter((e) => e.aktion === 'UNVERAENDERT').length,
    abgelehnt: lauf.eintraege.filter((e) => e.aktion === 'ABGELEHNT').length,
    befundeGesamt: zaehler,
    eintraege: lauf.eintraege,
    offeneVerweise: [...new Set(lauf.offeneVerweise)],
    dauerMs: Date.now() - beginn,
  };
}

// ---------------------------------------------------------------------------

async function importiereHersteller(lauf: Lauf, datei: ImportDatei): Promise<void> {
  for (const eintrag of datei.hersteller) {
    const vorhanden = await prisma.manufacturer.findUnique({
      where: { slug: eintrag.slug },
      select: { id: true },
    });

    if (vorhanden) {
      lauf.hersteller.set(eintrag.slug, vorhanden.id);
      if (!lauf.probelauf) {
        await prisma.manufacturer.update({
          where: { id: vorhanden.id },
          data: {
            name: eintrag.name,
            country: eintrag.country ?? null,
            // Vorhandene Kennungen bleiben; der Import ergaenzt, statt zu ersetzen.
            wmiCodes: eintrag.wmiCodes.length > 0 ? eintrag.wmiCodes : undefined,
          },
        });
        await schreibeQuellen(lauf, datei, 'Manufacturer', vorhanden.id, eintrag.quellen);
      }
      melde(lauf, 'Hersteller', eintrag.slug, 'AKTUALISIERT', []);
      continue;
    }

    if (lauf.probelauf) {
      lauf.hersteller.set(eintrag.slug, PROBE_ID);
      melde(lauf, 'Hersteller', eintrag.slug, 'ANGELEGT', []);
      continue;
    }

    const angelegt = await prisma.manufacturer.create({
      data: {
        slug: eintrag.slug,
        name: eintrag.name,
        country: eintrag.country ?? null,
        wmiCodes: eintrag.wmiCodes,
      },
      select: { id: true },
    });
    lauf.hersteller.set(eintrag.slug, angelegt.id);
    await schreibeQuellen(lauf, datei, 'Manufacturer', angelegt.id, eintrag.quellen);
    melde(lauf, 'Hersteller', eintrag.slug, 'ANGELEGT', []);
  }
}

async function herstellerId(lauf: Lauf, slug: string): Promise<string | null> {
  const gemerkt = lauf.hersteller.get(slug);
  if (gemerkt) return gemerkt;
  const gefunden = await prisma.manufacturer.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (!gefunden) return fehlenderVerweis(lauf, `Hersteller „${slug}" gibt es nicht.`);
  lauf.hersteller.set(slug, gefunden.id);
  return gefunden.id;
}

async function importiereMotorfamilien(lauf: Lauf, datei: ImportDatei): Promise<void> {
  for (const eintrag of datei.motorfamilien) {
    const hersteller = await herstellerId(lauf, eintrag.herstellerSlug);
    if (!hersteller) {
      melde(lauf, 'Motorfamilie', eintrag.slug, 'ABGELEHNT', [
        {
          severity: 'BLOCKER',
          code: 'verweis.hersteller',
          message: `Hersteller „${eintrag.herstellerSlug}" gibt es nicht.`,
        },
      ]);
      continue;
    }

    const schluessel = `${eintrag.herstellerSlug}/${eintrag.slug}`;
    if (lauf.probelauf && hersteller === PROBE_ID) {
      lauf.motorfamilien.set(schluessel, PROBE_ID);
      melde(lauf, 'Motorfamilie', schluessel, 'ANGELEGT', []);
      continue;
    }

    const daten = {
      name: eintrag.name,
      generationLabel: eintrag.generationLabel ?? null,
      description: eintrag.description ?? null,
      yearFrom: eintrag.yearFrom ?? null,
      yearTo: eintrag.yearTo ?? null,
      dataQuality: eintrag.dataQuality,
      lastVerifiedAt: datumOderNull(eintrag.lastVerifiedAt),
    };

    const vorhanden = await prisma.engineFamily.findUnique({
      where: { manufacturerId_slug: { manufacturerId: hersteller, slug: eintrag.slug } },
      select: { id: true },
    });

    if (lauf.probelauf) {
      lauf.motorfamilien.set(schluessel, vorhanden?.id ?? PROBE_ID);
      melde(lauf, 'Motorfamilie', schluessel, vorhanden ? 'AKTUALISIERT' : 'ANGELEGT', []);
      continue;
    }

    const gespeichert = vorhanden
      ? await prisma.engineFamily.update({
          where: { id: vorhanden.id },
          data: daten,
          select: { id: true },
        })
      : await prisma.engineFamily.create({
          data: { manufacturerId: hersteller, slug: eintrag.slug, ...daten },
          select: { id: true },
        });

    lauf.motorfamilien.set(schluessel, gespeichert.id);
    await schreibeQuellen(lauf, datei, 'EngineFamily', gespeichert.id, eintrag.quellen);
    melde(lauf, 'Motorfamilie', schluessel, vorhanden ? 'AKTUALISIERT' : 'ANGELEGT', []);
  }
}

async function importiereMotoren(lauf: Lauf, datei: ImportDatei): Promise<void> {
  for (const eintrag of datei.motoren) {
    const schluessel = `${eintrag.herstellerSlug}/${eintrag.code}`;

    const befunde = pruefeMotor({
      name: eintrag.name,
      code: eintrag.code,
      displacementCcm: eintrag.displacementCcm,
      cylinders: eintrag.cylinders,
      cylinderLayout: eintrag.cylinderLayout,
      fuelType: eintrag.fuelType,
      aspiration: eintrag.aspiration,
      powerKw: eintrag.powerKw,
      torqueNm: eintrag.torqueNm,
      emissionStandard: eintrag.emissionStandard,
      yearFrom: eintrag.yearFrom,
      yearTo: eintrag.yearTo,
    });

    if (istBlockiert(befunde)) {
      melde(lauf, 'Motor', schluessel, 'ABGELEHNT', befunde);
      continue;
    }

    const hersteller = await herstellerId(lauf, eintrag.herstellerSlug);
    if (!hersteller) {
      melde(lauf, 'Motor', schluessel, 'ABGELEHNT', [
        ...befunde,
        {
          severity: 'BLOCKER',
          code: 'verweis.hersteller',
          message: `Hersteller „${eintrag.herstellerSlug}" gibt es nicht.`,
        },
      ]);
      continue;
    }

    const familie = eintrag.motorfamilieSlug
      ? lauf.motorfamilien.get(`${eintrag.herstellerSlug}/${eintrag.motorfamilieSlug}`) ?? null
      : null;

    if (eintrag.motorfamilieSlug && !familie) {
      befunde.push({
        severity: 'WARNING',
        code: 'verweis.motorfamilie',
        message: `Motorfamilie „${eintrag.motorfamilieSlug}" gibt es nicht — der Motor wird ohne Familie gespeichert.`,
      });
    }

    const guete = gueteNachPruefung(eintrag.dataQuality, befunde);

    if (lauf.probelauf || hersteller === PROBE_ID) {
      lauf.motoren.set(schluessel, PROBE_ID);
      melde(lauf, 'Motor', schluessel, 'ANGELEGT', befunde);
      continue;
    }

    const daten = {
      name: eintrag.name,
      engineFamilyId: familie && familie !== PROBE_ID ? familie : null,
      powerStage: eintrag.powerStage ?? null,
      displacementCcm: eintrag.displacementCcm ?? null,
      cylinders: eintrag.cylinders ?? null,
      cylinderLayout: eintrag.cylinderLayout ?? null,
      fuelType: eintrag.fuelType,
      aspiration: eintrag.aspiration,
      chargingDetail: eintrag.chargingDetail ?? null,
      injectionSystem: eintrag.injectionSystem ?? null,
      valvetrain: eintrag.valvetrain ?? null,
      emissionStandard: eintrag.emissionStandard ?? null,
      powerKw: eintrag.powerKw ?? null,
      torqueNm: eintrag.torqueNm ?? null,
      yearFrom: eintrag.yearFrom ?? null,
      yearTo: eintrag.yearTo ?? null,
      dataQuality: guete,
      lastVerifiedAt: datumOderNull(eintrag.lastVerifiedAt),
    };

    const vorhanden = await prisma.engine.findUnique({
      where: { manufacturerId_code: { manufacturerId: hersteller, code: eintrag.code } },
      select: { id: true },
    });

    const gespeichert = vorhanden
      ? await prisma.engine.update({ where: { id: vorhanden.id }, data: daten, select: { id: true } })
      : await prisma.engine.create({
          data: { manufacturerId: hersteller, code: eintrag.code, ...daten },
          select: { id: true },
        });

    lauf.motoren.set(schluessel, gespeichert.id);
    await schreibeQuellen(lauf, datei, 'Engine', gespeichert.id, eintrag.quellen);
    melde(lauf, 'Motor', schluessel, vorhanden ? 'AKTUALISIERT' : 'ANGELEGT', befunde);
  }
}

async function importiereModelle(lauf: Lauf, datei: ImportDatei): Promise<void> {
  for (const eintrag of datei.modelle) {
    const schluessel = `${eintrag.herstellerSlug}/${eintrag.slug}`;
    const hersteller = await herstellerId(lauf, eintrag.herstellerSlug);
    if (!hersteller) {
      melde(lauf, 'Modell', schluessel, 'ABGELEHNT', [
        {
          severity: 'BLOCKER',
          code: 'verweis.hersteller',
          message: `Hersteller „${eintrag.herstellerSlug}" gibt es nicht.`,
        },
      ]);
      continue;
    }

    if (lauf.probelauf || hersteller === PROBE_ID) {
      lauf.modelle.set(schluessel, PROBE_ID);
      melde(lauf, 'Modell', schluessel, 'ANGELEGT', []);
      continue;
    }

    const vorhanden = await prisma.model.findUnique({
      where: { manufacturerId_slug: { manufacturerId: hersteller, slug: eintrag.slug } },
      select: { id: true },
    });

    const gespeichert = vorhanden
      ? await prisma.model.update({
          where: { id: vorhanden.id },
          data: { name: eintrag.name },
          select: { id: true },
        })
      : await prisma.model.create({
          data: { manufacturerId: hersteller, slug: eintrag.slug, name: eintrag.name },
          select: { id: true },
        });

    lauf.modelle.set(schluessel, gespeichert.id);
    await schreibeQuellen(lauf, datei, 'Model', gespeichert.id, eintrag.quellen);
    melde(lauf, 'Modell', schluessel, vorhanden ? 'AKTUALISIERT' : 'ANGELEGT', []);
  }
}

async function modellId(lauf: Lauf, herstellerSlug: string, modellSlug: string): Promise<string | null> {
  const schluessel = `${herstellerSlug}/${modellSlug}`;
  const gemerkt = lauf.modelle.get(schluessel);
  if (gemerkt) return gemerkt;

  const hersteller = await herstellerId(lauf, herstellerSlug);
  if (!hersteller || hersteller === PROBE_ID) return null;

  const gefunden = await prisma.model.findUnique({
    where: { manufacturerId_slug: { manufacturerId: hersteller, slug: modellSlug } },
    select: { id: true },
  });
  if (!gefunden) return fehlenderVerweis(lauf, `Modell „${schluessel}" gibt es nicht.`);
  lauf.modelle.set(schluessel, gefunden.id);
  return gefunden.id;
}

async function importiereGenerationen(lauf: Lauf, datei: ImportDatei): Promise<void> {
  for (const eintrag of datei.generationen) {
    const schluessel = `${eintrag.herstellerSlug}/${eintrag.modellSlug}/${eintrag.slug}`;
    const modell = await modellId(lauf, eintrag.herstellerSlug, eintrag.modellSlug);

    if (!modell) {
      melde(lauf, 'Generation', schluessel, 'ABGELEHNT', [
        {
          severity: 'BLOCKER',
          code: 'verweis.modell',
          message: `Modell „${eintrag.herstellerSlug}/${eintrag.modellSlug}" gibt es nicht.`,
        },
      ]);
      continue;
    }

    lauf.zeitraeume.set(schluessel, {
      label: `Generation ${eintrag.name}`,
      yearFrom: eintrag.yearFrom,
      yearTo: eintrag.yearTo,
    });

    const befunde = pruefeZeitraum(
      { label: `Generation ${eintrag.name}`, yearFrom: eintrag.yearFrom, yearTo: eintrag.yearTo },
      { label: 'Katalog', yearFrom: 1886 },
    );

    if (istBlockiert(befunde)) {
      melde(lauf, 'Generation', schluessel, 'ABGELEHNT', befunde);
      continue;
    }

    if (lauf.probelauf || modell === PROBE_ID) {
      lauf.generationen.set(schluessel, PROBE_ID);
      melde(lauf, 'Generation', schluessel, 'ANGELEGT', befunde);
      continue;
    }

    let bodyTypeId: string | null = null;
    if (eintrag.bodyType) {
      const slug = toSlug(eintrag.bodyType);
      const vorhanden = await prisma.bodyType.findUnique({ where: { slug }, select: { id: true } });
      bodyTypeId =
        vorhanden?.id ??
        (
          await prisma.bodyType.create({
            data: { name: eintrag.bodyType, slug },
            select: { id: true },
          })
        ).id;
    }

    const daten = {
      name: eintrag.name,
      code: eintrag.code ?? null,
      bodyTypeId,
      yearFrom: eintrag.yearFrom,
      yearTo: eintrag.yearTo ?? null,
      dataQuality: gueteNachPruefung(eintrag.dataQuality, befunde),
      lastVerifiedAt: datumOderNull(eintrag.lastVerifiedAt),
    };

    const vorhanden = await prisma.generation.findUnique({
      where: { modelId_slug: { modelId: modell, slug: eintrag.slug } },
      select: { id: true },
    });

    const gespeichert = vorhanden
      ? await prisma.generation.update({
          where: { id: vorhanden.id },
          data: daten,
          select: { id: true },
        })
      : await prisma.generation.create({
          data: { modelId: modell, slug: eintrag.slug, ...daten },
          select: { id: true },
        });

    lauf.generationen.set(schluessel, gespeichert.id);
    await schreibeQuellen(lauf, datei, 'Generation', gespeichert.id, eintrag.quellen);
    melde(lauf, 'Generation', schluessel, vorhanden ? 'AKTUALISIERT' : 'ANGELEGT', befunde);
  }
}

async function generationId(
  lauf: Lauf,
  herstellerSlug: string,
  modellSlug: string,
  generationSlug: string,
): Promise<string | null> {
  const schluessel = `${herstellerSlug}/${modellSlug}/${generationSlug}`;
  const gemerkt = lauf.generationen.get(schluessel);
  if (gemerkt) return gemerkt;

  const modell = await modellId(lauf, herstellerSlug, modellSlug);
  if (!modell || modell === PROBE_ID) return null;

  const gefunden = await prisma.generation.findUnique({
    where: { modelId_slug: { modelId: modell, slug: generationSlug } },
    select: { id: true },
  });
  if (!gefunden) return fehlenderVerweis(lauf, `Generation „${schluessel}" gibt es nicht.`);
  lauf.generationen.set(schluessel, gefunden.id);
  return gefunden.id;
}

/**
 * Der Zeitraum der uebergeordneten Generation -- egal, ob sie in diesem
 * Lauf entstanden ist oder schon in der Datenbank steht.
 */
async function elternZeitraum(
  lauf: Lauf,
  generationId: string,
  schluessel: string,
): Promise<PeriodForCheck | null> {
  const gemerkt = lauf.zeitraeume.get(schluessel);
  if (gemerkt) return gemerkt;
  if (generationId === PROBE_ID) return null;

  const eltern = await prisma.generation.findUnique({
    where: { id: generationId },
    select: { name: true, yearFrom: true, yearTo: true },
  });
  if (!eltern) return null;

  const zeitraum: PeriodForCheck = {
    label: `Generation ${eltern.name}`,
    yearFrom: eltern.yearFrom,
    yearTo: eltern.yearTo,
  };
  lauf.zeitraeume.set(schluessel, zeitraum);
  return zeitraum;
}

async function importiereFacelifts(lauf: Lauf, datei: ImportDatei): Promise<void> {
  for (const eintrag of datei.faceliftphasen) {
    const schluessel = `${eintrag.herstellerSlug}/${eintrag.modellSlug}/${eintrag.generationSlug}/${eintrag.slug}`;
    const generation = await generationId(
      lauf,
      eintrag.herstellerSlug,
      eintrag.modellSlug,
      eintrag.generationSlug,
    );

    if (!generation) {
      melde(lauf, 'Facelift', schluessel, 'ABGELEHNT', [
        {
          severity: 'BLOCKER',
          code: 'verweis.generation',
          message: 'Die zugehörige Generation gibt es nicht.',
        },
      ]);
      continue;
    }

    const eltern = await elternZeitraum(
      lauf,
      generation,
      `${eintrag.herstellerSlug}/${eintrag.modellSlug}/${eintrag.generationSlug}`,
    );
    const befunde: Finding[] = eltern
      ? pruefeZeitraum(
          { label: `Phase ${eintrag.name}`, yearFrom: eintrag.yearFrom, yearTo: eintrag.yearTo },
          eltern,
        )
      : [];

    if (istBlockiert(befunde)) {
      melde(lauf, 'Facelift', schluessel, 'ABGELEHNT', befunde);
      continue;
    }

    if (lauf.probelauf || generation === PROBE_ID) {
      lauf.facelifts.set(schluessel, PROBE_ID);
      melde(lauf, 'Facelift', schluessel, 'ANGELEGT', befunde);
      continue;
    }

    const daten = {
      name: eintrag.name,
      yearFrom: eintrag.yearFrom,
      yearTo: eintrag.yearTo ?? null,
      distinguishingFeatures: eintrag.distinguishingFeatures ?? null,
      dataQuality: gueteNachPruefung(eintrag.dataQuality, befunde),
      lastVerifiedAt: datumOderNull(eintrag.lastVerifiedAt),
    };

    const vorhanden = await prisma.faceliftPhase.findUnique({
      where: { generationId_slug: { generationId: generation, slug: eintrag.slug } },
      select: { id: true },
    });

    const gespeichert = vorhanden
      ? await prisma.faceliftPhase.update({
          where: { id: vorhanden.id },
          data: daten,
          select: { id: true },
        })
      : await prisma.faceliftPhase.create({
          data: { generationId: generation, slug: eintrag.slug, ...daten },
          select: { id: true },
        });

    lauf.facelifts.set(schluessel, gespeichert.id);
    await schreibeQuellen(lauf, datei, 'FaceliftPhase', gespeichert.id, eintrag.quellen);
    melde(lauf, 'Facelift', schluessel, vorhanden ? 'AKTUALISIERT' : 'ANGELEGT', befunde);
  }
}

async function importiereAntriebe(lauf: Lauf, datei: ImportDatei): Promise<void> {
  for (const eintrag of datei.antriebe) {
    const schluessel = `${eintrag.herstellerSlug}/${eintrag.modellSlug}/${eintrag.generationSlug}/${eintrag.motorCode}/${eintrag.driveType}`;

    const generation = await generationId(
      lauf,
      eintrag.herstellerSlug,
      eintrag.modellSlug,
      eintrag.generationSlug,
    );
    if (!generation) {
      melde(lauf, 'Antrieb', schluessel, 'ABGELEHNT', [
        {
          severity: 'BLOCKER',
          code: 'verweis.generation',
          message: 'Die zugehörige Generation gibt es nicht.',
        },
      ]);
      continue;
    }

    const motorSchluessel = `${eintrag.herstellerSlug}/${eintrag.motorCode}`;
    let motor = lauf.motoren.get(motorSchluessel) ?? null;
    if (!motor) {
      const hersteller = await herstellerId(lauf, eintrag.herstellerSlug);
      if (hersteller && hersteller !== PROBE_ID) {
        const gefunden = await prisma.engine.findUnique({
          where: { manufacturerId_code: { manufacturerId: hersteller, code: eintrag.motorCode } },
          select: { id: true },
        });
        motor = gefunden?.id ?? null;
        if (motor) lauf.motoren.set(motorSchluessel, motor);
      }
    }
    if (!motor) {
      fehlenderVerweis(lauf, `Motorcode „${motorSchluessel}" gibt es nicht.`);
      melde(lauf, 'Antrieb', schluessel, 'ABGELEHNT', [
        {
          severity: 'BLOCKER',
          code: 'verweis.motor',
          message: `Motorcode „${eintrag.motorCode}" ist nicht erfasst. Eine Antriebskombination ohne Motor ist keine Auskunft.`,
        },
      ]);
      continue;
    }

    const motorDaten =
      motor !== PROBE_ID
        ? await prisma.engine.findUnique({
            where: { id: motor },
            select: { powerKw: true, fuelType: true, code: true },
          })
        : null;

    const befunde = pruefeAntrieb(
      {
        powerKw: eintrag.powerKw,
        torqueNm: eintrag.torqueNm,
        acceleration0to100: eintrag.acceleration0to100,
        topSpeedKmh: eintrag.topSpeedKmh,
        consumptionCombined: eintrag.consumptionCombined,
        measurementStandard: eintrag.measurementStandard,
        kerbWeightKg: eintrag.kerbWeightKg,
        seats: eintrag.seats,
        doors: eintrag.doors,
        fuelType: motorDaten?.fuelType ?? null,
        driveType: eintrag.driveType,
        transmissionType: eintrag.getriebe.type,
        transmissionGears: eintrag.getriebe.gears,
        batteryCapacityKwh: eintrag.batteryCapacityKwh,
        electricRangeKm: eintrag.electricRangeKm,
      },
      motorDaten ? { powerKw: motorDaten.powerKw, code: motorDaten.code } : null,
    );

    if (eintrag.yearFrom || eintrag.yearTo) {
      const eltern = await elternZeitraum(
        lauf,
        generation,
        `${eintrag.herstellerSlug}/${eintrag.modellSlug}/${eintrag.generationSlug}`,
      );
      if (eltern) {
        befunde.push(
          ...pruefeZeitraum(
            { label: 'Antriebskombination', yearFrom: eintrag.yearFrom, yearTo: eintrag.yearTo },
            eltern,
          ),
        );
      }
    }

    if (istBlockiert(befunde)) {
      melde(lauf, 'Antrieb', schluessel, 'ABGELEHNT', befunde);
      continue;
    }

    if (lauf.probelauf || generation === PROBE_ID || motor === PROBE_ID) {
      melde(lauf, 'Antrieb', schluessel, 'ANGELEGT', befunde);
      continue;
    }

    const getriebe = await prisma.transmission.upsert({
      where: {
        name_type_gears: {
          name: eintrag.getriebe.name,
          type: eintrag.getriebe.type,
          gears: eintrag.getriebe.gears ?? 0,
        },
      },
      update: {},
      create: {
        name: eintrag.getriebe.name,
        type: eintrag.getriebe.type,
        gears: eintrag.getriebe.gears ?? null,
      },
      select: { id: true },
    });

    const facelift = eintrag.faceliftSlug
      ? lauf.facelifts.get(
          `${eintrag.herstellerSlug}/${eintrag.modellSlug}/${eintrag.generationSlug}/${eintrag.faceliftSlug}`,
        ) ?? null
      : null;

    const daten = {
      faceliftPhaseId: facelift && facelift !== PROBE_ID ? facelift : null,
      yearFrom: eintrag.yearFrom ?? null,
      yearTo: eintrag.yearTo ?? null,
      modelYearFrom: eintrag.modelYearFrom ?? null,
      modelYearTo: eintrag.modelYearTo ?? null,
      marketRegion: eintrag.marketRegion ?? null,
      powerKw: eintrag.powerKw ?? null,
      torqueNm: eintrag.torqueNm ?? null,
      acceleration0to100: eintrag.acceleration0to100 ?? null,
      topSpeedKmh: eintrag.topSpeedKmh ?? null,
      consumptionCombined: eintrag.consumptionCombined ?? null,
      consumptionUnit: eintrag.consumptionUnit ?? null,
      co2CombinedGramPerKm: eintrag.co2CombinedGramPerKm ?? null,
      measurementStandard: eintrag.measurementStandard,
      kerbWeightKg: eintrag.kerbWeightKg ?? null,
      batteryCapacityKwh: eintrag.batteryCapacityKwh ?? null,
      electricRangeKm: eintrag.electricRangeKm ?? null,
      fuelTankLitres: eintrag.fuelTankLitres ?? null,
      emissionStandard: eintrag.emissionStandard ?? null,
      seats: eintrag.seats ?? null,
      doors: eintrag.doors ?? null,
      payloadKg: eintrag.payloadKg ?? null,
      towingCapacityBrakedKg: eintrag.towingCapacityBrakedKg ?? null,
      towingCapacityUnbrakedKg: eintrag.towingCapacityUnbrakedKg ?? null,
      dataQuality: gueteNachPruefung(eintrag.dataQuality, befunde),
      lastVerifiedAt: datumOderNull(eintrag.lastVerifiedAt),
    };

    const vorhanden = await prisma.powertrainCombination.findUnique({
      where: {
        generationId_engineId_transmissionId_driveType: {
          generationId: generation,
          engineId: motor,
          transmissionId: getriebe.id,
          driveType: eintrag.driveType,
        },
      },
      select: { id: true },
    });

    const gespeichert = vorhanden
      ? await prisma.powertrainCombination.update({
          where: { id: vorhanden.id },
          data: daten,
          select: { id: true },
        })
      : await prisma.powertrainCombination.create({
          data: {
            generationId: generation,
            engineId: motor,
            transmissionId: getriebe.id,
            driveType: eintrag.driveType,
            ...daten,
          },
          select: { id: true },
        });

    await schreibeQuellen(lauf, datei, 'PowertrainCombination', gespeichert.id, eintrag.quellen);
    melde(lauf, 'Antrieb', schluessel, vorhanden ? 'AKTUALISIERT' : 'ANGELEGT', befunde);
  }
}

async function importiereAusstattungen(lauf: Lauf, datei: ImportDatei): Promise<void> {
  for (const eintrag of datei.ausstattungen) {
    const schluessel = `${eintrag.herstellerSlug}/${eintrag.slug}`;
    const hersteller = await herstellerId(lauf, eintrag.herstellerSlug);

    if (!hersteller) {
      melde(lauf, 'Ausstattung', schluessel, 'ABGELEHNT', [
        {
          severity: 'BLOCKER',
          code: 'verweis.hersteller',
          message: `Hersteller „${eintrag.herstellerSlug}" gibt es nicht.`,
        },
      ]);
      continue;
    }

    const befunde = pruefeAusstattungscode({
      name: eintrag.name,
      optionCode: eintrag.optionCode,
      manufacturerSlug: eintrag.herstellerSlug,
    });

    if (istBlockiert(befunde)) {
      melde(lauf, 'Ausstattung', schluessel, 'ABGELEHNT', befunde);
      continue;
    }

    if (lauf.probelauf || hersteller === PROBE_ID) {
      lauf.ausstattungen.set(schluessel, PROBE_ID);
      melde(lauf, 'Ausstattung', schluessel, 'ANGELEGT', befunde);
      continue;
    }

    const daten = {
      name: eintrag.name,
      optionCode: eintrag.optionCode ?? null,
      category: eintrag.category ?? null,
      area: eintrag.area ?? null,
      description: eintrag.description ?? null,
      howToIdentify: eintrag.howToIdentify ?? null,
      rarity: eintrag.rarity ?? null,
      purchaseRelevance: eintrag.purchaseRelevance ?? null,
      resaleRelevance: eintrag.resaleRelevance ?? null,
      relevanceEvidenceType: eintrag.relevanceEvidenceType ?? null,
      relevanceReasoning: eintrag.relevanceReasoning ?? null,
      relevanceDataBasis: eintrag.relevanceDataBasis ?? null,
      dataQuality: gueteNachPruefung(eintrag.dataQuality, befunde),
      lastVerifiedAt: datumOderNull(eintrag.lastVerifiedAt),
    };

    const vorhanden = await prisma.optionalEquipment.findUnique({
      where: { manufacturerId_slug: { manufacturerId: hersteller, slug: eintrag.slug } },
      select: { id: true },
    });

    const gespeichert = vorhanden
      ? await prisma.optionalEquipment.update({
          where: { id: vorhanden.id },
          data: daten,
          select: { id: true },
        })
      : await prisma.optionalEquipment.create({
          data: { manufacturerId: hersteller, slug: eintrag.slug, ...daten },
          select: { id: true },
        });

    lauf.ausstattungen.set(schluessel, gespeichert.id);
    await schreibeQuellen(lauf, datei, 'OptionalEquipment', gespeichert.id, eintrag.quellen);
    melde(lauf, 'Ausstattung', schluessel, vorhanden ? 'AKTUALISIERT' : 'ANGELEGT', befunde);
  }
}

async function importiereVerfuegbarkeiten(lauf: Lauf, datei: ImportDatei): Promise<void> {
  for (const eintrag of datei.verfuegbarkeiten) {
    const schluessel = `${eintrag.herstellerSlug}/${eintrag.ausstattungSlug} @ ${eintrag.modellSlug}/${eintrag.generationSlug}`;

    const stimmigkeit = pruefeVerfuegbarkeitStimmig({
      kind: eintrag.kind,
      packageId: eintrag.paketSlug ?? null,
      specialEditionId: eintrag.sondermodellSlug ?? null,
      marketRegion: eintrag.marketRegion ?? null,
      surchargeCents: eintrag.surchargeCents ?? null,
    });

    const befunde: Finding[] = Object.entries(stimmigkeit).flatMap(([feld, meldungen]) =>
      meldungen.map((message) => ({
        severity: 'BLOCKER' as const,
        code: 'verfuegbarkeit.widerspruch',
        message,
        field: feld,
      })),
    );

    if (istBlockiert(befunde)) {
      melde(lauf, 'Verfügbarkeit', schluessel, 'ABGELEHNT', befunde);
      continue;
    }

    const ausstattung =
      lauf.ausstattungen.get(`${eintrag.herstellerSlug}/${eintrag.ausstattungSlug}`) ??
      (await (async () => {
        const hersteller = await herstellerId(lauf, eintrag.herstellerSlug);
        if (!hersteller || hersteller === PROBE_ID) return null;
        const gefunden = await prisma.optionalEquipment.findUnique({
          where: {
            manufacturerId_slug: { manufacturerId: hersteller, slug: eintrag.ausstattungSlug },
          },
          select: { id: true },
        });
        return gefunden?.id ?? null;
      })());

    const generation = await generationId(
      lauf,
      eintrag.herstellerSlug,
      eintrag.modellSlug,
      eintrag.generationSlug,
    );

    if (!ausstattung || !generation) {
      melde(lauf, 'Verfügbarkeit', schluessel, 'ABGELEHNT', [
        {
          severity: 'BLOCKER',
          code: 'verweis.fehlt',
          message: !ausstattung
            ? `Ausstattung „${eintrag.ausstattungSlug}" ist nicht erfasst.`
            : 'Die zugehörige Generation gibt es nicht.',
        },
      ]);
      continue;
    }

    if (lauf.probelauf || ausstattung === PROBE_ID || generation === PROBE_ID) {
      melde(lauf, 'Verfügbarkeit', schluessel, 'ANGELEGT', befunde);
      continue;
    }

    const facelift = eintrag.faceliftSlug
      ? lauf.facelifts.get(
          `${eintrag.herstellerSlug}/${eintrag.modellSlug}/${eintrag.generationSlug}/${eintrag.faceliftSlug}`,
        ) ?? null
      : null;

    const daten = {
      faceliftPhaseId: facelift && facelift !== PROBE_ID ? facelift : null,
      kind: eintrag.kind,
      yearFrom: eintrag.yearFrom ?? null,
      yearTo: eintrag.yearTo ?? null,
      modelYearFrom: eintrag.modelYearFrom ?? null,
      modelYearTo: eintrag.modelYearTo ?? null,
      marketRegion: eintrag.marketRegion ?? null,
      surchargeCents: eintrag.surchargeCents ?? null,
      surchargeCurrency: eintrag.surchargeCurrency ?? null,
      note: eintrag.note ?? null,
      dataQuality: gueteNachPruefung(eintrag.dataQuality, befunde),
      lastVerifiedAt: datumOderNull(eintrag.lastVerifiedAt),
    };

    const vorhanden = await prisma.optionAvailability.findFirst({
      where: {
        optionId: ausstattung,
        generationId: generation,
        trimLineId: null,
        powertrainId: null,
      },
      select: { id: true },
    });

    const gespeichert = vorhanden
      ? await prisma.optionAvailability.update({
          where: { id: vorhanden.id },
          data: daten,
          select: { id: true },
        })
      : await prisma.optionAvailability.create({
          data: { optionId: ausstattung, generationId: generation, ...daten },
          select: { id: true },
        });

    await schreibeQuellen(lauf, datei, 'OptionAvailability', gespeichert.id, eintrag.quellen);
    melde(lauf, 'Verfügbarkeit', schluessel, vorhanden ? 'AKTUALISIERT' : 'ANGELEGT', befunde);
  }
}

async function importiereBilder(lauf: Lauf, datei: ImportDatei): Promise<void> {
  for (const eintrag of datei.bilder) {
    const schluessel = `${eintrag.kind} ${eintrag.sourceUrl ?? eintrag.description.slice(0, 40)}`;

    const angaben = pruefeBildangaben({
      origin: eintrag.origin,
      sourceUrl: eintrag.sourceUrl,
      sourceTitle: eintrag.sourceTitle,
      author: eintrag.author,
      licence: eintrag.licence,
      description: eintrag.description,
      generatedByModel: eintrag.generatedByModel,
      generatedPrompt: eintrag.generatedPrompt,
    });

    const herkunft = pruefeHerkunftsart({
      origin: eintrag.origin,
      sourceType: eintrag.sourceType,
    });

    const befunde: Finding[] = [
      ...Object.entries(angaben).flatMap(([feld, meldungen]) =>
        meldungen.map((message) => ({
          severity: 'BLOCKER' as const,
          code: 'bild.angabe-fehlt',
          message,
          field: feld,
        })),
      ),
      ...Object.entries(herkunft).flatMap(([feld, meldungen]) =>
        meldungen.map((message) => ({
          severity: 'BLOCKER' as const,
          code: 'bild.herkunft-widerspruch',
          message,
          field: feld,
        })),
      ),
    ];

    /*
     * Ein Bild mit ungeklaertem Rechtsstand wird uebernommen, aber nicht
     * veroeffentlicht. Es abzulehnen waere falsch: Die Fundstelle ist
     * wertvoll, auch wenn die Nutzung noch zu klaeren ist.
     */
    if (eintrag.licenceStatus === 'UNCLEAR' || eintrag.licenceStatus === 'NOT_CLEARED') {
      befunde.push({
        severity: 'HINT',
        code: 'bild.lizenz-offen',
        message:
          'Der Rechtsstand ist nicht geklärt. Das Bild wird gespeichert, aber nicht angezeigt.',
        field: 'licenceStatus',
      });
    }

    if (istBlockiert(befunde)) {
      melde(lauf, 'Bild', schluessel, 'ABGELEHNT', befunde);
      continue;
    }

    const generation = eintrag.generationSlug
      ? await generationId(
          lauf,
          eintrag.herstellerSlug,
          eintrag.modellSlug ?? '',
          eintrag.generationSlug,
        )
      : null;

    if (eintrag.generationSlug && !generation) {
      melde(lauf, 'Bild', schluessel, 'ABGELEHNT', [
        {
          severity: 'BLOCKER',
          code: 'verweis.generation',
          message:
            'Die angegebene Generation gibt es nicht. Ein Bild ohne gültige Zuordnung wäre ' +
            'schlimmer als kein Bild — es würde bei irgendeinem Fahrzeug auftauchen.',
        },
      ]);
      continue;
    }

    const ausstattung = eintrag.ausstattungSlug
      ? lauf.ausstattungen.get(`${eintrag.herstellerSlug}/${eintrag.ausstattungSlug}`) ?? null
      : null;

    if (lauf.probelauf || generation === PROBE_ID) {
      melde(lauf, 'Bild', schluessel, 'ANGELEGT', befunde);
      continue;
    }

    const facelift =
      eintrag.faceliftSlug && eintrag.modellSlug && eintrag.generationSlug
        ? lauf.facelifts.get(
            `${eintrag.herstellerSlug}/${eintrag.modellSlug}/${eintrag.generationSlug}/${eintrag.faceliftSlug}`,
          ) ?? null
        : null;

    const daten = {
      kind: eintrag.kind,
      origin: eintrag.origin,
      sourceType: eintrag.sourceType,
      licenceStatus: eintrag.licenceStatus,
      background: eintrag.background,
      generationId: generation,
      faceliftPhaseId: facelift && facelift !== PROBE_ID ? facelift : null,
      optionId: ausstattung && ausstattung !== PROBE_ID ? ausstattung : null,
      yearFrom: eintrag.yearFrom ?? null,
      yearTo: eintrag.yearTo ?? null,
      sourceUrl: eintrag.sourceUrl ?? null,
      sourceTitle: eintrag.sourceTitle ?? null,
      author: eintrag.author ?? null,
      licence: eintrag.licence,
      licenceUrl: eintrag.licenceUrl ?? null,
      generatedByModel: eintrag.generatedByModel ?? null,
      generatedPrompt: eintrag.generatedPrompt ?? null,
      generatedAt: eintrag.origin === 'AI_GENERATED' ? new Date() : null,
      description: eintrag.description,
      storageKey: eintrag.storageKey ?? null,
      dataQuality: gueteNachPruefung(eintrag.dataQuality, befunde),
      lastVerifiedAt: datumOderNull(eintrag.lastVerifiedAt),
    };

    /*
     * Dasselbe Bild zweimal am selben Eintrag waere eine Dublette in der
     * Galerie. Der Vergleich laeuft ueber Fundstelle und Zuordnung.
     */
    const vorhanden = eintrag.sourceUrl
      ? await prisma.catalogImage.findFirst({
          where: {
            sourceUrl: eintrag.sourceUrl,
            generationId: generation,
            optionId: daten.optionId,
          },
          select: { id: true },
        })
      : null;

    const gespeichert = vorhanden
      ? await prisma.catalogImage.update({
          where: { id: vorhanden.id },
          data: daten,
          select: { id: true },
        })
      : await prisma.catalogImage.create({ data: daten, select: { id: true } });

    await schreibeQuellen(lauf, datei, 'CatalogImage', gespeichert.id, eintrag.quellen);
    melde(lauf, 'Bild', schluessel, vorhanden ? 'AKTUALISIERT' : 'ANGELEGT', befunde);
  }
}

async function importiereHsnTsn(lauf: Lauf, datei: ImportDatei): Promise<void> {
  for (const eintrag of datei.hsnTsn) {
    const schluessel = `${eintrag.hsn}/${eintrag.tsn}`;

    const generation =
      eintrag.herstellerSlug && eintrag.modellSlug && eintrag.generationSlug
        ? await generationId(
            lauf,
            eintrag.herstellerSlug,
            eintrag.modellSlug,
            eintrag.generationSlug,
          )
        : null;

    if (lauf.probelauf || generation === PROBE_ID) {
      melde(lauf, 'HSN/TSN', schluessel, 'ANGELEGT', []);
      continue;
    }

    const daten = {
      manufacturerName: eintrag.manufacturerName,
      generationId: generation,
      yearFrom: eintrag.yearFrom ?? null,
      yearTo: eintrag.yearTo ?? null,
      note: eintrag.note ?? null,
      dataQuality: eintrag.dataQuality,
      lastVerifiedAt: datumOderNull(eintrag.lastVerifiedAt),
    };

    const gespeichert = await prisma.hsnTsnEntry.upsert({
      where: {
        hsn_tsn_typeName: {
          hsn: eintrag.hsn,
          tsn: eintrag.tsn,
          typeName: eintrag.typeName,
        },
      },
      update: daten,
      create: { hsn: eintrag.hsn, tsn: eintrag.tsn, typeName: eintrag.typeName, ...daten },
      select: { id: true, createdAt: true, updatedAt: true },
    });

    await schreibeQuellen(lauf, datei, 'HsnTsnEntry', gespeichert.id, eintrag.quellen);
    melde(
      lauf,
      'HSN/TSN',
      schluessel,
      gespeichert.createdAt.getTime() === gespeichert.updatedAt.getTime()
        ? 'ANGELEGT'
        : 'AKTUALISIERT',
      [],
    );
  }
}
