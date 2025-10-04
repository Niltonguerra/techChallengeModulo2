import { systemMessage } from '@config/i18n/pt/systemMessage';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsISO8601, IsOptional, IsString } from 'class-validator';

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

  /*
  @ApiPropertyOptional()
  @IsOptional()
  @IsObject({ message: systemMessage.validation.isObject })
  createdAt?: {
    before?: Date | null;
    after?: Date | null;
  };
  */

  // @ApiPropertyOptional({ type: () => DateRangeDTO })
  // @IsOptional()
  // @ValidateNested()
  // @Type(() => DateRangeDTO)
  // createdAt?: DateRangeDTO;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: systemMessage.validation.isString })
  userId?: string | null;
}
