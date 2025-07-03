import { IsOptional, IsString, IsNumberString } from 'class-validator';
import { Transform } from 'class-transformer';
import { systemMessage } from '@config/i18n/pt/systemMessage';

export class ListPostDTO {
  @IsOptional()
  @IsNumberString({}, { message: systemMessage.validation.isString })
  @Transform(({ value }) => parseInt(value))
  offset?: number = 0;

  @IsOptional()
  @IsNumberString({}, { message: systemMessage.validation.isString })
  @Transform(({ value }) => parseInt(value))
  limit?: number = 10;

  @IsOptional()
  @IsString({ message: systemMessage.validation.isString })
  search?: string;
}
