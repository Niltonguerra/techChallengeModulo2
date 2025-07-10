import { IsOptional, IsString, IsNumberString } from 'class-validator';
import { systemMessage } from '@config/i18n/pt/systemMessage';

export class ListPostDTO {
  @IsOptional()
  @IsNumberString({}, { message: systemMessage.validation.isNumber })
  offset?: string;

  @IsOptional()
  @IsNumberString({}, { message: systemMessage.validation.isNumber })
  limit?: string;

  @IsOptional()
  @IsString({ message: systemMessage.validation.isString })
  search?: string;
}
