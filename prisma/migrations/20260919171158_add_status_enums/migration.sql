/*
  Warnings:

  - Changed the type of `status` on the `InstallationJobs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `Leads` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `Quotations` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'WON', 'LOST');

-- CreateEnum
CREATE TYPE "QuotationStatus" AS ENUM ('DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "InstallationJobStatus" AS ENUM ('PENDING', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "InstallationJobs" DROP COLUMN "status",
ADD COLUMN     "status" "InstallationJobStatus" NOT NULL;

-- AlterTable
ALTER TABLE "Leads" DROP COLUMN "status",
ADD COLUMN     "status" "LeadStatus" NOT NULL;

-- AlterTable
ALTER TABLE "Quotations" DROP COLUMN "status",
ADD COLUMN     "status" "QuotationStatus" NOT NULL;
