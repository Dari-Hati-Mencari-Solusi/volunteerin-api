/*
  Warnings:

  - The values [reviewed,dismissed,approved] on the enum `CommentReportStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [local,google,facebook] on the enum `LoginProviders` will be removed. If these variants are still used in the database, this will fail.
  - The values [reminder,event_update,event_launching,custom] on the enum `NotificationTypes` will be removed. If these variants are still used in the database, this will fail.
  - The values [community,government,corporate,individual] on the enum `OrganizationTypes` will be removed. If these variants are still used in the database, this will fail.
  - The values [reviewed,joined,completed,rejected] on the enum `ParticipationStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [pending,accepted,rejected] on the enum `PartnerStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [admin,student,people,partner] on the enum `Roles` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `user_educations` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CommentReportStatus_new" AS ENUM ('REVIEWED', 'DISMISSED', 'APPROVED');
ALTER TABLE "comment_reports" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "comment_reports" ALTER COLUMN "status" TYPE "CommentReportStatus_new" USING ("status"::text::"CommentReportStatus_new");
ALTER TYPE "CommentReportStatus" RENAME TO "CommentReportStatus_old";
ALTER TYPE "CommentReportStatus_new" RENAME TO "CommentReportStatus";
DROP TYPE "CommentReportStatus_old";
ALTER TABLE "comment_reports" ALTER COLUMN "status" SET DEFAULT 'REVIEWED';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "LoginProviders_new" AS ENUM ('LOCAL', 'GOOGLE', 'FACEBOOK');
ALTER TABLE "users" ALTER COLUMN "login_provider" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "login_provider" TYPE "LoginProviders_new" USING ("login_provider"::text::"LoginProviders_new");
ALTER TYPE "LoginProviders" RENAME TO "LoginProviders_old";
ALTER TYPE "LoginProviders_new" RENAME TO "LoginProviders";
DROP TYPE "LoginProviders_old";
ALTER TABLE "users" ALTER COLUMN "login_provider" SET DEFAULT 'LOCAL';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "NotificationTypes_new" AS ENUM ('REMINDER', 'EVENT_UPDATE', 'EVENT_LAUNCHING', 'CUSTOM');
ALTER TABLE "notifications" ALTER COLUMN "type" TYPE "NotificationTypes_new" USING ("type"::text::"NotificationTypes_new");
ALTER TYPE "NotificationTypes" RENAME TO "NotificationTypes_old";
ALTER TYPE "NotificationTypes_new" RENAME TO "NotificationTypes";
DROP TYPE "NotificationTypes_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "OrganizationTypes_new" AS ENUM ('COMMUNITY', 'GOVERNMENT', 'CORPORATE', 'INDIVIDUAL');
ALTER TABLE "partner_profiles" ALTER COLUMN "organization_type" TYPE "OrganizationTypes_new" USING ("organization_type"::text::"OrganizationTypes_new");
ALTER TYPE "OrganizationTypes" RENAME TO "OrganizationTypes_old";
ALTER TYPE "OrganizationTypes_new" RENAME TO "OrganizationTypes";
DROP TYPE "OrganizationTypes_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ParticipationStatus_new" AS ENUM ('REVIEWED', 'JOINED', 'ACCEPTED', 'COMPLETED', 'REJECTED', 'FINISHED');
ALTER TABLE "participations" ALTER COLUMN "participation_status" DROP DEFAULT;
ALTER TABLE "participations" ALTER COLUMN "participation_status" TYPE "ParticipationStatus_new" USING ("participation_status"::text::"ParticipationStatus_new");
ALTER TYPE "ParticipationStatus" RENAME TO "ParticipationStatus_old";
ALTER TYPE "ParticipationStatus_new" RENAME TO "ParticipationStatus";
DROP TYPE "ParticipationStatus_old";
ALTER TABLE "participations" ALTER COLUMN "participation_status" SET DEFAULT 'REVIEWED';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "PartnerStatus_new" AS ENUM ('REVIEWED', 'ACCEPTED', 'REJECTED');
ALTER TABLE "partner_profiles" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "partner_profiles" ALTER COLUMN "status" TYPE "PartnerStatus_new" USING ("status"::text::"PartnerStatus_new");
ALTER TYPE "PartnerStatus" RENAME TO "PartnerStatus_old";
ALTER TYPE "PartnerStatus_new" RENAME TO "PartnerStatus";
DROP TYPE "PartnerStatus_old";
ALTER TABLE "partner_profiles" ALTER COLUMN "status" SET DEFAULT 'REVIEWED';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Roles_new" AS ENUM ('ADMIN', 'VOLUNTEER', 'PARTNER');
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "Roles_new" USING ("role"::text::"Roles_new");
ALTER TYPE "Roles" RENAME TO "Roles_old";
ALTER TYPE "Roles_new" RENAME TO "Roles";
DROP TYPE "Roles_old";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'VOLUNTEER';
COMMIT;

-- DropForeignKey
ALTER TABLE "user_educations" DROP CONSTRAINT "user_educations_user_id_fkey";

-- AlterTable
ALTER TABLE "comment_reports" ALTER COLUMN "status" SET DEFAULT 'REVIEWED';

-- AlterTable
ALTER TABLE "participations" ALTER COLUMN "participation_status" SET DEFAULT 'REVIEWED';

-- AlterTable
ALTER TABLE "partner_profiles" ALTER COLUMN "status" SET DEFAULT 'REVIEWED';

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'VOLUNTEER',
ALTER COLUMN "login_provider" SET DEFAULT 'LOCAL';

-- DropTable
DROP TABLE "user_educations";

-- DropEnum
DROP TYPE "EducationLevels";
