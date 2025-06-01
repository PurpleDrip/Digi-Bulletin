/*
  Warnings:

  - The values [UG_STUDENT,PG_STUDENT] on the enum `UserType` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[phoneNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StatusType" AS ENUM ('pending', 'approved', 'blocked');

-- AlterEnum
BEGIN;
CREATE TYPE "UserType_new" AS ENUM ('STUDENT', 'ASSISTANT_PROFS', 'ASSOCIATE_PROFS', 'PROFS', 'HOD', 'REGISTRAR', 'CLERKS', 'COORDINATOR', 'PRINCIPAL', 'DEAN', 'DIRECTOR', 'LIBRARIAN', 'LAB_ASSISTANT', 'SECURITY_STAFF', 'JANITORIAL_STAFF', 'TRANSPORT_STAFF', 'CAFETERIA_STAFF', 'LAB_TECHNICIANS', 'IT_STAFF', 'GUEST', 'ALUMINI', 'ADMIN');
ALTER TABLE "User" ALTER COLUMN "type" TYPE "UserType_new" USING ("type"::text::"UserType_new");
ALTER TABLE "Audience" ALTER COLUMN "user" TYPE "UserType_new"[] USING ("user"::text::"UserType_new"[]);
ALTER TYPE "UserType" RENAME TO "UserType_old";
ALTER TYPE "UserType_new" RENAME TO "UserType";
DROP TYPE "UserType_old";
COMMIT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT NOT NULL,
ADD COLUMN     "status" "StatusType" NOT NULL DEFAULT 'pending',
ALTER COLUMN "admissionYear" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");
