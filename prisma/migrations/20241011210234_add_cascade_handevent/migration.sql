-- DropForeignKey
ALTER TABLE "HandEvent" DROP CONSTRAINT "HandEvent_handId_fkey";

-- AddForeignKey
ALTER TABLE "HandEvent" ADD CONSTRAINT "HandEvent_handId_fkey" FOREIGN KEY ("handId") REFERENCES "Hand"("id") ON DELETE CASCADE ON UPDATE CASCADE;
