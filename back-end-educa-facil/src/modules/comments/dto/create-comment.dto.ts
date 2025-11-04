import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateCommentDTO {
  @ApiProperty({ example: 'Esse post é muito bom!', description: 'Conteúdo do comentário' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: 'b4e8b2d1-91b0-4e45-b2f9-92a65ef8a63a', description: 'ID do post' })
  @IsUUID()
  postId: string;
}
