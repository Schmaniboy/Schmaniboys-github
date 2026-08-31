-- CreateEnum
CREATE TYPE "RequirementKind" AS ENUM ('REQUIRES', 'EXCLUDES');

-- CreateEnum
CREATE TYPE "PriceSourceType" AS ENUM ('PRICE_LIST', 'CONFIGURATOR', 'DEALER_QUOTE', 'PRESS', 'COMMUNITY', 'OTHER');

-- AlterTable
ALTER TABLE "Manufacturer" ADD COLUMN "logoUrl" TEXT;

-- AlterTable
ALTER TABLE "OptionAvailability"
  ADD COLUMN "surchargeSourceType" "PriceSourceType",
  ADD COLUMN "surchargeSourceRef"  TEXT,
  ADD COLUMN "surchargeSourceDate" TIMESTAMP(3),
  ADD COLUMN "surchargeSourceNote" TEXT;

-- CreateTable
CREATE TABLE "EquipmentRequirement" (
    "id" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    "requiredOptionId" TEXT NOT NULL,
    "kind" "RequirementKind" NOT NULL DEFAULT 'REQUIRES',
    "note" TEXT,
    "generationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EquipmentRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EquipmentRequirement_requiredOptionId_idx" ON "EquipmentRequirement"("requiredOptionId");

-- CreateIndex
CREATE UNIQUE INDEX "EquipmentRequirement_optionId_requiredOptionId_generationId_key" ON "EquipmentRequirement"("optionId", "requiredOptionId", "generationId");

-- AddForeignKey
ALTER TABLE "EquipmentRequirement" ADD CONSTRAINT "EquipmentRequirement_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "OptionalEquipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquipmentRequirement" ADD CONSTRAINT "EquipmentRequirement_requiredOptionId_fkey" FOREIGN KEY ("requiredOptionId") REFERENCES "OptionalEquipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquipmentRequirement" ADD CONSTRAINT "EquipmentRequirement_generationId_fkey" FOREIGN KEY ("generationId") REFERENCES "Generation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
