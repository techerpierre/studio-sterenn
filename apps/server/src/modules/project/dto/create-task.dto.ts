import { Transform } from 'class-transformer';
import { IsDate, IsOptional, IsString, Length } from 'class-validator';

import { toOptionalDate } from '../../common/utils/to-optional-date';

export class CreateTaskDto {
  @IsString()
  @Length(1, 250)
  title: string;

  @IsOptional()
  @IsString()
  @Length(0, 4096)
  content?: string;

  @IsOptional()
  @Transform(toOptionalDate)
  @IsDate()
  dueDate?: Date | null;

  @IsString()
  stateId: string;

  @IsOptional()
  @IsString()
  beforeId?: string;

  @IsOptional()
  @IsString()
  afterId?: string;

  @IsOptional()
  @IsString()
  ownerId?: string;
}
