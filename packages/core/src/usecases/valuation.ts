import { requireOwnership, type Principal } from '../auth/access';
import { errors } from '../errors';
import type { AuditLogger } from '../ports/audit';
import type { Clock } from '../ports/clock';
import type { ListingDraftRepository } from '../ports/listing-draft-repository';
import type { MarketDataSource } from '../ports/market-data';
import type { WalletRepository } from '../ports/wallet-repository';
import { DEFAULT_ASSUMPTIONS, type ValuationAssumptions } from '../valuation/assumptions';
import { buildValuation, type Valuation } from '../valuation/estimate';
import { assessFactors } from '../valuation/factors';
import { TokenCost } from '../wallet/policy';

import { spendTokens } from './wallet';

/**
 * Die Fahrzeugbewertung.
 *
 * Zwei Dinge unterscheiden sie vom Verkaufsassistenten:
 *
 * 1. **Die Faktorenanalyse ist kostenlos.** Sie rechnet ausschliesslich mit
 *    den Angaben der verkaufenden Person -- Kilometer gegen Alter, Zustand,
 *    Historie. Dafuer Guthaben zu verlangen waere schwer zu begruenden.
 * 2. **Nur der Marktwert kostet.** Er braucht eine Marktdatenquelle, und
 *    die kostet Geld. Ist keine eingerichtet, wird auch nichts abgebucht --
 *    die Pruefung steht wie beim Verkaufsassistenten VOR der Reservierung.
 *
 * Was in keinem der beiden Faelle passiert: eine Zahl nennen, die nicht aus
 * Marktdaten stammt. Der Plan sagt dazu "Keine erfundenen Marktwerte", und
 * das ist hier woertlich gemeint.
 */

export interface ValuationDeps {
  drafts: ListingDraftRepository;
  market: MarketDataSource;
  wallets: WalletRepository;
  clock: Clock;
  audit: AuditLogger;
  /** Ueberschreibbar, damit sich die Annahmen versionieren lassen. */
  assumptions?: ValuationAssumptions;
}

export interface ValuationResult {
  valuation: Valuation;
  charged: number;
}

