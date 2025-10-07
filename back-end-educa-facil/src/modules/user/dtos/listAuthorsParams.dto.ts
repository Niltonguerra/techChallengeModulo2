import { ApiProperty } from '@nestjs/swagger';
import { searchByFieldUserEnum } from '../enum/searchByFieldUser.enum';
export class listAuthorsParamsDTO {
  field?: searchByFieldUserEnum;
  @ApiProperty()
  value?: string;
}
