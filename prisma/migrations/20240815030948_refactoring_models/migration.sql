/*
  Warnings:

  - You are about to drop the `TeamOwner` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `ownerId` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Stage" AS ENUM ('PREFLOP', 'FLOP', 'TURN', 'RIVER');

-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('ANTE', 'SMALL_BLIND', 'BIG_BLIND', 'STRADDLE', 'FOLD', 'CHECK', 'CALL', 'BET', 'RAISE', 'SHOW');

-- DropForeignKey
ALTER TABLE "TeamOwner" DROP CONSTRAINT "TeamOwner_teamId_fkey";

-- DropForeignKey
ALTER TABLE "TeamOwner" DROP CONSTRAINT "TeamOwner_userId_fkey";

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "ownerId" TEXT NOT NULL;

-- DropTable
DROP TABLE "TeamOwner";

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "heroId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "club_id" INTEGER NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Board" (
    "id" SERIAL NOT NULL,
    "cards" TEXT[],

    CONSTRAINT "Board_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hand" (
    "id" SERIAL NOT NULL,
    "rake" DOUBLE PRECISION NOT NULL,
    "boardId" INTEGER,
    "tableId" TEXT NOT NULL,

    CONSTRAINT "Hand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Action" (
    "id" SERIAL NOT NULL,
    "seatId" INTEGER NOT NULL,
    "type" "ActionType" NOT NULL,
    "amount" DOUBLE PRECISION,
    "stage" "Stage" NOT NULL,
    "handId" INTEGER NOT NULL,

    CONSTRAINT "Action_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerHand" (
    "id" SERIAL NOT NULL,
    "cards" TEXT[],
    "seatId" INTEGER NOT NULL,

    CONSTRAINT "PlayerHand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Seat" (
    "id" SERIAL NOT NULL,
    "seatNumber" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,
    "stack" DOUBLE PRECISION NOT NULL,
    "isHero" BOOLEAN NOT NULL,
    "handId" INTEGER NOT NULL,

    CONSTRAINT "Seat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Table" (
    "id" TEXT NOT NULL,
    "maxSeats" INTEGER NOT NULL,
    "blinds" DOUBLE PRECISION[],
    "ante" DOUBLE PRECISION NOT NULL,
    "club_id" INTEGER NOT NULL,

    CONSTRAINT "Table_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_HandToSession" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Hand_boardId_key" ON "Hand"("boardId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerHand_seatId_key" ON "PlayerHand"("seatId");

-- CreateIndex
CREATE UNIQUE INDEX "_HandToSession_AB_unique" ON "_HandToSession"("A", "B");

-- CreateIndex
CREATE INDEX "_HandToSession_B_index" ON "_HandToSession"("B");

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_heroId_fkey" FOREIGN KEY ("heroId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hand" ADD CONSTRAINT "Hand_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hand" ADD CONSTRAINT "Hand_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "Table"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_seatId_fkey" FOREIGN KEY ("seatId") REFERENCES "Seat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_handId_fkey" FOREIGN KEY ("handId") REFERENCES "Hand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerHand" ADD CONSTRAINT "PlayerHand_seatId_fkey" FOREIGN KEY ("seatId") REFERENCES "Seat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Seat" ADD CONSTRAINT "Seat_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Seat" ADD CONSTRAINT "Seat_handId_fkey" FOREIGN KEY ("handId") REFERENCES "Hand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HandToSession" ADD CONSTRAINT "_HandToSession_A_fkey" FOREIGN KEY ("A") REFERENCES "Hand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HandToSession" ADD CONSTRAINT "_HandToSession_B_fkey" FOREIGN KEY ("B") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;
