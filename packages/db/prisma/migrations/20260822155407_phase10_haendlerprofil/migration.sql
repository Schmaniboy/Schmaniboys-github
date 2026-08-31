-- AlterTable
ALTER TABLE "Dealer" ADD COLUMN     "city" TEXT,
ADD COLUMN     "contactEmail" TEXT,
ADD COLUMN     "contactPhone" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "logoStorageKey" TEXT,
ADD COLUMN     "postalCode" TEXT,
ADD COLUMN     "street" TEXT,
ADD COLUMN     "vatId" TEXT,
ADD COLUMN     "websiteUrl" TEXT;

-- CreateTable
CREATE TABLE "DealerOpeningHour" (
    "id" TEXT NOT NULL,
    "dealerId" TEXT NOT NULL,
    "weekday" INTEGER NOT NULL,
    "opensMinute" INTEGER NOT NULL,
    "closesMinute" INTEGER NOT NULL,

    CONSTRAINT "DealerOpeningHour_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DealerOpeningHour_dealerId_idx" ON "DealerOpeningHour"("dealerId");

-- CreateIndex
CREATE UNIQUE INDEX "DealerOpeningHour_dealerId_weekday_opensMinute_key" ON "DealerOpeningHour"("dealerId", "weekday", "opensMinute");

-- AddForeignKey
ALTER TABLE "DealerOpeningHour" ADD CONSTRAINT "DealerOpeningHour_dealerId_fkey" FOREIGN KEY ("dealerId") REFERENCES "Dealer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

