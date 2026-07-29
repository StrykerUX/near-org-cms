-- AlterTable
ALTER TABLE "Linktree" ADD COLUMN     "avatarSize" "LinktreeTitleSize" NOT NULL DEFAULT 'SM',
ADD COLUMN     "showTitle" BOOLEAN NOT NULL DEFAULT true;
