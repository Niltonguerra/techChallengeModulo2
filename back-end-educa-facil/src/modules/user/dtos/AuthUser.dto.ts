import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { UserStatusEnum } from '../enum/status.enum';
import { UserPermissionEnum } from '../../auth/Enum/permission.enum';
import { ApiProperty } from '@nestjs/swagger';

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
  permission: UserPermissionEnum;
  isActive: UserStatusEnum;
  photo: string;
}

export class ResponseAuthUserDTO {
  @ApiProperty()
  token: string;
  user: {
    name: string;
    email: string;
    photo: string;
    id: string;
  };
}
