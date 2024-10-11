/*
  Warnings:

  - You are about to drop the column `club_id` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the `BoardChangeEvent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DealtCardsEvent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlayerActionEvent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ShowCardsEvent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UncalledBetEvent` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `seatMapper` to the `Hand` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clubId` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BoardChangeEvent" DROP CONSTRAINT "BoardChangeEvent_eventId_fkey";

-- DropForeignKey
ALTER TABLE "DealtCardsEvent" DROP CONSTRAINT "DealtCardsEvent_eventId_fkey";

-- DropForeignKey
ALTER TABLE "PlayerActionEvent" DROP CONSTRAINT "PlayerActionEvent_eventId_fkey";

-- DropForeignKey
ALTER TABLE "ShowCardsEvent" DROP CONSTRAINT "ShowCardsEvent_eventId_fkey";

-- DropForeignKey
ALTER TABLE "UncalledBetEvent" DROP CONSTRAINT "UncalledBetEvent_eventId_fkey";

-- AlterTable
ALTER TABLE "Hand" ADD COLUMN     "seatMapper" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "club_id",
ADD COLUMN     "clubId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "BoardChangeEvent";

-- DropTable
DROP TABLE "DealtCardsEvent";

-- DropTable
DROP TABLE "PlayerActionEvent";

-- DropTable
DROP TABLE "ShowCardsEvent";

-- DropTable
DROP TABLE "UncalledBetEvent";
