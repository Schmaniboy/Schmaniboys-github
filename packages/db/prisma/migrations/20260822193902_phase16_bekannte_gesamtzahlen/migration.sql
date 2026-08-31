-- CreateTable
CREATE TABLE "CatalogExpectation" (
    "id" TEXT NOT NULL,
    "subjectType" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "aspect" TEXT NOT NULL,
    "knownTotal" INTEGER NOT NULL,
    "sourceTitle" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "checkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CatalogExpectation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CatalogExpectation_subjectType_subjectId_idx" ON "CatalogExpectation"("subjectType", "subjectId");

-- CreateIndex
CREATE UNIQUE INDEX "CatalogExpectation_subjectType_subjectId_aspect_key" ON "CatalogExpectation"("subjectType", "subjectId", "aspect");

