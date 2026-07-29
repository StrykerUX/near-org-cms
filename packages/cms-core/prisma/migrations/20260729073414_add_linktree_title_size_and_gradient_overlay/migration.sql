-- CreateEnum
CREATE TYPE "LinktreeTitleSize" AS ENUM ('SM', 'MD', 'LG');

-- AlterTable
ALTER TABLE "Linktree" ADD COLUMN     "overlayColor2" TEXT DEFAULT '#000000',
ADD COLUMN     "overlayOpacity2" INTEGER DEFAULT 0,
ADD COLUMN     "titleFontSize" "LinktreeTitleSize" NOT NULL DEFAULT 'MD';
