import { Body, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PostService } from '../post.service';
import { UpdateReturnMessageDTO } from '../DTOs/returnMessage.DTO';
import { UpdatePostDTO } from '../DTOs/updatePost.DTO';

@Injectable()
export class UpdatePostUseCase {
  constructor(private readonly postService: PostService) {}

  async UpdatePostUseCase(updatePostData: UpdatePostDTO): Promise<UpdateReturnMessageDTO> {
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
