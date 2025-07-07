import { systemMessage } from '@config/i18n/pt/systemMessage';
import { IsNotEmpty, IsString } from 'class-validator';

export class FindOneUserQueryParamsDTO {
  @IsString({ message: systemMessage.validation.isString })
  @IsNotEmpty({ message: systemMessage.validation.isNotEmpty })
  field: string;

  @IsString({ message: systemMessage.validation.isString })
  @IsNotEmpty({ message: systemMessage.validation.isNotEmpty })
  value: string;
}
