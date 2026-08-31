import {
  Permission,
  errors,
  openingHoursInput,
  pruefeZeitspannen,
  requireSameDealer,
  uhrzeitZuMinuten,
} from '@ap/core';
import { findDealer, replaceOpeningHours } from '@ap/db';

import { ok, route } from '@/lib/api';

/**
 * Oeffnungszeiten setzen.
 *
 * Die Zeiten werden vollstaendig ersetzt: Sie sind ein zusammenhaengender
 * Satz. "Dienstag streichen" waere sonst eine eigene Operation mit eigenen
 * Fehlerquellen.
 */
export const PUT = route(
  async (context) => {
    const dealerId = context.principal?.dealerId;
    requireSameDealer(context.principal, dealerId);

    const { spannen } = await context.body(openingHoursInput);

    const umgerechnet = spannen.map((spanne) => {
      const von = uhrzeitZuMinuten(spanne.von);
      const bis = uhrzeitZuMinuten(spanne.bis);
      if (von === null || bis === null) {
        throw errors.validation({ spannen: ['Bitte Uhrzeiten im Format 08:30 angeben.'] });
      }
      return { weekday: spanne.weekday, opensMinute: von, closesMinute: bis };
    });

    // Fachliche Pruefung in der Domaenenschicht, nicht hier.
    pruefeZeitspannen(umgerechnet);

    await replaceOpeningHours(dealerId as string, umgerechnet);
    const haendler = await findDealer(dealerId as string);
    return ok({ openingHours: haendler?.openingHours ?? [] });
  },
  {
    permission: Permission.DEALER_MANAGE_OWN,
    rateLimit: { limit: 60, windowSeconds: 3600, scope: 'haendler:zeiten', perUser: true },
  },
);
