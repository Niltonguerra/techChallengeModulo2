import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PostService } from '../post.service';
import { systemMessage } from '@config/i18n/pt/systemMessage';
import { ReturnMessageDTO } from '@modules/common/dtos/returnMessage.dto';
import { CreatePostDTO } from '../dtos/createPost.dto';

@Injectable()
export class CreatePostUseCase {
  private readonly logger = new Logger(CreatePostUseCase.name);
  constructor(private readonly postService: PostService) {}

  async createPostUseCase(createPostData: CreatePostDTO): Promise<ReturnMessageDTO> {
    try {
      if(!createPostData) throw new HttpException(`${systemMessage.validation.isUUID}`, 404);
      const post = await this.postService.createPostService(createPostData);
      return post;
    } catch (error) {
      const message =
        error instanceof HttpException
          ? error.message
          : systemMessage.ReturnMessage.errorCreatePost;
      const status =
        error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
      this.logger.error(`${message}: ${status}`);
      throw new HttpException(`${message}: ${status}`, status);
    }
  }
}
