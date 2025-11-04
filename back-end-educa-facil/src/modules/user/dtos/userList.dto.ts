import { ApiProperty } from '@nestjs/swagger';

export class UserListDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  permission: string;

  @ApiProperty()
  name: string;
}
