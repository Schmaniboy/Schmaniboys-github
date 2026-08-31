/**
 * Zeit als austauschbare Abhaengigkeit. Direkte Date.now()-Aufrufe in der
 * Domaenenlogik machen Ablauf- und Guthabenregeln unpruefbar.
 */
export interface Clock {
  now(): Date;
}

export const systemClock: Clock = {
  now: () => new Date(),
};

/** Feste Zeit fuer Tests. */
export function fixedClock(instant: Date): Clock {
  return { now: () => new Date(instant.getTime()) };
}
