-- CreateEnum
CREATE TYPE "ListingDraftStatus" AS ENUM ('VIN_ENTERED', 'VEHICLE_CONFIRMED', 'DETAILS_PROVIDED', 'TEXT_GENERATED', 'PUBLISHED', 'ABANDONED');

-- CreateEnum
CREATE TYPE "VehicleCondition" AS ENUM ('EXCELLENT', 'GOOD', 'FAIR', 'POOR');

-- CreateEnum
CREATE TYPE "ServiceHistoryKind" AS ENUM ('FULL_MANUFACTURER', 'FULL_INDEPENDENT', 'PARTIAL', 'NONE', 'UNKNOWN');

-- CreateTable
CREATE TABLE "ListingDraft" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "status" "ListingDraftStatus" NOT NULL DEFAULT 'VIN_ENTERED',
    "vin" TEXT,
    "vinHash" TEXT,
    "manufacturerId" TEXT,
    "modelId" TEXT,
    "generationId" TEXT,
    "powertrainId" TEXT,
    "trimLineId" TEXT,
    "catalogConfirmedAt" TIMESTAMP(3),
    "mileageKm" INTEGER,
    "firstRegistration" TIMESTAMP(3),
    "previousOwners" INTEGER,
    "huValidUntil" TIMESTAMP(3),
    "serviceHistory" "ServiceHistoryKind",
    "condition" "VehicleCondition",
    "tyreCondition" TEXT,
    "damages" TEXT,
    "hadAccident" BOOLEAN,
    "accidentDetails" TEXT,
    "additionalNotes" TEXT,
    "generatedTitle" TEXT,
    "generatedShortText" TEXT,
    "generatedLongText" TEXT,
    "generatedClassifiedText" TEXT,
    "generatedAt" TIMESTAMP(3),
    "generationModel" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ListingDraft_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ListingDraft_ownerId_status_idx" ON "ListingDraft"("ownerId", "status");

-- CreateIndex
CREATE INDEX "ListingDraft_vinHash_idx" ON "ListingDraft"("vinHash");

-- AddForeignKey
ALTER TABLE "ListingDraft" ADD CONSTRAINT "ListingDraft_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

