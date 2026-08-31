/**
 * Rollen und Rechte.
 *
 * Leitsatz: Rechte werden ausschliesslich serverseitig geprueft. Die
 * Rechtematrix hier ist die einzige Quelle -- keine zweite Liste im Frontend.
 * Das Frontend darf sie zum Ein- und Ausblenden lesen, niemals zum Erlauben.
 */

export const Role = {
  USER: 'USER',
  DEALER_OWNER: 'DEALER_OWNER',
  DEALER_STAFF: 'DEALER_STAFF',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export const ALL_ROLES: readonly Role[] = Object.values(Role);

/**
 * Rechte sind absichtlich feinkoernig und nach Ressource benannt.
 * Suffix `:own` heisst: zusaetzlich ist eine Eigentumspruefung noetig.
 * Das Recht allein genuegt nie fuer fremde Datensaetze.
 */
export const Permission = {
  CATALOG_READ: 'catalog:read',
  CATALOG_WRITE: 'catalog:write',
  CATALOG_PUBLISH: 'catalog:publish',

  LISTING_CREATE: 'listing:create',
  LISTING_MANAGE_OWN: 'listing:manage:own',
  LISTING_MODERATE: 'listing:moderate',

  DEALER_MANAGE_OWN: 'dealer:manage:own',
  DEALER_STAFF_MANAGE: 'dealer:staff:manage',
  DEALER_STATS_READ_OWN: 'dealer:stats:read:own',

  WALLET_READ_OWN: 'wallet:read:own',
  WALLET_PURCHASE: 'wallet:purchase',
  WALLET_ADMIN_ADJUST: 'wallet:admin:adjust',

  INVOICE_READ_OWN: 'invoice:read:own',
  INVOICE_ADMIN: 'invoice:admin',

  AI_USE: 'ai:use',
  VALUATION_USE: 'valuation:use',

  MESSAGE_SEND: 'message:send',
  MESSAGE_READ_OWN: 'message:read:own',
  MESSAGE_MODERATE: 'message:moderate',

  ADMIN_USERS: 'admin:users',
  ADMIN_DEALERS: 'admin:dealers',
  ADMIN_AUDIT_READ: 'admin:audit:read',
  ADMIN_SECURITY_READ: 'admin:security:read',
  ADMIN_ROLE_ASSIGN: 'admin:role:assign',
} as const;

export type Permission = (typeof Permission)[keyof typeof Permission];

const P = Permission;

/** Rechte, die jede angemeldete Person besitzt. */
const BASE_USER: readonly Permission[] = [
  P.CATALOG_READ,
  P.LISTING_CREATE,
  P.LISTING_MANAGE_OWN,
  P.WALLET_READ_OWN,
  P.WALLET_PURCHASE,
  P.INVOICE_READ_OWN,
  P.AI_USE,
  P.VALUATION_USE,
  P.MESSAGE_SEND,
  P.MESSAGE_READ_OWN,
];

const DEALER_STAFF: readonly Permission[] = [...BASE_USER, P.DEALER_STATS_READ_OWN];

const DEALER_OWNER: readonly Permission[] = [
  ...DEALER_STAFF,
  P.DEALER_MANAGE_OWN,
  P.DEALER_STAFF_MANAGE,
];

const EDITOR: readonly Permission[] = [...BASE_USER, P.CATALOG_WRITE, P.CATALOG_PUBLISH];

const ADMIN: readonly Permission[] = [
  ...BASE_USER,
  P.CATALOG_WRITE,
  P.CATALOG_PUBLISH,
  P.LISTING_MODERATE,
  P.MESSAGE_MODERATE,
  P.ADMIN_USERS,
  P.ADMIN_DEALERS,
  P.ADMIN_AUDIT_READ,
  P.ADMIN_SECURITY_READ,
  P.INVOICE_ADMIN,
  P.WALLET_ADMIN_ADJUST,
];

/** SUPER_ADMIN = ADMIN + Rollenvergabe. Bewusst die einzige Erweiterung. */
const SUPER_ADMIN: readonly Permission[] = [...ADMIN, P.ADMIN_ROLE_ASSIGN];

const MATRIX: Record<Role, ReadonlySet<Permission>> = {
  [Role.USER]: new Set(BASE_USER),
  [Role.DEALER_STAFF]: new Set(DEALER_STAFF),
  [Role.DEALER_OWNER]: new Set(DEALER_OWNER),
  [Role.EDITOR]: new Set(EDITOR),
  [Role.ADMIN]: new Set(ADMIN),
  [Role.SUPER_ADMIN]: new Set(SUPER_ADMIN),
};

/** Oeffentliche Leserechte, die auch ohne Anmeldung gelten. */
const ANONYMOUS: ReadonlySet<Permission> = new Set([P.CATALOG_READ]);

export function permissionsOf(role: Role | null): ReadonlySet<Permission> {
  if (role === null) return ANONYMOUS;
  return MATRIX[role];
}

export function can(role: Role | null, permission: Permission): boolean {
  return permissionsOf(role).has(permission);
}

export function canAll(role: Role | null, permissions: readonly Permission[]): boolean {
  return permissions.every((permission) => can(role, permission));
}

export function isAdminRole(role: Role | null): boolean {
  return role === Role.ADMIN || role === Role.SUPER_ADMIN;
}

export function isDealerRole(role: Role | null): boolean {
  return role === Role.DEALER_OWNER || role === Role.DEALER_STAFF;
}
