-- CreateEnum
CREATE TYPE "EditorialStatus" AS ENUM ('DRAFT', 'IN_REVIEW', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "FuelType" AS ENUM ('PETROL', 'DIESEL', 'HYBRID_PETROL', 'HYBRID_DIESEL', 'PLUGIN_HYBRID', 'ELECTRIC', 'LPG', 'CNG', 'HYDROGEN', 'OTHER');

-- CreateEnum
CREATE TYPE "Aspiration" AS ENUM ('NATURALLY_ASPIRATED', 'TURBOCHARGED', 'SUPERCHARGED', 'TWINCHARGED', 'ELECTRIC_DRIVE', 'OTHER');

-- CreateEnum
CREATE TYPE "TransmissionType" AS ENUM ('MANUAL', 'AUTOMATIC_TORQUE_CONVERTER', 'AUTOMATED_MANUAL', 'DUAL_CLUTCH', 'CVT', 'REDUCTION_GEAR', 'OTHER');

-- CreateEnum
CREATE TYPE "DriveType" AS ENUM ('FRONT', 'REAR', 'ALL');

-- CreateEnum
CREATE TYPE "MeasurementStandard" AS ENUM ('NEDC', 'WLTP', 'EPA', 'MANUFACTURER', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "SourceKind" AS ENUM ('MANUFACTURER_DOCUMENT', 'TYPE_APPROVAL', 'PRESS_RELEASE', 'TECHNICAL_LITERATURE', 'MEASUREMENT', 'OTHER');

-- CreateTable
CREATE TABLE "Source" (
    "id" TEXT NOT NULL,
    "subjectType" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "kind" "SourceKind" NOT NULL DEFAULT 'OTHER',
    "title" TEXT NOT NULL,
    "url" TEXT,
    "publishedOn" TIMESTAMP(3),
    "checkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Source_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Manufacturer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "country" TEXT,
    "wmiCodes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "EditorialStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Manufacturer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BodyType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BodyType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Model" (
    "id" TEXT NOT NULL,
    "manufacturerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" "EditorialStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Model_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Generation" (
    "id" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "slug" TEXT NOT NULL,
    "bodyTypeId" TEXT,
    "yearFrom" INTEGER NOT NULL,
    "yearTo" INTEGER,
    "status" "EditorialStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Generation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FaceliftPhase" (
    "id" TEXT NOT NULL,
    "generationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "yearFrom" INTEGER NOT NULL,
    "yearTo" INTEGER,
    "distinguishingFeatures" TEXT,
    "status" "EditorialStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FaceliftPhase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Engine" (
    "id" TEXT NOT NULL,
    "manufacturerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "displacementCcm" INTEGER,
    "cylinders" INTEGER,
    "fuelType" "FuelType" NOT NULL,
    "aspiration" "Aspiration" NOT NULL DEFAULT 'OTHER',
    "powerKw" INTEGER,
    "torqueNm" INTEGER,
    "status" "EditorialStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Engine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transmission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "TransmissionType" NOT NULL,
    "gears" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PowertrainCombination" (
    "id" TEXT NOT NULL,
    "generationId" TEXT NOT NULL,
    "engineId" TEXT NOT NULL,
    "transmissionId" TEXT NOT NULL,
    "driveType" "DriveType" NOT NULL,
    "yearFrom" INTEGER,
    "yearTo" INTEGER,
    "powerKw" INTEGER,
    "torqueNm" INTEGER,
    "acceleration0to100" DECIMAL(4,1),
    "topSpeedKmh" INTEGER,
    "consumptionCombined" DECIMAL(5,2),
    "consumptionUnit" TEXT,
    "co2CombinedGramPerKm" INTEGER,
    "measurementStandard" "MeasurementStandard" NOT NULL DEFAULT 'UNKNOWN',
    "kerbWeightKg" INTEGER,
    "batteryCapacityKwh" DECIMAL(5,1),
    "fuelTankLitres" INTEGER,
    "status" "EditorialStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PowertrainCombination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrimLine" (
    "id" TEXT NOT NULL,
    "generationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "yearFrom" INTEGER,
    "yearTo" INTEGER,
    "status" "EditorialStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrimLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OptionalEquipment" (
    "id" TEXT NOT NULL,
    "manufacturerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "optionCode" TEXT,
    "category" TEXT,
    "description" TEXT,
    "howToIdentify" TEXT,
    "status" "EditorialStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OptionalEquipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OptionAvailability" (
    "id" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    "generationId" TEXT NOT NULL,
    "trimLineId" TEXT,
    "standard" BOOLEAN NOT NULL DEFAULT false,
    "yearFrom" INTEGER,
    "yearTo" INTEGER,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OptionAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EquipmentPackage" (
    "id" TEXT NOT NULL,
    "generationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "packageCode" TEXT,
    "description" TEXT,
    "status" "EditorialStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EquipmentPackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EquipmentPackageItem" (
    "id" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    "optional" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "EquipmentPackageItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Source_subjectType_subjectId_idx" ON "Source"("subjectType", "subjectId");

-- CreateIndex
CREATE UNIQUE INDEX "Manufacturer_slug_key" ON "Manufacturer"("slug");

-- CreateIndex
CREATE INDEX "Manufacturer_status_idx" ON "Manufacturer"("status");

-- CreateIndex
CREATE UNIQUE INDEX "BodyType_name_key" ON "BodyType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "BodyType_slug_key" ON "BodyType"("slug");

-- CreateIndex
CREATE INDEX "Model_status_idx" ON "Model"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Model_manufacturerId_slug_key" ON "Model"("manufacturerId", "slug");

-- CreateIndex
CREATE INDEX "Generation_status_idx" ON "Generation"("status");

-- CreateIndex
CREATE INDEX "Generation_yearFrom_yearTo_idx" ON "Generation"("yearFrom", "yearTo");

-- CreateIndex
CREATE UNIQUE INDEX "Generation_modelId_slug_key" ON "Generation"("modelId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "FaceliftPhase_generationId_slug_key" ON "FaceliftPhase"("generationId", "slug");

-- CreateIndex
CREATE INDEX "Engine_fuelType_idx" ON "Engine"("fuelType");

-- CreateIndex
CREATE INDEX "Engine_status_idx" ON "Engine"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Engine_manufacturerId_code_key" ON "Engine"("manufacturerId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "Transmission_name_type_gears_key" ON "Transmission"("name", "type", "gears");

-- CreateIndex
CREATE INDEX "PowertrainCombination_status_idx" ON "PowertrainCombination"("status");

-- CreateIndex
CREATE INDEX "PowertrainCombination_engineId_idx" ON "PowertrainCombination"("engineId");

-- CreateIndex
CREATE UNIQUE INDEX "PowertrainCombination_generationId_engineId_transmissionId__key" ON "PowertrainCombination"("generationId", "engineId", "transmissionId", "driveType");

-- CreateIndex
CREATE UNIQUE INDEX "TrimLine_generationId_slug_key" ON "TrimLine"("generationId", "slug");

-- CreateIndex
CREATE INDEX "OptionalEquipment_category_idx" ON "OptionalEquipment"("category");

-- CreateIndex
CREATE UNIQUE INDEX "OptionalEquipment_manufacturerId_slug_key" ON "OptionalEquipment"("manufacturerId", "slug");

-- CreateIndex
CREATE INDEX "OptionAvailability_generationId_idx" ON "OptionAvailability"("generationId");

-- CreateIndex
CREATE UNIQUE INDEX "OptionAvailability_optionId_generationId_trimLineId_key" ON "OptionAvailability"("optionId", "generationId", "trimLineId");

-- CreateIndex
CREATE UNIQUE INDEX "EquipmentPackage_generationId_slug_key" ON "EquipmentPackage"("generationId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "EquipmentPackageItem_packageId_optionId_key" ON "EquipmentPackageItem"("packageId", "optionId");

-- AddForeignKey
ALTER TABLE "Model" ADD CONSTRAINT "Model_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "Manufacturer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Generation" ADD CONSTRAINT "Generation_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Generation" ADD CONSTRAINT "Generation_bodyTypeId_fkey" FOREIGN KEY ("bodyTypeId") REFERENCES "BodyType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FaceliftPhase" ADD CONSTRAINT "FaceliftPhase_generationId_fkey" FOREIGN KEY ("generationId") REFERENCES "Generation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Engine" ADD CONSTRAINT "Engine_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "Manufacturer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PowertrainCombination" ADD CONSTRAINT "PowertrainCombination_generationId_fkey" FOREIGN KEY ("generationId") REFERENCES "Generation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PowertrainCombination" ADD CONSTRAINT "PowertrainCombination_engineId_fkey" FOREIGN KEY ("engineId") REFERENCES "Engine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PowertrainCombination" ADD CONSTRAINT "PowertrainCombination_transmissionId_fkey" FOREIGN KEY ("transmissionId") REFERENCES "Transmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrimLine" ADD CONSTRAINT "TrimLine_generationId_fkey" FOREIGN KEY ("generationId") REFERENCES "Generation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OptionalEquipment" ADD CONSTRAINT "OptionalEquipment_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "Manufacturer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OptionAvailability" ADD CONSTRAINT "OptionAvailability_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "OptionalEquipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OptionAvailability" ADD CONSTRAINT "OptionAvailability_generationId_fkey" FOREIGN KEY ("generationId") REFERENCES "Generation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OptionAvailability" ADD CONSTRAINT "OptionAvailability_trimLineId_fkey" FOREIGN KEY ("trimLineId") REFERENCES "TrimLine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquipmentPackage" ADD CONSTRAINT "EquipmentPackage_generationId_fkey" FOREIGN KEY ("generationId") REFERENCES "Generation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquipmentPackageItem" ADD CONSTRAINT "EquipmentPackageItem_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "EquipmentPackage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquipmentPackageItem" ADD CONSTRAINT "EquipmentPackageItem_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "OptionalEquipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
