import { ApiProperty } from '@nestjs/swagger';

export class GetPostDTO {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  search_field: string[];

  @ApiProperty()
  introduction?: string;

  @ApiProperty()
  external_link: Record<string, string>;

  @ApiProperty()
  content_hashtags: string[];

  @ApiProperty()
  style_id: string;

  @ApiProperty()
  image?: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiProperty()
  user_name?: string;

  @ApiProperty()
  user_email?: string;
}
