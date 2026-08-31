-- AlterTable
ALTER TABLE "PowertrainCombination" ADD COLUMN     "doors" INTEGER,
ADD COLUMN     "electricRangeKm" INTEGER,
ADD COLUMN     "emissionStandard" TEXT,
ADD COLUMN     "payloadKg" INTEGER,
ADD COLUMN     "seats" INTEGER,
ADD COLUMN     "towingCapacityBrakedKg" INTEGER,
ADD COLUMN     "towingCapacityUnbrakedKg" INTEGER;

-- AlterTable
ALTER TABLE "Source" ADD COLUMN     "coversFields" TEXT[] DEFAULT ARRAY[]::TEXT[];
