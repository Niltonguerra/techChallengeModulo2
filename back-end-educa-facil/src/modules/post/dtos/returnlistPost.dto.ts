import { ApiProperty } from '@nestjs/swagger';

export class ListPost {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  introduction: string;

  @ApiProperty()
  external_link: Record<string, string>;

  @ApiProperty()
  content_hashtags: string[];

  @ApiProperty()
  image?: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiProperty()
  user_name: string;

  @ApiProperty()
  user_email: string;

  @ApiProperty()
  user_photo?: string | null;
}
export class ReturnListPost {
  @ApiProperty()
  message: string;

  @ApiProperty()
  statusCode: number;

  @ApiProperty({
    type: ListPost,
    isArray: true,
    required: false,
    description: 'Lista de posts retornados',
  })
  ListPost?: ListPost[];

  @ApiProperty()
  total?: number;

  @ApiProperty()
  limit?: number;

  @ApiProperty()
  offset?: number;
}
