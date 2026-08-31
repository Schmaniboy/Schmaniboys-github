import { z } from 'zod';

import { KATALOG_MERKBARE_ARTEN, listKatalogMerkzettel, merkeKatalogeintrag } from '@ap/db';

import { ok, route } from '@/lib/api';

/**
 * Merkzettel fuer Katalogeintraege -- Motor, Fahrzeug, Ausstattung, Farbe.
 *
 * Ein Endpunkt zum Umschalten statt zweier: Der Knopf in der Oberflaeche
 * kennt nur einen Zustand und soll ihn wechseln koennen. Die Antwort sagt,
 * welcher Zustand jetzt gilt.
 */
const eingabe = z.object({
  subjectType: z.enum(KATALOG_MERKBARE_ARTEN),
  subjectId: z.string().min(1).max(40),
});

export const GET = route(
  async (context) => ok({ eintraege: await listKatalogMerkzettel(context.userId()) }),
  { auth: 'required' },
);

export const POST = route(
  async (context) => {
    const input = await context.body(eingabe);
    return ok(await merkeKatalogeintrag(context.userId(), input.subjectType, input.subjectId));
  },
  {
    auth: 'required',
    // Grosszuegig -- Merken ist eine haeufige Handlung -- aber nicht offen.
    rateLimit: { limit: 200, windowSeconds: 3600, scope: 'konto:merkzettel', perUser: true },
  },
);
