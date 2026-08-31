import { z } from 'zod';

import { systemClock, vehicleConfirmationInput } from '@ap/core';
import { confirmVehicle } from '@ap/db';

import { ok, route } from '@/lib/api';

const pfad = z.object({ id: z.string().min(1) });

/**
 * Bestaetigung der Fahrzeugzuordnung.
 *
 * Das ist der Schritt, den Blocker B7 erzwingt: Aus der VIN allein ist das
 * Fahrzeug nicht bestimmbar, also waehlt die verkaufende Person aus
 * tatsaechlich vorhandenen Katalogeintraegen aus und bestaetigt.
 *
 * Die Kette wird serverseitig geprueft -- Modell zum Hersteller, Generation
 * zum Modell, Motorvariante zur Generation. Sonst liesse sich ein Fahrzeug
 * zusammensetzen, das es nie gab.
 */
export const PATCH = route(
  async (context) => {
    const { id } = await context.params(pfad);
    const auswahl = await context.body(vehicleConfirmationInput);

    await confirmVehicle(
      id,
      context.userId(),
      auswahl,
      systemClock.now(),
    );

    return ok({ confirmed: true });
  },
  { auth: 'required' },
);
