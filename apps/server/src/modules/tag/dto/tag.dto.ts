import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
  Min,
} from 'class-validator';

const HEX_COLOR = /^#[0-9A-Fa-f]{6}$/;

export class CreateTagDto {
  @IsString()
  @Length(1, 50)
  name: string;

  @IsString()
  @Matches(HEX_COLOR)
  color: string;

  @IsString()
  projectId: string;
}

export class UpdateTagDto {
  @IsOptional()
  @IsString()
  @Length(1, 50)
  name?: string;

  @IsOptional()
  @IsString()
  @Matches(HEX_COLOR)
  color?: string;
}

export class ListTagsQueryDto {
  @IsString()
  projectId: string;

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
  search?: string;
}
