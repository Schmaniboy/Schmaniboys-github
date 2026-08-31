import { z } from 'zod';

import { ALL_CATALOG_SUBJECTS, Permission, addSource, removeSource } from '@ap/core';
import { catalogRepository } from '@ap/db';

import { created, noContent, ok, route } from '@/lib/api';
import { catalogDeps } from '@/lib/catalog-deps';

/**
 * Quellen eines Katalogeintrags.
 *
 * Ohne Quelle keine Veroeffentlichung (Vorgabe C3). Deshalb sind Quellen
 * kein Beiwerk, sondern ein eigener Endpunkt mit eigenem Recht.
 */

const pfad = z.object({
  subject: z.enum(ALL_CATALOG_SUBJECTS as unknown as [string, ...string[]]),
  id: z.string().min(1),
});

type Subject = (typeof ALL_CATALOG_SUBJECTS)[number];

export const GET = route(
  async (context) => {
    const { subject, id } = await context.params(pfad);
    return ok({ sources: await catalogRepository.listSources(subject as Subject, id) });
  },
  { permission: Permission.CATALOG_WRITE },
);

export const POST = route(
  async (context) => {
    const { subject, id } = await context.params(pfad);
    const quelle = await addSource(
      catalogDeps,
      context.principal,
      subject as Subject,
      id,
      await context.body(z.object({}).passthrough()),
    );
    return created({ source: quelle });
  },
  { auth: 'required' },
);

export const DELETE = route(
  async (context) => {
    const { subject, id } = await context.params(pfad);
    const { quelle } = context.query(z.object({ quelle: z.string().min(1) }));
    await removeSource(catalogDeps, context.principal, subject as Subject, id, quelle);
    return noContent();
  },
  { auth: 'required' },
);
