/*
  Warnings:

  - The values [ASSISTANT_PROFS,ASSOCIATE_PROFS,PROFS] on the enum `UserType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
ALTER TYPE "DptType" ADD VALUE 'AT';

-- AlterEnum
BEGIN;
CREATE TYPE "UserType_new" AS ENUM ('STUDENT', 'ASSISTANT_PROFR', 'ASSOCIATE_PROFR', 'PROFR', 'HOD', 'REGISTRAR', 'CLERKS', 'COORDINATOR', 'PRINCIPAL', 'DEAN', 'DIRECTOR', 'LIBRARIAN', 'LAB_ASSISTANT', 'SECURITY_STAFF', 'JANITORIAL_STAFF', 'TRANSPORT_STAFF', 'CAFETERIA_STAFF', 'LAB_TECHNICIANS', 'IT_STAFF', 'GUEST', 'ALUMINI', 'ADMIN');
ALTER TABLE "User" ALTER COLUMN "type" TYPE "UserType_new" USING ("type"::text::"UserType_new");
ALTER TABLE "Audience" ALTER COLUMN "user" TYPE "UserType_new"[] USING ("user"::text::"UserType_new"[]);
ALTER TYPE "UserType" RENAME TO "UserType_old";
ALTER TYPE "UserType_new" RENAME TO "UserType";
DROP TYPE "UserType_old";
COMMIT;
