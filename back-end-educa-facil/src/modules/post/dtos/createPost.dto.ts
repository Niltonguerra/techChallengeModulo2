import { systemMessage } from '@config/i18n/pt/systemMessage';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Length,
} from 'class-validator';

export class CreatePostDTO {
  @ApiProperty()
  @IsString({ message: systemMessage.validation.isString })
  @IsNotEmpty({ message: systemMessage.validation.isNotEmpty })
  @Length(20, 70, { message: systemMessage.validation.Length })
  title: string;

  @ApiProperty()
  @IsString({ message: systemMessage.validation.isString })
  @IsNotEmpty({ message: systemMessage.validation.isNotEmpty })
  description: string;

  @ApiProperty()
  @IsString({ message: systemMessage.validation.isString })
  @Length(50, 500, { message: systemMessage.validation.Length })
  introduction?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject({ message: systemMessage.validation.isObject })
  external_link?: Record<string, string>;

  @ApiProperty()
  @IsArray({ message: systemMessage.validation.isArray })
  @ArrayNotEmpty({ message: systemMessage.validation.isNotEmpty })
  @IsString({ each: true, message: systemMessage.validation.isString })
  content_hashtags: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: systemMessage.validation.isString })
  @IsUrl({}, { message: systemMessage.validation.isUrl })
  @Length(1, 2048, { message: systemMessage.validation.Length })
  image?: string;

  @IsOptional()
  @IsString({ message: systemMessage.validation.isString })
  @IsUUID('4', { message: systemMessage.validation.isUUID })
  user_id?: string; // already inserted using the JWT token
}
