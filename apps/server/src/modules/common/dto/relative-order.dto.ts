import { IsOptional, IsString } from 'class-validator';

export class RelativeOrderDto {
  @IsOptional()
  @IsString()
  beforeId?: string;

  @IsOptional()
  @IsString()
  afterId?: string;
}

export const HEX_COLOR = /^#[0-9A-Fa-f]{6}$/;
