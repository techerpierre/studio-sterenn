import { IsOptional, IsString, Length, Matches } from 'class-validator';

import { HEX_COLOR } from '../../common/dto/relative-order.dto';

export class CreateTaskStateDto {
  @IsString()
  @Length(1, 250)
  name: string;

  @IsString()
  @Matches(HEX_COLOR)
  color: string;

  @IsOptional()
  @IsString()
  beforeId?: string;

  @IsOptional()
  @IsString()
  afterId?: string;
}
