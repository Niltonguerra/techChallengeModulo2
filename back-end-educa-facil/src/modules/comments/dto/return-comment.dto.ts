import { ApiProperty } from '@nestjs/swagger';

export class UserSummaryDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  photo: string | null;
}

export class ListCommentDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  user: UserSummaryDTO;
}
