import { describe, expect, it } from 'vitest';

import { Role } from '../auth/roles';
import { AppError, ErrorCode } from '../errors';

import {
  assertRollenwechselErlaubt,
  assertSperrungErlaubt,
  pruefeBegruendung,
} from './moderation';

const superAdmin = { userId: 'sa1', role: Role.SUPER_ADMIN, dealerId: null };
const admin = { userId: 'a1', role: Role.ADMIN, dealerId: null };
const nutzer = { userId: 'u1', role: Role.USER, dealerId: null };

function codeOf(aktion: () => unknown): string {
  try {
    aktion();
    return 'kein Fehler';
  } catch (error) {
    return error instanceof AppError ? error.code : 'falscher Fehlertyp';
  }
}

describe('Begruendung', () => {
  it('verlangt einen nachvollziehbaren Grund', () => {
    for (const grund of ['', 'Spam', '   ']) {
      expect(codeOf(() => pruefeBegruendung(grund))).toBe(ErrorCode.VALIDATION_FAILED);
    }
  });

  it('nimmt eine ordentliche Begruendung an und bereinigt sie', () => {
    expect(pruefeBegruendung('  Wiederholte Falschangaben zum Unfallschaden.  ')).toBe(
      'Wiederholte Falschangaben zum Unfallschaden.',
    );
  });
});

describe('Rollenvergabe', () => {
  const basis = {
    handelnde: superAdmin,
    zielUserId: 'u1',
    zielRolleAktuell: Role.USER,
    zielRolleNeu: Role.EDITOR,
    verbleibendeSuperAdmins: 2,
  };

  it('erlaubt der obersten Administration die Vergabe', () => {
    expect(codeOf(() => assertRollenwechselErlaubt(basis))).toBe('kein Fehler');
  });

  it('verwehrt sie einer gewoehnlichen Administration', () => {
    // ADMIN_ROLE_ASSIGN ist die einzige Erweiterung von SUPER_ADMIN
    // gegenueber ADMIN -- und der Grund, dass es die Rolle gibt.
    expect(codeOf(() => assertRollenwechselErlaubt({ ...basis, handelnde: admin }))).toBe(
      ErrorCode.FORBIDDEN,
    );
    expect(codeOf(() => assertRollenwechselErlaubt({ ...basis, handelnde: nutzer }))).toBe(
      ErrorCode.FORBIDDEN,
    );
  });

  it('verlangt eine Anmeldung', () => {
    expect(codeOf(() => assertRollenwechselErlaubt({ ...basis, handelnde: null }))).toBe(
      ErrorCode.UNAUTHENTICATED,
    );
  });

  it('laesst niemanden die eigene Rolle aendern', () => {
    // Sich selbst zu erhoehen waere die naheliegendste Rechteausweitung.
    expect(
      codeOf(() =>
        assertRollenwechselErlaubt({ ...basis, zielUserId: 'sa1', zielRolleNeu: Role.ADMIN }),
      ),
    ).toBe(ErrorCode.CONFLICT);
  });

  it('laesst die letzte oberste Administration nicht verschwinden', () => {
    expect(
      codeOf(() =>
        assertRollenwechselErlaubt({
          ...basis,
          zielUserId: 'sa2',
          zielRolleAktuell: Role.SUPER_ADMIN,
          zielRolleNeu: Role.ADMIN,
          verbleibendeSuperAdmins: 1,
        }),
      ),
    ).toBe(ErrorCode.CONFLICT);
  });

  it('laesst sie gehen, solange eine weitere bleibt', () => {
    expect(
      codeOf(() =>
        assertRollenwechselErlaubt({
          ...basis,
          zielUserId: 'sa2',
          zielRolleAktuell: Role.SUPER_ADMIN,
          zielRolleNeu: Role.ADMIN,
          verbleibendeSuperAdmins: 2,
        }),
      ),
    ).toBe('kein Fehler');
  });

  it('vergibt hier keine Haendlerrollen', () => {
    // Eine Haendlerrolle ohne Betrieb waere ein Zustand, den keine Pruefung
    // erwartet.
    for (const rolle of [Role.DEALER_OWNER, Role.DEALER_STAFF]) {
      expect(codeOf(() => assertRollenwechselErlaubt({ ...basis, zielRolleNeu: rolle }))).toBe(
        ErrorCode.CONFLICT,
      );
    }
  });
});

describe('Kontosperrung', () => {
  it('erlaubt einer Administration das Sperren gewoehnlicher Konten', () => {
    expect(
      codeOf(() =>
        assertSperrungErlaubt({ handelnde: admin, zielUserId: 'u1', zielRolle: Role.USER }),
      ),
    ).toBe('kein Fehler');
  });

  it('laesst niemanden das eigene Konto sperren', () => {
    expect(
      codeOf(() =>
        assertSperrungErlaubt({ handelnde: admin, zielUserId: 'a1', zielRolle: Role.ADMIN }),
      ),
    ).toBe(ErrorCode.CONFLICT);
  });

  it('schuetzt die oberste Administration vor der gewoehnlichen', () => {
    // Sonst waere die Sperrfunktion ein Weg, die Aufsicht loszuwerden.
    expect(
      codeOf(() =>
        assertSperrungErlaubt({ handelnde: admin, zielUserId: 'sa1', zielRolle: Role.SUPER_ADMIN }),
      ),
    ).toBe(ErrorCode.FORBIDDEN);

    expect(
      codeOf(() =>
        assertSperrungErlaubt({
          handelnde: superAdmin,
          zielUserId: 'sa2',
          zielRolle: Role.SUPER_ADMIN,
        }),
      ),
    ).toBe('kein Fehler');
  });

  it('verwehrt sie gewoehnlichen Konten', () => {
    expect(
      codeOf(() =>
        assertSperrungErlaubt({ handelnde: nutzer, zielUserId: 'u2', zielRolle: Role.USER }),
      ),
    ).toBe(ErrorCode.FORBIDDEN);
  });
});
