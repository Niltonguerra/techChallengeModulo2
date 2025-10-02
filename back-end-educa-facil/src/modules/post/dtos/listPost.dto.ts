import { IsOptional, IsString, IsNumberString, IsISO8601, ValidateNested } from 'class-validator';
import { systemMessage } from '@config/i18n/pt/systemMessage';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class DateRangeDTO {
  @ApiPropertyOptional({ type: String, format: 'date-time' })
  @IsOptional()
  @IsISO8601()
  @Type(() => Date)
  after?: Date;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  @IsOptional()
  @IsISO8601()
  @Type(() => Date)
  before?: Date;
}

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

  /*
  @ApiPropertyOptional()
  @IsOptional()
  @IsObject({ message: systemMessage.validation.isObject })
  createdAt?: {
    before?: Date | null;
    after?: Date | null;
  };
  */

  @ApiPropertyOptional({ type: () => DateRangeDTO })
  @IsOptional()
  @ValidateNested()
  @Type(() => DateRangeDTO)
  createdAt?: DateRangeDTO;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: systemMessage.validation.isString })
  userId?: string | null;
}
