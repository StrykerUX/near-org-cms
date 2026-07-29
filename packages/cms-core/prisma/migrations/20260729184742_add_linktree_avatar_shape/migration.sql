-- CreateEnum
CREATE TYPE "LinktreeAvatarShape" AS ENUM ('CIRCLE', 'LOGO');

-- AlterTable
ALTER TABLE "Linktree" ADD COLUMN     "avatarShape" "LinktreeAvatarShape" NOT NULL DEFAULT 'CIRCLE';
