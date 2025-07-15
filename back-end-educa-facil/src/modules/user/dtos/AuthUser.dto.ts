import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthUserDTO {
  @ApiProperty()
  @IsEmail({}, { message: 'O email informado é inválido' })
  @IsNotEmpty({ message: 'O email não pode ser vazio' })
  email: string;

  @ApiProperty()
  @IsString({ message: 'A senha deve ser uma string' })
  @IsNotEmpty({ message: 'A senha não pode ser vazio' })
  password: string;
}

export class LoginUsuarioInternoDTO {
  id: string;
  password: string;
  name: string;
  email: string;
  permission: string;
}

export class ReturnAuthUserDTO {
  @ApiProperty()
  token: string;
}