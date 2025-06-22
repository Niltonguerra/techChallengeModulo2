import { Body, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PostService } from '../post.service';
import { CreatePostDTO } from '../DTOs/createPost.DTO';
import { CreateReturnMessageDTO } from '../DTOs/returnMessage.DTO';

@Injectable()
export class createPostUseCase {
  constructor(private readonly postService: PostService) {}

  async createPostUseCase(createPostData: CreatePostDTO): Promise<CreateReturnMessageDTO> {
    try {
      const post = await this.postService.createPostService(createPostData);
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
