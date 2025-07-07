import {
  IsString,
  IsEmail,
  IsBoolean,
  IsOptional,
  IsObject,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsUrl,
} from 'class-validator';

export class CreateUserDTO {
  @IsString({ message: 'O nome deve ser uma string.' })
  @IsNotEmpty({ message: 'O nome não pode estar vazio.' })
  @MinLength(2, { message: 'O nome deve ter pelo menos 2 caracteres.' })
  @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres.' })
  name: string;

  @IsString({ message: 'A senha deve ser uma string.' })
  @IsNotEmpty({ message: 'A senha não pode estar vazia.' })
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres.' })
  password: string;

  @IsString({ message: 'A foto deve ser uma string.' })
  @IsNotEmpty({ message: 'A foto não pode estar vazia.' })
  @IsUrl({}, { message: 'A foto deve ser uma URL válida.' })
  photo: string;

  @IsEmail({}, { message: 'O email deve ser um endereço válido.' })
  @IsNotEmpty({ message: 'O email não pode estar vazio.' })
  email: string;

  @IsOptional()
  @IsObject({ message: 'Social mídia deve ser um objeto.' })
  social_midia?: Record<string, string>;

  @IsString({ message: 'A permissão deve ser uma string.' })
  @IsNotEmpty({ message: 'A permissão não pode estar vazia.' })
  permission: string;

  @IsBoolean({ message: 'isActive deve ser um valor booleano.' })
  isActive: boolean;

  @IsBoolean({ message: 'notification deve ser um valor booleano.' })
  notification: boolean;
}
