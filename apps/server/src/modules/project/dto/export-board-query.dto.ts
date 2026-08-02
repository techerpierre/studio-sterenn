import { TaskExportType } from "@/modules/task/task.types";
import { IsEnum, IsNotEmpty } from "class-validator";

export class ExportBoardQueryDto {
  @IsEnum(TaskExportType)
  @IsNotEmpty()
  type: TaskExportType;
}