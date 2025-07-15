import { ApiProperty } from '@nestjs/swagger';

export class ReturnMessageDTO {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  message: string;
}

