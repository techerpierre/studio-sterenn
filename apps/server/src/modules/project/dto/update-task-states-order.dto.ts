import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class UpdateTaskStatesOrderDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  stateIds: string[];
}
