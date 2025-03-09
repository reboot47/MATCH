-- AlterTable
ALTER TABLE "User" ADD COLUMN     "personalityTestCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "personalityTraits" JSONB,
ADD COLUMN     "personalityType" TEXT;
