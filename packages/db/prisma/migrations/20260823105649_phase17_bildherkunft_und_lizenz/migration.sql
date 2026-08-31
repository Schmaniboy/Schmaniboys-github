-- CreateEnum
CREATE TYPE "ImageSourceType" AS ENUM ('ORIGINAL', 'LICENSED', 'GENERATED');

-- CreateEnum
CREATE TYPE "ImageLicenceStatus" AS ENUM ('CLEARED', 'ATTRIBUTION_REQUIRED', 'EDITORIAL_ONLY', 'UNCLEAR', 'NOT_CLEARED');

-- AlterTable
ALTER TABLE "CatalogImage" ADD COLUMN     "generatedFromFields" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "licenceStatus" "ImageLicenceStatus" NOT NULL DEFAULT 'UNCLEAR',
ADD COLUMN     "sourceType" "ImageSourceType";

-- Bestehende Bilder einordnen, BEVOR die Spalte Pflicht wird.
--
-- Ableitbar ist nur der eindeutige Fall: Was als erzeugt erfasst ist, ist
-- erzeugt. Alles Uebrige wird als aufgefundenes Original eingeordnet und
-- NICHT als lizenziert -- lizenziert hiesse, jemand haette eine
-- Nutzungserlaubnis eingeholt, und das laesst sich nicht aus der Herkunft
-- ableiten. Der Lizenzstatus bleibt auf UNCLEAR, bis jemand ihn prueft;
-- damit wird keines dieser Bilder veroeffentlicht.
UPDATE "CatalogImage"
SET "sourceType" = CASE
  WHEN "origin" = 'AI_GENERATED' THEN 'GENERATED'::"ImageSourceType"
  ELSE 'ORIGINAL'::"ImageSourceType"
END
WHERE "sourceType" IS NULL;

ALTER TABLE "CatalogImage" ALTER COLUMN "sourceType" SET NOT NULL;

-- CreateIndex
CREATE INDEX "CatalogImage_sourceType_idx" ON "CatalogImage"("sourceType");

-- CreateIndex
CREATE INDEX "CatalogImage_licenceStatus_idx" ON "CatalogImage"("licenceStatus");

