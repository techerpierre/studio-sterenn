/*
  Warnings:

  - You are about to drop the column `position` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the `ProjectBoardOrder` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `rank` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rank` to the `TaskState` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Task_stateId_position_key";

-- DropIndex
DROP INDEX "TaskState_projectId_idx";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "position",
ADD COLUMN     "rank" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TaskState" ADD COLUMN     "rank" TEXT NOT NULL;

-- DropTable
DROP TABLE "ProjectBoardOrder";

-- CreateIndex
CREATE INDEX "Task_stateId_rank_idx" ON "Task"("stateId", "rank");

-- CreateIndex
CREATE INDEX "TaskState_projectId_rank_idx" ON "TaskState"("projectId", "rank");
