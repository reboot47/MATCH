-- AlterTable
ALTER TABLE "Photo" ADD COLUMN     "thumbnailUrl" TEXT,
ADD COLUMN     "type" TEXT DEFAULT 'image';
