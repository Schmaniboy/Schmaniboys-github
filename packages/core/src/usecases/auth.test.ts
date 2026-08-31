import { beforeEach, describe, expect, it } from 'vitest';

import { AppError, ErrorCode } from '../errors';
import { Role } from '../auth/roles';
import { hashPassword } from '../auth/password';
import type { Clock } from '../ports/clock';

import {
  FakeSessionRepository,
  FakeUserRepository,
  RecordingAuditLogger,
} from './fakes';
import {
  type AuthDeps,
  MAX_FAILED_LOGINS,
  login,
  logout,
  register,
  resolveSession,
} from './auth';

const GUTES_PASSWORT = 'ein-ausreichend-langes-passwort';

let users: FakeUserRepository;
let sessions: FakeSessionRepository;
let audit: RecordingAuditLogger;
let currentTime: Date;
let deps: AuthDeps;

const clock: Clock = { now: () => new Date(currentTime.getTime()) };

beforeEach(() => {
  users = new FakeUserRepository();
  sessions = new FakeSessionRepository(users);
  audit = new RecordingAuditLogger();
  currentTime = new Date('2026-03-01T12:00:00.000Z');
  deps = { users, sessions, clock, audit };
});

async function codeOf(action: () => Promise<unknown>): Promise<string> {
  try {
    await action();
    return 'kein Fehler';
  } catch (error) {
    return error instanceof AppError ? error.code : 'falscher Fehlertyp';
  }
}

describe('Registrierung', () => {
  it('legt ein Konto an und meldet direkt an', async () => {
    const result = await register(deps, {
      email: 'Neu@Example.com',
      password: GUTES_PASSWORT,
      displayName: 'Neue Person',
    });

    expect(result.user.email).toBe('neu@example.com');
    expect(result.user.role).toBe(Role.USER);
    expect(result.token).toBeTruthy();
    expect(audit.actions()).toContain('auth.register');
  });

  it('speichert das Passwort niemals im Klartext', async () => {
    await register(deps, {
      email: 'neu@example.com',
      password: GUTES_PASSWORT,
      displayName: 'Neue Person',
    });

    const stored = await users.findByEmail('neu@example.com');
    expect(stored?.passwordHash).not.toContain(GUTES_PASSWORT);
    expect(stored?.passwordHash.startsWith('scrypt$')).toBe(true);
  });

  it('lehnt zu kurze Passwoerter ab', async () => {
    expect(
      await codeOf(() =>
        register(deps, { email: 'neu@example.com', password: 'kurz', displayName: 'X Y' }),
      ),
    ).toBe(ErrorCode.VALIDATION_FAILED);
  });

  it('lehnt ein Passwort ab, das die E-Mail-Adresse enthaelt', async () => {
    expect(
      await codeOf(() =>
        register(deps, {
          email: 'maxmustermann@example.com',
          password: 'maxmustermann-2026',
          displayName: 'Max Mustermann',
        }),
      ),
    ).toBe(ErrorCode.VALIDATION_FAILED);
  });

  it('meldet eine bereits vergebene Adresse als Konflikt', async () => {
    const input = {
      email: 'doppelt@example.com',
      password: GUTES_PASSWORT,
      displayName: 'Erste Person',
    };
    await register(deps, input);
    expect(await codeOf(() => register(deps, input))).toBe(ErrorCode.CONFLICT);
  });

  it('vergibt niemals eine erhoehte Rolle ueber die Eingabe', async () => {
    const result = await register(deps, {
      email: 'schlau@example.com',
      password: GUTES_PASSWORT,
      displayName: 'Schlaue Person',
      role: Role.SUPER_ADMIN,
    });
    expect(result.user.role).toBe(Role.USER);
  });
});

