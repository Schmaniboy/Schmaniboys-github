import { PrismaClient } from '@prisma/client';

/**
 * Ein einziger Prisma-Client pro Prozess.
 *
 * Next.js laedt Module im Entwicklungsmodus bei jeder Aenderung neu. Ohne den
 * Umweg ueber globalThis entstuende dabei pro Neuladen ein weiterer Client und
 * damit ein weiterer Verbindungspool -- die Datenbank laeuft dann nach wenigen
 * Minuten in ihr Verbindungslimit.
 */

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export { Prisma } from '@prisma/client';
export type { PrismaClient } from '@prisma/client';
