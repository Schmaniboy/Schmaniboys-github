import { z } from 'zod';

import {
  MAX_FAHRZEUGE_JE_PERSON,
  createUserVehicle,
  listUserVehicles,
} from '@ap/db';
import { vin as vinSchema } from '@ap/core';

import { created, ok, route } from '@/lib/api';

/**
 * Die eigenen Fahrzeuge.
 *
 * Alles ist offen ausser der Bezeichnung. Ein Mensch, der sein Auto
 * eintraegt, weiss selten alles auf einmal -- und ein Formular, das
 * vollstaendige Angaben erzwingt, fuehrt dazu, dass geraten wird.
 */
const eingabe = z.object({
  label: z.string().trim().min(1).max(80),
  generationId: z.string().min(1).nullish(),
  faceliftPhaseId: z.string().min(1).nullish(),
  powertrainId: z.string().min(1).nullish(),
  paintColorId: z.string().min(1).nullish(),
  // Leeres Feld heisst "nicht angegeben", nicht "ungueltige VIN" -- sonst
  // scheitert das Formular an einem Feld, das niemand ausfuellen muss.
  vin: z.preprocess(
    (wert) => (typeof wert === 'string' && wert.trim().length === 0 ? undefined : wert),
    vinSchema.optional(),
  ),
  vinConfirmedByOwner: z.boolean().optional(),
  modelYear: z.number().int().min(1886).max(2100).nullish(),
  firstRegistrationOn: z.coerce.date().nullish(),
  mileageKm: z.number().int().min(0).max(3_000_000).nullish(),
  note: z.string().trim().max(2000).nullish(),
});

export const GET = route(
  async (context) => ok({ fahrzeuge: await listUserVehicles(context.userId()) }),
  { auth: 'required' },
);

export const POST = route(
  async (context) => {
    const input = await context.body(eingabe);
    return created({
      fahrzeug: await createUserVehicle(context.userId(), {
        label: input.label,
        generationId: input.generationId,
        faceliftPhaseId: input.faceliftPhaseId,
        powertrainId: input.powertrainId,
        paintColorId: input.paintColorId,
        vin: input.vin,
        vinConfirmedByOwner: input.vinConfirmedByOwner,
        modelYear: input.modelYear,
        firstRegistrationOn: input.firstRegistrationOn,
        mileageKm: input.mileageKm,
        note: input.note,
      }),
      grenze: MAX_FAHRZEUGE_JE_PERSON,
    });
  },
  {
    auth: 'required',
    /*
     * Die Obergrenze je Person begrenzt den Bestand, nicht die Zahl der
     * Versuche. Ohne diese Begrenzung liesse sich der Endpunkt beliebig oft
     * aufrufen -- jeder Aufruf zaehlt, prueft und schreibt.
     */
    rateLimit: { limit: 30, windowSeconds: 3600, scope: 'konto:fahrzeuge', perUser: true },
  },
);
