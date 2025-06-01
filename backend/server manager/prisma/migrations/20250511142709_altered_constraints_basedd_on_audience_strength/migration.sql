-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "UserType" ADD VALUE 'COORDINATOR';
ALTER TYPE "UserType" ADD VALUE 'ADMIN';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "department" DROP NOT NULL,
ALTER COLUMN "admissionYear" DROP NOT NULL,
ALTER COLUMN "year" DROP NOT NULL,
ALTER COLUMN "semester" DROP NOT NULL,
ALTER COLUMN "section" DROP NOT NULL;
