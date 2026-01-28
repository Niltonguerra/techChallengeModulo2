import { ApiProperty } from '@nestjs/swagger';

export class GetConversationDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  questionId: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  authorName: string;

  @ApiProperty()
  isUserTheAuthor: boolean;

  @ApiProperty()
  createdAt: string;
}
