import { errors } from '../errors';

import { can, type Permission, type Role } from './roles';

/** Die Identitaet, die aus einer Session hervorgeht. */
export interface Principal {
  userId: string;
  role: Role;
  dealerId: string | null;
}

/** Wirft, wenn keine Session vorliegt. */
export function requirePrincipal(principal: Principal | null): Principal {
  if (!principal) throw errors.unauthenticated('kein Principal im Request');
  return principal;
}

/** Wirft, wenn das Recht fehlt. Reihenfolge ist bewusst: erst 401, dann 403. */
export function requirePermission(
  principal: Principal | null,
  permission: Permission,
): Principal {
  const subject = requirePrincipal(principal);
  if (!can(subject.role, permission)) {
    throw errors.forbidden(`Recht ${permission} fehlt fuer Rolle ${subject.role}`);
  }
  return subject;
}

/**
 * Eigentumspruefung. Getrennt vom Recht, weil `listing:manage:own` allein
 * nichts ueber den konkreten Datensatz aussagt.
 *
 * Bewusst NOT_FOUND statt FORBIDDEN: Wer nicht Eigentuemer ist, soll nicht
 * erfahren, dass der Datensatz existiert (verhindert Aufzaehlbarkeit).
 */
export function requireOwnership(
  principal: Principal | null,
  ownerId: string | null | undefined,
  options: { override?: Permission } = {},
): Principal {
  const subject = requirePrincipal(principal);
  if (options.override && can(subject.role, options.override)) return subject;
  if (!ownerId || ownerId !== subject.userId) {
    throw errors.notFound();
  }
  return subject;
}

/** Mandantentrennung fuer Haendlerdaten. Gleiche Logik, andere Achse. */
export function requireSameDealer(
  principal: Principal | null,
  dealerId: string | null | undefined,
  options: { override?: Permission } = {},
): Principal {
  const subject = requirePrincipal(principal);
  if (options.override && can(subject.role, options.override)) return subject;
  if (!dealerId || subject.dealerId !== dealerId) {
    throw errors.notFound();
  }
  return subject;
}
