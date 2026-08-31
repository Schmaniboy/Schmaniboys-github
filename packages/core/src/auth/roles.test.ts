import { describe, expect, it } from 'vitest';

import { ALL_ROLES, Permission, Role, can, isAdminRole, permissionsOf } from './roles';

describe('Rechtematrix', () => {
  it('erlaubt Nicht-Angemeldeten ausschliesslich den Katalog', () => {
    expect(can(null, Permission.CATALOG_READ)).toBe(true);
    expect(can(null, Permission.LISTING_CREATE)).toBe(false);
    expect(can(null, Permission.ADMIN_USERS)).toBe(false);
    expect(permissionsOf(null).size).toBe(1);
  });

  it('gibt normalen Benutzern keine administrativen Rechte', () => {
    const forbidden = [
      Permission.ADMIN_USERS,
      Permission.ADMIN_ROLE_ASSIGN,
      Permission.WALLET_ADMIN_ADJUST,
      Permission.LISTING_MODERATE,
      Permission.CATALOG_WRITE,
      Permission.INVOICE_ADMIN,
    ];
    for (const permission of forbidden) {
      expect(can(Role.USER, permission)).toBe(false);
    }
  });

  it('trennt Haendlermitarbeiter von Haendlerinhabern', () => {
    expect(can(Role.DEALER_STAFF, Permission.DEALER_STATS_READ_OWN)).toBe(true);
    expect(can(Role.DEALER_STAFF, Permission.DEALER_MANAGE_OWN)).toBe(false);
    expect(can(Role.DEALER_STAFF, Permission.DEALER_STAFF_MANAGE)).toBe(false);
    expect(can(Role.DEALER_OWNER, Permission.DEALER_MANAGE_OWN)).toBe(true);
    expect(can(Role.DEALER_OWNER, Permission.DEALER_STAFF_MANAGE)).toBe(true);
  });

  it('gibt der Redaktion Katalogrechte, aber keine Benutzerverwaltung', () => {
    expect(can(Role.EDITOR, Permission.CATALOG_WRITE)).toBe(true);
    expect(can(Role.EDITOR, Permission.CATALOG_PUBLISH)).toBe(true);
    expect(can(Role.EDITOR, Permission.ADMIN_USERS)).toBe(false);
  });

  it('behaelt die Rollenvergabe allein dem SUPER_ADMIN vor', () => {
    expect(can(Role.ADMIN, Permission.ADMIN_ROLE_ASSIGN)).toBe(false);
    expect(can(Role.SUPER_ADMIN, Permission.ADMIN_ROLE_ASSIGN)).toBe(true);
  });

  it('haelt SUPER_ADMIN als echte Obermenge von ADMIN', () => {
    for (const permission of permissionsOf(Role.ADMIN)) {
      expect(can(Role.SUPER_ADMIN, permission)).toBe(true);
    }
  });

  it('kennt fuer jede Rolle einen Eintrag', () => {
    for (const role of ALL_ROLES) {
      expect(permissionsOf(role).size).toBeGreaterThan(0);
    }
  });

  it('erkennt administrative Rollen', () => {
    expect(isAdminRole(Role.ADMIN)).toBe(true);
    expect(isAdminRole(Role.SUPER_ADMIN)).toBe(true);
    expect(isAdminRole(Role.EDITOR)).toBe(false);
    expect(isAdminRole(null)).toBe(false);
  });
});
