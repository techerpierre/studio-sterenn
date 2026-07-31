import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  @Length(3, 50)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(3, 50)
  slug?: string;
}
