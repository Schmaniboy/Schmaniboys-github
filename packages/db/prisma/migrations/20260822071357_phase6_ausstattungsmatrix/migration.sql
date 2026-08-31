-- CreateEnum
CREATE TYPE "Rarity" AS ENUM ('COMMON', 'UNCOMMON', 'RARE', 'VERY_RARE');

-- CreateEnum
CREATE TYPE "Relevance" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- DropIndex
DROP INDEX "OptionAvailability_optionId_generationId_trimLineId_key";

-- AlterTable
ALTER TABLE "OptionAvailability" ADD COLUMN     "packageId" TEXT,
ADD COLUMN     "powertrainId" TEXT;

-- AlterTable
ALTER TABLE "OptionalEquipment" ADD COLUMN     "purchaseRelevance" "Relevance",
ADD COLUMN     "rarity" "Rarity",
ADD COLUMN     "relevanceConfidence" "ConfidenceLevel" NOT NULL DEFAULT 'MEDIUM',
ADD COLUMN     "relevanceDataBasis" TEXT,
ADD COLUMN     "relevanceEvidenceType" "EvidenceType",
ADD COLUMN     "relevanceObservedAt" TIMESTAMP(3),
ADD COLUMN     "relevanceReasoning" TEXT,
ADD COLUMN     "relevanceSampleSize" INTEGER,
ADD COLUMN     "resaleRelevance" "Relevance";

-- CreateIndex
CREATE INDEX "OptionAvailability_optionId_idx" ON "OptionAvailability"("optionId");

-- CreateIndex
CREATE UNIQUE INDEX "OptionAvailability_optionId_generationId_trimLineId_powertr_key" ON "OptionAvailability"("optionId", "generationId", "trimLineId", "powertrainId");

-- AddForeignKey
ALTER TABLE "OptionAvailability" ADD CONSTRAINT "OptionAvailability_powertrainId_fkey" FOREIGN KEY ("powertrainId") REFERENCES "PowertrainCombination"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OptionAvailability" ADD CONSTRAINT "OptionAvailability_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "EquipmentPackage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

