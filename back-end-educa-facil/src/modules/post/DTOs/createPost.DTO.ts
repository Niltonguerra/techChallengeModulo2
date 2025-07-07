import {
  IsString,
  IsOptional,
  Length,
  IsNotEmpty,
  IsArray,
  IsUUID,
  IsObject,
  ArrayNotEmpty,
  IsUrl,
} from 'class-validator';
import { systemMessage } from '@config/i18n/pt/systemMessage';

export class CreatePostDTO {
  @IsString({ message: systemMessage.validation.isString })
  @IsNotEmpty({ message: systemMessage.validation.isNotEmpty })
  @Length(20, 70, { message: systemMessage.validation.Length })
  title: string;

  @IsString({ message: systemMessage.validation.isString })
  @IsNotEmpty({ message: systemMessage.validation.isNotEmpty })
  description: string;

  @IsArray({ message: systemMessage.validation.isArray })
  @ArrayNotEmpty({ message: systemMessage.validation.isNotEmpty })
  @IsString({ each: true, message: systemMessage.validation.isString })
  search_field: string[];

  @IsString({ message: systemMessage.validation.isString })
  @IsNotEmpty({ message: systemMessage.validation.isNotEmpty })
  scheduled_publication: string;

  @IsString({ message: systemMessage.validation.isString })
  @Length(50, 500, { message: systemMessage.validation.Length })
  introduction?: string;

  @IsOptional()
  @IsObject({ message: systemMessage.validation.isObject })
  external_link?: Record<string, string>;

  @IsArray({ message: systemMessage.validation.isArray })
  @ArrayNotEmpty({ message: systemMessage.validation.isNotEmpty })
  @IsString({ each: true, message: systemMessage.validation.isString })
  content_hashtags: string[];

  @IsString({ message: systemMessage.validation.isString })
  @IsNotEmpty({ message: systemMessage.validation.isNotEmpty })
  @Length(1, 10, { message: systemMessage.validation.Length })
  style_id: string;

  @IsOptional()
  @IsString({ message: systemMessage.validation.isString })
  @IsUrl({}, { message: systemMessage.validation.isUrl })
  @Length(1, 2048, { message: systemMessage.validation.Length })
  image?: string;

  @IsOptional()
  @IsUUID('4', { message: systemMessage.validation.isUUID })
  authorId?: string;
}
