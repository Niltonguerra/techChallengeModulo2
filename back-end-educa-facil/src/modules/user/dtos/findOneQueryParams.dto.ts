import { systemMessage } from '@config/i18n/pt/systemMessage';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { searchByFieldUserEnum } from '../enum/searchByFieldUser.enum';
import { ApiProperty } from '@nestjs/swagger';

export class FindOneUserQueryParamsDTO {
  @ApiProperty()
  @IsNotEmpty({ message: systemMessage.validation.isNotEmpty })
  @IsEnum(searchByFieldUserEnum, { message: systemMessage.validation.isEnum })
  field: searchByFieldUserEnum;

  @ApiProperty()
  @IsString({ message: systemMessage.validation.isString })
  @IsNotEmpty({ message: systemMessage.validation.isNotEmpty })
  value: string;
}