export async function valuateDraft(
  deps: ValuationDeps,
  principal: Principal | null,
  draftId: string,
): Promise<ValuationResult> {
  const entwurf = await deps.drafts.findById(draftId);
  // Wie ueberall: ein fremder Entwurf ist "nicht gefunden", nicht "verboten".
  const handelnde = requireOwnership(principal, entwurf?.ownerId);
  if (!entwurf) throw errors.notFound();

  if (!entwurf.catalogConfirmedAt) {
    throw errors.conflict(
      'Bitte zuerst das Fahrzeug bestätigen. Ohne bestätigte Zuordnung gäbe es keine ' +
        'Baureihe, mit der sich vergleichen ließe.',
    );
  }

  const annahmen = deps.assumptions ?? DEFAULT_ASSUMPTIONS;
  const jetzt = deps.clock.now();

  /*
   * Bereits bezahlt und seither unveraendert: die gespeicherte Bewertung
   * herausgeben, nichts abbuchen. Ohne diesen Zweig kostete jedes erneute
   * Oeffnen der Seite Guthaben -- oder die Buchung schluege fehl, weil die
   * Vorgangskennung schon vergeben ist.
   */
  const gespeichert = leseGespeicherteBewertung(entwurf, annahmen);
  if (gespeichert) return { valuation: gespeichert, charged: 0 };

  const faktoren = assessFactors(
    {
      mileageKm: entwurf.mileageKm,
      firstRegistration: entwurf.firstRegistration,
      previousOwners: entwurf.previousOwners,
      huValidUntil: entwurf.huValidUntil,
      serviceHistory: entwurf.serviceHistory,
      condition: entwurf.condition,
      tyreCondition: entwurf.tyreCondition,
      damages: entwurf.damages,
      hadAccident: entwurf.hadAccident,
      accidentDetails: entwurf.accidentDetails,
      additionalNotes: entwurf.additionalNotes,
      catalogConfirmedAt: entwurf.catalogConfirmedAt,
      now: jetzt,
    },
    annahmen,
  );

  const katalog = await deps.drafts.loadCatalogContext(draftId);
  if (!katalog) {
    throw errors.conflict(
      'Die bestätigte Fahrzeugzuordnung ist unvollständig. Bitte das Fahrzeug erneut bestätigen.',
    );
  }

  // Verfuegbarkeit VOR der Reservierung -- sonst zahlt jemand fuer eine
  // Abfrage, die gar nicht stattfinden kann.
  if (!deps.market.isAvailable()) {
    return {
      charged: 0,
      valuation: buildValuation({
        factorResult: faktoren,
        basis: null,
        assumptions: annahmen,
        now: jetzt,
        missingBasisReason:
          'Für Vergleichsangebote ist keine Datenquelle eingerichtet. Ein Marktwert in ' +
          'Euro ließe sich daraus nicht ableiten — es wurde kein Guthaben verbraucht.',
      }),
    };
  }

  const anfrage = {
    manufacturerName: katalog.manufacturerName,
    modelName: katalog.modelName,
    generationId: entwurf.generationId ?? '',
    powertrainId: entwurf.powertrainId ?? null,
    firstRegistrationYear: entwurf.firstRegistration?.getFullYear() ?? null,
    mileageKm: entwurf.mileageKm,
  };

  /*
   * Die Referenz enthaelt den Aenderungsstempel des Entwurfs UND die Kennung
   * der Annahmen. Dieselbe Bewertung zweimal anzufordern kostet einmal; eine
   * geaenderte Angabe oder geaenderte Annahmen fuehren zu einer neuen
   * Berechnung -- und damit zu einer neuen Buchung. Ohne die Annahmenkennung
   * verweigerte die Buchung den Dienst, weil die Vorgangskennung schon
   * vergeben waere.
   */
  const reference = `valuation:${draftId}:${entwurf.updatedAt.getTime()}:${annahmen.id}`;

  const buchung = await spendTokens(
    { wallets: deps.wallets, clock: deps.clock, audit: deps.audit },
    handelnde,
    { kind: TokenCost.VALUATION, reference },
    async () => {
      const grundwert = await deps.market.findBasis(anfrage);
      return buildValuation({
        factorResult: faktoren,
        basis: grundwert,
        assumptions: annahmen,
        now: jetzt,
        missingBasisReason:
          grundwert === null
            ? 'Zu dieser Baureihe liegen zu wenige Vergleichsangebote vor. Eine Zahl zu ' +
              'nennen hieße, sie zu erfinden.'
            : undefined,
      });
    },
  );

  if (buchung.charged > 0) {
    await deps.drafts.saveValuation(draftId, buchung.result, annahmen.id, jetzt);
  }

  return { valuation: buchung.result, charged: buchung.charged };
}

/**
 * Die gespeicherte Bewertung, sofern sie noch gilt.
 *
 * Sie gilt nicht mehr, wenn der Entwurf seither geaendert wurde -- eine
 * Bewertung zu einem alten Kilometerstand waere schlimmer als keine. Und
 * sie gilt nicht mehr, wenn inzwischen mit anderen Annahmen gerechnet wird;
 * sonst stuende neben dem Ergebnis eine Annahmenliste, mit der es nicht
 * zustande gekommen ist.
 */
function leseGespeicherteBewertung(
  entwurf: {
    valuationJson: unknown;
    valuedAt: Date | null;
    valuationAssumptionsId: string | null;
    updatedAt: Date;
  },
  annahmen: ValuationAssumptions,
): Valuation | null {
  if (!entwurf.valuedAt || !entwurf.valuationJson) return null;
  if (entwurf.valuedAt < entwurf.updatedAt) return null;
  if (entwurf.valuationAssumptionsId !== annahmen.id) return null;
  return belebeDatenWieder(entwurf.valuationJson as Valuation);
}

/**
 * Datumsangaben aus JSON zurueckholen.
 *
 * JSON kennt kein Datum. Ohne diesen Schritt kaeme aus der Datenbank eine
 * Zeichenkette dort zurueck, wo der Typ ein Date verspricht -- und der
 * Fehler faellt erst beim Formatieren auf.
 */
function belebeDatenWieder(roh: Valuation): Valuation {
  if (!roh.source) return roh;
  return {
    ...roh,
    source: {
      ...roh.source,
      observedFrom: new Date(roh.source.observedFrom),
      observedTo: new Date(roh.source.observedTo),
    },
  };
}
