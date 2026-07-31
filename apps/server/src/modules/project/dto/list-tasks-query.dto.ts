import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class ListTasksQueryDto {
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  page: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  take: number;

  @IsOptional()
  @IsString()
  stateId?: string;
}
