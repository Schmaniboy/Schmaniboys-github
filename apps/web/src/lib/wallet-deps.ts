import { type WalletDeps, systemClock } from '@ap/core';
import { auditLogger, walletRepository } from '@ap/db';

export const walletDeps: WalletDeps = {
  wallets: walletRepository,
  clock: systemClock,
  audit: auditLogger,
};
