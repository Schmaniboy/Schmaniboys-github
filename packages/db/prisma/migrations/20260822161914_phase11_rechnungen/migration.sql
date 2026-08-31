-- CreateEnum
CREATE TYPE "PaymentState" AS ENUM ('PENDING', 'AUTHORIZED', 'PAID', 'FAILED', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('OPEN', 'PAID', 'CANCELLED');

-- CreateTable
CREATE TABLE "PaymentIntent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "providerReference" TEXT,
    "providerLabel" TEXT NOT NULL,
    "tokens" INTEGER NOT NULL,
    "amountGrossCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "state" "PaymentState" NOT NULL DEFAULT 'PENDING',
    "paidAmountCents" INTEGER,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentIntent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "number" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "serial" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "paymentIntentId" TEXT,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'OPEN',
    "billingName" TEXT NOT NULL,
    "billingEmail" TEXT NOT NULL,
    "billingStreet" TEXT,
    "billingPostalCode" TEXT,
    "billingCity" TEXT,
    "billingVatId" TEXT,
    "netCents" INTEGER NOT NULL,
    "taxCents" INTEGER NOT NULL,
    "grossCents" INTEGER NOT NULL,
    "taxRateBasisPoints" INTEGER NOT NULL,
    "taxNote" TEXT,
    "paymentState" "PaymentState",
    "paymentReference" TEXT,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paidAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "cancellationReason" TEXT,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("number")
);

-- CreateTable
CREATE TABLE "InvoiceItem" (
    "id" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitNetCents" INTEGER NOT NULL,
    "lineNetCents" INTEGER NOT NULL,

    CONSTRAINT "InvoiceItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceSequence" (
    "year" INTEGER NOT NULL,
    "lastSerial" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvoiceSequence_pkey" PRIMARY KEY ("year")
);

-- CreateIndex
CREATE UNIQUE INDEX "PaymentIntent_reference_key" ON "PaymentIntent"("reference");

-- CreateIndex
CREATE INDEX "PaymentIntent_userId_state_idx" ON "PaymentIntent"("userId", "state");

-- CreateIndex
CREATE INDEX "PaymentIntent_providerReference_idx" ON "PaymentIntent"("providerReference");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_paymentIntentId_key" ON "Invoice"("paymentIntentId");

-- CreateIndex
CREATE INDEX "Invoice_userId_issuedAt_idx" ON "Invoice"("userId", "issuedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_year_serial_key" ON "Invoice"("year", "serial");

-- CreateIndex
CREATE UNIQUE INDEX "InvoiceItem_invoiceNumber_position_key" ON "InvoiceItem"("invoiceNumber", "position");

-- AddForeignKey
ALTER TABLE "PaymentIntent" ADD CONSTRAINT "PaymentIntent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_paymentIntentId_fkey" FOREIGN KEY ("paymentIntentId") REFERENCES "PaymentIntent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceItem" ADD CONSTRAINT "InvoiceItem_invoiceNumber_fkey" FOREIGN KEY ("invoiceNumber") REFERENCES "Invoice"("number") ON DELETE CASCADE ON UPDATE CASCADE;

