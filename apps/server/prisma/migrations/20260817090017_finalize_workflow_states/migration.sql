-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_statusId_fkey";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "status",
ALTER COLUMN "statusId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "WorkflowState"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

