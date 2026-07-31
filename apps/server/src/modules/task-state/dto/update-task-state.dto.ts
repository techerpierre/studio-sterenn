import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  Length,
  Matches,
  ValidateNested,
} from 'class-validator';

import {
  HEX_COLOR,
  RelativeOrderDto,
} from '../../common/dto/relative-order.dto';

export class UpdateTaskStateDto {
  @IsOptional()
  @IsString()
  @Length(1, 250)
  name?: string;

  @IsOptional()
  @IsString()
  @Matches(HEX_COLOR)
  color?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => RelativeOrderDto)
  order?: RelativeOrderDto;
}
