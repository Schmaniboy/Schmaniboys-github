-- CreateEnum
CREATE TYPE "ImageKind" AS ENUM ('VEHICLE_EXTERIOR', 'VEHICLE_INTERIOR', 'VEHICLE_DETAIL', 'EQUIPMENT_PART', 'PAINT_SAMPLE', 'WHEEL');

-- CreateEnum
CREATE TYPE "ImageBackground" AS ENUM ('CUTOUT', 'NEUTRAL', 'SCENE', 'UNKNOWN');

-- AlterEnum
BEGIN;
CREATE TYPE "DataQuality_new" AS ENUM ('VERIFIED', 'PARTIALLY_VERIFIED', 'EXPERIENCE', 'UNVERIFIED', 'NEEDS_REVIEW');
ALTER TABLE "public"."Engine" ALTER COLUMN "dataQuality" DROP DEFAULT;
ALTER TABLE "public"."EngineFamily" ALTER COLUMN "dataQuality" DROP DEFAULT;
ALTER TABLE "public"."EquipmentPackage" ALTER COLUMN "dataQuality" DROP DEFAULT;
ALTER TABLE "public"."FaceliftPhase" ALTER COLUMN "dataQuality" DROP DEFAULT;
ALTER TABLE "public"."Generation" ALTER COLUMN "dataQuality" DROP DEFAULT;
ALTER TABLE "public"."HsnTsnEntry" ALTER COLUMN "dataQuality" DROP DEFAULT;
ALTER TABLE "public"."ModelYear" ALTER COLUMN "dataQuality" DROP DEFAULT;
ALTER TABLE "public"."OptionAvailability" ALTER COLUMN "dataQuality" DROP DEFAULT;
ALTER TABLE "public"."OptionalEquipment" ALTER COLUMN "dataQuality" DROP DEFAULT;
ALTER TABLE "public"."PaintColor" ALTER COLUMN "dataQuality" DROP DEFAULT;
ALTER TABLE "public"."PaintColorAvailability" ALTER COLUMN "dataQuality" DROP DEFAULT;
ALTER TABLE "public"."PowertrainCombination" ALTER COLUMN "dataQuality" DROP DEFAULT;
ALTER TABLE "public"."SpecialEdition" ALTER COLUMN "dataQuality" DROP DEFAULT;
ALTER TABLE "public"."TrimLine" ALTER COLUMN "dataQuality" DROP DEFAULT;
ALTER TABLE "public"."WheelOption" ALTER COLUMN "dataQuality" DROP DEFAULT;
ALTER TABLE "public"."WheelOptionAvailability" ALTER COLUMN "dataQuality" DROP DEFAULT;
ALTER TABLE "Generation" ALTER COLUMN "dataQuality" TYPE "DataQuality_new" USING (CASE "dataQuality"::text
      WHEN 'CONFIRMED' THEN 'VERIFIED'
      WHEN 'EXPERIENCE' THEN 'EXPERIENCE'
      WHEN 'CONFLICTING' THEN 'NEEDS_REVIEW'
      ELSE 'UNVERIFIED'
    END)::"DataQuality_new";
ALTER TABLE "FaceliftPhase" ALTER COLUMN "dataQuality" TYPE "DataQuality_new" USING (CASE "dataQuality"::text
      WHEN 'CONFIRMED' THEN 'VERIFIED'
      WHEN 'EXPERIENCE' THEN 'EXPERIENCE'
      WHEN 'CONFLICTING' THEN 'NEEDS_REVIEW'
      ELSE 'UNVERIFIED'
    END)::"DataQuality_new";
ALTER TABLE "Engine" ALTER COLUMN "dataQuality" TYPE "DataQuality_new" USING (CASE "dataQuality"::text
      WHEN 'CONFIRMED' THEN 'VERIFIED'
      WHEN 'EXPERIENCE' THEN 'EXPERIENCE'
      WHEN 'CONFLICTING' THEN 'NEEDS_REVIEW'
      ELSE 'UNVERIFIED'
    END)::"DataQuality_new";
ALTER TABLE "PowertrainCombination" ALTER COLUMN "dataQuality" TYPE "DataQuality_new" USING (CASE "dataQuality"::text
      WHEN 'CONFIRMED' THEN 'VERIFIED'
      WHEN 'EXPERIENCE' THEN 'EXPERIENCE'
      WHEN 'CONFLICTING' THEN 'NEEDS_REVIEW'
      ELSE 'UNVERIFIED'
    END)::"DataQuality_new";
