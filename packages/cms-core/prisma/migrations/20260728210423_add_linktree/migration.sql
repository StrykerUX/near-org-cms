-- CreateEnum
CREATE TYPE "LinktreeSectionDisplayType" AS ENUM ('COLUMN', 'ROW', 'ICONS', 'ICONS_LABEL');

-- CreateTable
CREATE TABLE "Linktree" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "displayName" TEXT,
    "bio" TEXT,
    "avatarUrl" TEXT,
    "bgColor" TEXT DEFAULT '#0A0A0A',
    "bgImage" TEXT,
    "textColor" TEXT DEFAULT '#FFFFFF',
    "buttonBgColor" TEXT DEFAULT '#FFFFFF',
    "buttonTextColor" TEXT DEFAULT '#0A0A0A',
    "seoTitle" TEXT,
    "seoDesc" TEXT,
    "ogImage" TEXT,
    "status" "Status" NOT NULL DEFAULT 'DRAFT',
    "ownerId" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Linktree_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LinktreeSection" (
    "id" TEXT NOT NULL,
    "linktreeId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayType" "LinktreeSectionDisplayType" NOT NULL DEFAULT 'COLUMN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LinktreeSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LinktreeLink" (
    "id" TEXT NOT NULL,
    "linktreeId" TEXT NOT NULL,
    "sectionId" TEXT,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "icon" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "forwardUtm" BOOLEAN NOT NULL DEFAULT false,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "clickCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LinktreeLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LinktreeClick" (
    "id" TEXT NOT NULL,
    "linkId" TEXT NOT NULL,
    "clickedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "utmTerm" TEXT,
    "utmContent" TEXT,
    "referrer" TEXT,
    "deviceType" TEXT,
    "browser" TEXT,
    "os" TEXT,
    "ipHash" TEXT,
    "isBot" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "LinktreeClick_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LinktreeUtmPreset" (
    "id" TEXT NOT NULL,
    "linkId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "utmTerm" TEXT,
    "utmContent" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LinktreeUtmPreset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Linktree_slug_key" ON "Linktree"("slug");

-- CreateIndex
CREATE INDEX "LinktreeSection_linktreeId_idx" ON "LinktreeSection"("linktreeId");

-- CreateIndex
CREATE INDEX "LinktreeLink_linktreeId_idx" ON "LinktreeLink"("linktreeId");

-- CreateIndex
CREATE INDEX "LinktreeLink_sectionId_idx" ON "LinktreeLink"("sectionId");

-- CreateIndex
CREATE INDEX "LinktreeClick_linkId_clickedAt_idx" ON "LinktreeClick"("linkId", "clickedAt");

-- CreateIndex
CREATE INDEX "LinktreeUtmPreset_linkId_idx" ON "LinktreeUtmPreset"("linkId");

-- AddForeignKey
ALTER TABLE "Linktree" ADD CONSTRAINT "Linktree_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LinktreeSection" ADD CONSTRAINT "LinktreeSection_linktreeId_fkey" FOREIGN KEY ("linktreeId") REFERENCES "Linktree"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LinktreeLink" ADD CONSTRAINT "LinktreeLink_linktreeId_fkey" FOREIGN KEY ("linktreeId") REFERENCES "Linktree"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LinktreeLink" ADD CONSTRAINT "LinktreeLink_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "LinktreeSection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LinktreeClick" ADD CONSTRAINT "LinktreeClick_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "LinktreeLink"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LinktreeUtmPreset" ADD CONSTRAINT "LinktreeUtmPreset_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "LinktreeLink"("id") ON DELETE CASCADE ON UPDATE CASCADE;
