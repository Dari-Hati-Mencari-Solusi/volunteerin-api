-- CreateTable
CREATE TABLE "_BenefitToEvent" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_BenefitToEvent_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_BenefitToEvent_B_index" ON "_BenefitToEvent"("B");

-- AddForeignKey
ALTER TABLE "_BenefitToEvent" ADD CONSTRAINT "_BenefitToEvent_A_fkey" FOREIGN KEY ("A") REFERENCES "benefits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BenefitToEvent" ADD CONSTRAINT "_BenefitToEvent_B_fkey" FOREIGN KEY ("B") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
