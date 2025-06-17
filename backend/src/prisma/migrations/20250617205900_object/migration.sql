/*
  Warnings:

  - Added the required column `endDate` to the `ConstructionObject` table without a default value. This is not possible if the table is not empty.
  - Added the required column `foreman` to the `ConstructionObject` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `ConstructionObject` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `ConstructionObject` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ConstructionObject" ADD COLUMN     "endDate" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "foreman" VARCHAR(255) NOT NULL,
ADD COLUMN     "isArchived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "startDate" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "status" VARCHAR(50) NOT NULL;
