-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'PARTIAL', 'VALID', 'INVALID', 'DUPLICATE', 'ROUTED', 'ROUTED_NONE', 'DELIVERED', 'ACCEPTED', 'REJECTED', 'SOLD');

-- CreateEnum
CREATE TYPE "DeliveryChannel" AS ENUM ('WEBHOOK', 'EMAIL', 'WHATSAPP', 'SHEET');

-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('PENDING', 'SENT', 'CONFIRMED', 'FAILED');

-- CreateEnum
CREATE TYPE "DeliveryOutcome" AS ENUM ('ACCEPTED', 'REJECTED', 'SOLD');

-- CreateTable
CREATE TABLE "Vertical" (
    "id" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "fields" JSONB NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vertical_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "verticalId" TEXT NOT NULL,
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "name" TEXT,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "city" TEXT,
    "payload" JSONB NOT NULL,
    "gclid" TEXT,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "utmTerm" TEXT,
    "landingPage" TEXT,
    "abVariant" TEXT,
    "referrer" TEXT,
    "device" TEXT,
    "ip" TEXT,
    "consentAt" TIMESTAMP(3),
    "consentText" TEXT,
    "consentVersion" TEXT,
    "score" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Partner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "channels" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Partner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnerVertical" (
    "id" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "verticalId" TEXT NOT NULL,
    "cplGs" INTEGER NOT NULL,
    "exclusive" BOOLEAN NOT NULL DEFAULT false,
    "maxShared" INTEGER NOT NULL DEFAULT 3,
    "dailyCap" INTEGER,
    "monthlyCap" INTEGER,
    "priority" INTEGER NOT NULL DEFAULT 100,
    "weight" INTEGER NOT NULL DEFAULT 1,
    "filters" JSONB NOT NULL DEFAULT '{}',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PartnerVertical_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadDelivery" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "channel" "DeliveryChannel" NOT NULL,
    "status" "DeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "attempts" JSONB NOT NULL DEFAULT '[]',
    "billableGs" INTEGER NOT NULL,
    "outcome" "DeliveryOutcome",
    "outcomeNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeadDelivery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Vertical_siteId_idx" ON "Vertical"("siteId");

-- CreateIndex
CREATE INDEX "Lead_verticalId_status_idx" ON "Lead"("verticalId", "status");

-- CreateIndex
CREATE INDEX "Lead_phone_verticalId_idx" ON "Lead"("phone", "verticalId");

-- CreateIndex
CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt");

-- CreateIndex
CREATE INDEX "PartnerVertical_verticalId_active_priority_idx" ON "PartnerVertical"("verticalId", "active", "priority");

-- CreateIndex
CREATE UNIQUE INDEX "PartnerVertical_partnerId_verticalId_key" ON "PartnerVertical"("partnerId", "verticalId");

-- CreateIndex
CREATE INDEX "LeadDelivery_leadId_idx" ON "LeadDelivery"("leadId");

-- CreateIndex
CREATE INDEX "LeadDelivery_partnerId_status_idx" ON "LeadDelivery"("partnerId", "status");

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_verticalId_fkey" FOREIGN KEY ("verticalId") REFERENCES "Vertical"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnerVertical" ADD CONSTRAINT "PartnerVertical_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnerVertical" ADD CONSTRAINT "PartnerVertical_verticalId_fkey" FOREIGN KEY ("verticalId") REFERENCES "Vertical"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadDelivery" ADD CONSTRAINT "LeadDelivery_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadDelivery" ADD CONSTRAINT "LeadDelivery_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
