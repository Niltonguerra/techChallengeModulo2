import { ApiProperty } from '@nestjs/swagger';

export class UserPropertiesDTO {
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
  user?: UserPropertiesDTO;
}

export class ListUserReturnMessageDTO {
  @ApiProperty()
  statusCode: number;
  @ApiProperty()
  message: string;
  @ApiProperty({ type: [UserPropertiesDTO] })
  data?: UserPropertiesDTO[];
}
