import { systemMessage } from '@config/i18n/pt/systemMessage';
import {
  IsString,
  IsEmail,
  IsBoolean,
  IsOptional,
  IsObject,
  IsNotEmpty,
  IsUrl,
  Length,
} from 'class-validator';
import { UserPermissionEnum } from '../../auth/Enum/permission.enum';

export class CreateUserDTO {
  @IsString({ message: systemMessage.validation.isString })
  @IsNotEmpty({ message: systemMessage.validation.isNotEmpty })
  @Length(2, 100, { message: systemMessage.validation.Length })
  name: string;

  @IsString({ message: systemMessage.validation.isString })
  @IsNotEmpty({ message: systemMessage.validation.isNotEmpty })
  @Length(6, 48, { message: systemMessage.validation.Length })
  password: string;

  @IsString({ message: systemMessage.validation.isString })
  @IsNotEmpty({ message: systemMessage.validation.isNotEmpty })
  @IsUrl({}, { message: systemMessage.validation.isUrl })
  photo: string;

  @IsEmail({}, { message: systemMessage.validation.isEmail })
  @IsNotEmpty({ message: systemMessage.validation.isNotEmpty })
  email: string;

  @IsOptional()
  @IsObject({ message: systemMessage.validation.isObject })
  social_midia?: Record<string, string>;

  @IsString({ message: systemMessage.validation.isString })
  @IsNotEmpty({ message: systemMessage.validation.isNotEmpty })
  permission: UserPermissionEnum;

  @IsBoolean({ message: systemMessage.validation.isBoolean })
  notification: boolean;
}
