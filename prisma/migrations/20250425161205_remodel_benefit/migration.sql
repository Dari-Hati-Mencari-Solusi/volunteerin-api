/*
  Warnings:

  - You are about to drop the `event_benefits` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_event_benefits` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "user_event_benefits" DROP CONSTRAINT "user_event_benefits_event_id_fkey";

-- DropForeignKey
ALTER TABLE "user_event_benefits" DROP CONSTRAINT "user_event_benefits_user_id_fkey";

-- DropTable
DROP TABLE "event_benefits";

-- DropTable
DROP TABLE "user_event_benefits";

-- CreateTable
CREATE TABLE "benefits" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "icon" VARCHAR(20) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "benefits_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "benefits" ADD CONSTRAINT "benefits_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
