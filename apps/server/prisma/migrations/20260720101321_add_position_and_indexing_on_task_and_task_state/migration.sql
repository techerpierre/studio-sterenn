/*
  Warnings:

  - A unique constraint covering the columns `[stateId,position]` on the table `Task` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[projectId,position]` on the table `TaskState` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `position` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `color` to the `TaskState` table without a default value. This is not possible if the table is not empty.
  - Added the required column `position` to the `TaskState` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectId` to the `TaskState` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "position" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "TaskState" ADD COLUMN     "color" VARCHAR(7) NOT NULL,
ADD COLUMN     "position" INTEGER NOT NULL,
ADD COLUMN     "projectId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Task_projectId_stateId_idx" ON "Task"("projectId", "stateId");

-- CreateIndex
CREATE UNIQUE INDEX "Task_stateId_position_key" ON "Task"("stateId", "position");

-- CreateIndex
CREATE INDEX "TaskState_projectId_idx" ON "TaskState"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "TaskState_projectId_position_key" ON "TaskState"("projectId", "position");

-- AddForeignKey
ALTER TABLE "TaskState" ADD CONSTRAINT "TaskState_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
