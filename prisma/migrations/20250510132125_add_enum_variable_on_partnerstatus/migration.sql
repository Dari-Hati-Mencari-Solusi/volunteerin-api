/*
  Warnings:

  - The values [ACCEPTED,REJECTED,VERIFIED] on the enum `PartnerStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PartnerStatus_new" AS ENUM ('REVIEWED', 'ACCEPTED_PROFILE', 'ACCEPTED_LEGALITY', 'REJECTED_PROFILE', 'REJECTED_LEGALITY');
ALTER TABLE "partner_profiles" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "partner_profiles" ALTER COLUMN "status" TYPE "PartnerStatus_new" USING ("status"::text::"PartnerStatus_new");
ALTER TYPE "PartnerStatus" RENAME TO "PartnerStatus_old";
ALTER TYPE "PartnerStatus_new" RENAME TO "PartnerStatus";
DROP TYPE "PartnerStatus_old";
ALTER TABLE "partner_profiles" ALTER COLUMN "status" SET DEFAULT 'REVIEWED';
COMMIT;
