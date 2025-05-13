/*
  Warnings:

  - You are about to drop the column `guest` on the `Audience` table. All the data in the column will be lost.
  - Added the required column `ownerId` to the `Server` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ServerType" ADD VALUE 'GENERAL';
ALTER TYPE "ServerType" ADD VALUE 'ANNOUNCEMENT';
ALTER TYPE "ServerType" ADD VALUE 'CLASSROOM';
ALTER TYPE "ServerType" ADD VALUE 'DISCUSSION';
ALTER TYPE "ServerType" ADD VALUE 'CLUB';
ALTER TYPE "ServerType" ADD VALUE 'DEPARTMENTAL';
ALTER TYPE "ServerType" ADD VALUE 'STUDENT_BODY';
ALTER TYPE "ServerType" ADD VALUE 'SUPPORT';
ALTER TYPE "ServerType" ADD VALUE 'RESEARCH';
ALTER TYPE "ServerType" ADD VALUE 'WORKSHOP';
ALTER TYPE "ServerType" ADD VALUE 'EXAM';
ALTER TYPE "ServerType" ADD VALUE 'ALUMNI';
ALTER TYPE "ServerType" ADD VALUE 'FACULTY';
ALTER TYPE "ServerType" ADD VALUE 'ADMINISTRATION';

-- AlterTable
ALTER TABLE "Audience" DROP COLUMN "guest";

-- AlterTable
ALTER TABLE "Server" ADD COLUMN     "ownerId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Server" ADD CONSTRAINT "Server_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
