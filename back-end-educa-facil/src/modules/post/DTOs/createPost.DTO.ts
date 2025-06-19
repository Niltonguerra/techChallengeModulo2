import { IsString, IsOptional, Length } from 'class-validator';

export class CreatePostDTO {
  @IsString()
  @Length(1, 255)
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  author_id?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  image?: string;
}
