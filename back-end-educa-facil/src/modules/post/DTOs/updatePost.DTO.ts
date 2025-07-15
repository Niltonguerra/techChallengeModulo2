import { IsString, IsOptional, Length, IsNotEmpty } from 'class-validator';
import { validationText } from '@config/i18n/pt/validation';
export class UpdatePostDTO {
  @IsString({ message: validationText.validation.isString })
  @IsNotEmpty({ message: validationText.validation.isNotEmpty })
  id: string;


  @IsString({ message: validationText.validation.isString })
  @IsNotEmpty({ message: validationText.validation.isNotEmpty })
  @Length(1, 255, { message: validationText.validation.length })
  title: string;


  @IsString({ message: validationText.validation.isString })
  @IsNotEmpty({ message: validationText.validation.isNotEmpty })
  description: string;


  @IsOptional()
  @IsString({ message: validationText.validation.isString })
  @Length(1, 100, { message: validationText.validation.length })
  authorId?: string;


  @IsOptional()
  @IsString({ message: validationText.validation.isString })
  @Length(1, 100, { message: validationText.validation.length })
  image?: string;
}
