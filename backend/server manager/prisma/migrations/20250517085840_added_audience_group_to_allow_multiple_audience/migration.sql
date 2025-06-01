/*
  Warnings:

  - You are about to drop the column `department` on the `Audience` table. All the data in the column will be lost.
  - You are about to drop the column `semester` on the `Audience` table. All the data in the column will be lost.
  - You are about to drop the column `user` on the `Audience` table. All the data in the column will be lost.
  - You are about to drop the column `usn` on the `Audience` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `Audience` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Audience" DROP COLUMN "department",
DROP COLUMN "semester",
DROP COLUMN "user",
DROP COLUMN "usn",
DROP COLUMN "year";

-- CreateTable
CREATE TABLE "AudienceGroup" (
    "id" SERIAL NOT NULL,
    "audienceId" INTEGER NOT NULL,
    "include" BOOLEAN NOT NULL,
    "userType" "UserType" NOT NULL,
    "department" "DptType",
    "year" INTEGER[],
    "semester" INTEGER[],
    "section" "SectionType"[],
    "usns" TEXT[],

    CONSTRAINT "AudienceGroup_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AudienceGroup" ADD CONSTRAINT "AudienceGroup_audienceId_fkey" FOREIGN KEY ("audienceId") REFERENCES "Audience"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
