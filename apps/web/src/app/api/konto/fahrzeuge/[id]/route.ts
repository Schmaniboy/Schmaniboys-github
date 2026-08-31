import { z } from 'zod';

import { deleteUserVehicle, getUserVehicle, updateUserVehicle } from '@ap/db';

import { noContent, ok, route } from '@/lib/api';

/**
 * Ein einzelnes eigenes Fahrzeug.
 *
 * Ein fremdes ergibt "nicht gefunden", nicht "verboten" -- die Pruefung
 * steht in der Datenschicht, damit sie hier nicht vergessen werden kann.
 */
const pfad = z.object({ id: z.string().min(1).max(40) });

const aenderung = z.object({
  label: z.string().trim().min(1).max(80).optional(),
  generationId: z.string().min(1).nullish(),
  faceliftPhaseId: z.string().min(1).nullish(),
  powertrainId: z.string().min(1).nullish(),
  paintColorId: z.string().min(1).nullish(),
  vinConfirmedByOwner: z.boolean().optional(),
  modelYear: z.number().int().min(1886).max(2100).nullish(),
  firstRegistrationOn: z.coerce.date().nullish(),
  mileageKm: z.number().int().min(0).max(3_000_000).nullish(),
  note: z.string().trim().max(2000).nullish(),
});

export const GET = route(
  async (context) => {
    const { id } = await context.params(pfad);
    return ok({ fahrzeug: await getUserVehicle(context.userId(), id) });
  },
  { auth: 'required' },
);

export const PATCH = route(
  async (context) => {
    const { id } = await context.params(pfad);
    const input = await context.body(aenderung);
    return ok({ fahrzeug: await updateUserVehicle(context.userId(), id, input) });
  },
  {
    auth: 'required',
    rateLimit: { limit: 60, windowSeconds: 3600, scope: 'konto:fahrzeug:aendern', perUser: true },
  },
);

export const DELETE = route(
  async (context) => {
    const { id } = await context.params(pfad);
    await deleteUserVehicle(context.userId(), id);
    return noContent();
  },
  { auth: 'required' },
);
