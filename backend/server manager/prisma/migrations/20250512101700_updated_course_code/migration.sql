/*
  Warnings:

  - The values [AIDS,AIML,CSE,CSE_AIML,CSE_CS,EEE,ECE,EIE,ETC,IEM,ISE,MEE] on the enum `DptType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DptType_new" AS ENUM ('AE', 'AD', 'AI', 'BT', 'CH', 'CV', 'CS', 'CI', 'CY', 'EE', 'EC', 'EI', 'ET', 'IM', 'IS', 'ME', 'MD');
ALTER TABLE "User" ALTER COLUMN "department" TYPE "DptType_new" USING ("department"::text::"DptType_new");
ALTER TABLE "Audience" ALTER COLUMN "department" TYPE "DptType_new"[] USING ("department"::text::"DptType_new"[]);
ALTER TYPE "DptType" RENAME TO "DptType_old";
ALTER TYPE "DptType_new" RENAME TO "DptType";
DROP TYPE "DptType_old";
COMMIT;
