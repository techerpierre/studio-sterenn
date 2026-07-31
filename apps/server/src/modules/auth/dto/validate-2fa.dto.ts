import { IsString, Length } from 'class-validator';

export class Validate2FADto {
  @IsString()
  @Length(6, 6)
  pinCode: string;
}
