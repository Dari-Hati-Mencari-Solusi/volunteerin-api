-- AlterTable
ALTER TABLE "events" ADD COLUMN     "banner_image_id" TEXT;

-- AlterTable
ALTER TABLE "legalities" ADD COLUMN     "document_image_id" TEXT;

-- AlterTable
ALTER TABLE "responsible_persons" ADD COLUMN     "ktp_image_id" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "avatar_image_id" TEXT;
