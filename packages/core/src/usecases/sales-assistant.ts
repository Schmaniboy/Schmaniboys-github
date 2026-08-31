import { requireOwnership, type Principal } from '../auth/access';
import { errors } from '../errors';
import type { AuditLogger } from '../ports/audit';
import type { Clock } from '../ports/clock';
import type { ListingDraftRepository } from '../ports/listing-draft-repository';
import type { GeneratedListing, TextGenerator } from '../ports/text-generator';
import type { WalletRepository } from '../ports/wallet-repository';
import { buildAiListingContext, type AiListingContext } from '../sales/field-guard';
import { validateGeneratedTexts } from '../sales/prompt';
import { TokenCost } from '../wallet/policy';

import { spendTokens } from './wallet';

/**
 * Der Verkaufsassistent.
 *
 * Die Reihenfolge der Pruefungen ist hier nicht beliebig, sondern die
 * eigentliche Fachlogik:
 *
 *  1. Gehoert der Entwurf der anfragenden Person?
 *  2. Ist die Fahrzeugzuordnung BESTAETIGT? Ohne Bestaetigung wird nichts
 *     erzeugt -- sonst schriebe die KI ueber ein geratenes Fahrzeug.
 *  3. Ist der Dienst ueberhaupt verfuegbar? Diese Frage kommt VOR der
 *     Guthabenreservierung. Niemand soll fuer eine Funktion zahlen, die
 *     gar nicht laufen kann.
 *  4. Erst dann: reservieren, erzeugen, pruefen, buchen.
 */

export interface SalesAssistantDeps {
  drafts: ListingDraftRepository;
  generator: TextGenerator;
  wallets: WalletRepository;
  clock: Clock;
  audit: AuditLogger;
}

export interface GenerateResult {
  texts: GeneratedListing;
  charged: number;
  context: AiListingContext;
}

export async function generateListingTexts(
  deps: SalesAssistantDeps,
  principal: Principal | null,
  draftId: string,
): Promise<GenerateResult> {
  const entwurf = await deps.drafts.findById(draftId);
  // Ein fremder Entwurf antwortet mit NOT_FOUND, nicht mit FORBIDDEN --
  // sonst waere ueber die Fehlerantwort aufzaehlbar, welche Entwuerfe es gibt.
  const handelnde = requireOwnership(principal, entwurf?.ownerId);
  if (!entwurf) throw errors.notFound();

  if (!entwurf.catalogConfirmedAt) {
    throw errors.conflict(
      'Bitte zuerst das Fahrzeug bestätigen. Aus der Fahrzeug-Identifizierungsnummer ' +
        'allein lassen sich Modell, Generation und Motor nicht ableiten.',
    );
  }

  /*
   * Liegt bereits ein Text zum aktuellen Stand vor, wird er zurueckgegeben --
   * ohne erneute Abrechnung. Zweimal auf denselben Knopf zu druecken darf
   * nicht zweimal kosten, und es darf auch keine Fehlermeldung geben.
   */
  const bereitsErzeugt =
    entwurf.generatedAt !== null &&
    entwurf.generatedAt.getTime() >= entwurf.updatedAt.getTime() &&
    entwurf.generatedTitle !== null &&
    entwurf.generatedShortText !== null &&
    entwurf.generatedLongText !== null &&
    entwurf.generatedClassifiedText !== null;

  const katalog = await deps.drafts.loadCatalogContext(draftId);
  if (!katalog) {
    throw errors.conflict('Die Fahrzeugzuordnung ist unvollständig.');
  }

  if (bereitsErzeugt) {
    return {
      texts: {
        title: entwurf.generatedTitle as string,
        shortText: entwurf.generatedShortText as string,
        longText: entwurf.generatedLongText as string,
        classifiedText: entwurf.generatedClassifiedText as string,
        model: entwurf.generationModel ?? 'unbekannt',
      },
      charged: 0,
      context: buildAiListingContext(entwurf, katalog),
    };
  }

  /*
   * Verfuegbarkeit VOR der Reservierung pruefen. Andernfalls wuerde Guthaben
   * blockiert, der Aufruf scheiterte, und die Freigabe muesste es wieder
   * geraderuecken -- fuer die betroffene Person sichtbar und unnoetig.
   */
  if (!deps.generator.isAvailable()) {
    throw errors.notImplemented(
      'Die Texterzeugung ist noch nicht verfügbar. Ihre Angaben bleiben gespeichert.',
    );
  }

  const kontext = buildAiListingContext(entwurf, katalog);

  /*
   * Die Vorgangskennung enthaelt den Aenderungsstand des Entwurfs.
   * Zweimal auf denselben Knopf zu druecken kostet damit einmal; nach einer
   * Aenderung an den Angaben entsteht eine neue Kennung und damit ein neuer,
   * kostenpflichtiger Vorgang. Genau so herum ist es richtig.
   */
  const reference = `listing-text:${draftId}:${entwurf.updatedAt.getTime()}`;

  const ergebnis = await spendTokens(
    { wallets: deps.wallets, clock: deps.clock, audit: deps.audit },
    principal,
    { kind: TokenCost.AI_LISTING_TEXT, reference },
    async () => {
      const texte = await deps.generator.generateListing(kontext);

      /*
       * Pruefung INNERHALB der Handlung: Wirft sie, wird die Reservierung
       * freigegeben. Eine unbrauchbare Antwort kostet damit nichts.
       */
      const probleme = validateGeneratedTexts(texte);
      if (probleme.length > 0) {
        throw errors.internal(
          undefined,
          `Erzeugte Texte unbrauchbar: ${probleme
            .map((problem) => `${problem.field} ${problem.problem}`)
            .join(', ')}`,
        );
      }

      return texte;
    },
  );

  await deps.drafts.saveGeneratedTexts(
    draftId,
    {
      title: ergebnis.result.title,
      shortText: ergebnis.result.shortText,
      longText: ergebnis.result.longText,
      classifiedText: ergebnis.result.classifiedText,
      model: ergebnis.result.model,
    },
    deps.clock.now(),
  );

  await deps.audit.record({
    action: 'ai.invoked',
    actorId: handelnde.userId,
    subjectType: 'listingDraft',
    subjectId: draftId,
    metadata: {
      zweck: 'Verkaufstexte',
      tokens: ergebnis.charged,
      modell: ergebnis.result.model,
      fehlendeAngaben: kontext.missingFields.length,
    },
  });

  return { texts: ergebnis.result, charged: ergebnis.charged, context: kontext };
}
