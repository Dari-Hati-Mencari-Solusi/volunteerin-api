/*
  Warnings:

  - You are about to drop the column `status` on the `participants` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[form_response_id]` on the table `participants` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `form_response_id` to the `participants` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RegistrantStatus" AS ENUM ('REVIEWED', 'ACCEPTED', 'REJECTED');

-- AlterTable
ALTER TABLE "form_responses" ADD COLUMN     "status" "RegistrantStatus" NOT NULL DEFAULT 'REVIEWED';

-- AlterTable
ALTER TABLE "participants" DROP COLUMN "status",
ADD COLUMN     "form_response_id" UUID NOT NULL;

-- DropEnum
DROP TYPE "ParticipantStatus";

-- CreateIndex
CREATE UNIQUE INDEX "participants_form_response_id_key" ON "participants"("form_response_id");

-- AddForeignKey
ALTER TABLE "participants" ADD CONSTRAINT "participants_form_response_id_fkey" FOREIGN KEY ("form_response_id") REFERENCES "form_responses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
