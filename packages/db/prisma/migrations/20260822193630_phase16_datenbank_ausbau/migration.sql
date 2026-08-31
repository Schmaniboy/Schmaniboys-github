-- CreateEnum
CREATE TYPE "DataQuality" AS ENUM ('CONFIRMED', 'EXPERIENCE', 'UNCERTAIN', 'CONFLICTING');

-- CreateEnum
CREATE TYPE "AvailabilityKind" AS ENUM ('STANDARD', 'OPTIONAL', 'PACKAGE_ONLY', 'SPECIAL_EDITION_ONLY', 'MARKET_SPECIFIC');

-- CreateEnum
CREATE TYPE "PaintKind" AS ENUM ('UNI', 'METALLIC', 'PEARL_EFFECT', 'MATTE', 'SPECIAL_ORDER', 'OTHER');

-- CreateEnum
CREATE TYPE "ImageOrigin" AS ENUM ('MANUFACTURER', 'PRESS', 'WIKIMEDIA', 'ARCHIVE', 'OWN_PHOTO');

-- AlterTable
ALTER TABLE "Engine" ADD COLUMN     "chargingDetail" TEXT,
ADD COLUMN     "cylinderLayout" TEXT,
ADD COLUMN     "dataQuality" "DataQuality" NOT NULL DEFAULT 'UNCERTAIN',
ADD COLUMN     "emissionStandard" TEXT,
ADD COLUMN     "engineFamilyId" TEXT,
ADD COLUMN     "injectionSystem" TEXT,
ADD COLUMN     "lastVerifiedAt" TIMESTAMP(3),
ADD COLUMN     "powerStage" TEXT,
ADD COLUMN     "valvetrain" TEXT,
ADD COLUMN     "yearFrom" INTEGER,
ADD COLUMN     "yearTo" INTEGER;

-- AlterTable
ALTER TABLE "EquipmentPackage" ADD COLUMN     "dataQuality" "DataQuality" NOT NULL DEFAULT 'UNCERTAIN',
ADD COLUMN     "lastVerifiedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "FaceliftPhase" ADD COLUMN     "dataQuality" "DataQuality" NOT NULL DEFAULT 'UNCERTAIN',
ADD COLUMN     "lastVerifiedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Generation" ADD COLUMN     "dataQuality" "DataQuality" NOT NULL DEFAULT 'UNCERTAIN',
ADD COLUMN     "lastVerifiedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "OptionAvailability" ADD COLUMN     "dataQuality" "DataQuality" NOT NULL DEFAULT 'UNCERTAIN',
ADD COLUMN     "faceliftPhaseId" TEXT,
ADD COLUMN     "kind" "AvailabilityKind" NOT NULL DEFAULT 'OPTIONAL',
ADD COLUMN     "lastVerifiedAt" TIMESTAMP(3),
ADD COLUMN     "marketRegion" TEXT,
ADD COLUMN     "modelYearFrom" INTEGER,
ADD COLUMN     "modelYearTo" INTEGER,
ADD COLUMN     "specialEditionId" TEXT,
ADD COLUMN     "surchargeAsOf" TIMESTAMP(3),
ADD COLUMN     "surchargeCents" INTEGER,
ADD COLUMN     "surchargeCurrency" TEXT DEFAULT 'EUR';

-- Bestehende Angaben uebernehmen, BEVOR die alte Spalte faellt.
--
-- `standard` kannte nur zwei Zustaende. Die feineren Faelle -- nur im Paket,
-- nur im Sondermodell, marktabhaengig -- lassen sich daraus nicht ableiten
-- und werden deshalb NICHT geraten: Was ein Paket zugeordnet hat, wird als
-- Paketbestandteil uebernommen, alles Uebrige als Sonderausstattung. Die
-- Guete bleibt auf UNCERTAIN, bis eine Redakteurin den Fall geprueft hat.
UPDATE "OptionAvailability"
SET "kind" = CASE
  WHEN "standard" THEN 'STANDARD'::"AvailabilityKind"
  WHEN "packageId" IS NOT NULL THEN 'PACKAGE_ONLY'::"AvailabilityKind"
  ELSE 'OPTIONAL'::"AvailabilityKind"