ALTER TABLE "TrimLine" ALTER COLUMN "dataQuality" TYPE "DataQuality_new" USING (CASE "dataQuality"::text
      WHEN 'CONFIRMED' THEN 'VERIFIED'
      WHEN 'EXPERIENCE' THEN 'EXPERIENCE'
      WHEN 'CONFLICTING' THEN 'NEEDS_REVIEW'
      ELSE 'UNVERIFIED'
    END)::"DataQuality_new";
ALTER TABLE "OptionalEquipment" ALTER COLUMN "dataQuality" TYPE "DataQuality_new" USING (CASE "dataQuality"::text
      WHEN 'CONFIRMED' THEN 'VERIFIED'
      WHEN 'EXPERIENCE' THEN 'EXPERIENCE'
      WHEN 'CONFLICTING' THEN 'NEEDS_REVIEW'
      ELSE 'UNVERIFIED'
    END)::"DataQuality_new";
ALTER TABLE "OptionAvailability" ALTER COLUMN "dataQuality" TYPE "DataQuality_new" USING (CASE "dataQuality"::text
      WHEN 'CONFIRMED' THEN 'VERIFIED'
      WHEN 'EXPERIENCE' THEN 'EXPERIENCE'
      WHEN 'CONFLICTING' THEN 'NEEDS_REVIEW'
      ELSE 'UNVERIFIED'
    END)::"DataQuality_new";
ALTER TABLE "EquipmentPackage" ALTER COLUMN "dataQuality" TYPE "DataQuality_new" USING (CASE "dataQuality"::text
      WHEN 'CONFIRMED' THEN 'VERIFIED'
      WHEN 'EXPERIENCE' THEN 'EXPERIENCE'
      WHEN 'CONFLICTING' THEN 'NEEDS_REVIEW'
      ELSE 'UNVERIFIED'
    END)::"DataQuality_new";
ALTER TABLE "EngineFamily" ALTER COLUMN "dataQuality" TYPE "DataQuality_new" USING (CASE "dataQuality"::text
      WHEN 'CONFIRMED' THEN 'VERIFIED'
      WHEN 'EXPERIENCE' THEN 'EXPERIENCE'
      WHEN 'CONFLICTING' THEN 'NEEDS_REVIEW'
      ELSE 'UNVERIFIED'
    END)::"DataQuality_new";
ALTER TABLE "ModelYear" ALTER COLUMN "dataQuality" TYPE "DataQuality_new" USING (CASE "dataQuality"::text
      WHEN 'CONFIRMED' THEN 'VERIFIED'
      WHEN 'EXPERIENCE' THEN 'EXPERIENCE'
      WHEN 'CONFLICTING' THEN 'NEEDS_REVIEW'
      ELSE 'UNVERIFIED'
    END)::"DataQuality_new";
ALTER TABLE "PaintColor" ALTER COLUMN "dataQuality" TYPE "DataQuality_new" USING (CASE "dataQuality"::text
      WHEN 'CONFIRMED' THEN 'VERIFIED'
      WHEN 'EXPERIENCE' THEN 'EXPERIENCE'
      WHEN 'CONFLICTING' THEN 'NEEDS_REVIEW'
      ELSE 'UNVERIFIED'
    END)::"DataQuality_new";
ALTER TABLE "PaintColorAvailability" ALTER COLUMN "dataQuality" TYPE "DataQuality_new" USING (CASE "dataQuality"::text
      WHEN 'CONFIRMED' THEN 'VERIFIED'
      WHEN 'EXPERIENCE' THEN 'EXPERIENCE'
      WHEN 'CONFLICTING' THEN 'NEEDS_REVIEW'
      ELSE 'UNVERIFIED'
    END)::"DataQuality_new";
ALTER TABLE "WheelOption" ALTER COLUMN "dataQuality" TYPE "DataQuality_new" USING (CASE "dataQuality"::text
      WHEN 'CONFIRMED' THEN 'VERIFIED'
      WHEN 'EXPERIENCE' THEN 'EXPERIENCE'
      WHEN 'CONFLICTING' THEN 'NEEDS_REVIEW'
      ELSE 'UNVERIFIED'
    END)::"DataQuality_new";
ALTER TABLE "WheelOptionAvailability" ALTER COLUMN "dataQuality" TYPE "DataQuality_new" USING (CASE "dataQuality"::text
      WHEN 'CONFIRMED' THEN 'VERIFIED'
      WHEN 'EXPERIENCE' THEN 'EXPERIENCE'
      WHEN 'CONFLICTING' THEN 'NEEDS_REVIEW'
      ELSE 'UNVERIFIED'
    END)::"DataQuality_new";
ALTER TABLE "SpecialEdition" ALTER COLUMN "dataQuality" TYPE "DataQuality_new" USING (CASE "dataQuality"::text
      WHEN 'CONFIRMED' THEN 'VERIFIED'
      WHEN 'EXPERIENCE' THEN 'EXPERIENCE'
      WHEN 'CONFLICTING' THEN 'NEEDS_REVIEW'
      ELSE 'UNVERIFIED'
    END)::"DataQuality_new";
