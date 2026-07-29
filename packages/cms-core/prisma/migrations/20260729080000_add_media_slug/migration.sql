/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Media` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Media_slug_key" ON "Media"("slug");
