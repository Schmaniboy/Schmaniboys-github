import { CatalogSubject, Permission, knowledgeNoteInput } from '@ap/core';
import { assertExists, createKnowledgeNote } from '@ap/db';

import { created, route } from '@/lib/api';

export const POST = route(
  async (context) => {
    const input = await context.body(knowledgeNoteInput);
    await assertExists(CatalogSubject.GENERATION, input.generationId, 'generationId');

    return created({ note: await createKnowledgeNote(input) });
  },
  { permission: Permission.CATALOG_WRITE },
);
