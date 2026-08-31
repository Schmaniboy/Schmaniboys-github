import type { Role } from '../auth/roles';

/**
 * Persistenz als Schnittstelle. `packages/core` kennt Prisma nicht -- die
 * Implementierung liegt in `packages/db`, die Regeln liegen hier.
 */

export type UserStatus = 'PENDING_VERIFICATION' | 'ACTIVE' | 'BLOCKED';

export interface StoredUser {
  id: string;
  email: string;
  passwordHash: string;
  displayName: string;
  role: Role;
  status: UserStatus;
  failedLoginCount: number;
  lockedUntil: Date | null;
  dealerId: string | null;
  emailVerifiedAt: Date | null;
  createdAt: Date;
}

export interface StoredSession {
  id: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
  lastSeenAt: Date;
}

export interface UserRepository {
  findByEmail(email: string): Promise<StoredUser | null>;
  findById(id: string): Promise<StoredUser | null>;
  create(input: {
    email: string;
    passwordHash: string;
    displayName: string;
    role?: Role;
  }): Promise<StoredUser>;
  updatePasswordHash(userId: string, passwordHash: string): Promise<void>;
  registerFailedLogin(userId: string, lockedUntil: Date | null): Promise<void>;
  clearFailedLogins(userId: string): Promise<void>;
}

export interface SessionRepository {
  create(input: {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    ipHash?: string | null;
    userAgentDigest?: string | null;
  }): Promise<StoredSession>;
  findByTokenHash(
    tokenHash: string,
  ): Promise<{ session: StoredSession; user: StoredUser } | null>;
  touch(sessionId: string, expiresAt: Date | null): Promise<void>;
  delete(sessionId: string): Promise<void>;
  deleteAllOfUser(userId: string): Promise<number>;
}
