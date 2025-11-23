import { IsNotEmpty, IsString, Validate, MinLength } from 'class-validator';
import { Match } from './match.validator';

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @Validate(Match, ['newPassword'], {
    message: 'A confirmação da senha não confere',
  })
  confirmPassword: string;
}
