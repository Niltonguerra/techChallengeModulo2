import { IsString, IsOptional, Length, IsNotEmpty } from 'class-validator';
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
  @Length(1, 255, { message: systemMessage.validation.Length })
  title: string;

  @ApiProperty()
  @IsString({ message: systemMessage.validation.isString })
  @IsNotEmpty({ message: systemMessage.validation.isNotEmpty })
  description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: systemMessage.validation.isString })
  @Length(1, 100, { message: systemMessage.validation.Length })
  authorId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: systemMessage.validation.isString })
  @Length(1, 100, { message: systemMessage.validation.Length })
  image?: string;
}
