import {
  UnavailableMarketData,
  type SalesAssistantDeps,
  type ValuationDeps,
  systemClock,
} from '@ap/core';
import { auditLogger, listingDraftRepository, walletRepository } from '@ap/db';

import { AnthropicTextGenerator } from './ai/anthropic';

/**
 * Verdrahtung des Verkaufsassistenten.
 *
 * Der Textgenerator wird genau einmal gebaut. Er meldet ueber `isAvailable`
 * selbst, ob ein Zugang eingerichtet ist -- ohne Zugang bleibt der ganze
 * Ablauf davor trotzdem nutzbar.
 */
export const salesDeps: SalesAssistantDeps = {
  drafts: listingDraftRepository,
  generator: new AnthropicTextGenerator(),
  wallets: walletRepository,
  clock: systemClock,
  audit: auditLogger,
};

/**
 * Verdrahtung der Fahrzeugbewertung.
 *
 * Die Marktdatenquelle ist bewusst die Ersatzvariante: Es ist keine Quelle
 * festgelegt (offener Punkt B4). Die Bewertung laeuft trotzdem -- sie gibt
 * die Faktorenanalyse aus, nennt keinen Eurobetrag und bucht nichts ab.
 * Sobald eine Quelle feststeht, wird hier eine Zeile ausgetauscht.
 */
export const valuationDeps: ValuationDeps = {
  drafts: listingDraftRepository,
  market: new UnavailableMarketData(),
  wallets: walletRepository,
  clock: systemClock,
  audit: auditLogger,
};
