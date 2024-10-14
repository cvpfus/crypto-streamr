/*
  Warnings:

  - Added the required column `sender` to the `History` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `History` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "History" ADD COLUMN     "sender" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
