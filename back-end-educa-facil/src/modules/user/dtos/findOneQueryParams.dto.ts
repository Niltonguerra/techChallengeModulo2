import { systemMessage } from '@config/i18n/pt/systemMessage';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { searchByFieldUserEnum } from '../enum/searchByFieldUser.enum';

export class FindOneUserQueryParamsDTO {
  @IsNotEmpty({ message: systemMessage.validation.isNotEmpty })
  @IsEnum(searchByFieldUserEnum, { message: systemMessage.validation.isEnum })
  field: searchByFieldUserEnum;

  @IsString({ message: systemMessage.validation.isString })
  @IsNotEmpty({ message: systemMessage.validation.isNotEmpty })
  value: string;
}
