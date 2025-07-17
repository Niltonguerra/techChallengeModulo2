import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PostService } from '../post.service';
import { systemMessage } from '@config/i18n/pt/systemMessage';
import { ReturnListPost } from '../dtos/returnlistPost.DTO';

@Injectable()
export class GetPostUseCase {
  private readonly logger = new Logger(GetPostUseCase.name);
  constructor(private readonly postService: PostService) {}

  async getPostUseCaseById(id: string): Promise<ReturnListPost> {
    try {
      const post = await this.postService.getById(id);
      return post;
    } catch (error) {
      const message =
        error instanceof HttpException
          ? error.message
          : systemMessage.ReturnMessage.errorGetPostById;
      const status =
        error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
      this.logger.error(`${message}: ${status}`);
      throw new HttpException(`${message}: ${status}`, status);
    }
  }
}
