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
import { UserPermission } from '../entities/enum/permission.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDTO {
  @ApiProperty()
  @IsString({ message: systemMessage.validation.isString })
  @IsNotEmpty({ message: systemMessage.validation.isNotEmpty })
  @Length(2, 100, { message: systemMessage.validation.Length })
  name: string;

  @ApiProperty()
  @IsString({ message: systemMessage.validation.isString })
  @IsNotEmpty({ message: systemMessage.validation.isNotEmpty })
  @Length(6, 48, { message: systemMessage.validation.Length })
  password: string;

  @ApiProperty()
  @IsString({ message: systemMessage.validation.isString })
  @IsNotEmpty({ message: systemMessage.validation.isNotEmpty })
  @IsUrl({}, { message: systemMessage.validation.isUrl })
  photo: string;

  @ApiProperty()
  @IsEmail({}, { message: systemMessage.validation.isEmail })
  @IsNotEmpty({ message: systemMessage.validation.isNotEmpty })
  email: string;

  @ApiProperty()
  @IsOptional()
  @IsObject({ message: systemMessage.validation.isObject })
  social_midia?: Record<string, string>;

  @ApiProperty()
  @IsString({ message: systemMessage.validation.isString })
  @IsNotEmpty({ message: systemMessage.validation.isNotEmpty })
  permission: UserPermission;

  @ApiProperty()
  @IsBoolean({ message: systemMessage.validation.isBoolean })
  notification: boolean;
}
