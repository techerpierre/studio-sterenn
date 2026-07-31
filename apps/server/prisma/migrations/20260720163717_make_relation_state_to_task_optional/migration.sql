-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_stateId_fkey";

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "stateId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "TaskState"("id") ON DELETE SET NULL ON UPDATE CASCADE;
