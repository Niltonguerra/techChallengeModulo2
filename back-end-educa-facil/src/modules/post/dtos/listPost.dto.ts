import { IsOptional, IsString, IsNumberString } from 'class-validator';
import { systemMessage } from '@config/i18n/pt/systemMessage';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ListPostDTO {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString({}, { message: systemMessage.validation.isNumberString })
  offset?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString({}, { message: systemMessage.validation.isNumberString })
  limit?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: systemMessage.validation.isString })
  search?: string;
}
