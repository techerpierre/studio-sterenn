import { Type } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';

export class PaginationQueryDto {
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  page: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  take: number;
}
