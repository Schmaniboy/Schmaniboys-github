import { z } from 'zod';

import { draftDetailsInput } from '@ap/core';
import { updateDraftDetails } from '@ap/db';

import { ok, route } from '@/lib/api';

const pfad = z.object({ id: z.string().min(1) });

/**
 * Angaben der verkaufenden Person: Kilometerstand, Erstzulassung,
 * Vorbesitzer, HU, Servicehistorie, Zustand, Reifen, Schaeden, Unfall.
 *
 * Fast alles ist freiwillig. Wer eine Angabe nicht sicher weiss, soll sie
 * weglassen koennen -- weggelassene Angaben erreichen die KI gar nicht und
 * werden in der Anzeige als fehlend ausgewiesen.
 */
export const PATCH = route(
  async (context) => {
    const { id } = await context.params(pfad);
    const angaben = await context.body(draftDetailsInput);

    await updateDraftDetails(id, context.userId(), angaben);
    return ok({ saved: true });
  },
  { auth: 'required' },
);