ALTER TABLE "HsnTsnEntry" ALTER COLUMN "dataQuality" TYPE "DataQuality_new" USING (CASE "dataQuality"::text
      WHEN 'CONFIRMED' THEN 'VERIFIED'
      WHEN 'EXPERIENCE' THEN 'EXPERIENCE'
      WHEN 'CONFLICTING' THEN 'NEEDS_REVIEW'
      ELSE 'UNVERIFIED'
    END)::"DataQuality_new";
ALTER TYPE "DataQuality" RENAME TO "DataQuality_old";
ALTER TYPE "DataQuality_new" RENAME TO "DataQuality";
DROP TYPE "public"."DataQuality_old";
ALTER TABLE "Engine" ALTER COLUMN "dataQuality" SET DEFAULT 'UNVERIFIED';
ALTER TABLE "EngineFamily" ALTER COLUMN "dataQuality" SET DEFAULT 'UNVERIFIED';
ALTER TABLE "EquipmentPackage" ALTER COLUMN "dataQuality" SET DEFAULT 'UNVERIFIED';
ALTER TABLE "FaceliftPhase" ALTER COLUMN "dataQuality" SET DEFAULT 'UNVERIFIED';
ALTER TABLE "Generation" ALTER COLUMN "dataQuality" SET DEFAULT 'UNVERIFIED';
ALTER TABLE "HsnTsnEntry" ALTER COLUMN "dataQuality" SET DEFAULT 'UNVERIFIED';
ALTER TABLE "ModelYear" ALTER COLUMN "dataQuality" SET DEFAULT 'UNVERIFIED';
ALTER TABLE "OptionAvailability" ALTER COLUMN "dataQuality" SET DEFAULT 'UNVERIFIED';
ALTER TABLE "OptionalEquipment" ALTER COLUMN "dataQuality" SET DEFAULT 'UNVERIFIED';
ALTER TABLE "PaintColor" ALTER COLUMN "dataQuality" SET DEFAULT 'UNVERIFIED';
ALTER TABLE "PaintColorAvailability" ALTER COLUMN "dataQuality" SET DEFAULT 'UNVERIFIED';
ALTER TABLE "PowertrainCombination" ALTER COLUMN "dataQuality" SET DEFAULT 'UNVERIFIED';
ALTER TABLE "SpecialEdition" ALTER COLUMN "dataQuality" SET DEFAULT 'UNVERIFIED';
ALTER TABLE "TrimLine" ALTER COLUMN "dataQuality" SET DEFAULT 'UNVERIFIED';
ALTER TABLE "WheelOption" ALTER COLUMN "dataQuality" SET DEFAULT 'UNVERIFIED';
ALTER TABLE "WheelOptionAvailability" ALTER COLUMN "dataQuality" SET DEFAULT 'UNVERIFIED';
COMMIT;

-- AlterEnum
ALTER TYPE "ImageOrigin" ADD VALUE 'AI_GENERATED';

-- DropIndex
DROP INDEX "CatalogImage_subjectType_subjectId_status_idx";

-- AlterTable
ALTER TABLE "CatalogImage" DROP COLUMN "subjectId",
DROP COLUMN "subjectType",
ADD COLUMN     "background" "ImageBackground" NOT NULL DEFAULT 'UNKNOWN',
ADD COLUMN     "bodyTypeId" TEXT,
ADD COLUMN     "dataQuality" "DataQuality" NOT NULL DEFAULT 'UNVERIFIED',
ADD COLUMN     "faceliftPhaseId" TEXT,
ADD COLUMN     "generatedAt" TIMESTAMP(3),
ADD COLUMN     "generatedByModel" TEXT,
ADD COLUMN     "generatedPrompt" TEXT,
ADD COLUMN     "generationId" TEXT,
ADD COLUMN     "kind" "ImageKind" NOT NULL,
ADD COLUMN     "lastVerifiedAt" TIMESTAMP(3),
ADD COLUMN     "optionId" TEXT,
ADD COLUMN     "paintColorId" TEXT,
ADD COLUMN     "powertrainId" TEXT,
ADD COLUMN     "specialEditionId" TEXT,
ADD COLUMN     "trimLineId" TEXT,
ADD COLUMN     "wheelOptionId" TEXT,
ADD COLUMN     "yearFrom" INTEGER,
ADD COLUMN     "yearTo" INTEGER,
ALTER COLUMN "sourceUrl" DROP NOT NULL,
ALTER COLUMN "sourceTitle" DROP NOT NULL,
ALTER COLUMN "author" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Engine" ALTER COLUMN "dataQuality" SET DEFAULT 'UNVERIFIED';

