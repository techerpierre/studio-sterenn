import { IsString, Length } from 'class-validator';

export class CreateWorkspaceProjectDto {
  @IsString()
  @Length(3, 50)
  name: string;

  @IsString()
  @Length(3, 50)
  slug: string;
}
