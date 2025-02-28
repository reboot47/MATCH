-- AlterTable
ALTER TABLE "User" ADD COLUMN     "childrenPlan" TEXT,
ADD COLUMN     "drinking" TEXT,
ADD COLUMN     "interests" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "languages" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "marriageIntention" TEXT,
ADD COLUMN     "smoking" TEXT;
