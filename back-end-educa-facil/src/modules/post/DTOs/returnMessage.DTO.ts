import { IsString, Length } from 'class-validator';

export class CreateReturnMessageDTO {
  @IsString()
  @Length(1, 3)
  statusCode: string;
  @IsString()
  @Length(1, 255)
  message: string;
}
