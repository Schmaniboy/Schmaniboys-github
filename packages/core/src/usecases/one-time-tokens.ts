import { z } from 'zod';

import { assertTokenGueltig, TOKEN_FEHLERTEXTE } from '../auth/one-time-tokens';
import { hashPassword } from '../auth/password';
import { errors } from '../errors';
import type { AuditLogger } from '../ports/audit';
import type { Clock } from '../ports/clock';
import type {
  EmailVerificationRepository,
  PasswordResetRepository,
  TokenRepository,
} from '../ports/token-repository';
import { password } from '../validation/common';

/**
 * Einmal-Token-Vorgaenge.
 *
 * Alles, was nach dem Oeffnen eines Einmal-Links passiert, steckt hier --
 * nicht im Route Handler (ADR-001). Damit sind die Regeln ohne HTTP
 * pruefbar.
 */

export interface TokenDeps {
  tokens: TokenRepository;
  clock: Clock;
  audit: AuditLogger;
}

// ---------------------------------------------------------------------------
// Passwort zuruecksetzen
// ---------------------------------------------------------------------------

const passwortNeuEingabe = z.object({
  token: z.string().min(1).max(200),
  passwort: password,
});

export async function resetPassword(
  deps: TokenDeps & { passwords: PasswordResetRepository },
  rawInput: unknown,
): Promise<{ message: string }> {
  const eingabe = passwortNeuEingabe.parse(rawInput);
  const jetzt = deps.clock.now();

  const token = await deps.tokens.find(eingabe.token);
  assertTokenGueltig(token, 'PASSWORD_RESET', jetzt);
  const gefunden = token!;

  if (gefunden.user.status !== 'ACTIVE') {
    throw errors.validation({ token: [TOKEN_FEHLERTEXTE.UNBEKANNT] });
  }

  const gewonnen = await deps.tokens.consume(gefunden.id, jetzt);
  if (!gewonnen) {
    throw errors.validation({ token: [TOKEN_FEHLERTEXTE.VERBRAUCHT] });
  }

  await deps.passwords.setPasswordAndEndSessions({
    userId: gefunden.userId,
    passwordHash: await hashPassword(eingabe.passwort),
    jetzt,
  });

  await deps.audit.record({
    action: 'auth.password_changed',
    actorId: gefunden.userId,
    subjectType: 'User',
    subjectId: gefunden.userId,
    metadata: { weg: 'zuruecksetzung' },
  });

  return {
    message:
      'Ihr Passwort wurde geändert. Alle bestehenden Anmeldungen wurden beendet — ' +
      'bitte melden Sie sich neu an.',
  };
}

// ---------------------------------------------------------------------------
// E-Mail-Adresse bestaetigen
// ---------------------------------------------------------------------------

const emailBestaetigungEingabe = z.object({
  token: z.string().min(1).max(200),
});

export async function verifyEmail(
  deps: TokenDeps & { emailVerification: EmailVerificationRepository },
  rawInput: unknown,
): Promise<{ message: string }> {
  const { token: klartext } = emailBestaetigungEingabe.parse(rawInput);
  const jetzt = deps.clock.now();

  const token = await deps.tokens.find(klartext);
  assertTokenGueltig(token, 'EMAIL_VERIFICATION', jetzt);
  const gefunden = token!;

  if (gefunden.user.status !== 'ACTIVE') {
    throw errors.validation({ token: [TOKEN_FEHLERTEXTE.UNBEKANNT] });
  }

  const gewonnen = await deps.tokens.consume(gefunden.id, jetzt);
  if (!gewonnen) {
    throw errors.validation({ token: [TOKEN_FEHLERTEXTE.VERBRAUCHT] });
  }

  await deps.emailVerification.markVerified(gefunden.userId, jetzt);

  await deps.audit.record({
    action: 'auth.email_verified',
    actorId: gefunden.userId,
    subjectType: 'User',
    subjectId: gefunden.userId,
    metadata: {},
  });

  return { message: 'Ihre E-Mail-Adresse ist bestätigt.' };
}
