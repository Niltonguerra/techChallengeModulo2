import { IsOptional, IsString, IsNumberString } from 'class-validator';
import { systemMessage } from '@config/i18n/pt/systemMessage';

export class ListPostDTO {
  @IsOptional()
  @IsNumberString({}, { message: systemMessage.validation.isNumberString })
  offset?: number;

  @IsOptional()
  @IsNumberString({}, { message: systemMessage.validation.isNumberString })
  limit?: number;

  @IsOptional()
  @IsString({ message: systemMessage.validation.isString })
  search?: string;
}
