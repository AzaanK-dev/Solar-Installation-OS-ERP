-- CreateTable
CREATE TABLE "Customers" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Leads" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "estimatedBill" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSurveys" (
    "id" SERIAL NOT NULL,
    "leadId" INTEGER NOT NULL,
    "area" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SiteSurveys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Equipment" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quotations" (
    "id" SERIAL NOT NULL,
    "leadId" INTEGER NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Quotations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstallationJobs" (
    "id" SERIAL NOT NULL,
    "quotationId" INTEGER NOT NULL,
    "scheduledDate" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InstallationJobs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customers_email_key" ON "Customers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SiteSurveys_leadId_key" ON "SiteSurveys"("leadId");

-- CreateIndex
CREATE UNIQUE INDEX "Quotations_leadId_key" ON "Quotations"("leadId");

-- CreateIndex
CREATE UNIQUE INDEX "InstallationJobs_quotationId_key" ON "InstallationJobs"("quotationId");

-- AddForeignKey
ALTER TABLE "Leads" ADD CONSTRAINT "Leads_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SiteSurveys" ADD CONSTRAINT "SiteSurveys_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Leads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quotations" ADD CONSTRAINT "Quotations_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Leads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstallationJobs" ADD CONSTRAINT "InstallationJobs_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "Quotations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
