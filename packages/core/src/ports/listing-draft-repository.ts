import type { CatalogForContext, DraftForContext } from '../sales/field-guard';

/**
 * Zugriff auf Verkaufsentwuerfe, soweit die Domaenenschicht ihn braucht.
 */

export interface ListingDraftRecord extends DraftForContext {
  id: string;
  ownerId: string;
  status: string;
  /** Zeitpunkt der letzten Aenderung. Bestimmt die Vorgangskennung. */
  updatedAt: Date;

  /*
   * Die bestaetigte Zuordnung als Kennungen. Sie stehen hier und nicht in
   * CatalogForContext: Der Katalogkontext geht an die KI, und dort haben
   * Kennungen nichts verloren (siehe sales/field-guard.ts). Die Bewertung
   * dagegen braucht sie, um Vergleichsangebote zu suchen.
   */
  generationId: string | null;
  powertrainId: string | null;

  /** Bereits erzeugte Texte, falls vorhanden. */
  generatedTitle: string | null;
  generatedShortText: string | null;
  generatedLongText: string | null;
  generatedClassifiedText: string | null;
  generatedAt: Date | null;
  generationModel: string | null;

  /** Die zuletzt gespeicherte Bewertung, roh. Wird beim Lesen geprueft. */
  valuationJson: unknown;
  valuedAt: Date | null;
  valuationAssumptionsId: string | null;
}

export interface ListingDraftRepository {
  findById(draftId: string): Promise<ListingDraftRecord | null>;

  /**
   * Laedt die bestaetigten Katalogangaben eines Entwurfs.
   * Gibt null zurueck, wenn die Zuordnung fehlt oder unvollstaendig ist.
   */
  loadCatalogContext(draftId: string): Promise<CatalogForContext | null>;

  /**
   * Speichert eine bezahlte Bewertung.
   *
   * Sie wird abgelegt, weil sie Guthaben gekostet hat: Wer dafuer bezahlt
   * hat, soll sie wiedersehen koennen, ohne erneut zu zahlen.
   */
  saveValuation(
    draftId: string,
    valuation: unknown,
    assumptionsId: string,
    valuedAt: Date,
  ): Promise<void>;

  saveGeneratedTexts(
    draftId: string,
    texts: {
      title: string;
      shortText: string;
      longText: string;
      classifiedText: string;
      model: string;
    },
    generatedAt: Date,
  ): Promise<void>;
}
