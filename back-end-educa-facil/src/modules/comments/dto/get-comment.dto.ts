import { systemMessage } from '@config/i18n/pt/systemMessage';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class PaginateDTO {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: systemMessage.validation.isNumberString })
  offset?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: systemMessage.validation.isNumberString })
  limit?: string;
}
