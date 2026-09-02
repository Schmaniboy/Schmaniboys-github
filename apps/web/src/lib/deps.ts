import type {
  AdminUserDeps,
  AuthDeps,
  DealerMemberDeps,
  EmailVerificationRepository,
  ListingDeps,
  MessagingDeps,
  ModerationDeps,
  PasswordResetRepository,
  SessionRepository,
  TokenDeps,
  TokenRepository,
  UserRepository,
} from '@ap/core';
import { InMemoryRateLimiter, systemClock } from '@ap/core';
import {
  auditLogger,
  clearFailedLogins,
  countSuperAdmins,
  createSession,
  createUser,
  deleteAllSessionsOfUser,
  deleteSession,
  findSessionByTokenHash,
  findUserByEmail,
  findUserById,
  findUserRole,
  findeToken,
  markiereEmailBestaetigt,
  addDealerMember,
  addFavorite,
  countRecentConversations,
  countRecentMessages,
  createListingFromDraft,
  findListingVisibility,
  findOwnConversation,
  findOwnListing,
  listDealerMembers,
  listOwnListings,
  listMessages,
  listOwnConversations,
  markConversationRead,
  moderateListing,
  moderateMessage,
  registerFailedLogin,
  removeDealerMember,
  removeFavorite,
  searchListings,
  sendMessage,
  setConversationState,
  setDealerMemberRole,
  setListingStatus,
  startListingConversation,
  setUserRole,
  updateOwnListing,
  setUserStatus,
  setzePasswortUndBeendeSitzungen,
  stelleTokenAus,
  touchSession,
  updatePasswordHash,
  verbraucheToken,
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

// ---------------------------------------------------------------------------
// Token-Vorgaenge (Einmal-Token)
// ---------------------------------------------------------------------------

const tokenRepository: TokenRepository = {
  find: findeToken,
  consume: verbraucheToken,
  issue: stelleTokenAus,
};

const passwordResetRepository: PasswordResetRepository = {
  setPasswordAndEndSessions: setzePasswortUndBeendeSitzungen,
};

const emailVerificationRepository: EmailVerificationRepository = {
  markVerified: markiereEmailBestaetigt,
};

export const tokenDeps: TokenDeps & {
  passwords: PasswordResetRepository;
  emailVerification: EmailVerificationRepository;
} = {
  tokens: tokenRepository,
  passwords: passwordResetRepository,
  emailVerification: emailVerificationRepository,
  clock: systemClock,
  audit: auditLogger,
};

// ---------------------------------------------------------------------------
// Benutzerverwaltung (Administration)
// ---------------------------------------------------------------------------

export const adminUserDeps: AdminUserDeps = {
  findUserRole,
  countSuperAdmins,
  setUserRole,
  setUserStatus,
  audit: auditLogger,
};

// ---------------------------------------------------------------------------
// Moderation
// ---------------------------------------------------------------------------

export const moderationDeps: ModerationDeps = {
  moderation: { moderateListing, moderateMessage },
  audit: auditLogger,
  clock: systemClock,
};

// ---------------------------------------------------------------------------
// Haendler-Mitarbeiter
// ---------------------------------------------------------------------------

export const dealerMemberDeps: DealerMemberDeps = {
  members: {
    listMembers: listDealerMembers,
    addMember: addDealerMember,
    setMemberRole: setDealerMemberRole,
    removeMember: removeDealerMember,
  },
};

// ---------------------------------------------------------------------------
// Nachrichten
// ---------------------------------------------------------------------------

export const messagingDeps: MessagingDeps = {
  conversations: {
    findOwnConversation,
    listOwnConversations,
    listMessages,
    markConversationRead,
    countRecentMessages,
    countRecentConversations,
    sendMessage,
    startListingConversation,
    setConversationState,
  },
  clock: systemClock,
};

// ---------------------------------------------------------------------------
// Anzeigen
// ---------------------------------------------------------------------------

export const listingDeps: ListingDeps = {
  listings: {
    findOwnListing,
    listOwnListings,
    updateOwnListing,
    setListingStatus,
    searchListings,
    createListingFromDraft,
    findListingVisibility,
    addFavorite,
    removeFavorite,
  },
  clock: systemClock,
};

/**
 * Ratenbegrenzung im Prozessspeicher.
 *
 * BEKANNTE GRENZE: gilt pro Instanz. Bei mehreren Instanzen ist das kein
 * verlaesslicher Schutz mehr -- dann muss eine geteilte Implementierung
 * dahinter. Die Schnittstelle bleibt dieselbe.
 */
export const rateLimiter = new InMemoryRateLimiter();
