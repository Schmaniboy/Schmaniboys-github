import { type CatalogDeps, systemClock } from '@ap/core';
import { auditLogger, catalogRepository } from '@ap/db';

/** Verdrahtung des Katalogzugriffs -- dasselbe Muster wie bei authDeps. */
export const catalogDeps: CatalogDeps = {
  catalog: catalogRepository,
  clock: systemClock,
  audit: auditLogger,
};
