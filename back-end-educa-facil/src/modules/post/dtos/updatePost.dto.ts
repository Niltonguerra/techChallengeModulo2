import {
  IsString,
  IsOptional,
  Length,
  IsNotEmpty,
  ArrayNotEmpty,
  IsArray,
  IsObject,
  IsUrl,
} from 'class-validator';
import { systemMessage } from '../../../config/i18n/pt/systemMessage';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePostDTO {
  @ApiProperty()
  @IsString({ message: systemMessage.validation.isString })
  @IsNotEmpty({ message: systemMessage.validation.isNotEmpty })
  id: string;

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
}
