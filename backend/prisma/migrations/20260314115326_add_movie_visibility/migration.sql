/*
  Warnings:

  - Made the column `runtime` on table `Movie` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- AlterTable
ALTER TABLE "Movie" ADD COLUMN     "visibility" "Visibility" NOT NULL DEFAULT 'PRIVATE',
ALTER COLUMN "runtime" SET NOT NULL;
