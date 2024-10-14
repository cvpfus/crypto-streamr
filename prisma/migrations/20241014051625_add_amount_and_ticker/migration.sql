/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `History` table. All the data in the column will be lost.
  - Added the required column `amount` to the `History` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "History" DROP COLUMN "updatedAt",
ADD COLUMN     "amount" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "ticker" TEXT NOT NULL DEFAULT 'APT';
