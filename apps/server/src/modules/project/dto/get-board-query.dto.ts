import { Transform } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';

function toStringArray({ value }: { value: unknown }): string[] | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  if (Array.isArray(value)) {
    return value.map(String);
  }
  return [String(value)];
}

export class GetBoardQueryDto {
  @IsOptional()
  @IsString()
  ownerId?: string;

  @IsOptional()
  @Transform(toStringArray)
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