-- AlterTable
ALTER TABLE "EngineFamily" ALTER COLUMN "dataQuality" SET DEFAULT 'UNVERIFIED';

-- AlterTable
ALTER TABLE "EquipmentPackage" ALTER COLUMN "dataQuality" SET DEFAULT 'UNVERIFIED';

-- AlterTable
ALTER TABLE "FaceliftPhase" ALTER COLUMN "dataQuality" SET DEFAULT 'UNVERIFIED';

-- AlterTable
ALTER TABLE "Generation" ALTER COLUMN "dataQuality" SET DEFAULT 'UNVERIFIED';

-- AlterTable
ALTER TABLE "HsnTsnEntry" ALTER COLUMN "dataQuality" SET DEFAULT 'UNVERIFIED';

-- AlterTable
ALTER TABLE "ModelYear" ALTER COLUMN "dataQuality" SET DEFAULT 'UNVERIFIED';

-- AlterTable
ALTER TABLE "OptionAvailability" ALTER COLUMN "dataQuality" SET DEFAULT 'UNVERIFIED';

-- AlterTable
ALTER TABLE "OptionalEquipment" ALTER COLUMN "dataQuality" SET DEFAULT 'UNVERIFIED';

-- AlterTable
ALTER TABLE "PaintColor" ALTER COLUMN "dataQuality" SET DEFAULT 'UNVERIFIED';

-- AlterTable
ALTER TABLE "PaintColorAvailability" ALTER COLUMN "dataQuality" SET DEFAULT 'UNVERIFIED';

-- AlterTable
ALTER TABLE "PowertrainCombination" ALTER COLUMN "dataQuality" SET DEFAULT 'UNVERIFIED';

-- AlterTable
ALTER TABLE "SpecialEdition" ALTER COLUMN "dataQuality" SET DEFAULT 'UNVERIFIED';

-- AlterTable
ALTER TABLE "TrimLine" ALTER COLUMN "dataQuality" SET DEFAULT 'UNVERIFIED';

-- AlterTable
ALTER TABLE "WheelOption" ALTER COLUMN "dataQuality" SET DEFAULT 'UNVERIFIED';

-- AlterTable
ALTER TABLE "WheelOptionAvailability" ALTER COLUMN "dataQuality" SET DEFAULT 'UNVERIFIED';

-- CreateIndex
CREATE INDEX "CatalogImage_generationId_kind_status_idx" ON "CatalogImage"("generationId", "kind", "status");

-- CreateIndex
CREATE INDEX "CatalogImage_optionId_status_idx" ON "CatalogImage"("optionId", "status");

-- CreateIndex
CREATE INDEX "CatalogImage_faceliftPhaseId_idx" ON "CatalogImage"("faceliftPhaseId");

-- CreateIndex
CREATE INDEX "CatalogImage_paintColorId_idx" ON "CatalogImage"("paintColorId");

-- CreateIndex
CREATE INDEX "CatalogImage_wheelOptionId_idx" ON "CatalogImage"("wheelOptionId");

-- CreateIndex
CREATE INDEX "CatalogImage_origin_idx" ON "CatalogImage"("origin");

-- AddForeignKey
ALTER TABLE "CatalogImage" ADD CONSTRAINT "CatalogImage_generationId_fkey" FOREIGN KEY ("generationId") REFERENCES "Generation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CatalogImage" ADD CONSTRAINT "CatalogImage_faceliftPhaseId_fkey" FOREIGN KEY ("faceliftPhaseId") REFERENCES "FaceliftPhase"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CatalogImage" ADD CONSTRAINT "CatalogImage_bodyTypeId_fkey" FOREIGN KEY ("bodyTypeId") REFERENCES "BodyType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CatalogImage" ADD CONSTRAINT "CatalogImage_trimLineId_fkey" FOREIGN KEY ("trimLineId") REFERENCES "TrimLine"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CatalogImage" ADD CONSTRAINT "CatalogImage_powertrainId_fkey" FOREIGN KEY ("powertrainId") REFERENCES "PowertrainCombination"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CatalogImage" ADD CONSTRAINT "CatalogImage_specialEditionId_fkey" FOREIGN KEY ("specialEditionId") REFERENCES "SpecialEdition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CatalogImage" ADD CONSTRAINT "CatalogImage_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "OptionalEquipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CatalogImage" ADD CONSTRAINT "CatalogImage_paintColorId_fkey" FOREIGN KEY ("paintColorId") REFERENCES "PaintColor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CatalogImage" ADD CONSTRAINT "CatalogImage_wheelOptionId_fkey" FOREIGN KEY ("wheelOptionId") REFERENCES "WheelOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

