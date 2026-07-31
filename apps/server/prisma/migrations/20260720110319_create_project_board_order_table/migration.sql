/*
  Warnings:

  - You are about to drop the column `position` on the `TaskState` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "TaskState_projectId_position_key";

-- AlterTable
ALTER TABLE "TaskState" DROP COLUMN "position";

-- CreateTable
CREATE TABLE "ProjectBoardOrder" (
    "projectId" TEXT NOT NULL,
    "stateIds" TEXT[],

    CONSTRAINT "ProjectBoardOrder_pkey" PRIMARY KEY ("projectId")
);
