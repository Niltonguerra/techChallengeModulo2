import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({ example: 'string' })
  @IsString()
  @MinLength(6)
  newPassword: string;

  @ApiProperty({ example: 'string' })
  @IsString()
  @MinLength(6)
  confirmPassword: string;
}
