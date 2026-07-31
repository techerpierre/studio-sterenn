import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsOptional,
  IsString,
  Length,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

import { RelativeOrderDto } from '../../common/dto/relative-order.dto';
import { toOptionalDate } from '../../common/utils/to-optional-date';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @Length(1, 250)
  title?: string;

  @IsOptional()
  @IsString()
  @Length(0, 1024)
  content?: string;

  @IsOptional()
  @Transform(toOptionalDate)
  @IsDate()
  dueDate?: Date | null;

  @IsOptional()
  @IsString()
  ownerId?: string;

  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsString()
  stateId?: string | null;

  @IsOptional()
  @ValidateNested()
  @Type(() => RelativeOrderDto)
  order?: RelativeOrderDto;

  @IsOptional()
  @IsBoolean()
  archived?: boolean;
}
