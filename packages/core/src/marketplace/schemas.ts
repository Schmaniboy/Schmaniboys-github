import { z } from 'zod';


/**
 * Eingaben fuer Anzeigen.
 *
 * Zwei Dinge unterscheiden eine Anzeige von einem Entwurf: Sie hat einen
 * Preis, und sie ist oeffentlich. Beides schlaegt sich hier nieder --
 * strengere Pflichtfelder und keine Adresse feiner als der Ort.
 */

/** Preis in Cent. Die Obergrenze verhindert Tippfehler mit drei Nullen zu viel. */
export const preisCents = z
  .number()
  .int('Der Preis muss in ganzen Cent angegeben werden.')
  .min(1_00, 'Ein Preis unter einem Euro ist keine Angabe, sondern ein Versehen.')
  .max(50_000_000_00, 'Bitte den Preis prüfen.');

/**
 * Postleitzahl.
 *
 * Bewusst ohne Laenderlogik: Fuenf Ziffern deckt Deutschland ab, mehr ist
 * derzeit nicht zugesagt. Eine erfundene Pruefung fuer andere Laender waere
 * schlimmer als keine.
 */
export const postleitzahl = z
  .string()
  .trim()
  .regex(/^\d{5}$/, 'Bitte eine fünfstellige Postleitzahl angeben.');

export const listingTitle = z
  .string()
  .trim()
  .min(10, 'Der Titel sollte das Fahrzeug erkennbar machen.')
  .max(120, 'Der Titel ist zu lang für Trefferlisten.');

export const listingDescription = z
  .string()
  .trim()
  .min(50, 'Eine Beschreibung unter 50 Zeichen hilft Kaufinteressenten nicht.')
  .max(10_000);

/** Anzeige aus einem bestaetigten Verkaufsentwurf erzeugen. */
export const createListingInput = z.object({
  draftId: z.string().min(1),
  title: listingTitle,
  description: listingDescription,
  priceCents: preisCents,
  negotiable: z.boolean().default(false),
  postalCode: postleitzahl,
  city: z.string().trim().min(2).max(100),
  /** Im Namen eines Haendlers inserieren. Wird serverseitig geprueft. */
  dealerId: z.string().min(1).optional(),
});

export const updateListingInput = z.object({
  title: listingTitle.optional(),
  description: listingDescription.optional(),
  priceCents: preisCents.optional(),
  negotiable: z.boolean().optional(),
  postalCode: postleitzahl.optional(),
  city: z.string().trim().min(2).max(100).optional(),
});

export const listingStatusInput = z.object({
  status: z.enum(['ACTIVE', 'PAUSED', 'SOLD', 'DELETED']),
});

export const imageOrderInput = z.object({
  /** Kennungen in der gewuenschten Reihenfolge. Das erste ist das Vorschaubild. */
  imageIds: z.array(z.string().min(1)).min(1).max(20),
});

export const imageAltInput = z.object({
  altText: z.string().trim().max(300).nullable(),
});

/**
 * Ein leeres Feld ist kein Filter.
 *
 * Ein gewoehnliches GET-Formular sendet ALLE Felder, auch die leeren:
 * `?q=&preisVon=5000&preisBis=`. Ohne diese Umwandlung scheitert die Pruefung
 * an `preisBis: ""`, und zwar fuer die gesamte Anfrage -- der eine gesetzte
 * Filter geht mit unter. In der Oberflaeche sieht das aus wie "Filter
 * ignoriert", an der Schnittstelle wie ein Fehler 400. Beides ist falsch:
 * Nichts eingetragen heisst nicht gefiltert.
 */
const leerAlsFehlend = <TSchema extends z.ZodTypeAny>(schema: TSchema) =>
  z.preprocess(
    (wert) => (typeof wert === 'string' && wert.trim() === '' ? undefined : wert),
    schema,
  );

/** Zahl aus einem Suchparameter. Query-Parameter sind immer Zeichenketten. */
const suchZahl = z.preprocess(
  (wert) => (typeof wert === 'string' && wert.trim() !== '' ? Number(wert) : wert),
  z.number().int().nonnegative(),
);

/**
 * Filter der Anzeigensuche.
 *
 * `preprocess` ist hier kein Zierrat: Ein `z.number()` auf einem
 * Query-Parameter schlaegt immer fehl, die Zod-Pruefung faellt still durch
 * und die Suche liefert ungefiltert alles. Genau dieser Fehler ist in der
 * Fahrzeugsuche schon einmal passiert.
 */
export const listingSearchInput = z.object({
  q: leerAlsFehlend(z.string().trim().min(2).max(120).optional()),
  manufacturerId: leerAlsFehlend(z.string().min(1).optional()),
  modelId: leerAlsFehlend(z.string().min(1).optional()),
  generationId: leerAlsFehlend(z.string().min(1).optional()),
  dealerId: leerAlsFehlend(z.string().min(1).optional()),
  preisVon: leerAlsFehlend(suchZahl.optional()),
  preisBis: leerAlsFehlend(suchZahl.optional()),
  kilometerBis: leerAlsFehlend(suchZahl.optional()),
  baujahrVon: leerAlsFehlend(suchZahl.optional()),
  baujahrBis: leerAlsFehlend(suchZahl.optional()),
  fuelType: leerAlsFehlend(z.string().min(1).optional()),
  nurUnfallfrei: z
    .preprocess((wert) => wert === 'true' || wert === true, z.boolean())
    .optional(),
  sortierung: leerAlsFehlend(
    z.enum(['neueste', 'preis-auf', 'preis-ab', 'kilometer-auf']).default('neueste'),
  ),
  seite: leerAlsFehlend(suchZahl.default(0)),
});

export type CreateListingInput = z.infer<typeof createListingInput>;
export type UpdateListingInput = z.infer<typeof updateListingInput>;
export type ListingSearchInput = z.infer<typeof listingSearchInput>;

