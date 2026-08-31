import { CatalogSubject, Permission, knownIssueInput } from '@ap/core';
import { assertExists, createKnownIssue } from '@ap/db';

import { created, route } from '@/lib/api';

/**
 * Bekannte Schwachstellen.
 *
 * Entsteht als Entwurf. Ob daraus je eine veroeffentlichte Aussage wird,
 * entscheidet der Belegcheck: Eine Einschaetzung ohne Begruendung und eine
 * belegte Angabe ohne belastbare Quelle kommen nicht durch.
 */
export const POST = route(
  async (context) => {
    const input = await context.body(knownIssueInput);
    await assertExists(CatalogSubject.GENERATION, input.generationId, 'generationId');

    return created({ issue: await createKnownIssue(input) });
  },
  { permission: Permission.CATALOG_WRITE },
);