describe('Anmeldung', () => {
  beforeEach(async () => {
    await register(deps, {
      email: 'person@example.com',
      password: GUTES_PASSWORT,
      displayName: 'Testperson',
    });
    audit.events.length = 0;
  });

  it('meldet mit richtigem Passwort an', async () => {
    const result = await login(deps, { email: 'person@example.com', password: GUTES_PASSWORT });
    expect(result.user.email).toBe('person@example.com');
    expect(audit.actions()).toContain('auth.login');
  });

  it('gibt bei falschem Passwort und unbekannter Adresse dieselbe Meldung', async () => {
    const falschesPasswort = await failureMessage({
      email: 'person@example.com',
      password: 'komplett-falsches-passwort',
    });
    const unbekannteAdresse = await failureMessage({
      email: 'gibtsnicht@example.com',
      password: GUTES_PASSWORT,
    });

    // Andernfalls waere ueber die Fehlermeldung aufzaehlbar, welche Adressen
    // registriert sind.
    expect(falschesPasswort).toBe(unbekannteAdresse);
    expect(falschesPasswort).not.toContain('nicht gefunden');
  });

  it('sperrt das Konto nach zu vielen Fehlversuchen', async () => {
    for (let attempt = 0; attempt < MAX_FAILED_LOGINS; attempt += 1) {
      await codeOf(() => login(deps, { email: 'person@example.com', password: 'falsch-falsch' }));
    }

    // Ab hier auch mit dem richtigen Passwort gesperrt.
    expect(
      await codeOf(() => login(deps, { email: 'person@example.com', password: GUTES_PASSWORT })),
    ).toBe(ErrorCode.RATE_LIMITED);
  });

  it('gibt das Konto nach Ablauf der Sperre wieder frei', async () => {
    for (let attempt = 0; attempt < MAX_FAILED_LOGINS; attempt += 1) {
      await codeOf(() => login(deps, { email: 'person@example.com', password: 'falsch-falsch' }));
    }

    currentTime = new Date(currentTime.getTime() + 16 * 60_000);
    const result = await login(deps, { email: 'person@example.com', password: GUTES_PASSWORT });
    expect(result.token).toBeTruthy();
  });

  it('setzt den Fehlversuchszaehler nach erfolgreicher Anmeldung zurueck', async () => {
    await codeOf(() => login(deps, { email: 'person@example.com', password: 'falsch-falsch' }));
    await login(deps, { email: 'person@example.com', password: GUTES_PASSWORT });

    const stored = await users.findByEmail('person@example.com');
    expect(stored?.failedLoginCount).toBe(0);
  });

  it('verweigert gesperrten Konten den Zutritt und verwirft ihre Sitzungen', async () => {
    const stored = await users.findByEmail('person@example.com');
    const row = users.rows.get(stored?.id ?? '');
    if (row) row.status = 'BLOCKED';

    expect(
      await codeOf(() => login(deps, { email: 'person@example.com', password: GUTES_PASSWORT })),
    ).toBe(ErrorCode.FORBIDDEN);
    expect(sessions.rows.size).toBe(0);
  });

  it('protokolliert Fehlversuche', async () => {
    await codeOf(() => login(deps, { email: 'person@example.com', password: 'falsch-falsch' }));
    expect(audit.actions()).toContain('auth.login_failed');
  });

  it('schreibt niemals das Passwort ins Audit-Log', async () => {
    await codeOf(() => login(deps, { email: 'person@example.com', password: 'falsch-falsch' }));
    const serialisiert = JSON.stringify(audit.events);
    expect(serialisiert).not.toContain('falsch-falsch');
    expect(serialisiert).not.toContain(GUTES_PASSWORT);
  });
});

describe('Sitzungsaufloesung', () => {
  it('loest einen gueltigen Token auf', async () => {
    const { token } = await register(deps, {
      email: 'person@example.com',
      password: GUTES_PASSWORT,
      displayName: 'Testperson',
    });

    const resolved = await resolveSession(deps, token);
    expect(resolved?.principal.role).toBe(Role.USER);
  });

  it('gibt null zurueck bei fehlendem oder unbekanntem Token', async () => {
    expect(await resolveSession(deps, null)).toBeNull();
    expect(await resolveSession(deps, '')).toBeNull();
    expect(await resolveSession(deps, 'voellig-erfundener-token')).toBeNull();
  });

  it('verwirft eine abgelaufene Sitzung, statt sie zu akzeptieren', async () => {
    const { token } = await register(deps, {
      email: 'person@example.com',
      password: GUTES_PASSWORT,
      displayName: 'Testperson',
    });

    currentTime = new Date(currentTime.getTime() + 40 * 24 * 3600 * 1000);
    expect(await resolveSession(deps, token)).toBeNull();
    expect(sessions.rows.size).toBe(0);
  });

  it('entzieht einer gesperrten Person sofort alle Sitzungen', async () => {
    const { token, user } = await register(deps, {
      email: 'person@example.com',
      password: GUTES_PASSWORT,
      displayName: 'Testperson',
    });

    const row = users.rows.get(user.id);
    if (row) row.status = 'BLOCKED';

    expect(await resolveSession(deps, token)).toBeNull();
    expect(sessions.rows.size).toBe(0);
  });

  it('beendet eine Sitzung beim Abmelden', async () => {
    const { token, user } = await register(deps, {
      email: 'person@example.com',
      password: GUTES_PASSWORT,
      displayName: 'Testperson',
    });

    const resolved = await resolveSession(deps, token);
    await logout(deps, resolved?.sessionId ?? '', user.id);

    expect(await resolveSession(deps, token)).toBeNull();
    expect(audit.actions()).toContain('auth.logout');
  });
});

async function failureMessage(input: { email: string; password: string }): Promise<string> {
  try {
    await login(deps, input);
    return 'kein Fehler';
  } catch (error) {
    return error instanceof AppError ? error.message : 'falscher Fehlertyp';
  }
}

describe('Vorbereitete Hilfsdaten', () => {
  it('haelt das Testpasswort ueber der Mindestlaenge', async () => {
    expect(GUTES_PASSWORT.length).toBeGreaterThanOrEqual(12);
    expect((await hashPassword(GUTES_PASSWORT)).startsWith('scrypt$')).toBe(true);
  });
});
