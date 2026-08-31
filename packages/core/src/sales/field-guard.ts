/**
 * Feld-Guard: Was die KI sehen darf -- und was nicht.
 *
 * Der MASTERPLAN verlangt eine serverseitige Whitelist und ausdruecklich
 * KEINE Prompt-Disziplin. Der Unterschied ist wesentlich:
 *
 * Eine Anweisung im Prompt ("verwende nur die folgenden Angaben") ist eine
 * Bitte an ein Sprachmodell. Sie kann durch eingeschleusten Text ausgehebelt
 * werden, und sie schuetzt nicht davor, dass ein Feld versehentlich in den
 * Kontext geraet. Eine Whitelist im Code kann das nicht: Was nicht in der
 * Liste steht, wird gar nicht erst zusammengebaut.
 *
 * Drei Dinge erreicht der Guard:
 *
 *  1. KEINE ERFUNDENEN DATEN (C3): Nur bestaetigte Katalogwerte und Angaben
 *     der verkaufenden Person gehen hinein. Was fehlt, fehlt auch im Kontext
 *     -- das Modell kann es dann nicht "ergaenzen".
 *  2. DATENSPARSAMKEIT: VIN, Name, E-Mail und Kennungen bleiben draussen.
 *     Der Text wird davon nicht besser, das Risiko aber groesser.
 *  3. NACHVOLLZIEHBARKEIT: Der Kontext ist eine schlichte Datenstruktur und
 *     laesst sich in einem Test vollstaendig pruefen.
 */

/** Zustand eines Fahrzeugs in Worten, wie er im Text erscheinen soll. */
export const CONDITION_LABELS: Record<string, string> = {
  EXCELLENT: 'sehr gut',
  GOOD: 'gut',
  FAIR: 'gebrauchsspurig',
  POOR: 'reparaturbedürftig',
};

export const SERVICE_HISTORY_LABELS: Record<string, string> = {
  FULL_MANUFACTURER: 'Scheckheft lückenlos beim Hersteller',
  FULL_INDEPENDENT: 'Scheckheft lückenlos in freier Werkstatt',
  PARTIAL: 'Scheckheft teilweise geführt',
  NONE: 'kein Scheckheft vorhanden',
  UNKNOWN: 'Servicehistorie unbekannt',
};

/**
 * Der vollstaendige Kontext, den die KI bekommt. Mehr gibt es nicht --
 * dieser Typ ist die Whitelist.
 */
export interface AiListingContext {
  /** Bestaetigte Katalogangaben. */
  vehicle: {
    manufacturer: string;
    model: string;
    generation: string;
    generationCode?: string;
    bodyType?: string;
    trimLine?: string;
    engineName?: string;
    fuelType?: string;
    transmission?: string;
    driveType?: string;
    powerKw?: number;
    powerPs?: number;
    displacementLitres?: number;
    buildPeriod?: string;
  };
  /** Angaben der verkaufenden Person. */
  vehicleFacts: {
    mileageKm?: number;
    firstRegistration?: string;
    previousOwners?: number;
    huValidUntil?: string;
    serviceHistory?: string;
    condition?: string;
    tyreCondition?: string;
    damages?: string;
    hadAccident?: boolean;
    accidentDetails?: string;
    additionalNotes?: string;
  };
  /** Bestaetigte Sonderausstattung, nur Namen. */
  equipment: string[];
  /**
   * Angaben, die ausdruecklich fehlen. Wird mitgegeben, damit das Modell
   * weiss, worueber es NICHT schreiben darf -- statt die Luecke zu fuellen.
   */
  missingFields: string[];
}

/** Rohdaten des Entwurfs, wie sie aus der Datenbank kommen. */
export interface DraftForContext {
  mileageKm: number | null;
  firstRegistration: Date | null;
  previousOwners: number | null;
  huValidUntil: Date | null;
  serviceHistory: string | null;
  condition: string | null;
  tyreCondition: string | null;
  damages: string | null;
  hadAccident: boolean | null;
  accidentDetails: string | null;
  additionalNotes: string | null;
  catalogConfirmedAt: Date | null;
}

export interface CatalogForContext {
  manufacturerName: string;
  modelName: string;
  generationName: string;
  generationCode: string | null;
  bodyTypeName: string | null;
  trimLineName: string | null;
  engineName: string | null;
  engineCode: string | null;
  fuelTypeLabel: string | null;
  transmissionLabel: string | null;
  driveTypeLabel: string | null;
  powerKw: number | null;
  displacementCcm: number | null;
  buildPeriod: string | null;
  equipmentNames: string[];
}

