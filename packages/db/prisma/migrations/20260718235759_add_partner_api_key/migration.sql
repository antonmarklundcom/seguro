-- AlterTable
ALTER TABLE "Partner" ADD COLUMN "apiKeyHash" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Partner_apiKeyHash_key" ON "Partner"("apiKeyHash");
