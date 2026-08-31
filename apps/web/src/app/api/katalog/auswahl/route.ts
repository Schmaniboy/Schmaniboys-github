import { z } from 'zod';

import { prisma } from '@ap/db';

import { ok, route } from '@/lib/api';

/**
 * Auswahllisten fuer die gefuehrte Fahrzeugbestimmung.
 *
 * Liefert immer nur die naechste Ebene, und immer nur veroeffentlichte
 * Eintraege. Damit waehlt die verkaufende Person aus tatsaechlich
 * vorhandenen Katalogeintraegen -- nicht aus Vorschlaegen eines
 * Ratealgorithmus.
 */

const abfrage = z.object({
  ebene: z.enum(['modelle', 'generationen', 'antriebe', 'linien']),
  eltern: z.string().min(1),
});

const VEROEFFENTLICHT = { status: 'PUBLISHED' } as const;

export const GET = route(
  async (context) => {
    const { ebene, eltern } = context.query(abfrage);

    switch (ebene) {
      case 'modelle':
        return ok({
          options: await prisma.model.findMany({
            where: { manufacturerId: eltern, ...VEROEFFENTLICHT },
            orderBy: { name: 'asc' },
            select: { id: true, name: true },
          }),
        });

      case 'generationen': {
        const rows = await prisma.generation.findMany({
          where: { modelId: eltern, ...VEROEFFENTLICHT },
          orderBy: { yearFrom: 'desc' },
          select: { id: true, name: true, code: true, yearFrom: true, yearTo: true },
        });
        return ok({
          options: rows.map((row) => ({
            id: row.id,
            name: [row.name, row.code, `${row.yearFrom}–${row.yearTo ?? 'heute'}`]
              .filter(Boolean)
              .join(' · '),
          })),
        });
      }

      case 'antriebe': {
        const rows = await prisma.powertrainCombination.findMany({
          where: { generationId: eltern, ...VEROEFFENTLICHT },
          orderBy: { powerKw: 'desc' },
          select: {
            id: true,
            powerKw: true,
            driveType: true,
            engine: { select: { name: true, powerKw: true } },
            transmission: { select: { name: true } },
          },
        });
        return ok({
          options: rows.map((row) => ({
            id: row.id,
            name: [
              row.engine.name,
              row.powerKw ?? row.engine.powerKw ? `${row.powerKw ?? row.engine.powerKw} kW` : null,
              row.transmission.name,
            ]
              .filter(Boolean)
              .join(' · '),
          })),
        });
      }

      case 'linien':
        return ok({
          options: await prisma.trimLine.findMany({
            where: { generationId: eltern, ...VEROEFFENTLICHT },
            orderBy: { name: 'asc' },
            select: { id: true, name: true },
          }),
        });
    }
  },
  { auth: 'required', rateLimit: { limit: 120, windowSeconds: 60, scope: 'katalog:auswahl', perUser: true } },
);
