-- CreateEnum
CREATE TYPE "LoginProviders" AS ENUM ('local', 'google', 'facebook');

-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('admin', 'student', 'people', 'partner');

-- CreateEnum
CREATE TYPE "OrganizationTypes" AS ENUM ('community', 'government', 'corporate', 'individual');

-- CreateEnum
CREATE TYPE "NotificationTypes" AS ENUM ('reminder', 'event_update', 'event_launching', 'custom');

-- CreateEnum
CREATE TYPE "EducationLevels" AS ENUM ('sma', 'smp', 'bachelor', 'higher');

-- CreateEnum
CREATE TYPE "CommentReportStatus" AS ENUM ('reviewed', 'dismissed', 'approved');

-- CreateEnum
CREATE TYPE "ParticipationStatus" AS ENUM ('reviewed', 'joined', 'completed', 'rejected');

-- CreateEnum
CREATE TYPE "PartnerStatus" AS ENUM ('pending', 'accepted', 'rejected');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "hash_id" TEXT NOT NULL,
    "name" VARCHAR(125) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "phone_number" VARCHAR(20),
    "password" VARCHAR,
    "social_id" VARCHAR,
    "role" "Roles" NOT NULL DEFAULT 'people',
    "avatar_url" VARCHAR,
    "login_provider" "LoginProviders" NOT NULL DEFAULT 'local',
    "is_subcribed" BOOLEAN NOT NULL DEFAULT false,
    "remember_token" VARCHAR,
    "last_login_at" TIMESTAMP(3),
    "verified_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_profiles" (
    "id" SERIAL NOT NULL,
    "hash_id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "cv" VARCHAR,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_educations" (
    "id" SERIAL NOT NULL,
    "hash_id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "institution_name" TEXT NOT NULL,
    "major" VARCHAR,
    "education_level" "EducationLevels" NOT NULL,
    "student_card_url" TEXT NOT NULL,
    "identifier_number" VARCHAR(40) NOT NULL,

    CONSTRAINT "user_educations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partner_profiles" (
    "id" SERIAL NOT NULL,
    "hash_id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "organization_type" "OrganizationTypes" NOT NULL,
    "organization_address" TEXT NOT NULL,
    "instagram" VARCHAR(50) NOT NULL,
    "event_quota" INTEGER NOT NULL DEFAULT 1,
    "status" "PartnerStatus" NOT NULL DEFAULT 'pending',
    "information" TEXT,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "partner_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_locations" (
    "id" SERIAL NOT NULL,
    "hash_id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "latitude" DECIMAL(10,8) NOT NULL,
    "longitude" DECIMAL(11,8) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "responsible_persons" (
    "id" SERIAL NOT NULL,
    "hash_id" TEXT NOT NULL,
    "partner_profile_id" INTEGER NOT NULL,
    "nik" VARCHAR(30) NOT NULL,
    "full_name" VARCHAR(125) NOT NULL,
    "phone_number" VARCHAR(20) NOT NULL,
    "position" VARCHAR(50) NOT NULL,
    "ktp_url" VARCHAR NOT NULL,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "responsible_persons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" SERIAL NOT NULL,
    "hash_id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "start_at" TIMESTAMP(3) NOT NULL,
    "end_at" TIMESTAMP(3),
    "banner_url" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "terms_and_conditions" TEXT,
    "is_release" BOOLEAN NOT NULL DEFAULT false,
    "contact_person" VARCHAR(15) NOT NULL,
    "location" TEXT NOT NULL,
    "latitude" DECIMAL(10,8) NOT NULL,
    "longitude" DECIMAL(11,8) NOT NULL,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "hash_id" TEXT NOT NULL,
    "name" VARCHAR(40) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_saved_events" (
    "id" SERIAL NOT NULL,
    "hash_id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_saved_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" SERIAL NOT NULL,
    "hash_id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comment_reports" (
    "id" SERIAL NOT NULL,
    "hash_id" TEXT NOT NULL,
    "comment_id" INTEGER NOT NULL,
    "reported_by" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "CommentReportStatus" NOT NULL DEFAULT 'reviewed',
    "reviewed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comment_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participations" (
    "id" SERIAL NOT NULL,
    "hash_id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,
    "participation_status" "ParticipationStatus" NOT NULL DEFAULT 'reviewed',
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "participations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" SERIAL NOT NULL,
    "hash_id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "type" "NotificationTypes" NOT NULL,
    "url" VARCHAR,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CategoryToEvent" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CategoryToEvent_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_hash_id_key" ON "users"("hash_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_number_key" ON "users"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_hash_id_key" ON "user_profiles"("hash_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_user_id_key" ON "user_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_educations_hash_id_key" ON "user_educations"("hash_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_educations_user_id_key" ON "user_educations"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "partner_profiles_hash_id_key" ON "partner_profiles"("hash_id");

-- CreateIndex
CREATE UNIQUE INDEX "partner_profiles_user_id_key" ON "partner_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_locations_hash_id_key" ON "user_locations"("hash_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_locations_user_id_key" ON "user_locations"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "responsible_persons_hash_id_key" ON "responsible_persons"("hash_id");

-- CreateIndex
CREATE UNIQUE INDEX "responsible_persons_partner_profile_id_key" ON "responsible_persons"("partner_profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "responsible_persons_nik_key" ON "responsible_persons"("nik");

-- CreateIndex
CREATE UNIQUE INDEX "events_hash_id_key" ON "events"("hash_id");

-- CreateIndex
CREATE UNIQUE INDEX "events_user_id_key" ON "events"("user_id");

-- CreateIndex
CREATE INDEX "events_title_idx" ON "events"("title");

-- CreateIndex
CREATE UNIQUE INDEX "categories_hash_id_key" ON "categories"("hash_id");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_saved_events_hash_id_key" ON "user_saved_events"("hash_id");

-- CreateIndex
CREATE UNIQUE INDEX "comments_hash_id_key" ON "comments"("hash_id");

-- CreateIndex
CREATE UNIQUE INDEX "comment_reports_hash_id_key" ON "comment_reports"("hash_id");

-- CreateIndex
CREATE UNIQUE INDEX "participations_hash_id_key" ON "participations"("hash_id");

-- CreateIndex
CREATE UNIQUE INDEX "notifications_hash_id_key" ON "notifications"("hash_id");

-- CreateIndex
CREATE INDEX "_CategoryToEvent_B_index" ON "_CategoryToEvent"("B");

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_educations" ADD CONSTRAINT "user_educations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_profiles" ADD CONSTRAINT "partner_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_locations" ADD CONSTRAINT "user_locations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responsible_persons" ADD CONSTRAINT "responsible_persons_partner_profile_id_fkey" FOREIGN KEY ("partner_profile_id") REFERENCES "partner_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_saved_events" ADD CONSTRAINT "user_saved_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_saved_events" ADD CONSTRAINT "user_saved_events_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_reports" ADD CONSTRAINT "comment_reports_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_reports" ADD CONSTRAINT "comment_reports_reported_by_fkey" FOREIGN KEY ("reported_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participations" ADD CONSTRAINT "participations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participations" ADD CONSTRAINT "participations_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToEvent" ADD CONSTRAINT "_CategoryToEvent_A_fkey" FOREIGN KEY ("A") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToEvent" ADD CONSTRAINT "_CategoryToEvent_B_fkey" FOREIGN KEY ("B") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
