import { z } from 'zod';

import { ALL_CATALOG_SUBJECTS, changeStatus } from '@ap/core';

import { ok, route } from '@/lib/api';
import { catalogDeps } from '@/lib/catalog-deps';

/**
 * Statuswechsel eines Katalogeintrags.
 *
 * Welches Recht noetig ist, entscheidet das Ziel: Einreichen braucht
 * Schreibrecht, Veroeffentlichen und Zurueckziehen brauchen das
 * Freigaberecht. Diese Unterscheidung trifft `changeStatus` in core --
 * hier steht bewusst keine Rechtepruefung, sonst gaebe es zwei Stellen,
 * die dasselbe entscheiden.
 */

const pfad = z.object({
  subject: z.enum(ALL_CATALOG_SUBJECTS as unknown as [string, ...string[]]),
  id: z.string().min(1),
});

export const PATCH = route(
  async (context) => {
    const { subject, id } = await context.params(pfad);
    const ergebnis = await changeStatus(
      catalogDeps,
      context.principal,
      subject as (typeof ALL_CATALOG_SUBJECTS)[number],
      id,
      await context.body(z.object({}).passthrough()),
    );
    return ok(ergebnis);
  },
  // Die Sitzung wird gebraucht, das konkrete Recht prueft die Domaenenschicht.
  { auth: 'required' },
);
