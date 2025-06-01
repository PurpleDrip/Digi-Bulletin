/*
  Warnings:

  - The `year` column on the `Audience` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `semester` column on the `Audience` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Audience" DROP COLUMN "year",
ADD COLUMN     "year" INTEGER[],
DROP COLUMN "semester",
ADD COLUMN     "semester" INTEGER[];
