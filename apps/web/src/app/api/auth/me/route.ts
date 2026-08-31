import { permissionsOf } from '@ap/core';

import { ok, route } from '@/lib/api';

/**
 * Auskunft ueber die eigene Sitzung.
 *
 * Die mitgelieferte Rechteliste dient dem Frontend ausschliesslich zum Ein-
 * und Ausblenden. Erlaubt wird nie hierdurch, sondern immer serverseitig.
 *
 * Ohne Sitzung ist die Antwort `user: null` mit den Rechten eines Gastes --
 * kein 401. "Wer bin ich" ist eine Frage, die auch fuer Nichtangemeldete eine
 * richtige Antwort hat; die Kopfzeile stellt sie auf jeder Seite.
 */
export const GET = route(
  async (context) =>
    ok({
      user: context.user ?? null,
      permissions: [...permissionsOf(context.principal?.role ?? null)],
    }),
  { auth: 'optional' },
);
