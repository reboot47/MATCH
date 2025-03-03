/*
  Warnings:

  - You are about to drop the column `flagReason` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `flagTimestamp` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `flaggedBy` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `isBlockedBySystem` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `reviewTimestamp` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `reviewedBy` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "flagReason",
DROP COLUMN "flagTimestamp",
DROP COLUMN "flaggedBy",
DROP COLUMN "isBlockedBySystem",
DROP COLUMN "reviewTimestamp",
DROP COLUMN "reviewedBy",
ADD COLUMN     "isBlocked" BOOLEAN NOT NULL DEFAULT false;
