/**
 * Ist der Fehler ein "gibt es nicht"?
 *
 * S3-Umsetzungen melden das unterschiedlich: AWS mit `NoSuchKey`, andere
 * mit `NotFound`, wieder andere nur mit dem Statuscode 404. Deshalb alle
 * drei -- und nur diese drei.
 */
export function istNichtGefunden(fehler: unknown): boolean {
  if (typeof fehler !== 'object' || fehler === null) return false;
  const name = (fehler as { name?: string }).name;
  if (name === 'NoSuchKey' || name === 'NotFound') return true;
  const status = (fehler as { $metadata?: { httpStatusCode?: number } }).$metadata
    ?.httpStatusCode;
  return status === 404;
}
