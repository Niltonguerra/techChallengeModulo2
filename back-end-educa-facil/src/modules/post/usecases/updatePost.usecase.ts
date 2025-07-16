import { Body, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PostService } from '../post.service';
import { UpdatePostDTO } from '../dtos/updatePost.DTO';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';

@Injectable()
export class UpdatePostUseCase {
  constructor(private readonly postService: PostService) {}

  async UpdatePostUseCase(updatePostData: UpdatePostDTO): Promise<ReturnMessageDTO> {
    try {
      const post = await this.postService.UpdatePostService(updatePostData);
      return post;
    } catch (error) {
      console.error(error);
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido ao criar o post.';
      throw new HttpException(
        `Erro ao criar o post: ${errorMessage}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
