import { systemMessage } from '@config/i18n/pt/systemMessage';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsISO8601, IsOptional, IsString } from 'class-validator';

export class ListPostDTO {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: systemMessage.validation.isNumberString })
  offset?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: systemMessage.validation.isNumberString })
  limit?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: systemMessage.validation.isString })
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: systemMessage.validation.isString })
  content?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsISO8601()
  createdAtBefore?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsISO8601()
  createdAtAfter?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: systemMessage.validation.isString })
  userId?: string | null;
}
