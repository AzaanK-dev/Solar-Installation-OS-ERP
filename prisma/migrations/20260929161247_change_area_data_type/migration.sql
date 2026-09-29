/*
  Warnings:

  - Changed the type of `area` on the `SiteSurveys` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "SiteSurveys" DROP COLUMN "area",
ADD COLUMN     "area" DOUBLE PRECISION NOT NULL;
