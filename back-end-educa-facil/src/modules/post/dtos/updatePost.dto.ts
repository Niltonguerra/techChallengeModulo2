import { IsString, IsOptional, Length, IsNotEmpty } from 'class-validator';
import { systemMessage } from '../../../config/i18n/pt/systemMessage';

export class UpdatePostDTO {
  @IsString({ message: systemMessage.validation.isString })
  @IsNotEmpty({ message: systemMessage.validation.isNotEmpty })
  id: string;

  @IsString({ message: systemMessage.validation.isString })
  @IsNotEmpty({ message: systemMessage.validation.isNotEmpty })
  @Length(1, 255, { message: systemMessage.validation.Length })
  title: string;

  @IsString({ message: systemMessage.validation.isString })
  @IsNotEmpty({ message: systemMessage.validation.isNotEmpty })
  description: string;

  @IsOptional()
  @IsString({ message: systemMessage.validation.isString })
  @Length(1, 100, { message: systemMessage.validation.Length })
  authorId?: string;

  @IsOptional()
  @IsString({ message: systemMessage.validation.isString })
  @Length(1, 100, { message: systemMessage.validation.Length })
  image?: string;
}
