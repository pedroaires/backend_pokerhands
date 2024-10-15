/*
  Warnings:

  - Added the required column `boards` to the `Hand` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rake` to the `Hand` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPot` to the `Hand` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Hand" ADD COLUMN     "boards" JSONB NOT NULL,
ADD COLUMN     "heroCards" TEXT[],
ADD COLUMN     "rake" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "totalPot" DOUBLE PRECISION NOT NULL;
