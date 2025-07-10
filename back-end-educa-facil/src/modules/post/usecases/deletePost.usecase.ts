import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PostService } from '../post.service';
import { DeleteReturnMessageDTO } from '../DTOs/returnMessage.DTO';
import { systemMessage } from '@config/i18n/pt/systemMessage';

@Injectable()
export class DeletePostUseCase {
  constructor(private readonly postService: PostService) {}

  async deletePostUseCase(id: string): Promise<DeleteReturnMessageDTO> {
    try {
      const post = await this.postService.deletePostService(id);
      return post;
    } catch (error) {
      console.error(error);
      const errorMessage =
        error instanceof Error ? error.message : systemMessage.ReturnMessage.errorDeletePost;
      throw new HttpException(
        `Erro ao criar o post: ${errorMessage}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}