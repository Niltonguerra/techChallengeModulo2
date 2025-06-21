import { IsString, IsOptional, Length, IsNotEmpty } from 'class-validator';
import { validationText } from '@config/i18n/pt/validation';
export class CreatePostDTO {
  @IsString({ message: validationText.validation.isString })
  @IsNotEmpty({ message: validationText.validation.isNotEmpty })
  @Length(1, 255, { message: validationText.validation.Length })
  title: string;

  @IsString({ message: validationText.validation.IsString })
  @IsNotEmpty({ message: validationText.validation.isNotEmpty })
  description: string;

  @IsOptional()
  @IsString({ message: validationText.validation.IsString })
  @Length(1, 100, { message: validationText.validation.Length })
  author_id?: string;

  @IsOptional()
  @IsString({ message: validationText.validation.IsString })
  @Length(1, 100, { message: validationText.validation.Length })
  image?: string;
}