const PFLICHTANGABEN: { schluessel: keyof DraftForContext; bezeichnung: string }[] = [
  { schluessel: 'mileageKm', bezeichnung: 'Kilometerstand' },
  { schluessel: 'firstRegistration', bezeichnung: 'Erstzulassung' },
  { schluessel: 'previousOwners', bezeichnung: 'Zahl der Vorbesitzer' },
  { schluessel: 'huValidUntil', bezeichnung: 'HU gültig bis' },
  { schluessel: 'serviceHistory', bezeichnung: 'Servicehistorie' },
  { schluessel: 'condition', bezeichnung: 'Zustand' },
];

function datum(value: Date | null): string | undefined {
  return value ? value.toISOString().slice(0, 10) : undefined;
}

/**
 * Baut den KI-Kontext.
 *
 * Nimmt bewusst die ganzen Rohdaten entgegen und gibt nur die erlaubten
 * Felder zurueck. Andersherum -- die Aufrufstelle stellt zusammen, was sie
 * fuer richtig haelt -- waere der Guard wirkungslos.
 */
export function buildAiListingContext(
  draft: DraftForContext,
  catalog: CatalogForContext,
): AiListingContext {
  const fehlend = PFLICHTANGABEN.filter(
    (angabe) => draft[angabe.schluessel] === null || draft[angabe.schluessel] === undefined,
  ).map((angabe) => angabe.bezeichnung);

  return {
    vehicle: {
      manufacturer: catalog.manufacturerName,
      model: catalog.modelName,
      generation: catalog.generationName,
      ...(catalog.generationCode ? { generationCode: catalog.generationCode } : {}),
      ...(catalog.bodyTypeName ? { bodyType: catalog.bodyTypeName } : {}),
      ...(catalog.trimLineName ? { trimLine: catalog.trimLineName } : {}),
      ...(catalog.engineName ? { engineName: catalog.engineName } : {}),
      ...(catalog.fuelTypeLabel ? { fuelType: catalog.fuelTypeLabel } : {}),
      ...(catalog.transmissionLabel ? { transmission: catalog.transmissionLabel } : {}),
      ...(catalog.driveTypeLabel ? { driveType: catalog.driveTypeLabel } : {}),
      ...(catalog.powerKw !== null
        ? { powerKw: catalog.powerKw, powerPs: Math.round((catalog.powerKw * 1000) / 735.49875) }
        : {}),
      ...(catalog.displacementCcm !== null
        ? { displacementLitres: Math.round(catalog.displacementCcm / 100) / 10 }
        : {}),
      ...(catalog.buildPeriod ? { buildPeriod: catalog.buildPeriod } : {}),
    },
    vehicleFacts: {
      ...(draft.mileageKm !== null ? { mileageKm: draft.mileageKm } : {}),
      ...(datum(draft.firstRegistration) ? { firstRegistration: datum(draft.firstRegistration) } : {}),
      ...(draft.previousOwners !== null ? { previousOwners: draft.previousOwners } : {}),
      ...(datum(draft.huValidUntil) ? { huValidUntil: datum(draft.huValidUntil) } : {}),
      ...(draft.serviceHistory
        ? { serviceHistory: SERVICE_HISTORY_LABELS[draft.serviceHistory] ?? draft.serviceHistory }
        : {}),
      ...(draft.condition
        ? { condition: CONDITION_LABELS[draft.condition] ?? draft.condition }
        : {}),
      ...(draft.tyreCondition ? { tyreCondition: draft.tyreCondition } : {}),
      ...(draft.damages ? { damages: draft.damages } : {}),
      ...(draft.hadAccident !== null ? { hadAccident: draft.hadAccident } : {}),
      ...(draft.accidentDetails ? { accidentDetails: draft.accidentDetails } : {}),
      ...(draft.additionalNotes ? { additionalNotes: draft.additionalNotes } : {}),
    },
    equipment: catalog.equipmentNames,
    missingFields: fehlend,
  };
}

/**
 * Felder, die niemals in den KI-Kontext gehoeren.
 *
 * Steht hier ausdruecklich als Liste, damit ein Test darauf prüfen kann --
 * und damit beim Erweitern des Kontexts jemand daran vorbeikommen muss.
 */
export const NIEMALS_AN_DIE_KI = [
  'vin',
  'vinHash',
  'ownerId',
  'owner',
  'email',
  'displayName',
  'id',
  'userId',
  'ipHash',
  // Katalogkennungen. Sie stehen seit der Bewertung im Entwurfsdatensatz
  // (die Marktabfrage braucht sie), haben im KI-Kontext aber nichts zu
  // suchen: Die KI schreibt ueber ein Fahrzeug, nicht ueber Datenbankzeilen.
  'generationId',
  'powertrainId',
  'manufacturerId',
  'modelId',
  'trimLineId',
] as const;
