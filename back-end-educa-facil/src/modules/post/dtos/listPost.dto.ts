/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsOptional, IsString, IsNumberString, IsObject } from 'class-validator';
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

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: systemMessage.validation.isString })
  content?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject({ message: systemMessage.validation.isObject })
  createdAt?: {
    before?: Date | null;
    after?: Date | null;
  };

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: systemMessage.validation.isString })
  userId?: string | null;
}
