import { IsString, Length } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @Length(3, 50)
  name: string;

  @IsString()
  @Length(3, 50)
  slug: string;

  @IsString()
  workspaceId: string;
}