END;

ALTER TABLE "OptionAvailability" DROP COLUMN "standard";

-- AlterTable
ALTER TABLE "OptionalEquipment" ADD COLUMN     "area" TEXT,
ADD COLUMN     "dataQuality" "DataQuality" NOT NULL DEFAULT 'UNCERTAIN',
ADD COLUMN     "lastVerifiedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "PowertrainCombination" ADD COLUMN     "dataQuality" "DataQuality" NOT NULL DEFAULT 'UNCERTAIN',
ADD COLUMN     "faceliftPhaseId" TEXT,
ADD COLUMN     "lastVerifiedAt" TIMESTAMP(3),
ADD COLUMN     "marketRegion" TEXT,
ADD COLUMN     "modelYearFrom" INTEGER,
ADD COLUMN     "modelYearTo" INTEGER;

-- AlterTable
ALTER TABLE "TrimLine" ADD COLUMN     "dataQuality" "DataQuality" NOT NULL DEFAULT 'UNCERTAIN',
ADD COLUMN     "lastVerifiedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "EngineFamily" (
    "id" TEXT NOT NULL,
    "manufacturerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "generationLabel" TEXT,
    "description" TEXT,
    "yearFrom" INTEGER,
    "yearTo" INTEGER,
    "status" "EditorialStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "dataQuality" "DataQuality" NOT NULL DEFAULT 'UNCERTAIN',
    "lastVerifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EngineFamily_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModelYear" (
    "id" TEXT NOT NULL,
    "generationId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "faceliftPhaseId" TEXT,
    "productionFrom" TIMESTAMP(3),
    "productionTo" TIMESTAMP(3),
    "changes" TEXT,
    "status" "EditorialStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "dataQuality" "DataQuality" NOT NULL DEFAULT 'UNCERTAIN',
    "lastVerifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ModelYear_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaintColor" (
    "id" TEXT NOT NULL,
    "manufacturerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "code" TEXT,
    "kind" "PaintKind" NOT NULL DEFAULT 'OTHER',
    "approximateHex" TEXT,
    "description" TEXT,
    "rarity" "Rarity",
    "rarityEvidenceType" "EvidenceType",
    "rarityConfidence" "ConfidenceLevel" NOT NULL DEFAULT 'MEDIUM',
    "rarityReasoning" TEXT,
    "rarityDataBasis" TEXT,
    "rarityObservedAt" TIMESTAMP(3),
    "raritySampleSize" INTEGER,
    "status" "EditorialStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "dataQuality" "DataQuality" NOT NULL DEFAULT 'UNCERTAIN',
    "lastVerifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaintColor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaintColorAvailability" (
    "id" TEXT NOT NULL,
    "paintColorId" TEXT NOT NULL,
    "generationId" TEXT NOT NULL,
    "faceliftPhaseId" TEXT,
    "kind" "AvailabilityKind" NOT NULL DEFAULT 'OPTIONAL',
    "yearFrom" INTEGER,
    "yearTo" INTEGER,
    "surchargeCents" INTEGER,
    "surchargeCurrency" TEXT DEFAULT 'EUR',
    "surchargeAsOf" TIMESTAMP(3),
    "marketRegion" TEXT,
    "note" TEXT,
    "dataQuality" "DataQuality" NOT NULL DEFAULT 'UNCERTAIN',
    "lastVerifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaintColorAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WheelOption" (
    "id" TEXT NOT NULL,
    "manufacturerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "code" TEXT,
    "diameterInch" INTEGER,
    "widthInch" DECIMAL(3,1),
    "tyreSize" TEXT,
    "design" TEXT,
    "rarity" "Rarity",
    "rarityEvidenceType" "EvidenceType",
    "rarityConfidence" "ConfidenceLevel" NOT NULL DEFAULT 'MEDIUM',
    "rarityReasoning" TEXT,
    "rarityDataBasis" TEXT,
    "status" "EditorialStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "dataQuality" "DataQuality" NOT NULL DEFAULT 'UNCERTAIN',
    "lastVerifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WheelOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WheelOptionAvailability" (
    "id" TEXT NOT NULL,
    "wheelOptionId" TEXT NOT NULL,
    "generationId" TEXT NOT NULL,
    "trimLineId" TEXT,
    "kind" "AvailabilityKind" NOT NULL DEFAULT 'OPTIONAL',
    "yearFrom" INTEGER,
    "yearTo" INTEGER,
    "surchargeCents" INTEGER,
    "surchargeCurrency" TEXT DEFAULT 'EUR',
    "note" TEXT,
    "dataQuality" "DataQuality" NOT NULL DEFAULT 'UNCERTAIN',
    "lastVerifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "faceliftPhaseId" TEXT,

    CONSTRAINT "WheelOptionAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpecialEdition" (
    "id" TEXT NOT NULL,
    "generationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "code" TEXT,
    "faceliftPhaseId" TEXT,
    "yearFrom" INTEGER,
    "yearTo" INTEGER,
    "buildCount" INTEGER,
    "marketRegion" TEXT,
    "description" TEXT,
    "distinguishingFeatures" TEXT,
    "status" "EditorialStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "dataQuality" "DataQuality" NOT NULL DEFAULT 'UNCERTAIN',
    "lastVerifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SpecialEdition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpecialEditionItem" (
    "id" TEXT NOT NULL,
    "specialEditionId" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    "optional" BOOLEAN NOT NULL DEFAULT false,
    "note" TEXT,

    CONSTRAINT "SpecialEditionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CatalogImage" (
    "id" TEXT NOT NULL,
    "subjectType" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "origin" "ImageOrigin" NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "sourceTitle" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "licence" TEXT NOT NULL,
    "licenceUrl" TEXT,
    "description" TEXT NOT NULL,
    "storageKey" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "capturedOn" TIMESTAMP(3),
    "status" "EditorialStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "sortIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CatalogImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HsnTsnEntry" (
    "id" TEXT NOT NULL,
    "hsn" TEXT NOT NULL,
    "tsn" TEXT NOT NULL,
    "manufacturerName" TEXT NOT NULL,
    "typeName" TEXT NOT NULL,
    "generationId" TEXT,
    "powertrainId" TEXT,
    "yearFrom" INTEGER,
    "yearTo" INTEGER,
    "note" TEXT,
    "status" "EditorialStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "dataQuality" "DataQuality" NOT NULL DEFAULT 'UNCERTAIN',
    "lastVerifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HsnTsnEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserVehicle" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "generationId" TEXT,
    "faceliftPhaseId" TEXT,
    "powertrainId" TEXT,
    "paintColorId" TEXT,
    "vin" TEXT,
    "vinConfirmedByOwner" BOOLEAN NOT NULL DEFAULT false,
    "modelYear" INTEGER,
    "firstRegistrationOn" TIMESTAMP(3),
    "mileageKm" INTEGER,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserVehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserVehicleEquipment" (
    "id" TEXT NOT NULL,
    "userVehicleId" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserVehicleEquipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CatalogFavorite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subjectType" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CatalogFavorite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EngineFamily_status_idx" ON "EngineFamily"("status");

-- CreateIndex
CREATE UNIQUE INDEX "EngineFamily_manufacturerId_slug_key" ON "EngineFamily"("manufacturerId", "slug");

-- CreateIndex
CREATE INDEX "ModelYear_year_idx" ON "ModelYear"("year");

-- CreateIndex
CREATE UNIQUE INDEX "ModelYear_generationId_year_key" ON "ModelYear"("generationId", "year");

-- CreateIndex
CREATE INDEX "PaintColor_status_idx" ON "PaintColor"("status");

-- CreateIndex
CREATE INDEX "PaintColor_code_idx" ON "PaintColor"("code");

-- CreateIndex
CREATE UNIQUE INDEX "PaintColor_manufacturerId_slug_key" ON "PaintColor"("manufacturerId", "slug");

-- CreateIndex
CREATE INDEX "PaintColorAvailability_generationId_idx" ON "PaintColorAvailability"("generationId");

-- CreateIndex
CREATE UNIQUE INDEX "PaintColorAvailability_paintColorId_generationId_faceliftPh_key" ON "PaintColorAvailability"("paintColorId", "generationId", "faceliftPhaseId");

-- CreateIndex
CREATE INDEX "WheelOption_status_idx" ON "WheelOption"("status");

-- CreateIndex
CREATE UNIQUE INDEX "WheelOption_manufacturerId_slug_key" ON "WheelOption"("manufacturerId", "slug");

-- CreateIndex
CREATE INDEX "WheelOptionAvailability_generationId_idx" ON "WheelOptionAvailability"("generationId");

-- CreateIndex
CREATE UNIQUE INDEX "WheelOptionAvailability_wheelOptionId_generationId_trimLine_key" ON "WheelOptionAvailability"("wheelOptionId", "generationId", "trimLineId");

-- CreateIndex
CREATE INDEX "SpecialEdition_status_idx" ON "SpecialEdition"("status");

-- CreateIndex
CREATE UNIQUE INDEX "SpecialEdition_generationId_slug_key" ON "SpecialEdition"("generationId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "SpecialEditionItem_specialEditionId_optionId_key" ON "SpecialEditionItem"("specialEditionId", "optionId");

-- CreateIndex
CREATE INDEX "CatalogImage_subjectType_subjectId_status_idx" ON "CatalogImage"("subjectType", "subjectId", "status");

-- CreateIndex
CREATE INDEX "HsnTsnEntry_hsn_tsn_idx" ON "HsnTsnEntry"("hsn", "tsn");

-- CreateIndex
CREATE INDEX "HsnTsnEntry_generationId_idx" ON "HsnTsnEntry"("generationId");

-- CreateIndex
CREATE UNIQUE INDEX "HsnTsnEntry_hsn_tsn_typeName_key" ON "HsnTsnEntry"("hsn", "tsn", "typeName");

-- CreateIndex
CREATE INDEX "UserVehicle_userId_createdAt_idx" ON "UserVehicle"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "UserVehicle_generationId_idx" ON "UserVehicle"("generationId");

-- CreateIndex
CREATE UNIQUE INDEX "UserVehicleEquipment_userVehicleId_optionId_key" ON "UserVehicleEquipment"("userVehicleId", "optionId");

-- CreateIndex
CREATE INDEX "CatalogFavorite_userId_createdAt_idx" ON "CatalogFavorite"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "CatalogFavorite_subjectType_subjectId_idx" ON "CatalogFavorite"("subjectType", "subjectId");

-- CreateIndex
CREATE UNIQUE INDEX "CatalogFavorite_userId_subjectType_subjectId_key" ON "CatalogFavorite"("userId", "subjectType", "subjectId");

-- CreateIndex
CREATE INDEX "Engine_engineFamilyId_idx" ON "Engine"("engineFamilyId");

-- CreateIndex
CREATE INDEX "Engine_code_idx" ON "Engine"("code");

-- CreateIndex
CREATE INDEX "OptionAvailability_generationId_kind_idx" ON "OptionAvailability"("generationId", "kind");

-- CreateIndex
CREATE INDEX "OptionAvailability_specialEditionId_idx" ON "OptionAvailability"("specialEditionId");

-- CreateIndex
CREATE INDEX "OptionalEquipment_area_idx" ON "OptionalEquipment"("area");

-- CreateIndex
CREATE INDEX "OptionalEquipment_optionCode_idx" ON "OptionalEquipment"("optionCode");

-- AddForeignKey
ALTER TABLE "Engine" ADD CONSTRAINT "Engine_engineFamilyId_fkey" FOREIGN KEY ("engineFamilyId") REFERENCES "EngineFamily"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PowertrainCombination" ADD CONSTRAINT "PowertrainCombination_faceliftPhaseId_fkey" FOREIGN KEY ("faceliftPhaseId") REFERENCES "FaceliftPhase"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OptionAvailability" ADD CONSTRAINT "OptionAvailability_specialEditionId_fkey" FOREIGN KEY ("specialEditionId") REFERENCES "SpecialEdition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OptionAvailability" ADD CONSTRAINT "OptionAvailability_faceliftPhaseId_fkey" FOREIGN KEY ("faceliftPhaseId") REFERENCES "FaceliftPhase"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EngineFamily" ADD CONSTRAINT "EngineFamily_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "Manufacturer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModelYear" ADD CONSTRAINT "ModelYear_generationId_fkey" FOREIGN KEY ("generationId") REFERENCES "Generation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModelYear" ADD CONSTRAINT "ModelYear_faceliftPhaseId_fkey" FOREIGN KEY ("faceliftPhaseId") REFERENCES "FaceliftPhase"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaintColor" ADD CONSTRAINT "PaintColor_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "Manufacturer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaintColorAvailability" ADD CONSTRAINT "PaintColorAvailability_paintColorId_fkey" FOREIGN KEY ("paintColorId") REFERENCES "PaintColor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaintColorAvailability" ADD CONSTRAINT "PaintColorAvailability_generationId_fkey" FOREIGN KEY ("generationId") REFERENCES "Generation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaintColorAvailability" ADD CONSTRAINT "PaintColorAvailability_faceliftPhaseId_fkey" FOREIGN KEY ("faceliftPhaseId") REFERENCES "FaceliftPhase"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WheelOption" ADD CONSTRAINT "WheelOption_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "Manufacturer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WheelOptionAvailability" ADD CONSTRAINT "WheelOptionAvailability_wheelOptionId_fkey" FOREIGN KEY ("wheelOptionId") REFERENCES "WheelOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WheelOptionAvailability" ADD CONSTRAINT "WheelOptionAvailability_generationId_fkey" FOREIGN KEY ("generationId") REFERENCES "Generation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WheelOptionAvailability" ADD CONSTRAINT "WheelOptionAvailability_trimLineId_fkey" FOREIGN KEY ("trimLineId") REFERENCES "TrimLine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WheelOptionAvailability" ADD CONSTRAINT "WheelOptionAvailability_faceliftPhaseId_fkey" FOREIGN KEY ("faceliftPhaseId") REFERENCES "FaceliftPhase"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpecialEdition" ADD CONSTRAINT "SpecialEdition_generationId_fkey" FOREIGN KEY ("generationId") REFERENCES "Generation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpecialEdition" ADD CONSTRAINT "SpecialEdition_faceliftPhaseId_fkey" FOREIGN KEY ("faceliftPhaseId") REFERENCES "FaceliftPhase"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpecialEditionItem" ADD CONSTRAINT "SpecialEditionItem_specialEditionId_fkey" FOREIGN KEY ("specialEditionId") REFERENCES "SpecialEdition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpecialEditionItem" ADD CONSTRAINT "SpecialEditionItem_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "OptionalEquipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HsnTsnEntry" ADD CONSTRAINT "HsnTsnEntry_generationId_fkey" FOREIGN KEY ("generationId") REFERENCES "Generation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HsnTsnEntry" ADD CONSTRAINT "HsnTsnEntry_powertrainId_fkey" FOREIGN KEY ("powertrainId") REFERENCES "PowertrainCombination"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserVehicle" ADD CONSTRAINT "UserVehicle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserVehicle" ADD CONSTRAINT "UserVehicle_generationId_fkey" FOREIGN KEY ("generationId") REFERENCES "Generation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserVehicle" ADD CONSTRAINT "UserVehicle_faceliftPhaseId_fkey" FOREIGN KEY ("faceliftPhaseId") REFERENCES "FaceliftPhase"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserVehicle" ADD CONSTRAINT "UserVehicle_powertrainId_fkey" FOREIGN KEY ("powertrainId") REFERENCES "PowertrainCombination"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserVehicle" ADD CONSTRAINT "UserVehicle_paintColorId_fkey" FOREIGN KEY ("paintColorId") REFERENCES "PaintColor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserVehicleEquipment" ADD CONSTRAINT "UserVehicleEquipment_userVehicleId_fkey" FOREIGN KEY ("userVehicleId") REFERENCES "UserVehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserVehicleEquipment" ADD CONSTRAINT "UserVehicleEquipment_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "OptionalEquipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CatalogFavorite" ADD CONSTRAINT "CatalogFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

