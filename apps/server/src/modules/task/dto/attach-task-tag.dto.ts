import { IsString } from 'class-validator';

export class AttachTaskTagDto {
  @IsString()
  tagId: string;
}
