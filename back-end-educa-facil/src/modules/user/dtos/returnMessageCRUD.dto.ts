import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  photo: string;
  @ApiProperty()
  email: string;
}
export class FindOneUserReturnMessageDTO {
  @ApiProperty()
  statusCode: number;
  @ApiProperty()
  message: string;
  @ApiProperty()
  user?: User;
}

export class ListUserReturnMessageDTO {
  @ApiProperty()
  statusCode: number;
  @ApiProperty()
  message: string;
  @ApiProperty({ type: [User] })
  users?: User[];
}
