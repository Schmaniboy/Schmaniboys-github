import type { AuthDeps, SessionRepository, UserRepository } from '@ap/core';
import { InMemoryRateLimiter, systemClock } from '@ap/core';
import {
  auditLogger,
  clearFailedLogins,
  createSession,
  createUser,
  deleteAllSessionsOfUser,
  deleteSession,
  findSessionByTokenHash,
  findUserByEmail,
  findUserById,
  registerFailedLogin,
  touchSession,
  updatePasswordHash,
} from '@ap/db';

/**
 * Verdrahtung: hier -- und nur hier -- treffen die Ports aus `packages/core`
 * auf die Prisma-Implementierungen aus `packages/db`.
 *
 * Das ist der Preis dafuer, dass die Domaenenschicht Prisma nicht kennt, und
 * zugleich der Grund, warum ein spaeterer Wechsel des Persistenzwegs nur diese
 * Datei betrifft.
 */

const userRepository: UserRepository = {
  findByEmail: findUserByEmail,
  findById: findUserById,
  create: createUser,
  updatePasswordHash,
  registerFailedLogin,
  clearFailedLogins,
};

const sessionRepository: SessionRepository = {
  create: createSession,
  findByTokenHash: findSessionByTokenHash,
  touch: touchSession,
  delete: deleteSession,
  deleteAllOfUser: deleteAllSessionsOfUser,
};

export const authDeps: AuthDeps = {
  users: userRepository,
  sessions: sessionRepository,
  clock: systemClock,
  audit: auditLogger,
};

/**
 * Ratenbegrenzung im Prozessspeicher.
 *
 * BEKANNTE GRENZE: gilt pro Instanz. Bei mehreren Instanzen ist das kein
 * verlaesslicher Schutz mehr -- dann muss eine geteilte Implementierung
 * dahinter. Die Schnittstelle bleibt dieselbe.
 */
export const rateLimiter = new InMemoryRateLimiter();
