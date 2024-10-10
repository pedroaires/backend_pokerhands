/*
  Warnings:

  - The primary key for the `Hand` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `boardId` on the `Hand` table. All the data in the column will be lost.
  - You are about to drop the column `rake` on the `Hand` table. All the data in the column will be lost.
  - You are about to drop the `Action` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Board` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlayerHand` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Seat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Table` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_HandToSession` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `blinds` to the `Hand` table without a default value. This is not possible if the table is not empty.
  - Added the required column `buttonSeat` to the `Hand` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clubId` to the `Hand` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endDateTime` to the `Hand` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gameType` to the `Hand` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxSeats` to the `Hand` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerId` to the `Hand` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDateTime` to the `Hand` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Action" DROP CONSTRAINT "Action_handId_fkey";

-- DropForeignKey
ALTER TABLE "Action" DROP CONSTRAINT "Action_seatId_fkey";

-- DropForeignKey
ALTER TABLE "Hand" DROP CONSTRAINT "Hand_boardId_fkey";

-- DropForeignKey
ALTER TABLE "Hand" DROP CONSTRAINT "Hand_tableId_fkey";

-- DropForeignKey
ALTER TABLE "PlayerHand" DROP CONSTRAINT "PlayerHand_seatId_fkey";

-- DropForeignKey
ALTER TABLE "Seat" DROP CONSTRAINT "Seat_handId_fkey";

-- DropForeignKey
ALTER TABLE "Seat" DROP CONSTRAINT "Seat_playerId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_heroId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "_HandToSession" DROP CONSTRAINT "_HandToSession_A_fkey";

-- DropForeignKey
ALTER TABLE "_HandToSession" DROP CONSTRAINT "_HandToSession_B_fkey";

-- DropIndex
DROP INDEX "Hand_boardId_key";

-- AlterTable
ALTER TABLE "Hand" DROP CONSTRAINT "Hand_pkey",
DROP COLUMN "boardId",
DROP COLUMN "rake",
ADD COLUMN     "blinds" JSONB NOT NULL,
ADD COLUMN     "buttonSeat" INTEGER NOT NULL,
ADD COLUMN     "clubId" INTEGER NOT NULL,
ADD COLUMN     "endDateTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "gameType" TEXT NOT NULL,
ADD COLUMN     "maxSeats" INTEGER NOT NULL,
ADD COLUMN     "ownerId" TEXT NOT NULL,
ADD COLUMN     "startDateTime" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Hand_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Hand_id_seq";

-- DropTable
DROP TABLE "Action";

-- DropTable
DROP TABLE "Board";

-- DropTable
DROP TABLE "PlayerHand";

-- DropTable
DROP TABLE "Seat";

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "Table";

-- DropTable
DROP TABLE "_HandToSession";

-- DropEnum
DROP TYPE "ActionType";

-- DropEnum
DROP TYPE "Stage";

-- CreateTable
CREATE TABLE "HandEvent" (
    "id" TEXT NOT NULL,
    "handId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "eventData" JSONB NOT NULL,

    CONSTRAINT "HandEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerActionEvent" (
    "id" TEXT NOT NULL,
    "playerId" INTEGER NOT NULL,
    "actionType" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "isAllIn" BOOLEAN NOT NULL,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "PlayerActionEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BoardChangeEvent" (
    "id" TEXT NOT NULL,
    "changeType" TEXT NOT NULL,
    "newBoard" TEXT[],
    "eventId" TEXT NOT NULL,

    CONSTRAINT "BoardChangeEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UncalledBetEvent" (
    "id" TEXT NOT NULL,
    "playerId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "UncalledBetEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DealtCardsEvent" (
    "id" TEXT NOT NULL,
    "playerId" INTEGER NOT NULL,
    "cards" TEXT[],
    "eventId" TEXT NOT NULL,

    CONSTRAINT "DealtCardsEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShowCardsEvent" (
    "id" TEXT NOT NULL,
    "playerId" INTEGER NOT NULL,
    "cards" TEXT[],
    "eventId" TEXT NOT NULL,

    CONSTRAINT "ShowCardsEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PlayerHands" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "PlayerActionEvent_eventId_key" ON "PlayerActionEvent"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "BoardChangeEvent_eventId_key" ON "BoardChangeEvent"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "UncalledBetEvent_eventId_key" ON "UncalledBetEvent"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "DealtCardsEvent_eventId_key" ON "DealtCardsEvent"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "ShowCardsEvent_eventId_key" ON "ShowCardsEvent"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "_PlayerHands_AB_unique" ON "_PlayerHands"("A", "B");

-- CreateIndex
CREATE INDEX "_PlayerHands_B_index" ON "_PlayerHands"("B");

-- AddForeignKey
ALTER TABLE "Hand" ADD CONSTRAINT "Hand_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HandEvent" ADD CONSTRAINT "HandEvent_handId_fkey" FOREIGN KEY ("handId") REFERENCES "Hand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerActionEvent" ADD CONSTRAINT "PlayerActionEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "HandEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoardChangeEvent" ADD CONSTRAINT "BoardChangeEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "HandEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UncalledBetEvent" ADD CONSTRAINT "UncalledBetEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "HandEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DealtCardsEvent" ADD CONSTRAINT "DealtCardsEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "HandEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShowCardsEvent" ADD CONSTRAINT "ShowCardsEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "HandEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlayerHands" ADD CONSTRAINT "_PlayerHands_A_fkey" FOREIGN KEY ("A") REFERENCES "Hand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlayerHands" ADD CONSTRAINT "_PlayerHands_B_fkey" FOREIGN KEY ("B") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
