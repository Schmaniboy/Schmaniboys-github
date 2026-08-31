import { describe, expect, it } from 'vitest';

import { AppError, ErrorCode } from '../errors';

import { requireOwnership, requirePermission, requireSameDealer } from './access';
import { Permission, Role } from './roles';

const user = { userId: 'u1', role: Role.USER, dealerId: null };
const admin = { userId: 'a1', role: Role.ADMIN, dealerId: null };
const dealer = { userId: 'd1', role: Role.DEALER_OWNER, dealerId: 'dealer-1' };

function codeOf(action: () => unknown): string {
  try {
    action();
    return 'kein Fehler';
  } catch (error) {
    return error instanceof AppError ? error.code : 'falscher Fehlertyp';
  }
}

describe('Zugriffspruefungen', () => {
  it('antwortet ohne Session mit 401, nicht mit 403', () => {
    expect(codeOf(() => requirePermission(null, Permission.LISTING_CREATE))).toBe(
      ErrorCode.UNAUTHENTICATED,
    );
  });

  it('antwortet bei fehlendem Recht mit 403', () => {
    expect(codeOf(() => requirePermission(user, Permission.ADMIN_USERS))).toBe(
      ErrorCode.FORBIDDEN,
    );
  });

  it('laesst vorhandene Rechte durch', () => {
    expect(requirePermission(user, Permission.LISTING_CREATE).userId).toBe('u1');
  });

  it('meldet fremdes Eigentum als NOT_FOUND, nicht als FORBIDDEN', () => {
    // Sonst waere ueber die Fehlerantwort aufzaehlbar, welche IDs existieren.
    expect(codeOf(() => requireOwnership(user, 'jemand-anders'))).toBe(ErrorCode.NOT_FOUND);
  });

  it('erlaubt Eigentuemern den Zugriff', () => {
    expect(requireOwnership(user, 'u1').userId).toBe('u1');
  });

  it('erlaubt der Moderation den Zugriff auf fremde Datensaetze', () => {
    expect(
      requireOwnership(admin, 'u1', { override: Permission.LISTING_MODERATE }).userId,
    ).toBe('a1');
  });

  it('trennt Haendlermandanten', () => {
    expect(requireSameDealer(dealer, 'dealer-1').dealerId).toBe('dealer-1');
    expect(codeOf(() => requireSameDealer(dealer, 'dealer-2'))).toBe(ErrorCode.NOT_FOUND);
  });

  it('verweigert Zugriff, wenn gar kein Eigentuemer hinterlegt ist', () => {
    expect(codeOf(() => requireOwnership(user, null))).toBe(ErrorCode.NOT_FOUND);
    expect(codeOf(() => requireSameDealer(dealer, null))).toBe(ErrorCode.NOT_FOUND);
  });
});
