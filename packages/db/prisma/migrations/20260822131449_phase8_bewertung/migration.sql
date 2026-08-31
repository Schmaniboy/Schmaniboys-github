-- AlterTable
ALTER TABLE "ListingDraft" ADD COLUMN     "valuationAssumptionsId" TEXT,
ADD COLUMN     "valuationJson" JSONB,
ADD COLUMN     "valuedAt" TIMESTAMP(3);

