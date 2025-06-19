import { IsString, IsOptional, Length, IsNotEmpty } from 'class-validator';

export class CreatePostDTO {
  @IsString({ message: 'O campo título deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo título não pode ser vazio.' })
  @Length(1, 255)
  title: string;

  @IsString({ message: 'O campo descrição deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo descrição não pode ser vazio.' })
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
