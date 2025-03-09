-- CreateTable
CREATE TABLE "UserPrivacy" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "profileVisibility" TEXT NOT NULL DEFAULT 'matches',
    "messagingPreference" TEXT NOT NULL DEFAULT 'matches',
    "locationSharing" TEXT NOT NULL DEFAULT 'city',
    "activityVisibility" TEXT NOT NULL DEFAULT 'matches',
    "dataUsage" TEXT NOT NULL DEFAULT 'personalized',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPrivacy_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPrivacy_userId_key" ON "UserPrivacy"("userId");

-- AddForeignKey
ALTER TABLE "UserPrivacy" ADD CONSTRAINT "UserPrivacy_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
