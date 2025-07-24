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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
  @IsArray({ message: systemMessage.validation.isArray })
  @ArrayNotEmpty({ message: systemMessage.validation.isNotEmpty })
  @IsString({ each: true, message: systemMessage.validation.isString })
  search_field: string[];

  @ApiProperty()
  @IsString({ message: systemMessage.validation.isString })
  @IsNotEmpty({ message: systemMessage.validation.isNotEmpty })
  scheduled_publication: string;

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

  @ApiProperty()
  @IsString({ message: systemMessage.validation.isString })
  @IsNotEmpty({ message: systemMessage.validation.isNotEmpty })
  @Length(1, 10, { message: systemMessage.validation.Length })
  style_id: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: systemMessage.validation.isString })
  @IsUrl({}, { message: systemMessage.validation.isUrl })
  @Length(1, 2048, { message: systemMessage.validation.Length })
  image?: string;

  @IsOptional()
  @IsString({ message: systemMessage.validation.isString })
  @IsUUID('4', { message: systemMessage.validation.isUUID })
  user_id: string;
}
