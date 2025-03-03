-- CreateTable
CREATE TABLE "AutoResponseTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "useCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AutoResponseTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AutoResponseRule" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "conditionType" TEXT NOT NULL,
    "conditionValue" TEXT NOT NULL,
    "conditionOperator" TEXT,
    "delay" INTEGER NOT NULL DEFAULT 0,
    "probability" INTEGER NOT NULL DEFAULT 100,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "accountIds" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AutoResponseRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TemplateToRule" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TemplateToRule_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_TemplateToRule_B_index" ON "_TemplateToRule"("B");

-- AddForeignKey
ALTER TABLE "_TemplateToRule" ADD CONSTRAINT "_TemplateToRule_A_fkey" FOREIGN KEY ("A") REFERENCES "AutoResponseRule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TemplateToRule" ADD CONSTRAINT "_TemplateToRule_B_fkey" FOREIGN KEY ("B") REFERENCES "AutoResponseTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
