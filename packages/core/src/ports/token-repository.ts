import type { TokenPurpose } from '../auth/one-time-tokens';

export interface StoredToken {
  id: string;
  userId: string;
  purpose: TokenPurpose;
  expiresAt: Date;
  usedAt: Date | null;
  user: { id: string; email: string; displayName: string; status: string };
}

export interface IssuedToken {
  token: string;
  expiresAt: Date;
}

export interface TokenRepository {
  find(klartext: string): Promise<StoredToken | null>;
  consume(id: string, jetzt: Date): Promise<boolean>;
  issue(input: {
    userId: string;
    purpose: TokenPurpose;
    jetzt: Date;
    ipHash?: string | null;
  }): Promise<IssuedToken | null>;
}

export interface PasswordResetRepository {
  setPasswordAndEndSessions(input: {
    userId: string;
    passwordHash: string;
    jetzt: Date;
  }): Promise<void>;
}

export interface EmailVerificationRepository {
  markVerified(userId: string, jetzt: Date): Promise<void>;
}
