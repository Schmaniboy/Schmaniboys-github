-- CreateEnum
CREATE TYPE "EvidenceType" AS ENUM ('SPECIFICATION', 'ASSESSMENT', 'MARKET_SIGNAL');

-- CreateEnum
CREATE TYPE "ConfidenceLevel" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "IssueSeverity" AS ENUM ('CRITICAL', 'SIGNIFICANT', 'MINOR');

-- CreateEnum
CREATE TYPE "CostCategory" AS ENUM ('INSURANCE', 'VEHICLE_TAX', 'SERVICE', 'TYPICAL_REPAIR', 'FUEL', 'DEPRECIATION', 'OTHER');

-- CreateEnum
CREATE TYPE "KnowledgeTopic" AS ENUM ('RELIABILITY', 'EVERYDAY_USE', 'LONG_DISTANCE', 'CITY_USE', 'TOWING', 'TUNING_POTENTIAL', 'RESALE_VALUE', 'DEMAND', 'ADVANTAGE', 'DISADVANTAGE', 'BUYING_ADVICE');

-- CreateTable
CREATE TABLE "KnownIssue" (
    "id" TEXT NOT NULL,
    "generationId" TEXT NOT NULL,
    "powertrainId" TEXT,
    "title" TEXT NOT NULL,
    "component" TEXT,
    "severity" "IssueSeverity" NOT NULL,
    "symptoms" TEXT,
    "remedy" TEXT,
    "typicalMileageFromKm" INTEGER,
    "typicalMileageToKm" INTEGER,
    "yearFrom" INTEGER,
    "yearTo" INTEGER,
    "evidenceType" "EvidenceType" NOT NULL,
    "confidence" "ConfidenceLevel" NOT NULL DEFAULT 'MEDIUM',
    "reasoning" TEXT,
    "status" "EditorialStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KnownIssue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaintenanceItem" (
    "id" TEXT NOT NULL,
    "generationId" TEXT NOT NULL,
    "powertrainId" TEXT,
    "task" TEXT NOT NULL,
    "intervalKm" INTEGER,
    "intervalMonths" INTEGER,
    "note" TEXT,
    "evidenceType" "EvidenceType" NOT NULL,
    "confidence" "ConfidenceLevel" NOT NULL DEFAULT 'MEDIUM',
    "reasoning" TEXT,
    "status" "EditorialStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MaintenanceItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CostEstimate" (
    "id" TEXT NOT NULL,
    "generationId" TEXT NOT NULL,
    "powertrainId" TEXT,
    "category" "CostCategory" NOT NULL,
    "label" TEXT NOT NULL,
    "amountFromCents" INTEGER,
    "amountToCents" INTEGER,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "per" TEXT,
    "region" TEXT,
    "evidenceType" "EvidenceType" NOT NULL,
    "confidence" "ConfidenceLevel" NOT NULL DEFAULT 'MEDIUM',
    "reasoning" TEXT,
    "dataBasis" TEXT,
    "observedAt" TIMESTAMP(3),
    "sampleSize" INTEGER,
    "status" "EditorialStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CostEstimate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KnowledgeNote" (
    "id" TEXT NOT NULL,
    "generationId" TEXT NOT NULL,
    "powertrainId" TEXT,
    "topic" "KnowledgeTopic" NOT NULL,
    "heading" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "evidenceType" "EvidenceType" NOT NULL,
    "confidence" "ConfidenceLevel" NOT NULL DEFAULT 'MEDIUM',
    "reasoning" TEXT,
    "dataBasis" TEXT,
    "observedAt" TIMESTAMP(3),
    "sampleSize" INTEGER,
    "status" "EditorialStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KnowledgeNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "KnownIssue_generationId_status_idx" ON "KnownIssue"("generationId", "status");

-- CreateIndex
CREATE INDEX "KnownIssue_powertrainId_idx" ON "KnownIssue"("powertrainId");

-- CreateIndex
CREATE INDEX "MaintenanceItem_generationId_status_idx" ON "MaintenanceItem"("generationId", "status");

-- CreateIndex
CREATE INDEX "CostEstimate_generationId_status_idx" ON "CostEstimate"("generationId", "status");

-- CreateIndex
CREATE INDEX "CostEstimate_category_idx" ON "CostEstimate"("category");

-- CreateIndex
CREATE INDEX "KnowledgeNote_generationId_status_idx" ON "KnowledgeNote"("generationId", "status");

-- CreateIndex
CREATE INDEX "KnowledgeNote_topic_idx" ON "KnowledgeNote"("topic");

-- AddForeignKey
ALTER TABLE "KnownIssue" ADD CONSTRAINT "KnownIssue_generationId_fkey" FOREIGN KEY ("generationId") REFERENCES "Generation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnownIssue" ADD CONSTRAINT "KnownIssue_powertrainId_fkey" FOREIGN KEY ("powertrainId") REFERENCES "PowertrainCombination"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceItem" ADD CONSTRAINT "MaintenanceItem_generationId_fkey" FOREIGN KEY ("generationId") REFERENCES "Generation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceItem" ADD CONSTRAINT "MaintenanceItem_powertrainId_fkey" FOREIGN KEY ("powertrainId") REFERENCES "PowertrainCombination"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CostEstimate" ADD CONSTRAINT "CostEstimate_generationId_fkey" FOREIGN KEY ("generationId") REFERENCES "Generation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CostEstimate" ADD CONSTRAINT "CostEstimate_powertrainId_fkey" FOREIGN KEY ("powertrainId") REFERENCES "PowertrainCombination"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeNote" ADD CONSTRAINT "KnowledgeNote_generationId_fkey" FOREIGN KEY ("generationId") REFERENCES "Generation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeNote" ADD CONSTRAINT "KnowledgeNote_powertrainId_fkey" FOREIGN KEY ("powertrainId") REFERENCES "PowertrainCombination"("id") ON DELETE CASCADE ON UPDATE CASCADE;
