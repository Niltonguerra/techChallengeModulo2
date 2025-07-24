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
  @ApiProperty()
  social_midia: Record<string, string>;
  @ApiProperty()
  notification: boolean;
}
export class FindOneUserReturnMessageDTO {
  @ApiProperty()
  statusCode: number;
  @ApiProperty()
  message: string;
  @ApiProperty()
  user?: User;
}
