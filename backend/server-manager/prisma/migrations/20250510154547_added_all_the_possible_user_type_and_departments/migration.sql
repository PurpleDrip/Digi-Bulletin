/*
  Warnings:

  - The values [CS,CY] on the enum `DptType` will be removed. If these variants are still used in the database, this will fail.
  - The values [STUDENT,PROFESSOR,SUPPORT_STAFF,ADMIN] on the enum `UserType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DptType_new" AS ENUM ('AE', 'AIDS', 'AIML', 'BT', 'CH', 'CV', 'CSE', 'CSE_AIML', 'CSE_CS', 'EEE', 'ECE', 'EIE', 'ETC', 'IEM', 'ISE', 'ME', 'MEE');
ALTER TABLE "User" ALTER COLUMN "department" TYPE "DptType_new" USING ("department"::text::"DptType_new");
ALTER TABLE "Audience" ALTER COLUMN "department" TYPE "DptType_new"[] USING ("department"::text::"DptType_new"[]);
ALTER TYPE "DptType" RENAME TO "DptType_old";
ALTER TYPE "DptType_new" RENAME TO "DptType";
DROP TYPE "DptType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "UserType_new" AS ENUM ('UG_STUDENT', 'PG_STUDENT', 'ASSISTANT_PROFS', 'ASSOCIATE_PROFS', 'PROFS', 'HOD', 'REGISTRAR', 'CLERKS', 'PRINCIPAL', 'DEAN', 'DIRECTOR', 'LIBRARIAN', 'LAB_ASSISTANT', 'SECURITY_STAFF', 'JANITORIAL_STAFF', 'TRANSPORT_STAFF', 'CAFETERIA_STAFF', 'LAB_TECHNICIANS', 'IT_STAFF', 'GUEST', 'ALUMINI');
ALTER TABLE "User" ALTER COLUMN "type" TYPE "UserType_new" USING ("type"::text::"UserType_new");
ALTER TABLE "Audience" ALTER COLUMN "user" TYPE "UserType_new"[] USING ("user"::text::"UserType_new"[]);
ALTER TYPE "UserType" RENAME TO "UserType_old";
ALTER TYPE "UserType_new" RENAME TO "UserType";
DROP TYPE "UserType_old";
COMMIT;
