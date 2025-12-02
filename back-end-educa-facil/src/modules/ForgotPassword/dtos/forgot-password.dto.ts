import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'string' })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
