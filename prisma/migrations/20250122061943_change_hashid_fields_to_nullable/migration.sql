-- AlterTable
ALTER TABLE "categories" ALTER COLUMN "hash_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "comment_reports" ALTER COLUMN "hash_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "comments" ALTER COLUMN "hash_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "events" ALTER COLUMN "hash_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "notifications" ALTER COLUMN "hash_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "participations" ALTER COLUMN "hash_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "partner_profiles" ALTER COLUMN "hash_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "responsible_persons" ALTER COLUMN "hash_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "user_educations" ALTER COLUMN "hash_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "user_locations" ALTER COLUMN "hash_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "user_profiles" ALTER COLUMN "hash_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "user_saved_events" ALTER COLUMN "hash_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "hash_id" DROP NOT NULL;
