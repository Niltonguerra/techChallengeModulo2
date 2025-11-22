import { ApiProperty } from '@nestjs/swagger';
import { searchByFieldUserEnum } from '../enum/searchByFieldUser.enum';
export class listAuthorsParamsDTO {
  @ApiProperty()
  field?: searchByFieldUserEnum;
  @ApiProperty()
  value?: string;
}
