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
import { validationText } from '@config/i18n/pt/validation';

export class CreatePostDTO {
  @IsString({ message: validationText.validation.isString })
  @IsNotEmpty({ message: validationText.validation.isNotEmpty })
  @Length(20, 70, { message: validationText.validation.Length })
  title: string;

  @IsString({ message: validationText.validation.isString })
  @IsNotEmpty({ message: validationText.validation.isNotEmpty })
  description: string;

  @IsArray({ message: validationText.validation.isArray })
  @ArrayNotEmpty({ message: validationText.validation.isNotEmpty })
  @IsString({ each: true, message: validationText.validation.isString })
  search_field: string[];

  @IsString({ message: validationText.validation.isString })
  @IsNotEmpty({ message: validationText.validation.isNotEmpty })
  scheduled_publication: string;

  @IsOptional()
  @IsString({ message: validationText.validation.isString })
  @Length(50, 500, { message: validationText.validation.Length })
  introduction?: string;

  @IsOptional()
  @IsObject({ message: validationText.validation.isObject })
  external_link?: Record<string, string>;

  @IsArray({ message: validationText.validation.isArray })
  @ArrayNotEmpty({ message: validationText.validation.isNotEmpty })
  @IsString({ each: true, message: validationText.validation.isString })
  content_hashtags: string[];

  @IsString({ message: validationText.validation.isString })
  @IsNotEmpty({ message: validationText.validation.isNotEmpty })
  @Length(1, 10, { message: validationText.validation.Length })
  style_id: string;

  @IsOptional()
  @IsString({ message: validationText.validation.isString })
  @IsUrl({}, { message: validationText.validation.isUrl })
  @Length(1, 2048, { message: validationText.validation.Length })
  image?: string;

  @IsOptional()
  @IsUUID('4', { message: validationText.validation.isUUID })
  author_id?: string;
}
