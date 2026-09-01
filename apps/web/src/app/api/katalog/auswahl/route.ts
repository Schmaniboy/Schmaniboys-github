import { z } from 'zod';

import { katalogAuswahl } from '@ap/db';

import { ok, route } from '@/lib/api';

const abfrage = z.object({
  ebene: z.enum(['modelle', 'generationen', 'antriebe', 'linien']),
  eltern: z.string().min(1),
});

export const GET = route(
  async (context) => {
    const { ebene, eltern } = context.query(abfrage);
    return ok({ options: await katalogAuswahl(ebene, eltern) });
  },
  { auth: 'required', rateLimit: { limit: 120, windowSeconds: 60, scope: 'katalog:auswahl', perUser: true } },
);
