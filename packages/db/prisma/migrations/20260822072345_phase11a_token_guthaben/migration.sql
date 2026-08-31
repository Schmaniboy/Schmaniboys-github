-- CreateEnum
CREATE TYPE "TokenTransactionType" AS ENUM ('PURCHASE', 'USAGE', 'REFUND', 'ADMIN_CREDIT', 'ADMIN_DEBIT', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "TokenHoldStatus" AS ENUM ('OPEN', 'CAPTURED', 'RELEASED', 'EXPIRED');

-- CreateTable
CREATE TABLE "Wallet" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "balanceTokens" INTEGER NOT NULL DEFAULT 0,
    "reservedTokens" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TokenTransaction" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "type" "TokenTransactionType" NOT NULL,
    "amountTokens" INTEGER NOT NULL,
    "balanceAfter" INTEGER NOT NULL,
    "reference" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "actorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TokenTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TokenHold" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "amountTokens" INTEGER NOT NULL,
    "status" "TokenHoldStatus" NOT NULL DEFAULT 'OPEN',
    "purpose" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "settledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TokenHold_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_userId_key" ON "Wallet"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TokenTransaction_reference_key" ON "TokenTransaction"("reference");

-- CreateIndex
CREATE INDEX "TokenTransaction_walletId_createdAt_idx" ON "TokenTransaction"("walletId", "createdAt");

-- CreateIndex
CREATE INDEX "TokenTransaction_type_idx" ON "TokenTransaction"("type");

-- CreateIndex
CREATE UNIQUE INDEX "TokenHold_reference_key" ON "TokenHold"("reference");

-- CreateIndex
CREATE INDEX "TokenHold_status_expiresAt_idx" ON "TokenHold"("status", "expiresAt");

-- CreateIndex
CREATE INDEX "TokenHold_walletId_idx" ON "TokenHold"("walletId");

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TokenTransaction" ADD CONSTRAINT "TokenTransaction_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TokenHold" ADD CONSTRAINT "TokenHold_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

