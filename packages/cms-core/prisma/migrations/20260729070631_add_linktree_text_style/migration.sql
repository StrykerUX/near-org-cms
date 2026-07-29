-- AlterTable
ALTER TABLE "Linktree" ADD COLUMN     "buttonTextBold" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "buttonTextItalic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sectionTitleBold" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "sectionTitleItalic" BOOLEAN NOT NULL DEFAULT false;
