import { Body, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PostService } from '../post.service';
import { CreatePostDTO } from '../dtos/createPost.DTO';
import { CreateReturnMessageDTO } from '../dtos/returnMessage.DTO';
import { systemMessage } from '@config/i18n/pt/systemMessage';

@Injectable()
export class CreatePostUseCase {
  constructor(private readonly postService: PostService) {}

  async createPostUseCase(createPostData: CreatePostDTO): Promise<CreateReturnMessageDTO> {
    try {
      const post = await this.postService.createPostService(createPostData);
      return post;
    } catch (error) {
      console.error(error);
      const errorMessage =
        error instanceof Error ? error.message : systemMessage.ReturnMessage.errorCreatePost;
      throw new HttpException(
        `Erro ao criar o post: ${errorMessage}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
