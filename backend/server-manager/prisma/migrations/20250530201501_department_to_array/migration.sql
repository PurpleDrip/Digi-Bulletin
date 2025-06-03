/*
  Warnings:

  - Changed the column `department` on the `AudienceGroup` table from a scalar field to a list field. If there are non-null values in that column, this step will fail.

*/
-- AlterEnum
ALTER TYPE "DptType" ADD VALUE 'ALL';

-- DropForeignKey
ALTER TABLE "Server" DROP CONSTRAINT "Server_audienceId_fkey";

-- AlterTable
ALTER TABLE "AudienceGroup"
  ALTER COLUMN "department" TYPE "DptType"[]
  USING CASE
    WHEN department IS NULL THEN ARRAY[]::"DptType"[]
    ELSE ARRAY[department]
  END;


-- AlterTable
ALTER TABLE "Server" ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "audienceId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Server" ADD CONSTRAINT "Server_audienceId_fkey" FOREIGN KEY ("audienceId") REFERENCES "Audience"("id") ON DELETE SET NULL ON UPDATE CASCADE;
