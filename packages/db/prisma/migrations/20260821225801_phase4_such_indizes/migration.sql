-- DropIndex
DROP INDEX "Engine_fuelType_idx";

-- DropIndex
DROP INDEX "Engine_status_idx";

-- DropIndex
DROP INDEX "PowertrainCombination_status_idx";

-- CreateIndex
CREATE INDEX "Engine_status_fuelType_idx" ON "Engine"("status", "fuelType");

-- CreateIndex
CREATE INDEX "PowertrainCombination_status_powerKw_idx" ON "PowertrainCombination"("status", "powerKw");

-- CreateIndex
CREATE INDEX "PowertrainCombination_status_yearFrom_idx" ON "PowertrainCombination"("status", "yearFrom");

-- CreateIndex
CREATE INDEX "PowertrainCombination_status_consumptionCombined_idx" ON "PowertrainCombination"("status", "consumptionCombined");

-- CreateIndex
CREATE INDEX "PowertrainCombination_status_acceleration0to100_idx" ON "PowertrainCombination"("status", "acceleration0to100");

-- CreateIndex
CREATE INDEX "PowertrainCombination_status_driveType_idx" ON "PowertrainCombination"("status", "driveType");
