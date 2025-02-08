/*
  Warnings:

  - You are about to drop the column `hash_id` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `hash_id` on the `comment_reports` table. All the data in the column will be lost.
  - You are about to drop the column `hash_id` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `hash_id` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `hash_id` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `hash_id` on the `participations` table. All the data in the column will be lost.
  - You are about to drop the column `hash_id` on the `partner_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `hash_id` on the `responsible_persons` table. All the data in the column will be lost.
  - You are about to drop the column `hash_id` on the `user_educations` table. All the data in the column will be lost.
  - You are about to drop the column `hash_id` on the `user_locations` table. All the data in the column will be lost.
  - You are about to drop the column `hash_id` on the `user_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `hash_id` on the `user_saved_events` table. All the data in the column will be lost.
  - You are about to drop the column `hash_id` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "categories_hash_id_key";

-- DropIndex
DROP INDEX "comment_reports_hash_id_key";

-- DropIndex
DROP INDEX "comments_hash_id_key";

-- DropIndex
DROP INDEX "events_hash_id_key";

-- DropIndex
DROP INDEX "notifications_hash_id_key";

-- DropIndex
DROP INDEX "participations_hash_id_key";

-- DropIndex
DROP INDEX "partner_profiles_hash_id_key";

-- DropIndex
DROP INDEX "responsible_persons_hash_id_key";

-- DropIndex
DROP INDEX "user_educations_hash_id_key";

-- DropIndex
DROP INDEX "user_locations_hash_id_key";

-- DropIndex
DROP INDEX "user_profiles_hash_id_key";

-- DropIndex
DROP INDEX "user_saved_events_hash_id_key";

-- DropIndex
DROP INDEX "users_hash_id_key";

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "hash_id";

-- AlterTable
ALTER TABLE "comment_reports" DROP COLUMN "hash_id";

-- AlterTable
ALTER TABLE "comments" DROP COLUMN "hash_id";

-- AlterTable
ALTER TABLE "events" DROP COLUMN "hash_id";

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "hash_id";

-- AlterTable
ALTER TABLE "participations" DROP COLUMN "hash_id";

-- AlterTable
ALTER TABLE "partner_profiles" DROP COLUMN "hash_id";

-- AlterTable
ALTER TABLE "responsible_persons" DROP COLUMN "hash_id";

-- AlterTable
ALTER TABLE "user_educations" DROP COLUMN "hash_id";

-- AlterTable
ALTER TABLE "user_locations" DROP COLUMN "hash_id";

-- AlterTable
ALTER TABLE "user_profiles" DROP COLUMN "hash_id";

-- AlterTable
ALTER TABLE "user_saved_events" DROP COLUMN "hash_id";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "hash_id";
