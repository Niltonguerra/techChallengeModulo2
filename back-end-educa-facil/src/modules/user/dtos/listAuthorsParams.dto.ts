import { searchByFieldUserEnum } from '../enum/searchByFieldUser.enum';
import { ApiProperty } from '@nestjs/swagger';

export class listAuthorsParamsDTO {
  @ApiProperty()
  field: searchByFieldUserEnum;

  @ApiProperty()
  value: string;
}
