import { z } from 'zod';

import { errors } from '@ap/core';
import { findOwnDraft } from '@ap/db';

import { ok, route } from '@/lib/api';

const pfad = z.object({ id: z.string().min(1) });

/**
 * Ein einzelner Entwurf.
 *
 * Liefert die VIN mit -- sie gehoert der anfragenden Person und steht in
 * ihrer eigenen Anzeige. `findOwnDraft` verlangt die Kennung der besitzenden
 * Person, ein fremder Entwurf wird gar nicht erst gefunden.
 */
export const GET = route(
  async (context) => {
    const { id } = await context.params(pfad);
    const entwurf = await findOwnDraft(id, context.userId());
    if (!entwurf) throw errors.notFound();

    return ok({ draft: entwurf });
  },
  { auth: 'required' },
);
