-- CreateTable
CREATE TABLE "form_responses" (
    "id" UUID NOT NULL,
    "form_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "answers" JSONB NOT NULL,
    "submitted_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "form_responses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "form_responses" ADD CONSTRAINT "form_responses_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "forms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_responses" ADD CONSTRAINT "form_responses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
