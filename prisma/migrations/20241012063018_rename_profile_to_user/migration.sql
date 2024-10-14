/*
  Warnings:

  - You are about to drop the column `profileId` on the `AlertSetting` table. All the data in the column will be lost.
  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `AlertSetting` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `AlertSetting` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AlertSetting" DROP CONSTRAINT "AlertSetting_profileId_fkey";

-- DropIndex
DROP INDEX "AlertSetting_profileId_key";

-- AlterTable
ALTER TABLE "AlertSetting" DROP COLUMN "profileId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Profile";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT,
    "address" TEXT NOT NULL,
    "userImageId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_address_key" ON "User"("address");

-- CreateIndex
CREATE UNIQUE INDEX "AlertSetting_userId_key" ON "AlertSetting"("userId");

-- AddForeignKey
ALTER TABLE "AlertSetting" ADD CONSTRAINT "AlertSetting_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
