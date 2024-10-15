/*
  Warnings:

  - You are about to drop the column `notificationSoundId` on the `AlertSetting` table. All the data in the column will be lost.
  - You are about to drop the column `userImageId` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AlertSetting" DROP COLUMN "notificationSoundId",
ADD COLUMN     "notificationSoundUrl" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "userImageId",
ADD COLUMN     "userImageUrl" TEXT;
